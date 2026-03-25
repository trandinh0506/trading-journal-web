export interface SupportedExchange {
  id: number
  code: string
  name: string
  market_types: string[]
}

export interface UserApiKey {
  id: number
  exchange_name: string
  market_type: string
  api_key_masked: string
  is_active: boolean
  last_sync_at: string | null
}
