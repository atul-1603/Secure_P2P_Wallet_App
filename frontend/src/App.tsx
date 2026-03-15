import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthLayout } from './layouts/AuthLayout'
import { AppLayout } from './layouts/AppLayout'
import { RequireAuth } from './auth/RequireAuth'
import DashboardPage from './pages/Dashboard'
import WalletPage from './pages/Wallet'
import SendMoneyPage from './pages/SendMoney'
import AddMoneyPage from './pages/AddMoney'
import ReceiveMoneyPage from './pages/ReceiveMoney'
import TransactionsPage from './pages/Transactions'
import AnalyticsPage from './pages/Analytics'
import SecurityPage from './pages/Security'
import SettingsPage from './pages/Settings'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/send-money" element={<SendMoneyPage />} />
          <Route path="/add-money" element={<AddMoneyPage />} />
          <Route path="/receive" element={<ReceiveMoneyPage />} />
          <Route path="/receive-money" element={<ReceiveMoneyPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
