import React, { useEffect, useState } from 'react'
import { BinanceClient } from '@/services/exchanges/binance.client'
import { CandleData, ExchangeType, OrderBookData } from '@/declares/order'
import TradingChart from '@/components/Trading/TradingChart'
import { ArrowUpRight, ArrowDownLeft, Zap } from 'lucide-react'

const TradingPage: React.FC = () => {
  const [symbol] = useState('BTCUSDT')
  const [historyData, setHistoryData] = useState<CandleData[]>([])
  const [liveCandle, setLiveCandle] = useState<CandleData | null>(null)
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null)
  const [exchange] = useState<ExchangeType>('BINANCE')

  useEffect(() => {
    const client = new BinanceClient()
    client.getKlinesHistory(symbol).then((history) => {
      setHistoryData(history)
      client.subscribeKlines(symbol, (candle) => setLiveCandle(candle))
    })
    client.subscribeOrderBook(symbol, (data) => setOrderBook(data))
    return () => client.close()
  }, [symbol])

  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-slate-950 text-slate-200">
      <nav className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap size={18} className="fill-blue-500 text-blue-500" />
            <h2 className="text-sm font-black uppercase italic tracking-tighter text-blue-500">
              Terminal
            </h2>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex items-center gap-3">
            <span className="font-mono text-base font-bold">{symbol}</span>
            <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-400">
              {exchange}
            </span>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <section className="flex w-72 flex-col border-r border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between border-b border-slate-800 p-3 px-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Order Book
            </span>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden font-mono text-[11px]">
            <div className="flex flex-1 flex-col-reverse overflow-hidden p-2">
              {orderBook?.asks.slice(0, 18).map((ask, i) => (
                <div
                  key={i}
                  className="group relative flex justify-between px-2 py-0.5 hover:bg-slate-800/50"
                >
                  <div
                    className="absolute inset-y-0 right-0 bg-red-500/10 transition-all duration-300"
                    style={{
                      width: `${Math.min((ask.total / 5) * 100, 100)}%`
                    }}
                  />
                  <span className="z-10 text-red-400">
                    {ask.price.toFixed(2)}
                  </span>
                  <span className="z-10 text-slate-300">
                    {ask.quantity.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 border-y border-slate-800 bg-slate-900/50 px-4 py-3">
              <span
                className={`text-xl font-black tabular-nums ${
                  liveCandle && liveCandle.close >= liveCandle.open
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {liveCandle?.close.toFixed(2)}
              </span>
              {liveCandle &&
                (liveCandle.close >= liveCandle.open ? (
                  <ArrowUpRight size={16} className="text-green-500" />
                ) : (
                  <ArrowDownLeft size={16} className="text-red-500" />
                ))}
            </div>

            <div className="flex flex-1 flex-col overflow-hidden p-2">
              {orderBook?.bids.slice(0, 18).map((bid, i) => (
                <div
                  key={i}
                  className="group relative flex justify-between px-2 py-0.5 hover:bg-slate-800/50"
                >
                  <div
                    className="absolute inset-y-0 right-0 bg-green-500/10 transition-all duration-300"
                    style={{
                      width: `${Math.min((bid.total / 5) * 100, 100)}%`
                    }}
                  />
                  <span className="z-10 text-green-400">
                    {bid.price.toFixed(2)}
                  </span>
                  <span className="z-10 text-slate-300">
                    {bid.quantity.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex flex-1 flex-col overflow-hidden">
          <section className="min-h-0 flex-1 bg-slate-950">
            <TradingChart data={historyData} liveCandle={liveCandle} />
          </section>

          <section className="h-64 border-t border-slate-800 bg-slate-900/30 p-4">
            <div className="flex h-full gap-6">
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-6">
                <p className="font-medium italic text-slate-500">
                  Buy/Sell Form Interface
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-widest text-slate-600">
                  Connect your Backend to execute
                </p>
              </div>

              <div className="w-64 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Balance</span>
                  <span className="font-mono font-bold text-blue-400">
                    0.0000 USDT
                  </span>
                </div>
                <div className="flex h-8 w-full cursor-not-allowed items-center justify-center rounded bg-slate-800 text-[10px] font-bold text-slate-400">
                  LEVERAGE: 20x (Isolated)
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default TradingPage
