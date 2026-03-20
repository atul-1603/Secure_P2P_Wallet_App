import type {
  CreatePaymentOrderRequest,
  CreatePaymentOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from '../types/api'
import { apiClient } from './apiClient'

export const paymentService = {
  async createOrder(payload: CreatePaymentOrderRequest): Promise<CreatePaymentOrderResponse> {
    const response = await apiClient.post<CreatePaymentOrderResponse>('/payments/create-order', payload)
    return response.data
  },

  async verifyPayment(payload: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    const response = await apiClient.post<VerifyPaymentResponse>('/payments/verify', payload)
    return response.data
  },
}
