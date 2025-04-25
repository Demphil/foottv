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
