import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TradeService } from '@/services/trade.service'
import { TradeStats } from '@/declares/trade'
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  Percent,
  Target
} from 'lucide-react'

const DashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const [stats, setStats] = useState<TradeStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const res = await TradeService.getStats()
      if (res.status === 200) setStats(res.data)
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950 text-blue-500">
        <Loader2 className="animate-spin" size={40} />
      </div>
    )
  }

  const statCards = [
    {
      title: t('dashboard.stats.total_trades'),
      value: stats?.total_trades || 0,
      icon: <Target className="text-blue-500" size={20} />,
      sub: t('dashboard.stats.total_trades_sub')
    },
    {
      title: t('dashboard.stats.win_rate'),
      value: `${stats?.win_rate.toFixed(1)}%`,
      icon: <Percent className="text-purple-500" size={20} />,
      color: (stats?.win_rate || 0) >= 50 ? 'text-green-500' : 'text-red-500'
    },
    {
      title: t('dashboard.stats.net_pnl'),
      value: `${stats?.net_pnl.toFixed(4)} USDT`,
      icon: <Wallet className="text-amber-500" size={20} />,
      color: (stats?.net_pnl || 0) >= 0 ? 'text-green-500' : 'text-red-400',
      sub: t('dashboard.stats.gross_pnl', {
        value: stats?.total_pnl.toFixed(4)
      })
    },
    {
      title: t('dashboard.stats.total_fees'),
      value: `${stats?.total_fee.toFixed(2)} USDT`,
      icon: <Receipt className="text-slate-400" size={20} />,
      sub: t('dashboard.stats.total_fees_sub')
    },
    {
      title: t('dashboard.stats.avg_win'),
      value: `+${stats?.avg_win.toFixed(4)}`,
      icon: <TrendingUp className="text-green-500" size={20} />,
      color: 'text-green-500'
    },
    {
      title: t('dashboard.stats.avg_loss'),
      value: `${stats?.avg_loss.toFixed(4)}`,
      icon: <TrendingDown className="text-red-500" size={20} />,
      color: 'text-red-500'
    }
  ]

  return (
    <main className="h-full overflow-y-auto bg-slate-950 p-8 text-slate-100">
      <header className="mb-8">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Trading <span className="text-blue-500">{t('dashboard.title')}</span>
        </h1>
        <p className="mt-1 text-sm italic text-slate-500">
          {t('dashboard.subtitle')}
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl transition-all hover:border-blue-500/50 hover:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {card.title}
              </p>
              <div className="rounded-lg bg-slate-800 p-2 transition-transform group-hover:scale-110">
                {card.icon}
              </div>
            </div>

            <div className="mt-4">
              <h2
                className={`font-mono text-2xl font-black ${
                  card.color || 'text-white'
                }`}
              >
                {card.value}
              </h2>
              {card.sub && (
                <p className="mt-1 text-[10px] font-medium uppercase tracking-tighter text-slate-600">
                  {card.sub}
                </p>
              )}
            </div>

            <div className="absolute -bottom-2 -right-2 size-16 bg-blue-500/5 blur-2xl transition-colors group-hover:bg-blue-500/10" />
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-dashed border-slate-800 p-12 text-center">
        <p className="text-sm italic text-slate-600">
          {t('dashboard.equity_coming_soon')}
        </p>
      </section>
    </main>
  )
}

export default DashboardPage
