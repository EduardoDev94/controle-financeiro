import { useMemo, useState } from 'react'
import {
  Button,
  Field,
  Input,
  Modal,
  Select,
  SidebarLayout,
  Table,
  type ColumnDef,
} from '../components'
import type { TransactionType } from '../models'
import { useAppStore } from '../services/appStore'
import { formatCurrencyBRL } from '../utils/format'

type FormState = {
  description: string
  amount: string
  type: TransactionType
  personId: string
  categoryId: string
}

const typeLabel: Record<TransactionType, string> = {
  income: 'Receita',
  expense: 'Despesa',
}

function canPersonDoIncome(age: number) {
  return age >= 18
}

export function TransactionsPage() {
  const { state, actions } = useAppStore()

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({
    description: '',
    amount: '',
    type: 'expense',
    personId: state.people[0]?.id ?? '',
    categoryId: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  const editing = useMemo(
    () => state.transactions.find((t) => t.id === editingId) ?? null,
    [state.transactions, editingId],
  )

  const selectedPerson = state.people.find((p) => p.id === form.personId) ?? null

  const availableTypes: TransactionType[] = selectedPerson && !canPersonDoIncome(selectedPerson.age)
    ? ['expense']
    : ['income', 'expense']

  const filteredCategories = state.categories.filter((c) => {
    if (form.type === 'income') return c.purpose === 'income' || c.purpose === 'both'
    return c.purpose === 'expense' || c.purpose === 'both'
  })

  const personNameById = useMemo(() => new Map(state.people.map((p) => [p.id, p.name])), [state.people])
  const categoryById = useMemo(
    () => new Map(state.categories.map((c) => [c.id, c])),
    [state.categories],
  )

  function reset() {
    setForm({
      description: '',
      amount: '',
      type: 'expense',
      personId: state.people[0]?.id ?? '',
      categoryId: '',
    })
    setErrors({})
    setEditingId(null)
  }

  function openCreate() {
    reset()
    setOpen(true)
  }

  function openEdit(id: string) {
    const t = state.transactions.find((x) => x.id === id)
    if (!t) return
    setEditingId(id)
    setForm({
      description: t.description,
      amount: String(t.amount),
      type: t.type,
      personId: t.personId,
      categoryId: t.categoryId,
    })
    setErrors({})
    setOpen(true)
  }

  function validate(next: FormState) {
    const e: typeof errors = {}
    const desc = next.description.trim()
    const amount = Number(next.amount)

    if (!desc) e.description = 'Informe a descrição.'
    if (!next.amount.trim()) e.amount = 'Informe o valor.'
    else if (!Number.isFinite(amount) || amount <= 0) e.amount = 'Use um número positivo.'

    if (!next.personId) e.personId = 'Selecione uma pessoa.'
    if (!next.categoryId) e.categoryId = 'Selecione uma categoria.'

    const person = state.people.find((p) => p.id === next.personId)
    if (person && person.age < 18 && next.type === 'income') {
      e.type = 'Menores de 18 anos podem apenas registrar despesas.'
    }

    const cat = state.categories.find((c) => c.id === next.categoryId)
    if (cat) {
      const ok =
        next.type === 'income'
          ? cat.purpose === 'income' || cat.purpose === 'both'
          : cat.purpose === 'expense' || cat.purpose === 'both'
      if (!ok) e.categoryId = 'A categoria deve corresponder ao tipo de transação.'
    }

    return e
  }

  function submit() {
    const e = validate(form)
    setErrors(e)
    if (Object.keys(e).length > 0) return

    const payload = {
      description: form.description.trim(),
      amount: Number(form.amount),
      type: form.type,
      personId: form.personId,
      categoryId: form.categoryId,
    }

    if (editing) actions.updateTransaction({ id: editing.id, ...payload })
    else actions.createTransaction(payload)

    setOpen(false)
    reset()
  }

  function setPerson(personId: string) {
    setForm((s) => {
      const person = state.people.find((p) => p.id === personId)
      const allowedTypes: TransactionType[] = person && person.age < 18 ? ['expense'] : ['income', 'expense']
      const nextType = allowedTypes.includes(s.type) ? s.type : 'expense'
      return { ...s, personId, type: nextType, categoryId: '' }
    })
  }

  function setType(type: TransactionType) {
    setForm((s) => ({ ...s, type, categoryId: '' }))
  }

  const columns: ColumnDef<(typeof state.transactions)[number]>[] = [
    { key: 'description', header: 'Descrição', cell: (t) => t.description },
    {
      key: 'amount',
      header: 'Valor',
      align: 'right',
      cell: (t) => formatCurrencyBRL(t.amount),
    },
    { key: 'type', header: 'Tipo', cell: (t) => typeLabel[t.type] },
    {
      key: 'person',
      header: 'Pessoa',
      cell: (t) => personNameById.get(t.personId) ?? '—',
    },
    {
      key: 'category',
      header: 'Categoria',
      cell: (t) => categoryById.get(t.categoryId)?.description ?? '—',
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      widthClassName: 'w-[1%]',
      cell: (t) => (
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => openEdit(t.id)}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => actions.deleteTransaction(t.id)}>
            Excluir
          </Button>
        </div>
      ),
    },
  ]

  const helperText =
    selectedPerson && selectedPerson.age < 18
      ? 'Regra: menor de 18 anos só pode registrar despesa.'
      : 'Selecione o tipo e a categoria compatível.'

  return (
    <SidebarLayout>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Transações</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{helperText}</p>
        </div>
        <Button onClick={openCreate}>Nova transação</Button>
      </div>

      <div className="mt-6">
        <Table columns={columns} rows={state.transactions} />
      </div>

      <Modal
        open={open}
        title={editing ? 'Editar transação' : 'Nova transação'}
        onClose={() => {
          setOpen(false)
          reset()
        }}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setOpen(false)
                reset()
              }}
            >
              Cancelar
            </Button>
            <Button onClick={submit}>{editing ? 'Salvar' : 'Criar'}</Button>
          </div>
        }
      >
        <div className="grid gap-4">
          <Field label="Descrição" error={errors.description}>
            <Input
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              placeholder="Ex.: Mercado"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Valor" error={errors.amount}>
              <Input
                value={form.amount}
                inputMode="decimal"
                onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))}
                placeholder="Ex.: 120.50"
              />
            </Field>
            <Field label="Tipo" error={errors.type}>
              <Select value={form.type} onChange={(e) => setType(e.target.value as TransactionType)}>
                {availableTypes.map((t) => (
                  <option key={t} value={t}>
                    {typeLabel[t]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Pessoa" error={errors.personId}>
              <Select value={form.personId} onChange={(e) => setPerson(e.target.value)}>
                {state.people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.age})
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Categoria" error={errors.categoryId}>
              <Select
                value={form.categoryId}
                onChange={(e) => setForm((s) => ({ ...s, categoryId: e.target.value }))}
              >
                <option value="">Selecione…</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.description}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">
            - Menor de 18 anos: permitido apenas <b>despesa</b>
            <br />- Categoria deve ser compatível com o tipo (ou “Ambas”)
          </div>
        </div>
      </Modal>
    </SidebarLayout>
  )
}

