import axiosInstance from '../utils/axiosInstance'
import { API_ENDPOINT } from '../configs/endpoints'
import { ApiResponse, LoginResponse } from '../declares/api'

export const AuthService = {
  login: async (
    email: string,
    password: string
  ): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await axiosInstance.post(API_ENDPOINT.AUTH.LOGIN, {
        email,
        password
      })
      console.log('Login response:', response)
      return {
        data: {
          token: response.data.access_token,
          user: {
            id: response.data.user.id,
            email: response.data.user.email,
            full_name: response.data.user.full_name
          }
        } as LoginResponse,
        message: 'Login successful',
        status: 200
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        data: null,
        message:
          (error as { response?: { data?: { message?: string } } }).response
            ?.data?.message || 'Login failed',
        status:
          (error as { response?: { status?: number } }).response?.status || 500
      }
    }
  },

  register: async (
    email: string,
    password: string,
    full_name: string
  ): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosInstance.post(API_ENDPOINT.AUTH.REGISTER, {
        email,
        password,
        full_name
      })
      return {
        data: null,
        message: 'Registration successful',
        status: response.status
      }
    } catch (error) {
      console.error('Registration error:', error)
      return {
        data: null,
        message:
          (error as { response?: { data?: { message?: string } } }).response
            ?.data?.message || 'Registration failed',
        status:
          (error as { response?: { status?: number } }).response?.status || 500
      }
    }
  }
}
