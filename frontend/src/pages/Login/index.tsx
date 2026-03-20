import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Alert } from '../../components/ui/alert'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useToast } from '../../components/ui/toast'
import { useAuth } from '../../auth/AuthContext'
import { getApiErrorMessage } from '../../utils/error'

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const { showError } = useToast()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  })

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  async function onSubmit(values: LoginFormValues) {
    setSubmitError(null)

    try {
      const response = await login(values)
      const redirectTo = (location.state as { from?: string } | null)?.from ?? '/dashboard'

      if (response.otpRequired) {
        navigate('/verify-otp', {
          replace: true,
          state: {
            flow: 'login',
            usernameOrEmail: values.usernameOrEmail,
            password: values.password,
            from: redirectTo,
            expiresInSeconds: response.otpExpiresInSeconds,
          },
        })
        return
      }

      navigate(redirectTo, { replace: true })
    } catch (error) {
      const message = getApiErrorMessage(error, 'Unable to login')
      setSubmitError(message)
      showError(message)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Welcome back</h2>
        <p className="text-sm text-muted-foreground">Sign in to manage your secure wallet.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label className="text-sm font-medium">Username or Email</label>
          <Input {...register('usernameOrEmail')} placeholder="you@example.com" />
          {errors.usernameOrEmail ? <p className="text-xs text-destructive">{errors.usernameOrEmail.message}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Password</label>
          <Input type="password" {...register('password')} placeholder="••••••••" />
          {errors.password ? <p className="text-xs text-destructive">{errors.password.message}</p> : null}
        </div>

        {submitError ? <Alert>{submitError}</Alert> : null}

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link className="font-medium text-primary hover:underline" to="/register">
          Create one
        </Link>
      </p>

      <p className="text-xs text-muted-foreground">
        <Link className="font-medium text-primary hover:underline" to="/">
          Back to home
        </Link>
      </p>
    </div>
  )
}
