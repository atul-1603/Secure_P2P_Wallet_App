import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, CircleDollarSign, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { Alert } from '../../components/ui/alert'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { PageError } from '../../components/ui/page-state'
import { Skeleton } from '../../components/ui/skeleton'
import { useToast } from '../../components/ui/toast'
import { useDepositMutation, useWalletQuery } from '../../hooks/useDashboardData'
import { getApiErrorMessage } from '../../utils/error'
import { formatCurrency } from '../../utils/format'

const addMoneySchema = z.object({
  amount: z.number().positive('Amount must be greater than zero').max(1000000, 'Amount is too large'),
  note: z.string().max(120, 'Note is too long').optional(),
})

type AddMoneyValues = z.infer<typeof addMoneySchema>

const quickAmounts = [100, 500, 1000] as const

export default function AddMoneyPage() {
  const walletQuery = useWalletQuery()
  const depositMutation = useDepositMutation()
  const { showError } = useToast()
  const [confirmValues, setConfirmValues] = useState<AddMoneyValues | null>(null)
  const [successAmount, setSuccessAmount] = useState<number | null>(null)

  const wallet = walletQuery.data ?? null

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<AddMoneyValues>({
    resolver: zodResolver(addMoneySchema),
    defaultValues: {
      amount: 100,
      note: '',
    },
  })

  const amountValue = watch('amount')

  const pageError = useMemo(() => {
    return [walletQuery.error, depositMutation.error]
      .filter(Boolean)
      .map((item) => getApiErrorMessage(item, 'Unable to open Add Money'))[0]
  }, [depositMutation.error, walletQuery.error])

  function openConfirmation(values: AddMoneyValues) {
    setConfirmValues(values)
    setSuccessAmount(null)
  }

  async function confirmDeposit() {
    if (!confirmValues) {
      return
    }

    try {
      await depositMutation.mutateAsync({
        amount: confirmValues.amount,
        note: confirmValues.note?.trim() || undefined,
        reference: `wallet-topup-${Date.now()}`,
      })
    } catch (error) {
      showError(getApiErrorMessage(error, 'Add money failed. Please try again.'))
      return
    }

    setSuccessAmount(confirmValues.amount)
    setConfirmValues(null)
    reset({ amount: 100, note: '' })
  }

  if (walletQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-80" />
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-11 w-full" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-11 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (pageError && !wallet) {
    return <PageError message={pageError} onRetry={() => void walletQuery.refetch()} />
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
          <h1 className="text-2xl font-semibold">Add Money</h1>
          <p className="text-sm text-muted-foreground">
            Deposit funds into your wallet to start instant P2P transfers.
          </p>
        </div>

        <Button variant="outline" onClick={() => void walletQuery.refetch()}>
          Refresh Wallet
        </Button>
      </section>

      {pageError && wallet ? <Alert>{pageError}</Alert> : null}

      {!wallet ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Wallet Required</CardTitle>
            <CardDescription>Create your wallet first, then return here to add funds.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/wallet">Go to Wallet Setup</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">Deposit Funds</CardTitle>
                <CircleDollarSign className="h-4 w-4 text-primary" />
              </div>
              <CardDescription>
                Choose amount, confirm transaction, and your wallet updates in real time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit(openConfirmation)}>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Amount ({wallet.currency})</label>
                  <Input type="number" min="0" step="0.01" {...register('amount', { valueAsNumber: true })} />
                  {errors.amount ? <p className="text-xs text-destructive">{errors.amount.message}</p> : null}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant={amountValue === value ? 'default' : 'outline'}
                      onClick={() => setValue('amount', value, { shouldValidate: true })}
                    >
                      {formatCurrency(value, wallet.currency)}
                    </Button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Note (optional)</label>
                  <Input placeholder="Monthly top-up" {...register('note')} />
                  {errors.note ? <p className="text-xs text-destructive">{errors.note.message}</p> : null}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting || depositMutation.isPending}>
                  Continue to Confirm
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Wallet Snapshot</CardTitle>
              <CardDescription>Current available amount before this deposit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border bg-background p-4">
                <p className="text-xs text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(wallet.balance, wallet.currency)}</p>
              </div>
              <div className="rounded-xl border bg-background p-4 text-xs text-muted-foreground">
                Wallet ID
                <p className="truncate pt-1 text-sm font-medium text-foreground">{wallet.walletId}</p>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <AnimatePresence>
        {successAmount !== null ? (
          <motion.div
            className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0.7, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 16 }}
              >
                <CheckCircle2 className="h-5 w-5" />
              </motion.div>
              <p className="font-medium">Deposit successful</p>
            </div>
            <p className="mt-1 text-sm">
              {formatCurrency(successAmount, wallet?.currency ?? 'USD')} has been added to your wallet.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {confirmValues ? (
          <motion.div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-fintech"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
            >
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-base font-semibold">Confirm Deposit</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                You are about to add {formatCurrency(confirmValues.amount, wallet?.currency ?? 'USD')} to your wallet.
              </p>

              {confirmValues.note ? (
                <p className="mt-3 rounded-lg border bg-background p-2 text-xs text-muted-foreground">
                  Note: {confirmValues.note}
                </p>
              ) : null}

              <div className="mt-5 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setConfirmValues(null)} disabled={depositMutation.isPending}>
                  Cancel
                </Button>
                <Button type="button" onClick={() => void confirmDeposit()} disabled={depositMutation.isPending}>
                  {depositMutation.isPending ? 'Depositing…' : 'Confirm Deposit'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}
