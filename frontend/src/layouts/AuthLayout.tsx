import { ShieldCheck } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import { ThemeToggle } from '../components/ui/theme-toggle'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-fintech">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link className="flex items-center gap-3" to="/">
            <div className="rounded-md bg-primary p-2 text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Secure P2P Wallet</h1>
              <p className="text-xs text-muted-foreground">Bank-grade experience for everyday transfers</p>
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
