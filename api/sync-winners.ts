import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  // 1. 读取变量
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    return res.status(500).json({ error: "后端未读取到 Supabase 配置" });
  }

  const supabase = createClient(url, anon);

  try {
    // 直接使用模拟数据（暂时跳过 API 调用）
    const items = [
      { description: '热门 TikTok 视频示例 1 - #fyp #viral', play_count: 1500000, intent_score: 9.2, created_at: new Date().toISOString() },
      { description: '热门 TikTok 视频示例 2 - 创意产品展示', play_count: 1200000, intent_score: 8.9, created_at: new Date().toISOString() },
      { description: '热门 TikTok 视频示例 3 - 新奇好物', play_count: 980000, intent_score: 8.7, created_at: new Date().toISOString() },
      { description: '热门 TikTok 视频示例 4 - 电商热门', play_count: 850000, intent_score: 8.5, created_at: new Date().toISOString() },
      { description: '热门 TikTok 视频示例 5 - 趋势产品', play_count: 720000, intent_score: 8.3, created_at: new Date().toISOString() },
    ];

    // 存入数据库
    const { error } = await supabase.from('tiktok_trends').upsert(items);
    if (error) {
      console.log('Supabase error:', error);
      return res.status(500).json({ error: "数据库错误: " + error.message });
    }

    return res.status(200).json({ success: true, items, message: "使用模拟数据" });
  } catch (err: any) {
    console.error('错误详情:', err);
    return res.status(500).json({ error: "执行出错: " + err.message });
  }
}
