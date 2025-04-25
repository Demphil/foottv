// متغيرات المباراة الحالية
let currentMatch = null;

// جلب بيانات المباراة
async function loadMatchData(matchId) {
    const response = await fetch('data/matches.json');
    const data = await response.json();
    return data.matches.find(match => match.id === matchId);
}

// عرض بيانات المباراة
function renderMatch(match) {
    const matchViewer = document.getElementById('matchViewer');
    
    matchViewer.innerHTML = 
        <div class="teams">
            <div class="team home">
                <img src="assets/images/teams/${match.home_team.toLowerCase()}.png" alt="${match.home_team}">
                <span class="score">${match.score.split('-')[0]}</span>
            </div>
            <div class="vs">VS</div>
            <div class="team away">
                <span class="score">${match.score.split('-')[1]}</span>
                <img src="assets/images/teams/${match.away_team.toLowerCase()}.png" alt="${match.away_team}">
            </div>
        </div>
    ;
}

// التهيئة عند تحميل الصفحة
window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('match');
    
    if (matchId) {
        currentMatch = await loadMatchData(matchId);
        if (currentMatch) {
            renderMatch(currentMatch);
        }
    }
};
