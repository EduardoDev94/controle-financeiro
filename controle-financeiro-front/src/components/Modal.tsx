import type { ReactNode } from 'react'

export function Modal({
  open,
  title,
  children,
  footer,
  onClose,
}: {
  open: boolean
  title: string
  children: ReactNode
  footer?: ReactNode
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-0 overflow-y-auto p-4 sm:p-8">
        <div className="mx-auto w-full max-w-xl rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-white/10">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            <button
              type="button"
              className="rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>
          <div className="px-5 py-4">{children}</div>
          {footer ? (
            <div className="border-t border-slate-200 px-5 py-4 dark:border-white/10">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

