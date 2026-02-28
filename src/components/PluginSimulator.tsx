import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Search, 
  ShoppingCart, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  ExternalLink,
  Plus
} from 'lucide-react';

interface CapturedData {
  id: string;
  source: string;
  type: 'Ad' | 'Product' | 'Comment';
  timestamp: string;
  preview: string;
  status: 'Processing' | 'Synced';
}

const mockCapturedData: CapturedData[] = [
  {
    id: '1',
    source: 'TikTok',
    type: 'Ad',
    timestamp: '2 mins ago',
    preview: 'Viral LED Lights Ad',
    status: 'Synced'
  },
  {
    id: '2',
    source: 'AliExpress',
    type: 'Product',
    timestamp: '5 mins ago',
    preview: 'Portable Neck Fan',
    status: 'Synced'
  },
  {
    id: '3',
    source: 'Facebook',
    type: 'Ad',
    timestamp: '12 mins ago',
    preview: 'Pet Grooming Kit',
    status: 'Synced'
  }
];

export default function PluginSimulator() {
  const [isActive, setIsActive] = useState(false);
  const [capturedItems, setCapturedItems] = useState<CapturedData[]>(mockCapturedData);
  const [isScanning, setIsScanning] = useState(false);

  const togglePlugin = () => {
    setIsActive(!isActive);
    if (!isActive) {
      // Simulate scanning start
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        // Add a new item
        const newItem: CapturedData = {
          id: Date.now().toString(),
          source: 'Instagram',
          type: 'Ad',
          timestamp: 'Just now',
          preview: 'New Viral Gadget Detected',
          status: 'Processing'
        };
        setCapturedItems([newItem, ...capturedItems]);
        
        setTimeout(() => {
          setCapturedItems(prev => prev.map(item => 
            item.id === newItem.id ? { ...item, status: 'Synced' } : item
          ));
        }, 2000);
      }, 1500);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-[#09090b] border border-zinc-800 rounded-2xl shadow-2xl w-80 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-zinc-900/50 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-white text-sm">WinnerFlow Companion</span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            {/* Status Area */}
            <div className="p-4 bg-gradient-to-b from-emerald-900/10 to-transparent">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-400">Today's Contribution</span>
                <span className="text-xs font-bold text-emerald-400">+12 pts</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[65%]" />
              </div>
              <p className="text-[10px] text-zinc-500 mt-2">
                Scanning across: TikTok, Meta, AliExpress, Amazon...
              </p>
            </div>

            {/* Live Feed */}
            <div className="max-h-64 overflow-y-auto p-2 space-y-2">
              {isScanning && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50 animate-pulse">
                  <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                  <span className="text-xs text-zinc-400">Scanning page content...</span>
                </div>
              )}
              
              {capturedItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors group cursor-pointer"
                >
                  <div className={`p-2 rounded-lg shrink-0 ${
                    item.type === 'Ad' ? 'bg-blue-500/10 text-blue-400' :
                    item.type === 'Product' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-purple-500/10 text-purple-400'
                  }`}>
                    {item.type === 'Ad' ? <TrendingUp className="w-3 h-3" /> :
                     item.type === 'Product' ? <ShoppingCart className="w-3 h-3" /> :
                     <Globe className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium text-zinc-300 truncate">{item.source}</span>
                      <span className="text-[10px] text-zinc-600">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-zinc-400 truncate">{item.preview}</p>
                  </div>
                  {item.status === 'Synced' ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500/50 mt-1" />
                  ) : (
                    <Loader2 className="w-3 h-3 text-zinc-500 animate-spin mt-1" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="p-3 border-t border-zinc-800 bg-zinc-900/30 flex gap-2">
              <button 
                onClick={() => {
                  // In a real app, this would navigate or open a new tab
                  console.log("Navigating to dashboard...");
                }}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3 h-3" />
                Open Dashboard
              </button>
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2 rounded-lg transition-colors">
                Analyze Page
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlugin}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 border-2 ${
          isActive 
            ? 'bg-emerald-600 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
            : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
        }`}
      >
        <Globe className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
