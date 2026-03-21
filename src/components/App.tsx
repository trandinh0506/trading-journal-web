import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './auth/Login'
import DashboardPage from './DashboardPage'
import SignupPage from './auth/Register'
import ProtectedRoute from './auth/ProtectedRoute'
function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<SignupPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
