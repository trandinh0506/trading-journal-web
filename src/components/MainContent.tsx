import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import TradeControls from './TradeControls'

const MainContent: React.FC = () => {
  const { t } = useTranslation()

  const [exchange, setExchange] = useState<string>('')
  const [marketType, setMarketType] = useState<string>('')
  const [symbol, setSymbol] = useState<string>('')
  const [isSyncing, setIsSyncing] = useState(false)

  const exchanges = ['Binance', 'Bybit', 'OKX']
  const marketTypes = ['Spot', 'Futures']
  const symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT']

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('Synced successfully')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <main className="h-full overflow-y-auto bg-slate-950 p-8 text-slate-100">
      <header className="mb-8 flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="mt-1 text-sm italic text-slate-400">
            {t('controls.subtitle')}
          </p>
        </div>

        <TradeControls
          exchange={exchange}
          setExchange={setExchange}
          marketType={marketType}
          setMarketType={setMarketType}
          symbol={symbol}
          setSymbol={setSymbol}
          onSync={handleSync}
          isSyncing={isSyncing}
          exchanges={exchanges}
          marketTypes={marketTypes}
          symbols={symbols}
        />
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

export default MainContent
