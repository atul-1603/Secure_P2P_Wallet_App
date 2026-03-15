import { ArrowRightLeft, ArrowUpRight, Landmark, PlusCircle, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { IncomingOutgoingChart } from '../../components/charts/IncomingOutgoingChart'
import { AnimatedNumber } from '../../components/ui/animated-number'
import { Alert } from '../../components/ui/alert'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { EmptyState, PageError, PageLoading } from '../../components/ui/page-state'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { useHistoryQuery, useWalletQuery } from '../../hooks/useDashboardData'
import { getApiErrorMessage } from '../../utils/error'
import { formatCurrency, formatDateTime, formatNumber } from '../../utils/format'

export default function DashboardPage() {
  const walletQuery = useWalletQuery()
  const historyQuery = useHistoryQuery()

  const wallet = walletQuery.data ?? null
  const transactions = useMemo(() => {
    const items = historyQuery.data ?? []
    return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [historyQuery.data])

  const recentTransactions = transactions.slice(0, 6)
  const walletId = wallet?.walletId
  const incoming = transactions
    .filter((item) => item.toWalletId === walletId)
    .reduce((sum, item) => sum + item.amount, 0)
  const outgoing = transactions
    .filter((item) => item.fromWalletId === walletId)
    .reduce((sum, item) => sum + item.amount, 0)

  const loading = walletQuery.isLoading || historyQuery.isLoading
  const error = [walletQuery.error, historyQuery.error]
    .filter(Boolean)
    .map((item) => getApiErrorMessage(item, 'Request failed'))[0]

  if (loading) {
    return <PageLoading title="Loading dashboard summary…" />
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
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Financial Overview</h1>
          <p className="text-sm text-muted-foreground">
            High-level wallet performance with quick insight into money movement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">{wallet?.status ?? 'NO WALLET'}</Badge>
          <Button variant="outline" onClick={() => {
            void walletQuery.refetch()
            void historyQuery.refetch()
          }}>
            Refresh
          </Button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Button asChild className="justify-start">
          <Link to="/send-money">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Send Money
          </Link>
        </Button>
        <Button asChild variant="outline" className="justify-start">
          <Link to="/add-money">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Money
          </Link>
        </Button>
        <Button asChild variant="outline" className="justify-start">
          <Link to="/receive">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Receive Money
          </Link>
        </Button>
      </section>

      {!wallet ? <Alert>Create your wallet from the Wallet page to unlock full dashboard insights.</Alert> : null}

      {wallet && wallet.balance <= 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-2xl border border-dashed bg-muted/30 p-6 text-center">
              <h2 className="text-lg font-semibold">Your wallet is empty.</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                Add money to start transferring funds, or share your wallet ID and QR to receive money from another user.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button asChild>
                  <Link to="/add-money">Add Money</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/receive">Receive Money</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-3">
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="xl:col-span-1">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </div>
                <CardDescription>Primary account value and identity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-bold">
              {wallet ? (
                <AnimatedNumber
                  value={wallet.balance}
                  formatter={(value) => formatCurrency(value, wallet.currency)}
                />
              ) : '--'}
            </p>
            <p className="text-xs text-muted-foreground">{wallet?.walletId ?? 'Wallet unavailable'}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border bg-background p-3">
                <p className="text-muted-foreground">Incoming</p>
                <p className="font-semibold text-emerald-600">+{formatNumber(incoming)}</p>
              </div>
              <div className="rounded-xl border bg-background p-3">
                <p className="text-muted-foreground">Outgoing</p>
                <p className="font-semibold text-rose-600">-{formatNumber(outgoing)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="xl:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Incoming vs Outgoing</CardTitle>
              <Landmark className="h-4 w-4 text-primary" />
            </div>
                <CardDescription>Distribution of credits and debits.</CardDescription>
          </CardHeader>
          <CardContent>
            <IncomingOutgoingChart incoming={incoming} outgoing={outgoing} />
          </CardContent>
        </Card>
        </motion.div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Transactions</CardTitle>
          <CardDescription>Latest activity snapshot from your account history.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <EmptyState
              title="No transactions yet"
              description="Send funds from the Send Money page once your wallet is created."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((item) => {
                  const incomingTx = item.toWalletId === walletId

                  return (
                    <TableRow key={item.transactionId}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{formatDateTime(item.createdAt)}</TableCell>
                      <TableCell>{incomingTx ? 'IN' : 'OUT'}</TableCell>
                      <TableCell className={incomingTx ? 'text-emerald-600' : 'text-rose-600'}>
                        {incomingTx ? '+' : '-'}{formatNumber(item.amount)} {item.currency}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.status}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[180px] truncate">{item.reference || item.transactionId}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
          <div className="mt-4 flex justify-end">
            <Button asChild variant="outline">
              <Link to="/transactions">View all transactions</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
