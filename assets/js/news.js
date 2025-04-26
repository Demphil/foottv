// RapidAPI Configuration
const RAPIDAPI_KEY = '795f377634msh4be097ebbb6dce3p1bf238jsn583f1b9cf438';
const RAPIDAPI_HOST = 'football-news-aggregator.p.rapidapi.com';

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

async function fetchNews() {
    try {
        showLoading();
        
        const response = await fetch(`https://${RAPIDAPI_HOST}/news?page=${currentPage}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
            }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        renderNews(data);
        
    } catch (error) {
        handleError(error);
    } finally {
        hideLoading();
    }
}

// باقي الدوال تبقى كما هي مع تعديلات طفيفة
