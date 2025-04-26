// Fetch match data from API
async function fetchMatches() {
  try {
    const response = await fetch('https://api.football-data.org/v4/matches', {
      headers: {
        'X-Auth-Token': 'YOUR_API_KEY'
      }
    });
const express = require('express');
const axios = require('axios');
const app = express();

const API_KEY = process.env.API_KEY;

app.get('/matches', async (req, res) => {
  try {
    const response = await axios.get('https://api.football-data.org/v4/matches', {
      headers: { 'X-Auth-Token': API_KEY },
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching matches');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    const data = await response.json();
    return data.matches || [];
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    showError("حدث خطأ في جلب بيانات المباريات");
    return [];
  }
}

// Load and render match data into the page
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
    `).join('');

    setupEventListeners();
    updateLastUpdated(new Date().toISOString());
  } catch (error) {
    console.error("Error loading matches:", error);
    showError("حدث خطأ في تحميل البيانات");
  }
}

// Render highlights section for each match
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

// Set up event listeners for highlight clicks
function setupEventListeners() {
  document.querySelectorAll('.highlight-thumbnail').forEach(item => {
    item.addEventListener('click', function () {
      openVideoModal(this.dataset.video);
    });
  });
}

// Set auto-refresh for match data
function setAutoRefresh() {
  setInterval(loadMatchesData, 60000);

  window.addEventListener('focus', loadMatchesData);
}

// Get CSS class for match status
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

// Get text for match status
function getStatusText(status, minute) {
  const statusTexts = {
    'SCHEDULED': 'لم تبدأ',
    'LIVE': `مباشر ${minute || ''}`,
    'IN_PLAY': `مباشر ${minute || ''}`,
    'FINISHED': 'انتهت',
    'POSTPONED': 'تأجلت',
    'CANCELLED': 'ألغيت'
  };
  return statusTexts[status] || status;
}

// Update the last updated timestamp
function updateLastUpdated(timestamp) {
  const date = new Date(timestamp);
  document.querySelectorAll('.last-updated').forEach(el => {
    el.textContent = `آخر تحديث: ${date.toLocaleString('ar-EG')}`;
  });
}

// Show error message
function showError(message) {
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.textContent = message;
  document.body.prepend(errorEl);
  setTimeout(() => errorEl.remove(), 5000);
}

// Open video modal for highlights
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

// Validate match dates
function validateDates(matches) {
  return matches.filter(match => {
    try {
      const matchDate = new Date(match.utcDate);
      return matchDate instanceof Date && !isNaN(matchDate);
    } catch {
      return false;
    }
  });
}

// Initialize on DOM content load
document.addEventListener('DOMContentLoaded', () => {
  loadMatchesData();
  setAutoRefresh();
});
