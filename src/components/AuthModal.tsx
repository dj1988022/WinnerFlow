import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';
import { LogIn, UserPlus, Loader2, AlertCircle, Eye, EyeOff, X, Lock, Mail } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true); // 🚀 默认记住用户
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuthStore();
  const { t } = useTranslation();

  // 模拟自动填充（如果用户之前选了记住我，这里可以从 localStorage 读取）
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 🚀 这里暂时保留 Mock 逻辑，但模拟了真实存储
    setTimeout(() => {
      setLoading(false);
      if (email && password) {
        if (rememberMe) {
          localStorage.setItem('remembered_email', email);
        } else {
          localStorage.removeItem('remembered_email');
        }

        login({
          id: Date.now().toString(),
          email,
          name: name || email.split('@')[0],
          role: email.includes('admin') ? 'admin' : 'user'
        });
        onClose();
      } else {
        setError('Please fill in all fields');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-[#09090b] border border-zinc-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-8 relative"
      >
        <button onClick={onClose} className="absolute right-6 top-6 text-zinc-600 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? t('login') : t('register')}
          </h2>
          <p className="text-zinc-500 text-sm">
            {isLogin ? 'Welcome back to WinnerFlow' : 'Join the elite e-commerce circle'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-6 flex items-center gap-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{t('name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all"
                placeholder="John Doe"
              />
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-12 py-3 text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all"
                placeholder="••••••••"
              />
              {/* 👁️ 密码可见性切换 */}
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-zinc-600 hover:text-emerald-500 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 记住我 & 自动保存 */}
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 text-xs text-zinc-500 cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-emerald-500 focus:ring-offset-0 focus:ring-0"
              />
              自动记住登录状态
            </label>
            {isLogin && <button type="button" className="text-xs text-emerald-500 hover:underline">Forgot?</button>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 active:scale-[0.98] shadow-lg shadow-emerald-900/20"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="w-5 h-5" />
                {t('login')}
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                {t('register')}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-zinc-800 pt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
