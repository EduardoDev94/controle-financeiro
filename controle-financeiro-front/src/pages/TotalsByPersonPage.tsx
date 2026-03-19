import { SidebarLayout, Table, type ColumnDef } from '../components'
import { useAppStore } from '../services/appStore'
import { formatCurrencyBRL } from '../utils/format'

type Row = {
  personId: string
  personName: string
  income: number
  expense: number
  balance: number
}

export function TotalsByPersonPage() {
  const { state } = useAppStore()

  const rows: Row[] = state.people
    .map((p) => {
      const income = state.transactions
        .filter((t) => t.personId === p.id && t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0)
      const expense = state.transactions
        .filter((t) => t.personId === p.id && t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0)
      return { personId: p.id, personName: p.name, income, expense, balance: income - expense }
    })
    .sort((a, b) => a.personName.localeCompare(b.personName))

  const totals = rows.reduce(
    (acc, r) => {
      acc.income += r.income
      acc.expense += r.expense
      acc.balance += r.balance
      return acc
    },
    { income: 0, expense: 0, balance: 0 },
  )

  const columns: ColumnDef<Row>[] = [
    { key: 'person', header: 'Pessoa', cell: (r) => r.personName },
    {
      key: 'income',
      header: 'Total receita',
      align: 'right',
      cell: (r) => (
        <span className="text-emerald-700 dark:text-emerald-300">
          {formatCurrencyBRL(r.income)}
        </span>
      ),
    },
    {
      key: 'expense',
      header: 'Total despesa',
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

  return (
    <SidebarLayout>
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Totais por Pessoa</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Tabela com receita, despesa e saldo por pessoa, com linha final de totais.
        </p>
      </div>

      <div className="mt-6">
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

