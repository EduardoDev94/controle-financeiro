import { useEffect, useMemo, useState } from 'react'
import { Button, Field, Input, Modal, Select, SidebarLayout, Table, type ColumnDef } from '../components'
import type { CategoryPurpose } from '../models'
import { createCategoria, deleteCategoria, listCategorias, updateCategoria } from '../services/categoriesApi'

type FormState = { description: string; purpose: CategoryPurpose }

const purposeLabel: Record<CategoryPurpose, string> = {
  income: 'Receita',
  expense: 'Despesa',
  both: 'Ambas',
}

export function CategoriesPage() {
  const [rows, setRows] = useState<{ id: string; description: string; purpose: CategoryPurpose }[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({ description: '', purpose: 'both' })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function refresh() {
    setLoading(true)
    setApiError(null)
    try {
      const data = await listCategorias()
      setRows(data)
    } catch (e) {
      setApiError(e instanceof Error ? e.message : 'Erro ao carregar categorias.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  const editing = useMemo(
    () => rows.find((c) => c.id === editingId) ?? null,
    [rows, editingId],
  )

  function reset() {
    setForm({ description: '', purpose: 'both' })
    setErrors({})
    setEditingId(null)
  }

  function openCreate() {
    reset()
    setOpen(true)
  }

  function openEdit(id: string) {
    const c = rows.find((x) => x.id === id)
    if (!c) return
    setEditingId(id)
    setForm({ description: c.description, purpose: c.purpose })
    setErrors({})
    setOpen(true)
  }

  function validate(next: FormState) {
    const e: typeof errors = {}
    const desc = next.description.trim()
    if (!desc) e.description = 'Informe a descrição.'
    else if (desc.length > 400) e.description = 'Máximo de 400 caracteres.'
    return e
  }

  async function submit() {
    const e = validate(form)
    setErrors(e)
    if (Object.keys(e).length > 0) return

    const payload = { description: form.description.trim(), purpose: form.purpose }
    setApiError(null)
    setIsSaving(true)
    try {
      if (editing) await updateCategoria({ id: editing.id, ...payload })
      else await createCategoria(payload)
      await refresh()
      setOpen(false)
      reset()
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Erro ao salvar categoria.')
    } finally {
      setIsSaving(false)
    }
  }

  function confirmDelete(id: string) {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      void remove(id)
    }
  }

  async function remove(id: string) {
    setApiError(null)
    setDeletingId(id)
    try {
      await deleteCategoria(id)
      await refresh()
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Erro ao excluir categoria.')
    } finally {
      setDeletingId(null)
    }
  }

  const columns: ColumnDef<(typeof rows)[number]>[] = [
    { key: 'description', header: 'Descrição', cell: (c) => c.description },
    { key: 'purpose', header: 'Finalidade', cell: (c) => purposeLabel[c.purpose] },
    {
      key: 'actions',
      header: '',
      align: 'right',
      widthClassName: 'w-[1%]',
      cell: (c) => (
        <div className="flex justify-end gap-2 opacity-100">
          <Button variant="secondary" onClick={() => openEdit(c.id)} disabled={isSaving || deletingId !== null}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => confirmDelete(c.id)} disabled={deletingId === c.id}>
            {deletingId === c.id ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <SidebarLayout>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Gestão de Categorias</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Categorias de receita/despesa.
          </p>
          {apiError ? (
            <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">{apiError}</p>
          ) : null}
        </div>
        <Button onClick={openCreate} disabled={isSaving || deletingId !== null}>Nova categoria</Button>
      </div>

      <div className="mt-6">
        <Table
          columns={columns}
          rows={rows}
          empty={loading ? 'Carregando…' : 'Nenhuma categoria.'}
        />
      </div>

      <Modal
        open={open}
        title={editing ? 'Editar categoria' : 'Nova categoria'}
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
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button onClick={submit} disabled={isSaving}>
              {isSaving ? 'Salvando...' : editing ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        }
      >
        <div className="grid gap-4">
          <Field label="Descrição" hint="Máx. 400 caracteres" error={errors.description}>
            <Input
              value={form.description}
              maxLength={400}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              placeholder="Ex.: Alimentação"
            />
          </Field>
          <Field label="Finalidade">
            <Select
              value={form.purpose}
              onChange={(e) =>
                setForm((s) => ({ ...s, purpose: e.target.value as CategoryPurpose }))
              }
            >
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
              <option value="both">Ambas</option>
            </Select>
          </Field>
        </div>
      </Modal>
    </SidebarLayout>
  )
}

