import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TradeService } from '@/services/trade.service'
import { ExchangeService } from '@/services/exchange.service'
import { Trade } from '@/declares/trade'
import { Loader2, Image as ImageIcon } from 'lucide-react'
import TradeControls from '@/components/TradeControls'

const HistoryPage: React.FC = () => {
  const { t } = useTranslation()
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  const fetchTrades = async () => {
    const res = await TradeService.getTrades()
    if (res.status === 200) setTrades(res.data || [])
  }

  useEffect(() => {
    fetchTrades().finally(() => setLoading(false))
  }, [])

  const handleSync = async (params: {
    platform: string
    market_type: string
    symbol: string
  }) => {
    setIsSyncing(true)
    try {
      const res = await ExchangeService.syncTrades({
        platform: params.platform,
        market_type: params.market_type,
        symbol: params.symbol
      })

      if (res.status === 200 || res.status === 201) {
        await fetchTrades()
      } else {
        alert(res.message || 'Sync failed')
      }
    } catch (error) {
      console.error('Sync error:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950 text-blue-500">
        <Loader2 className="animate-spin" size={40} />
      </div>
    )
  }

  return (
    <main className="h-full bg-slate-950 p-6 text-slate-100">
      <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase italic tracking-wider">
            Trading <span className="text-blue-500">History</span>
          </h1>
          <p className="text-sm text-slate-400">
            Review your past performance and trade details
          </p>
        </div>

        <TradeControls onSync={handleSync} isSyncing={isSyncing} />
      </header>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-slate-800/50 text-[10px] uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="p-4 font-black">{t('trade.symbol')}</th>
                <th className="p-4 font-black">{t('trade.side')}</th>
                <th className="p-4 font-black">{t('trade.entry_price')}</th>
                <th className="p-4 font-black">{t('trade.pnl')}</th>
                <th className="p-4 font-black">{t('trade.status')}</th>
                <th className="p-4 text-right font-black">{t('trade.time')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {trades.map((trade) => {
                const pnl = parseFloat(trade.totalRealizedPnl)
                const isProfit = pnl > 0
                const isLoss = pnl < 0

                return (
                  <tr
                    key={trade.id}
                    className="group transition-all hover:bg-blue-500/5"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold tracking-tight text-slate-100">
                          {trade.symbol}
                        </span>
                        {trade.images && trade.images.length > 0 && (
                          <ImageIcon
                            size={14}
                            className="text-blue-500 opacity-70"
                          />
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block w-16 rounded py-1 text-center text-[10px] font-black uppercase tracking-tighter ${
                          trade.side === 'BUY'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {trade.side}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-sm text-slate-400">
                      <span className="mr-1 text-[10px] text-slate-600">$</span>
                      {parseFloat(trade.averageEntryPrice).toLocaleString()}
                    </td>

                    <td
                      className={`p-4 font-mono text-sm font-bold ${
                        isProfit
                          ? 'text-green-400'
                          : isLoss
                            ? 'text-red-400'
                            : 'text-slate-500'
                      }`}
                    >
                      {isProfit && '+'}
                      {trade.totalRealizedPnl}
                      <span className="ml-1 text-[10px] font-normal opacity-50">
                        USDT
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                          trade.status === 'CLOSED'
                            ? 'border-slate-800 bg-slate-800/50 text-slate-600'
                            : 'animate-pulse border-blue-500/50 bg-blue-500/10 text-blue-500'
                        }`}
                      >
                        {trade.status}
                      </span>
                    </td>

                    <td className="p-4 text-right font-mono text-[11px] text-slate-500">
                      <div className="text-slate-300">
                        {new Date(trade.openedAt).toLocaleDateString('en-GB')}
                      </div>
                      <div className="opacity-40">
                        {new Date(trade.openedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {trades.length === 0 && (
          <div className="p-24 text-center">
            <div className="mb-2 text-slate-700">
              No trading activity found.
            </div>
            <p className="text-xs italic text-slate-500">
              Try selecting an exchange and clicking Sync to update.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

export default HistoryPage
