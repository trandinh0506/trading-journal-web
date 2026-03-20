export interface ApiResponse<T> {
  data: T
  message: string
  status: number
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    full_name: string
  }
}
