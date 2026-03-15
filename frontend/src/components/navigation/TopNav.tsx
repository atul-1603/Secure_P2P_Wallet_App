import { Bell, LogOut, Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Button } from '../ui/button'

type TopNavProps = {
  username?: string
  onLogout: () => void
  onToggleSidebar: () => void
}

const routeTitleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/wallet': 'Wallet',
  '/send-money': 'Send Money',
  '/add-money': 'Add Money',
  '/receive': 'Receive Money',
  '/receive-money': 'Receive Money',
  '/transactions': 'Transactions',
  '/analytics': 'Analytics',
  '/security': 'Security',
  '/settings': 'Settings',
}

export function TopNav({ username, onLogout, onToggleSidebar }: TopNavProps) {
  const location = useLocation()
  const pageTitle = routeTitleMap[location.pathname] ?? 'Wallet Console'

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Wallet</p>
          <h2 className="text-sm font-semibold sm:text-base">{pageTitle}</h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="hidden text-right sm:block">
          <p className="text-xs text-muted-foreground">Signed in as</p>
          <p className="text-sm font-medium">{username ?? 'User'}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="mr-1 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}
