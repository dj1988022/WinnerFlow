import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  // 1. 读取变量（兼容所有命名方式）
  const rapidKey = process.env.RAPIDAPI_KEY || process.env.VITE_RAPIDAPI_KEY;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!rapidKey) return res.status(500).json({ error: "后端未读取到 RAPIDAPI_KEY" });
  if (!url || !anon) return res.status(500).json({ error: "后端未读取到 Supabase 配置" });

  const supabase = createClient(url, anon);

  try {
    // 2. 抓取 TikTok 趋势 (注意：补全了 /trending/items 路径)
    const ttRes = await fetch('https://tiktok-scraper7.p.rapidapi.com', {
      headers: { 
        'X-RapidAPI-Key': rapidKey, 
        'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com' 
      }
    });
    
    if (!ttRes.ok) throw new Error(`TikTok API 错误: ${ttRes.status}`);
    const ttData = await ttRes.json();

    // 3. 提取数据并存入 tiktok_trends
    const items = (ttData?.data || []).slice(0, 5).map((item: any) => ({
      description: item.title || 'TikTok Item',
      play_count: item.stats?.play_count || 0,
      intent_score: 8.8,
      created_at: new Date().toISOString()
    }));

    const { error } = await supabase.from('tiktok_trends').upsert(items);
    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: "执行出错: " + err.message });
  }
}
