import { motion } from 'framer-motion'
import { BellRing, Palette, Save, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Alert } from '../../components/ui/alert'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'

type PreferenceState = {
  displayName: string
  defaultCurrency: string
  emailAlerts: boolean
  transferAlerts: boolean
}

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<PreferenceState>({
    displayName: 'Wallet User',
    defaultCurrency: 'USD',
    emailAlerts: true,
    transferAlerts: true,
  })

  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)

  async function savePreferences() {
    setSaving(true)
    setSavedMessage(null)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSaving(false)
    setSavedMessage('Preferences saved successfully.')
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <section>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage interface preferences and operational alerts.</p>
      </section>

      {savedMessage ? <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700">{savedMessage}</Alert> : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Profile Preferences</CardTitle>
              <SlidersHorizontal className="h-4 w-4 text-primary" />
            </div>
            <CardDescription>Control naming and settlement defaults.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Display Name</label>
              <Input
                value={preferences.displayName}
                onChange={(event) => setPreferences((value) => ({ ...value, displayName: event.target.value }))}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Default Currency</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={preferences.defaultCurrency}
                onChange={(event) => setPreferences((value) => ({ ...value, defaultCurrency: event.target.value }))}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Notification Controls</CardTitle>
              <BellRing className="h-4 w-4 text-primary" />
            </div>
            <CardDescription>Choose which events trigger notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center justify-between rounded-xl border bg-background p-3 text-sm">
              <span>Email alerts</span>
              <input
                type="checkbox"
                checked={preferences.emailAlerts}
                onChange={(event) =>
                  setPreferences((value) => ({
                    ...value,
                    emailAlerts: event.target.checked,
                  }))
                }
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border bg-background p-3 text-sm">
              <span>Transfer notifications</span>
              <input
                type="checkbox"
                checked={preferences.transferAlerts}
                onChange={(event) =>
                  setPreferences((value) => ({
                    ...value,
                    transferAlerts: event.target.checked,
                  }))
                }
              />
            </label>

            <div className="rounded-xl border bg-background p-3 text-xs text-muted-foreground">
              Notification settings are currently client-side and can be connected to backend preferences when available.
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Appearance</CardTitle>
            <Palette className="h-4 w-4 text-primary" />
          </div>
          <CardDescription>Modern card-based UI is active using Tailwind and shared design tokens.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end">
          <Button onClick={() => void savePreferences()} disabled={saving}>
            <Save className="mr-1 h-4 w-4" />
            {saving ? 'Saving…' : 'Save Preferences'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
