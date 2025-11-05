/**
 * Achievement Checking System
 * Evaluates and unlocks achievements based on user actions and stats
 */

import type { Database } from '@/types/database.types'

type Achievement = Database['public']['Tables']['achievements']['Row']
type UserGamification = Database['public']['Tables']['user_gamification']['Row']
type UserAchievement = Database['public']['Tables']['user_achievements']['Row']

export interface AchievementCheckResult {
  achievementId: string
  unlocked: boolean
  progress: number
  progressPercentage: number
}

export interface UnlockedAchievement {
  achievement: Achievement
  xpAwarded: number
}

/**
 * Check all achievements for a user after an action
 */
export async function checkAchievements(
  userId: string,
  userStats: UserGamification,
  allAchievements: Achievement[],
  unlockedAchievements: UserAchievement[],
  context: AchievementContext
): Promise<UnlockedAchievement[]> {
  const unlockedIds = new Set(unlockedAchievements.map((ua) => ua.achievement_id))
  const newlyUnlocked: UnlockedAchievement[] = []

  for (const achievement of allAchievements) {
    // Skip already unlocked achievements
    if (unlockedIds.has(achievement.id)) continue

    // Check if achievement is unlocked
    const result = checkSingleAchievement(achievement, userStats, context)

    if (result.unlocked) {
      newlyUnlocked.push({
        achievement,
        xpAwarded: achievement.xp_reward,
      })
    }
  }

  return newlyUnlocked
}

export interface AchievementContext {
  // Workout context
  workoutJustCompleted?: boolean
  workoutType?: 'push' | 'pull' | 'legs'
  workoutTime?: Date

  // PR context
  prJustAchieved?: boolean
  prExercise?: string
  prWeight?: number
  prReps?: number

  // Exercise-specific context
  exercisePerformance?: {
    exerciseName: string
    weight: number
    reps: number
  }

  // Special contexts
  isBirthday?: boolean
  isEarlyMorning?: boolean // Before 6 AM
  isLateNight?: boolean // After 10 PM
  daysSinceLastWorkout?: number
}

/**
 * Check if a single achievement is unlocked
 */
function checkSingleAchievement(
  achievement: Achievement,
  userStats: UserGamification,
  context: AchievementContext
): AchievementCheckResult {
  const { requirement_type, requirement_value, exercise_specific } = achievement

  let progress = 0
  let unlocked = false

  switch (requirement_type) {
    case 'workouts':
      progress = userStats.total_workouts_completed
      unlocked = progress >= (requirement_value || 0)
      break

    case 'prs':
      progress = userStats.total_prs
      unlocked = progress >= (requirement_value || 0)
      break

    case 'streak':
      progress = userStats.current_streak
      unlocked = progress >= (requirement_value || 0)
      break

    case 'weight_threshold':
      // Check if any PR meets the weight threshold
      if (context.prJustAchieved && context.prWeight) {
        progress = context.prWeight
        unlocked = progress >= (requirement_value || 0)
      }
      break

    case 'reps_threshold':
      // Check if reps meet threshold for specific exercise
      if (context.exercisePerformance) {
        const { exerciseName, reps } = context.exercisePerformance

        // If achievement is exercise-specific, check exercise name matches
        if (exercise_specific && exerciseName !== exercise_specific) {
          unlocked = false
        } else {
          progress = reps
          unlocked = reps >= (requirement_value || 0)
        }
      }
      break

    case 'special':
      // Handle special achievement types
      unlocked = checkSpecialAchievement(achievement, userStats, context)
      progress = unlocked ? (requirement_value || 100) : 0
      break

    default:
      unlocked = false
  }

  const progressPercentage =
    requirement_value && requirement_value > 0 ? Math.min(100, (progress / requirement_value) * 100) : 0

  return {
    achievementId: achievement.id,
    unlocked,
    progress,
    progressPercentage,
  }
}

/**
 * Check special achievement conditions
 */
function checkSpecialAchievement(
  achievement: Achievement,
  userStats: UserGamification,
  context: AchievementContext
): boolean {
  const name = achievement.name

  // Early Bird - workout before 6 AM
  if (name === 'Early Bird') {
    return context.isEarlyMorning || false
  }

  // Night Owl - workout after 10 PM
  if (name === 'Night Owl') {
    return context.isLateNight || false
  }

  // Birthday PR - PR on birthday
  if (name === 'Birthday PR') {
    return (context.isBirthday && context.prJustAchieved) || false
  }

  // Comeback King - workout after 30+ day break
  if (name === 'Comeback King') {
    return (context.daysSinceLastWorkout && context.daysSinceLastWorkout >= 30) || false
  }

  // Soviet Comrade - reach level 50
  if (name === 'Soviet Comrade') {
    return userStats.level >= 50
  }

  // The Unbreakable - 200-day streak (checked via streak requirement)
  if (name === 'The Unbreakable') {
    return userStats.current_streak >= 200
  }

  // Perfect Week - PR in every workout this week
  if (name === 'Perfect Week') {
    // This would need to check last 7 days of workouts
    // Implementation would query workout history
    return false // Placeholder
  }

  // Ring Master - 100 total ring exercises
  if (name === 'Ring Master') {
    // This would need to count total ring exercises from workout history
    // Implementation would query workout sets
    return false // Placeholder
  }

  // Balanced Warrior - equal push/pull/leg workouts (50 each)
  if (name === 'Balanced Warrior') {
    // This would need to count workouts by type
    // Implementation would query workout history
    return false // Placeholder
  }

  // Double Bodyweight achievement
  if (name === 'Double Bodyweight') {
    // This would need user's bodyweight and check if any lift is 2x that
    // Implementation would require body metrics data
    return false // Placeholder
  }

  return false
}

/**
 * Get achievement progress for display
 */
export function getAchievementProgress(
  achievement: Achievement,
  userStats: UserGamification,
  currentProgress: number
): {
  current: number
  required: number
  percentage: number
  message: string
} {
  const required = achievement.requirement_value || 0
  const current = currentProgress
  const percentage = required > 0 ? Math.min(100, (current / required) * 100) : 0

  let message = ''

  if (percentage >= 100) {
    message = 'Unlocked!'
  } else {
    const remaining = required - current
    message = `${remaining} more to unlock`
  }

  return {
    current,
    required,
    percentage,
    message,
  }
}

/**
 * Get achievements close to unlocking (for "almost there" notifications)
 */
export function getAlmostUnlockedAchievements(
  achievements: Achievement[],
  userStats: UserGamification,
  unlockedAchievements: UserAchievement[],
  threshold: number = 0.8 // 80% progress
): Achievement[] {
  const unlockedIds = new Set(unlockedAchievements.map((ua) => ua.achievement_id))

  return achievements.filter((achievement) => {
    if (unlockedIds.has(achievement.id)) return false

    const result = checkSingleAchievement(achievement, userStats, {})
    return result.progressPercentage >= threshold * 100 && !result.unlocked
  })
}

/**
 * Determine if achievement should trigger notification
 */
export function shouldNotifyAchievement(achievement: Achievement): boolean {
  // Always notify for rare and above
  if (achievement.rarity === 'rare' || achievement.rarity === 'epic' || achievement.rarity === 'legendary') {
    return true
  }

  // Notify for secret achievements
  if (achievement.is_secret) {
    return true
  }

  // Notify for first few common achievements
  if (achievement.category === 'milestone' && achievement.requirement_value! <= 5) {
    return true
  }

  return false
}

/**
 * Get achievement rarity color
 */
export function getAchievementRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common':
      return 'text-gray-400 border-gray-400'
    case 'rare':
      return 'text-blue-400 border-blue-400'
    case 'epic':
      return 'text-purple-500 border-purple-500'
    case 'legendary':
      return 'text-yellow-400 border-yellow-400'
    default:
      return 'text-gray-400 border-gray-400'
  }
}

/**
 * Get achievement rarity glow effect
 */
export function getAchievementGlow(rarity: string): string {
  switch (rarity) {
    case 'rare':
      return 'shadow-blue-400/50'
    case 'epic':
      return 'shadow-purple-500/50'
    case 'legendary':
      return 'shadow-yellow-400/50 animate-pulse'
    default:
      return ''
  }
}
