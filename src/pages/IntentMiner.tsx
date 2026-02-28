
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Sparkles, AlertCircle, ShoppingCart, HelpCircle, ThumbsDown, UserCheck, Copy, Check } from 'lucide-react';
import { analyzeCommentIntent } from '../services/gemini';
import { IntentType } from '../types';

export default function IntentMiner() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    // Split by new lines and filter empty
    const comments = input.split('\n').filter(c => c.trim().length > 0);
    
    try {
      const data = await analyzeCommentIntent(comments);
      if (data.results) {
        setResults(data.results);
      }
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getIntentIcon = (intent: IntentType) => {
    switch (intent) {
      case 'Purchase': return <ShoppingCart className="w-4 h-4 text-emerald-400" />;
      case 'Inquiry': return <HelpCircle className="w-4 h-4 text-blue-400" />;
      case 'Complaint': return <ThumbsDown className="w-4 h-4 text-rose-400" />;
      case 'Endorsement': return <UserCheck className="w-4 h-4 text-purple-400" />;
      default: return <MessageSquare className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getIntentColor = (intent: IntentType) => {
    switch (intent) {
      case 'Purchase': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'Inquiry': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'Complaint': return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      case 'Endorsement': return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      default: return 'bg-zinc-800 border-zinc-700 text-zinc-400';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Comment Intent Miner</h1>
        <p className="text-zinc-400">Paste comments from any viral video. AI will identify leads and write closing scripts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Input Area */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
            <label className="block text-sm font-medium text-zinc-300 mb-2">Raw Comments</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste comments here (one per line)...&#10;Where can I buy this?&#10;Does it ship to UK?&#10;Too expensive!"
              className="w-full h-[400px] bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 resize-none font-mono"
            />
            <div className="mt-4">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !input.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Mining Leads...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze Intent
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Results Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-100">Identified Leads</h3>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {results.filter(r => r.intent === 'Purchase').length} Leads
              </span>
              <span className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                {results.length} Total
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {results.length > 0 ? (
                results.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <p className="text-zinc-200 text-sm mb-2">"{item.originalText}"</p>
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${getIntentColor(item.intent)}`}>
                          {getIntentIcon(item.intent)}
                          {item.intent}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-zinc-500 font-mono mb-1">LEAD SCORE</div>
                        <div className={`text-lg font-bold ${item.leadScore > 70 ? 'text-emerald-400' : 'text-zinc-400'}`}>
                          {item.leadScore}
                        </div>
                      </div>
                    </div>

                    {item.suggestedReply && (
                      <div className="bg-zinc-950/50 rounded-lg p-3 border border-zinc-800/50 group/reply relative">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Send className="w-3 h-3" />
                            SUGGESTED REPLY
                          </div>
                          <button 
                            onClick={() => handleCopy(item.suggestedReply, index)}
                            className="text-zinc-500 hover:text-emerald-400 transition-colors p-1"
                            title="Copy reply"
                          >
                            {copiedIndex === index ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="text-sm text-emerald-100/80 font-medium pr-6">
                          {item.suggestedReply}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-zinc-600 border border-zinc-800/50 rounded-2xl bg-zinc-900/20 p-10 text-center border-dashed">
                  <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm">No comments analyzed yet.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
