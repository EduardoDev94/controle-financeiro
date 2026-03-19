import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../services/theme'

const navItems = [
  { to: '/dashboard', label: 'Painel' },
  { to: '/pessoas', label: 'Pessoas' },
  { to: '/categorias', label: 'Categorias' },
  { to: '/transacoes', label: 'Transações' },
  { to: '/totais-por-pessoa', label: 'Totais por Pessoa' },
  { to: '/totais-por-categoria', label: 'Totais por Categoria' },
] as const

export function SidebarLayout({
  title = 'Controle Financeiro',
  children,
}: {
  title?: string
  children: ReactNode
}) {
  const theme = useTheme()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-auto">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{title}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Navegue pelas telas do sistema
                </div>
              </div>
              <button
                type="button"
                className="rounded-xl bg-indigo-500/10 px-3 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-500/15 dark:text-indigo-200"
                onClick={theme.toggle}
                title="Alternar tema"
              >
                {theme.isDark ? 'Dark' : 'Light'}
              </button>
            </div>

            <nav className="mt-5 grid gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'rounded-xl px-3 py-2 text-sm',
                      isActive
                        ? 'bg-indigo-500/10 text-indigo-900 ring-1 ring-indigo-500/20 dark:bg-indigo-500/15 dark:text-indigo-100'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <main className="min-w-0">
            <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10 sm:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

