import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>
        {hint ? <span className="text-xs text-slate-500 dark:text-slate-400">{hint}</span> : null}
      </div>
      <div className="mt-2">{children}</div>
      {error ? <div className="mt-2 text-xs text-rose-300">{error}</div> : null}
    </label>
  )
}

const inputBase =
  'w-full rounded-xl bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500 dark:ring-white/10'

const selectStyles = `
  ${inputBase}
  appearance-none
  [&>option]:bg-white [&>option]:text-slate-900
  dark:[&>option]:bg-slate-800 dark:[&>option]:text-slate-100
`

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={[inputBase, props.className].filter(Boolean).join(' ')} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={[inputBase, props.className].filter(Boolean).join(' ')} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={[selectStyles, props.className].filter(Boolean).join(' ')}>
      {props.children}
    </select>
  )
}

