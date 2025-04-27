// football.js - نظام إدارة بيانات المباريات
const CONFIG = {
    TEST_MODE: false, // تفعيل الوضع التجريبي
    API_URL: '/data/matches.json',
    CACHE_TIME: 5 * 60 * 1000, // 5 دقائق (بالمللي ثانية)
    LIVE_STATUSES: ['LIVE', 'HT', 'ET', 'PEN_LIVE']
};

// بيانات تجريبية (للاختبار فقط)
const TEST_DATA = {
    matches: [
        {
            id: 1,
            status: 'LIVE',
            home_team: { name: 'النصر', logo: '/assets/teams/alnassr.png' },
            away_team: { name: 'الهلال', logo: '/assets/teams/alhilal.png' },
            score: { home: 2, away: 1 },
            league: 'الدوري السعودي',
            time: '64'
        }
    ]
};

// ذاكرة تخزين مؤقت
let matchesCache = {
    data: null,
    timestamp: 0
};

/**
 * جلب بيانات المباريات (مع التخزين المؤقت)
 * @returns {Promise<Array>} قائمة المباريات
 */
export const getMatches = async () => {
    if (CONFIG.TEST_MODE) return getTestMatches();
    
    // التحقق من التخزين المؤقت
    if (isCacheValid()) return matchesCache.data;
    
    try {
        const response = await fetch(CONFIG.API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const liveMatches = filterLiveMatches(data.matches || []);
        
        // تحديث التخزين المؤقت
        updateCache(liveMatches);
        
        return liveMatches;
    } catch (error) {
        console.error('فشل جلب البيانات:', error);
        return handleErrorCase();
    }
};

// ============= دوال مساعدة ============= //

/** جلب بيانات تجريبية */
function getTestMatches() {
    console.warn('الوضع التجريبي مفعل - يتم استخدام بيانات اختبار');
    return Promise.resolve(TEST_DATA.matches);
}

/** تصفية المباريات الحية */
function filterLiveMatches(matches) {
    return matches.filter(match => 
        CONFIG.LIVE_STATUSES.includes(match.status)
    );
}

/** التحقق من صلاحية التخزين المؤقت */
function isCacheValid() {
    return matchesCache.data && 
           (Date.now() - matchesCache.timestamp) < CONFIG.CACHE_TIME;
}

/** تحديث التخزين المؤقت */
function updateCache(data) {
    matchesCache = {
        data,
        timestamp: Date.now()
    };
}

/** إدارة حالات الخطأ */
function handleErrorCase() {
    // يمكنك هنا:
    // 1. إرجاع بيانات سابقة
    // 2. استخدام بيانات احتياطية
    // 3. إرسال تنبيه للإدارة
    return [];
}

// ============= واجهة إضافية ============= //

/** جلب مباريات دوري معين */
export const getLeagueMatches = async (leagueId) => {
    const matches = await getMatches();
    return matches.filter(match => match.league_id === leagueId);
};
