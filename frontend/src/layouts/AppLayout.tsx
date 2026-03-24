import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { TopNav } from '../components/navigation/TopNav'
import { Sidebar } from '../components/navigation/Sidebar'
import { useAuth } from '../auth/AuthContext'
import { AiAssistant } from '../components/assistant/AiAssistant'

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
          <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 xl:px-10">
            <Outlet />
          </main>
          <AiAssistant />
        </div>
      </div>
    </div>
  )
}
