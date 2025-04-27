/**
 * matches.js - إدارة جدول المباريات
 * متوافق مع matches.html المعدل
 * آخر تحديث: مايو 2025
 */

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// الكائن الرئيسي للتطبيق
const MatchApp = {
    elements: {
        tableBody: null,
        loadingSpinner: null,
        noDataMessage: null,
        refreshBtn: null,
        leagueSelect: null,
        dateSelect: null,
        lastUpdated: null,
        nowPlaying: null,
        matchDetails: null,
        closeDetailsBtn: null
    },

    // تهيئة العناصر والأحداث
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.loadData();
        this.updateYear();
    },

    // تخزين العناصر في الكائن
    cacheElements() {
        this.elements = {
            tableBody: document.getElementById('matches-tbody'),
            loadingSpinner: document.getElementById('loading-spinner'),
            noDataMessage: document.getElementById('no-data-message'),
            refreshBtn: document.getElementById('refresh-btn'),
            leagueSelect: document.getElementById('league-select'),
            dateSelect: document.getElementById('date-select'),
            lastUpdated: document.getElementById('last-updated'),
            nowPlaying: document.getElementById('now-playing'),
            matchDetails: document.getElementById('match-details'),
            closeDetailsBtn: document.getElementById('close-details')
        };
    },

    // إعداد معالجات الأحداث
    setupEventListeners() {
        const { refreshBtn, closeDetailsBtn } = this.elements;
        
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadData());
        }

        if (closeDetailsBtn) {
            closeDetailsBtn.addEventListener('click', () => this.closeDetails());
        }
    },

    // جلب البيانات من API
    async loadData() {
        this.showLoading(true);
        
        try {
            const data = await this.fetchMatches();
            this.renderMatches(data);
            this.updateTimestamp();
        } catch (error) {
            console.error('فشل تحميل البيانات:', error);
            this.showError('حدث خطأ في جلب البيانات');
        } finally {
            this.showLoading(false);
        }
    },

    // جلب بيانات المباريات
    async fetchMatches() {
        const response = await fetch('data/matches.json');
        if (!response.ok) {
            throw new Error(`خطأ في الشبكة: ${response.status}`);
        }
        return await response.json();
    },

    // عرض المباريات في الجدول
    renderMatches(data) {
        const { tableBody, noDataMessage } = this.elements;
        
        if (!data || data.length === 0) {
            noDataMessage.style.display = 'flex';
            tableBody.innerHTML = '';
            return;
        }

        noDataMessage.style.display = 'none';
        tableBody.innerHTML = data.map(match => this.createMatchRow(match)).join('');
    },

    // إنشاء صف للمباراة
    createMatchRow(match) {
        const homeLogo = match.teams.home.logo || 'assets/images/default-team.png';
        const awayLogo = match.teams.away.logo || 'assets/images/default-team.png';
        const statusClass = this.getStatusClass(match.fixture.status.short);

        return `
            <tr data-match-id="${match.fixture.id}" onclick="MatchApp.showDetails(${match.fixture.id})">
                <td>${match.league?.name || 'غير معروف'}</td>
                <td>${this.formatDate(match.fixture.date)}</td>
                <td class="team-cell">
                    <img src="${homeLogo}" 
                         alt="${match.teams.home.name}" 
                         class="team-logo"
                         loading="lazy"
                         onerror="this.src='assets/images/default-team.png'">
                    <span>${match.teams.home.name}</span>
                </td>
                <td class="score">${match.goals.home ?? '-'} - ${match.goals.away ?? '-'}</td>
                <td class="team-cell">
                    <img src="${awayLogo}" 
                         alt="${match.teams.away.name}" 
                         class="team-logo"
                         loading="lazy"
                         onerror="this.src='assets/images/default-team.png'">
                    <span>${match.teams.away.name}</span>
                </td>
                <td class="status ${statusClass}">
                    ${match.fixture.status.long}
                </td>
            </tr>
        `;
    },

    // عرض تفاصيل المباراة
    showDetails(matchId) {
        const { matchDetails } = this.elements;
        // يمكنك تطوير هذه الوظيفة حسب الحاجة
        matchDetails.style.display = 'block';
        console.log('عرض تفاصيل المباراة:', matchId);
    },

    // إغلاق نافذة التفاصيل
    closeDetails() {
        this.elements.matchDetails.style.display = 'none';
    },

    // التحكم في حالة التحميل
    showLoading(show) {
        const { loadingSpinner, noDataMessage } = this.elements;
        loadingSpinner.style.display = show ? 'flex' : 'none';
        if (show) noDataMessage.style.display = 'none';
    },

    // عرض رسالة خطأ
    showError(message) {
        const { noDataMessage } = this.elements;
        noDataMessage.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        `;
        noDataMessage.style.display = 'flex';
    },

    // تحديث التاريخ والوقت
    updateTimestamp() {
        const { lastUpdated } = this.elements;
        if (lastUpdated) {
            lastUpdated.textContent = `آخر تحديث: ${new Date().toLocaleString('ar-EG')}`;
        }
    },

    // تحديث السنة في الفوتر
    updateYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    },

    // تصنيف حالة المباراة
    getStatusClass(status) {
        const statusMap = {
            'NS': 'not-started',
            'LIVE': 'in-progress',
            'HT': 'in-progress',
            'FT': 'finished',
            'PST': 'postponed'
        };
        return statusMap[status] || '';
    },

    // تنسيق التاريخ
    formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleString('ar-EG', options);
    }
};

// تهيئة التطبيق
function initializeApp() {
    MatchApp.init();
}
// matches.js
// استخدم أحد هذه الأشكال:
import { getMatches } from '/assets/js/api/football.js';         // مسار مطلق
import { getMatches } from './assets/js/api/football.js';        // مسار نسبي
import { getMatches } from '../assets/js/api/football.js';       // إذا كان الملف في مستوى مختلف

export async function loadAndDisplayMatches() {
  try {
    const matches = await getMatches();
    const matchesContainer = document.getElementById('matches-container');
    
    matchesContainer.innerHTML = matches.map(match => `
      <div class="match-card">
        <h3>${match.home_team.name} vs ${match.away_team.name}</h3>
        <p>النتيجة: ${match.score.home} - ${match.score.away}</p>
      </div>
    `).join('');
  } catch (error) {
    console.error('فشل تحميل المباريات:', error);
  }
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadAndDisplayMatches);

// جعل الكائن متاحًا عالميًا للاستدعاء من HTML
window.MatchApp = MatchApp;
