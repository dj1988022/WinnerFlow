import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Share2, 
  MessageCircle, 
  Eye,
  Info
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { mockTrends, TrendItem } from '../data/mockTrends';

export default function FutureWinners() {
  const [selectedTrend, setSelectedTrend] = useState<TrendItem | null>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Future Winners Prediction</h1>
        <p className="text-zinc-400">AI-powered forecasting engine. Spot viral products BEFORE they explode.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-zinc-100">Potential Breakouts</h3>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {mockTrends.filter(t => t.prediction === 'Exploding').length} Exploding
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            {mockTrends.map(trend => (
              <motion.div
                key={trend.id}
                layoutId={trend.id}
                onClick={() => setSelectedTrend(trend)}
                className={`p-3 rounded-xl border transition-all cursor-pointer group flex gap-4 ${
                  selectedTrend?.id === trend.id
                    ? 'bg-emerald-500/10 border-emerald-500/50'
                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                  <img src={trend.thumbnail} alt={trend.productName} className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                    {trend.viralScore}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-zinc-200 text-sm truncate pr-2">{trend.productName}</h4>
                    {trend.prediction === 'Exploding' ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : trend.prediction === 'Rising' ? (
                      <TrendingUp className="w-4 h-4 text-blue-500 shrink-0" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mb-2">{trend.category}</p>
                  
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {(trend.stats.views / 1000).toFixed(1)}k
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-emerald-500" />
                      +{trend.stats.growthRate}%/h
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 min-h-[600px] flex flex-col relative overflow-hidden">
            {selectedTrend ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Header Stats */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-zinc-800 pb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">{selectedTrend.productName}</h2>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                        selectedTrend.prediction === 'Exploding' ? 'bg-emerald-500 text-black' :
                        selectedTrend.prediction === 'Rising' ? 'bg-blue-500 text-white' :
                        'bg-zinc-700 text-zinc-300'
                      }`}>
                        {selectedTrend.prediction}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Share2 className="w-4 h-4" />
                        {selectedTrend.stats.shares.toLocaleString()} Shares
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4" />
                        {selectedTrend.stats.comments.toLocaleString()} Comments
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-1">Viral Confidence</div>
                    <div className="flex items-center gap-2">
                      <div className="text-3xl font-bold text-white">{selectedTrend.viralScore}</div>
                      <div className={`text-sm font-medium px-2 py-0.5 rounded ${
                        selectedTrend.confidenceLevel === 'High' ? 'bg-emerald-500/20 text-emerald-400' :
                        selectedTrend.confidenceLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        {selectedTrend.confidenceLevel}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prediction Chart */}
                <div className="h-[250px] w-full bg-zinc-900/30 rounded-xl border border-zinc-800/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      Velocity Prediction (Next 24h)
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Actual</span>
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500/30 border border-emerald-500 border-dashed"></div>Predicted</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedTrend.chartData}>
                      <defs>
                        <linearGradient id="colorViral" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="time" stroke="#52525b" tick={{fill: '#71717a', fontSize: 10}} tickLine={false} axisLine={false} />
                      <YAxis stroke="#52525b" tick={{fill: '#71717a', fontSize: 10}} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                        itemStyle={{ color: '#e4e4e7' }}
                      />
                      <ReferenceLine x="16h" stroke="#52525b" strokeDasharray="3 3" label={{ value: 'NOW', position: 'top', fill: '#71717a', fontSize: 10 }} />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorViral)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* AI Analysis Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Why it's viral */}
                  <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-zinc-200 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      Why it's winning
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">The Hook</div>
                        <p className="text-sm text-zinc-300">{selectedTrend.aiAnalysis.hook}</p>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Emotional Triggers</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedTrend.aiAnalysis.emotionalTriggers.map((t, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risks & Opportunities */}
                  <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-zinc-200 mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-500" />
                      Strategic Intel
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-500" />
                          Risk Factors
                        </div>
                        <ul className="space-y-1">
                          {selectedTrend.aiAnalysis.riskFactors.map((r, i) => (
                            <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                              <span className="w-1 h-1 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Opportunity
                        </div>
                        <p className="text-sm text-emerald-400/90">{selectedTrend.aiAnalysis.opportunity}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  Launch Campaign for This Product
                </button>

              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-sm">Select a trend to view AI prediction analysis.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
