import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(req: any, res: any) {
  const rapidKey = process.env.VITE_RAPIDAPI_KEY;

  try {
    const ttRes = await fetch('https://tiktok-scraper7.p.rapidapi.com', {
      headers: { 'X-RapidAPI-Key': rapidKey!, 'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com' }
    });
    const ttData = await ttRes.json();

    const azRes = await fetch('https://real-time-amazon-data.p.rapidapi.com', {
      headers: { 'X-RapidAPI-Key': rapidKey!, 'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com' }
    });
    const azData = await azRes.json();

    const winners = [
      { 
        name: ttData?.data?.[0]?.title?.slice(0, 30) || 'TikTok 爆款', 
        growth: '+320%', platform: 'TikTok', tag: '🔥 热门视频', status: 'High Potential' 
      },
      { 
        name: azData?.data?.products?.[0]?.product_title?.slice(0, 30) || 'Amazon 爆款', 
        growth: '+150%', platform: 'Amazon', tag: '📦 销量飙升', status: 'Rising' 
      }
    ];

    await supabase.from('trending_products').upsert(winners);
    res.status(200).json({ success: true, message: "Sync Complete" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
