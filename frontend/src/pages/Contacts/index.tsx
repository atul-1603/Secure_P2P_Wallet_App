import { motion } from 'framer-motion'
import { Pencil, Plus, Search, Trash2, UserRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Alert } from '../../components/ui/alert'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { EmptyState, PageError, PageLoading } from '../../components/ui/page-state'
import { useToast } from '../../components/ui/toast'
import {
  useAddContactMutation,
  useContactsQuery,
  useDeleteContactMutation,
  useUpdateContactMutation,
} from '../../hooks/useContactsData'
import type { ContactResponse } from '../../types/api'
import { getApiErrorMessage } from '../../utils/error'
import { formatDateTime } from '../../utils/format'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactsPage() {
  const [query, setQuery] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [editingContact, setEditingContact] = useState<ContactResponse | null>(null)

  const contactsQuery = useContactsQuery(query)
  const addContactMutation = useAddContactMutation(query)
  const updateContactMutation = useUpdateContactMutation(query)
  const deleteContactMutation = useDeleteContactMutation(query)

  const { showError, showSuccess } = useToast()

  const loading = contactsQuery.isLoading
  const error = getApiErrorMessage(contactsQuery.error, 'Unable to load contacts')
  const contacts = contactsQuery.data ?? []

  const actionLoading = addContactMutation.isPending || updateContactMutation.isPending

  const canSubmit = useMemo(() => {
    return contactName.trim().length > 0 && emailRegex.test(contactEmail.trim())
  }, [contactName, contactEmail])

  function startEdit(contact: ContactResponse) {
    setEditingContact(contact)
    setContactName(contact.contactName)
    setContactEmail(contact.contactEmail)
  }

  function resetForm() {
    setEditingContact(null)
    setContactName('')
    setContactEmail('')
  }

  async function handleSubmit() {
    if (!canSubmit) {
      showError('Enter a valid contact name and email.')
      return
    }

    const payload = {
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
    }

    try {
      if (editingContact) {
        await updateContactMutation.mutateAsync({
          contactId: editingContact.id,
          payload,
        })
        showSuccess('Contact updated successfully.')
      } else {
        await addContactMutation.mutateAsync(payload)
        showSuccess('Contact added successfully.')
      }

      resetForm()
    } catch (mutationError) {
      showError(getApiErrorMessage(mutationError, 'Unable to save contact'))
    }
  }

  async function handleDelete(contactId: string) {
    try {
      await deleteContactMutation.mutateAsync(contactId)
      showSuccess('Contact deleted.')

      if (editingContact?.id === contactId) {
        resetForm()
      }
    } catch (mutationError) {
      showError(getApiErrorMessage(mutationError, 'Unable to delete contact'))
    }
  }

  if (loading) {
    return <PageLoading title="Loading contacts…" />
  }

  if (contactsQuery.error) {
    return <PageError message={error} onRetry={() => void contactsQuery.refetch()} />
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Contacts</h1>
          <p className="text-sm text-muted-foreground">Manage saved payment contacts for quick transfers.</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Saved Contacts</CardTitle>
            </div>
            <CardDescription>Search by name or email.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Search contacts"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />

            {contacts.length === 0 ? (
              <EmptyState title="No contacts yet" description="Add your first contact to start quick payments." />
            ) : (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-background p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-sm font-semibold uppercase">
                        {contact.contactName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{contact.contactName}</p>
                        <p className="text-xs text-muted-foreground">{contact.contactEmail}</p>
                        <p className="text-xs text-muted-foreground">Added {formatDateTime(contact.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEdit(contact)}>
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void handleDelete(contact.id)}
                        disabled={deleteContactMutation.isPending}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">{editingContact ? 'Edit Contact' : 'Add Contact'}</CardTitle>
            </div>
            <CardDescription>Store trusted recipients for fintech-style quick send.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Contact Name</label>
              <Input
                placeholder="Enter display name"
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Contact Email</label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
              />
            </div>

            {!canSubmit && (contactName.length > 0 || contactEmail.length > 0) ? (
              <Alert>Provide a non-empty name and a valid email.</Alert>
            ) : null}

            <Button className="w-full" onClick={() => void handleSubmit()} disabled={actionLoading || !canSubmit}>
              {actionLoading ? 'Saving…' : editingContact ? 'Update Contact' : 'Add Contact'}
            </Button>
            {editingContact ? (
              <Button className="w-full" variant="outline" onClick={resetForm} disabled={actionLoading}>
                Cancel Edit
              </Button>
            ) : null}

            <div className="rounded-xl border bg-muted/40 p-3 text-xs text-muted-foreground">
              <UserRound className="mr-1 inline h-3.5 w-3.5" />
              Duplicate contacts are prevented automatically by email.
            </div>
          </CardContent>
        </Card>
      </section>
    </motion.div>
  )
}
