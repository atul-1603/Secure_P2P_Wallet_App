import type { TransactionHistoryItem, WalletResponse } from '../../types/api'
import { formatCurrency } from '../../utils/format'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

type WalletBalanceCardsProps = {
  wallet: WalletResponse | null
  history: TransactionHistoryItem[]
  loading: boolean
}

export function WalletBalanceCards({ wallet, history, loading }: WalletBalanceCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const walletId = wallet?.walletId
  const incoming = history
    .filter((item) => item.toWalletId === walletId)
    .reduce((sum, item) => sum + item.amount, 0)
  const outgoing = history
    .filter((item) => item.fromWalletId === walletId)
    .reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Available Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">
            {wallet ? formatCurrency(wallet.balance) : '--'}
          </p>
          <p className="text-xs text-muted-foreground">{wallet?.walletId ?? 'Create wallet to start transacting'}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Incoming Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-emerald-600">+{formatCurrency(incoming)}</p>
          <p className="text-xs text-muted-foreground">Credits received</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Outgoing Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-rose-600">-{formatCurrency(outgoing)}</p>
          <p className="text-xs text-muted-foreground">Debits sent</p>
        </CardContent>
      </Card>
    </div>
  )
}
