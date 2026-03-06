import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { 
  TrendingUp, Users, ArrowUpRight, ArrowDownRight, 
  Activity, Eye, DollarSign, Search, Loader2
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
  <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-5 group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-zinc-800/50 rounded-lg text-zinc-400">
        <Icon className="w-5 h-5" />
      </div>
      <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
        trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
      }`}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}
      </div>
    </div>
    <h3 className="text-zinc-500 text-sm font-medium mb-1">{title}</h3>
    <div className="text-2xl font-bold text-zinc-100 tracking-tight">{value}</div>
  </div>
);

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [winnerCount, setWinnerCount] = useState('0');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getStats = async () => {
    try {
      const { count } = await supabase.from('tiktok_trends').select('*', { count: 'exact', head: true });
      if (count !== null) setWinnerCount(count.toString());
    } catch (err) {
      console.error("Fetch stats error:", err);
    }
  };

  useEffect(() => { getStats(); }, []);

  const handleRunAnalysis = async () => {
    const currentQuery = searchQuery.trim();
    if (!currentQuery) {
      alert("Please enter a keyword first!");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { error } = await supabase
        .from('user_monitor_tasks')
        .upsert({ 
          keyword: currentQuery,
          created_at: new Date().toISOString()
        });

      await new Promise(resolve => setTimeout(resolve, 1500));

      if (!error) {
        alert(`📡 Mission Dispatched: Tracking [${currentQuery}] now.`);
        setSearchQuery('');
        getStats();
      } else {
        // 如果这里报错 "Forbidden use of secret API key"，请务必更换你的 VITE_SUPABASE_ANON_KEY
        alert(`Database Issue: ${error.message}`);
      }
    } catch (err) {
      console.error("Runtime error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mission Control</h1>
          <p className="text-zinc-400 text-sm mt-1">Real-time market intelligence & automation status.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Monitor keyword..."
              className="bg-zinc-900/50 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors w-48 md:w-64"
            />
          </div>
          <button 
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg min-w-[140px] justify-center ${
              isAnalyzing ? 'bg-zinc-800 text-zinc-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Potential Winners" value={winnerCount} change="+100%" trend="up" icon={TrendingUp} />
        <StatCard title="Intent Leads" value="1,284" change="+12%" trend="up" icon={Users} />
        <StatCard title="Ad Impressions" value="45.2K" change="+8.1%" trend="up" icon={Eye} />
        <StatCard title="Est. Revenue" value="$8,420" change="-2.4%" trend="down" icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-6">
          <h3 className="text-zinc-100 mb-6 text-lg font-semibold">Traffic Prediction</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" tick={{fill: '#71717a', fontSize: 12}} />
                <YAxis stroke="#52525b" tick={{fill: '#71717a', fontSize: 12}} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-6">
          <h3 className="text-zinc-100 mb-6 text-lg font-semibold">Niche Performance</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#52525b" tick={{fill: '#a1a1aa', fontSize: 12}} width={60} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
