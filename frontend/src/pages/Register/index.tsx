import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Alert } from '../../components/ui/alert'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useToast } from '../../components/ui/toast'
import { useAuth } from '../../auth/AuthContext'
import { getApiErrorMessage } from '../../utils/error'

const registerSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { isAuthenticated, register: registerUser } = useAuth()
  const { showError, showSuccess } = useToast()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  async function onSubmit(values: RegisterFormValues) {
    setSubmitError(null)

    try {
      await registerUser({
        username: values.username,
        email: values.email,
        password: values.password,
      })

      showSuccess('Registration successful. OTP sent to your email.')
      navigate('/verify-otp', {
        replace: true,
        state: {
          flow: 'register',
          email: values.email,
          expiresInSeconds: 300,
        },
      })
    } catch (error) {
      const message = getApiErrorMessage(error, 'Unable to register')
      setSubmitError(message)
      showError(message)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Create your account</h2>
        <p className="text-sm text-muted-foreground">Set up your secure wallet in under a minute.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label className="text-sm font-medium">Username</label>
          <Input {...register('username')} placeholder="atul_wallet" />
          {errors.username ? <p className="text-xs text-destructive">{errors.username.message}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" {...register('email')} placeholder="you@example.com" />
          {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Password</label>
          <Input type="password" {...register('password')} placeholder="••••••••" />
          {errors.password ? <p className="text-xs text-destructive">{errors.password.message}</p> : null}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Confirm Password</label>
          <Input type="password" {...register('confirmPassword')} placeholder="••••••••" />
          {errors.confirmPassword ? <p className="text-xs text-destructive">{errors.confirmPassword.message}</p> : null}
        </div>

        {submitError ? <Alert>{submitError}</Alert> : null}

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link className="font-medium text-primary hover:underline" to="/login">
          Sign in
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
