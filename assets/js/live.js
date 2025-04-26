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
