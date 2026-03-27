export const API_ENDPOINT = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register'
  },
  EXCHANGE: {
    SUPPORTED: '/exchanges/supported',
    CONNECTION: '/connections',
    SYMBOLS: (exchange: string, marketType: string) =>
      `/exchanges/${exchange}/markets/${marketType}/symbols`,
    METADATA: '/connections/metadata'
  },
  TRADE: {
    TRADES: '/trades',
    SYNC: (platform: string, marketType: string, symbol: string) =>
      `/trades/sync/${platform}/${marketType}/${symbol}`
  }
}
