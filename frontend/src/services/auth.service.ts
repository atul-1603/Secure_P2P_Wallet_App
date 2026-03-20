import type {
  AuthResponse,
  LoginRequest,
  LoginResponse,
  MessageResponse,
  RegisterRequest,
  ResendEmailVerificationRequest,
  VerifyEmailRequest,
  VerifyOtpRequest,
} from '../types/api'
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

  async verifyEmail(payload: VerifyEmailRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/verify-email', payload)
    return response.data
  },

  async verifyLoginOtp(payload: VerifyOtpRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/verify-otp', payload)
    return response.data
  },

  async resendEmailVerificationOtp(payload: ResendEmailVerificationRequest): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>('/auth/resend-verification-otp', payload)
    return response.data
  },
}
