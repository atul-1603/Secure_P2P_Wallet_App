import type { AuthResponse, LoginRequest, LoginResponse, RegisterRequest } from '../types/api'
import { apiClient } from './apiClient'

export const authService = {
  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', payload)
    return response.data
  },

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', payload)
    return response.data
  },
}
