export interface ApiResponse<T> {
  data: T | null
  message: string
  status: number
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    full_name: string
  }
}
