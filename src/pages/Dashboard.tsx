import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity,
  Eye,
  MousePointerClick,
  DollarSign
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

// Mock Data
const trendData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 6890 },
  { name: 'Sat', value: 8390 },
  { name: 'Sun', value: 10490 },
];

const categoryData = [
  { name: 'Tech', value: 400, color: '#10b981' },
  { name: 'Beauty', value: 300, color: '#3b82f6' },
  { name: 'Home', value: 300, color: '#f59e0b' },
  { name: 'Pets', value: 200, color: '#ec4899' },
];

const StatCard = ({ title, value, change, trend, icon: Icon }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700/60 transition-colors group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-zinc-800/50 rounded-lg text-zinc-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
        trend === 'up' 
          ? 'text-emerald-400 bg-emerald-500/10' 
          : 'text-rose-400 bg-rose-500/10'
      }`}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}
      </div>
    </div>
    <h3 className="text-zinc-500 text-sm font-medium mb-1">{title}</h3>
    <div className="text-2xl font-bold text-zinc-100 tracking-tight">{value}</div>
  </motion.div>
);

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mission Control</h1>
          <p className="text-zinc-400 text-sm mt-1">Real-time market intelligence & automation status.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 font-mono">LAST UPDATED: 14:32:05</span>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-900/20 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Run Analysis
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Potential Winners" 
          value="12" 
          change="+3" 
          trend="up" 
          icon={TrendingUp} 
        />
        <StatCard 
          title="Intent Leads" 
          value="1,284" 
          change="+12%" 
          trend="up" 
          icon={Users} 
        />
        <StatCard 
          title="Ad Impressions" 
          value="45.2K" 
          change="+8.1%" 
          trend="up" 
          icon={Eye} 
        />
        <StatCard 
          title="Est. Revenue" 
          value="$8,420" 
          change="-2.4%" 
          trend="down" 
          icon={DollarSign} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Trend Chart */}
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-zinc-100">Traffic Prediction</h3>
            <div className="flex gap-2">
              {['24H', '7D', '30D'].map((period) => (
                <button 
                  key={period}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    period === '7D' 
                      ? 'bg-zinc-800 text-white' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#52525b" 
                  tick={{fill: '#71717a', fontSize: 12}} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#52525b" 
                  tick={{fill: '#71717a', fontSize: 12}} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#e4e4e7' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-zinc-100 mb-6">Niche Performance</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#52525b" 
                  tick={{fill: '#a1a1aa', fontSize: 12}} 
                  tickLine={false}
                  axisLine={false}
                  width={60}
                />
                <Tooltip 
                  cursor={{fill: '#27272a', opacity: 0.4}}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                />
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

      {/* Recent Signals Table */}
      <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800/60 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-zinc-100">Live Signals</h3>
          <button className="text-sm text-emerald-500 hover:text-emerald-400 font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/80 text-zinc-500 uppercase tracking-wider font-medium">
              <tr>
                <th className="px-6 py-4">Signal Type</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Impact Score</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {[
                { type: 'Competitor Ad', source: 'TikTok', score: 92, time: '2m ago', status: 'Analyzing' },
                { type: 'Viral Trend', source: 'Google Trends', score: 88, time: '15m ago', status: 'Actionable' },
                { type: 'Negative Review', source: 'Competitor X', score: 75, time: '1h ago', status: 'Pending' },
                { type: 'Price Drop', source: 'Amazon', score: 64, time: '2h ago', status: 'Ignored' },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-200">{item.type}</td>
                  <td className="px-6 py-4 text-zinc-400">{item.source}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            item.score > 80 ? 'bg-emerald-500' : item.score > 60 ? 'bg-yellow-500' : 'bg-zinc-500'
                          }`} 
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-400">{item.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{item.time}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Actionable' ? 'bg-emerald-500/10 text-emerald-400' :
                      item.status === 'Analyzing' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-zinc-500/10 text-zinc-400'
                    }`}>
                      {item.status === 'Analyzing' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse mr-1.5" />}
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
