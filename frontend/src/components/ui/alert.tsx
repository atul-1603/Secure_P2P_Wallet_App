import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export function Alert({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('relative w-full rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive', className)} {...props} />
}
