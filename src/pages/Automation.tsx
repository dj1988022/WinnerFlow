import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Play, 
  Pause, 
  MoreHorizontal, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  GitBranch, 
  DollarSign, 
  TrendingUp, 
  Bell, 
  Flame, 
  Search, 
  MessageSquare, 
  Send,
  Loader2,
  Settings
} from 'lucide-react';
import { initialWorkflows, Workflow, WorkflowNode } from '../data/mockWorkflows';

const iconMap: Record<string, any> = {
  DollarSign,
  GitBranch,
  TrendingUp,
  Bell,
  Flame,
  Search,
  MessageSquare,
  Send,
  Clock
};

export default function Automation() {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const toggleWorkflow = (id: string) => {
    setWorkflows(workflows.map(w => 
      w.id === id ? { ...w, isActive: !w.isActive } : w
    ));
  };

  const runSimulation = (workflow: Workflow) => {
    setActiveWorkflow(workflow);
    setIsRunning(true);
    
    // Simulate node execution
    let currentNodeIndex = 0;
    const interval = setInterval(() => {
      if (currentNodeIndex >= workflow.nodes.length) {
        clearInterval(interval);
        setIsRunning(false);
        setTimeout(() => setActiveWorkflow(null), 2000);
        return;
      }

      setWorkflows(prev => prev.map(w => {
        if (w.id !== workflow.id) return w;
        
        const newNodes = [...w.nodes];
        // Complete previous node
        if (currentNodeIndex > 0) {
          newNodes[currentNodeIndex - 1] = { ...newNodes[currentNodeIndex - 1], status: 'completed' };
        }
        // Start current node
        newNodes[currentNodeIndex] = { ...newNodes[currentNodeIndex], status: 'running' };
        
        return { ...w, nodes: newNodes };
      }));

      currentNodeIndex++;
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Automation Workflows</h1>
        <p className="text-zinc-400">Build and manage your automated e-commerce strategies.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workflow List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-zinc-100">My Playbooks</h3>
            <button className="p-2 hover:bg-zinc-800 rounded-lg text-emerald-500 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            {workflows.map(workflow => (
              <motion.div
                key={workflow.id}
                layoutId={workflow.id}
                onClick={() => !isRunning && setActiveWorkflow(workflow)}
                className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                  activeWorkflow?.id === workflow.id
                    ? 'bg-emerald-500/10 border-emerald-500/50'
                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      workflow.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-200 text-sm">{workflow.name}</h4>
                      <p className="text-xs text-zinc-500">{workflow.nodes.length} steps</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWorkflow(workflow.id);
                    }}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      workflow.isActive ? 'bg-emerald-500' : 'bg-zinc-700'
                    }`}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      workflow.isActive ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-xs text-zinc-500 mt-3 pt-3 border-t border-zinc-800/50">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {workflow.lastRun}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500/50" />
                    {workflow.stats.successRate}% success
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Workflow Visualizer */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 h-[600px] flex flex-col relative overflow-hidden">
            {activeWorkflow ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      {activeWorkflow.name}
                      {isRunning && (
                        <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full animate-pulse">
                          Running...
                        </span>
                      )}
                    </h2>
                    <p className="text-sm text-zinc-400">{activeWorkflow.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                    {!isRunning && (
                      <button 
                        onClick={() => runSimulation(activeWorkflow)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Run Now
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4 relative">
                  {/* Connection Line */}
                  <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-zinc-800 -z-10" />

                  {activeWorkflow.nodes.map((node, index) => {
                    const Icon = iconMap[node.icon] || Zap;
                    const isLast = index === activeWorkflow.nodes.length - 1;
                    
                    return (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-start gap-4 group"
                      >
                        <div className={`relative z-10 w-12 h-12 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                          node.status === 'running' 
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                            : node.status === 'completed'
                            ? 'bg-zinc-900 border-emerald-500/50 text-emerald-500'
                            : 'bg-zinc-900 border-zinc-700 text-zinc-500'
                        }`}>
                          {node.status === 'running' ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                          ) : (
                            <Icon className="w-6 h-6" />
                          )}
                        </div>

                        <div className={`flex-1 p-4 rounded-xl border transition-all ${
                          node.status === 'running'
                            ? 'bg-emerald-500/5 border-emerald-500/30'
                            : 'bg-zinc-900 border-zinc-800'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-bold uppercase tracking-wider ${
                              node.status === 'running' ? 'text-emerald-400' : 'text-zinc-500'
                            }`}>
                              {node.type}
                            </span>
                            {node.status === 'completed' && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            )}
                          </div>
                          <h4 className={`font-medium ${
                            node.status === 'running' ? 'text-white' : 'text-zinc-300'
                          }`}>
                            {node.label}
                          </h4>
                          
                          {/* Config Details */}
                          {Object.keys(node.config).length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {Object.entries(node.config).map(([key, value]) => (
                                <span key={key} className="text-xs px-2 py-1 rounded bg-black/20 text-zinc-400 border border-white/5 font-mono">
                                  {key}: <span className="text-zinc-300">{value}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
                  <GitBranch className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-sm">Select a playbook to view or run automation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
