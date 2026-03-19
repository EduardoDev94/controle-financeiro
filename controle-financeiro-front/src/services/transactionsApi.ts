/**
 * transactionsApi.ts
 * Funções de acesso à API de transações do backend .NET.
 *
 * Mapeamento de enums (backend → frontend):
 *   TipoTransacao: Despesa = 0 → 'expense' | Receita = 1 → 'income'
 *
 * O backend não retorna um campo de data de criação na TransacaoDto,
 * portanto createdAt é preenchido com o timestamp local da requisição.
 */

import type { Transaction, TransactionType } from '../models'
import { getEnv } from '../utils/env'
import { http } from './httpClient'

// --- Tipos internos (DTOs do backend) ---

/** DTO de leitura retornado pelo backend para uma transação. */
type TransacaoDto = {
  id: string
  descricao: string
  valor: number
  /** 0 = Despesa, 1 = Receita */
  tipo: 0 | 1
  categoriaId: string
  pessoaId: string
}

/** DTO de escrita enviado ao backend para criar ou atualizar uma transação. */
type TransacaoCreateUpdateDto = {
  descricao: string
  valor: number
  tipo: 0 | 1
  categoriaId: string
  pessoaId: string
}

// --- Utilitários ---

function baseUrl() {
  return getEnv('VITE_API_BASE_URL') ?? 'http://localhost:5012'
}

/** Converte o enum numérico do backend para o tipo literal do frontend. */
function toType(tipo: TransacaoDto['tipo']): TransactionType {
  return tipo === 1 ? 'income' : 'expense'
}

/** Converte o tipo literal do frontend para o enum numérico do backend. */
function toTipo(type: TransactionType): TransacaoCreateUpdateDto['tipo'] {
  return type === 'income' ? 1 : 0
}

/** Mapeia TransacaoDto (backend) para Transaction (frontend). */
function mapDto(dto: TransacaoDto): Transaction {
  return {
    id: dto.id,
    description: dto.descricao,
    amount: dto.valor,
    type: toType(dto.tipo),
    personId: dto.pessoaId,
    categoryId: dto.categoriaId,
    // O backend não expõe data de criação; usamos o timestamp da chamada.
    createdAt: new Date().toISOString(),
  }
}

// --- Funções públicas da API ---

/** Retorna todas as transações cadastradas. */
export async function listTransactions(): Promise<Transaction[]> {
  const data = await http<TransacaoDto[]>(`${baseUrl()}/api/Transacoes`)
  return data.map(mapDto)
}

/** Retorna uma transação pelo seu identificador. */
export async function getTransaction(id: string): Promise<Transaction> {
  const data = await http<TransacaoDto>(`${baseUrl()}/api/Transacoes/${id}`)
  return mapDto(data)
}

/** Cria uma nova transação. Lança erro se as regras de negócio forem violadas. */
export async function createTransaction(input: {
  description: string
  amount: number
  type: TransactionType
  personId: string
  categoryId: string
}): Promise<Transaction> {
  const payload: TransacaoCreateUpdateDto = {
    descricao: input.description,
    valor: input.amount,
    tipo: toTipo(input.type),
    pessoaId: input.personId,
    categoriaId: input.categoryId,
  }
  const data = await http<TransacaoDto>(`${baseUrl()}/api/Transacoes`, { method: 'POST', body: payload })
  return mapDto(data)
}

/** Atualiza uma transação existente. Lança erro se as regras de negócio forem violadas. */
export async function updateTransaction(input: {
  id: string
  description: string
  amount: number
  type: TransactionType
  personId: string
  categoryId: string
}): Promise<Transaction> {
  const payload: TransacaoCreateUpdateDto = {
    descricao: input.description,
    valor: input.amount,
    tipo: toTipo(input.type),
    pessoaId: input.personId,
    categoriaId: input.categoryId,
  }
  const data = await http<TransacaoDto>(`${baseUrl()}/api/Transacoes/${input.id}`, { method: 'PUT', body: payload })
  return mapDto(data)
}

/** Remove uma transação pelo identificador. */
export async function deleteTransaction(id: string): Promise<void> {
  await http<void>(`${baseUrl()}/api/Transacoes/${id}`, { method: 'DELETE' })
}

// --- Totais por Categoria ---

/** Totais financeiros de uma categoria específica. */
type CategoriaTotalDto = {
  id: string
  descricao: string
  totalReceitas: number
  totalDespesas: number
  /** Saldo = totalReceitas - totalDespesas */
  saldo: number
}

/** Resumo financeiro consolidado de todas as categorias. */
type TotaisCategoriasDto = {
  categorias: CategoriaTotalDto[]
  totalReceitasGeral: number
  totalDespesasGeral: number
  saldoGeral: number
}

/** Retorna o total de receitas, despesas e saldo agrupado por categoria. */
export async function getTotalsByCategory(): Promise<TotaisCategoriasDto> {
  return http<TotaisCategoriasDto>(`${baseUrl()}/api/Transacoes/totais-por-categoria`)
}
