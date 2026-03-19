export type CategoryPurpose = 'income' | 'expense' | 'both'

export interface Category {
  id: string
  description: string
  purpose: CategoryPurpose
}

