#!/usr/bin/env python3
import requests
import json
from datetime import datetime, timedelta
import os

# Config
API_KEY = os.getenv("FOOTBALL_API_KEY", "your_fallback_key_here")
DATA_FILE = "data/matches.json"
BASE_URL = "https://api.football-data.org/v4"

def fetch_matches():
    """Fetch matches data from API"""
    try:
        today = datetime.now().strftime('%Y-%m-%d')
        next_week = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
        
        response = requests.get(
            f"{BASE_URL}/matches?dateFrom={today}&dateTo={next_week}",
            headers={"X-Auth-Token": API_KEY},
            timeout=10  # 10 ثواني كحد أقصى للانتظار
        )
        response.raise_for_status()
        
        return {
            "last_updated": datetime.utcnow().isoformat() + "Z",
            "matches": response.json().get('matches', [])
        }
        
    except Exception as e:
        print(f"API Error: {str(e)}")
        return None

def save_data(data):
    """Save data to JSON file"""
    try:
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"File Error: {str(e)}")
        return False

if name == "main":
    print("⏳ جلب بيانات المباريات...")
    matches_data = fetch_matches()
    
    if matches_data and save_data(matches_data):
        print(f"✅ تم تحديث {len(matches_data['matches'])} مباراة بنجاح")
    else:
        print("❌ فشل في تحديث البيانات")
        exit(1)
