// Football Data API Configuration
const API_KEY = '8d831470f41e4dbe983fba512cc0c795'; // استبدلها بمفتاحك
const API_BASE = 'https://api.football-data.org/v4';
const HEADERS = {
    'X-Auth-Token': API_KEY,
    'Content-Type': 'application/json'
};

// عناصر DOM
const leagueSelect = document.getElementById('league-select');
const dateSelect = document.getElementById('date-select');
const fetchBtn = document.getElementById('fetch-matches');
const matchesTbody = document.getElementById('matches-tbody');
const loadingSpinner = document.getElementById('loading-spinner');

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadLeagues();
    fetchMatches();
});

// جلب قائمة البطولات
async function loadLeagues() {
    try {
        const response = await fetch(`${API_BASE}/competitions`, {
            headers: HEADERS
        });
        const data = await response.json();
        
        data.competitions.forEach(league => {
            if (league.plan === 'TIER_ONE') { // تصفية البطولات المهمة فقط
                const option = document.createElement('option');
                option.value = league.id;
                option.textContent = league.name;
                leagueSelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error loading leagues:', error);
        showError('تعذر تحميل قائمة البطولات');
    }
}

// جلب المباريات حسب الفلتر
async function fetchMatches() {
    try {
        showLoading();
        
        const leagueId = leagueSelect.value;
        const dateRange = dateSelect.value;
        
        let apiUrl = `${API_BASE}/matches`;
        
        // إضافة فلتر البطولة
        if (leagueId !== 'all') {
            apiUrl = `${API_BASE}/competitions/${leagueId}/matches`;
        }
        
        // إضافة فلتر التاريخ
        const today = new Date();
        const dateTo = new Date();
        
        if (dateRange === '7') {
            dateTo.setDate(today.getDate() + 7);
        } else if (dateRange === '30') {
            dateTo.setDate(today.getDate() + 30);
        }
        
        apiUrl += `?dateFrom=${formatAPIDate(today)}&dateTo=${formatAPIDate(dateTo)}`;
        
        const response = await fetch(apiUrl, {
            headers: HEADERS
        });
        const data = await response.json();
        
        renderMatches(data.matches);
    } catch (error) {
        console.error('Error fetching matches:', error);
        showError('تعذر تحميل المباريات. يرجى المحاولة لاحقاً');
    } finally {
        hideLoading();
    }
}

// عرض المباريات في الجدول
function renderMatches(matches) {
    matchesTbody.innerHTML = '';
    
    if (!matches || matches.length === 0) {
      matchesTbody.innerHTML = `
    <tr class="no-matches">
        <td colspan="6">لا توجد مباريات متاحة</td>
    </tr>
`;
        return;
    }
    
    matches.forEach(match => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${getLeagueLogo(match.competition.code)}" 
                     alt="${match.competition.name}" 
                     class="league-logo">
                ${match.competition.name}
            </td>
            <td>${formatMatchDate(match.utcDate)}</td>
            <td class="team-cell">
                <img src="${getTeamLogo(match.homeTeam.id)}" 
                     alt="${match.homeTeam.name}" 
                     class="team-logo">
                ${match.homeTeam.name}
            </td>
            <td class="score-cell">
                ${match.score.fullTime.home ?? '-'} - ${match.score.fullTime.away ?? '-'}
            </td>
            <td class="team-cell">
                <img src="${getTeamLogo(match.awayTeam.id)}" 
                     alt="${match.awayTeam.name}"
                     class="team-logo">
                ${match.awayTeam.name}
            </td>
            <td class="status-cell ${getStatusClass(match.status)}">
                ${getStatusText(match.status)}
            </td>
        ;
        matchesTbody.appendChild(row);
    });
}

// وظائف مساعدة
function formatAPIDate(date) {
    return date.toISOString().split('T')[0];
}

function formatMatchDate(dateString) {
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('ar-EG', options);
}

function getStatusClass(status) {
    const statusMap = {
        'SCHEDULED': 'scheduled',
        'LIVE': 'live',
        'IN_PLAY': 'live',
        'PAUSED': 'live',
        'FINISHED': 'finished',
        'POSTPONED': 'postponed',
        'SUSPENDED': 'postponed',
        'CANCELED': 'canceled'
    };
    return statusMap[status] || '';
}

function getStatusText(status) {
    const statusText = {
        'SCHEDULED': 'مجدولة',
        'LIVE': 'مباشر',
        'IN_PLAY': 'مباشر',
        'PAUSED': 'مستأنفة قريباً',
        'FINISHED': 'انتهت',
        'POSTPONED': 'مؤجلة',
        'SUSPENDED': 'معلقة',
        'CANCELED': 'ملغاة'
    };
    return statusText[status] || status;
}

function getLeagueLogo(competitionCode) {
    // يمكنك استبدال هذا بروابط صور البطولات الخاصة بك
    return assets/images/leagues/${competitionCode}.png;
}

function getTeamLogo(teamId) {
    // يمكنك استخدام Football Data API للحصول على شعارات الفرق
    // أو استخدام صور محلية
    return assets/images/teams/${teamId}.png;
}

function showLoading() {
    loadingSpinner.style.display = 'flex';
    matchesTbody.style.opacity = '0.5';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
    matchesTbody.style.opacity = '1';
}

function showError(message) {
    matchesTbody.innerHTML = `
        <tr class="error-row" style="background-color: #ffe6e6; text-align: center;">
            <td colspan="6" style="padding: 20px; color: #d9534f; font-size: 16px;">
                <i class="fas fa-exclamation-circle" style="margin-right: 10px; font-size: 18px;"></i>
                ${message}
                <br>
                <button onclick="fetchMatches()" style="
                    margin-top: 10px;
                    padding: 8px 16px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;">
                    إعادة المحاولة
                </button>
            </td>
        </tr>
    `;
}


// إضافة مستمعي الأحداث
fetchBtn.addEventListener('click', fetchMatches);
leagueSelect.addEventListener('change', fetchMatches);
dateSelect.addEventListener('change', fetchMatches);
    import { getLeagueEmblem } from '../data/leagues.js';

// عند عرض المباريات
function renderMatches(matches) {
  matches.forEach(match => {
    const leagueEmblem = getLeagueEmblem(match.competition.code);
    // استخدام leagueEmblem في عرض البطولة
  });
}
    // في حالة فشل API
async function fetchMatches() {
  try {
    const response = await fetch(API_URL);
    return await response.json();
  } catch (error) {
    console.error('Using default matches data');
    const defaultData = await fetch('data/matches-default.json');
    return await defaultData.json();
  }
}
