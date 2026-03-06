import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  TrendingUp, Users, ArrowUpRight, ArrowDownRight, 
  Activity, Eye, DollarSign, Search, Loader2, Lock, Flame, ShieldCheck
} from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const StatCard = ({ title, value, change, trend, icon: Icon }: any) => (
  <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-zinc-800/50 rounded-xl text-zinc-400"><Icon className="w-5 h-5" /></div>
      <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
        {change}
      </div>
    </div>
    <h3 className="text-zinc-500 text-xs font-medium mb-1 uppercase tracking-wider">{title}</h3>
    <div className="text-2xl font-bold text-zinc-100 tracking-tight">{value}</div>
  </div>
);

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [winnerCount, setWinnerCount] = useState('0');
  const [predictiveWinners, setPredictiveWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // 1. 获取真数据的函数
  const loadData = async () => {
    setLoading(true);
    // 获取统计数字
    const { count } = await supabase.from('trending_products').select('*', { count: 'exact', head: true });
    setWinnerCount(count?.toString() || '0');
    
    // 获取爆款榜单
    const { data } = await supabase.from('trending_products').select('*').order('id', { ascending: true }).limit(3);
    if (data) setPredictiveWinners(data);
    setLoading(false);
  };

  // 2. 点击刷新的逻辑：调用我们刚才写的后端 API
  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch('/api/sync-winners'); // 调用后端抽水机
      await loadData(); // 重新加载数据
      alert("✅ 实时真数据抓取成功！");
    } catch (e) {
      alert("同步失败，请检查 API Key 环境变量");
    }
    setSyncing(false);
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 text-white p-4 pb-20">
      {/* 顶部统计 - 读数据库 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Potential Winners" value={winnerCount} change="+100%" trend="up" icon={TrendingUp} />
        <StatCard title="Intent Leads" value="1,284" change="+12%" trend="up" icon={Users} />
        <StatCard title="Ad Impressions" value={(parseInt(winnerCount)*12.5).toFixed(1) + 'K'} change="+8.1%" trend="up" icon={Eye} />
        <StatCard title="Est. Revenue" value={"$" + (parseInt(winnerCount)*420).toLocaleString()} change="-2.4%" trend="down" icon={DollarSign} />
      </div>

      {/* 飙升榜模块 */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold tracking-tight">72h 飙升预测榜 (真数据)</h2>
          </div>
          <button 
            onClick={handleSync} 
            disabled={syncing}
            className="text-[10px] font-bold text-emerald-500 hover:rotate-180 transition-all disabled:opacity-50"
          >
            {syncing ? '抓取中...' : '刷新数据 ↻'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predictiveWinners.map((item) => (
            <div key={item.id} className="group relative bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-emerald-500/30 overflow-hidden transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold bg-zinc-800 text-zinc-300 px-2 py-1 rounded-full border border-zinc-700">{item.tag}</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">{item.growth}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
              <p className="text-zinc-500 text-xs">来源: {item.platform}</p>
              
              <div className="absolute inset-0 bg-black/80 backdrop-blur-[6px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <Lock className="w-6 h-6 text-emerald-500 mb-2" />
                <p className="text-white font-bold text-sm">解锁详细报告</p>
                <button className="mt-3 bg-emerald-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full">立即升级 PRO</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 搜索控制台 */}
      <div className="pt-8 border-t border-zinc-800/60">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">Mission Control <ShieldCheck className="w-4 h-4 text-emerald-500" /></h1>
            <p className="text-zinc-400 text-sm">输入关键词，启动全网爆款追踪任务。</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="输入关键词 (如: Blender)..."
              className="w-full sm:w-80 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500 outline-none"
            />
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-2.5 rounded-xl text-sm font-bold w-full sm:w-auto">Run Analysis</button>
          </div>
        </div>
      </div>
    </div>
  );
}
