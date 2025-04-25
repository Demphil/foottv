// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

const API_KEY = '8d831470f41e4dbe983fba512cc0c795'; // مfootball-data.org

app.use(express.static('public'));

// Endpoint وسيط لجلب المباريات
app.get('/api/matches', async (req, res) => {
    try {
        const response = await fetch('https://api.football-data.org/v4/matches', {
            headers: { 'X-Auth-Token': API_KEY }
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ في جلب البيانات' });
    }
});

app.listen(PORT, () => {
    console.log(Server is running on http://localhost:${PORT});
});
