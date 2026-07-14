/**
 * bkz. 05_FEATURES.md §7 - Tekrar Sistemi (Spaced Repetition)
 * Basitleştirilmiş unutma-eğrisi algoritması (SM-2 benzeri, sadeleştirilmiş).
 */

const INTERVALS_DAYS = [1, 3, 7, 14, 30, 60, 90]

export function calculateNextReviewDate(
  reviewCount: number,
  lastResult: 'basarili' | 'basarisiz' | undefined,
  fromDate: Date = new Date()
): { nextReviewDate: string; nextReviewCount: number } {
  // Başarısız olursa bir adım geri düşer (en fazla 0'a kadar)
  let index = lastResult === 'basarisiz' ? Math.max(0, reviewCount - 1) : reviewCount
  index = Math.min(index, INTERVALS_DAYS.length - 1)
  const days = INTERVALS_DAYS[index]
  const next = new Date(fromDate)
  next.setDate(next.getDate() + days)
  return {
    nextReviewDate: next.toISOString().slice(0, 10),
    nextReviewCount: lastResult === 'basarisiz' ? index : reviewCount + 1,
  }
}

export function isOverdue(nextReviewDate: string, today: Date = new Date()): boolean {
  return new Date(nextReviewDate) <= today
}
