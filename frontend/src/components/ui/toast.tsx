import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

type ToastVariant = 'info' | 'success' | 'error'

type ToastItem = {
  id: number
  message: string
  variant: ToastVariant
}

type ToastContextValue = {
  showToast: (message: string, variant?: ToastVariant) => void
  showError: (message: string) => void
  showSuccess: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const variantClassMap: Record<ToastVariant, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-destructive/30 bg-destructive/10 text-destructive',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => {
    setItems((previousItems) => previousItems.filter((item) => item.id !== id))
  }, [])

  const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = Date.now() + Math.floor(Math.random() * 1000)

    setItems((previousItems) => [...previousItems, { id, message, variant }])

    window.setTimeout(() => {
      dismiss(id)
    }, 3500)
  }, [dismiss])

  const value = useMemo<ToastContextValue>(() => ({
    showToast,
    showError: (message: string) => showToast(message, 'error'),
    showSuccess: (message: string) => showToast(message, 'success'),
  }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'pointer-events-auto rounded-xl border p-3 text-sm shadow-fintech',
              variantClassMap[item.variant],
            )}
          >
            <div className="flex items-start gap-2">
              <p className="flex-1">{item.message}</p>
              <button
                type="button"
                className="opacity-80 transition hover:opacity-100"
                aria-label="Dismiss notification"
                onClick={() => dismiss(item.id)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider')
  }

  return context
}
