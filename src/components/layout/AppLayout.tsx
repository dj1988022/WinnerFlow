import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Video, 
  Settings, 
  Zap,
  Search,
  Bell,
  Menu,
  X,
  LogIn
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import FeedbackWidget from '../FeedbackWidget';
import AuthModal from '../AuthModal';
import PluginSimulator from '../PluginSimulator';

// Utility for tailwind classes
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, collapsed, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group w-full",
        active 
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100",
        collapsed && "justify-center px-2"
      )}
    >
      <Icon className={cn("w-5 h-5", active ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300")} />
      {!collapsed && (
        <span className="text-sm font-medium whitespace-nowrap">{label}</span>
      )}
      {active && !collapsed && (
        <motion.div 
          layoutId="active-pill"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
        />
      )}
    </button>
  );
};

interface AppLayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function AppLayout({ children, activePage, onNavigate }: AppLayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'trends', label: t('trends'), icon: TrendingUp },
    { id: 'ad-decoder', label: t('ad_decoder'), icon: Video },
    { id: 'intent-miner', label: t('intent_miner'), icon: MessageSquare },
    { id: 'influencers', label: t('influencers'), icon: Users },
    { id: 'automation', label: t('automation'), icon: Zap },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500/30">
      <FeedbackWidget />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <PluginSimulator />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 left-0 right-0 h-14 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/60 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              WINNER<span className="font-light text-emerald-500">FLOW</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full w-64 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
            <Search className="w-4 h-4 text-zinc-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search signals, products..." 
              className="bg-transparent border-none outline-none text-sm text-zinc-200 w-full placeholder:text-zinc-600"
            />
          </div>
          <button className="relative p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#09090b]"></span>
          </button>
          
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-zinc-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-medium text-white">{user.name}</div>
                <div className="text-[10px] text-zinc-500 uppercase">{user.role}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-300">
                {user.name.charAt(0)}
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
            >
              <LogIn className="w-3 h-3" />
              {t('login')}
            </button>
          )}
        </div>
      </header>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-[calc(3.5rem+37px)] left-0 bottom-0 bg-[#09090b] border-r border-zinc-800/60 z-30 transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="p-3 space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activePage === item.id}
              collapsed={collapsed}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </div>

        {/* System Status - Bottom of Sidebar */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800/60 bg-zinc-900/30",
          collapsed ? "items-center flex flex-col gap-2" : ""
        )}>
          {!collapsed ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">{t('system_status')}</span>
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] text-emerald-500 font-medium">{t('online')}</span>
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>{t('api_usage')}</span>
                  <span>78%</span>
                </div>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500/70 w-[78%] rounded-full"></div>
                </div>
              </div>
            </>
          ) : (
             <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={cn(
          "transition-all duration-300 min-h-[calc(100vh-3.5rem-37px)]",
          collapsed ? "pl-16" : "pl-64"
        )}
      >
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
