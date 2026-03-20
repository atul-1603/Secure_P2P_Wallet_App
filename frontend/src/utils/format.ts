const inrCurrencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

export function formatCurrency(amount: number) {
  return inrCurrencyFormatter.format(amount)
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits }).format(value)
}
