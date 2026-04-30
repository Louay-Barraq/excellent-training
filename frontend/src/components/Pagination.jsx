import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Client-side pagination component.
 *
 * Props:
 *  total      – total number of items
 *  page       – current page (1-indexed)
 *  pageSize   – items per page
 *  onPage     – (newPage: number) => void
 *  pageSizes  – optional int[] for the page-size selector (default [10, 15, 25, 50])
 *  onPageSize – optional (size: number) => void
 */
const Pagination = ({
  total,
  page,
  pageSize,
  onPage,
  pageSizes = [10, 15, 25, 50],
  onPageSize,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1 && total <= pageSizes[0]) return null;

  const start = (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, total);

  // Build visible page numbers with ellipsis
  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('…');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('…');
    pages.push(totalPages);
  }

  const btnBase =
    'w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all';

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-surface-hover)]/20">
      {/* Count */}
      <span className="text-xs text-[var(--color-text-muted)] font-medium order-2 sm:order-1">
        {start}–{end} sur {total} résultats
      </span>

      {/* Pages */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className={`${btnBase} border border-[var(--color-border)] disabled:opacity-30 hover:bg-[var(--color-surface-hover)] disabled:cursor-not-allowed`}
        >
          <ChevronLeft size={14} />
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`el-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-[var(--color-text-muted)]">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={`${btnBase} ${
                p === page
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border border-blue-500'
                  : 'border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className={`${btnBase} border border-[var(--color-border)] disabled:opacity-30 hover:bg-[var(--color-surface-hover)] disabled:cursor-not-allowed`}
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Page size */}
      {onPageSize && (
        <select
          value={pageSize}
          onChange={e => { onPageSize(Number(e.target.value)); onPage(1); }}
          className="text-xs font-medium bg-[var(--color-bg-main)] border border-[var(--color-border)] rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-500/20 order-3 cursor-pointer"
        >
          {pageSizes.map(s => (
            <option key={s} value={s}>{s} / page</option>
          ))}
        </select>
      )}
    </div>
  );
};

export default Pagination;
