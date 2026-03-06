import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';
import { LogIn, UserPlus, Loader2, AlertCircle, Eye, EyeOff, X, Lock, Mail, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuthStore();
  const { t } = useTranslation();

  // 初始化：读取记住的邮箱
  useEffect(() => {
    if (isOpen) {
      const savedEmail = localStorage.getItem('wf_remembered_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    }
  }, [isOpen]);

  // 切换模式逻辑
  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (email && password) {
        // 处理“记住我”本地存储
        if (rememberMe) {
          localStorage.setItem('wf_remembered_email', email);
        } else {
          localStorage.removeItem('wf_remembered_email');
        }

        login({
          id: Date.now().toString(),
          email,
          name: name || email.split('@')[0],
          role: email.includes('admin') ? 'admin' : 'user'
        });
        onClose();
      } else {
        setError(t('fill_all_fields') || 'Please fill in all fields');
      }
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-[#09090b] border border-zinc-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-8 relative z-10"
          >
            <button onClick={onClose} className="absolute right-6 top-6 text-zinc-600 hover:text-white transition-colors p-1 hover:bg-zinc-800 rounded-full">
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
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-6 flex items-center gap-2 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{t('name')}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{t('email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-zinc-600" />
                  <input
                    type="email"
                    required
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
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-12 py-3 text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-zinc-600 hover:text-emerald-500 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 text-xs text-zinc-500 cursor-pointer select-none group">
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                  {/* 使用 t('remember_me') 适配多语言 */}
                  <span className="group-hover:text-zinc-300 transition-colors">{t('remember_me')}</span>
                </label>
                {isLogin && <button type="button" className="text-xs text-emerald-500 hover:underline">{t('forgot_password') || 'Forgot?'}</button>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 active:scale-[0.98] shadow-lg shadow-emerald-900/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>{isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}{isLogin ? t('login') : t('register')}</>
                )}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-zinc-800 pt-6">
              <button onClick={handleToggleMode} className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors">
                {isLogin ? t('no_account_link') || "Don't have an account? Register" : t('have_account_link') || "Already have an account? Login"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
