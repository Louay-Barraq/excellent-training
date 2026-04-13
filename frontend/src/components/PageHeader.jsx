import React from 'react';

export default function PageHeader({
  icon: Icon,
  iconClassName = '',
  iconContainerClassName = '',
  title,
  subtitle,
  action,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={[
                'w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner',
                iconContainerClassName,
              ].join(' ')}
            >
              <Icon size={24} strokeWidth={1.5} className={iconClassName} />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-[var(--color-text-main)]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[var(--color-text-muted)] text-sm font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
      {action ? <div className="self-start md:self-auto">{action}</div> : null}
    </div>
  );
}

