import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshCw, Search } from 'lucide-react'
import { ExchangeService } from '@/services/exchange.service'
import { ConnectionMetadata, SymbolInfo } from '@/declares/exchange'

interface TradeControlsProps {
  onSync: (params: {
    platform: string
    market_type: string
    symbol: string
  }) => Promise<void>
  isSyncing: boolean
}

const TradeControls: React.FC<TradeControlsProps> = ({ onSync, isSyncing }) => {
  const { t } = useTranslation()

  const [metadata, setMetadata] = useState<ConnectionMetadata[]>([])
  const [allSymbols, setAllSymbols] = useState<SymbolInfo[]>([])

  const [selectedEx, setSelectedEx] = useState('')
  const [selectedMarket, setSelectedMarket] = useState('')
  const [selectedSymbol, setSelectedSymbol] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const fetchMetadata = async () => {
      const res = await ExchangeService.getConnectionMetadata()
      if (res.status === 200) setMetadata(res.data || [])
    }
    fetchMetadata()
  }, [])

  useEffect(() => {
    if (selectedEx && selectedMarket) {
      const fetchSymbols = async () => {
        const res = await ExchangeService.getSymbols(selectedEx, selectedMarket)
        if (res.status === 200) setAllSymbols(res.data || [])
      }
      fetchSymbols()
    } else {
      setAllSymbols([])
    }
    setSearchTerm('')
    setSelectedSymbol('')
  }, [selectedEx, selectedMarket])

  const filteredSymbols = useMemo(() => {
    const filtered = allSymbols.filter(
      (s) =>
        s.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    return filtered.slice(0, 50)
  }, [searchTerm, allSymbols])

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex flex-col gap-1">
        <label className="ml-1 text-[10px] font-bold uppercase italic text-slate-500">
          {t('controls.exchange')}
        </label>
        <select
          value={selectedEx}
          onChange={(e) => {
            setSelectedEx(e.target.value)
            setSelectedMarket('')
          }}
          className="min-w-[140px] rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">{t('controls.select_placeholder')}</option>
          {metadata.map((m) => (
            <option key={m.platform} value={m.platform}>
              {m.platform}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="ml-1 text-[10px] font-bold uppercase italic text-slate-500">
          {t('controls.market_type')}
        </label>
        <select
          disabled={!selectedEx}
          value={selectedMarket}
          onChange={(e) => setSelectedMarket(e.target.value)}
          className="min-w-[120px] rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-30"
        >
          <option value="">{t('controls.select_placeholder')}</option>
          {metadata
            .find((m) => m.platform === selectedEx)
            ?.markets.map((mk) => (
              <option key={mk.market_type} value={mk.market_type}>
                {mk.market_type}
              </option>
            ))}
        </select>
      </div>

      <div className="relative flex flex-col gap-1">
        <label className="ml-1 text-[10px] font-bold uppercase italic text-slate-500">
          {t('controls.symbol')}
        </label>
        <div className="relative">
          <input
            type="text"
            disabled={!selectedMarket}
            placeholder={selectedSymbol || 'Search symbol...'}
            value={searchTerm}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setIsDropdownOpen(true)
            }}
            className="min-w-[180px] rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 font-mono text-sm outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-30"
          />
          <Search className="absolute left-3 top-2.5 size-4 text-slate-500" />

          {isDropdownOpen && filteredSymbols.length > 0 && (
            <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 shadow-2xl shadow-black">
              {filteredSymbols.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSelectedSymbol(s.code)
                    setSearchTerm(s.display_name)
                    setIsDropdownOpen(false)
                  }}
                  className="flex cursor-pointer items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-blue-600 hover:text-white"
                >
                  <span className="font-bold">{s.display_name}</span>
                  <span className="text-[10px] uppercase opacity-50">
                    {s.market_type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>

      <button
        onClick={() =>
          onSync({
            platform: selectedEx,
            market_type: selectedMarket,
            symbol: selectedSymbol
          })
        }
        disabled={isSyncing || !selectedSymbol}
        className="flex h-[38px] items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-105 hover:bg-blue-500 active:scale-95 disabled:bg-slate-800 disabled:text-slate-500 disabled:hover:scale-100"
      >
        <RefreshCw className={`size-4 ${isSyncing ? 'animate-spin' : ''}`} />
        <span className="text-xs uppercase tracking-tighter">
          {isSyncing ? t('controls.syncing') : t('controls.sync_btn')}
        </span>
      </button>
    </div>
  )
}

export default TradeControls
