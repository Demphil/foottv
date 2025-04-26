// News API Configuration
const NEWS_API_KEY = '1930d8747282440aaee1688330c10db2'; // استبدلها بمفتاحك
const NEWS_API_URL = 'https://newsapi.org/v2/everything?q=%D9%83%D8%B1%D8%A9+%D9%82%D8%AF%D9%85&language=ar&sortBy=publishedAt&page=1&pageSize=6&apiKey=1930d8747282440aaee1688330c10db2
';

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
        
        const response = await fetch(`${NEWS_API_URL}&page=${currentPage}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
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
                     alt="${article.title}"
                     onerror="this.onerror=null;this.src='assets/images/news-placeholder.jpg'">
            </div>
            <div class="featured-content">
                <span class="news-source">${article.source?.name || 'مصدر غير معروف'}</span>
                <h2 class="news-title">${article.title}</h2>
                <p class="news-description">${article.description || ''}</p>
                <a href="${article.url}" target="_blank" class="read-more">
                    اقرأ المزيد <i class="fas fa-arrow-left"></i>
                </a>
            </div>
        </div>
    `;
}

// عرض شبكة الأخبار
function renderNewsGrid(articles, append = false) {
    if (!articles || articles.length === 0) return;
    
    if (!append) {
        newsGrid.innerHTML = '';
    }
    
    articles.forEach(article => {
        const articleEl = document.createElement('div');
        articleEl.className = 'news-card';
        articleEl.innerHTML = `
            <div class="news-image">
                <img src="${article.urlToImage || 'assets/images/news-placeholder.jpg'}" 
                     alt="${article.title}"
                     onerror="this.onerror=null;this.src='assets/images/news-placeholder.jpg'">
            </div>
            <div class="news-content">
                <span class="news-source">${article.source?.name || 'مصدر غير معروف'}</span>
                <h3 class="news-title">${article.title}</h3>
                <p class="news-date">${formatNewsDate(article.publishedAt)}</p>
                <a href="${article.url}" target="_blank" class="read-more">
                    اقرأ المزيد <i class="fas fa-arrow-left"></i>
                </a>
            </div>
        `;
        newsGrid.appendChild(articleEl);
    });
}

// تنسيق تاريخ الخبر
function formatNewsDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
}

// التحكم في زر "تحميل المزيد"
function toggleLoadMoreButton(totalResults) {
    const totalLoaded = currentPage * pageSize;
    loadMoreBtn.style.display = totalLoaded < totalResults ? 'block' : 'none';
}

// إظهار تحميل الأخبار
function showNewsLoading() {
    newsLoading.style.display = 'block';
    if (currentPage === 1) {
        newsGrid.style.opacity = '0.5';
    }
}

// إخفاء تحميل الأخبار
function hideNewsLoading() {
    newsLoading.style.display = 'none';
    newsGrid.style.opacity = '1';
}

// إظهار خطأ الأخبار
function showNewsError(message) {
    newsGrid.innerHTML = `
        <div class="news-error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <button onclick="fetchNews()" class="retry-btn">إعادة المحاولة</button>
        </div>
    `;
}

// تحميل المزيد من الأخبار
loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    fetchNews();
});
