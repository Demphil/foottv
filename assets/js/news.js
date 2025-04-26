// News API Configuration
const NEWS_API_KEY = '1930d8747282440aaee1688330c10db2'; // استبدلها بمفتاحك الفعلي
const NEWS_API_BASE = 'https://newsapi.org/v2';
const DEFAULT_IMAGE = 'assets/images/news-placeholder.jpg';

// عناصر DOM
const elements = {
    featuredNews: document.getElementById('featured-news'),
    newsGrid: document.getElementById('news-grid'),
    newsLoading: document.getElementById('news-loading'),
    loadMoreBtn: document.getElementById('load-more'),
    errorContainer: document.getElementById('error-container')
};

// متغيرات التطبيق
let currentPage = 1;
const pageSize = 6;

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', initNews);

function initNews() {
    if (!validateElements()) {
        console.error('Missing required DOM elements');
        return;
    }
    setupEventListeners();
    fetchNews();
}

function validateElements() {
    return Object.values(elements).every(el => el !== null);
}

function setupEventListeners() {
    elements.loadMoreBtn.addEventListener('click', loadMoreNews);
}

// جلب الأخبار
async function fetchNews() {
    try {
        showNewsLoading();
        clearErrors();
        
        const params = new URLSearchParams({
            q: 'كرة قدم',
            language: 'ar',
            sortBy: 'publishedAt',
            pageSize: pageSize,
            page: currentPage
        });
        
        const response = await fetch(`${NEWS_API_BASE}/everything?${params}`, {
            headers: {
                'X-Api-Key': NEWS_API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.articles || !Array.isArray(data.articles)) {
            throw new Error('Invalid data format from API');
        }
        
        processNewsData(data);
    } catch (error) {
        handleNewsError(error);
    } finally {
        hideNewsLoading();
    }
}

function processNewsData(data) {
    if (currentPage === 1) {
        renderFeaturedNews(data.articles[0]);
        renderNewsGrid(data.articles.slice(1));
    } else {
        renderNewsGrid(data.articles, true);
    }
    
    toggleLoadMoreButton(data.totalResults);
}

// عرض الخبر الرئيسي
function renderFeaturedNews(article) {
    if (!article) return;
    
    elements.featuredNews.innerHTML = `
        <div class="featured-card">
            <div class="featured-image">
                <img src="${article.urlToImage || DEFAULT_IMAGE}" 
                     alt="${sanitizeText(article.title)}"
                     onerror="handleImageError(this)">
            </div>
            <div class="featured-content">
                <span class="news-source">${sanitizeText(article.source?.name || 'مصدر غير معروف')}</span>
                <h2 class="news-title">${sanitizeText(article.title)}</h2>
                <p class="news-description">${sanitizeText(article.description || '')}</p>
                <a href="${sanitizeUrl(article.url)}" target="_blank" rel="noopener noreferrer" class="read-more">
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
        elements.newsGrid.innerHTML = '';
    }
    
    articles.forEach(article => {
        const articleEl = document.createElement('div');
        articleEl.className = 'news-card';
        articleEl.innerHTML = `
            <div class="news-image">
                <img src="${article.urlToImage || DEFAULT_IMAGE}" 
                     alt="${sanitizeText(article.title)}"
                     onerror="handleImageError(this)">
            </div>
            <div class="news-content">
                <span class="news-source">${sanitizeText(article.source?.name || 'مصدر غير معروف')}</span>
                <h3 class="news-title">${sanitizeText(article.title)}</h3>
                <p class="news-date">${formatNewsDate(article.publishedAt)}</p>
                <a href="${sanitizeUrl(article.url)}" target="_blank" rel="noopener noreferrer" class="read-more">
                    اقرأ المزيد <i class="fas fa-arrow-left"></i>
                </a>
            </div>
        `;
        elements.newsGrid.appendChild(articleEl);
    });
}

// وظائف مساعدة
function formatNewsDate(dateString) {
    try {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('ar-EG', options);
    } catch {
        return 'تاريخ غير معروف';
    }
}

function toggleLoadMoreButton(totalResults) {
    const totalLoaded = currentPage * pageSize;
    elements.loadMoreBtn.style.display = totalLoaded < totalResults ? 'block' : 'none';
}

function showNewsLoading() {
    elements.newsLoading.style.display = 'block';
    if (currentPage === 1) {
        elements.newsGrid.style.opacity = '0.5';
    }
}

function hideNewsLoading() {
    elements.newsLoading.style.display = 'none';
    elements.newsGrid.style.opacity = '1';
}

function showNewsError(message) {
    elements.errorContainer.innerHTML = `
        <div class="news-error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <button class="retry-btn">إعادة المحاولة</button>
        </div>
    `;
    elements.errorContainer.style.display = 'block';
    
    // إعادة ربط مستمع الأحداث
    document.querySelector('.retry-btn').addEventListener('click', retryFetch);
}

function clearErrors() {
    elements.errorContainer.style.display = 'none';
}

function handleNewsError(error) {
    console.error('News Error:', {
        error: error.message,
        stack: error.stack,
        page: currentPage
    });
    showNewsError('تعذر تحميل الأخبار. يرجى المحاولة لاحقاً');
}

function sanitizeText(text) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function sanitizeUrl(url) {
    try {
        return new URL(url).toString();
    } catch {
        return '#';
    }
}

function handleImageError(img) {
    img.onerror = null;
    img.src = DEFAULT_IMAGE;
}

function loadMoreNews() {
    currentPage++;
    fetchNews();
}

function retryFetch() {
    currentPage = 1;
    fetchNews();
}
