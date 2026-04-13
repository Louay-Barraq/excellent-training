import { Search, Plus } from 'lucide-react';

/* ─── Prism & Charcoal Empty State ─────────────────── */
const EmptyState = ({ 
  title = 'Aucune donnée trouvée', 
  description = 'Il semble que ce segment ne contienne aucun élément pour le moment.', 
  action 
}) => (
  <div className="flex flex-col items-center justify-center py-20 px-8 text-center bg-[var(--color-bg-card)] rounded-2xl animate-in fade-in zoom-in-95 duration-500">
    {/* Visual Illustration */}
    <div className="relative mb-8 group">
      <div className="w-24 h-24 bg-indigo-500/5 rounded-3xl flex items-center justify-center border border-indigo-500/10 shadow-inner group-hover:scale-105 transition-transform duration-700">
        <Search size={40} className="text-indigo-300 dark:text-indigo-700 opacity-40" />
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-500/10 rounded-full blur-sm animate-pulse"></div>
      <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-lime-500/10 rounded-full blur-md animate-pulse delay-700"></div>
    </div>

    <h3 className="text-2xl font-display font-bold text-[var(--color-text-main)] mb-3 tracking-tight">
      {title}
    </h3>
    <p className="text-[var(--color-text-muted)] text-sm font-medium max-w-sm leading-relaxed mb-10 italic">
      {description}
    </p>

    {action && (
      <button
        onClick={action.onClick}
        className="btn-prism flex items-center gap-2 group shadow-xl shadow-indigo-500/10"
      >
        <Plus size={18} />
        <span>{action.label}</span>
      </button>
    )}
  </div>
);

export default EmptyState;
