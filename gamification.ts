/**
 * bkz. 05_FEATURES.md §12 - Oyunlaştırma
 */

export const XP_PER_TEST = 10
export const XP_PER_REVIEW = 5
export const XP_PER_PLAN_TASK = 8

export function calculateLevel(totalXp: number): number {
  // Her seviye bir öncekinden %20 daha fazla XP gerektirir (100, 220, 364, ...)
  let level = 1
  let threshold = 100
  let remaining = totalXp
  while (remaining >= threshold) {
    remaining -= threshold
    level += 1
    threshold = Math.round(threshold * 1.2)
  }
  return level
}

export function xpToNextLevel(totalXp: number): { current: number; needed: number } {
  let threshold = 100
  let remaining = totalXp
  while (remaining >= threshold) {
    remaining -= threshold
    threshold = Math.round(threshold * 1.2)
  }
  return { current: remaining, needed: threshold }
}

export interface BadgeDefinition {
  key: string
  label: string
  check: (stats: { totalTests: number; currentStreak: number; totalExams: number }) => boolean
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { key: 'first_test', label: 'İlk Test', check: (s) => s.totalTests >= 1 },
  { key: 'tests_10', label: '10 Test Tamamlandı', check: (s) => s.totalTests >= 10 },
  { key: 'tests_100', label: '100 Test Tamamlandı', check: (s) => s.totalTests >= 100 },
  { key: 'streak_7', label: '7 Gün Kesintisiz Çalışma', check: (s) => s.currentStreak >= 7 },
  { key: 'streak_30', label: '30 Gün Kesintisiz Çalışma', check: (s) => s.currentStreak >= 30 },
  { key: 'first_exam', label: 'İlk Deneme', check: (s) => s.totalExams >= 1 },
]

export function calculateStreakUpdate(
  lastActiveDate: string,
  currentStreak: number,
  today: Date = new Date()
): { currentStreak: number; lastActiveDate: string } {
  const todayStr = today.toISOString().slice(0, 10)
  if (lastActiveDate === todayStr) {
    return { currentStreak, lastActiveDate: todayStr }
  }
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  if (lastActiveDate === yesterdayStr) {
    return { currentStreak: currentStreak + 1, lastActiveDate: todayStr }
  }
  return { currentStreak: 1, lastActiveDate: todayStr }
}
