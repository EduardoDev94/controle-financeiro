import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

const base =
  'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-400 focus:ring-offset-slate-50 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-offset-slate-950',
  secondary:
    'bg-slate-900/5 text-slate-900 hover:bg-slate-900/10 focus:ring-slate-400 focus:ring-offset-slate-50 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15 dark:focus:ring-white/30 dark:focus:ring-offset-slate-950',
  danger:
    'bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-400 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-950',
}

export function Button({ variant = 'primary', className, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={[base, variants[variant], className].filter(Boolean).join(' ')}
    />
  )
}

