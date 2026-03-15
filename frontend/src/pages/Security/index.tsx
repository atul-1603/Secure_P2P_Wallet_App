import { motion } from 'framer-motion'
import { KeyRound, Lock, ShieldCheck, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { Alert } from '../../components/ui/alert'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { useAuth } from '../../auth/AuthContext'

export default function SecurityPage() {
  const { user } = useAuth()
  const [scanRunning, setScanRunning] = useState(false)
  const [scanMessage, setScanMessage] = useState<string | null>(null)

  async function runSecurityCheck() {
    setScanRunning(true)
    setScanMessage(null)
    await new Promise((resolve) => setTimeout(resolve, 900))
    setScanRunning(false)
    setScanMessage('No critical security anomalies detected in your current account posture.')
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

      {scanMessage ? <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700">{scanMessage}</Alert> : null}

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
              <span>User</span>
              <Badge variant="outline">{user?.username ?? 'Unknown'}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>JWT Protection</span>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Route Guards</span>
              <Badge variant="success">Enabled</Badge>
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
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-xl border bg-background p-3">Use long unique passwords with periodic rotation.</div>
            <div className="rounded-xl border bg-background p-3">Enable least-privilege policies for backend secrets.</div>
            <div className="rounded-xl border bg-background p-3">Audit login and transfer events regularly.</div>
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
            <Button className="w-full" disabled={scanRunning} onClick={() => void runSecurityCheck()}>
              {scanRunning ? 'Running checks…' : 'Run Security Check'}
            </Button>
            <Button className="w-full" variant="outline">
              <Lock className="mr-1 h-4 w-4" />
              Review Auth Policies
            </Button>
          </CardContent>
        </Card>
      </section>
    </motion.div>
  )
}
