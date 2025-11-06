'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { login, resendConfirmationEmail } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [resendSuccess, setResendSuccess] = useState(false)
  const [emailConfirmed, setEmailConfirmed] = useState(false)
  const [confirmingEmail, setConfirmingEmail] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const code = searchParams.get('code')

    if (code) {
      setConfirmingEmail(true)
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      supabase.auth.exchangeCodeForSession(code)
        .then(({ data, error }) => {
          if (error) {
            setError('Failed to confirm email. Please try again.')
            setConfirmingEmail(false)
          } else if (data.user) {
            setEmailConfirmed(true)
            setConfirmingEmail(false)
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
          }
        })
        .catch(() => {
          setError('Failed to confirm email. Please try again.')
          setConfirmingEmail(false)
        })
    }
  }, [searchParams, router])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setEmail(formData.get('email') as string)

    const result = await login(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  async function handleResendConfirmation() {
    if (!email) return

    setLoading(true)
    const formData = new FormData()
    formData.append('email', email)

    const result = await resendConfirmationEmail(formData)

    if (result?.error) {
      setError(result.error)
    } else {
      setResendSuccess(true)
      setError(null)
    }

    setLoading(false)
  }

  const isEmailNotConfirmed = error?.toLowerCase().includes('email not confirmed') ||
    error?.toLowerCase().includes('confirm your email')

  if (confirmingEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="mb-4 text-4xl">⏳</div>
            <h2 className="text-xl font-semibold">Confirming your email...</h2>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (emailConfirmed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mb-4 text-6xl">✅</div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Email Confirmed!
            </CardTitle>
            <CardDescription>
              Your email has been successfully verified.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Redirecting to your dashboard...
            </p>
            <Link href="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your 2 Set Method account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/reset-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <p>{error}</p>
                {isEmailNotConfirmed && (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    className="mt-2 text-sm text-primary hover:underline"
                    disabled={loading}
                  >
                    Resend confirmation email
                  </button>
                )}
              </div>
            )}

            {resendSuccess && (
              <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">
                Confirmation email sent! Check your inbox.
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <div className="text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:underline">
              ← Back to home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
