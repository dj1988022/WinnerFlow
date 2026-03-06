import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  // 兼容逻辑：同时尝试读取带 VITE 和不带 VITE 的变量
  const rapidKey = process.env.RAPIDAPI_KEY || process.env.VITE_RAPIDAPI_KEY;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnon = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  // 1. 诊断：如果缺钥匙，直接告诉前端缺哪一把
  if (!rapidKey) return res.status(500).json({ error: "环境变量缺少 RAPIDAPI_KEY" });
  if (!supabaseUrl || !supabaseAnon) return res.status(500).json({ error: "环境变量缺少 Supabase 配置" });

  const supabase = createClient(supabaseUrl, supabaseAnon);

  try {
    // 2. 抓取 TikTok 趋势
    const ttRes = await fetch('https://tiktok-scraper7.p.rapidapi.com', {
      headers: { 
        'X-RapidAPI-Key': rapidKey, 
        'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com' 
      }
    });
    
    if (!ttRes.ok) throw new Error(`TikTok API 响应错误: ${ttRes.status}`);
    const ttData = await ttRes.json();

    // 3. 抓取 Amazon 趋势
    const azRes = await fetch('https://real-time-amazon-data.p.rapidapi.com', {
      headers: { 
        'X-RapidAPI-Key': rapidKey, 
        'X-RapidAPI-Host': 'real-time-amazon-data.p.guidedapi.com' 
      }
    });
    const azData = await azRes.json();

    // 4. 映射数据到 tiktok_trends 表
    const winners = [
      { 
        description: ttData?.data?.[0]?.title || 'TikTok Trending Item', 
        play_count: ttData?.data?.[0]?.stats?.play_count || 100000,
        intent_score: 9.2,
        created_at: new Date().toISOString()
      }
    ];

    const { error } = await supabase.from('tiktok_trends').upsert(winners);
    if (error) throw error;

    res.status(200).json({ success: true, message: "同步成功" });
  } catch (err: any) {
    res.status(500).json({ error: "执行失败: " + err.message });
  }
}
步失败，请确保 Vercel 环境变量已配置并 Redeploy
