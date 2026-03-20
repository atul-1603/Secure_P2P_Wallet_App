import type { TransactionHistoryItem, TransferRequest, TransferResponse } from '../types/api'
import { apiClient } from './apiClient'

export const transactionService = {
  async transfer(payload: TransferRequest): Promise<TransferResponse> {
    const requestPayload = {
      receiverWalletId: payload.toWalletId,
      receiverEmail: payload.receiverEmail,
      amount: payload.amount,
      reference: payload.reference,
      note: payload.note,
    }

    const response = await apiClient.post<TransferResponse>('/wallet/transfer', requestPayload)
    return response.data
  },

  async getHistory(): Promise<TransactionHistoryItem[]> {
    const response = await apiClient.get<TransactionHistoryItem[]>('/transactions/history')
    return response.data
  },
}
