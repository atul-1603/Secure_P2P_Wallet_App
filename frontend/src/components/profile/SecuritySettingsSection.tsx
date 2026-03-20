import { Lock, Shield, ShieldCheck, ShieldX } from 'lucide-react'
import { Alert } from '../ui/alert'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import type { ActiveSessionItemResponse } from '../../types/api'
import { formatDateTime } from '../../utils/format'

type SecuritySettingsSectionProps = {
  twoFactorEnabled: boolean
  currentPassword: string
  newPassword: string
  onCurrentPasswordChange: (value: string) => void
  onNewPasswordChange: (value: string) => void
  onChangePassword: () => void
  isChangingPassword: boolean
  onToggleTwoFactor: (enabled: boolean) => void
  isUpdatingTwoFactor: boolean
  sessions: ActiveSessionItemResponse[]
}

export default function SecuritySettingsSection({
  twoFactorEnabled,
  currentPassword,
  newPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onChangePassword,
  isChangingPassword,
  onToggleTwoFactor,
  isUpdatingTwoFactor,
  sessions,
}: SecuritySettingsSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Security Settings
          </CardTitle>
          <CardDescription>Control password, two-factor authentication, and active sessions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Current Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(event) => onCurrentPasswordChange(event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(event) => onNewPasswordChange(event.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onChangePassword} disabled={isChangingPassword}>
              <Lock className="mr-2 h-4 w-4" />
              {isChangingPassword ? 'Updating...' : 'Change Password'}
            </Button>
          </div>

          <div className="rounded-2xl border bg-muted/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add OTP protection to every login session.</p>
              </div>
              <Badge variant={twoFactorEnabled ? 'success' : 'outline'}>
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => onToggleTwoFactor(true)}
                disabled={isUpdatingTwoFactor || twoFactorEnabled}
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Enable 2FA
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onToggleTwoFactor(false)}
                disabled={isUpdatingTwoFactor || !twoFactorEnabled}
              >
                <ShieldX className="mr-2 h-4 w-4" />
                Disable 2FA
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
          <CardDescription>Review active device sessions for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <Alert>No active sessions found.</Alert>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.sessionId} className="rounded-2xl border bg-background p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{session.current ? 'Current Session' : session.sessionId}</p>
                    <Badge variant={session.current ? 'success' : 'outline'}>
                      {session.current ? 'Current' : 'Active'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{session.userAgent}</p>
                  <p className="mt-1 text-xs text-muted-foreground">IP: {session.ipAddress}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Last active: {formatDateTime(session.lastActiveAt)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
