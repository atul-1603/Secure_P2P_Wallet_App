import axios from 'axios'
import { tokenStore } from './tokenStore'

export const API_URL = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '')

if (!API_URL) {
  throw new Error('Missing VITE_API_URL environment variable')
}

if (import.meta.env.DEV) {
  console.log('API URL:', import.meta.env.VITE_API_URL)
}

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
})

apiClient.interceptors.request.use((config) => {
  const accessToken = tokenStore.getAccessToken()
  const requestPath = config.url ?? ''

  if (typeof requestPath === 'string' && requestPath.startsWith('/') && !requestPath.startsWith('/api/')) {
    config.url = `/api${requestPath}`
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 Unauthorized, the session might have expired or token is invalid
    if (error.response?.status === 401) {
      console.warn('Session expired (401). Clearing tokens and redirecting to login...')
      tokenStore.clear()
      // Use window.location as we're outside of React component / React Router context
      window.location.assign('/login')
    }
    return Promise.reject(error)
  }
)
