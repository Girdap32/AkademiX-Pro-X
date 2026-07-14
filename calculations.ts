/**
 * Domain layer - saf hesaplama fonksiyonları.
 * Bu dosya hiçbir React/DB importu içermez (bkz. 02_SYSTEM_ARCHITECTURE.md §3).
 */

export interface TestInput {
  questionCount: number
  correct: number
  wrong: number
  blank: number
  wrongCoefficient?: number // varsayılan 4
}

export interface TestResult {
  net: number
  successRate: number
}

/**
 * Net = Doğru - (Yanlış / Yanlış Katsayısı)
 * Başarı % = (Net / Soru Sayısı) * 100
 * bkz. 07_ANALYTICS.md §1
 */
export function calculateTestResult(input: TestInput): TestResult {
  const coefficient = input.wrongCoefficient ?? 4
  const net = input.correct - input.wrong / coefficient
  const successRate = input.questionCount > 0 ? (net / input.questionCount) * 100 : 0
  return {
    net: Math.round(net * 100) / 100,
    successRate: Math.round(successRate * 100) / 100,
  }
}

export function validateTestInput(input: TestInput): string | null {
  if (input.correct < 0 || input.wrong < 0 || input.blank < 0) {
    return 'Değerler negatif olamaz.'
  }
  if (input.correct + input.wrong + input.blank !== input.questionCount) {
    return 'Doğru + Yanlış + Boş, Soru Sayısına eşit olmalıdır.'
  }
  return null
}

/**
 * Basit lineer regresyon eğimi - trend tespiti için (bkz. 06_AI_SYSTEM.md §2)
 * Pozitif eğim = yükseliş, negatif eğim = düşüş
 */
export function calculateTrendSlope(values: number[]): number {
  const n = values.length
  if (n < 2) return 0
  const xMean = (n - 1) / 2
  const yMean = values.reduce((a, b) => a + b, 0) / n
  let numerator = 0
  let denominator = 0
  values.forEach((y, x) => {
    numerator += (x - xMean) * (y - yMean)
    denominator += (x - xMean) ** 2
  })
  return denominator === 0 ? 0 : Math.round((numerator / denominator) * 100) / 100
}

/**
 * Kazanım hakimiyet yüzdesi (bkz. 07_ANALYTICS.md §1)
 */
export function calculateMasteryRate(masteredCount: number, totalCount: number): number {
  if (totalCount === 0) return 0
  return Math.round((masteredCount / totalCount) * 100)
}

/**
 * Oyunlaştırma: XP'den seviye hesaplama (bkz. 05_FEATURES.md §12)
 * Her seviye bir öncekinden %20 daha fazla XP gerektirir (basit üstel eğri)
 */
export function calculateLevelFromXp(totalXp: number): number {
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

/**
 * Üniversite ders notu hesaplama (bkz. 12_UNIVERSITY.md §3)
 */
export function calculateCourseGrade(
  assessments: { score: number; maxScore: number; weightPercent: number }[]
): number {
  return assessments.reduce((sum, a) => {
    const normalized = a.maxScore > 0 ? (a.score / a.maxScore) * 100 : 0
    return sum + (normalized * a.weightPercent) / 100
  }, 0)
}

/**
 * GPA hesaplama (4'lük sistem, basit doğrusal dönüşüm; bkz. 12_UNIVERSITY.md §4)
 */
export function gradeToGpaPoint(gradeOn100: number): number {
  return Math.round((gradeOn100 / 100) * 4 * 100) / 100
}

export function calculateGpa(courses: { gradeOn100: number; credit: number }[]): number {
  const totalCredit = courses.reduce((sum, c) => sum + c.credit, 0)
  if (totalCredit === 0) return 0
  const weightedSum = courses.reduce(
    (sum, c) => sum + gradeToGpaPoint(c.gradeOn100) * c.credit,
    0
  )
  return Math.round((weightedSum / totalCredit) * 100) / 100
}
