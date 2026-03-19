import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

type ThemeContextValue = {
  mode: ThemeMode
  isDark: boolean
  setMode: (mode: ThemeMode) => void
  toggle: () => void
}

const STORAGE_KEY = 'controle-financeiro-front:theme'
const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemIsDark() {
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

function applyThemeClass(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark)
}

function loadInitialMode(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
  return 'system'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => loadInitialMode())
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => getSystemIsDark())

  useEffect(() => {
    const mql = globalThis.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mql) return
    const handler = () => setSystemIsDark(mql.matches)
    handler()
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const isDark = mode === 'system' ? systemIsDark : mode === 'dark'

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode)
    applyThemeClass(isDark)
  }, [mode, isDark])

  const value = useMemo<ThemeContextValue>(() => {
    return {
      mode,
      isDark,
      setMode,
      toggle: () =>
        setMode((prev) => {
          const currentIsDark = prev === 'system' ? getSystemIsDark() : prev === 'dark'
          return currentIsDark ? 'light' : 'dark'
        }),
    }
  }, [mode, isDark])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme deve ser usado dentro de ThemeProvider')
  return ctx
}

