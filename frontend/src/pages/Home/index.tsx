import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Cpu,
  Instagram,
  Linkedin,
  Lock,
  PlayCircle,
  QrCode,
  Shield,
  ShieldCheck,
  TrendingUp,
  Twitter,
  Zap,
} from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { ThemeToggle } from '../../components/ui/theme-toggle'

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-200">
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200/70 bg-slate-50/90 backdrop-blur-md dark:border-white/5 dark:bg-[#020617]/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link className="flex items-center gap-2" to="/">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Secure<span className="text-blue-500">Wallet</span>
              </span>
            </Link>

            <div className="hidden items-center space-x-8 text-sm font-medium md:flex">
              <a className="transition-colors hover:text-cyan-400" href="#features">
                Features
              </a>
              <a className="transition-colors hover:text-cyan-400" href="#security">
                Security
              </a>
              <a className="transition-colors hover:text-cyan-400" href="#how-it-works">
                How it Works
              </a>
              <a className="transition-colors hover:text-cyan-400" href="#pricing">
                Pricing
              </a>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle variant="outline" />
              <Link className="hidden text-sm font-semibold transition-colors hover:text-slate-950 dark:hover:text-white sm:block" to="/login">
                Login
              </Link>
              <Link
                className="rounded-full bg-blue-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600"
                to="/register"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pb-20 pt-32 lg:pb-32 lg:pt-48">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-full -translate-x-1/2">
          <div className="absolute left-[-10%] top-[-10%] hidden h-[40%] w-[40%] rounded-full bg-blue-500/20 blur-[120px] dark:block" />
          <div className="absolute bottom-[10%] right-[-10%] hidden h-[30%] w-[30%] rounded-full bg-purple-500/20 blur-[120px] dark:block" />
        </div>

        <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-4 text-center sm:px-6 lg:flex-row lg:px-8 lg:text-left">
          <div className="flex-1 space-y-8">
            <span className="inline-block rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-600 dark:border-white/10 dark:bg-white/5 dark:text-cyan-300">
              Trusted by 2M+ Users Worldwide
            </span>
            <h1 className="text-5xl font-extrabold leading-[1.1] text-slate-900 dark:text-white lg:text-7xl">
              Fast, <span className="gradient-text">Secure</span>, and Smart Payments.
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400 lg:mx-0">
              The all-in-one financial dashboard designed for the modern era. Send money, track investments, and secure
              your assets with military-grade encryption.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row lg:justify-start">
              <Link
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-4 font-bold text-white transition-transform hover:scale-105 dark:bg-white dark:text-[#020617] sm:w-auto"
                to="/register"
              >
                Open Free Account <ArrowRight className="h-5 w-5" />
              </Link>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-4 font-bold transition-colors hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 sm:w-auto">
                <PlayCircle className="h-5 w-5" /> Watch Demo
              </button>
            </div>
          </div>

          <div className="relative flex-1" data-purpose="hero-graphic">
            <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
              <div className="glass-card animate-float relative z-20 h-48 w-80 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-start justify-between">
                  <Cpu className="h-10 w-10 text-yellow-500" />
                  <span className="font-mono italic text-slate-500 dark:text-white/60">Secure Platinum</span>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="text-2xl font-mono tracking-widest text-slate-900 dark:text-white">**** **** **** 8824</div>
                  <div className="flex items-end justify-between text-xs uppercase opacity-70">
                    <span>Alex Johnson</span>
                    <span>12/28</span>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 top-10 -z-10 h-44 w-72 rotate-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-900 opacity-30 blur-[2px]" />
              <div className="absolute -left-4 bottom-10 -z-10 h-44 w-72 -rotate-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 opacity-30 blur-[2px]" />
            </div>
          </div>
        </div>
        </section>

      <section className="bg-grid relative py-24" id="features">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white lg:text-5xl">Powerful Features</h2>
            <p className="text-slate-600 dark:text-slate-400">Everything you need to manage your finances in one place.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-2 hover:border-blue-500/50 dark:border-white/10 dark:bg-white/5">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 transition-colors group-hover:bg-blue-500">
                <Zap className="h-6 w-6 text-blue-500 group-hover:text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Instant Transfers</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Send and receive funds globally in seconds with zero hidden fees.
              </p>
            </div>
            <div className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-2 hover:border-purple-500/50 dark:border-white/10 dark:bg-white/5">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 transition-colors group-hover:bg-purple-500">
                <Shield className="h-6 w-6 text-purple-500 group-hover:text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">OTP Security</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Multi-factor authentication for every transaction to keep you safe.
              </p>
            </div>
            <div className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-2 hover:border-cyan-500/50 dark:border-white/10 dark:bg-white/5">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 transition-colors group-hover:bg-cyan-500">
                <QrCode className="h-6 w-6 text-cyan-500 group-hover:text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">QR Payments</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Pay at millions of stores worldwide with just a quick scan.
              </p>
            </div>
            <div className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-2 hover:border-green-500/50 dark:border-white/10 dark:bg-white/5">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 transition-colors group-hover:bg-green-500">
                <Bell className="h-6 w-6 text-green-500 group-hover:text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Real-time Alerts</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Stay updated with push notifications for every activity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden py-24 dark:bg-[#020617]" id="security">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-card relative overflow-hidden rounded-[3rem] border border-blue-500/20 p-8 lg:flex lg:items-center lg:gap-16 lg:p-16">
            <div className="absolute -left-24 -top-24 hidden h-96 w-96 rounded-full bg-blue-500/20 blur-[100px] dark:block" />
            <div className="relative z-10 flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cyan-500 dark:text-cyan-300">
                <Lock className="h-4 w-4" /> Military Grade Security
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white lg:text-5xl">
                Your security is our <span className="text-blue-500">top priority.</span>
              </h2>
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                We use end-to-end encryption (AES-256) for all data. Your funds are protected by biometric verification
                and decentralized security protocols.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 font-medium text-slate-900 dark:text-white">
                  <CheckCircle2 className="h-5 w-5 text-cyan-500" /> 256-bit AES Encryption
                </li>
                <li className="flex items-center gap-3 font-medium text-slate-900 dark:text-white">
                  <CheckCircle2 className="h-5 w-5 text-cyan-500" /> Biometric Login (FaceID/TouchID)
                </li>
                <li className="flex items-center gap-3 font-medium text-slate-900 dark:text-white">
                  <CheckCircle2 className="h-5 w-5 text-cyan-500" /> Fraud Protection Algorithms
                </li>
              </ul>
            </div>
            <div className="relative mt-10 flex flex-1 justify-center lg:mt-0">
              <div className="group relative">
                <div className="absolute inset-0 hidden rounded-full bg-blue-500 opacity-20 blur-3xl transition-opacity group-hover:opacity-40 dark:block" />
                <ShieldCheck className="relative z-10 h-56 w-56 text-blue-500/80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white lg:text-5xl">Master your money</h2>
            <p className="text-slate-600 dark:text-slate-400">Intelligent analytics that help you grow your wealth.</p>
          </div>
          <div className="relative mx-auto max-w-5xl">
            <div className="glass-card overflow-hidden rounded-3xl border border-slate-200 shadow-2xl dark:border-white/5">
              <div className="flex h-[500px]">
                <div className="hidden w-64 flex-col space-y-8 border-r border-slate-200 p-6 dark:border-white/10 sm:flex">
                  <div className="space-y-4">
                    <div className="h-4 w-32 rounded bg-slate-200 dark:bg-white/10" />
                    <div className="h-4 w-40 rounded bg-slate-200 dark:bg-white/10" />
                    <div className="h-4 w-24 rounded bg-slate-200 dark:bg-white/10" />
                  </div>
                  <div className="mt-auto">
                    <div className="h-10 w-full rounded-xl border border-blue-500/30 bg-blue-500/20" />
                  </div>
                </div>
                <div className="relative flex-1 overflow-hidden p-8">
                  <div className="mb-12 flex items-end justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Balance</h4>
                      <div className="text-4xl font-bold text-slate-900 dark:text-white">₹42,920.50</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-white/10" />
                      <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-white/10" />
                    </div>
                  </div>
                  <div className="flex h-40 items-end gap-2">
                    <div className="h-1/2 flex-1 rounded-t-lg bg-blue-500/20" />
                    <div className="h-2/3 flex-1 rounded-t-lg bg-blue-500/40" />
                    <div className="h-full flex-1 rounded-t-lg bg-blue-500/60" />
                    <div className="h-1/3 flex-1 rounded-t-lg bg-blue-500/20" />
                    <div className="h-3/4 flex-1 rounded-t-lg bg-blue-500/80" />
                    <div className="h-1/2 flex-1 rounded-t-lg bg-blue-500/40" />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card animate-float absolute -right-4 -top-10 w-64 rounded-2xl p-6 shadow-2xl sm:-right-10">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20">
                  <TrendingUp className="h-5 w-5 text-cyan-500" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-tight text-slate-500 dark:text-slate-400">Earnings</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">+12.5%</div>
                </div>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div className="h-full w-3/4 bg-cyan-500" />
              </div>
            </div>

            <div className="glass-card absolute -bottom-6 -left-4 w-72 rounded-2xl p-6 shadow-2xl sm:-left-10" style={{ animation: 'float 5s ease-in-out infinite reverse' }}>
              <div className="mb-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Recent Transactions</div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded bg-slate-200 dark:bg-white/10" />
                    <span className="text-sm font-medium">Apple Store</span>
                  </div>
                  <span className="text-sm text-red-400">-₹99.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded bg-slate-200 dark:bg-white/10" />
                    <span className="text-sm font-medium">Starbucks</span>
                  </div>
                  <span className="text-sm text-red-400">-₹12.50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-100/60 py-24 dark:bg-[#020617]/50" id="how-it-works">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white lg:text-5xl">Getting started is easy</h2>
          </div>
          <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="absolute left-0 top-1/2 -z-10 hidden h-0.5 w-full bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 md:block" />
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-500 bg-white text-2xl font-black text-blue-500 shadow-xl shadow-blue-500/20 dark:bg-[#020617]">
                1
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">Create Account</h4>
              <p className="text-slate-600 dark:text-slate-400">Sign up in under 2 minutes with just your email and phone number.</p>
            </div>
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-purple-500 bg-white text-2xl font-black text-purple-500 shadow-xl shadow-purple-500/20 dark:bg-[#020617]">
                2
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">Link Bank</h4>
              <p className="text-slate-600 dark:text-slate-400">Securely connect your cards and bank accounts with trusted integrations.</p>
            </div>
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-500 bg-white text-2xl font-black text-cyan-500 shadow-xl shadow-cyan-500/20 dark:bg-[#020617]">
                3
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">Start Transacting</h4>
              <p className="text-slate-600 dark:text-slate-400">Send money, pay bills, and track your spending in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24" id="pricing">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-12 text-2xl font-bold text-slate-900 dark:text-white">Loved by thousands of companies</h2>
          <div className="flex flex-wrap justify-center gap-12 text-3xl font-black tracking-tighter opacity-40 grayscale contrast-125">
            <span>FINTECH</span>
            <span>VERGE</span>
            <span>NEXUS</span>
            <span>PRISM</span>
            <span>STRATUM</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/80 pb-12 pt-24 dark:border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2">
              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">SecureWallet</span>
              </div>
              <p className="mb-8 max-w-xs text-slate-600 dark:text-slate-400">
                The future of digital finance. Safe, simple, and smarter for everyone.
              </p>
              <div className="flex gap-4">
                <a className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 transition-colors hover:bg-blue-500 hover:text-white dark:bg-white/5" href="#">
                  <Twitter className="h-5 w-5" />
                </a>
                <a className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 transition-colors hover:bg-blue-500 hover:text-white dark:bg-white/5" href="#">
                  <Instagram className="h-5 w-5" />
                </a>
                <a className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 transition-colors hover:bg-blue-500 hover:text-white dark:bg-white/5" href="#">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h5 className="mb-6 font-bold text-slate-900 dark:text-white">Product</h5>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li><a className="transition-colors hover:text-slate-950 dark:hover:text-white" href="#">Personal</a></li>
                <li><a className="transition-colors hover:text-slate-950 dark:hover:text-white" href="#">Business</a></li>
                <li><a className="transition-colors hover:text-slate-950 dark:hover:text-white" href="#">Crypto</a></li>
                <li><a className="transition-colors hover:text-slate-950 dark:hover:text-white" href="#">Security</a></li>
              </ul>
            </div>

            <div>
              <h5 className="mb-6 font-bold text-slate-900 dark:text-white">Company</h5>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li><a className="transition-colors hover:text-slate-950 dark:hover:text-white" href="#">About Us</a></li>
                <li><a className="transition-colors hover:text-slate-950 dark:hover:text-white" href="#">Careers</a></li>
                <li><a className="transition-colors hover:text-slate-950 dark:hover:text-white" href="#">Press</a></li>
                <li><a className="transition-colors hover:text-slate-950 dark:hover:text-white" href="#">Contact</a></li>
              </ul>
            </div>

            <div>
              <h5 className="mb-6 font-bold text-slate-900 dark:text-white">Legal</h5>
              <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                <li><a className="transition-colors hover:text-slate-950 dark:hover:text-white" href="#">Privacy Policy</a></li>
                <li><a className="transition-colors hover:text-slate-950 dark:hover:text-white" href="#">Terms of Service</a></li>
                <li><a className="transition-colors hover:text-slate-950 dark:hover:text-white" href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-xs text-slate-500 dark:border-white/5 md:flex-row">
            <p>© 2024 SecureWallet Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <span>
                Status: <span className="text-green-500">All systems functional</span>
              </span>
              <a className="hover:text-slate-900 dark:hover:text-white" href="#">
                Back to top
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
