import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppStoreProvider } from './services/appStore'
import { ThemeProvider } from './services/theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppStoreProvider>
        <App />
      </AppStoreProvider>
    </ThemeProvider>
  </StrictMode>,
)
