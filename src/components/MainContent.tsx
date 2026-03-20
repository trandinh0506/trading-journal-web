import React from 'react'
import { useTranslation } from 'react-i18next'

interface Trade {
  id: string
  pair: string
  side: 'long' | 'short'
  pnl: number
}

const MainContent: React.FC = () => {
  const { t } = useTranslation()

  const sampleTrade: Trade = {
    id: '1',
    pair: 'BTC/USDT',
    side: 'long',
    pnl: 150.5
  }

  return (
    <main className="h-full overflow-y-auto bg-slate-950 p-8 text-slate-100">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-lg font-bold">
              {sampleTrade.pair}
            </span>
            <span
              className={`rounded px-2 py-1 text-xs font-bold uppercase ${
                sampleTrade.side === 'long'
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-red-500/10 text-red-500'
              }`}
            >
              {t(`trade.side_type.${sampleTrade.side}`)}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-400">{t('trade.pnl')}</p>
            <p
              className={`text-2xl font-bold ${
                sampleTrade.pnl >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {sampleTrade.pnl > 0 ? `+${sampleTrade.pnl}` : sampleTrade.pnl}$
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default MainContent
