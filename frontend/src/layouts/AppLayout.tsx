import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { TopNav } from '../components/navigation/TopNav'
import { Sidebar } from '../components/navigation/Sidebar'
import { useAuth } from '../auth/AuthContext'

export function AppLayout() {
  const { user, logout } = useAuth()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
        <div className="flex min-h-screen flex-1 flex-col">
          <TopNav
            username={user?.username}
            onLogout={logout}
            onToggleSidebar={() => setMobileSidebarOpen((value) => !value)}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
