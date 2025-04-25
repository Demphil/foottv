// جلب المباريات الحية
async function fetchLiveMatches() {
    try {
        const response = await fetch('data/matches.json');
        const data = await response.json();
        return data.matches.filter(match => match.status === 'live');
    } catch (error) {
        console.error('Error fetching matches:', error);
        return [];
    }
}

// عرض المباريات
async function displayLiveMatches() {
    const matches = await fetchLiveMatches();
    const container = document.getElementById('liveMatches');
    
    if (matches.length === 0) {
        container.innerHTML = '<p>لا توجد مباريات مباشرة حالياً</p>';
        return;
    }
    
    let html = '';
    matches.forEach(match => {
        html += 
            <div class="match-card">
                <h3>${match.home_team} vs ${match.away_team}</h3>
                <p>النتيجة: ${match.score}</p>
                <a href="screen.html?match=${match.id}" class="watch-button">مشاهدة</a>
            </div>
        ;
    });
    
    container.innerHTML = html;
}

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    displayLiveMatches();
});
