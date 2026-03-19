import type { ReactNode } from 'react'

export type ColumnDef<T> = {
  key: string
  header: ReactNode
  cell: (row: T) => ReactNode
  align?: 'left' | 'right' | 'center'
  widthClassName?: string
}

export function Table<T>({
  columns,
  rows,
  empty,
  footer,
}: {
  columns: ColumnDef<T>[]
  rows: T[]
  empty?: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200 dark:ring-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-700 dark:bg-white/5 dark:text-slate-200">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={[
                    'whitespace-nowrap px-4 py-3 font-semibold',
                    c.align === 'right'
                      ? 'text-right'
                      : c.align === 'center'
                        ? 'text-center'
                        : 'text-left',
                    c.widthClassName ?? '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-white/10 dark:bg-slate-950">
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500 dark:text-slate-400" colSpan={columns.length}>
                  {empty ?? 'Nenhum registro.'}
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5">
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={[
                        'whitespace-nowrap px-4 py-3 text-slate-800 dark:text-slate-200',
                        c.align === 'right'
                          ? 'text-right'
                          : c.align === 'center'
                            ? 'text-center'
                            : 'text-left',
                      ].join(' ')}
                    >
                      {c.cell(r)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          {footer ? <tfoot className="bg-slate-50 dark:bg-white/5">{footer}</tfoot> : null}
        </table>
      </div>
    </div>
  )
}

