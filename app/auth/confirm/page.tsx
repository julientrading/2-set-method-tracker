'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

function ConfirmEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const confirmEmail = async () => {
      const code = searchParams.get('code')

      if (!code) {
        setStatus('error')
        setMessage('Invalid confirmation link. Please try again.')
        return
      }

      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      try {
        // Exchange the code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) throw error

        if (data.user) {
          // Fetch user profile to get their name
          const { data: profile } = await supabase
            .from('users')
            .select('first_name')
            .eq('user_id', data.user.id)
            .single()

          setUserName(profile?.first_name || null)
          setStatus('success')
          setMessage('Your email has been confirmed successfully!')

          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push('/dashboard')
          }, 3000)
        }
      } catch (error: any) {
        console.error('Confirmation error:', error)
        setStatus('error')
        setMessage(error.message || 'Failed to confirm email. Please try again.')
      }
    }

    confirmEmail()
  }, [searchParams, router])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="w-full max-w-md rounded-lg bg-white/10 p-8 text-center backdrop-blur">
          <div className="mb-4 text-4xl">⏳</div>
          <h1 className="mb-2 text-2xl font-bold text-white">Confirming your email...</h1>
          <p className="text-gray-300">Please wait a moment</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="w-full max-w-md rounded-lg bg-white/10 p-8 text-center backdrop-blur">
          <div className="mb-4 text-6xl">✅</div>
          <h1 className="mb-2 text-3xl font-bold text-green-400">Email Confirmed!</h1>
          {userName && (
            <p className="mb-4 text-xl text-white">Welcome, {userName}! 🎉</p>
          )}
          <p className="mb-6 text-gray-300">{message}</p>
          <p className="mb-6 text-sm text-gray-400">
            Redirecting to your dashboard in 3 seconds...
          </p>
          <Link
            href="/dashboard"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Go to Dashboard Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="w-full max-w-md rounded-lg bg-white/10 p-8 text-center backdrop-blur">
        <div className="mb-4 text-6xl">❌</div>
        <h1 className="mb-2 text-3xl font-bold text-red-400">Confirmation Failed</h1>
        <p className="mb-6 text-gray-300">{message}</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Go to Login
          </Link>
          <Link
            href="/signup"
            className="inline-block rounded-lg border-2 border-blue-400 px-6 py-3 font-semibold text-blue-400 transition hover:bg-blue-400 hover:text-white"
          >
            Sign Up Again
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="w-full max-w-md rounded-lg bg-white/10 p-8 text-center backdrop-blur">
          <div className="mb-4 text-4xl">⏳</div>
          <h1 className="mb-2 text-2xl font-bold text-white">Loading...</h1>
        </div>
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  )
}
