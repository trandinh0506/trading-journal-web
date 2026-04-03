import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps,
  TooltipPayload
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { EquityPoint } from '@/declares/trade'
import {
  NameType,
  ValueType
} from 'recharts/types/component/DefaultTooltipContent'

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  active?: boolean
  payload?: TooltipPayload
  label?: string
}
const EquityChart: React.FC<{ data: EquityPoint[] }> = ({ data }) => {
  const { t } = useTranslation()

  const formatDate = (tickItem: string) => {
    return new Date(tickItem).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit'
    })
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as EquityPoint
      const isProfit = point.cumulative_pnl >= 0

      return (
        <div className="rounded-lg border border-slate-700 bg-slate-900 p-3 shadow-2xl backdrop-blur-md">
          <p className="mb-1 text-[10px] font-bold uppercase text-slate-500">
            {new Date(point.timestamp).toLocaleString()}
          </p>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between gap-4">
              <span className="text-xs text-slate-400">
                {t('dashboard.stats.net_pnl')}:
              </span>
              <span
                className={`font-mono text-xs font-bold ${
                  point.net_pnl >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {point.net_pnl > 0 ? '+' : ''}
                {point.net_pnl.toFixed(4)}
              </span>
            </div>
            <div className="mt-1 flex justify-between gap-4 border-t border-slate-800 pt-1">
              <span className="text-xs text-slate-400">
                {t('dashboard.stats.total_equity')}:
              </span>
              <span
                className={`font-mono text-xs font-bold ${
                  isProfit ? 'text-blue-400' : 'text-amber-400'
                }`}
              >
                {point.cumulative_pnl.toFixed(4)} USDT
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="mt-4 h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
            vertical={false}
          />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatDate}
            stroke="#475569"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#475569"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={80}
            tickFormatter={(value) => `${value} USDT`}
          />
          <Tooltip content={<CustomTooltip />} />

          <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />

          <Area
            type="monotone"
            dataKey="cumulative_pnl"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPnl)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default EquityChart
