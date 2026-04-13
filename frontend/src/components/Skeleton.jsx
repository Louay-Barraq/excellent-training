import React from 'react';

/* ─── Skeleton loading component ───────────── */
const Skeleton = ({ className = '', ...props }) => (
  <div className={`bg-slate-200 dark:bg-slate-800 animate-pulse rounded-md ${className}`} {...props} />
);

export const SkeletonCard = () => (
  <div className="card-prism p-6 space-y-4">
    <div className="flex justify-between items-start">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-4 w-14 rounded-full" />
    </div>
    <Skeleton className="h-6 w-3/4 rounded-lg" />
    <Skeleton className="h-4 w-full rounded-lg" />
    <Skeleton className="h-4 w-2/3 rounded-lg" />
  </div>
);

export const SkeletonTableRow = () => (
  <tr className="border-b border-[var(--color-border)] last:border-0">
    <td className="px-8 py-5"><Skeleton className="h-4 w-48 rounded-lg" /></td>
    <td className="px-8 py-5"><Skeleton className="h-4 w-24 rounded-full" /></td>
    <td className="px-8 py-5 text-right flex justify-end gap-2">
      <Skeleton className="h-9 w-9 rounded-lg" />
    </td>
  </tr>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="card-prism overflow-hidden">
    <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
      <Skeleton className="h-5 w-40 rounded-lg" />
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const SkeletonList = ({ rows = 4 }) => (
  <div className="space-y-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="card-prism p-5 flex justify-between items-center bg-[var(--color-bg-card)]">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-40 rounded-lg" />
          <Skeleton className="h-3 w-24 rounded-lg opacity-50" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
