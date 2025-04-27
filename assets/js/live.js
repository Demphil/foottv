function loadMatches() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
    
    fetch(`https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${today}`, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            'x-rapidapi-key': '795f377634msh4be097ebbb6dce3p1bf238jsn583f1b9cf438'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        console.log('API Response:', data); // تحقق من هيكل البيانات
        
        const todayContainer = document.getElementById('today-matches-container');
        const tomorrowContainer = document.getElementById('tomorrow-matches-container');
        
        // عرض مباريات اليوم
        if (data.response && data.response.length > 0) {
            todayContainer.innerHTML = data.response.map(match => `
                <div class="match-card">
                    <div class="teams">
                        <span class="home-team">${match.teams.home.name}</span> vs 
                        <span class="away-team">${match.teams.away.name}</span>
                    </div>
                    <div class="match-info">
                        <span class="league">${match.league.name}</span>
                        <span class="time">${new Date(match.fixture.date).toLocaleTimeString()}</span>
                    </div>
                </div>
            `).join('');
        } else {
            todayContainer.innerHTML = '<div class="no-matches">لا توجد مباريات اليوم</div>';
        }
        
        // جلب مباريات الغد (طلب منفصل)
        return fetch(`https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${tomorrow}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
                'x-rapidapi-key': 'your-api-key-here'
            }
        });
    })
    .then(response => response.json())
    .then(data => {
        const tomorrowContainer = document.getElementById('tomorrow-matches-container');
        
        if (data.response && data.response.length > 0) {
            tomorrowContainer.innerHTML = data.response.map(match => `
                <div class="match-card">
                    <div class="teams">
                        <span class="home-team">${match.teams.home.name}</span> vs 
                        <span class="away-team">${match.teams.away.name}</span>
                    </div>
                    <div class="match-info">
                        <span class="league">${match.league.name}</span>
                        <span class="time">${new Date(match.fixture.date).toLocaleTimeString()}</span>
                    </div>
                </div>
            `).join('');
        } else {
            tomorrowContainer.innerHTML = '<div class="no-matches">لا توجد مباريات غداً</div>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('error-container').innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>حدث خطأ في جلب البيانات: ${error.message}</p>
            </div>
        `;
    });
}
