// News API Configuration
const NEWS_API_KEY = '1930d8747282440aaee1688330c10db2'; // استبدلها بمفتاحك الفعلي
const NEWS_API_BASE = 'https://newsapi.org/v2';
const NEWS_API_PARAMS = {
    q: 'كرة قدم',
    language: 'ar',
    sortBy: 'publishedAt',
    pageSize: 6
};

// عناصر DOM
const featuredNews = document.getElementById('featured-news');
const newsGrid = document.getElementById('news-grid');
const newsLoading = document.getElementById('news-loading');
const loadMoreBtn = document.getElementById('load-more');

// متغيرات التطبيق
let currentPage = 1;

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if (!featuredNews || !newsGrid || !newsLoading || !loadMoreBtn) {
        console.error('One or more DOM elements are missing');
        return;
    }
    fetchNews();
});

// جلب الأخبار
async function fetchNews() {
    try {
        showNewsLoading();
        
        const params = new URLSearchParams({
            ...NEWS_API_PARAMS,
            page: currentPage
        });
        
        const apiUrl = `${NEWS_API_BASE}/everything?${params.toString()}`;
        const headers = {
            'X-Api-Key': NEWS_API_KEY,
            'Content-Type': 'application/json'
        };
        
        const response = await fetch(apiUrl, { headers });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.articles || !Array.isArray(data.articles)) {
            throw new Error('Invalid data format from API');
        }
        
        if (currentPage === 1) {
            renderFeaturedNews(data.articles[0]);
            renderNewsGrid(data.articles.slice(1));
        } else {
            renderNewsGrid(data.articles, true);
        }
        
        toggleLoadMoreButton(data.totalResults);
    } catch (error) {
        console.error('Error fetching news:', error);
        showNewsError('تعذر تحميل الأخبار. يرجى المحاولة لاحقاً');
    } finally {
        hideNewsLoading();
    }
}

// ... باقي الدوال تبقى كما هي بدون تغيير ...
