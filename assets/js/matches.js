document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/matches');
const data = await response.json();
console.log(data); // لمعاينة البيانات

    data.matches.forEach(match => {
        const row = document.createElement('tr');
        row.innerHTML = 
            <td>${match.league}</td>
            <td>${match.date} - ${match.time}</td>
            <td>${match.home_team}</td>
            <td>vs</td>
            <td>${match.away_team}</td>
            <td>
                <span class="status ${match.status}">
                    ${match.status === 'live' ? 'مباشر' : 'قادمة'}
                </span>
            </td>
        ;
        tableBody.appendChild(row);
    });

    // فلترة المباريات
    document.getElementById('leagueFilter').addEventListener('change', filterMatches);
    document.getElementById('dateFilter').addEventListener('change', filterMatches);
});

function filterMatches() {
    const league = document.getElementById('leagueFilter').value;
    const date = document.getElementById('dateFilter').value;
    const rows = document.querySelectorAll('#matchesTable tbody tr');

    rows.forEach(row => {
        const rowLeague = row.cells[0].textContent;
        const rowDate = row.cells[1].textContent.split(' - ')[0];
        
        const leagueMatch = league === 'all' || rowLeague.includes(league);
        const dateMatch = !date || rowDate === date;
        
        row.style.display = leagueMatch && dateMatch ? '' : 'none';
    });
}
import { FootballAPI } from './api/matches.js';

document.addEventListener('DOMContentLoaded', async () => {
    // جلب مباريات الدوري السعودي (مثال: competitionId = 2025)
    const data = await FootballAPI.getMatches('2025', '2025-04-25', '2025-04-30');
    
    if (data) {
        const matches = data.matches;
        const tableBody = document.querySelector('#matchesTable tbody');
        
        matches.forEach(match => {
            const row = document.createElement('tr');
            row.innerHTML = 
                <td>${match.competition.name}</td>
                <td>${new Date(match.utcDate).toLocaleDateString()}</td>
                <td>${match.homeTeam.name}</td>
                <td>vs</td>
                <td>${match.awayTeam.name}</td>
                <td>${match.status}</td>
            ;
            tableBody.appendChild(row);
        });
    }
});
