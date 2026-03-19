export function getEnv(name: string): string | undefined {
  const value = import.meta.env[name]
  return typeof value === 'string' ? value : undefined
}

