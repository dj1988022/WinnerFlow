import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">{t('settings')}</h1>
        <p className="text-zinc-400">Manage your preferences and account.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Language Settings */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-500" />
            {t('language')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { code: 'en', label: 'English', flag: '🇺🇸' },
              { code: 'es', label: 'Español', flag: '🇪🇸' },
              { code: 'fr', label: 'Français', flag: '🇫🇷' },
              { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  i18n.language === lang.code
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium text-sm">{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Account Settings */}
        {user && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Account</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-lg font-bold text-zinc-400">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-white">{user.name}</div>
                  <div className="text-sm text-zinc-500">{user.email}</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                {t('logout')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
