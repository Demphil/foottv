/**
 * ملف script.js النهائي
 * يحتوي على:
 * - عرض المباريات المباشرة
 * - تحديث تلقائي للذاكرة (في المتصفحات المدعومة)
 * - جلب بيانات من API (مع وجود بيانات افتراضية عند الخطأ)
 * - مؤقت لتحديث البيانات
 */

// بيانات المباريات الافتراضية
const defaultMatches = [
  {
    id: 1,
    home_team: "النصر",
    away_team: "الهلال",
    league: "الدوري السعودي",
    time: "20:00",
    status: "live",
    score: "2-1"
  },
  {
    id: 2,
    home_team: "برشلونة",
    away_team: "ريال مدريد",
    league: "لاليغا",
    time: "22:45",
    status: "upcoming"
  }
];

// عناصر DOM
const matchesContainer = document.getElementById('matches-container');
const memoryElement = document.getElementById('memory');

// دالة جلب البيانات من API
async function fetchMatches() {
  try {
    const API_URL = 'https://api.football-data.org/v4/matches'; // استبدل برابط API الحقيقي
    const response = await fetch(API_URL);
    
    if (!response.ok) throw new Error('فشل جلب البيانات');
    
    const data = await response.json();
    return data.matches || defaultMatches;
  } catch (error) {
    console.error('Error fetching matches:', error);
    return defaultMatches;
  }
}

// دالة عرض المباريات
function renderMatches(matches) {
  matchesContainer.innerHTML = '';
  
  matches.forEach(match => {
    const matchElement = document.createElement('div');
    matchElement.className = match-card ${match.status};
    matchElement.innerHTML = 
      <div class="match-header">
        <span class="league">${match.league}</span>
        ${match.status === 'live' ? 
          '<span class="live-badge">مباشر</span>' : 
          <span class="time">${match.time}</span>}
      </div>
      <div class="teams">
        <div class="team home">
          <span class="name">${match.home_team}</span>
          ${match.status === 'live' ? 
            <span class="score">${match.score?.split('-')[0] || '0'}</span> : ''}
        </div>
        <span class="vs">vs</span>
        <div class="team away">
          <span class="name">${match.away_team}</span>
          ${match.status === 'live' ? 
            <span class="score">${match.score?.split('-')[1] || '0'}</span> : ''}
        </div>
      </div>
      ${match.status === 'live' ? '<div class="live-indicator"></div>' : ''}
    ;
    matchesContainer.appendChild(matchElement);
  });
}

// دالة مراقبة الذاكرة (تعمل في Chrome فقط)
function updateMemoryUsage() {
  if (window.performance?.memory) {
    const usedMB = (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1);
    memoryElement.textContent = ${usedMB} MB;
  } else {
    memoryElement.textContent = "49.5 MB (افتراضي)";
  }
}

// دالة التحديث التلقائي
async function updateData() {
  try {
    const matches = await fetchMatches();
    renderMatches(matches);
    updateMemoryUsage();
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
  // التحميل الأولي
  updateData();
  
  // تحديث البيانات كل دقيقة (60000 مللي ثانية)
  const UPDATE_INTERVAL = 60000;
  setInterval(updateData, UPDATE_INTERVAL);
  
  // تحديث الذاكرة كل 5 ثوان (إذا كانت المدعومة)
  if (window.performance?.memory) {
    updateMemoryUsage();
    setInterval(updateMemoryUsage, 5000);
  }
});

// لمتصفحات غير Chrome (تقدير استخدام الذاكرة)
function estimateMemoryUsage() {
  try {
    const start = performance.now();
    const testArray = [];
    for (let i = 0; i < 100000; i++) {
      testArray.push(new Object());
    }
    const duration = performance.now() - start;
    return (duration / 100).toFixed(1) + " MB (تقديري)";
  } catch {
    return "N/A";
  }
}

// تصدير الدوال للاختبار (اختياري)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchMatches,
    renderMatches,
    updateMemoryUsage
  };
}
document.querySelector('.mobile-menu-btn').addEventListener('click', () => {
    document.querySelector('.main-nav').classList.toggle('active');
});
