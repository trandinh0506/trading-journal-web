export interface CandleData {
  time: CollectLineNumbers
  open: number
  high: number
  low: number
  close: number
}

export interface OrderBookLevel {
  price: number
  quantity: number
  total: number
}

export interface OrderBookData {
  asks: OrderBookLevel[]
  bids: OrderBookLevel[]
}

export type ExchangeType = 'BINANCE' | 'EXNESS' | 'OKX'

export interface IExchangeClient {
  subscribeKlines: (
    symbol: string,
    callback: (candle: CandleData) => void
  ) => void
  subscribeOrderBook: (
    symbol: string,
    callback: (data: OrderBookData) => void
  ) => void
  close: () => void
}
