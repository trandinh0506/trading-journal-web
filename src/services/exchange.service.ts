import axiosInstance from '../utils/axiosInstance'
import { API_ENDPOINT } from '../configs/endpoints'
import { ApiResponse } from '../declares/api'
import {
  ConnectionMetadata,
  SupportedExchange,
  SymbolInfo,
  UserApiKey
} from '@/declares/exchange'

export const ExchangeService = {
  getSupportedExchanges: async (): Promise<
    ApiResponse<SupportedExchange[]>
  > => {
    try {
      const response = await axiosInstance.get(API_ENDPOINT.EXCHANGE.SUPPORTED)
      return {
        data: response.data,
        message: 'Success',
        status: 200
      }
    } catch (error: unknown) {
      return {
        data: [],
        message:
          (
            error as {
              response?: { data?: { message?: string }; status?: number }
            }
          ).response?.data?.message || 'Failed to fetch exchanges',
        status:
          (
            error as {
              response?: { data?: { message?: string }; status?: number }
            }
          ).response?.status || 500
      }
    }
  },

  getUserApiKeys: async (): Promise<ApiResponse<UserApiKey[]>> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINT.EXCHANGE.CONNECTION)
      return {
        data: response.data,
        message: 'Success',
        status: 200
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string }; status?: number }
      }
      return {
        data: [],
        message: err.response?.data?.message || 'Failed to fetch user keys',
        status: err.response?.status || 500
      }
    }
  },

  saveApiKey: async (payload: {
    platform: string
    market_type: string
    api_key: string
    api_secret: string
    passphrase?: string
  }): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINT.EXCHANGE.CONNECTION,
        payload
      )
      return {
        data: null,
        message: 'API Key saved successfully',
        status: response.status
      }
    } catch (error: unknown) {
      return {
        data: null,
        message:
          (
            error as {
              response?: { data?: { message?: string }; status?: number }
            }
          ).response?.data?.message || 'Failed to save API Key',
        status:
          (
            error as {
              response?: { data?: { message?: string }; status?: number }
            }
          ).response?.status || 500
      }
    }
  },

  deleteApiKey: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINT.EXCHANGE.CONNECTION}/${id}`
      )
      return {
        data: null,
        message: 'Deleted successfully',
        status: response.status
      }
    } catch (error: unknown) {
      return {
        data: null,
        message:
          (
            error as {
              response?: { data?: { message?: string }; status?: number }
            }
          ).response?.data?.message || 'Delete failed',
        status:
          (
            error as {
              response?: { data?: { message?: string }; status?: number }
            }
          ).response?.status || 500
      }
    }
  },

  getConnectionMetadata: async (): Promise<
    ApiResponse<ConnectionMetadata[]>
  > => {
    try {
      const response = await axiosInstance.get(API_ENDPOINT.EXCHANGE.METADATA)
      return {
        data: response.data,
        message: 'Success',
        status: 200
      }
    } catch (error: unknown) {
      return {
        data: [],
        message:
          (
            error as {
              response?: { data?: { message?: string }; status?: number }
            }
          ).response?.data?.message || 'Failed to fetch connection metadata',
        status:
          (
            error as {
              response?: { data?: { message?: string }; status?: number }
            }
          ).response?.status || 500
      }
    }
  },

  getSymbols: async (
    exchange: string,
    marketType: string
  ): Promise<ApiResponse<SymbolInfo[]>> => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINT.EXCHANGE.SYMBOLS(exchange, marketType)
      )
      return {
        data: response.data,
        message: 'Success',
        status: 200
      }
    } catch (error: unknown) {
      return {
        data: [],
        message:
          (
            error as {
              response?: { data?: { message?: string }; status?: number }
            }
          ).response?.data?.message || 'Failed to fetch symbols',
        status:
          (
            error as {
              response?: { data?: { message?: string }; status?: number }
            }
          ).response?.status || 500
      }
    }
  },

  syncTrades: async (params: {
    platform: string
    market_type: string
    symbol: string
  }): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINT.TRADE.SYNC(
          params.platform,
          params.market_type,
          params.symbol
        )
      )
      return {
        data: null,
        message: 'Sync started successfully',
        status: response.status
      }
    } catch (error: unknown) {
      return {
        data: null,
        message:
          (
            error as {
              response?: { data?: { message?: string }; status?: number }
            }
          ).response?.data?.message || 'Sync failed',
        status:
          (
            error as {
              response?: { data?: { message?: string }; status?: number }
            }
          ).response?.status || 500
      }
    }
  }
}
