// العناصر الأساسية
const elements = {
    liveContainer: document.getElementById('matches-tbody'),
    refreshBtn: document.getElementById('fetch-matches'),
    lastUpdatedEl: document.createElement('div'), // سيتم إضافته لاحقاً
    loadingSpinner: document.getElementById('loading-spinner'),
    noDataMessage: document.getElementById('no-data-message'),
    leagueSelect: document.getElementById('league-select'),
    dateSelect: document.getElementById('date-select')
};

// متغيرات التطبيق
let matchesData = [];
let lastUpdated = null;

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // التحقق من وجود جميع العناصر
    if (!validateElements()) return;
    
    loadMatches();
    setupEventListeners();
});

// التحقق من وجود العناصر
function validateElements() {
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`العنصر ${key} غير موجود!`);
            return false;
        }
    }
    return true;
}

// تحميل المباريات
async function loadMatches() {
    try {
        showLoadingState(true);
        
        const response = await fetch('data/matches.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        matchesData = filterMatchesByDate(data.response || []);
        
        updateLastUpdated();
        displayMatches();
        
    } catch (error) {
        console.error('Error loading matches:', error);
        showErrorMessage();
    } finally {
        showLoadingState(false);
    }
}

// عرض المباريات في الجدول
function displayMatches() {
    elements.liveContainer.innerHTML = '';
    
    if (matchesData.length === 0) {
        elements.noDataMessage.style.display = 'table-row';
        return;
    }
    
    elements.noDataMessage.style.display = 'none';
    
    matchesData.forEach(match => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${match.league?.name || 'غير معروف'}</td>
            <td>${formatDate(match.fixture.date)}</td>
            <td>
                <div class="team-cell">
                    <img src="${match.teams.home.logo || 'default-team.png'}" class="team-logo" alt="${match.teams.home.name}">
                    <span>${match.teams.home.name}</span>
                </div>
            </td>
            <td>${match.goals.home ?? '-'} - ${match.goals.away ?? '-'}</td>
            <td>
                <div class="team-cell">
                    <img src="${match.teams.away.logo || 'default-team.png'}" class="team-logo" alt="${match.teams.away.name}">
                    <span>${match.teams.away.name}</span>
                </div>
            </td>
            <td>
                <span class="status ${getStatusClass(match.fixture.status.short)}">
                    ${match.fixture.status.long}
                </span>
            </td>
        `;
        
        // إضافة حدث النقر لتفاصيل المباراة
        row.addEventListener('click', () => showMatchDetails(match));
        elements.liveContainer.appendChild(row);
    });
}

// إعداد أحداث التفاعل
function setupEventListeners() {
    elements.refreshBtn.addEventListener('click', loadMatches);
    
    // فلترة حسب البطولة
    elements.leagueSelect.addEventListener('change', function() {
        if (this.value === 'all') {
            displayMatches();
        } else {
            const filtered = matchesData.filter(match => 
                match.league.id == this.value
            );
            displayFilteredMatches(filtered);
        }
    });
}

// ===== دوال مساعدة ===== //
function showLoadingState(show) {
    elements.loadingSpinner.style.display = show ? 'flex' : 'none';
    elements.refreshBtn.disabled = show;
}

function showErrorMessage() {
    elements.noDataMessage.style.display = 'table-row';
    elements.noDataMessage.innerHTML = '<td colspan="6">حدث خطأ أثناء تحميل البيانات</td>';
}

function updateLastUpdated() {
    lastUpdated = new Date().toLocaleString('ar-EG');
    // يمكنك إضافة عنصر لعرض هذا التاريخ في واجهة المستخدم
}

function formatDate(dateString) {
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
    const statusMap = {
        'NS': 'not-started',
        'LIVE': 'live',
        'HT': 'live',
        'FT': 'finished',
        'PST': 'postponed'
    };
    return statusMap[status] || '';
}

// عرض تفاصيل المباراة (مثال مبسط)
function showMatchDetails(match) {
    // يمكنك تنفيذ هذا حسب احتياجاتك
    console.log('Match details:', match);
    alert(`تفاصيل المباراة: ${match.teams.home.name} vs ${match.teams.away.name}`);
}
function filterMatchesByDate(matches) {
  const today = new Date('2025-04-26'); // تاريخ اليوم
  return matches.filter(match => {
    const matchDate = new Date(match.fixture.date);
    return matchDate >= today;
  });
}
