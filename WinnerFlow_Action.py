import os
import requests
import re
from supabase import create_client

# 从你设置的“保险箱”读取密钥
URL = os.getenv("SUPABASE_URL")
KEY = os.getenv("SUPABASE_KEY")
API_KEY = os.getenv("TIKTOK_API_KEY")

supabase = create_client(URL, KEY)

def analyze_intent(comments):
    """核心逻辑：计算求购浓度"""
    keywords = r'(link|where to buy|how much|price|shipping|available|w2c|shop|buy it)'
    if not comments: return 0
    matches = [c for c in comments if re.search(keywords, c.lower())]
    return (len(matches) / len(comments)) * 100 if comments else 0

def run():
    headers = {"X-RapidAPI-Key": API_KEY, "X-RapidAPI-Host": "tiktok-data-scraper.p.rapidapi.com"}
    # 抓取 TikTok 带货标签
    res = requests.get("https://tiktok-data-scraper.p.rapidapi.com", headers=headers, params={"hashtag": "tiktokmademebuyit"}).json()
    videos = res.get('data', [])
    for v in videos[:10]:
        v_id = v.get('aweme_id')
        c_res = requests.get("https://tiktok-data-scraper.p.rapidapi.com", headers=headers, params={"video_id": v_id}).json()
        comments = [c['text'] for c in c_res.get('data', [])]
        score = analyze_intent(comments)
        if score > 15:
            data = {"video_id": v_id, "description": v.get('desc'), "intent_score": score, "video_url": f"https://www.tiktok.com{v_id}"}
            supabase.table("tiktok_trends").upsert(data, on_conflict="video_id").execute()
            print(f"✅ 捕获爆款: {v_id}, 得分: {score:.1f}%")

if __name__ == "__main__":
    run()
