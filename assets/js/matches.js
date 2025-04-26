// RapidAPI Configuration
const RAPIDAPI_KEY = '795f377634msh4be097ebbb6dce3p1bf238jsn583f1b9cf438';
const RAPIDAPI_HOST = 'api-football-v1.p.rapidapi.com';

async function fetchMatches() {
    try {
        showLoading();
        
        const response = await fetch(`https://${RAPIDAPI_HOST}/v3/fixtures?league=39&season=2025`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
            }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        renderMatches(data.response);
        
    } catch (error) {
        handleError(error);
    } finally {
        hideLoading();
    }
}
