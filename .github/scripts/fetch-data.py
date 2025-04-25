#!/usr/bin/env python3
import os
import json
import requests
from datetime import datetime, timedelta

# Configuration
API_KEY = os.getenv('FOOTBALL_API_KEY')  # يُفضل استخدام Secrets
DATA_FILE = 'data/matches.json'
LEAGUES = ['PL', 'PD', 'SA', 'BL1', 'FL1', 'SPL']  # رموز البطولات

def fetch_matches():
    base_url = 'https://api.football-data.org/v4/matches'
    headers = {'X-Auth-Token': API_KEY}
    
    # تحديد نطاق التاريخ (اليوم + 7 أيام)
    date_from = datetime.now().strftime('%Y-%m-%d')
    date_to = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
    
    matches = []
    
    for league in LEAGUES:
        url = f'{base_url}?competitions={league}&dateFrom={date_from}&dateTo={date_to}'
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            matches.extend(data['matches'])
        except Exception as e:
            print(f'Error fetching {league}: {e}')
    
    return {
        'last_updated': datetime.utcnow().isoformat() + 'Z',
        'matches': matches
    }

def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if name == 'main':
    if not API_KEY:
        print('Error: API_KEY not set!')
        exit(1)
    
    print('Fetching latest matches data...')
    data = fetch_matches()
    save_data(data)
    print(f'Successfully updated {len(data["matches"])} matches')
