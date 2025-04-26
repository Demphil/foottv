// العناصر الأساسية
const liveContainer = document.getElementById('live-matches-container');
const refreshBtn = document.getElementById('refresh-btn');
const lastUpdatedEl = document.getElementById('last-updated');
const matchDetailsSection = document.getElementById('match-details');
const nowPlayingEl = document.getElementById('now-playing');

// متغيرات التطبيق
let matchesData = [];
let currentTab = 'all';
let autoRefreshInterval;
let lastUpdated = null;

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadMatches();
    setupEventListeners();
    startAutoRefresh();
});

// تحميل المباريات
async function loadMatches() {
    try {
        // إظهار حالة التحميل
        refreshBtn.classList.add('rotating');
        liveContainer.innerHTML = '<div class="loading">جاري تحميل المباريات...</div>';
        
        // جلب البيانات من ملف matches.json أو matches-default.json
        const response = await fetch('matches.json'); // هنا يمكن أن تضيف الرابط المناسب للمباريات
        const data = await response.json();
        
        // تحديث وقت آخر تحميل
        lastUpdated = new Date().toLocaleString();
        lastUpdatedEl.textContent = `آخر تحديث: ${lastUpdated}`;

        // إخفاء حالة التحميل
        refreshBtn.classList.remove('rotating');
        liveContainer.innerHTML = '';

        // معالجة البيانات لعرض المباريات
        if (data.matches && data.matches.length > 0) {
            matchesData = data.matches;
            displayMatches();
        } else {
            liveContainer.innerHTML = '<div class="no-matches">لا توجد مباريات حالياً.</div>';
        }
    } catch (error) {
        console.error('Error loading matches:', error);
        liveContainer.innerHTML = '<div class="error">حدث خطأ أثناء تحميل المباريات.</div>';
    }
}

// عرض المباريات على الصفحة
function displayMatches() {
    liveContainer.innerHTML = ''; // إعادة تعيين المحتوى الحالي

    matchesData.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.classList.add('match-card');
        
        matchCard.innerHTML = `
            <div class="match-header">
                <div class="match-league">${match.competition.name}</div>
                <div class="match-time">${new Date(match.utcDate).toLocaleString()}</div>
            </div>
            <div class="match-teams">
                <div class="team">
                    <div class="team-info">
                        <img src="${match.homeTeam.crest}" class="team-logo" alt="${match.homeTeam.name}">
                        <span class="team-name">${match.homeTeam.name}</span>
                    </div>
                    <div class="match-score">${match.score.fullTime.home ?? '–'} - ${match.score.fullTime.away ?? '–'}</div>
                    <div class="team-info">
                        <img src="${match.awayTeam.crest}" class="team-logo" alt="${match.awayTeam.name}">
                        <span class="team-name">${match.awayTeam.name}</span>
                    </div>
                </div>
            </div>
        `;
        
        // إضافة بطاقة المباراة إلى الحاوية
        liveContainer.appendChild(matchCard);
    });
}

// إعداد أحداث التفاعل مع الصفحة
function setupEventListeners() {
    // إعادة تحميل المباريات عند النقر على زر التحديث
    refreshBtn.addEventListener('click', () => {
        loadMatches();
    });

    // تحديث تلقائي
    document.getElementById('auto-refresh-toggle').addEventListener('change', (e) => {
        if (e.target.checked) {
            startAutoRefresh();
        } else {
            clearInterval(autoRefreshInterval);
        }
    });
}

// بدء التحديث التلقائي للمباريات
function startAutoRefresh() {
    autoRefreshInterval = setInterval(loadMatches, 60000); // التحديث كل دقيقة
}

// عرض تفاصيل المباراة عند النقر عليها
function showMatchDetails(matchId) {
    const match = matchesData.find(m => m.id === matchId);
    
    if (match) {
        matchDetailsSection.innerHTML = `
            <div class="details-header">
                <h2>تفاصيل المباراة</h2>
                <button class="close-details" onclick="closeMatchDetails()">×</button>
            </div>
            <div class="match-details-info">
                <div class="teams">
                    <div class="team-info">
                        <img src="${match.homeTeam.crest}" class="team-logo" alt="${match.homeTeam.name}">
                        <span class="team-name">${match.homeTeam.name}</span>
                    </div>
                    <div class="match-score">${match.score.fullTime.home ?? '–'} - ${match.score.fullTime.away ?? '–'}</div>
                    <div class="team-info">
                        <img src="${match.awayTeam.crest}" class="team-logo" alt="${match.awayTeam.name}">
                        <span class="team-name">${match.awayTeam.name}</span>
                    </div>
                </div>
                <div class="match-status">${match.status}</div>
            </div>
        `;
        matchDetailsSection.classList.add('active');
    }
}

// إغلاق تفاصيل المباراة
function closeMatchDetails() {
    matchDetailsSection.classList.remove('active');
}
