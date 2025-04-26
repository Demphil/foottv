// تأكد من تحميل DOM بالكامل أولاً
document.addEventListener('DOMContentLoaded', function() {
    // العناصر التي سيتم استخدامها
    const elements = {
        liveContainer: document.getElementById('live-matches-container'),
        refreshBtn: document.getElementById('refresh-btn'),
        lastUpdatedEl: document.getElementById('last-updated'),
        matchDetailsSection: document.getElementById('match-details'),
        nowPlayingEl: document.getElementById('now-playing')
    };

    // التحقق من وجود جميع العناصر
    if (!validateElements(elements)) return;

    // تهيئة التطبيق
    loadMatches(elements);
    setupEventListeners(elements);
});

// التحقق من وجود العناصر
function validateElements(elements) {
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Error: Element ${key} not found!`);
            return false;
        }
    }
    return true;
}

// تحميل المباريات مع التحقق من العناصر
async function loadMatches({ liveContainer, refreshBtn }) {
    try {
        // التحقق من العناصر مرة أخرى
        if (!liveContainer || !refreshBtn) {
            throw new Error('Required elements are missing');
        }

        // إظهار حالة التحميل
        refreshBtn.classList.add('rotating');
        liveContainer.innerHTML = '<div class="loading">جاري تحميل المباريات...</div>';
        
        const response = await fetch('data/matches.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        displayMatches(data.response || [], liveContainer);
        
    } catch (error) {
        console.error('Error loading matches:', error);
        if (liveContainer) {
            liveContainer.innerHTML = '<div class="error">حدث خطأ أثناء تحميل المباريات</div>';
        }
    } finally {
        if (refreshBtn) refreshBtn.classList.remove('rotating');
    }
}

// عرض المباريات مع التحقق من العناصر
function displayMatches(matches, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!matches || matches.length === 0) {
        container.innerHTML = '<div class="no-matches">لا توجد مباريات حالياً.</div>';
        return;
    }
    
    matches.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.classList.add('match-card');
        matchCard.innerHTML = `
            <div class="match-header">
                <div class="match-league">${match.league?.name || 'غير معروف'}</div>
                <div class="match-time">${new Date(match.fixture.date).toLocaleString()}</div>
            </div>
            <div class="match-teams">
                <div class="team">
                    <div class="team-info">
                        <img src="${match.teams.home.logo || 'default-team.png'}" class="team-logo" alt="${match.teams.home.name}">
                        <span class="team-name">${match.teams.home.name}</span>
                    </div>
                    <div class="match-score">${match.score.fullTime.home ?? '–'} - ${match.score.fullTime.away ?? '–'}</div>
                    <div class="team-info">
                        <img src="${match.teams.away.logo || 'default-team.png'}" class="team-logo" alt="${match.teams.away.name}">
                        <span class="team-name">${match.teams.away.name}</span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(matchCard);
    });
}

// إعداد الأحداث
function setupEventListeners({ refreshBtn }) {
    if (!refreshBtn) return;
    
    refreshBtn.addEventListener('click', () => {
        const elements = {
            liveContainer: document.getElementById('live-matches-container'),
            refreshBtn: document.getElementById('refresh-btn')
        };
        if (validateElements(elements)) {
            loadMatches(elements);
        }
    });
}
