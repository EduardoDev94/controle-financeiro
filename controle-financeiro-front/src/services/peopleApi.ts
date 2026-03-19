import type { Person } from '../models'
import { getEnv } from '../utils/env'
import { http } from './httpClient'

// Backend (.NET)
type PessoaDto = {
  id: string
  nome: string
  idade: number
}

type PessoaCreateUpdateDto = {
  nome: string
  idade: number
}

function baseUrl() {
  return getEnv('VITE_API_BASE_URL') ?? 'http://localhost:5012'
}

function mapDto(dto: PessoaDto): Person {
  return { id: dto.id, name: dto.nome, age: dto.idade }
}

export async function listPeople(): Promise<Person[]> {
  const data = await http<PessoaDto[]>(`${baseUrl()}/api/Pessoas`)
  return data.map(mapDto)
}

export async function getPerson(id: string): Promise<Person> {
  const data = await http<PessoaDto>(`${baseUrl()}/api/Pessoas/${id}`)
  return mapDto(data)
}

export async function createPerson(input: {
  name: string
  age: number
}): Promise<Person> {
  const payload: PessoaCreateUpdateDto = {
    nome: input.name,
    idade: input.age,
  }
  const data = await http<PessoaDto>(`${baseUrl()}/api/Pessoas`, { method: 'POST', body: payload })
  return mapDto(data)
}

export async function updatePerson(input: {
  id: string
  name: string
  age: number
}): Promise<Person> {
  const payload: PessoaCreateUpdateDto = {
    nome: input.name,
    idade: input.age,
  }
  const data = await http<PessoaDto>(`${baseUrl()}/api/Pessoas/${input.id}`, { method: 'PUT', body: payload })
  return mapDto(data)
}

export async function deletePerson(id: string): Promise<void> {
  await http<void>(`${baseUrl()}/api/Pessoas/${id}`, { method: 'DELETE' })
}
