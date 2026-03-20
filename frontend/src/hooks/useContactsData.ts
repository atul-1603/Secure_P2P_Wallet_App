import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ContactUpsertRequest } from '../types/api'
import { contactService } from '../services/contact.service'

const contactQueryKeys = {
  contacts: (query: string) => ['contacts', query.trim()] as const,
}

export function useContactsQuery(query = '') {
  return useQuery({
    queryKey: contactQueryKeys.contacts(query),
    queryFn: () => contactService.getContacts(query),
  })
}

export function useAddContactMutation(query = '') {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ContactUpsertRequest) => contactService.addContact(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: contactQueryKeys.contacts(query) })
      await queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useUpdateContactMutation(query = '') {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ contactId, payload }: { contactId: string; payload: ContactUpsertRequest }) =>
      contactService.updateContact(contactId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: contactQueryKeys.contacts(query) })
      await queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useDeleteContactMutation(query = '') {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (contactId: string) => contactService.deleteContact(contactId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: contactQueryKeys.contacts(query) })
      await queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}
