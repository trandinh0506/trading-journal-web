import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthService } from '../../services/auth.service'
import LanguageSwitcher from '../LanguageSwitcher'

const LoginPage: React.FC = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await AuthService.login(email, password)
      if (response.status === 200 && response.data) {
        console.log('Login message:', response.message)
        console.log('login data:', response.data)
        localStorage.setItem('token', response?.data?.token)
        navigate(from, { replace: true })
      } else {
        console.log('Login failed:', response)
      }
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || t('auth.error_default')
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 p-4">
      <div className="absolute right-6 top-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold italic tracking-tight text-blue-500">
            Trading Journal
          </h1>
          <p className="text-sm italic text-slate-400">
            Analyze. Optimize. Succeed.
          </p>
        </header>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              {t('auth.email')}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 transition-all placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="trader@example.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              {t('auth.password')}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-700 disabled:bg-blue-800/50 disabled:text-slate-400"
          >
            {loading ? t('auth.signing_in') : t('auth.login_btn')}
          </button>
        </form>

        <footer className="mt-8 text-center text-sm text-slate-400">
          {t('auth.no_account')}{' '}
          <a
            href="/signup"
            className="font-medium text-blue-400 hover:underline"
          >
            {t('auth.create_now')}
          </a>
        </footer>
      </div>
    </div>
  )
}

export default LoginPage
