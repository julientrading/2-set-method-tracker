/**
 * Level Calculation and Progression System
 * Re-exports from xp-calculator and adds UI helpers
 */

import {
  calculateLevelFromXP,
  getLevelProgress,
} from './xp-calculator'

export {
  calculateLevelFromXP,
  getXPForNextLevel,
  getTotalXPForLevel,
  getRankTitle,
  getLevelProgress,
  awardXP,
  XP_REWARDS,
  LEVEL_THRESHOLDS,
  XP_PER_LEVEL,
} from './xp-calculator'

/**
 * Get level badge color based on rank
 */
export function getLevelBadgeColor(level: number): string {
  if (level >= 100) return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' // Soviet Legend
  if (level >= 76) return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' // Master
  if (level >= 51) return 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white' // Elite
  if (level >= 26) return 'bg-gradient-to-r from-green-600 to-emerald-500 text-white' // Advanced
  if (level >= 11) return 'bg-gradient-to-r from-gray-600 to-gray-500 text-white' // Intermediate
  return 'bg-gradient-to-r from-gray-400 to-gray-300 text-gray-900' // Novice
}

/**
 * Get rank badge icon/emoji
 */
export function getRankIcon(level: number): string {
  if (level >= 100) return '⭐' // Soviet Legend
  if (level >= 76) return '👑' // Master
  if (level >= 51) return '💎' // Elite
  if (level >= 26) return '🔥' // Advanced
  if (level >= 11) return '⚡' // Intermediate
  return '🎯' // Novice
}

/**
 * Get motivational message for level up
 */
export function getLevelUpMessage(newLevel: number): string {
  const messages = [
    `Level ${newLevel}! You're getting stronger!`,
    `Level ${newLevel} achieved! Keep pushing!`,
    `Welcome to Level ${newLevel}!`,
    `Level ${newLevel}! Your dedication is paying off!`,
    `You've reached Level ${newLevel}!`,
  ]

  // Special messages for milestone levels
  if (newLevel === 10) return 'Level 10! You\'re no longer a Novice!'
  if (newLevel === 25) return 'Level 25! Intermediate level complete!'
  if (newLevel === 50) return 'Level 50! You\'ve reached Advanced status!'
  if (newLevel === 75) return 'Level 75! Elite tier unlocked!'
  if (newLevel === 100) return 'Level 100! You are a Soviet Legend!'

  return messages[Math.floor(Math.random() * messages.length)]
}

/**
 * Check if level up occurred
 */
export function didLevelUp(oldXP: number, newXP: number): {
  leveledUp: boolean
  oldLevel: number
  newLevel: number
  levelsGained: number
} {
  const oldLevel = calculateLevelFromXP(oldXP)
  const newLevel = calculateLevelFromXP(newXP)
  const leveledUp = newLevel > oldLevel
  const levelsGained = newLevel - oldLevel

  return {
    leveledUp,
    oldLevel,
    newLevel,
    levelsGained,
  }
}

/**
 * Get XP bar color based on progress
 */
export function getXPBarColor(progressPercentage: number): string {
  if (progressPercentage >= 90) return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
  if (progressPercentage >= 70) return 'bg-gradient-to-r from-green-400 to-green-500'
  if (progressPercentage >= 40) return 'bg-gradient-to-r from-blue-400 to-blue-500'
  return 'bg-gradient-to-r from-gray-400 to-gray-500'
}

/**
 * Format XP number for display
 */
export function formatXP(xp: number): string {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`
  }
  return xp.toString()
}

/**
 * Get estimated time to next level (based on average XP per day)
 */
export function getEstimatedTimeToNextLevel(
  currentXP: number,
  averageXPPerDay: number
): {
  days: number
  message: string
} {
  const { xpInCurrentLevel, xpNeededForNextLevel } = getLevelProgress(currentXP)
  const xpRemaining = xpNeededForNextLevel - xpInCurrentLevel

  if (averageXPPerDay <= 0) {
    return {
      days: Infinity,
      message: 'Complete workouts to estimate',
    }
  }

  const days = Math.ceil(xpRemaining / averageXPPerDay)

  if (days === 1) {
    return { days, message: 'Tomorrow if you keep it up!' }
  }

  if (days <= 7) {
    return { days, message: `About ${days} days away` }
  }

  if (days <= 30) {
    const weeks = Math.ceil(days / 7)
    return { days, message: `About ${weeks} ${weeks === 1 ? 'week' : 'weeks'} away` }
  }

  const months = Math.ceil(days / 30)
  return { days, message: `About ${months} ${months === 1 ? 'month' : 'months'} away` }
}
