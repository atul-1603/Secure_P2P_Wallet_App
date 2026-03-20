import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '../../auth/AuthContext'
import { Alert } from '../../components/ui/alert'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useToast } from '../../components/ui/toast'
import { authService } from '../../services/auth.service'
import { getApiErrorMessage } from '../../utils/error'

const otpSchema = z.object({
  otpCode: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
})

type OtpFormValues = z.infer<typeof otpSchema>

type VerifyOtpState =
  | {
      flow: 'register'
      email: string
      expiresInSeconds?: number
    }
  | {
      flow: 'login'
      usernameOrEmail: string
      password: string
      from?: string
      expiresInSeconds?: number
    }

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function isRegisterState(value: VerifyOtpState): value is Extract<VerifyOtpState, { flow: 'register' }> {
  return value.flow === 'register'
}

export default function VerifyOtpPage() {
  const { isAuthenticated, verifyLoginOtp } = useAuth()
  const { showError, showSuccess } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as VerifyOtpState | null
  const activeState = state && (state.flow === 'register' || state.flow === 'login') ? state : null
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [resendError, setResendError] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(state?.expiresInSeconds ?? 300)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otpCode: '',
    },
  })

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return
    }

    const timerId = window.setInterval(() => {
      setRemainingSeconds((currentValue) => {
        if (currentValue <= 1) {
          window.clearInterval(timerId)
          return 0
        }

        return currentValue - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [remainingSeconds])

  const title = useMemo(() => {
    if (!activeState) {
      return 'Verify OTP'
    }

    return isRegisterState(activeState) ? 'Verify your email' : 'Two-factor verification'
  }, [activeState])

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  if (!activeState) {
    return <Navigate to="/login" replace />
  }

  async function onSubmit(values: OtpFormValues) {
    setSubmitError(null)

    if (!activeState) {
      navigate('/login', { replace: true })
      return
    }

    try {
      if (isRegisterState(activeState)) {
        await authService.verifyEmail({
          email: activeState.email,
          otpCode: values.otpCode,
        })

        showSuccess('Email verified successfully. Please login to continue.')
        navigate('/login', { replace: true })
        return
      }

      const response = await verifyLoginOtp({
        usernameOrEmail: activeState.usernameOrEmail,
        otpCode: values.otpCode,
      })

      const redirectTo = activeState.from ?? '/dashboard'
      showSuccess(response.message || 'Login successful')
      navigate(redirectTo, { replace: true })
    } catch (error) {
      const message = getApiErrorMessage(error, 'Unable to verify OTP')
      setSubmitError(message)
      showError(message)
    }
  }

  async function handleResendOtp() {
    if (remainingSeconds > 0) {
      return
    }

    if (!activeState) {
      navigate('/login', { replace: true })
      return
    }

    setResendError(null)
    setIsResending(true)

    try {
      if (isRegisterState(activeState)) {
        const response = await authService.resendEmailVerificationOtp({ email: activeState.email })
        showSuccess(response.message || 'Verification OTP sent')
        setRemainingSeconds(300)
        return
      }

      const response = await authService.login({
        usernameOrEmail: activeState.usernameOrEmail,
        password: activeState.password,
      })

      if (!response.otpRequired) {
        throw new Error('Unexpected login response while resending OTP')
      }

      setRemainingSeconds(response.otpExpiresInSeconds || 300)
      showSuccess(response.message || 'Login OTP sent')
    } catch (error) {
      const message = getApiErrorMessage(error, 'Unable to resend OTP')
      setResendError(message)
      showError(message)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">
          {isRegisterState(activeState)
            ? `Enter the 6-digit code sent to ${activeState.email}.`
            : 'Enter the 6-digit code sent to your registered email.'}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label className="text-sm font-medium">One-Time Password</label>
          <Input
            maxLength={6}
            inputMode="numeric"
            autoComplete="one-time-code"
            {...register('otpCode')}
            placeholder="123456"
          />
          {errors.otpCode ? <p className="text-xs text-destructive">{errors.otpCode.message}</p> : null}
        </div>

        <div className="rounded-xl border bg-background p-3 text-sm">
          OTP expires in <span className="font-semibold">{formatSeconds(remainingSeconds)}</span>
        </div>

        {submitError ? <Alert>{submitError}</Alert> : null}
        {resendError ? <Alert>{resendError}</Alert> : null}

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Verifying…' : 'Verify OTP'}
        </Button>

        <Button
          className="w-full"
          type="button"
          variant="outline"
          disabled={isResending || remainingSeconds > 0}
          onClick={handleResendOtp}
        >
          {isResending ? 'Resending…' : 'Resend OTP'}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Return to{' '}
        <Link className="font-medium text-primary hover:underline" to="/login">
          login
        </Link>
      </p>
    </div>
  )
}
