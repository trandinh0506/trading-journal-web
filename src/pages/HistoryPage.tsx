import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TradeService } from '@/services/trade.service'
import { Trade } from '@/declares/trade'
import { Loader2, Image as ImageIcon } from 'lucide-react'
import TradeControls from '@/components/TradeControls'

const HistoryPage: React.FC = () => {
  const { t } = useTranslation()
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

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
      // Re-fetch trades after sync
      const res = await TradeService.getTrades()
      if (res.status === 200) setTrades(res.data || [])
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    const fetchTrades = async () => {
      const res = await TradeService.getTrades()
      if (res.status === 200) setTrades(res.data || [])
      setLoading(false)
    }
    fetchTrades()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950 text-blue-500">
        <Loader2 className="animate-spin" size={40} />
      </div>
    )
  }

  return (
    <main className="h-full bg-slate-950 p-6 text-slate-100">
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase italic tracking-wider">
            Trading <span className="text-blue-500">History</span>
          </h1>
          <p className="text-sm text-slate-400">
            Review your past performance and trade details
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

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
        <table className="w-full border-collapse text-left">
          <thead className="bg-slate-800/50 text-xs uppercase tracking-widest text-slate-400">
            <tr>
              <th className="p-4">{t('trade.symbol')}</th>
              <th className="p-4">{t('trade.side')}</th>
              <th className="p-4">{t('trade.entry_price')}</th>
              <th className="p-4">{t('trade.pnl')}</th>
              <th className="p-4">{t('trade.status')}</th>
              <th className="p-4 text-right">{t('trade.time')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {trades.map((trade) => {
              const pnl = parseFloat(trade.totalRealizedPnl)
              const isProfit = pnl > 0
              const isLoss = pnl < 0

              return (
                <tr
                  key={trade.id}
                  className="group transition-colors hover:bg-slate-800/30"
                >
                  {/* Symbol & Images */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">
                        {trade.symbol}
                      </span>
                      {trade.images && trade.images.length > 0 && (
                        <ImageIcon size={14} className="text-blue-400" />
                      )}
                    </div>
                  </td>

                  {/* Side */}
                  <td className="p-4 text-xs font-bold">
                    <span
                      className={`rounded px-2 py-1 ${
                        trade.side === 'BUY'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {trade.side}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-sm text-slate-300">
                    ${parseFloat(trade.averageEntryPrice).toLocaleString()}
                  </td>

                  <td
                    className={`p-4 font-mono font-bold ${
                      isProfit
                        ? 'text-green-400'
                        : isLoss
                          ? 'text-red-400'
                          : 'text-slate-400'
                    }`}
                  >
                    {isProfit && '+'}
                    {trade.totalRealizedPnl} USDT
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded border px-2 py-0.5 text-[10px] font-black ${
                        trade.status === 'CLOSED'
                          ? 'border-slate-700 text-slate-500'
                          : 'animate-pulse border-blue-500 text-blue-500'
                      }`}
                    >
                      {trade.status}
                    </span>
                  </td>

                  {/* Time */}
                  <td className="p-4 text-right text-xs text-slate-500">
                    <div>{new Date(trade.openedAt).toLocaleDateString()}</div>
                    <div className="text-[10px] opacity-50">
                      {new Date(trade.openedAt).toLocaleTimeString()}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {trades.length === 0 && (
          <div className="p-20 text-center italic text-slate-500">
            No trades found in your history.
          </div>
        )}
      </div>
    </main>
  )
}

export default HistoryPage
