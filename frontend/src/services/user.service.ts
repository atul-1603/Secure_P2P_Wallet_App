import type { UserSearchItemResponse } from '../types/api'
import { apiClient } from './apiClient'

export const userService = {
  async searchUsers(query: string): Promise<UserSearchItemResponse[]> {
    const response = await apiClient.get<UserSearchItemResponse[]>('/users/search', {
      params: { query: query.trim() },
    })
    return response.data
  },
}
