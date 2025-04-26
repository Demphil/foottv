// استيراد مفتاح API من ملف config.js
import API_KEY from './api/RAPIDAPI_KEY'; // تأكد من استبدال المسار حسب هيكل موقعك

// دالة لجلب المباريات من RapidAPI
async function fetchMatches() {
  try {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
        'X-RapidAPI-Key': API_KEY // استخدم مفتاح API الخاص بك هنا
      }
    };

    const response = await fetch('https://api-football-v1.p.rapidapi.com/v3/fixtures', options);

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || []; // تأكد من تحديث هذا حسب هيكلية البيانات
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    showError("حدث خطأ في جلب بيانات المباريات");
    return [];
  }
}

// دالة لعرض المباريات في الواجهة
async function loadMatchesData() {
  const container = document.getElementById('highlights-container');
  if (!container) return;

  try {
    const matches = await fetchMatches();
    const validMatches = validateDates(matches);

    if (validMatches.length === 0) {
      container.innerHTML = '<div class="no-matches">لا توجد مباريات حالية</div>';
      return;
    }

    container.innerHTML = validMatches.map(match => `
      <div class="match-card">
        <div class="teams">
          <span class="home-team">${match.teams.home.name}</span>
          <span class="vs">vs</span>
          <span class="away-team">${match.teams.away.name}</span>
        </div>
        <div class="match-info">
          <span class="league">${match.league.name}</span>
          <span class="status ${getStatusClass(match.fixture.status.short)}">
            ${getStatusText(match.fixture.status.short, match.fixture.timestamp)}
          </span>
        </div>
        ${renderHighlights(match.highlights || [])}
      </div>
    `).join('');

    setupEventListeners();
    updateLastUpdated(new Date().toISOString());
  } catch (error) {
    console.error("Error loading matches:", error);
    showError("حدث خطأ في تحميل البيانات");
  }
}

// دالة لعرض أبرز اللحظات (الفيديوهات) إذا كانت متاحة
function renderHighlights(highlights) {
  if (!highlights.length) return '';

  return `
    <div class="highlights-section">
      <h3 class="section-title">أبرز اللحظات</h3>
      <div class="highlights-grid">
        ${highlights.map(highlight => `
          <div class="highlight-card">
            <div class="highlight-thumbnail" data-video="${highlight.video_url}">
              <img src="${highlight.thumbnail}" alt="${highlight.title}">
              <div class="play-icon">
                <i class="fas fa-play"></i>
              </div>
            </div>
            <div class="highlight-info">
              <h4 class="highlight-title">${highlight.title}</h4>
              <div class="highlight-meta">
                <span>${highlight.duration}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// دالة لإعداد مستمعين للأحداث (الفيديوهات)
function setupEventListeners() {
  document.querySelectorAll('.highlight-thumbnail').forEach(item => {
    item.addEventListener('click', function () {
      openVideoModal(this.dataset.video);
    });
  });
}

// دالة لفتح الفيديو في نافذة منبثقة
function openVideoModal(videoUrl) {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoFrame');

  if (!modal || !iframe) {
    console.error("Video modal elements not found");
    return;
  }

  iframe.src = videoUrl;
  modal.classList.add('active');

  document.querySelector('.close-modal').addEventListener('click', () => {
    modal.classList.remove('active');
    iframe.src = '';
  });
}

// دالة لتحديث وقت آخر تحديث للمباريات
function updateLastUpdated(timestamp) {
  const date = new Date(timestamp);
  document.querySelectorAll('.last-updated').forEach(el => {
    el.textContent = `آخر تحديث: ${date.toLocaleString('ar-EG')}`;
  });
}

// دالة لعرض رسائل الأخطاء
function showError(message) {
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.textContent = message;
  document.body.prepend(errorEl);
  setTimeout(() => errorEl.remove(), 5000);
}

// دالة للتحقق من التواريخ الصالحة للمباريات
function validateDates(matches) {
  const currentDate = new Date();
  return matches.filter(match => {
    try {
      const matchDate = new Date(match.fixture.date);
      return matchDate instanceof Date && !isNaN(matchDate);
    } catch {
      return false;
    }
  });
}

// دالة للحصول على الفئة المناسبة لحالة المباراة
function getStatusClass(status) {
  const statusClasses = {
    'SCHEDULED': 'not-started',
    'LIVE': 'live',
    'IN_PLAY': 'live',
    'FINISHED': 'finished',
    'POSTPONED': 'postponed',
    'CANCELLED': 'cancelled'
  };
  return statusClasses[status] || '';
}

// دالة للحصول على نص حالة المباراة
function getStatusText(status, timestamp) {
  const statusTexts = {
    'SCHEDULED': 'لم تبدأ',
    'LIVE': `مباشر ${timestamp || ''}`,
    'IN_PLAY': `مباشر ${timestamp || ''}`,
    'FINISHED': 'انتهت',
    'POSTPONED': 'تأجلت',
    'CANCELLED': 'ألغيت'
  };
  return statusTexts[status] || status;
}

// دالة للتحديث التلقائي للمباريات كل دقيقة
function setAutoRefresh() {
  setInterval(loadMatchesData, 60000); // التحديث كل دقيقة

  window.addEventListener('focus', loadMatchesData); // التحديث عند إعادة تركيز الصفحة
}

// تنفيذ الكود بعد تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  loadMatchesData(); // جلب المباريات عند تحميل الصفحة
  setAutoRefresh();  // بدء التحديث التلقائي
});
