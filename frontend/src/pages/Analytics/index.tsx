import { motion } from 'framer-motion'
import { BarChart3, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import { IncomingOutgoingChart } from '../../components/charts/IncomingOutgoingChart'
import { TransactionStatusChart } from '../../components/charts/TransactionStatusChart'
import { VolumeTrendChart } from '../../components/charts/VolumeTrendChart'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { EmptyState, PageError, PageLoading } from '../../components/ui/page-state'
import { useHistoryQuery, useWalletQuery } from '../../hooks/useDashboardData'
import { getApiErrorMessage } from '../../utils/error'
import { formatCurrency } from '../../utils/format'

function getRecentPeriods(count: number) {
  const periods: { key: string; label: string }[] = []
  const date = new Date()

  for (let index = count - 1; index >= 0; index -= 1) {
    const item = new Date(date.getFullYear(), date.getMonth() - index, 1)
    const key = `${item.getFullYear()}-${String(item.getMonth() + 1).padStart(2, '0')}`
    const label = item.toLocaleString('en-US', { month: 'short' })
    periods.push({ key, label })
  }

  return periods
}

export default function AnalyticsPage() {
  const walletQuery = useWalletQuery()
  const historyQuery = useHistoryQuery()

  const wallet = walletQuery.data ?? null
  const walletId = wallet?.walletId
  const history = historyQuery.data ?? []

  const incoming = history
    .filter((item) => item.toWalletId === walletId)
    .reduce((sum, item) => sum + item.amount, 0)
  const outgoing = history
    .filter((item) => item.fromWalletId === walletId)
    .reduce((sum, item) => sum + item.amount, 0)

  const monthlyTrend = useMemo(() => {
    const periods = getRecentPeriods(6)

    return periods.map((period) => {
      const matching = history.filter((item) => item.createdAt.startsWith(period.key))
      const periodIncoming = matching
        .filter((item) => item.toWalletId === walletId)
        .reduce((sum, item) => sum + item.amount, 0)
      const periodOutgoing = matching
        .filter((item) => item.fromWalletId === walletId)
        .reduce((sum, item) => sum + item.amount, 0)

      return {
        period: period.label,
        incoming: periodIncoming,
        outgoing: periodOutgoing,
      }
    })
  }, [history, walletId])

  const statusBreakdown = useMemo(() => {
    const statusMap = new Map<string, number>()

    history.forEach((item) => {
      const key = item.status.toUpperCase()
      statusMap.set(key, (statusMap.get(key) ?? 0) + 1)
    })

    return Array.from(statusMap.entries()).map(([name, value]) => ({ name, value }))
  }, [history])

  const averageTicket = history.length > 0 ? history.reduce((sum, item) => sum + item.amount, 0) / history.length : 0

  const loading = walletQuery.isLoading || historyQuery.isLoading
  const error = [walletQuery.error, historyQuery.error]
    .filter(Boolean)
    .map((item) => getApiErrorMessage(item, 'Unable to load analytics'))[0]

  if (loading) {
    return <PageLoading title="Loading analytics dashboard…" />
  }

  if (error) {
    return <PageError message={error} onRetry={() => {
      void walletQuery.refetch()
      void historyQuery.refetch()
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
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Chart-driven view of transfer behavior, velocity, and status outcomes.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total transactions</CardDescription>
            <CardTitle>{history.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Average transfer size</CardDescription>
            <CardTitle>{formatCurrency(averageTicket)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Incoming volume</CardDescription>
            <CardTitle className="text-emerald-600">+{formatCurrency(incoming)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Outgoing volume</CardDescription>
            <CardTitle className="text-rose-600">-{formatCurrency(outgoing)}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      {!wallet ? (
        <EmptyState
          title="Create wallet for richer analytics"
          description="Once your wallet is active, this page will show account-scoped trends and comparisons."
        />
      ) : (
        <section className="grid gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">6-Month Volume Trend</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <CardDescription>Incoming and outgoing transfer totals by month.</CardDescription>
            </CardHeader>
            <CardContent>
              <VolumeTrendChart data={monthlyTrend} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Status Breakdown</CardTitle>
                <Badge variant="outline">{statusBreakdown.length || 0} types</Badge>
              </div>
              <CardDescription>Completion and exception distribution.</CardDescription>
            </CardHeader>
            <CardContent>
              {statusBreakdown.length === 0 ? (
                <EmptyState title="No statuses yet" description="Run transfers to populate status analytics." />
              ) : (
                <TransactionStatusChart data={statusBreakdown} />
              )}
            </CardContent>
          </Card>
        </section>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Flow Composition</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <CardDescription>Relative share of incoming and outgoing volume for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <IncomingOutgoingChart incoming={incoming} outgoing={outgoing} />
          {wallet ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Current balance: {formatCurrency(wallet.balance)}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  )
}
