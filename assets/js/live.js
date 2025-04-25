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
        
        // جلب البيانات مع منع التخزين المؤقت
        const
