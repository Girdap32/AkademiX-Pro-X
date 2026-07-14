import type { SchoolExam, UniversityCourse } from '../data/db'

/**
 * bkz. 12_UNIVERSITY.md §3 - Ders notu hesaplama
 * ders_notu = Σ(kalem_puanı × kalem_ağırlığı / 100)
 */
export function calculateCourseScore(exams: SchoolExam[]): {
  score: number
  totalWeight: number
  isComplete: boolean
} {
  const totalWeight = exams.reduce((sum, e) => sum + e.weightPercent, 0)
  const score = exams.reduce((sum, e) => sum + (e.score / e.maxScore) * 100 * (e.weightPercent / 100), 0)
  return {
    score: Math.round(score * 100) / 100,
    totalWeight,
    isComplete: totalWeight === 100,
  }
}

// Yaygın 100'lük -> 4'lük dönüşüm eşiği (kullanıcı özelleştirebilir - bkz. 12_UNIVERSITY.md §4)
const GRADE_SCALE: { min: number; point: number; letter: string }[] = [
  { min: 90, point: 4.0, letter: 'AA' },
  { min: 85, point: 3.5, letter: 'BA' },
  { min: 80, point: 3.0, letter: 'BB' },
  { min: 75, point: 2.5, letter: 'CB' },
  { min: 70, point: 2.0, letter: 'CC' },
  { min: 65, point: 1.5, letter: 'DC' },
  { min: 60, point: 1.0, letter: 'DD' },
  { min: 50, point: 0.5, letter: 'FD' },
  { min: 0, point: 0.0, letter: 'FF' },
]

export function scoreToGradePoint(score100: number): { point: number; letter: string } {
  const entry = GRADE_SCALE.find((g) => score100 >= g.min) ?? GRADE_SCALE[GRADE_SCALE.length - 1]
  return { point: entry.point, letter: entry.letter }
}

/**
 * bkz. 12_UNIVERSITY.md §4 - GPA = Σ(not katsayısı × kredi) / Σ(kredi)
 */
export function calculateGpa(
  courses: { course: UniversityCourse; score100: number }[]
): number {
  const totalCredits = courses.reduce((sum, c) => sum + c.course.credit, 0)
  if (totalCredits === 0) return 0
  const weighted = courses.reduce((sum, c) => {
    const { point } = scoreToGradePoint(c.score100)
    return sum + point * c.course.credit
  }, 0)
  return Math.round((weighted / totalCredits) * 100) / 100
}
