import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  console.log('=== API 调用开始 ===');
  console.log('SUPABASE_URL:', supabaseUrl);
  console.log('KEY 存在:', !!supabaseKey);
  console.log('KEY 前缀:', supabaseKey?.substring(0, 20));

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: "缺少 Supabase 配置" });
  }

  // 检查 URL 格式
  if (!supabaseUrl.startsWith('https://')) {
    return res.status(500).json({ error: "Supabase URL 格式错误" });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    let items: any[] = [];

    // 尝试抓取 TikTok 数据
    const rapidKey = process.env.RAPIDAPI_KEY;
    if (rapidKey) {
      try {
        console.log('正在调用 TikTok API...');
        const ttRes = await fetch(
          'https://tiktok-scraper2.p.rapidapi.com/user/videos?username=tiktok&max=10',
          {
            headers: {
              'X-RapidAPI-Key': rapidKey,
              'X-RapidAPI-Host': 'tiktok-scraper2.p.rapidapi.com'
            }
          }
        );

        console.log('TikTok API 状态:', ttRes.status);

        if (ttRes.ok) {
          const ttData = await ttRes.json();
          items = (ttData?.data?.videos || ttData?.data || []).slice(0, 5).map((item: any, index: number) => ({
            video_id: `video_${Date.now()}_${index}`,
            description: item.desc || item.title || 'TikTok Item',
            play_count: item.stats?.play_count || item.play_count || 0,
            intent_score: 8.8,
            created_at: new Date().toISOString()
          }));
          console.log('TikTok 数据抓取成功, 条数:', items.length);
        } else {
          console.log('TikTok API 返回非 200 状态');
        }
      } catch (e: any) {
        console.log('TikTok API 失败:', e.message || e);
      }
    }

    // 如果没有数据，使用模拟数据
    if (items.length === 0) {
      console.log('使用模拟数据');
      const now = new Date().toISOString();
      items = [
        { video_id: `test_${Date.now()}_1`, description: '热门产品趋势 #fyp', play_count: 1500000, intent_score: 9.2, created_at: now },
        { video_id: `test_${Date.now()}_2`, description: '电商热门产品展示', play_count: 1200000, intent_score: 8.9, created_at: now },
        { video_id: `test_${Date.now()}_3`, description: '新品爆款推荐', play_count: 980000, intent_score: 8.7, created_at: now },
      ];
    }

    console.log('准备插入数据到 tiktok_trends 表');
    console.log('数据条数:', items.length);
    console.log('数据示例:', JSON.stringify(items[0]));

    // 首先测试连接 - 查询表是否存在
    const { data: testData, error: testError } = await supabase
      .from('tiktok_trends')
      .select('count', { count: 'exact' })
      .limit(1);

    console.log('表连接测试:', { testData, testError });

    // 执行插入
    const { data, error } = await supabase
      .from('tiktok_trends')
      .insert(items)
      .select();

    console.log('插入结果:', { data, error });

    if (error) {
      console.log('Supabase 错误详情:', JSON.stringify(error, null, 2));
      return res.status(500).json({
        error: "数据库错误: " + error.message,
        details: error,
        hint: error.hint,
        code: error.code
      });
    }

    // 验证插入是否成功
    if (data && data.length > 0) {
      console.log('插入成功! 插入条数:', data.length);
      return res.status(200).json({ success: true, count: data.length, message: "数据已存入数据库！" });
    } else {
      console.log('警告: 插入返回空数据');
      // 可能是 RLS 阻止了插入但没有返回错误
      return res.status(500).json({
        error: "数据插入失败",
        details: "可能由于 RLS 策略或权限问题"
      });
    }
  } catch (err: any) {
    console.error('执行错误:', err);
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}
