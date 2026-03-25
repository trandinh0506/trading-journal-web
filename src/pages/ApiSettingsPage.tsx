import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, Plus, Trash2, Loader2 } from 'lucide-react'
import { ExchangeService } from '@/services/exchange.service'
import { SupportedExchange, UserApiKey } from '@/declares/exchange'

const ApiSettingsPage: React.FC = () => {
  const { t } = useTranslation()

  const [supportedList, setSupportedList] = useState<SupportedExchange[]>([])
  const [userKeys, setUserKeys] = useState<UserApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selectedExCode, setSelectedExCode] = useState<string>('')
  const [marketType, setMarketType] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [apiSecret, setApiSecret] = useState('')

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [resSupported, resUserKeys] = await Promise.all([
        ExchangeService.getSupportedExchanges(),
        ExchangeService.getUserApiKeys()
      ])
      if (resSupported.status === 200) setSupportedList(resSupported.data || [])
      if (resUserKeys.status === 200) setUserKeys(resUserKeys.data || [])
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const selectedExchangeData = supportedList.find(
    (ex) => ex.code === selectedExCode
  )
  const availableMarkets = selectedExchangeData?.market_types || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedExCode || !marketType || !apiKey || !apiSecret) return

    setIsSubmitting(true)
    try {
      const res = await ExchangeService.saveApiKey({
        platform: selectedExCode,
        market_type: marketType,
        api_key: apiKey,
        api_secret: apiSecret
      })

      if (res.status === 200 || res.status === 201) {
        setApiKey('')
        setApiSecret('')
        fetchData()
      } else {
        alert(`Error: ${res.message}`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('common.confirm_delete'))) return
    try {
      const res = await ExchangeService.deleteApiKey(id)
      if (res.status === 200) fetchData()
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950">
        <Loader2 className="size-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <main className="h-full overflow-y-auto bg-slate-950 p-8 text-slate-100">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold">{t('api_settings.title')}</h1>
        <p className="mt-1 text-sm italic text-slate-400">
          {t('api_settings.subtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <div className="mb-6 flex items-center gap-2 text-blue-400">
            <Plus size={20} />
            <h2 className="text-xl font-bold text-slate-100">
              {t('api_settings.add_new')}
            </h2>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase text-slate-500">
                  {t('controls.exchange')}
                </label>
                <select
                  required
                  className="rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:ring-1 focus:ring-blue-500"
                  value={selectedExCode}
                  onChange={(e) => {
                    setSelectedExCode(e.target.value)
                    setMarketType('')
                  }}
                >
                  <option value="">{t('controls.select_placeholder')}</option>
                  {supportedList.map((ex) => (
                    <option key={ex.id} value={ex.code}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase text-slate-500">
                  {t('controls.market_type')}
                </label>
                <select
                  required
                  disabled={!selectedExCode}
                  className="rounded-lg border border-slate-700 bg-slate-800 p-3 outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-30"
                  value={marketType}
                  onChange={(e) => setMarketType(e.target.value)}
                >
                  <option value="">{t('controls.select_placeholder')}</option>
                  {availableMarkets.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase text-slate-500">
                {t('api_settings.api_key')}
              </label>
              <input
                required
                type="text"
                className="rounded-lg border border-slate-700 bg-slate-800 p-3 font-mono text-sm outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={t('api_settings.api_key_placeholder')}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase text-slate-500">
                {t('api_settings.secret_key')}
              </label>
              <input
                required
                type="password"
                className="rounded-lg border border-slate-700 bg-slate-800 p-3 font-mono text-sm outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={t('api_settings.secret_key_placeholder')}
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
              />
            </div>

            <button
              disabled={isSubmitting}
              className="mt-4 flex w-full justify-center rounded-lg bg-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-500 disabled:bg-slate-700"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                t('api_settings.save_btn')
              )}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <div className="mb-6 flex items-center gap-2 text-green-400">
            <ShieldCheck size={20} />
            <h2 className="text-xl font-bold text-slate-100">
              {t('api_settings.connected_exchanges')}
            </h2>
          </div>

          <div className="space-y-4">
            {userKeys.length === 0 ? (
              <p className="py-10 text-center text-sm italic text-slate-500">
                No connections found.
              </p>
            ) : (
              userKeys.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4 transition-all hover:border-slate-700"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold italic text-slate-100">
                      {item.exchange_name}
                    </h3>
                    <p className="text-[13px] font-bold uppercase tracking-widest text-blue-500">
                      {item.market_type}
                    </p>
                    <p className="mt-1 max-w-[200px] truncate font-mono text-[12px] italic text-slate-400">
                      API-KEY: {item.api_key_masked}
                    </p>
                    {item.last_sync_at && (
                      <p className="mt-1 text-[9px] text-slate-500">
                        Last sync:{' '}
                        {new Date(item.last_sync_at).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded border px-2 py-1 text-[10px] font-bold uppercase ${
                        item.is_active
                          ? 'border-green-500/20 bg-green-500/10 text-green-500'
                          : 'border-red-500/20 bg-red-500/10 text-red-500'
                      }`}
                    >
                      {item.is_active ? t('api_settings.active') : 'Inactive'}
                    </span>

                    <button
                      onClick={() => handleDelete(String(item.id))}
                      className="text-slate-600 transition-colors hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default ApiSettingsPage
