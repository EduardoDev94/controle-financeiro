import { Navigate, Route, Routes } from 'react-router-dom'
import { CategoriesPage } from '../pages/CategoriesPage'
import { DashboardPage } from '../pages/DashboardPage'
import { PeoplePage } from '../pages/PeoplePage'
import { TotalsByCategoryPage } from '../pages/TotalsByCategoryPage'
import { TotalsByPersonPage } from '../pages/TotalsByPersonPage'
import { TransactionsPage } from '../pages/TransactionsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/pessoas" element={<PeoplePage />} />
      <Route path="/categorias" element={<CategoriesPage />} />
      <Route path="/transacoes" element={<TransactionsPage />} />
      <Route path="/totais-por-pessoa" element={<TotalsByPersonPage />} />
      <Route path="/totais-por-categoria" element={<TotalsByCategoryPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

