import React from 'react'
import { useTranslation } from 'react-i18next'

const DashboardPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <main className="h-full overflow-y-auto bg-slate-950 p-8 text-slate-100">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <p className="mt-1 text-sm italic text-slate-400">
          {t('controls.subtitle')}
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg transition-colors hover:border-blue-500/50">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-lg font-bold group-hover:text-blue-400">
              BTC/USDT
            </span>
            <span className="rounded bg-green-500/10 px-2 py-1 text-xs font-bold uppercase text-green-500">
              Long
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">{t('trade.pnl')}</p>
            <p className="text-2xl font-bold text-green-500">+150.5$</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default DashboardPage
