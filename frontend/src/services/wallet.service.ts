import axios from 'axios'
import type { CreateWalletRequest, DepositRequest, DepositResponse, WalletResponse } from '../types/api'
import { apiClient } from './apiClient'

export const walletService = {
  async getMyWallet(): Promise<WalletResponse> {
    try {
      const response = await apiClient.get<WalletResponse>('/wallets/me')
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        try {
          const fallbackResponse = await apiClient.get<WalletResponse>('/wallet/me')
          return fallbackResponse.data
        } catch (fallbackError) {
          if (axios.isAxiosError(fallbackError) && fallbackError.response?.status === 404) {
            const legacyResponse = await apiClient.get<WalletResponse>('/wallet')
            return legacyResponse.data
          }

          throw fallbackError
        }
      }

      throw error
    }
  },

  async createMyWallet(payload?: CreateWalletRequest): Promise<WalletResponse> {
    try {
      const response = await apiClient.post<WalletResponse>('/wallets/me', payload ?? {})
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        try {
          const fallbackResponse = await apiClient.post<WalletResponse>('/wallet/me', payload ?? {})
          return fallbackResponse.data
        } catch (fallbackError) {
          if (axios.isAxiosError(fallbackError) && fallbackError.response?.status === 404) {
            const legacyResponse = await apiClient.post<WalletResponse>('/wallet', payload ?? {})
            return legacyResponse.data
          }

          throw fallbackError
        }
      }

      throw error
    }
  },

  async deposit(payload: DepositRequest): Promise<DepositResponse> {
    try {
      const response = await apiClient.post<DepositResponse>('/wallet/deposit', payload)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        const fallbackResponse = await apiClient.post<DepositResponse>('/wallets/deposit', payload)
        return fallbackResponse.data
      }

      throw error
    }
  },
}
