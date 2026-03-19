import type { Category, CategoryPurpose } from '../models'
import { getEnv } from '../utils/env'
import { http } from './httpClient'

// Backend (.NET)
// FinalidadeCategoria: Despesa = 0, Receita = 1, Ambas = 2
type CategoriaDto = {
  id: string
  descricao: string
  finalidade: 0 | 1 | 2
}

type CategoriaCreateUpdateDto = {
  descricao: string
  finalidade: 0 | 1 | 2
}

function baseUrl() {
  return getEnv('VITE_API_BASE_URL') ?? 'http://localhost:5012'
}

function toPurpose(finalidade: CategoriaDto['finalidade']): CategoryPurpose {
  if (finalidade === 1) return 'income'
  if (finalidade === 0) return 'expense'
  return 'both'
}

function toFinalidade(purpose: CategoryPurpose): CategoriaCreateUpdateDto['finalidade'] {
  if (purpose === 'income') return 1
  if (purpose === 'expense') return 0
  return 2
}

function mapDto(dto: CategoriaDto): Category {
  return { id: dto.id, description: dto.descricao, purpose: toPurpose(dto.finalidade) }
}

export async function listCategorias(): Promise<Category[]> {
  const url = `${baseUrl()}/api/Categorias`
  console.log('Fetching categorias from:', url)
  const data = await http<CategoriaDto[]>(url)
  return data.map(mapDto)
}

export async function getCategoria(id: string): Promise<Category> {
  const data = await http<CategoriaDto>(`${baseUrl()}/api/Categorias/${id}`)
  return mapDto(data)
}

export async function createCategoria(input: {
  description: string
  purpose: CategoryPurpose
}): Promise<Category> {
  const payload: CategoriaCreateUpdateDto = {
    descricao: input.description,
    finalidade: toFinalidade(input.purpose),
  }
  const data = await http<CategoriaDto>(`${baseUrl()}/api/Categorias`, { method: 'POST', body: payload })
  return mapDto(data)
}

export async function updateCategoria(input: {
  id: string
  description: string
  purpose: CategoryPurpose
}): Promise<Category> {
  const payload: CategoriaCreateUpdateDto = {
    descricao: input.description,
    finalidade: toFinalidade(input.purpose),
  }
  const data = await http<CategoriaDto>(`${baseUrl()}/api/Categorias/${input.id}`, { method: 'PUT', body: payload })
  return mapDto(data)
}

export async function deleteCategoria(id: string): Promise<void> {
  await http<void>(`${baseUrl()}/api/Categorias/${id}`, { method: 'DELETE' })
}

