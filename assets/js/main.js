// متغيرات عامة
let matchesData = [];
const MATCHES_DATA_URL = 'data/matches.json';

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
  loadMatchesData();
  setAutoRefresh();
});

// تحميل بيانات المباريات
async function loadMatchesData() {
  try {
    const response = await fetch(${MATCHES_DATA_URL}?t=${Date.now()});
    const data = await response.json();
    
    // التحقق من صحة التواريخ
    data.matches = validateDates(data.matches);
    
    matchesData = data.matches;
    updateUI();
    updateLastUpdated(data.last_updated);
  } catch (error) {
    console.error('Error loading matches data:', error);
    showError('تعذر تحميل بيانات المباريات. يرجى المحاولة لاحقاً.');
  }
}
    // تصفية المباريات القديمة (أقدم من يومين)
    const currentDate = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(currentDate.getDate() - 2);
    
    data.matches = data.matches.filter(match => {
      const matchDate = new Date(match.date);
      return matchDate >= twoDaysAgo;
    });
    
    matchesData = data.matches;
    updateUI();
    updateLastUpdated(data.last_updated);
  } catch (error) {
    console.error('Error loading matches data:', error);
    showError('تعذر تحميل بيانات المباريات. يرجى المحاولة لاحقاً.');
  }
}
// تحديث واجهة المستخدم
function updateUI() {
  updateTodayMatches();
  updateTomorrowMatches();
  updateHighlights();
}

// تحديث مباريات اليوم
function updateTodayMatches() {
  const today = formatDate(new Date());
  const todayMatches = matchesData.filter(match => match.date === today);
  renderMatches(todayMatches, 'today-matches-container', 'اليوم');
}

function updateTomorrowMatches() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = formatDate(tomorrow);
  const tomorrowMatches = matchesData.filter(match => match.date === tomorrowDate);
  renderMatches(tomorrowMatches, 'tomorrow-matches-container', 'غداً');
}

// دالة مساعدة لتنسيق التاريخ
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return ${year}-${month}-${day};
}

// تحديث مباريات الغد
function updateTomorrowMatches() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split('T')[0];
  const tomorrowMatches = matchesData.filter(match => match.date === tomorrowDate);
  renderMatches(tomorrowMatches, 'tomorrow-matches-container');
}

// عرض المباريات في القوائم
function renderMatches(matches, containerId, dayLabel = '') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (matches.length === 0) {
    container.innerHTML = <div class="no-matches">لا توجد مباريات ${dayLabel}</div>;
    return;
  }

  container.innerHTML = matches.map(match => 
    <div class="match-card" data-id="${match.id}">
      <div class="match-header">
        <span class="league-name">${match.league}</span>
        <span class="match-date">${formatDisplayDate(match.date)}</span>
        <span class="match-time">${match.time}</span>
      </div>
      <!-- باقي كود البطاقة -->
    </div>
  ).join('');
}

// تنسيق التاريخ للعرض
function formatDisplayDate(dateString) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-EG', options);
}

// تحديث الملخصات
function updateHighlights() {
  const highlights = matchesData.filter(match => match.highlights && match.highlights.length > 0);
  const container = document.getElementById('highlights-container');
  
  if (!container) return;

  if (highlights.length === 0) {
    container.innerHTML = '<div class="no-highlights">لا توجد ملخصات متاحة حالياً</div>';
    return;
  }

  container.innerHTML = highlights.map(match => match.highlights.map(highlight => 
    <div class="highlight-card">
      <div class="highlight-thumbnail" data-video="${highlight.video_url}">
        <img src="${highlight.thumbnail}" alt="${match.home_team} vs ${match.away_team}">
        <div class="play-icon">
          <i class="fas fa-play"></i>
        </div>
      </div>
      <div class="highlight-info">
        <h3 class="highlight-title">${highlight.title}</h3>
        <div class="highlight-meta">
          <span>${match.league}</span>
          <span>${highlight.duration}</span>
        </div>
      </div>
    </div>
  ).join('')).join('');

  // إضافة مستمعين لأزرار التشغيل
  document.querySelectorAll('.highlight-thumbnail').forEach(item => {
    item.addEventListener('click', function() {
      openVideoModal(this.dataset.video);
    });
  });
}
// التحديث التلقائي
function setAutoRefresh() {
  // تحديث كل دقيقة
  setInterval(() => {
    loadMatchesData();
  }, 60000);

  // أو عند التركيز على الصفحة
  window.addEventListener('focus', loadMatchesData);
}

// وظائف مساعدة
function getStatusClass(status) {
  const statusClasses = {
    'لم تبدأ': 'not-started',
    'مباشر': 'live',
    'انتهت': 'finished',
    'تأجلت': 'postponed'
  };
  return statusClasses[status] || '';
}

function getStatusText(status, minute) {
  const statusTexts = {
    'لم تبدأ': 'لم تبدأ',
    'مباشر': مباشر ${minute}',
    'انتهت': 'انتهت',
    'تأجلت': 'تأجلت'
  };
  return statusTexts[status] || status;
}

function updateLastUpdated(timestamp) {
  const date = new Date(timestamp);
  document.querySelectorAll('.last-updated').forEach(el => {
    el.textContent = آخر تحديث: ${date.toLocaleString('ar-EG')};
  });
}

function showError(message) {
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.textContent = message;
  document.body.prepend(errorEl);
  setTimeout(() => errorEl.remove(), 5000);
}

function openVideoModal(videoUrl) {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoFrame');
  iframe.src = videoUrl;
  modal.classList.add('active');
  
  // إغلاق المودال
  document.querySelector('.close-modal').onclick = () => {
    modal.classList.remove('active');
    iframe.src = '';
  };
}
function validateDates(matches) {
  const currentDate = new Date();
  return matches.filter(match => {
    try {
      const matchDate = new Date(match.date);
      return matchDate instanceof Date && !isNaN(matchDate) && matchDate >= currentDate;
    } catch {
      return false;
    }
  });
}
