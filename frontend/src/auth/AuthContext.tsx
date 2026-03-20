import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { authService } from '../services/auth.service'
import { tokenStore } from '../services/tokenStore'
import type { AuthResponse, LoginRequest, LoginResponse, RegisterRequest, VerifyOtpRequest } from '../types/api'

type AuthUser = {
  userId: string
  username: string
  email: string
  status: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (payload: LoginRequest) => Promise<LoginResponse>
  verifyLoginOtp: (payload: VerifyOtpRequest) => Promise<LoginResponse>
  register: (payload: RegisterRequest) => Promise<AuthResponse>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const AUTH_USER_KEY = 'wallet.authUser'

function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.localStorage.getItem(AUTH_USER_KEY)

  if (!rawValue) {
    return null
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<AuthUser>

    if (
      typeof parsedValue.userId !== 'string' ||
      typeof parsedValue.username !== 'string' ||
      typeof parsedValue.email !== 'string' ||
      typeof parsedValue.status !== 'string'
    ) {
      return null
    }

    return {
      userId: parsedValue.userId,
      username: parsedValue.username,
      email: parsedValue.email,
      status: parsedValue.status,
    }
  } catch {
    return null
  }
}

function setStoredUser(user: AuthUser): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

function clearStoredUser(): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_USER_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser())
  const [accessToken, setAccessToken] = useState<string | null>(() => tokenStore.getAccessToken())

  async function login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await authService.login(payload)

    if (response.otpRequired) {
      return response
    }

    if (!response.accessToken || !response.refreshToken) {
      throw new Error('Missing tokens in login response')
    }

    const authenticatedUser: AuthUser = {
      userId: response.userId,
      username: response.username,
      email: response.email,
      status: response.status,
    }

    tokenStore.setTokens(response.accessToken, response.refreshToken)
    setAccessToken(response.accessToken)
    setUser(authenticatedUser)
    setStoredUser(authenticatedUser)

    return response
  }

  async function verifyLoginOtp(payload: VerifyOtpRequest): Promise<LoginResponse> {
    const response = await authService.verifyLoginOtp(payload)

    if (!response.accessToken || !response.refreshToken) {
      throw new Error('Missing tokens in OTP verification response')
    }

    const authenticatedUser: AuthUser = {
      userId: response.userId,
      username: response.username,
      email: response.email,
      status: response.status,
    }

    tokenStore.setTokens(response.accessToken, response.refreshToken)
    setAccessToken(response.accessToken)
    setUser(authenticatedUser)
    setStoredUser(authenticatedUser)

    return response
  }

  async function register(payload: RegisterRequest): Promise<AuthResponse> {
    return authService.register(payload)
  }

  function logout(): void {
    tokenStore.clear()
    setAccessToken(null)
    setUser(null)
    clearStoredUser()
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(accessToken),
      login,
      verifyLoginOtp,
      register,
      logout,
    }),
    [user, accessToken],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
