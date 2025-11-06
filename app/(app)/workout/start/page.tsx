import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function WorkoutStartPage() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Define workouts based on the spec
  const workouts = {
    pull: {
      name: 'PULL DAY',
      emoji: '💪',
      color: 'blue',
      exercises: ['Ring Pull-ups', 'Ring Rows'],
      description: 'Build a powerful back and biceps',
    },
    push: {
      name: 'PUSH DAY',
      emoji: '🔥',
      color: 'red',
      exercises: ['Ring Dips', 'Ring Pseudo Planche Push-ups'],
      description: 'Develop strong chest, shoulders, and triceps',
    },
    legs: {
      name: 'LEGS DAY',
      emoji: '🦵',
      color: 'purple',
      exercises: ['Pistol Squats', 'Nordic Curls'],
      description: 'Forge powerful legs and glutes',
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="container mx-auto max-w-4xl space-y-8 py-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">Choose Your Workout</h1>
          <p className="text-lg text-gray-400">
            2 exercises. 2 sets each. Maximum intensity.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-4 py-2 text-sm text-yellow-400">
            <span className="text-lg">⚡</span>
            <span>Earn 100 XP for completing your workout</span>
          </div>
        </div>

        {/* Workout Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {Object.entries(workouts).map(([type, workout]) => (
            <Card
              key={type}
              className={`relative overflow-hidden border-2 transition-all hover:scale-105 hover:border-${workout.color}-400 bg-gradient-to-br from-slate-800 to-slate-900`}
            >
              <CardHeader className="text-center">
                <div className="mb-2 text-6xl">{workout.emoji}</div>
                <CardTitle className="text-2xl text-white">{workout.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  {workout.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Exercise List */}
                <div className="space-y-2">
                  {workout.exercises.map((exercise, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-lg bg-white/5 p-2 text-sm text-gray-300"
                    >
                      <span className="font-semibold text-white">{idx + 1}.</span>
                      <span>{exercise}</span>
                    </div>
                  ))}
                </div>

                {/* Sets Info */}
                <div className="rounded-lg bg-blue-500/10 p-2 text-center text-xs text-blue-300">
                  2 sets per exercise • Rest as needed
                </div>

                {/* Start Button */}
                <Link href={`/workout/${type}`} className="block">
                  <Button
                    size="lg"
                    className={`w-full bg-${workout.color}-600 hover:bg-${workout.color}-700 text-lg font-bold`}
                  >
                    Start {workout.name}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
