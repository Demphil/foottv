// Configuration
const API_KEY = '8d831470f41e4dbe983fba512cc0c795';
const PROXY_URL = 'https://api.allorigins.win/raw?url='; // بديل أكثر موثوقية
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
        showLoading();
        const response = await fetch(`${PROXY_URL}${encodeURIComponent(`${API_BASE}/competitions`)}`, {
            headers: HEADERS
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        // مسح الخيارات القديمة
        leagueSelect.innerHTML = '<option value="all">جميع البطولات</option>';
        
        data.competitions.forEach(league => {
            if (league.plan === 'TIER_ONE') {
                const option = document.createElement('option');
                option.value = league.id;
                option.textContent = league.name;
                leagueSelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error loading leagues:', error);
        showError('تعذر تحميل قائمة البطولات');
    } finally {
        hideLoading();
    }
}

// جلب المباريات حسب الفلتر
async function fetchMatches() {
    try {
        showLoading();
        
        const leagueId = leagueSelect.value;
        const dateRange = dateSelect.value;
        
        let apiUrl = `${API_BASE}/matches`;
        
        if (leagueId !== 'all') {
            apiUrl = `${API_BASE}/competitions/${leagueId}/matches`;
        }
        
        const today = new Date();
        const dateTo = new Date();
        
        if (dateRange === '7') {
            dateTo.setDate(today.getDate() + 7);
        } else if (dateRange === '30') {
            dateTo.setDate(today.getDate() + 30);
        }
        
        apiUrl += `?dateFrom=${formatAPIDate(today)}&dateTo=${formatAPIDate(dateTo)}`;
        
        const response = await fetch(`${PROXY_URL}${encodeURIComponent(apiUrl)}`, {
            headers: HEADERS
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        renderMatches(data.matches || []);
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
                     class="league-logo"
                     onerror="this.onerror=null;this.src='assets/images/default/league.png'">
                ${match.competition.name}
            </td>
            <td>${formatMatchDate(match.utcDate)}</td>
            <td class="team-cell">
                <img src="${getTeamLogo(match.homeTeam.id)}" 
                     alt="${match.homeTeam.name}" 
                     class="team-logo"
                     onerror="this.onerror=null;this.src='assets/images/default/team.png'">
                ${match.homeTeam.name}
            </td>
            <td class="score-cell">
                ${match.score?.fullTime?.home ?? '-'} - ${match.score?.fullTime?.away ?? '-'}
            </td>
            <td class="team-cell">
                <img src="${getTeamLogo(match.awayTeam.id)}" 
                     alt="${match.awayTeam.name}"
                     class="team-logo"
                     onerror="this.onerror=null;this.src='assets/images/default/team.png'">
                ${match.awayTeam.name}
            </td>
            <td class="status-cell ${getStatusClass(match.status)}">
                ${getStatusText(match.status, match.minute)}
            </td>
        `;
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

function getStatusText(status, minute) {
    const statusText = {
        'SCHEDULED': 'مجدولة',
        'LIVE': `مباشر ${minute ? 'الدقيقة ' + minute : ''}`,
        'IN_PLAY': `مباشر ${minute ? 'الدقيقة ' + minute : ''}`,
        'PAUSED': 'مستأنفة قريباً',
        'FINISHED': 'انتهت',
        'POSTPONED': 'مؤجلة',
        'SUSPENDED': 'معلقة',
        'CANCELED': 'ملغاة'
    };
    return statusText[status] || status;
}

function getLeagueLogo(competitionCode) {
    return `https://crests.football-data.org/${competitionCode}.png`;
}

function getTeamLogo(teamId) {
    return `https://crests.football-data.org/${teamId}.png`;
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
        <tr class="error-row">
            <td colspan="6">
                <i class="fas fa-exclamation-circle"></i>
                ${message}
                <button onclick="fetchMatches()" class="retry-btn">إعادة المحاولة</button>
            </td>
        </tr>
    `;
}

// إضافة مستمعي الأحداث
fetchBtn.addEventListener('click', fetchMatches);
leagueSelect.addEventListener('change', fetchMatches);
dateSelect.addEventListener('change', fetchMatches);
