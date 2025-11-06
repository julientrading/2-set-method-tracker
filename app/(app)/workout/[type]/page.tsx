'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Workout configurations
const WORKOUTS = {
  pull: {
    name: 'PULL DAY',
    emoji: '💪',
    exercises: [
      { id: 1, name: 'Ring Pull-ups', unit: 'reps' },
      { id: 2, name: 'Ring Rows', unit: 'reps' },
    ],
  },
  push: {
    name: 'PUSH DAY',
    emoji: '🔥',
    exercises: [
      { id: 3, name: 'Ring Dips', unit: 'reps' },
      { id: 4, name: 'Ring Pseudo Planche Push-ups', unit: 'reps' },
    ],
  },
  legs: {
    name: 'LEGS DAY',
    emoji: '🦵',
    exercises: [
      { id: 5, name: 'Pistol Squats', unit: 'reps' },
      { id: 6, name: 'Nordic Curls', unit: 'reps' },
    ],
  },
}

type SetData = {
  reps: number | null
  weight: number | null
  completed: boolean
}

export default function ActiveWorkoutPage() {
  const router = useRouter()
  const params = useParams()
  const workoutType = params.type as string

  // State for tracking sets
  const [sets, setSets] = useState<{ [key: string]: SetData }>({
    'ex1-set1': { reps: null, weight: null, completed: false },
    'ex1-set2': { reps: null, weight: null, completed: false },
    'ex2-set1': { reps: null, weight: null, completed: false },
    'ex2-set2': { reps: null, weight: null, completed: false },
  })

  const [currentExercise, setCurrentExercise] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [showRestTimer, setShowRestTimer] = useState(false)
  const [restTimeLeft, setRestTimeLeft] = useState(120) // 2 minutes default
  const [xpEarned, setXpEarned] = useState(0)

  const workout = WORKOUTS[workoutType as keyof typeof WORKOUTS]

  // Redirect if invalid workout type
  useEffect(() => {
    if (!workout) {
      router.push('/workout/start')
    }
  }, [workout, router])

  // Rest timer logic
  useEffect(() => {
    if (showRestTimer && restTimeLeft > 0) {
      const timer = setTimeout(() => setRestTimeLeft(restTimeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (restTimeLeft === 0) {
      setShowRestTimer(false)
    }
  }, [showRestTimer, restTimeLeft])

  // Return early if no valid workout (after hooks are called)
  if (!workout) {
    return null
  }

  const currentExerciseData = workout.exercises[currentExercise]
  const setKey = `ex${currentExercise + 1}-set${currentSet}`
  const currentSetData = sets[setKey]

  const handleSetComplete = () => {
    if (!currentSetData.reps || currentSetData.reps <= 0) {
      alert('Please enter valid reps')
      return
    }

    // Mark set as completed
    setSets({
      ...sets,
      [setKey]: { ...currentSetData, completed: true },
    })

    // Add XP for completing a set
    setXpEarned(xpEarned + 25)

    // Determine next step
    if (currentSet === 1) {
      // First set done, start rest timer for second set
      setShowRestTimer(true)
      setRestTimeLeft(120)
      setCurrentSet(2)
    } else if (currentSet === 2 && currentExercise === 0) {
      // Second set of first exercise done, move to second exercise
      setCurrentExercise(1)
      setCurrentSet(1)
    } else {
      // All sets done, go to completion
      completeWorkout()
    }
  }

  const completeWorkout = async () => {
    // Prepare workout data
    const setsData = [
      {
        exercise_id: workout.exercises[0].id,
        set_number: 1,
        reps: sets['ex1-set1'].reps || 0,
        weight: sets['ex1-set1'].weight,
      },
      {
        exercise_id: workout.exercises[0].id,
        set_number: 2,
        reps: sets['ex1-set2'].reps || 0,
        weight: sets['ex1-set2'].weight,
      },
      {
        exercise_id: workout.exercises[1].id,
        set_number: 1,
        reps: sets['ex2-set1'].reps || 0,
        weight: sets['ex2-set1'].weight,
      },
      {
        exercise_id: workout.exercises[1].id,
        set_number: 2,
        reps: sets['ex2-set2'].reps || 0,
        weight: sets['ex2-set2'].weight,
      },
    ]

    // Import and call save action
    const { saveWorkout } = await import('../actions')
    const result = await saveWorkout({
      workout_type: workoutType as 'push' | 'pull' | 'legs',
      sets: setsData,
    })

    if (result.error) {
      alert('Failed to save workout: ' + result.error)
      return
    }

    // Navigate to completion screen with XP data
    router.push(`/workout/complete?type=${workoutType}&xp=${result.xpEarned || 100}`)
  }

  const updateSetData = (field: 'reps' | 'weight', value: string) => {
    setSets({
      ...sets,
      [setKey]: {
        ...currentSetData,
        [field]: value === '' ? null : parseInt(value),
      },
    })
  }

  // Skip rest timer
  const skipRest = () => {
    setShowRestTimer(false)
    setRestTimeLeft(120)
  }

  // Calculate total progress
  const totalSets = 4
  const completedSets = Object.values(sets).filter((s) => s.completed).length
  const progressPercentage = (completedSets / totalSets) * 100

  if (showRestTimer) {
    const minutes = Math.floor(restTimeLeft / 60)
    const seconds = restTimeLeft % 60

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        <Card className="w-full max-w-md border-orange-400/30 bg-gradient-to-br from-orange-900/20 to-slate-900">
          <CardHeader className="text-center">
            <div className="mb-4 text-6xl">⏱️</div>
            <CardTitle className="text-3xl text-white">Rest Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="text-7xl font-bold text-orange-400">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
            <p className="text-gray-300">
              Get ready for set {currentSet} of {currentExerciseData.name}
            </p>

            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={skipRest}
              >
                Skip Rest - I&apos;m Ready! 💪
              </Button>
              <p className="text-xs text-gray-500">
                Rest helps maximize your next set performance
              </p>
            </div>

            {/* XP Preview */}
            <div className="rounded-lg bg-yellow-500/10 p-3">
              <p className="text-sm text-yellow-400">
                ⚡ {xpEarned} XP earned so far
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="container mx-auto max-w-2xl space-y-6 py-8">
        {/* Header */}
        <div className="text-center">
          <div className="mb-2 text-5xl">{workout.emoji}</div>
          <h1 className="mb-1 text-3xl font-bold text-white">{workout.name}</h1>
          <p className="text-gray-400">Give it everything you&apos;ve got!</p>
        </div>

        {/* Progress Bar */}
        <Card className="bg-white/5 backdrop-blur">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="font-bold text-white">
                {completedSets} / {totalSets} sets
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gray-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="mt-2 text-center text-xs text-yellow-400">
              ⚡ {xpEarned} / 100 XP earned
            </p>
          </CardContent>
        </Card>

        {/* Current Exercise Card */}
        <Card className="border-blue-400/30 bg-gradient-to-br from-blue-900/30 to-slate-900">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-white">
              {currentExerciseData.name}
            </CardTitle>
            <p className="text-center text-lg font-semibold text-blue-400">
              Set {currentSet} of 2
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Reps Input */}
            <div className="space-y-2">
              <Label htmlFor="reps" className="text-lg text-white">
                Reps
              </Label>
              <Input
                id="reps"
                type="number"
                placeholder="How many reps?"
                value={currentSetData.reps || ''}
                onChange={(e) => updateSetData('reps', e.target.value)}
                className="h-16 text-center text-2xl font-bold"
                autoFocus
              />
            </div>

            {/* Weight Input (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-lg text-white">
                Additional Weight (Optional)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="weight"
                  type="number"
                  placeholder="0"
                  value={currentSetData.weight || ''}
                  onChange={(e) => updateSetData('weight', e.target.value)}
                  className="h-16 text-center text-2xl font-bold"
                />
                <span className="text-xl text-gray-400">kg</span>
              </div>
            </div>

            {/* Complete Set Button */}
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-xl font-bold hover:from-blue-700 hover:to-purple-700"
              onClick={handleSetComplete}
              disabled={!currentSetData.reps}
            >
              Complete Set {currentSet} ✓
            </Button>

            {/* Tips */}
            <div className="rounded-lg bg-blue-500/10 p-4 text-sm text-blue-300">
              <p className="font-semibold mb-1">💡 Form Tip:</p>
              <p>Focus on controlled movements. Quality over quantity!</p>
            </div>
          </CardContent>
        </Card>

        {/* Completed Sets Summary */}
        {completedSets > 0 && (
          <Card className="bg-green-900/20 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg text-green-400">
                ✓ Completed Sets ({completedSets})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {Object.entries(sets)
                  .filter(([_, set]) => set.completed)
                  .map(([key, set]) => {
                    const [exNum, setNum] = key.split('-')
                    const exIndex = parseInt(exNum.replace('ex', '')) - 1
                    const setIndex = parseInt(setNum.replace('set', ''))
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between rounded-lg bg-white/5 p-2 text-sm"
                      >
                        <span className="text-gray-300">
                          {workout.exercises[exIndex].name} - Set {setIndex}
                        </span>
                        <span className="font-bold text-white">
                          {set.reps} reps{set.weight ? ` @ ${set.weight}kg` : ''}
                        </span>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
