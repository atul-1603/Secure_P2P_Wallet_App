export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  userId: string
  username: string
  email: string
  status: string
}

export interface LoginRequest {
  usernameOrEmail: string
  password: string
}

export interface LoginResponse {
  message: string
  userId: string
  username: string
  email: string
  status: string
  tokenType: string
  accessToken: string
  accessTokenExpiresInMs: number
  refreshToken: string
  refreshTokenExpiresInMs: number
}

export interface CreateWalletRequest {
  currency?: string
}

export interface WalletResponse {
  walletId: string
  userId: string
  balance: number
  currency: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface DepositRequest {
  amount: number
  reference?: string
  note?: string
}

export interface DepositResponse {
  transactionId?: string
  walletId?: string
  amount: number
  currency?: string
  status?: string
  reference?: string
  completedAt?: string
  updatedBalance?: number
}

export interface TransferRequest {
  toWalletId: string
  amount: number
  reference?: string
  note?: string
}

export interface TransferResponse {
  transactionId: string
  fromWalletId: string
  toWalletId: string
  amount: number
  currency: string
  status: string
  reference: string
  senderBalance: number
  receiverBalance: number
  completedAt: string
}

export interface TransactionHistoryItem {
  transactionId: string
  fromWalletId: string
  toWalletId: string
  amount: number
  currency: string
  transactionType: string
  status: string
  reference: string
  note?: string
  createdAt: string
  completedAt?: string
}

export interface ApiErrorResponse {
  message?: string
  error?: string
  status?: number
}
