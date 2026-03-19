import { Card, SidebarLayout, Table, type ColumnDef } from '../components'
import { useAppStore } from '../services/appStore'
import { formatCurrencyBRL } from '../utils/format'

type TotalsByPersonRow = {
  personId: string
  personName: string
  income: number
  expense: number
  balance: number
}

function computeTotalsByPerson(params: {
  people: { id: string; name: string }[]
  transactions: { type: 'income' | 'expense'; amount: number; personId: string }[]
}): TotalsByPersonRow[] {
  const map = new Map<string, TotalsByPersonRow>()

  for (const p of params.people) {
    map.set(p.id, { personId: p.id, personName: p.name, income: 0, expense: 0, balance: 0 })
  }

  for (const t of params.transactions) {
    const row = map.get(t.personId)
    if (!row) continue
    if (t.type === 'income') row.income += t.amount
    else row.expense += t.amount
  }

  for (const row of map.values()) {
    row.balance = row.income - row.expense
  }

  return [...map.values()].sort((a, b) => a.personName.localeCompare(b.personName))
}

export function DashboardPage() {
  const { state } = useAppStore()

  const totalIncome = state.transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)

  const totalExpense = state.transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)

  const balance = totalIncome - totalExpense

  const rows = computeTotalsByPerson({ people: state.people, transactions: state.transactions })

  const columns: ColumnDef<TotalsByPersonRow>[] = [
    { key: 'person', header: 'Pessoa', cell: (r) => r.personName },
    {
      key: 'income',
      header: 'Receita',
      align: 'right',
      cell: (r) => (
        <span className="text-emerald-700 dark:text-emerald-300">
          {formatCurrencyBRL(r.income)}
        </span>
      ),
    },
    {
      key: 'expense',
      header: 'Despesa',
      align: 'right',
      cell: (r) => (
        <span className="text-rose-700 dark:text-rose-300">{formatCurrencyBRL(r.expense)}</span>
      ),
    },
    {
      key: 'balance',
      header: 'Saldo',
      align: 'right',
      cell: (r) => (
        <span
          className={
            r.balance >= 0
              ? 'text-slate-900 dark:text-slate-100'
              : 'text-rose-700 dark:text-rose-200'
          }
        >
          {formatCurrencyBRL(r.balance)}
        </span>
      ),
    },
  ]

  const totals = rows.reduce(
    (acc, r) => {
      acc.income += r.income
      acc.expense += r.expense
      acc.balance += r.balance
      return acc
    },
    { income: 0, expense: 0, balance: 0 },
  )

  return (
    <SidebarLayout>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Painel de Controle</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Visão geral de receitas, despesas e saldo.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card title="Receita total" icon="Receita" accent="green">
          <div className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">
            {formatCurrencyBRL(totalIncome)}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Somatório de transações do tipo receita
          </div>
        </Card>
        <Card title="Despesas totais" icon="Despesa" accent="red">
          <div className="text-2xl font-semibold text-rose-700 dark:text-rose-300">
            {formatCurrencyBRL(totalExpense)}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Somatório de transações do tipo despesa
          </div>
        </Card>
        <Card title="Saldo" icon="Saldo" accent="indigo">
          <div className="text-2xl font-semibold">{formatCurrencyBRL(balance)}</div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Receitas - Despesas</div>
        </Card>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Totais por pessoa
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Receitas, despesas e saldo por pessoa.
            </p>
          </div>
        </div>

        <Table
          columns={columns}
          rows={rows}
          footer={
            <tr>
              <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                Totais
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                {formatCurrencyBRL(totals.income)}
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-rose-700 dark:text-rose-300">
                {formatCurrencyBRL(totals.expense)}
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrencyBRL(totals.balance)}
              </td>
            </tr>
          }
        />
      </div>
    </SidebarLayout>
  )
}

