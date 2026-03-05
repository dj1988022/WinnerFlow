import os
import requests
import re
import time
from supabase import create_client

URL = os.getenv("SUPABASE_URL")
KEY = os.getenv("SUPABASE_KEY")
API_KEY = os.getenv("TIKTOK_API_KEY")

supabase = create_client(URL, KEY)

def get_amazon_price(keyword):
    """联动亚马逊查价"""
    url = "https://amazon-real-time-data.p.rapidapi.com"
    headers = {"X-RapidAPI-Key": API_KEY, "X-RapidAPI-Host": "amazon-real-time-data.p.rapidapi.com"}
    try:
        # 仅针对高分视频查价，节省额度
        res = requests.get(url, headers=headers, params={"query": keyword, "country": "US"}).json()
        product = res.get('data', {}).get('products', [{}])[0]
        return f"亚逊同款: {product.get('product_price', '询价中')} | 评分: {product.get('product_star_rating', '新品')}"
    except: return "查看亚马逊同款"

def run_engine():
    headers = {"X-RapidAPI-Key": API_KEY, "X-RapidAPI-Host": "tiktok-data-scraper.p.rapidapi.com"}
    
    # 获取所有监控任务
    tasks = supabase.table("user_monitor_tasks").select("keyword").eq("is_active", True).execute()
    keywords = [t['keyword'] for t in tasks.data]
    
    print(f"📡 正在巡逻关键词: {keywords}")

    for kw in keywords:
        search_url = "https://tiktok-data-scraper.p.rapidapi.com"
        res = requests.get(search_url, headers=headers, params={"keyword": kw, "count": 20}).json()
        
        for v in res.get('data', []):
            v_id = v.get('aweme_id')
            # 抓取评论算意向
            c_url = "https://tiktok-data-scraper.p.rapidapi.com"
            c_res = requests.get(c_url, headers=headers, params={"video_id": v_id}).json()
            comments = [c['text'] for c in c_res.get('data', [])]
            
            score = (len([c for c in comments if re.search(r'(link|buy|price|shop|where)', c.lower())]) / len(comments) * 100) if comments else 0
            
            # 只有有价值的数据才去查亚马逊，省API钱
            amazon_info = get_amazon_price(kw) if score > 15 else "点击查看同款"
            
            data = {
                "video_id": v_id,
                "description": v.get('desc') or "精准潜力爆款",
                "intent_score": round(score, 2),
                "video_url": f"https://www.tiktok.com{v_id}",
                "google_info": amazon_info # 字段复用展示亚马逊信息
            }
            supabase.table("tiktok_trends").upsert(data, on_conflict="video_id").execute()
            print(f"✅ 同步完成: {v_id} | 意向: {score:.1f}%")

if __name__ == "__main__":
    run_engine()
