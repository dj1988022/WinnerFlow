import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// 🚀 安全读取 Vercel 的环境变量
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function WinnerFlow() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  // 1. 获取爆款数据
  const fetchData = async () => {
    try {
      const { data } = await supabase
        .from('tiktok_trends')
        .select('*')
        .order('intent_score', { ascending: false })
        .limit(50);
      if (data) setTrends(data);
    } catch (e) {
      console.error("数据库连接失败", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // 2. 开启监控指令
  const handleMonitor = async () => {
    if (!keyword) return alert('请输入关键词');
    const { error } = await supabase.from('user_monitor_tasks').upsert({ keyword });
    if (!error) {
      alert(`✅ 监控已开启！机器人已出发去巡逻 [${keyword}]`);
      setKeyword('');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#ff0050', fontSize: '36px' }}>🏆 WinnerFlow 赢家流</h1>
        <p>24h 全网爆款巡逻站 · 实时情报同步中</p>
      </header>

      {/* 搜索监控区 */}
      <div style={{ display: 'flex', gap: '10px', margin: '30px 0' }}>
        <input 
          value={keyword} 
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="输入监控关键词，如 'Gym set'..." 
          style={{ flex: 1, padding: '15px', borderRadius: '10px', border: '2px solid #eee' }}
        />
        <button onClick={handleMonitor} style={{ padding: '0 30px', background: '#000', color: '#fff', borderRadius: '10px', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}>
          开启持续监控
        </button>
      </div>

      {/* 排行榜展示 */}
      <h2>🔥 近日爆款金榜</h2>
      {loading ? <p>正在安全连接数据库...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {trends.map(item => (
            <div key={item.id} style={{ border: '1px solid #eee', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff0050' }}>{item.intent_score}% <span style={{fontSize:'12px', color:'#999'}}>意向分</span></div>
              <p style={{ height: '60px', overflow: 'hidden' }}>{item.description}</p>
              <div style={{ fontSize: '12px', color: '#007bff', background: '#f0f7ff', padding: '8px', borderRadius: '5px' }}>🛒 {item.google_info || '同步价格中...'}</div>
              <a href={item.video_url} target="_blank" style={{ display: 'block', marginTop: '15px', color: '#ff0050', textDecoration: 'none', fontWeight: 'bold' }}>查看视频 →</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
