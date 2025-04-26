// News API Configuration
const NEWS_API_KEY = process.env.NEWS_API_KEY || '795f377634msh4be097ebbb6dce3p1bf238jsn583f1b9cf438' استبدل بمفتاحك الفعلية
const NEWS_API_BASE = 'https://newsapi.org/v2';
const DEFAULT_IMAGE = 'assets/images/news-placeholder.jpg';

// DOM Elements
const elements = {
    featuredNews: document.getElementById('featured-news'),
    newsGrid: document.getElementById('news-grid'),
    newsLoading: document.getElementById('news-loading'),
    loadMoreBtn: document.getElementById('load-more'),
    errorContainer: document.getElementById('error-container'),
};

// App Variables
let currentPage = 1;
const pageSize = 6;
let isLoading = false; // Prevent duplicate requests

// Initialize Page
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

// Fetch News
async function fetchNews() {
    if (isLoading) return; // Prevent multiple requests
    isLoading = true;

    try {
        showNewsLoading();
        clearErrors();

        const params = new URLSearchParams({
            q: 'كرة قدم',
            language: 'ar',
            sortBy: 'publishedAt',
            pageSize: pageSize,
            page: currentPage,
        });

        const response = await fetch(`${NEWS_API_BASE}/everything?${params}`, {
            headers: {
                'X-Api-Key': NEWS_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
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
        isLoading = false;
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

// Render Featured News
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

// Render News Grid
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

// Helper Functions
function formatNewsDate(dateString) {
    try {
        return new Date(dateString).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return 'تاريخ غير معروف';
    }
}

function toggleLoadMoreButton(totalResults) {
    elements.loadMoreBtn.style.display = (currentPage * pageSize < totalResults) ? 'block' : 'none';
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

function handleNewsError(error) {
    console.error('News Error:', error.message);
    showNewsError('تعذر تحميل الأخبار. حاول مرة أخرى لاحقاً.');
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
