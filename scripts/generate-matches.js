// generate-matches.js
const fs = require('fs');

const leagues = [
  { id: 39, name: "الدوري الممتاز", country: "إنجلترا" },
  { id: 140, name: "الدوري الإسباني", country: "إسبانيا" },
  { id: 61, name: "الدوري الفرنسي", country: "فرنسا" }
];

const teams = [
  { id: 40, name: "أرسنال", logo: "arsenal.png" },
  { id: 50, name: "مانشستر سيتي", logo: "mancity.png" },
  { id: 541, name: "ريال مدريد", logo: "realmadrid.png" },
  { id: 529, name: "برشلونة", logo: "barcelona.png" }
];

function generateMatches() {
  const matches = [];
  const startDate = new Date('2025-04-26');
  
  for (let i = 0; i < 14; i++) {
    const matchDate = new Date(startDate);
    matchDate.setDate(startDate.getDate() + i);
    
    matches.push({
      fixture: {
        id: 1000000 + i,
        date: matchDate.toISOString(),
        status: { short: "NS", long: "Not Started" }
      },
      league: leagues[i % leagues.length],
      teams: {
        home: teams[i % teams.length],
        away: teams[(i + 1) % teams.length]
      },
      goals: { home: null, away: null }
    });
  }
  
  fs.writeFileSync('data/matches.json', JSON.stringify({ response: matches }, null, 2));
}

generateMatches();
