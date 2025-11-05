/**
 * Streak Calculation System
 * Handles workout streak tracking and mulligan (streak freeze) feature
 */

import { differenceInDays, isToday, isYesterday, startOfDay, parseISO } from 'date-fns'

export interface StreakCalculationResult {
  currentStreak: number
  streakStatus: 'active' | 'at_risk' | 'broken'
  canUseMulligan: boolean
  lastWorkoutDate: Date | null
  nextWorkoutDate: Date | null
}

/**
 * Calculate current streak based on workout dates
 * Streak rules:
 * - Streak increases by 1 when a scheduled workout is completed
 * - Rest days do NOT break the streak
 * - Missing a scheduled workout breaks the streak
 * - User gets 1 "mulligan" (streak freeze) per month
 */
export function calculateStreak(
  lastWorkoutDate: Date | string | null,
  workoutHistory: Array<{ date: Date | string; workout_type: string }>
): StreakCalculationResult {
  if (!lastWorkoutDate) {
    return {
      currentStreak: 0,
      streakStatus: 'broken',
      canUseMulligan: false,
      lastWorkoutDate: null,
      nextWorkoutDate: null,
    }
  }

  const lastWorkout =
    typeof lastWorkoutDate === 'string' ? parseISO(lastWorkoutDate) : lastWorkoutDate
  const today = startOfDay(new Date())
  const lastWorkoutDay = startOfDay(lastWorkout)

  // Check if last workout was today
  if (isToday(lastWorkout)) {
    return {
      currentStreak: calculateStreakDays(workoutHistory),
      streakStatus: 'active',
      canUseMulligan: false,
      lastWorkoutDate: lastWorkout,
      nextWorkoutDate: null,
    }
  }

  // Check if last workout was yesterday
  if (isYesterday(lastWorkout)) {
    return {
      currentStreak: calculateStreakDays(workoutHistory),
      streakStatus: 'at_risk',
      canUseMulligan: true,
      lastWorkoutDate: lastWorkout,
      nextWorkoutDate: today,
    }
  }

  // If last workout was more than 1 day ago, streak is broken
  const daysSinceLastWorkout = differenceInDays(today, lastWorkoutDay)

  if (daysSinceLastWorkout > 1) {
    return {
      currentStreak: 0,
      streakStatus: 'broken',
      canUseMulligan: daysSinceLastWorkout === 2, // Can use mulligan if only 2 days ago
      lastWorkoutDate: lastWorkout,
      nextWorkoutDate: today,
    }
  }

  return {
    currentStreak: calculateStreakDays(workoutHistory),
    streakStatus: 'active',
    canUseMulligan: false,
    lastWorkoutDate: lastWorkout,
    nextWorkoutDate: null,
  }
}

/**
 * Calculate the number of consecutive workout days
 */
function calculateStreakDays(
  workoutHistory: Array<{ date: Date | string; workout_type: string }>
): number {
  if (workoutHistory.length === 0) return 0

  // Sort workouts by date (most recent first)
  const sortedWorkouts = [...workoutHistory].sort((a, b) => {
    const dateA = typeof a.date === 'string' ? parseISO(a.date) : a.date
    const dateB = typeof b.date === 'string' ? parseISO(b.date) : b.date
    return dateB.getTime() - dateA.getTime()
  })

  let streak = 0
  let currentDate = startOfDay(new Date())

  for (const workout of sortedWorkouts) {
    const workoutDate = startOfDay(
      typeof workout.date === 'string' ? parseISO(workout.date) : workout.date
    )

    const daysDiff = differenceInDays(currentDate, workoutDate)

    // If workout is today or yesterday, continue streak
    if (daysDiff === 0 || daysDiff === 1) {
      streak++
      currentDate = workoutDate
    } else {
      // Gap in workouts, streak is broken
      break
    }
  }

  return streak
}

/**
 * Update streak after workout completion
 */
export function updateStreakAfterWorkout(
  currentStreak: number,
  lastWorkoutDate: Date | string | null,
  newWorkoutDate: Date = new Date()
): {
  newStreak: number
  streakIncreased: boolean
  streakMaintained: boolean
} {
  if (!lastWorkoutDate) {
    return {
      newStreak: 1,
      streakIncreased: true,
      streakMaintained: false,
    }
  }

  const lastWorkout =
    typeof lastWorkoutDate === 'string' ? parseISO(lastWorkoutDate) : lastWorkoutDate
  const newWorkout = startOfDay(newWorkoutDate)
  const lastWorkoutDay = startOfDay(lastWorkout)

  // If workout is on the same day, don't increase streak
  if (differenceInDays(newWorkout, lastWorkoutDay) === 0) {
    return {
      newStreak: currentStreak,
      streakIncreased: false,
      streakMaintained: true,
    }
  }

  // If workout is the next day, increase streak
  if (differenceInDays(newWorkout, lastWorkoutDay) === 1) {
    return {
      newStreak: currentStreak + 1,
      streakIncreased: true,
      streakMaintained: true,
    }
  }

  // If there's a gap, reset streak
  return {
    newStreak: 1,
    streakIncreased: false,
    streakMaintained: false,
  }
}

/**
 * Check if user can use streak freeze (mulligan)
 * Rules:
 * - 1 mulligan per month
 * - Can only be used within 24 hours of missed workout
 * - Prevents streak from breaking
 */
export function canUseStreakFreeze(
  lastStreakFreezeDate: Date | string | null,
  lastWorkoutDate: Date | string | null
): {
  canUse: boolean
  reason?: string
} {
  const today = new Date()

  // Check if already used this month
  if (lastStreakFreezeDate) {
    const freezeDate =
      typeof lastStreakFreezeDate === 'string' ? parseISO(lastStreakFreezeDate) : lastStreakFreezeDate
    const sameMonth =
      freezeDate.getMonth() === today.getMonth() &&
      freezeDate.getFullYear() === today.getFullYear()

    if (sameMonth) {
      return {
        canUse: false,
        reason: 'Already used streak freeze this month',
      }
    }
  }

  // Check if within 24 hours of missed workout
  if (lastWorkoutDate) {
    const lastWorkout =
      typeof lastWorkoutDate === 'string' ? parseISO(lastWorkoutDate) : lastWorkoutDate
    const daysSince = differenceInDays(today, lastWorkout)

    if (daysSince > 2) {
      return {
        canUse: false,
        reason: 'Too late to use streak freeze (must be used within 24 hours)',
      }
    }
  }

  return {
    canUse: true,
  }
}

/**
 * Get streak milestone (for achievement unlocking)
 */
export function getStreakMilestone(streak: number): number | null {
  const milestones = [7, 14, 30, 60, 90, 180, 365]
  return milestones.find((m) => streak === m) || null
}

/**
 * Get streak flame color based on length
 */
export function getStreakColor(streak: number): string {
  if (streak >= 100) return 'text-yellow-400' // Gold
  if (streak >= 30) return 'text-blue-400' // Blue
  if (streak >= 7) return 'text-orange-400' // Orange
  return 'text-gray-400' // Gray
}

/**
 * Get streak status message
 */
export function getStreakMessage(streakStatus: 'active' | 'at_risk' | 'broken', streak: number): string {
  if (streakStatus === 'broken') {
    return 'Start a new streak today!'
  }
  if (streakStatus === 'at_risk') {
    return `Don't break your ${streak}-day streak! Workout today.`
  }
  return `${streak} day streak! Keep it going!`
}
