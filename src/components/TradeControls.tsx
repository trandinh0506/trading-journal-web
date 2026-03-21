import React from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshCw } from 'lucide-react'

interface TradeControlsProps {
  exchange: string
  setExchange: (val: string) => void
  marketType: string
  setMarketType: (val: string) => void
  symbol: string
  setSymbol: (val: string) => void
  onSync: () => Promise<void>
  isSyncing: boolean
  exchanges: string[]
  marketTypes: string[]
  symbols: string[]
}

const TradeControls: React.FC<TradeControlsProps> = ({
  exchange,
  setExchange,
  marketType,
  setMarketType,
  symbol,
  setSymbol,
  onSync,
  isSyncing,
  exchanges,
  marketTypes,
  symbols
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Exchange */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase text-slate-500">
          {t('controls.exchange')}
        </label>
        <select
          value={exchange}
          onChange={(e) => {
            setExchange(e.target.value)
            setMarketType('')
            setSymbol('')
          }}
          className="min-w-[120px] rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">{t('controls.select_placeholder')}</option>
          {exchanges.map((ex) => (
            <option key={ex} value={ex}>
              {ex}
            </option>
          ))}
        </select>
      </div>

      {/* Market Type */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase text-slate-500">
          {t('controls.market_type')}
        </label>
        <select
          disabled={!exchange}
          value={marketType}
          onChange={(e) => {
            setMarketType(e.target.value)
            setSymbol('')
          }}
          className="min-w-[120px] rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        >
          <option value="">{t('controls.select_placeholder')}</option>
          {marketTypes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Symbol */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase text-slate-500">
          {t('controls.symbol')}
        </label>
        <select
          disabled={!marketType}
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="min-w-[140px] rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        >
          <option value="">{t('controls.select_placeholder')}</option>
          {symbols.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Sync Button */}
      <button
        onClick={onSync}
        disabled={isSyncing || !exchange}
        className="flex h-[38px] items-center gap-2 rounded bg-blue-600 px-4 py-2 font-bold text-white transition-all hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500"
      >
        <RefreshCw className={`size-4 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? t('controls.syncing') : t('controls.sync_btn')}
      </button>
    </div>
  )
}

export default TradeControls
