import { motion } from 'framer-motion'
import { ArrowRightLeft, Copy, CopyCheck, Wallet2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert } from '../../components/ui/alert'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { PageError, PageLoading } from '../../components/ui/page-state'
import { WalletQrCard } from '../../components/wallet/WalletQrCard'
import { useWalletQuery } from '../../hooks/useDashboardData'
import { getApiErrorMessage } from '../../utils/error'

export default function ReceiveMoneyPage() {
  const walletQuery = useWalletQuery()
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)

  console.log('ReceiveMoneyPage: walletQuery State', {
    status: walletQuery.status,
    data: walletQuery.data,
    error: walletQuery.error,
    isLoading: walletQuery.isLoading,
  })

  const wallet = walletQuery.data ?? null

  const errorMessage = getApiErrorMessage(walletQuery.error, 'Unable to load wallet')

  async function copyWalletId() {
    if (!wallet) {
      return
    }

    try {
      await navigator.clipboard.writeText(wallet.walletId)
      setCopied(true)
      setCopyError(null)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopyError('Clipboard access is blocked. Please copy the wallet ID manually.')
    }
  }

  if (walletQuery.isLoading) {
    return <PageLoading title="Loading receive details…" />
  }

  if (walletQuery.error) {
    return <PageError message={errorMessage} onRetry={() => void walletQuery.refetch()} />
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
          <h1 className="text-2xl font-semibold">Receive Money</h1>
          <p className="text-sm text-muted-foreground">
            Share your wallet ID or QR code so others can send funds instantly.
          </p>
        </div>

        <Button variant="outline" onClick={() => void walletQuery.refetch()}>
          Refresh
        </Button>
      </section>

      {!wallet ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">No wallet available</CardTitle>
            <CardDescription>Create your wallet first to enable receiving money.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/wallet">Go to Wallet Setup</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">Wallet ID</CardTitle>
                  <Wallet2 className="h-4 w-4 text-primary" />
                </div>
                <CardDescription>Send this identifier to the person transferring funds to you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl border bg-background p-4">
                  <p className="break-all font-medium">{wallet.walletId}</p>
                </div>
                <Button variant="outline" onClick={() => void copyWalletId()}>
                  {copied ? <CopyCheck className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy wallet ID'}
                </Button>
                {copyError ? <Alert>{copyError}</Alert> : null}
                <Alert className="border-blue-200 bg-blue-50 text-blue-700">
                  Share only your wallet ID or QR. Never share your login credentials or tokens.
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">How others can send you money</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>1. Open Send Money in their account.</p>
                <p>2. Paste your wallet ID or scan your QR code.</p>
                <p>3. Enter amount and confirm transfer.</p>
                <p>4. Funds appear in your wallet balance and transaction history.</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <WalletQrCard walletId={wallet.walletId} title="Receive QR" description="Let other users scan this QR and transfer directly to your wallet." />

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pay by QR</CardTitle>
                <CardDescription>Scanner-assisted transfer is available in Send Money.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/send-money">
                    <ArrowRightLeft className="mr-1 h-4 w-4" />
                    Open Send Money
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </motion.div>
  )
}
