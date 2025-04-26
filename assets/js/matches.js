// Configuration
const API_KEY = '795f377634msh4be097ebbb6dce3p1bf238jsn583f1b9cf438'; // استبدل بمفتاحك الفعلي من RapidAPI
const API_BASE = 'https://rapidapi.com'; // يمكن تحديث هذا إذا كنت تستخدم RapidAPI بشكل مباشر
const PROXY_URL = 'https://corsproxy.io/?'; // بديل موثوق لخدمة الـ Proxy

// عناصر DOM
const leagueSelect = document.getElementById('league-select');
const dateSelect = document.getElementById('date-select');
const fetchBtn = document.getElementById('fetch-matches');
const matchesTbody = document.getElementById('matches-tbody');
const loadingSpinner = document.getElementById('loading-spinner');
const errorContainer = document.getElementById('error-container');

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadLeagues();
    fetchMatches();
});

// جلب قائمة البطولات
async function loadLeagues() {
    try {
        showLoading();
        const apiUrl = 'https://rapidapi.com'; // رابط RapidAPI لجلب البطولات
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'api.rapidapi.com',  // تغيير هذا وفقاً لخدمة الـ RapidAPI
                'X-RapidAPI-Key': API_KEY,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // مسح الخيارات القديمة
        leagueSelect.innerHTML = '<option value="all">جميع البطولات</option>';

        // تصفية البطولات المهمة فقط
        data.competitions
            .filter(league => league.plan === 'TIER_ONE')
            .forEach(league => {
                const option = document.createElement('option');
                option.value = league.id;
                option.textContent = league.name;
                leagueSelect.appendChild(option);
            });
    } catch (error) {
        console.error('Error loading leagues:', error);
        showError('تعذر تحميل قائمة البطولات. جرب تحديث الصفحة');
    } finally {
        hideLoading();
    }
}

// جلب المباريات حسب الفلتر
async function fetchMatches() {
    try {
        showLoading();
        clearErrors();

        const leagueId = leagueSelect.value;
        const dateRange = dateSelect.value;

        // بناء رابط API حسب الفلتر
        let apiUrl = `https://api.rapidapi.com/matches`;
        if (leagueId !== 'all') {
            apiUrl = `https://api.rapidapi.com/competitions/${leagueId}/matches`;
        }

        // إضافة فلتر التاريخ
        const today = new Date();
        const dateTo = new Date();
        dateTo.setDate(today.getDate() + (dateRange === '30' ? 30 : 7));
        apiUrl += `?dateFrom=${formatAPIDate(today)}&dateTo=${formatAPIDate(dateTo)}`;

        // إرسال الطلب مع Proxy
        const response = await fetch(`${PROXY_URL}${encodeURIComponent(apiUrl)}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'api.rapidapi.com', // تغيير حسب الخدمة
                'X-RapidAPI-Key': API_KEY,
                'Accept': 'application/json'
            }
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

    if (matches.length === 0) {
        matchesTbody.innerHTML = `
            <tr class="no-matches">
                <td colspan="6">لا توجد مباريات متاحة حاليًا</td>
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
            <td class="score-cell ${getScoreClass(match.status)}">
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

// ============= وظائف مساعدة =============

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

function getScoreClass(status) {
    return status === 'LIVE' || status === 'IN_PLAY' ? 'live-score' : '';
}

function getStatusText(status, minute) {
    const statusText = {
        'SCHEDULED': 'مجدولة',
        'LIVE': `مباشر ${minute ? '⚽ ' + minute + "'" : ''}`,
        'IN_PLAY': `مباشر ${minute ? '⚽ ' + minute + "'" : ''}`,
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
    loadingSpinner.style.display = 'block';
    matchesTbody.style.opacity = '0.5';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
    matchesTbody.style.opacity = '1';
}

function showError(message) {
    errorContainer.innerHTML = `
        <div class="alert alert-error">
            <i class="fas fa-exclamation-circle"></i>
            ${message}
            <button onclick="retryFetch()" class="retry-btn">
                <i class="fas fa-sync-alt"></i> إعادة المحاولة
            </button>
        </div>
    `;
    errorContainer.style.display = 'block';
}

function clearErrors() {
    errorContainer.style.display = 'none';
}

function retryFetch() {
    clearErrors();
    fetchMatches();
}

// ============= مستمعي الأحداث =============
fetchBtn.addEventListener('click', fetchMatches);
leagueSelect.addEventListener('change', fetchMatches);
dateSelect.addEventListener('change', fetchMatches);

// تحديث تلقائي كل دقيقة للمباريات الحية
setInterval(() => {
    const hasLiveMatches = document.querySelector('.status-cell.live');
    if (hasLiveMatches) fetchMatches();
}, 60000);
