import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { transactionService } from '../services/transaction.service'
import { walletService } from '../services/wallet.service'
import { getApiErrorStatus } from '../utils/error'
import type { DepositRequest, TransferRequest } from '../types/api'

const queryKeys = {
  wallet: ['wallet', 'me'] as const,
  transactions: ['transactions', 'history'] as const,
}

export function useWalletQuery() {
  return useQuery({
    queryKey: queryKeys.wallet,
    queryFn: async () => {
      try {
        return await walletService.getMyWallet()
      } catch (error) {
        if (getApiErrorStatus(error) === 404) {
          return null
        }
        throw error
      }
    },
  })
}

export function useHistoryQuery() {
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: async () => {
      try {
        return await transactionService.getHistory()
      } catch (error) {
        if (getApiErrorStatus(error) === 404) {
          return []
        }
        throw error
      }
    },
  })
}

export function useCreateWalletMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: walletService.createMyWallet,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.wallet })
      await queryClient.invalidateQueries({ queryKey: queryKeys.transactions })
    },
  })
}

export function useTransferMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: TransferRequest) => transactionService.transfer(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.wallet })
      await queryClient.invalidateQueries({ queryKey: queryKeys.transactions })
    },
  })
}

export function useDepositMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DepositRequest) => walletService.deposit(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.wallet })
      await queryClient.invalidateQueries({ queryKey: queryKeys.transactions })
    },
  })
}
