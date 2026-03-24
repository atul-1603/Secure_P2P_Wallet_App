import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { CircleDollarSign, WalletCards } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { Alert } from '../../components/ui/alert'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { PageError, PageLoading } from '../../components/ui/page-state'
import { useCreateWalletMutation, useDepositMutation, useHistoryQuery, useWalletQuery } from '../../hooks/useDashboardData'
import { getApiErrorMessage } from '../../utils/error'
import { formatCurrency, formatDateTime } from '../../utils/format'

const createWalletSchema = z.object({
  seedDemoBalance: z.boolean().optional(),
})

type CreateWalletValues = z.infer<typeof createWalletSchema>

export default function WalletPage() {
  const walletQuery = useWalletQuery()
  const historyQuery = useHistoryQuery()
  const createWalletMutation = useCreateWalletMutation()
  const depositMutation = useDepositMutation()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [warningMessage, setWarningMessage] = useState<string | null>(null)

  const wallet = walletQuery.data ?? null
  const history = historyQuery.data ?? []

  const incoming = useMemo(() => {
    if (!wallet) return 0
    return history.filter((item) => item.toWalletId === wallet.walletId).reduce((sum, item) => sum + item.amount, 0)
  }, [history, wallet])

  const outgoing = useMemo(() => {
    if (!wallet) return 0
    return history.filter((item) => item.fromWalletId === wallet.walletId).reduce((sum, item) => sum + item.amount, 0)
  }, [history, wallet])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateWalletValues>({
    resolver: zodResolver(createWalletSchema),
    defaultValues: {
      seedDemoBalance: false,
    },
  })

  const loading = walletQuery.isLoading || historyQuery.isLoading
  const error = [walletQuery.error, historyQuery.error, createWalletMutation.error, depositMutation.error]
    .filter(Boolean)
    .map((item) => getApiErrorMessage(item, 'Unable to load wallet data'))[0]

  async function onCreateWallet(values: CreateWalletValues) {
    setSuccessMessage(null)
    setWarningMessage(null)

    await createWalletMutation.mutateAsync({})

    if (values.seedDemoBalance) {
      try {
        await depositMutation.mutateAsync({
          amount: 1000,
          note: 'Demo starter balance',
          reference: `demo-seed-${Date.now()}`,
        })
        setSuccessMessage(`Wallet created and funded with demo balance of ${formatCurrency(1000)}.`)
      } catch {
        setSuccessMessage('Wallet created successfully.')
        setWarningMessage('Demo balance could not be applied by the backend deposit endpoint.')
      }
    } else {
      setSuccessMessage('Wallet created successfully.')
    }

    reset({
      seedDemoBalance: values.seedDemoBalance,
    })
  }

  if (loading) {
    return <PageLoading title="Loading wallet details…" />
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
      <section className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">Wallet</h1>
          <p className="text-sm text-muted-foreground">View account details, status, and wallet-level metrics.</p>
        </div>
        <Button className="w-full sm:w-auto" variant="outline" onClick={() => {
          void walletQuery.refetch()
          void historyQuery.refetch()
        }}>
          Refresh
        </Button>
      </section>

      {successMessage ? <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700">{successMessage}</Alert> : null}
      {warningMessage ? <Alert className="border-amber-200 bg-amber-50 text-amber-700">{warningMessage}</Alert> : null}

      {!wallet ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create Your Wallet</CardTitle>
            <CardDescription>Your account wallet will be initialized in INR.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handleSubmit(onCreateWallet)}>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" {...register('seedDemoBalance')} />
                Start with demo balance ({formatCurrency(1000)}) for development testing.
              </label>
              {errors.seedDemoBalance ? <p className="text-xs text-destructive">{errors.seedDemoBalance.message}</p> : null}
              <div className="flex justify-end">
              <Button className="h-12 w-full sm:w-auto" disabled={isSubmitting || createWalletMutation.isPending || depositMutation.isPending} type="submit">
                {(createWalletMutation.isPending || depositMutation.isPending) ? 'Creating…' : 'Create Wallet'}
              </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Account Snapshot</CardTitle>
                <WalletCards className="h-4 w-4 text-primary" />
              </div>
              <CardDescription>Live wallet status and metadata.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-background p-4">
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(wallet.balance)}</p>
              </div>
              <div className="rounded-xl border bg-background p-4">
                <p className="text-xs text-muted-foreground">Wallet Status</p>
                <Badge variant="outline">{wallet.status}</Badge>
              </div>
              <div className="rounded-xl border bg-background p-4">
                <p className="text-xs text-muted-foreground">Wallet ID</p>
                <p className="truncate text-sm font-medium">{wallet.walletId}</p>
              </div>
              <div className="rounded-xl border bg-background p-4">
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm font-medium">{formatDateTime(wallet.createdAt)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Flow Metrics</CardTitle>
                <CircleDollarSign className="h-4 w-4 text-primary" />
              </div>
              <CardDescription>Credits and debits based on transaction history.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border bg-background p-3">
                <p className="text-xs text-muted-foreground">Incoming volume</p>
                <p className="text-lg font-semibold text-emerald-600">+{formatCurrency(incoming)}</p>
              </div>
              <div className="rounded-xl border bg-background p-3">
                <p className="text-xs text-muted-foreground">Outgoing volume</p>
                <p className="text-lg font-semibold text-rose-600">-{formatCurrency(outgoing)}</p>
              </div>

              {wallet.balance <= 0 ? (
                <div className="rounded-xl border border-dashed bg-muted/30 p-3 text-xs">
                  <p className="mb-2 font-medium">Your wallet is empty.</p>
                  <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
                    <Button asChild size="sm">
                      <Link to="/add-money">Add Money</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/receive">Receive Money</Link>
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </section>
      )}
    </motion.div>
  )
}
