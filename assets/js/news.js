// News API Configuration
const NEWS_API_KEY = '8d831470f41e4dbe983fba512cc0c795'; // استبدلها بمفتاحك
const NEWS_API_URL = 'https://newsapi.org/v2/everything?q=كرة+قدم&language=ar&sortBy=publishedAt';

// عناصر DOM
const featuredNews = document.getElementById('featured-news');
const newsGrid = document.getElementById('news-grid');
const newsLoading = document.getElementById('news-loading');
const loadMoreBtn = document.getElementById('load-more');

// متغيرات التطبيق
let currentPage = 1;
const pageSize = 6;

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
});

// جلب الأخبار
async function fetchNews() {
    try {
        showNewsLoading();
        
        const response = await fetch(${NEWS_API_URL}&page=${currentPage}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY});
        const data = await response.json();
        
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

// عرض الخبر الرئيسي
function renderFeaturedNews(article) {
    if (!article) return;
    
    featuredNews.innerHTML = `
        <div class="featured-card">
            <div class="featured-image">
                <img src="${article.urlToImage || 'assets/images/news-placeholder.jpg'}" 
                     alt="${article.title}">
            </div>
            <div class="featured-content">
                <span class="news-source">${article.source?.name || 'مصدر غير معروف'}</span>
                <h2 class="news-title">${article.title}</h2>
                <p class="news-description">${article.description || ''}</p>
                <a href="${article.url}" target="_blank" class="read-more">
                    اقرأ المزيد <i class="fas fa-arrow-left"></i
