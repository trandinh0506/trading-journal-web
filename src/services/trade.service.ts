import axiosInstance from '../utils/axiosInstance'
import { ApiResponse } from '../declares/api'
import { EquityPoint, Trade, TradeStats } from '../declares/trade'
import { API_ENDPOINT } from '@/configs/endpoints'

export const TradeService = {
  getTrades: async (): Promise<ApiResponse<Trade[]>> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINT.TRADE.TRADES)
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
          ).response?.data?.message || 'Failed to fetch trades',
        status:
          (
            error as {
              response?: { data?: { message?: string }; status?: number }
            }
          ).response?.status || 500
      }
    }
  },

  getStats: async (): Promise<ApiResponse<TradeStats>> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINT.TRADE.STATS)
      return {
        data: response.data,
        message: 'Success',
        status: 200
      }
    } catch (error: unknown) {
      return {
        data: {} as TradeStats,
        message:
          (
            error as {
              response?: { data?: { message?: string }; status?: number }
            }
          ).response?.data?.message || 'Failed to fetch stats',
        status:
          (
            error as {
              response?: { data?: { message?: string }; status?: number }
            }
          ).response?.status || 500
      }
    }
  },

  getEquityPoints: async (): Promise<ApiResponse<EquityPoint[]>> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINT.TRADE.EQUITY)
      return {
        data: response.data as EquityPoint[],
        message: 'Success',
        status: 200
      }
    } catch (error: unknown) {
      return {
        data: [] as EquityPoint[],
        message:
          (
            error as {
              response?: { data?: { message?: string }; status?: number }
            }
          ).response?.data?.message || 'Failed to fetch equity points',
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
