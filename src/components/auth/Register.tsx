import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthService } from '../../services/auth.service'
import LanguageSwitcher from '../LanguageSwitcher'

const SignupPage: React.FC = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await AuthService.register(email, password, fullName)
      localStorage.setItem('token', response.data.token)
      window.location.href = '/dashboard'
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
          <h1 className="mb-2 text-2xl font-bold text-slate-100">
            {t('auth.signup_title')}
          </h1>
          <p className="text-sm text-slate-400">
            Join the elite community of traders
          </p>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              {t('auth.full_name')}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              {t('auth.email')}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-100 py-3 font-bold text-slate-950 transition-all hover:bg-white disabled:bg-slate-700 disabled:text-slate-500"
            >
              {loading ? t('auth.creating_account') : t('auth.signup_btn')}
            </button>
          </div>
        </form>

        <footer className="mt-8 text-center text-sm text-slate-400">
          {t('auth.have_account')}{' '}
          <a
            href="/login"
            className="font-medium text-blue-400 hover:underline"
          >
            {t('auth.login_now')}
          </a>
        </footer>
      </div>
    </div>
  )
}

export default SignupPage
