import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { 
  TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Zap, 
  Eye, MessageCircle, ShoppingCart, ExternalLink, Loader2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer
} from 'recharts';

// 1. 初始化 Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function FutureWinners() {
  const [trends, setTrends] = useState<any[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. 从数据库拉取真实爆款
  useEffect(() => {
    async function fetchRealTrends() {
      const { data } = await supabase
        .from('tiktok_trends')
        .select('*')
        .order('intent_score', { ascending: false })
        .limit(20);
      
      if (data && data.length > 0) {
        // 将数据库字段映射为 UI 需要的格式
        const mappedData = data.map(item => ({
          id: item.id,
          productName: item.description?.split(' ').slice(0, 4).join(' ') || "Viral Product",
          description: item.description,
          category: "Trending Now",
          viralScore: item.intent_score, // 意向分作为爆火分
          stats: {
            views: 12000, // 假设值，后期可从数据库读取
            growthRate: (item.intent_score * 0.8).toFixed(1),
            comments: 450
          },
          videoUrl: item.video_url,
          amazonInfo: item.google_info,
          // 生成假图表数据（基于意向分），保留 UI 的美感
          chartData: [
            { name: '4h', value: 100 },
            { name: '8h', value: 300 },
            { name: '12h', value: item.intent_score * 5 },
            { name: '16h', value: item.intent_score * 8 },
            { name: '20h', value: item.intent_score * 12 },
            { name: '24h', value: item.intent_score * 15 }
          ]
        }));
        setTrends(mappedData);
        setSelectedTrend(mappedData[0]); // 默认选中第一个
      }
      setLoading(false);
    }
    fetchRealTrends();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <p className="font-mono text-sm tracking-widest">SYNCING WITH GLOBAL INTELLIGENCE...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Future Winners Prediction</h1>
        <p className="text-zinc-400">AI-powered forecasting. Real-time data from your monitoring nodes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧列表 - 真实数据 */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-semibold text-zinc-100 mb-2">Potential Breakouts</h3>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {trends.map(trend => (
              <motion.div
                key={trend.id}
                onClick={() => setSelectedTrend(trend)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-4 ${
                  selectedTrend?.id === trend.id
                    ? 'bg-emerald-500/10 border-emerald-500/50'
                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-zinc-200 text-sm truncate">{trend.productName}</h4>
                    <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
                    <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-emerald-500" /> {trend.viralScore}% Intent</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> 12k</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 右侧详情 - 真实展示 */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 min-h-[500px] flex flex-col">
            {selectedTrend && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex justify-between items-start border-b border-zinc-800 pb-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">{selectedTrend.productName}</h2>
                    <p className="text-zinc-400 text-sm italic line-clamp-1">"{selectedTrend.description}"</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-400">{selectedTrend.viralScore}</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-widest">Viral Score</div>
                  </div>
                </div>

                {/* 预测图表 */}
                <div className="h-[250px] w-full bg-zinc-900/30 rounded-xl border border-zinc-800/50 p-4">
                   <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedTrend.chartData}>
                      <XAxis dataKey="name" stroke="#52525b" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} />
                      <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={0.3} fill="#10b981" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* 亚马逊情报 & 按钮 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                    <div className="text-xs text-zinc-500 mb-2 flex items-center gap-2"><ShoppingCart className="w-3 h-3"/> Market Intel</div>
                    <div className="text-zinc-200 text-sm">{selectedTrend.amazonInfo || "Scanning Amazon Marketplace..."}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a href={selectedTrend.videoUrl} target="_blank" className="bg-white text-black py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors">
                      Watch TikTok Original <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
