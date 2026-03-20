import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { EmptyState, PageError, PageLoading } from '../../components/ui/page-state'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { useHistoryQuery, useWalletQuery } from '../../hooks/useDashboardData'
import { getApiErrorMessage } from '../../utils/error'
import { formatCurrency, formatDateTime } from '../../utils/format'

type DirectionFilter = 'ALL' | 'IN' | 'OUT'

const PAGE_SIZE = 10

export default function TransactionsPage() {
  const walletQuery = useWalletQuery()
  const historyQuery = useHistoryQuery()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>('ALL')
  const [page, setPage] = useState(1)

  const wallet = walletQuery.data ?? null
  const walletId = wallet?.walletId
  const history = useMemo(() => {
    const items = historyQuery.data ?? []
    return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [historyQuery.data])

  const statusOptions = useMemo(() => {
    const statuses = Array.from(new Set(history.map((item) => item.status.toUpperCase())))
    return ['ALL', ...statuses]
  }, [history])

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return history.filter((item) => {
      const direction = item.toWalletId === walletId ? 'IN' : 'OUT'
      const matchesDirection = directionFilter === 'ALL' || direction === directionFilter
      const matchesStatus = statusFilter === 'ALL' || item.status.toUpperCase() === statusFilter
      const amountStr = item.amount.toString()
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.transactionId.toLowerCase().includes(normalizedSearch) ||
        item.reference.toLowerCase().includes(normalizedSearch) ||
        (item.fromWalletId && item.fromWalletId.toLowerCase().includes(normalizedSearch)) ||
        (item.toWalletId && item.toWalletId.toLowerCase().includes(normalizedSearch)) ||
        amountStr.includes(normalizedSearch)

      return matchesDirection && matchesStatus && matchesSearch
    })
  }, [directionFilter, history, searchTerm, statusFilter, walletId])

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const pageItems = filteredTransactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const loading = walletQuery.isLoading || historyQuery.isLoading
  const error = [walletQuery.error, historyQuery.error]
    .filter(Boolean)
    .map((item) => getApiErrorMessage(item, 'Unable to load transactions'))[0]

  if (loading) {
    return <PageLoading title="Loading transaction ledger…" />
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
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          Full transaction ledger with filter controls and paginated review.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>Search by ID/reference and narrow results by status or direction.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search transaction, wallet, or reference"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value)
                setPage(1)
              }}
            />
          </div>

          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value)
              setPage(1)
            }}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={directionFilter}
            onChange={(event) => {
              setDirectionFilter(event.target.value as DirectionFilter)
              setPage(1)
            }}
          >
            <option value="ALL">ALL DIRECTIONS</option>
            <option value="IN">INCOMING</option>
            <option value="OUT">OUTGOING</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-base">Ledger</CardTitle>
            <Badge variant="outline">{filteredTransactions.length} records</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {pageItems.length === 0 ? (
            <EmptyState
              title="No matching transactions"
              description="Try relaxing filters or creating new transfers from the Send Money page."
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Counterparty</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map((item) => {
                    const incomingTx = item.toWalletId === walletId
                    const counterparty = incomingTx ? item.fromWalletId : item.toWalletId

                    return (
                      <TableRow key={item.transactionId}>
                        <TableCell className="whitespace-nowrap text-muted-foreground">{formatDateTime(item.createdAt)}</TableCell>
                        <TableCell>{incomingTx ? 'IN' : 'OUT'}</TableCell>
                        <TableCell className={incomingTx ? 'text-emerald-600' : 'text-rose-600'}>
                          {incomingTx ? '+' : '-'}{formatCurrency(item.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.status}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[180px] truncate">{counterparty}</TableCell>
                        <TableCell className="max-w-[180px] truncate">{item.reference || item.transactionId}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
