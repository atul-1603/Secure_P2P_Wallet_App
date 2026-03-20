import { motion } from 'framer-motion'
import { KeyRound, Lock, ShieldCheck, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { Alert } from '../../components/ui/alert'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { PageError, PageLoading } from '../../components/ui/page-state'
import { useToast } from '../../components/ui/toast'
import {
  useChangePasswordMutation,
  useProfileQuery,
  useProfileSessionsQuery,
  useUpdateSecurityMutation,
} from '../../hooks/useProfileData'
import { getApiErrorMessage } from '../../utils/error'
import { formatDateTime } from '../../utils/format'

export default function SecurityPage() {
  const profileQuery = useProfileQuery()
  const sessionsQuery = useProfileSessionsQuery()
  const updateSecurityMutation = useUpdateSecurityMutation()
  const changePasswordMutation = useChangePasswordMutation()
  const { showError, showSuccess } = useToast()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const loading = profileQuery.isLoading || sessionsQuery.isLoading
  const error = [profileQuery.error, sessionsQuery.error]
    .filter(Boolean)
    .map((item) => getApiErrorMessage(item, 'Unable to load security controls'))[0]

  const profile = profileQuery.data
  const sessions = sessionsQuery.data ?? []

  async function toggleTwoFactor(nextValue: boolean) {
    try {
      await updateSecurityMutation.mutateAsync({ twoFactorEnabled: nextValue })
      showSuccess(`Two-factor authentication ${nextValue ? 'enabled' : 'disabled'}.`)
    } catch (mutationError) {
      showError(getApiErrorMessage(mutationError, 'Unable to update security settings'))
    }
  }

  async function handlePasswordChange() {
    if (!currentPassword || !newPassword) {
      showError('Current and new passwords are required.')
      return
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      })

      setCurrentPassword('')
      setNewPassword('')
      showSuccess('Password updated successfully.')
    } catch (mutationError) {
      showError(getApiErrorMessage(mutationError, 'Unable to update password'))
    }
  }

  if (loading) {
    return <PageLoading title="Loading security controls…" />
  }

  if (error || !profile) {
    return <PageError message={error ?? 'Unable to load security details'} onRetry={() => {
      void profileQuery.refetch()
      void sessionsQuery.refetch()
    }} />
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <section>
        <h1 className="text-2xl font-semibold">Security</h1>
        <p className="text-sm text-muted-foreground">
          Review account protection settings and monitor security posture.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Account Integrity</CardTitle>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <CardDescription>Identity and token security controls.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Account</span>
              <Badge variant="outline">{profile.username}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Email Verification</span>
              <Badge variant={profile.emailVerified ? 'success' : 'outline'}>
                {profile.emailVerified ? 'Verified' : 'Pending'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>2FA (OTP)</span>
              <Badge variant={profile.twoFactorEnabled ? 'success' : 'outline'}>
                {profile.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Credential Hygiene</CardTitle>
              <KeyRound className="h-4 w-4 text-primary" />
            </div>
            <CardDescription>Recommended controls for production-grade safety.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-1">
              <label className="text-sm font-medium">Current Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </div>
            <Button className="w-full" onClick={() => void handlePasswordChange()} disabled={changePasswordMutation.isPending}>
              <KeyRound className="mr-1 h-4 w-4" />
              {changePasswordMutation.isPending ? 'Updating…' : 'Change Password'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Session Controls</CardTitle>
              <Smartphone className="h-4 w-4 text-primary" />
            </div>
            <CardDescription>Operational checks for active sessions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border bg-background p-3 text-xs text-muted-foreground">
              {sessions.length} active session{sessions.length === 1 ? '' : 's'} detected.
            </div>
            {sessions.map((session) => (
              <div key={session.sessionId} className="rounded-xl border bg-background p-3 text-xs">
                <p className="font-medium text-foreground">{session.current ? 'Current device' : session.sessionId}</p>
                <p className="mt-1 line-clamp-1 text-muted-foreground">{session.userAgent}</p>
                <p className="mt-1 text-muted-foreground">{session.ipAddress}</p>
                <p className="mt-1 text-muted-foreground">{formatDateTime(session.lastActiveAt)}</p>
              </div>
            ))}
            <Button
              className="w-full"
              onClick={() => void toggleTwoFactor(true)}
              disabled={updateSecurityMutation.isPending || profile.twoFactorEnabled}
            >
              Enable 2FA
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => void toggleTwoFactor(false)}
              disabled={updateSecurityMutation.isPending || !profile.twoFactorEnabled}
            >
              <Lock className="mr-1 h-4 w-4" />
              Disable 2FA
            </Button>
          </CardContent>
        </Card>
      </section>

      {profile.accountRestricted ? (
        <Alert className="border-amber-200 bg-amber-50 text-amber-700">
          Account is currently restricted. Complete KYC and contact support for reactivation.
        </Alert>
      ) : null}
    </motion.div>
  )
}
