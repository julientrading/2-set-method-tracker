'use server'

import { createRouteClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type WorkoutSetData = {
  exercise_id: number
  set_number: number
  reps: number
  weight?: number | null
}

export async function saveWorkout(formData: {
  workout_type: 'push' | 'pull' | 'legs'
  sets: WorkoutSetData[]
}) {
  const supabase = createRouteClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    // 1. Create workout record
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        user_id: user.id,
        workout_type: formData.workout_type,
        workout_date: new Date().toISOString().split('T')[0],
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (workoutError || !workout) {
      console.error('Workout creation error:', workoutError)
      return { error: 'Failed to create workout' }
    }

    // 2. Save workout sets
    const setsToInsert = formData.sets.map((set) => ({
      workout_id: workout.id,
      exercise_id: set.exercise_id,
      set_number: set.set_number,
      reps_completed: set.reps,
      weight_used: set.weight || null,
      completed: true,
    }))

    const { error: setsError } = await supabase
      .from('workout_sets')
      .insert(setsToInsert)

    if (setsError) {
      console.error('Sets creation error:', setsError)
      return { error: 'Failed to save sets' }
    }

    // 3. Update gamification stats
    const xpEarned = 100 // Base XP for completing workout

    // Fetch current stats
    const { data: currentStats } = await supabase
      .from('user_gamification')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (currentStats) {
      const newTotalXp = (currentStats.total_xp || 0) + xpEarned
      const newLevel = calculateLevelFromXP(newTotalXp)
      const newWorkoutCount = (currentStats.total_workouts_completed || 0) + 1

      // Calculate streak
      const today = new Date().toISOString().split('T')[0]
      const lastWorkoutDate = currentStats.last_workout_date
      const daysSinceLastWorkout = lastWorkoutDate
        ? Math.floor(
            (new Date(today).getTime() - new Date(lastWorkoutDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 999

      let newStreak = currentStats.current_streak || 0
      if (daysSinceLastWorkout === 1) {
        // Consecutive day
        newStreak += 1
      } else if (daysSinceLastWorkout === 0) {
        // Same day, keep streak
        newStreak = currentStats.current_streak
      } else {
        // Streak broken
        newStreak = 1
      }

      const longestStreak = Math.max(currentStats.longest_streak || 0, newStreak)

      // Update gamification stats
      await supabase
        .from('user_gamification')
        .update({
          total_xp: newTotalXp,
          level: newLevel,
          rank_title: getRankTitle(newLevel),
          current_streak: newStreak,
          longest_streak: longestStreak,
          total_workouts_completed: newWorkoutCount,
          last_workout_date: today,
        })
        .eq('user_id', user.id)
    }

    revalidatePath('/dashboard')
    revalidatePath('/workout')

    return {
      success: true,
      xpEarned,
    }
  } catch (error) {
    console.error('Save workout error:', error)
    return { error: 'Failed to save workout' }
  }
}

// Helper function to calculate level from XP
function calculateLevelFromXP(xp: number): number {
  // Progressive leveling: 500, 1000, 2000, 3000, 5000, 10000 XP per level
  const thresholds = [0, 500, 1500, 3500, 6500, 11500, 21500]
  let level = 1

  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) {
      level = i + 1
    } else {
      break
    }
  }

  return level
}

// Helper function to get rank title
function getRankTitle(level: number): string {
  if (level >= 6) return 'Soviet Legend'
  if (level >= 5) return 'Master'
  if (level >= 4) return 'Elite'
  if (level >= 3) return 'Advanced'
  if (level >= 2) return 'Intermediate'
  return 'Novice'
}
