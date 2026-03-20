import { motion } from 'framer-motion'
import { BadgeCheck, IdCard, LockKeyhole, Sparkles, UserCircle2 } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import type { UserProfileResponse } from '../../types/api'
import { formatCurrency, formatDateTime } from '../../utils/format'

type ProfileOverviewSectionProps = {
  profile: UserProfileResponse
  avatarPreviewUrl: string | null
  walletBalance: number | null
  transactionsCount: number
  sessionsCount: number
  onGoToPersonal: () => void
  onGoToSecurity: () => void
  onGoToKyc: () => void
}

function resolveKycVariant(status: string): 'success' | 'warning' | 'outline' {
  const normalizedStatus = status.toUpperCase()

  if (normalizedStatus === 'VERIFIED') {
    return 'success'
  }

  if (normalizedStatus === 'REJECTED') {
    return 'warning'
  }

  return 'outline'
}

export default function ProfileOverviewSection({
  profile,
  avatarPreviewUrl,
  walletBalance,
  transactionsCount,
  sessionsCount,
  onGoToPersonal,
  onGoToSecurity,
  onGoToKyc,
}: ProfileOverviewSectionProps) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-cyan-500/20 via-sky-500/10 to-emerald-500/20">
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-white bg-white/80 shadow">
              {avatarPreviewUrl || profile.profileImageUrl ? (
                <img
                  src={avatarPreviewUrl ?? profile.profileImageUrl ?? undefined}
                  alt="Profile avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <UserCircle2 className="h-10 w-10" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Account overview</p>
              <h2 className="text-2xl font-semibold">{profile.fullName}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant={profile.emailVerified ? 'success' : 'outline'}>
                  {profile.emailVerified ? 'Email Verified' : 'Email Pending'}
                </Badge>
                <Badge variant={resolveKycVariant(profile.kycStatus)}>{profile.kycStatus}</Badge>
                <Badge variant={profile.accountRestricted ? 'warning' : 'success'}>
                  {profile.accountRestricted ? 'Restricted' : 'Active'}
                </Badge>
              </div>
            </div>

            <div className="md:ml-auto">
              <p className="text-xs text-muted-foreground">Customer since</p>
              <p className="text-sm font-medium">{formatDateTime(profile.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Wallet Balance</CardDescription>
              <CardTitle className="text-xl">{walletBalance == null ? '--' : formatCurrency(walletBalance)}</CardTitle>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Transactions</CardDescription>
              <CardTitle className="text-xl">{transactionsCount}</CardTitle>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Sessions</CardDescription>
              <CardTitle className="text-xl">{sessionsCount}</CardTitle>
            </CardHeader>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>Jump directly to the section you need.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Button variant="outline" onClick={onGoToPersonal}>
            <BadgeCheck className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          <Button variant="outline" onClick={onGoToSecurity}>
            <LockKeyhole className="mr-2 h-4 w-4" />
            Security
          </Button>
          <Button variant="outline" onClick={onGoToKyc}>
            <IdCard className="mr-2 h-4 w-4" />
            KYC Verification
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
