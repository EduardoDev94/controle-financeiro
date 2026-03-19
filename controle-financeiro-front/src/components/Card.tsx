import type { ReactNode } from 'react'

export function Card({
  title,
  icon,
  accent = 'slate',
  children,
}: {
  title?: string
  icon?: ReactNode
  accent?: 'green' | 'red' | 'slate' | 'indigo'
  children: ReactNode
}) {
  const accentRing =
    accent === 'green'
      ? 'ring-1 ring-emerald-500/20'
      : accent === 'red'
        ? 'ring-1 ring-rose-500/20'
        : accent === 'indigo'
          ? 'ring-1 ring-indigo-500/20'
          : 'ring-1 ring-white/10'

  const accentBg =
    accent === 'green'
      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300'
      : accent === 'red'
        ? 'bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300'
        : accent === 'indigo'
          ? 'bg-indigo-500/10 text-indigo-300'
          : 'bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-slate-200'

  return (
    <section className={['rounded-2xl bg-white p-5 dark:bg-white/5', accentRing].join(' ')}>
      {(title || icon) && (
        <header className="flex items-center justify-between gap-3">
          {title ? (
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          ) : (
            <span />
          )}
          {icon ? (
            <span className={['rounded-xl px-3 py-2 text-xs font-medium', accentBg].join(' ')}>
              {icon}
            </span>
          ) : null}
        </header>
      )}
      <div className={title || icon ? 'mt-4' : ''}>{children}</div>
    </section>
  )
}

