document.addEventListener('DOMContentLoaded', function() {
    // تعريف العناصر مع التحقق من وجودها
   const elements = {
    tableBody: document.getElementById('matches-tbody'),
    loadingSpinner: document.getElementById('loading-spinner'),
    noDataMessage: document.getElementById('no-data-message'),
    refreshBtn: document.getElementById('refresh-btn'),
    leagueSelect: document.getElementById('league-select'),
    dateSelect: document.getElementById('date-select'),
    lastUpdated: document.getElementById('last-updated'),
    nowPlaying: document.getElementById('now-playing'),
    matchDetails: document.getElementById('match-details'),
    closeDetailsBtn: document.getElementById('close-details'),
    matchDetailsContent: document.getElementById('match-details-content')
};

    // التحقق من وجود العناصر الأساسية
    if (!elements.tableBody || !elements.loadingSpinner || !elements.noDataMessage) {
        console.error('عناصر DOM الأساسية غير موجودة!');
        return;
    }

    // تهيئة التطبيق
    initEventListeners(elements);
    loadMatchesData(elements);
});

async function loadMatchesData({ tableBody, loadingSpinner, noDataMessage }) {
    try {
        showLoading(true, loadingSpinner, noDataMessage);
        
        const response = await fetch('data/matches.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        renderMatches(data.response || [], tableBody, noDataMessage);
        
    } catch (error) {
        console.error('فشل تحميل البيانات:', error);
        showError(noDataMessage, 'حدث خطأ أثناء جلب بيانات المباريات');
    } finally {
        showLoading(false, loadingSpinner);
    }
}

function renderMatches(matches, container, noDataMessage) {
    container.innerHTML = '';
    
    if (!matches || matches.length === 0) {
        noDataMessage.style.display = 'table-row';
        return;
    }
    
    noDataMessage.style.display = 'none';
    
    matches.forEach(match => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${match.league?.name || 'غير معروف'}</td>
            <td>${formatMatchDate(match.fixture.date)}</td>
            <td class="team-cell">
                <img src="${match.teams.home.logo || 'default-team.png'}" 
                     alt="${match.teams.home.name}" 
                     class="team-logo">
                <span>${match.teams.home.name}</span>
            </td>
            <td class="score">${match.goals.home ?? '0'} - ${match.goals.away ?? '0'}</td>
            <td class="team-cell">
                <img src="${match.teams.away.logo || 'default-team.png'}" 
                     alt="${match.teams.away.name}" 
                     class="team-logo">
                <span>${match.teams.away.name}</span>
            </td>
            <td class="status ${getStatusClass(match.fixture.status.short)}">
                ${match.fixture.status.long}
            </td>
        `;
        container.appendChild(row);
    });
}

// ============= دوال مساعدة ============= //
function initEventListeners({ refreshBtn, leagueSelect, dateSelect }) {
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const elements = {
                tableBody: document.getElementById('matches-tbody'),
                loadingSpinner: document.getElementById('loading-spinner'),
                noDataMessage: document.getElementById('no-data-message')
            };
            loadMatchesData(elements);
        });
    }
    
    if (leagueSelect) {
        leagueSelect.addEventListener('change', filterByLeague);
    }
    
    if (dateSelect) {
        dateSelect.addEventListener('change', filterByDate);
    }
}

function showLoading(show, spinner, noDataMsg) {
    if (spinner) spinner.style.display = show ? 'flex' : 'none';
    if (noDataMsg && show) noDataMsg.style.display = 'none';
}

function showError(element, message) {
    if (element) {
        element.innerHTML = `<td colspan="6">${message}</td>`;
        element.style.display = 'table-row';
    }
}

function formatMatchDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('ar-EG', options);
}

function getStatusClass(status) {
    const statusClasses = {
        'NS': 'not-started',
        'LIVE': 'in-progress',
        'HT': 'in-progress',
        'FT': 'finished',
        'PST': 'postponed'
    };
    return statusClasses[status] || '';
}

// فلترة المباريات
function filterByLeague() {
    const leagueId = this.value;
    // تطبيق الفلترة حسب البطولة
}

function filterByDate() {
    const dateRange = this.value;
    // تطبيق الفلترة حسب التاريخ
}
// دالة جلب وعرض المباريات من RapidAPI
function loadMatches() {
    fetch('https://https://rapidapi.com', {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            'x-rapidapi-key': 'your-api-key-here'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Log the raw data
        
        // التحقق من هيكل البيانات
        if (!data.response || !Array.isArray(data.response)) {
            throw new Error('Invalid data structure from API');
        }

        const today = new Date().toLocaleDateString();
        const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString();

        const todayMatches = data.response.filter(match => 
            match.fixture && 
            match.fixture.date && 
            new Date(match.fixture.date).toLocaleDateString() === today
        );

        const tomorrowMatches = data.response.filter(match => 
            match.fixture && 
            match.fixture.date && 
            new Date(match.fixture.date).toLocaleDateString() === tomorrow
        );

        // تحديث التاريخ
        document.getElementById('today-date').textContent = new Date().toLocaleDateString('ar-EG');
        document.getElementById('tomorrow-date').textContent = new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('ar-EG');

        // عرض مباريات اليوم
        const todayContainer = document.getElementById('today-matches-container');
        todayContainer.innerHTML = '';
        todayMatches.forEach(match => {
            todayContainer.innerHTML += `
                <div class="match-card ${match.fixture.status.short === 'LIVE' ? 'live' : ''}">
                    <div class="teams">
                        <span class="home-team">${match.teams.home.name}</span> vs 
                        <span class="away-team">${match.teams.away.name}</span>
                    </div>
                    <div class="match-info">
                        <span class="league">${match.league.name}</span>
                        <span class="status">${match.fixture.status.long}</span>
                    </div>
                </div>
            `;
        });

        // عرض مباريات الغد
        const tomorrowContainer = document.getElementById('tomorrow-matches-container');
        tomorrowContainer.innerHTML = '';
        tomorrowMatches.forEach(match => {
            tomorrowContainer.innerHTML += `
                <div class="match-card ${match.fixture.status.short === 'LIVE' ? 'live' : ''}">
                    <div class="teams">
                        <span class="home-team">${match.teams.home.name}</span> vs 
                        <span class="away-team">${match.teams.away.name}</span>
                    </div>
                    <div class="match-info">
                        <span class="league">${match.league.name}</span>
                        <span class="status">${match.fixture.status.long}</span>
                    </div>
                </div>
            `;
        });
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('error-container').style.display = 'block';
        document.getElementById('error-container').innerHTML = 'حدث خطأ في تحميل البيانات.';
    });
}

// استدعاء دالة جلب المباريات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadMatches);
