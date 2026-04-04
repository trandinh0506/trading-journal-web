import React, { useEffect, useRef } from 'react'
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  CandlestickSeries
} from 'lightweight-charts'
import { CandleData } from '@/declares/order'

interface Props {
  data: CandleData[]
  liveCandle: CandleData | null
}

const TradingChart: React.FC<Props> = ({ data, liveCandle }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // 1. Khởi tạo Chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#94a3b8'
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' }
      },
      timeScale: {
        borderColor: '#334155',
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight
    })

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444'
    })

    if (data.length > 0) {
      series.setData(data as CandlestickData[])
    }

    chartRef.current = chart
    seriesRef.current = series

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [data])

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data as CandlestickData[])
    }
  }, [data])

  useEffect(() => {
    if (liveCandle && seriesRef.current) {
      seriesRef.current.update(liveCandle as CandlestickData)
    }
  }, [liveCandle])

  return (
    <div
      ref={chartContainerRef}
      className="relative size-full overflow-hidden"
    />
  )
}

export default TradingChart
