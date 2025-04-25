export const getMatches = async () => {
  try {
    const response = await fetch('/data/matches.json');
    const data = await response.json();
    return data.matches.filter(match => match.status === 'LIVE');
  } catch (error) {
    console.error('Error loading matches:', error);
    return [];
  }
};
// في football.js
   const TEST_MODE = true;
   
   export const getMatches = async () => {
     if (TEST_MODE) return getTestMatches();
     // ... الكود الأصلي
   };
