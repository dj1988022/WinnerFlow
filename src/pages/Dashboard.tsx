import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  TrendingUp, Users, ArrowUpRight, ArrowDownRight, 
  Activity, Eye, DollarSign, Search, Loader2, Lock, Flame, Sparkles, ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

// 初始化 Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// --- 基础图表数据保持不变 ---
const trendData = [
  { name: 'Mon', value: 4000 }, { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 }, { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 6890 }, { name: 'Sat', value: 8390 },
  { name: 'Sun', value: 10490 },
];

const categoryData = [
  { name: 'Tech', value: 400, color: '#10b981' },
  { name: 'Beauty', value: 300, color: '#3b82f6' },
  { name: 'Home', value: 300, color: '#f59e0b' },
  { name: 'Pets', value: 200, color: '#ec4899' },
];

const StatCard = ({ title, value, change, trend, icon: Icon }: any) => (
  <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 hover:border-zinc-700/60 transition-all shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-zinc-800/50 rounded-xl text-zinc-400">
        <Icon className="w-5 h-5" />
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
        trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
      }`}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}
      </div>
    </div>
    <h3 className="text-zinc-500 text-xs font-medium mb-1 uppercase tracking-wider">{title}</h3>
    <div className="text-2xl font-bold text-zinc-100 tracking-tight">{value}</div>
  </div>
);

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [winnerCount, setWinnerCount] = useState('12');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // --- 1. 改为使用 State 存储真数据 ---
  const [predictiveWinners, setPredictiveWinners] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // --- 2. 增加获取数据库真数据的函数 ---
  const fetchRealWinners = async () => {
    try {
      // 从你准备建的 trending_products 表读取数据
      const { data, error } = await supabase
        .from('trending_products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (data && data.length > 0) {
        setPredictiveWinners(data);
      } else {
        // 如果数据库没数据，显示备用数据防止页面空洞
        setPredictiveWinners([
          { id: 1, name: '便携式榨汁杯', growth: '+230%', platform: 'TikTok', tag: '爆款指数: 8.5', status: 'High Potential' },
          { id: 2, name: '磁吸手机支架', growth: '+210%', platform: 'Amazon', tag: '爆款指数: 8.2', status: 'Rising' },
          { id: 3, name: '宠物吸毛器', growth: '+190%', platform: 'TikTok', tag: '爆款指数: 7.9', status: 'Trending' },
        ]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchRealWinners();
    // 获取统计数字
    const getStats = async () => {
      const { count } = await supabase.from('tiktok_trends').select('*', { count: 'exact', head: true });
      if (count !== null) setWinnerCount(count.toString());
    };
    getStats();
  }, []);

  const handleRunAnalysis = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a keyword first!");
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      alert(`📡 搜索成功！\n\n当前检测到 [${searchQuery}] 相关产品数据。\n\n提示：PRO 会员可开启 24h 自动追踪。`);
    }, 1500);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 text-white p-4 pb-20">
      
      {/* A. 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Potential Winners" value={winnerCount} change="+100%" trend="up" icon={TrendingUp} />
        <StatCard title="Intent Leads" value="1,284" change="+12%" trend="up" icon={Users} />
        <StatCard title="Ad Impressions" value="45.2K" change="+8.1%" trend="up" icon={Eye} />
        <StatCard title="Est. Revenue" value="$8,420" change="-2.4%" trend="down" icon={DollarSign} />
      </div>

      {/* B. 飙升榜 - 现在数据是动态的 */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-500/10 rounded-lg">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">72h 飙升预测榜</h2>
              <p className="text-zinc-500 text-xs">AI 实时扫描全网社交信号，定位爆发前夜的黑马</p>
            </div>
          </div>
          <button onClick={fetchRealWinners} className="text-[10px] font-bold text-emerald-500 hover:rotate-180 transition-transform">
             刷新数据 ↻
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dataLoading ? (
            <div className="col-span-3 h-32 flex items-center justify-center text-zinc-500 italic">正在同步全球实时数据...</div>
          ) : (
            predictiveWinners.map((item) => (
              <div key={item.id} className="group relative bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 hover:border-emerald-500/30 transition-all cursor-pointer overflow-hidden shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full border border-zinc-700">
                    {item.tag}
                  </span>
                  <div className="flex items-center gap-1 text-emerald-400 font-bold font-mono text-sm">
                    <Activity className="w-3 h-3" />
                    {item.growth}
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-emerald-400 transition-colors">{item.name}</h3>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium">
                  <span>来源: {item.platform}</span>
                  <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                  <span className="text-zinc-400 uppercase">{item.status || 'TRENDING'}</span>
                </div>
                
                <div className="absolute inset-0 bg-black/80 backdrop-blur-[6px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Lock className="w-6 h-6 text-emerald-500 mb-2" />
                  <p className="text-white font-bold text-sm">解锁深度分析数据</p>
                  <p className="text-[10px] text-zinc-400 mt-1 mb-4 text-center px-6">包含：投放成本、利润计算、供应商链接</p>
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black px-5 py-2 rounded-full shadow-xl">
                    立即注册 / 升级 PRO
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* C. Mission Control */}
      <div className="pt-8 border-t border-zinc-800/60">
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white tracking-tight">Mission Control</h1>
              <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-bold text-emerald-500">
                <ShieldCheck className="w-3 h-3" /> LIVE
              </div>
            </div>
            <p className="text-zinc-400 text-sm">输入关键词，启动全网爆款追踪任务。</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="输入产品关键词 (如: Blender, Lamp)..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button 
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isAnalyzing ? 'bg-zinc-800 text-zinc-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
              {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
            </button>
          </div>
        </div>

        {/* D. 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" tick={{fill: '#71717a', fontSize: 10}} />
                <YAxis stroke="#52525b" tick={{fill: '#71717a', fontSize: 10}} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={0.1} fill="#10b981" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 h-[400px]">
             <h3 className="text-zinc-100 mb-8 text-sm font-semibold">Niche Performance</h3>
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#52525b" tick={{fill: '#a1a1aa', fontSize: 11}} width={80} />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
