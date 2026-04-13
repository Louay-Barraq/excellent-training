/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, X, Info, AlertTriangle } from 'lucide-react';

/* ─── Toast Context ─────────────────────────── */
export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const styles = {
    success: 'bg-emerald-500 text-white shadow-emerald-500/20 border-emerald-400/20',
    error: 'bg-rose-500 text-white shadow-rose-500/20 border-rose-400/20',
    info: 'bg-indigo-500 text-white shadow-indigo-500/20 border-indigo-400/20',
    warning: 'bg-amber-500 text-white shadow-amber-500/20 border-amber-400/20',
  };

  const icons = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    info: <Info size={18} />,
    warning: <AlertTriangle size={18} />,
  };

  return (
    <div className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-xl animate-in slide-in-from-right-10 fade-in duration-300 ${styles[toast.type] || styles.info}`}>
      <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
        {icons[toast.type] || icons.info}
      </div>
      <span className="flex-1 text-sm font-bold tracking-tight">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};
