import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 1. 配置你的 Supabase 门票（请确保这里的 URL 和 Key 是准确的）
const supabaseUrl = 'https://emndjuleeijyuhyvyeth.supabase.co';
const supabaseKey = '这里填入你以 sb_publishable_ 开头的那个anon_key'; 
const supabase = create_client(supabaseUrl, supabaseKey);

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [keyword, setKeyword] = useState('');
  const [trends, setTrends] = useState([]);
  const [monitors, setMonitors] = useState([]);

  // 2. 加载初始数据
  const fetchData = async () => {
    // 获取近日爆款（意向分最高的前50个）
    const { data: tData } = await supabase
      .from('tiktok_trends')
      .select('*')
      .order('intent_score', { ascending: false })
      .limit(50);
    if (tData) setTrends(tData);

    // 获取正在监控的词
    const { data: mData } = await supabase.from('user_monitor_tasks').select('keyword');
    if (mData) setMonitors(mData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 3. 提交新监控任务
  const handleMonitor = async () => {
    if (!keyword) return;
    const { error } = await supabase.from('user_monitor_tasks').upsert({ keyword });
    if (!error) {
      alert(`🚀 监控指令已下达！系统将每小时巡逻一次 [${keyword}]。`);
      setKeyword('');
      fetchData();
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', backgroundColor: '#fdfdfd' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#ff0050', fontSize: '36px', marginBottom: '10px' }}>🏆 WinnerFlow 赢家流</h1>
        <p style={{ color: '#666' }}>AI 驱动的跨境选品情报站 · 每小时自动巡逻中</p>
      </header>

      {/* 搜索监控区 */}
      <section style={{ background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            value={keyword} 
            onChange={(e) => setKeyword(e.target.value)} 
            placeholder="输入您想 24h 持续监控的产品关键词..." 
            style={{ flex: 1, padding: '15px', borderRadius: '10px', border: '2px solid #eee', fontSize: '16px' }} 
          />
          <button 
            onClick={handleMonitor} 
            style={{ padding: '0 30px', background: '#000', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', border: 'none' }}
          >
            开启持续监控
          </button>
        </div>
        <div style={{ marginTop: '15px', fontSize: '13px', color: '#888' }}>
          📡 正在全球监控：{monitors.map(m => <span key={m.keyword} style={{marginRight: '12px', background: '#f0f0f0', padding: '2px 8px', borderRadius: '4px'}}>#{m.keyword}</span>)}
        </div>
      </section>

      {/* 爆款金榜展示 */}
      <h2 style={{ borderLeft: '5px solid #ff0050', paddingLeft: '15px', marginBottom: '20px' }}>🔥 近日爆款金榜 (Top 50)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {trends.map(item => (
          <div key={item.id} style={{ background: '#fff', border: '1px solid #eee', borderRadius: '15px', padding: '20px', transition: '0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff0050' }}>{item.intent_score}%</span>
              <span style={{ fontSize: '12px', color: '#999', background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px' }}>求购浓度</span>
            </div>
            <p style={{ fontSize: '14px', color: '#333', height: '60px', overflow: 'hidden', lineHeight: '1.5' }}>
              {item.description || '精准潜力爆款，点击查看详情'}
            </p>
            <div style={{ fontSize: '12px', color: '#007bff', background: '#eef6ff', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>
              🛒 {item.google_info || '正在同步亚马逊比价数据...'}
            </div>
            <a 
              href={item.video_url} 
              target="_blank" 
              rel="noreferrer"
              style={{ display: 'block', textAlign: 'center', padding: '12px', background: '#ff0050', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
            >
              去 TikTok 抢流量 →
            </a>
          </div>
        ))}
      </div>

      {/* 反馈与进化区 */}
      <footer style={{ marginTop: '60px', padding: '40px', background: '#111', color: '#fff', borderRadius: '20px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>🛠️ 功能进化实验室</h3>
        <p style={{ color: '#ccc', marginBottom: '20px' }}>我们需要您的建议：自动核算1688利润？AI一键生成带货话术？</p>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <textarea 
            placeholder="在这里输入您的宝贵建议，我们的工程队正在连夜叠代码..." 
            style={{ width: '100%', height: '100px', borderRadius: '10px', padding: '15px', marginBottom: '15px', border: 'none', fontSize: '14px' }} 
          />
          <button style={{ background: '#fff', color: '#000', padding: '12px 40px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            提交建议
          </button>
        </div>
      </footer>
    </div>
  );
}

// 辅助函数：创建客户端
function create_client(url, key) {
  return createClient(url, key);
}
