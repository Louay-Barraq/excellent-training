import React, { useState } from 'react';
import { Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const roleLabel = {
  ADMINISTRATEUR: 'Admin',
  RESPONSABLE: 'Responsable',
  UTILISATEUR: 'Gestionnaire',
};

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="w-full sticky top-0 z-40 bg-[var(--color-bg-card)]/80 border-b border-[var(--color-border)] flex items-center justify-between px-8 py-4 shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full"></div>
        <span className="text-xl font-bold tracking-tight text-[var(--color-text-main)] uppercase">
          Excellent<span className="text-indigo-500">Training</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2.5 bg-[var(--color-bg-main)] border border-[var(--color-border)] hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all rounded-2xl group shadow-sm"
        >
          {theme === 'light' ? (
            <Moon size={18} className="text-slate-600 group-hover:text-indigo-600 transition-colors" />
          ) : (
            <Sun size={18} className="text-amber-400 group-hover:text-amber-300 transition-colors" />
          )}
        </button>

        <div className="w-px h-8 bg-[var(--color-border)] mx-1" />

        {user && (
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-1.5 pr-3 hover:bg-[var(--color-bg-main)] border border-transparent hover:border-[var(--color-border)] rounded-2xl transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-indigo-500/20">
                {user.login.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[11px] font-bold text-[var(--color-text-main)] uppercase tracking-tight">{user.login}</p>
                <p className="text-[9px] font-medium text-[var(--color-text-muted)] uppercase tracking-widest">{roleLabel[user.role] ?? user.role}</p>
              </div>
              <ChevronDown size={14} className={`text-[var(--color-text-muted)] transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-3 w-64 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 bg-[var(--color-bg-main)]/30 border-b border-[var(--color-border)]">
                    <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Session active</p>
                    <p className="text-sm font-bold text-[var(--color-text-main)]">{user.login}</p>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    <button 
                      onClick={logoutUser}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-rose-500 hover:bg-rose-500/10 transition-all group"
                    >
                      <LogOut size={18} />
                      <span className="font-semibold">Déconnexion</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;