import type { ContactResponse, ContactUpsertRequest, MessageResponse } from '../types/api'
import { apiClient } from './apiClient'

export const contactService = {
  async getContacts(query?: string): Promise<ContactResponse[]> {
    const response = await apiClient.get<ContactResponse[]>('/contacts', {
      params: query && query.trim() ? { query: query.trim() } : undefined,
    })
    return response.data
  },

  async addContact(payload: ContactUpsertRequest): Promise<ContactResponse> {
    const response = await apiClient.post<ContactResponse>('/contacts', payload)
    return response.data
  },

  async updateContact(contactId: string, payload: ContactUpsertRequest): Promise<ContactResponse> {
    const response = await apiClient.put<ContactResponse>(`/contacts/${contactId}`, payload)
    return response.data
  },

  async deleteContact(contactId: string): Promise<MessageResponse> {
    const response = await apiClient.delete<MessageResponse>(`/contacts/${contactId}`)
    return response.data
  },
}
