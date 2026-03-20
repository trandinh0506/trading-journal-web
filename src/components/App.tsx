import { useEffect, useState } from 'react'
import LoginPage from './auth/Login'
import DashboardPage from './DashboardPage'
import SignupPage from './auth/Register'

function App() {
  const [view, setView] = useState<'login' | 'register' | 'dashboard'>('login')
  useEffect(() => {
    setView('login')
  }, [])
  if (view === 'login') return <LoginPage />
  if (view === 'register') return <SignupPage />

  return (
    <div>
      <DashboardPage />
    </div>
  )
}

export default App
