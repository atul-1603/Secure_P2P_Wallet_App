import type { TransactionHistoryItem, TransferRequest, TransferResponse } from '../types/api'
import { apiClient } from './apiClient'
import axios from 'axios'

export const transactionService = {
  async transfer(payload: TransferRequest): Promise<TransferResponse> {
    const requestPayload = {
      toWalletId: payload.toWalletId,
      amount: payload.amount,
      reference: payload.reference,
      note: payload.note,
    }

    try {
      const response = await apiClient.post<TransferResponse>('/transactions/transfer', requestPayload)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        const fallbackResponse = await apiClient.post<TransferResponse>('/wallet/transfer', requestPayload)
        return fallbackResponse.data
      }

      throw error
    }
  },

  async getHistory(): Promise<TransactionHistoryItem[]> {
    const response = await apiClient.get<TransactionHistoryItem[]>('/transactions/history')
    return response.data
  },
}
