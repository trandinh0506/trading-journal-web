export interface TradeOrder {
  id: number
  externalOrderId: string
  side: 'BUY' | 'SELL'
  price: string
  volume: string
  fee: string
  feeAsset: string
  realizedPnl: string
  executedAt: string
}

export interface TradeImage {
  type: 'BEFORE_ENTRY' | 'AFTER_EXIT'
  url: string
}

export interface Trade {
  id: number
  symbol: string
  side: 'BUY' | 'SELL'
  status: 'OPEN' | 'CLOSED'
  averageEntryPrice: string
  openedAt: string
  closedAt: string | null
  totalEntryVolume: string
  totalExecutedVolume: string
  totalRealizedPnl: string
  totalVolume: string
  images: TradeImage[] | null
  orders: TradeOrder[]
}
