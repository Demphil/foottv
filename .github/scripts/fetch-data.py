import requests
import json
import os

API_KEY = os.environ['API_KEY']
URL = "https://api.football-data.org/v4/matches"

headers = {
    'X-Auth-Token': API_KEY,
    'Content-Type': 'application/json'
}

response = requests.get(URL, headers=headers)
data = response.json()

with open('../data/matches.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
