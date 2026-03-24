import { ShieldCheck } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import { ThemeToggle } from '../components/ui/theme-toggle'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="w-full max-w-lg rounded-2xl border bg-card p-4 shadow-fintech sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
          <Link className="flex items-center gap-3" to="/">
            <div className="rounded-md bg-primary p-2 text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold sm:text-lg">Secure P2P Wallet</h1>
              <p className="text-[11px] text-muted-foreground sm:text-xs">Bank-grade experience for everyday transfers</p>
            </div>
          </Link>
          <ThemeToggle variant="outline" />
        </div>
        <div>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
