import { AlertTriangle, X } from 'lucide-react';

/**
 * Reusable confirmation modal — replaces browser's blocking window.confirm().
 *
 * Props:
 *  isOpen    – boolean
 *  title     – string
 *  message   – string
 *  onConfirm – () => void
 *  onCancel  – () => void
 *  danger    – boolean (default true, renders red confirm button)
 */
const ConfirmModal = ({
  isOpen,
  title = 'Confirmation',
  message = 'Êtes-vous sûr de vouloir continuer ?',
  onConfirm,
  onCancel,
  danger = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="card-prism w-full max-w-sm relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 flex flex-col gap-4">
          {/* Icon + Title */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${danger ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-base font-bold text-[var(--color-text-main)] font-display">{title}</h3>
            <button
              onClick={onCancel}
              className="ml-auto p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Message */}
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{message}</p>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] transition-all"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold text-white transition-all shadow-lg ${
                danger
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                  : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
              }`}
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
