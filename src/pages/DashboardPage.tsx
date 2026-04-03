import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TradeService } from '@/services/trade.service'
import { TradeStats, EquityPoint } from '@/declares/trade'
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  Percent,
  Target,
  Activity
} from 'lucide-react'
import EquityChart from '@/components/EquityChart'

const DashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const [stats, setStats] = useState<TradeStats | null>(null)
  const [equityData, setEquityData] = useState<EquityPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, equityRes] = await Promise.all([
          TradeService.getStats(),
          TradeService.getEquityPoints()
        ])

        if (statsRes.status === 200) setStats(statsRes.data)
        if (equityRes.status === 200)
          setEquityData(equityRes.data || ([] as EquityPoint[]))
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
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

      {/* Grid Stats */}
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

      {/* Equity Curve Chart Section */}
      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/30 p-6 shadow-2xl backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black uppercase italic tracking-tighter text-slate-200">
              Equity <span className="text-blue-500">Curve</span>
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {t('dashboard.stats.equity_curve_desc')}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-800/50 px-3 py-1">
            <Activity size={12} className="animate-pulse text-blue-500" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
              {t('dashboard.stats.status_live')}
            </span>
          </div>
        </div>

        {equityData.length > 0 ? (
          <EquityChart data={equityData} />
        ) : (
          <div className="flex h-[350px] items-center justify-center italic text-slate-600">
            {t('dashboard.stats.no_data_chart')}
          </div>
        )}
      </section>
    </main>
  )
}

export default DashboardPage
