const API_KEY = '8d831470f41e4dbe983fba512cc0c795'; // استبدلها بمفتاحك الحقيقي
const BASE_URL = 'https://api.football-data.org/v4';

async function fetchData(endpoint) {
    try {
        const response = await fetch(${BASE_URL}${endpoint}, {
            headers: {
                'X-Auth-Token': API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(HTTP error! status: ${response.status});
        }
        
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return null;
    }
}

// وظائف جاهزة للاستخدام
export const FootballAPI = {
    getMatches: (competitionId, dateFrom, dateTo) => 
        fetchData(/competitions/${competitionId}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}),
    
    getLiveMatches: () => 
        fetchData('/matches?status=LIVE'),
    
    getTeamInfo: (teamId) => 
        fetchData(/teams/${teamId}),
    
    getCompetitions: () => 
        fetchData('/competitions')
};
