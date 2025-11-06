'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function WorkoutCompleteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const workoutType = searchParams.get('type') || 'workout'
  const xpEarned = parseInt(searchParams.get('xp') || '100')

  const [showConfetti, setShowConfetti] = useState(true)
  const [displayedXp, setDisplayedXp] = useState(0)

  // Animate XP counter
  useEffect(() => {
    if (displayedXp < xpEarned) {
      const timer = setTimeout(() => {
        setDisplayedXp(Math.min(displayedXp + 5, xpEarned))
      }, 30)
      return () => clearTimeout(timer)
    }
  }, [displayedXp, xpEarned])

  // Hide confetti after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const workoutNames = {
    pull: 'PULL DAY',
    push: 'PUSH DAY',
    legs: 'LEGS DAY',
  }

  const workoutEmojis = {
    pull: '💪',
    push: '🔥',
    legs: '🦵',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="container mx-auto max-w-2xl space-y-6 py-8">
        {/* Celebration Header */}
        <div className="text-center">
          <div className="mb-4">
            {showConfetti && (
              <div className="text-8xl animate-bounce">
                🎉
              </div>
            )}
          </div>
          <h1 className="mb-2 text-5xl font-bold text-white">
            Workout Complete!
          </h1>
          <p className="text-xl text-gray-300">
            You crushed {workoutNames[workoutType as keyof typeof workoutNames] || 'your workout'}! {workoutEmojis[workoutType as keyof typeof workoutEmojis]}
          </p>
        </div>

        {/* XP Earned Card */}
        <Card className="border-yellow-400/30 bg-gradient-to-br from-yellow-900/30 to-slate-900">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">XP Earned</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4 text-8xl font-bold text-yellow-400">
              +{displayedXp}
            </div>
            <p className="text-gray-300">Experience Points</p>

            {/* XP Breakdown */}
            <div className="mt-6 space-y-2 text-left">
              <div className="flex justify-between rounded-lg bg-white/5 p-3">
                <span className="text-gray-400">Workout Completed</span>
                <span className="font-bold text-white">+100 XP</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card className="border-orange-400/30 bg-gradient-to-br from-orange-900/30 to-slate-900">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-white">
              🔥 Streak Updated!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-gray-300">
              Keep training to maintain your streak and earn bonus XP!
            </p>
            <div className="mt-4 rounded-lg bg-orange-500/10 p-3">
              <p className="text-sm text-orange-300">
                💡 Train daily to build your streak multiplier
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <Card className="bg-white/5 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg text-white">Workout Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400">2</div>
                <p className="text-xs text-gray-400">Exercises</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">4</div>
                <p className="text-xs text-gray-400">Sets</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">✓</div>
                <p className="text-xs text-gray-400">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivational Message */}
        <Card className="border-blue-400/20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
          <CardContent className="p-6 text-center">
            <p className="text-lg italic text-gray-300">
              &quot;Strength doesn&apos;t come from what you can do. It comes from overcoming the things you once thought you couldn&apos;t.&quot;
            </p>
            <p className="mt-2 text-sm text-gray-500">- Rikki Rogers</p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-xl font-bold hover:from-blue-700 hover:to-purple-700"
            >
              Return to Dashboard
            </Button>
          </Link>
          <Link href="/workout/start">
            <Button size="lg" variant="outline" className="w-full">
              Start Another Workout
            </Button>
          </Link>
        </div>

        {/* Next Workout Suggestion */}
        <div className="rounded-lg border border-dashed border-white/20 bg-white/5 p-4 text-center">
          <p className="text-sm text-gray-400">
            💪 Next recommended workout: Come back tomorrow for your next session!
          </p>
        </div>
      </div>
    </div>
  )
}

export default function WorkoutCompletePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="mb-4 text-6xl">⏳</div>
          <p className="text-xl text-white">Loading...</p>
        </div>
      </div>
    }>
      <WorkoutCompleteContent />
    </Suspense>
  )
}
