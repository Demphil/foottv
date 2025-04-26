// news.js

document.addEventListener('DOMContentLoaded', function() {
    // 1. جلب بيانات المباريات من ملف JSON
    fetchMatchesData();

    // (اختياري) تحديث البيانات كل 5 دقائق إذا كان الموقع مفتوحاً
    setInterval(fetchMatchesData, 300000);
});

async function fetchMatchesData() {
    try {
        const response = await fetch('./data/matches.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // 2. معالجة وعرض البيانات
         displayMatches(data.response); // قد يكون data.fixtures أو data.matches
    } catch (error) {
        console.error('Error fetching matches data:', error);
        document.getElementById('matches-container').innerHTML = 
            '<p class="error">فشل تحميل بيانات المباريات. يرجى المحاولة لاحقاً.</p>';
    }
}

function displayMatches(matches) {
    const container = document.getElementById('matches-container');
    container.innerHTML = ''; // مسح المحتوى القديم

    if (!matches || matches.length === 0) {
        container.innerHTML = '<p>لا توجد مباريات حالياً.</p>';
        return;
    }

    // 3. عرض كل مباراة في بطاقة (Card)
    matches.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';

        matchCard.innerHTML = `
            <div class="teams">
                <span class="team home">${match.teams.home.name}</span>
                <span class="vs">vs</span>
                <span class="team away">${match.teams.away.name}</span>
            </div>
            <div class="details">
                <span class="date">${new Date(match.fixture.date).toLocaleString()}</span>
                <span class="league">${match.league?.name || 'غير محدد'}</span>
            </div>
        `;

        container.appendChild(matchCard);
    });
}
