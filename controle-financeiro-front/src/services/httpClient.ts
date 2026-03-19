export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface HttpRequestOptions {
  method?: HttpMethod
  headers?: Record<string, string>
  body?: unknown
  signal?: AbortSignal
}

export async function http<TResponse>(
  url: string,
  options: HttpRequestOptions = {},
): Promise<TResponse> {
  const { method = 'GET', headers, body, signal } = options

  try {
    const res = await fetch(url, {
      method,
      headers: {
        ...(body != null ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body != null ? JSON.stringify(body) : undefined,
      signal,
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      
      let errorMessage = `HTTP ${res.status}`
      
      if (res.status === 404) {
        errorMessage = 'Recurso não encontrado.'
      } else if (res.status === 409) {
        errorMessage = 'Conflito: este item pode estar duplicado ou já existe.'
      } else if (res.status === 400) {
        errorMessage = `Dados inválidos: ${text || res.statusText}`
      } else if (res.status >= 500) {
        errorMessage = 'Erro do servidor. Tente novamente mais tarde.'
      } else if (text) {
        errorMessage = text
      } else {
        errorMessage = res.statusText || 'Erro desconhecido'
      }
      
      console.error(`HTTP Error ${res.status}:`, errorMessage, text)
      throw new Error(errorMessage)
    }

    // Sucesso: 200, 201, 202, etc
    if (res.status === 204) return undefined as TResponse

    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) {
      const text = await res.text().catch(() => '')
      return text as TResponse
    }

    const text = await res.text()
    if (!text) return undefined as TResponse
    return JSON.parse(text) as TResponse
  } catch (error) {
    // Erro de conexão (CORS, timeout, conexão recusada, etc)
    if (error instanceof TypeError) {
      console.error(`Erro de conexão: ${error.message}. URL: ${url}`)
      throw new Error(`Erro de conexão com servidor. Verifique se a API está rodando em ${url}`)
    }
    throw error
  }
}

