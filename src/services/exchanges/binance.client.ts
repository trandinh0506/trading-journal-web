import {
  CandleData,
  IExchangeClient,
  OrderBookData,
  OrderBookLevel
} from '@/declares/order'

export class BinanceClient implements IExchangeClient {
  private klineWs: WebSocket | null = null
  private orderBookWs: WebSocket | null = null

  async getKlinesHistory(
    symbol: string,
    interval = '1m',
    limit = 100
  ): Promise<CandleData[]> {
    const res = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`
    )
    const data = await res.json()
    return data.map((d: [number, string, string, string, string]) => ({
      time: d[0] / 1000,
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4])
    }))
  }

  subscribeKlines(symbol: string, callback: (candle: CandleData) => void) {
    if (this.klineWs) this.klineWs.close()

    const s = symbol.toLowerCase()
    this.klineWs = new WebSocket(
      `wss://stream.binance.com:9443/ws/${s}@kline_1m`
    )

    this.klineWs.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const k = data.k
      callback({
        time: k.t / 1000,
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c)
      })
    }
  }

  subscribeOrderBook(symbol: string, callback: (data: OrderBookData) => void) {
    if (this.orderBookWs) this.orderBookWs.close()

    const s = symbol.toLowerCase()
    this.orderBookWs = new WebSocket(
      `wss://stream.binance.com:9443/ws/${s}@depth20@100ms`
    )

    this.orderBookWs.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (!data.asks || !data.bids) return

      const processLevels = (levels: string[][]): OrderBookLevel[] => {
        let total = 0
        return levels.map(([p, q]) => {
          const price = parseFloat(p)
          const quantity = parseFloat(q)
          total += quantity
          return { price, quantity, total }
        })
      }

      callback({
        asks: processLevels(data.asks).reverse(),
        bids: processLevels(data.bids)
      })
    }
  }

  close() {
    this.klineWs?.close()
    this.orderBookWs?.close()
    this.klineWs = null
    this.orderBookWs = null
  }
}
