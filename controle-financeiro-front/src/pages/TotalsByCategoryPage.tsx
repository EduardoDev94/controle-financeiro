import { useEffect, useState } from 'react'
import { SidebarLayout, Table, type ColumnDef } from '../components'
import { getTotalsByCategory } from '../services/transactionsApi'
import { formatCurrencyBRL } from '../utils/format'

type CategoryTotalRow = {
  id: string
  descricao: string
  totalReceitas: number
  totalDespesas: number
  saldo: number
}

type Totals = {
  totalReceitasGeral: number
  totalDespesasGeral: number
  saldoGeral: number
}

export function TotalsByCategoryPage() {
  const [rows, setRows] = useState<CategoryTotalRow[]>([])
  const [totals, setTotals] = useState<Totals>({ totalReceitasGeral: 0, totalDespesasGeral: 0, saldoGeral: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getTotalsByCategory()
      .then((data) => {
        setRows(data.categorias)
        setTotals({
          totalReceitasGeral: data.totalReceitasGeral,
          totalDespesasGeral: data.totalDespesasGeral,
          saldoGeral: data.saldoGeral,
        })
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const columns: ColumnDef<CategoryTotalRow>[] = [
    { key: 'descricao', header: 'Categoria', cell: (r) => r.descricao },
    {
      key: 'totalReceitas',
      header: 'Total receita',
      align: 'right',
      cell: (r) => (
        <span className="text-emerald-700 dark:text-emerald-300">
          {formatCurrencyBRL(r.totalReceitas)}
        </span>
      ),
    },
    {
      key: 'totalDespesas',
      header: 'Total despesa',
      align: 'right',
      cell: (r) => (
        <span className="text-rose-700 dark:text-rose-300">
          {formatCurrencyBRL(r.totalDespesas)}
        </span>
      ),
    },
    {
      key: 'saldo',
      header: 'Saldo',
      align: 'right',
      cell: (r) => (
        <span className={r.saldo >= 0 ? 'text-slate-900 dark:text-slate-100' : 'text-rose-700 dark:text-rose-200'}>
          {formatCurrencyBRL(r.saldo)}
        </span>
      ),
    },
  ]

  return (
    <SidebarLayout>
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Totais por Categoria</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Tabela com receita, despesa e saldo agrupados por categoria.
        </p>
      </div>

      <div className="mt-6">
        {loading && (
          <p className="text-sm text-slate-500 dark:text-slate-400">Carregando...</p>
        )}
        {error && (
          <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
        )}
        {!loading && !error && (
          <Table
            columns={columns}
            rows={rows}
            footer={
              <tr>
                <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Totais
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {formatCurrencyBRL(totals.totalReceitasGeral)}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-rose-700 dark:text-rose-300">
                  {formatCurrencyBRL(totals.totalDespesasGeral)}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {formatCurrencyBRL(totals.saldoGeral)}
                </td>
              </tr>
            }
          />
        )}
      </div>
    </SidebarLayout>
  )
}
