import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import MainContent from '@/components/MainContent'
import ApiSettingsPage from '@/pages/ApiSettingsPage'
import ProtectedRoute from './auth/ProtectedRoute'
import LoginPage from './auth/Login'
import HistoryPage from '@/pages/HistoryPage'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MainContent />} />
        <Route path="api-settings" element={<ApiSettingsPage />} />{' '}
        <Route path="history" element={<HistoryPage />} />{' '}
      </Route>

      <Route path="/auth/login" element={<LoginPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
