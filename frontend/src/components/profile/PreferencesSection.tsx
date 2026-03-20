import { Bell, Save, Settings2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

type PreferencesSectionProps = {
  emailAlertsEnabled: boolean
  transferAlertsEnabled: boolean
  onEmailAlertsChange: (enabled: boolean) => void
  onTransferAlertsChange: (enabled: boolean) => void
  onSavePreferences: () => void
  isSavingPreferences: boolean
}

export default function PreferencesSection({
  emailAlertsEnabled,
  transferAlertsEnabled,
  onEmailAlertsChange,
  onTransferAlertsChange,
  onSavePreferences,
  isSavingPreferences,
}: PreferencesSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary" />
            Preferences
          </CardTitle>
          <CardDescription>Keep only essential notification controls for a cleaner experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between rounded-xl border bg-background p-4">
            <div>
              <p className="text-sm font-medium">Email Alerts</p>
              <p className="text-xs text-muted-foreground">Receive account and security updates over email.</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlertsEnabled}
              onChange={(event) => onEmailAlertsChange(event.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border bg-background p-4">
            <div>
              <p className="text-sm font-medium">Transfer Alerts</p>
              <p className="text-xs text-muted-foreground">Get notified for incoming and outgoing wallet transfers.</p>
            </div>
            <input
              type="checkbox"
              checked={transferAlertsEnabled}
              onChange={(event) => onTransferAlertsChange(event.target.checked)}
            />
          </label>

          <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-3 text-xs text-cyan-900">
            <Bell className="mr-1 inline h-3.5 w-3.5" />
            Currency preferences are intentionally removed to keep profile settings focused and fintech-clean.
          </div>

          <div className="flex justify-end">
            <Button onClick={onSavePreferences} disabled={isSavingPreferences}>
              <Save className="mr-2 h-4 w-4" />
              {isSavingPreferences ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
