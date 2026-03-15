import axios from 'axios'
import type { ApiErrorResponse } from '../types/api'

export function getApiErrorMessage(error: unknown, fallback = 'Request failed'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined

    if (typeof data?.message === 'string' && data.message.length > 0) {
      return data.message
    }

    if (typeof data?.error === 'string' && data.error.length > 0) {
      return data.error
    }

    return error.message || fallback
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}

export function getApiErrorStatus(error: unknown): number | undefined {
  if (axios.isAxiosError(error)) {
    return error.response?.status
  }

  return undefined
}
