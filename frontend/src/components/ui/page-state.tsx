import { AlertTriangle, Inbox, Loader2 } from 'lucide-react'
import { Alert } from './alert'
import { Button } from './button'

type PageLoadingProps = {
  title?: string
}

export function PageLoading({ title = 'Loading data…' }: PageLoadingProps) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border bg-card p-6 text-center shadow-fintech">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  )
}

type PageErrorProps = {
  message: string
  onRetry?: () => void
}

export function PageError({ message, onRetry }: PageErrorProps) {
  return (
    <div className="space-y-3">
      <Alert className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4" />
        <span>{message}</span>
      </Alert>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  )
}

type EmptyStateProps = {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border bg-card p-6 text-center shadow-fintech">
      <Inbox className="h-5 w-5 text-muted-foreground" />
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
