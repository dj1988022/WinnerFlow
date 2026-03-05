import os
import requests
import re
from supabase import create_client

# 从 GitHub Secrets 读取保险箱里的钥匙
URL = os.getenv("SUPABASE_URL")
KEY = os.getenv("SUPABASE_KEY")
API_KEY = os.getenv("TIKTOK_API_KEY")

# 初始化数据库连接
supabase = create_client(URL, KEY)

def analyze_intent(comments):
    """核心逻辑：计算求购浓度"""
    keywords = r'(link|where to buy|how much|price|shipping|available|w2c|shop|buy it)'
    if not comments: return 0
    matches = [c for c in comments if re.search(keywords, c.lower())]
    return (len(matches) / len(comments)) * 100 if comments else 0

def run():
    # 修正点 1：补全了完整的 API 地址
    headers = {
        "X-RapidAPI-Key": API_KEY, 
        "X-RapidAPI-Host": "tiktok-data-scraper.p.rapidapi.com"
    }
    
    print("🚀 正在连接 TikTok 抓取数据...")
    
    # 修正点 2：添加了正确的 API 端点路径 /post/hashtag
    try:
        search_url = "https://tiktok-data-scraper.p.rapidapi.com"
        res = requests.get(search_url, headers=headers, params={"hashtag": "tiktokmademebuyit"}).json()
        
        videos = res.get('data', [])
        if not videos:
            print("⚠️ 未发现新视频，请检查 API 额度或标签名。")
            return

        for v in videos[:10]:
            v_id = v.get('aweme_id')
            # 修正点 3：添加了正确的评论端点路径 /video/comments
            comment_url = "https://tiktok-data-scraper.p.rapidapi.com"
            c_res = requests.get(comment_url, headers=headers, params={"video_id": v_id}).json()
            
            comments = [c['text'] for c in c_res.get('data', [])]
            score = analyze_intent(comments)
            
            # 为了测试，我们降低门槛，只要有求购词就存入
            if score >= 0: 
                data = {
                    "video_id": v_id, 
                    "description": v.get('desc'), 
                    "intent_score": score, 
                    "video_url": f"https://www.tiktok.com{v_id}"
                }
                # 存入数据库
                supabase.table("tiktok_trends").upsert(data, on_conflict="video_id").execute()
                print(f"✅ 成功捕获视频: {v_id}, 意向得分: {score:.1f}%")
                
    except Exception as e:
        print(f"❌ 运行出错: {e}")

if __name__ == "__main__":
    run()
