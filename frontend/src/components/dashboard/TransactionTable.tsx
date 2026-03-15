import type { TransactionHistoryItem } from '../../types/api'
import { formatDateTime, formatNumber } from '../../utils/format'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

type TransactionTableProps = {
  items: TransactionHistoryItem[]
  loading: boolean
  walletId?: string
}

function resolveVariant(status: string) {
  if (status.toUpperCase() === 'COMPLETED') return 'success'
  if (status.toUpperCase() === 'PENDING') return 'warning'
  return 'outline'
}

export function TransactionTable({ items, loading, walletId }: TransactionTableProps) {
  return (
    <Card id="history">
      <CardHeader>
        <CardTitle className="text-base">Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const direction = item.toWalletId === walletId ? 'IN' : 'OUT'
                return (
                  <TableRow key={item.transactionId}>
                    <TableCell className="font-medium">{direction}</TableCell>
                    <TableCell>{formatNumber(item.amount)} {item.currency}</TableCell>
                    <TableCell>
                      <Badge variant={resolveVariant(item.status)}>{item.status}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">{item.reference || item.transactionId}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDateTime(item.createdAt)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
