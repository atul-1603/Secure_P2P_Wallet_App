import { motion } from 'framer-motion'
import { ArrowRightLeft, QrCode } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CameraQrScanner } from '../../components/wallet/CameraQrScanner'
import { SendMoneyForm } from '../../components/dashboard/SendMoneyForm'
import { Alert } from '../../components/ui/alert'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { PageError, PageLoading } from '../../components/ui/page-state'
import { useToast } from '../../components/ui/toast'
import { useTransferMutation, useWalletQuery } from '../../hooks/useDashboardData'
import { getApiErrorMessage } from '../../utils/error'

const walletUuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i

function extractWalletId(value: string): string | null {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    return null
  }

  if (walletUuidRegex.test(normalizedValue)) {
    return normalizedValue.match(walletUuidRegex)?.[0] ?? null
  }

  return null
}

export default function SendMoneyPage() {
  const walletQuery = useWalletQuery()
  const transferMutation = useTransferMutation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [scanMessage, setScanMessage] = useState<string | null>(null)
  const { showError } = useToast()

  const wallet = walletQuery.data ?? null
  const prefilledToWalletId = searchParams.get('to')?.trim() || undefined

  const loading = walletQuery.isLoading
  const error = [walletQuery.error, transferMutation.error]
    .filter(Boolean)
    .map((item) => getApiErrorMessage(item, 'Unable to process transfer'))[0]

  async function onTransfer(payload: {
    toWalletId: string
    amount: number
    reference?: string
    note?: string
  }) {
    setSuccessMessage(null)

    try {
      await transferMutation.mutateAsync(payload)
      setSuccessMessage('Transfer completed successfully.')
    } catch (error) {
      showError(getApiErrorMessage(error, 'Transfer failed. Please check wallet ID and balance.'))
      throw error
    }
  }

  function handleScannedWalletId(value: string) {
    const normalizedValue = extractWalletId(value)

    if (!normalizedValue) {
      showError('Scanned QR does not contain a valid wallet ID.')
      return
    }

    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('to', normalizedValue)
    setSearchParams(nextParams, { replace: true })
    setScanMessage(`Recipient wallet prefilled from QR: ${normalizedValue}`)
  }

  if (loading) {
    return <PageLoading title="Loading wallet for transfer…" />
  }

  if (error && !wallet) {
    return <PageError message={error} onRetry={() => void walletQuery.refetch()} />
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
          <h1 className="text-2xl font-semibold">Send Money</h1>
          <p className="text-sm text-muted-foreground">
            Execute secure peer-to-peer transfers from your dedicated transfer console.
          </p>
        </div>
        <Button variant="outline" onClick={() => void walletQuery.refetch()}>
          Refresh Wallet
        </Button>
      </section>

      {successMessage ? <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700">{successMessage}</Alert> : null}
      {error && wallet ? <Alert>{error}</Alert> : null}
      {scanMessage ? <Alert className="border-blue-200 bg-blue-50 text-blue-700">{scanMessage}</Alert> : null}

      {!wallet ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Wallet Required</CardTitle>
            </div>
            <CardDescription>Create a wallet before initiating transfers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/wallet">Go to Wallet Setup</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SendMoneyForm
              wallet={wallet}
              onSubmit={onTransfer}
              loading={transferMutation.isPending}
              prefilledToWalletId={prefilledToWalletId}
            />
          </div>

          <div className="space-y-6">
            <CameraQrScanner onScan={handleScannedWalletId} />

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Need a QR to receive?</CardTitle>
                </div>
                <CardDescription>Open Receive Money to share your own wallet QR and ID.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/receive">Go to Receive Money</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </motion.div>
  )
}
