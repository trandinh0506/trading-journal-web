import axiosInstance from '../utils/axiosInstance'
import { API_ENDPOINT } from '../configs/endpoints'
import { ApiResponse, AuthResponse } from '../declares/api'

export const AuthService = {
  login: async (
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosInstance.post(API_ENDPOINT.AUTH.LOGIN, {
      email,
      password
    })
    console.log('Login response:', response)
    return {
      data: response.data,
      message: 'Login successful',
      status: 200
    }
  },

  register: async (
    email: string,
    password: string,
    full_name: string
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosInstance.post(API_ENDPOINT.AUTH.REGISTER, {
      email,
      password,
      full_name
    })
    return response.data
  }
}
