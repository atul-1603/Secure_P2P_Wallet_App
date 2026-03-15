type TokenState = {
  accessToken: string | null
  refreshToken: string | null
}

const ACCESS_TOKEN_KEY = 'wallet.accessToken'
const REFRESH_TOKEN_KEY = 'wallet.refreshToken'

function getStoredItem(key: string): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(key)
}

function setStoredItem(key: string, value: string): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, value)
}

function removeStoredItem(key: string): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(key)
}

const tokenState: TokenState = {
  accessToken: getStoredItem(ACCESS_TOKEN_KEY),
  refreshToken: getStoredItem(REFRESH_TOKEN_KEY),
}

function clearTokenState(): void {
  tokenState.accessToken = null
  tokenState.refreshToken = null
  removeStoredItem(ACCESS_TOKEN_KEY)
  removeStoredItem(REFRESH_TOKEN_KEY)
}

export const tokenStore = {
  getAccessToken() {
    return tokenState.accessToken
  },
  getRefreshToken() {
    return tokenState.refreshToken
  },
  setTokens(accessToken: string, refreshToken: string) {
    tokenState.accessToken = accessToken
    tokenState.refreshToken = refreshToken
    setStoredItem(ACCESS_TOKEN_KEY, accessToken)
    setStoredItem(REFRESH_TOKEN_KEY, refreshToken)
  },
  clear() {
    clearTokenState()
  },
  clearTokens() {
    clearTokenState()
  },
}
