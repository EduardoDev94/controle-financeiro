import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type { Category, CategoryPurpose, Person, Transaction, TransactionType } from '../models'
import { listCategorias } from './categoriesApi'
import { listPeople } from './peopleApi'
import {
  createTransaction as apiCreateTransaction,
  deleteTransaction as apiDeleteTransaction,
  listTransactions,
  updateTransaction as apiUpdateTransaction,
} from './transactionsApi'

type AppState = {
  people: Person[]
  categories: Category[]
  transactions: Transaction[]
}

type CreatePersonInput = { name: string; age: number }
type UpdatePersonInput = { id: string; name: string; age: number }

type CreateCategoryInput = { description: string; purpose: CategoryPurpose }
type UpdateCategoryInput = { id: string; description: string; purpose: CategoryPurpose }

type CreateTransactionInput = {
  description: string
  amount: number
  type: TransactionType
  personId: string
  categoryId: string
}
type UpdateTransactionInput = CreateTransactionInput & { id: string }

type AppActions = {
  createPerson: (input: CreatePersonInput) => void
  updatePerson: (input: UpdatePersonInput) => void
  deletePerson: (id: string) => void

  createCategory: (input: CreateCategoryInput) => void
  updateCategory: (input: UpdateCategoryInput) => void
  deleteCategory: (id: string) => void

  createTransaction: (input: CreateTransactionInput) => void
  updateTransaction: (input: UpdateTransactionInput) => void
  deleteTransaction: (id: string) => void
}

type AppStore = {
  state: AppState
  actions: AppActions
}

const STORAGE_KEY = 'controle-financeiro-front:v1'

function safeUUID() {
  return (globalThis.crypto?.randomUUID?.() ?? `id_${Math.random().toString(16).slice(2)}_${Date.now()}`)
}

function loadInitialState(): AppState {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      return JSON.parse(raw) as AppState
    } catch {
      // ignore
    }
  }

  const people: Person[] = [
    { id: safeUUID(), name: 'Ana', age: 28 },
    { id: safeUUID(), name: 'Bruno', age: 17 },
  ]

  const categories: Category[] = [
    { id: safeUUID(), description: 'Salário', purpose: 'income' },
    { id: safeUUID(), description: 'Alimentação', purpose: 'expense' },
    { id: safeUUID(), description: 'Geral', purpose: 'both' },
  ]

  const transactions: Transaction[] = [
    {
      id: safeUUID(),
      description: 'Salário (mensal)',
      amount: 4500,
      type: 'income',
      personId: people[0]!.id,
      categoryId: categories[0]!.id,
      createdAt: new Date().toISOString(),
    },
    {
      id: safeUUID(),
      description: 'Mercado',
      amount: 230.5,
      type: 'expense',
      personId: people[1]!.id,
      categoryId: categories[1]!.id,
      createdAt: new Date().toISOString(),
    },
  ]

  return { people, categories, transactions }
}

type Action =
  | { type: 'setAll'; payload: AppState }
  | { type: 'createPerson'; payload: Person }
  | { type: 'updatePerson'; payload: Person }
  | { type: 'deletePerson'; payload: { id: string } }
  | { type: 'createCategory'; payload: Category }
  | { type: 'updateCategory'; payload: Category }
  | { type: 'deleteCategory'; payload: { id: string } }
  | { type: 'createTransaction'; payload: Transaction }
  | { type: 'updateTransaction'; payload: Transaction }
  | { type: 'deleteTransaction'; payload: { id: string } }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'setAll':
      return action.payload
    case 'createPerson':
      return { ...state, people: [action.payload, ...state.people] }
    case 'updatePerson':
      return {
        ...state,
        people: state.people.map((p) => (p.id === action.payload.id ? action.payload : p)),
      }
    case 'deletePerson':
      return {
        ...state,
        people: state.people.filter((p) => p.id !== action.payload.id),
        transactions: state.transactions.filter((t) => t.personId !== action.payload.id),
      }
    case 'createCategory':
      return { ...state, categories: [action.payload, ...state.categories] }
    case 'updateCategory':
      return {
        ...state,
        categories: state.categories.map((c) => (c.id === action.payload.id ? action.payload : c)),
      }
    case 'deleteCategory':
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload.id),
        transactions: state.transactions.filter((t) => t.categoryId !== action.payload.id),
      }
    case 'createTransaction':
      return { ...state, transactions: [action.payload, ...state.transactions] }
    case 'updateTransaction':
      return {
        ...state,
        transactions: state.transactions.map((t) => (t.id === action.payload.id ? action.payload : t)),
      }
    case 'deleteTransaction':
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.payload.id) }
    default:
      return state
  }
}

const AppStoreContext = createContext<AppStore | null>(null)

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState)

  useEffect(() => {
    Promise.all([listPeople(), listCategorias(), listTransactions()])
      .then(([people, categories, transactions]) => {
        dispatch({ type: 'setAll', payload: { people, categories, transactions } })
      })
      .catch((err) => {
        console.error('Erro ao carregar dados da API:', err)
      })
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const actions = useMemo<AppActions>(() => {
    return {
      createPerson: (input) => {
        dispatch({ type: 'createPerson', payload: { id: safeUUID(), ...input } })
      },
      updatePerson: (input) => {
        dispatch({ type: 'updatePerson', payload: { ...input } })
      },
      deletePerson: (id) => {
        dispatch({ type: 'deletePerson', payload: { id } })
      },

      createCategory: (input) => {
        dispatch({ type: 'createCategory', payload: { id: safeUUID(), ...input } })
      },
      updateCategory: (input) => {
        dispatch({ type: 'updateCategory', payload: { ...input } })
      },
      deleteCategory: (id) => {
        dispatch({ type: 'deleteCategory', payload: { id } })
      },

      createTransaction: (input) => {
        apiCreateTransaction(input)
          .then((transaction) => {
            dispatch({ type: 'createTransaction', payload: transaction })
          })
          .catch((err) => {
            console.error('Erro ao criar transação:', err)
          })
      },
      updateTransaction: (input) => {
        apiUpdateTransaction(input)
          .then((transaction) => {
            dispatch({ type: 'updateTransaction', payload: transaction })
          })
          .catch((err) => {
            console.error('Erro ao atualizar transação:', err)
          })
      },
      deleteTransaction: (id) => {
        apiDeleteTransaction(id)
          .then(() => {
            dispatch({ type: 'deleteTransaction', payload: { id } })
          })
          .catch((err) => {
            console.error('Erro ao deletar transação:', err)
          })
      },
    }
  }, [])

  const value = useMemo<AppStore>(() => ({ state, actions }), [state, actions])

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error('useAppStore deve ser usado dentro de AppStoreProvider')
  return ctx
}

