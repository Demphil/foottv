async function fetchMatches() {
  try {
    const response = await fetch('https://api.football-data.org/v4/matches', {
      headers: {
        'X-Auth-Token': 'YOUR_API_KEY'
      }
    });
    
    if (!response.ok) {
      throw new Error(Network error: ${response.status});
    }

    const data = await response.json();
    return data.matches || [];
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    showError("حدث خطأ في جلب بيانات المباريات");
    return [];
  }
}

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

    container.innerHTML = validMatches.map(match => 
      <div class="match-card">
        <div class="teams">
          <span class="home-team">${match.homeTeam.name}</span>
          <span class="vs">vs</span>
          <span class="away-team">${match.awayTeam.name}</span>
        </div>
        <div class="match-info">
          <span class="league">${match.competition.name}</span>
          <span class="status ${getStatusClass(match.status)}">
            ${getStatusText(match.status, match.minute)}
          </span>
        </div>
        ${renderHighlights(match.highlights || [])}
      </div>
    ).join('');

    setupEventListeners();
    updateLastUpdated(new Date().toISOString());
  } catch (error) {
    console.error("Error loading matches:", error);
    showError("حدث خطأ في تحميل البيانات");
  }
}

function renderHighlights(highlights) {
  if (!highlights.length) return '';
  
  return 
    <div class="highlights-section">
      <h3 class="section-title">أبرز اللحظات</h3>
      <div class="highlights-grid">
        ${highlights.map(highlight => 
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
        ).join('')}
      </div>
    </div>
  ;
}

function setupEventListeners() {
  // Add click listeners to all highlight thumbnails
  document.querySelectorAll('.highlight-thumbnail').forEach(item => {
    item.addEventListener('click', function() {
      openVideoModal(this.dataset.video);
    });
  });
}

function setAutoRefresh() {
  // Refresh every minute
  setInterval(loadMatchesData, 60000);
  
  // Also refresh when window gets focus
  window.addEventListener('focus', loadMatchesData);
}

// Helper functions
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

function getStatusText(status, minute) {
  const statusTexts = {
    'SCHEDULED': 'لم تبدأ',
    'LIVE': مباشر ${minute || ''},
    'IN_PLAY': مباشر ${minute || ''},
    'FINISHED': 'انتهت',
    'POSTPONED': 'تأجلت',
    'CANCELLED': 'ألغيت'
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

function validateDates(matches) {
  const currentDate = new Date();
  return matches.filter(match => {
    try {
      const matchDate = new Date(match.utcDate);
      return matchDate instanceof Date && !isNaN(matchDate);
    } catch {
      return false;
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  loadMatchesData();
  setAutoRefresh();
});
