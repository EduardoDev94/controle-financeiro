import { useEffect, useMemo, useState } from 'react'
import { Button, Field, Input, Modal, SidebarLayout, Table, type ColumnDef } from '../components'
import type { Person } from '../models'
import { createPerson, deletePerson, listPeople, updatePerson } from '../services/peopleApi'

type FormState = { name: string; age: string }

export function PeoplePage() {
  const [rows, setRows] = useState<{ id: string; name: string; age: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({ name: '', age: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function refresh() {
    setLoading(true)
    setApiError(null)
    try {
      const data = await listPeople()
      setRows(data)
    } catch (e) {
      setApiError(e instanceof Error ? e.message : 'Erro ao carregar pessoas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  const editing = useMemo(
    () => rows.find((p) => p.id === editingId) ?? null,
    [rows, editingId],
  )

  function reset() {
    setForm({ name: '', age: '' })
    setErrors({})
    setEditingId(null)
  }

  function openCreate() {
    reset()
    setOpen(true)
  }

  function openEdit(id: string) {
    const p = rows.find((x) => x.id === id)
    if (!p) return
    setEditingId(id)
    setForm({ name: p.name, age: String(p.age) })
    setErrors({})
    setOpen(true)
  }

  function validate(next: FormState) {
    const e: typeof errors = {}
    const name = next.name.trim()
    const age = Number(next.age)

    if (!name) e.name = 'Informe o nome.'
    else if (name.length > 200) e.name = 'Máximo de 200 caracteres.'

    if (!next.age.trim()) e.age = 'Informe a idade.'
    else if (!Number.isFinite(age) || !Number.isInteger(age) || age < 0) e.age = 'Idade inválida.'

    return e
  }

  async function submit() {
    const e = validate(form)
    setErrors(e)
    if (Object.keys(e).length > 0) return

    const payload = { name: form.name.trim(), age: Number(form.age) }
    setApiError(null)
    setIsSaving(true)
    try {
      if (editing) await updatePerson({ id: editing.id, ...payload })
      else await createPerson(payload)
      await refresh()
      setOpen(false)
      reset()
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Erro ao salvar pessoa.')
    } finally {
      setIsSaving(false)
    }
  }

  function confirmDelete(id: string) {
    if (window.confirm('Tem certeza que deseja excluir esta pessoa?')) {
      void remove(id)
    }
  }

  async function remove(id: string) {
    setApiError(null)
    setDeletingId(id)
    try {
      await deletePerson(id)
      await refresh()
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Erro ao excluir pessoa.')
    } finally {
      setDeletingId(null)
    }
  }

  const columns: ColumnDef<(typeof rows)[number]>[] = [
    { key: 'name', header: 'Nome', cell: (p) => p.name },
    { key: 'age', header: 'Idade', align: 'right', cell: (p) => p.age },
    {
      key: 'actions',
      header: '',
      align: 'right',
      widthClassName: 'w-[1%]',
      cell: (p) => (
        <div className="flex justify-end gap-2 opacity-100">
          <Button variant="secondary" onClick={() => openEdit(p.id)} disabled={isSaving || deletingId !== null}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => confirmDelete(p.id)} disabled={deletingId === p.id}>
            {deletingId === p.id ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <SidebarLayout>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Gestão de Pessoas</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Cadastre e mantenha pessoas.
          </p>
          {apiError ? (
            <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">{apiError}</p>
          ) : null}
        </div>
        <Button onClick={openCreate} disabled={isSaving || deletingId !== null}>Nova pessoa</Button>
      </div>

      <div className="mt-6">
        <Table
          columns={columns}
          rows={rows}
          empty={loading ? 'Carregando…' : 'Nenhuma pessoa.'}
        />
      </div>

      <Modal
        open={open}
        title={editing ? 'Editar pessoa' : 'Nova pessoa'}
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
          <Field label="Nome" hint="Máx. 200 caracteres" error={errors.name}>
            <Input
              value={form.name}
              maxLength={200}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              placeholder="Ex.: Maria Silva"
            />
          </Field>
          <Field label="Idade" error={errors.age}>
            <Input
              value={form.age}
              inputMode="numeric"
              onChange={(e) => setForm((s) => ({ ...s, age: e.target.value }))}
              placeholder="Ex.: 30"
            />
          </Field>
        </div>
      </Modal>
    </SidebarLayout>
  )
}

