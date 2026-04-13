import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, School, UsersRound, ChartBar,
  Settings, LogOut, BadgeCheck, Building2
} from 'lucide-react';

const roleSlugMap = {
  ADMINISTRATEUR: 'administrateur',
  RESPONSABLE: 'responsable',
  UTILISATEUR: 'utilisateur'
};

const Sidebar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const slug = roleSlugMap[user.role] || 'utilisateur';
  
  const navLinks = {
    ADMINISTRATEUR: [
      { to: `/${slug}/dashboard`, label: 'TABLEAU DE BORD', icon: LayoutDashboard },
      { to: `/${slug}/formations`, label: 'FORMATIONS',     icon: School },
      { to: `/${slug}/formateurs`, label: 'FORMATEURS',     icon: BadgeCheck },
      { to: `/${slug}/participants`, label: 'PARTICIPANTS',  icon: UsersRound },
      { to: `/${slug}/utilisateurs`, label: 'UTILISATEURS',  icon: Settings },
      { to: `/${slug}/referentiels`, label: 'RÉFÉRENTIELS',  icon: ChartBar },
    ],
    RESPONSABLE: [
      { to: `/${slug}/dashboard`, label: 'TABLEAU DE BORD', icon: LayoutDashboard },
    ],
    UTILISATEUR: [
      { to: `/${slug}/dashboard`, label: 'TABLEAU DE BORD', icon: LayoutDashboard },
      { to: `/${slug}/formations`, label: 'FORMATIONS',     icon: School },
      { to: `/${slug}/formateurs`, label: 'FORMATEURS',     icon: BadgeCheck },
      { to: `/${slug}/participants`, label: 'PARTICIPANTS',  icon: UsersRound },
    ],
  };

  const links = navLinks[user.role] ?? [];

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[var(--color-bg-card)] border-r border-[var(--color-border)] pt-10 pb-4 z-50 overflow-hidden shadow-sm">
      {/* Brand */}
      <div className="px-8 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-accent)] rounded-lg flex items-center justify-center border border-[var(--color-border)] shadow-sm">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-display font-bold text-[var(--color-text-main)] uppercase tracking-tight leading-none">Green Building</h1>
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium mt-1">
              Gestion de Formation
            </p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-3 px-6 py-3 bg-[var(--color-accent)] text-white font-bold rounded-lg shadow-sm transition-all'
                : 'flex items-center gap-3 px-6 py-3 text-[var(--color-text-muted)] font-medium hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg transition-all'
            }
          >
            <Icon size={18} strokeWidth={2} className="shrink-0" />
            <span className="text-xs tracking-wide">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom: user logout */}
      <div className="px-4 mt-auto mb-4">
        <div className="pt-4 border-t border-[var(--color-border)]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-4 text-[var(--color-text-muted)] font-bold hover:text-[var(--color-danger)] hover:bg-rose-500/5 transition-all rounded-xl group"
          >
            <LogOut size={18} strokeWidth={2} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs tracking-widest uppercase">Déconnexion</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
