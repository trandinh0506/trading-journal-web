import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TradeService } from '@/services/trade.service'
import { ExchangeService } from '@/services/exchange.service'
import { Trade } from '@/declares/trade'
import { Loader2, Image as ImageIcon, ArrowRight } from 'lucide-react'
import TradeControls from '@/components/TradeControls'
import { formatTradeTime } from '@/utils/date'

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
      const res = await ExchangeService.syncTrades(params)
      if (res.status === 200 || res.status === 201) await fetchTrades()
    } finally {
      setIsSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950 text-blue-500">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <main className="h-full bg-slate-950 p-6 text-slate-100">
      <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">
            Trading <span className="text-blue-500">Journal</span>
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Track, Analyze and Optimize your performance
          </p>
        </div>
        <TradeControls onSync={handleSync} isSyncing={isSyncing} />
      </header>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-slate-950/50 text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="p-4">{t('trade.symbol')}</th>
                <th className="p-4">{t('trade.side')}</th>
                <th className="p-4">{t('trade.entry_price')}</th>
                <th className="p-4">PnL & ROI</th>
                <th className="p-4">{t('trade.status')}</th>
                <th className="p-4 text-right">{t('trade.timeline')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {trades.map((trade) => {
                const totalFee =
                  trade.orders?.reduce(
                    (sum, order) => sum + parseFloat(order.fee),
                    0
                  ) || 0

                const netPnl = parseFloat(trade.totalRealizedPnl) - totalFee

                const entryVolumeUsdt =
                  parseFloat(trade.totalEntryVolume) *
                  parseFloat(trade.averageEntryPrice)
                const roi =
                  entryVolumeUsdt > 0 ? (netPnl / entryVolumeUsdt) * 100 : 0

                const isProfit = netPnl > 0
                const isLoss = netPnl < 0

                const openTime = formatTradeTime(trade.openedAt)
                const closeTime = formatTradeTime(trade.closedAt)

                return (
                  <tr
                    key={trade.id}
                    className="group transition-colors hover:bg-blue-500/5"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-100">
                            {trade.symbol}
                          </span>
                          <span className="font-mono text-[10px] text-slate-600">
                            ID: #{trade.id}
                          </span>
                        </div>
                        {trade.images && trade.images.length > 0 && (
                          <ImageIcon size={14} className="text-blue-500/50" />
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[10px] font-black tracking-tighter ${
                          trade.side === 'BUY'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {trade.side === 'BUY' ? 'LONG' : 'SHORT'}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-sm">
                      <div className="text-slate-300">
                        ${parseFloat(trade.averageEntryPrice).toLocaleString()}
                      </div>
                      <div className="text-[11px] italic text-slate-600">
                        Vol:{' '}
                        {parseFloat(trade.totalEntryVolume).toLocaleString()}{' '}
                        {trade.symbol.replace(/USDT|USD|PERP/g, '')}
                      </div>
                      <div className="text-[11px] italic text-slate-600">
                        Size:{' '}
                        {(
                          parseFloat(trade.totalEntryVolume) *
                          parseFloat(trade.averageEntryPrice)
                        ).toFixed(2)}{' '}
                        USDT
                      </div>
                    </td>

                    <td className="p-4">
                      <div
                        className={`font-mono text-sm font-bold ${
                          isProfit
                            ? 'text-green-400'
                            : isLoss
                              ? 'text-red-400'
                              : 'text-slate-500'
                        }`}
                      >
                        {isProfit && '+'}
                        {netPnl.toFixed(4)}{' '}
                        <span className="text-[10px] font-normal italic">
                          USDT
                        </span>
                      </div>
                      <div
                        className={`text-[10px] font-black ${
                          isProfit
                            ? 'text-green-500/70'
                            : isLoss
                              ? 'text-red-500/70'
                              : 'text-slate-600'
                        }`}
                      >
                        {isProfit && '+'}
                        {roi.toFixed(2)}%
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase ${
                          trade.status === 'CLOSED'
                            ? 'border-slate-800 text-slate-600'
                            : 'animate-pulse border-blue-500/50 text-blue-500'
                        }`}
                      >
                        {trade.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3 font-mono text-[13px]">
                        {/* Open Time */}
                        <div className="flex flex-col items-end">
                          <span className="text-slate-400">
                            {openTime.time}
                          </span>
                          <span className="text-[12px] text-slate-600">
                            {openTime.date}
                          </span>
                        </div>

                        <ArrowRight size={12} className="text-slate-700" />

                        {/* Close Time */}
                        <div className="flex flex-col items-start text-left">
                          <span
                            className={
                              trade.closedAt
                                ? 'text-slate-400'
                                : 'text-blue-500'
                            }
                          >
                            {trade.closedAt ? closeTime.time : 'RUNNING'}
                          </span>
                          <span className="text-[9px] text-slate-600">
                            {closeTime.date}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

export default HistoryPage
