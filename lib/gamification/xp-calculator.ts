/**
 * XP Calculation System
 * Handles all XP awards and level progression
 */

export const XP_REWARDS = {
  WORKOUT_COMPLETED: 100,
  PR_ACHIEVED: 200,
  STREAK_7_DAYS: 50,
  STREAK_30_DAYS: 200,
  WEEKLY_CHALLENGE: 500,
  MONTHLY_CHALLENGE: 1000,
  LEGENDARY_ACHIEVEMENT: 500,
} as const

/**
 * Level thresholds and XP requirements
 * Based on specification:
 * - Levels 1-10: 500 XP per level
 * - Levels 11-25: 1000 XP per level
 * - Levels 26-50: 2000 XP per level
 * - Levels 51-75: 3000 XP per level
 * - Levels 76-100: 5000 XP per level
 * - Levels 100+: 10000 XP per level
 */
export const LEVEL_THRESHOLDS = {
  NOVICE_END: 10, // Level 1-10
  INTERMEDIATE_END: 25, // Level 11-25
  ADVANCED_END: 50, // Level 26-50
  ELITE_END: 75, // Level 51-75
  MASTER_END: 100, // Level 76-100
} as const

export const XP_PER_LEVEL = {
  NOVICE: 500, // Levels 1-10
  INTERMEDIATE: 1000, // Levels 11-25
  ADVANCED: 2000, // Levels 26-50
  ELITE: 3000, // Levels 51-75
  MASTER: 5000, // Levels 76-100
  LEGEND: 10000, // Levels 100+
} as const

/**
 * Calculate level from total XP
 */
export function calculateLevelFromXP(xp: number): number {
  if (xp < 0) return 1

  let level = 1
  let xpNeeded = 0

  // Levels 1-10: 500 XP per level (0 to 5,000 XP)
  if (xp < 5000) {
    return Math.min(10, Math.floor(xp / XP_PER_LEVEL.NOVICE) + 1)
  }

  xpNeeded = 5000
  level = 10

  // Levels 11-25: 1000 XP per level (5,000 to 20,000 XP)
  if (xp < 20000) {
    return level + Math.min(15, Math.floor((xp - xpNeeded) / XP_PER_LEVEL.INTERMEDIATE) + 1)
  }

  xpNeeded = 20000
  level = 25

  // Levels 26-50: 2000 XP per level (20,000 to 70,000 XP)
  if (xp < 70000) {
    return level + Math.min(25, Math.floor((xp - xpNeeded) / XP_PER_LEVEL.ADVANCED) + 1)
  }

  xpNeeded = 70000
  level = 50

  // Levels 51-75: 3000 XP per level (70,000 to 145,000 XP)
  if (xp < 145000) {
    return level + Math.min(25, Math.floor((xp - xpNeeded) / XP_PER_LEVEL.ELITE) + 1)
  }

  xpNeeded = 145000
  level = 75

  // Levels 76-100: 5000 XP per level (145,000 to 270,000 XP)
  if (xp < 270000) {
    return level + Math.min(25, Math.floor((xp - xpNeeded) / XP_PER_LEVEL.MASTER) + 1)
  }

  xpNeeded = 270000
  level = 100

  // Levels 100+: 10000 XP per level
  return level + Math.floor((xp - xpNeeded) / XP_PER_LEVEL.LEGEND)
}

/**
 * Calculate XP needed for next level
 */
export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel < LEVEL_THRESHOLDS.NOVICE_END) {
    return XP_PER_LEVEL.NOVICE
  } else if (currentLevel < LEVEL_THRESHOLDS.INTERMEDIATE_END) {
    return XP_PER_LEVEL.INTERMEDIATE
  } else if (currentLevel < LEVEL_THRESHOLDS.ADVANCED_END) {
    return XP_PER_LEVEL.ADVANCED
  } else if (currentLevel < LEVEL_THRESHOLDS.ELITE_END) {
    return XP_PER_LEVEL.ELITE
  } else if (currentLevel < LEVEL_THRESHOLDS.MASTER_END) {
    return XP_PER_LEVEL.MASTER
  } else {
    return XP_PER_LEVEL.LEGEND
  }
}

/**
 * Calculate total XP needed to reach a specific level
 */
export function getTotalXPForLevel(targetLevel: number): number {
  if (targetLevel <= 1) return 0

  let totalXP = 0

  // Levels 1-10
  if (targetLevel <= LEVEL_THRESHOLDS.NOVICE_END) {
    return (targetLevel - 1) * XP_PER_LEVEL.NOVICE
  }
  totalXP += (LEVEL_THRESHOLDS.NOVICE_END - 1) * XP_PER_LEVEL.NOVICE

  // Levels 11-25
  if (targetLevel <= LEVEL_THRESHOLDS.INTERMEDIATE_END) {
    const levelsInTier = targetLevel - LEVEL_THRESHOLDS.NOVICE_END
    return totalXP + levelsInTier * XP_PER_LEVEL.INTERMEDIATE
  }
  totalXP += (LEVEL_THRESHOLDS.INTERMEDIATE_END - LEVEL_THRESHOLDS.NOVICE_END) * XP_PER_LEVEL.INTERMEDIATE

  // Levels 26-50
  if (targetLevel <= LEVEL_THRESHOLDS.ADVANCED_END) {
    const levelsInTier = targetLevel - LEVEL_THRESHOLDS.INTERMEDIATE_END
    return totalXP + levelsInTier * XP_PER_LEVEL.ADVANCED
  }
  totalXP += (LEVEL_THRESHOLDS.ADVANCED_END - LEVEL_THRESHOLDS.INTERMEDIATE_END) * XP_PER_LEVEL.ADVANCED

  // Levels 51-75
  if (targetLevel <= LEVEL_THRESHOLDS.ELITE_END) {
    const levelsInTier = targetLevel - LEVEL_THRESHOLDS.ADVANCED_END
    return totalXP + levelsInTier * XP_PER_LEVEL.ELITE
  }
  totalXP += (LEVEL_THRESHOLDS.ELITE_END - LEVEL_THRESHOLDS.ADVANCED_END) * XP_PER_LEVEL.ELITE

  // Levels 76-100
  if (targetLevel <= LEVEL_THRESHOLDS.MASTER_END) {
    const levelsInTier = targetLevel - LEVEL_THRESHOLDS.ELITE_END
    return totalXP + levelsInTier * XP_PER_LEVEL.MASTER
  }
  totalXP += (LEVEL_THRESHOLDS.MASTER_END - LEVEL_THRESHOLDS.ELITE_END) * XP_PER_LEVEL.MASTER

  // Levels 100+
  const levelsInTier = targetLevel - LEVEL_THRESHOLDS.MASTER_END
  return totalXP + levelsInTier * XP_PER_LEVEL.LEGEND
}

/**
 * Get rank title from level
 */
export function getRankTitle(level: number): string {
  if (level >= 100) return 'Soviet Legend'
  if (level >= 76) return 'Master'
  if (level >= 51) return 'Elite'
  if (level >= 26) return 'Advanced'
  if (level >= 11) return 'Intermediate'
  return 'Novice'
}

/**
 * Get progress to next level (0-100%)
 */
export function getLevelProgress(currentXP: number): {
  currentLevel: number
  nextLevel: number
  xpInCurrentLevel: number
  xpNeededForNextLevel: number
  progressPercentage: number
} {
  const currentLevel = calculateLevelFromXP(currentXP)
  const nextLevel = currentLevel + 1
  const xpNeededForCurrentLevel = getTotalXPForLevel(currentLevel)
  const xpNeededForNextLevel = getXPForNextLevel(currentLevel)
  const xpInCurrentLevel = currentXP - xpNeededForCurrentLevel

  const progressPercentage = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100))

  return {
    currentLevel,
    nextLevel,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    progressPercentage,
  }
}

/**
 * Award XP for an action
 */
export function awardXP(action: keyof typeof XP_REWARDS): number {
  return XP_REWARDS[action]
}
