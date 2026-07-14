import type { TestRecord, Exam, GradePeriod } from '../data/db'

export interface GradePeriodStats {
  gradePeriodId: number
  label: string
  gradeName: string
  startDate: string
  endDate?: string
  isActive: boolean
  testCount: number
  avgSuccessRate: number
  examCount: number
  avgExamNet: number
}

/**
 * Her sınıf dönemi için ayrı istatistik üretir - "sınıf sınıf gelişim" görünümü.
 * bkz. 01_PROJECT_RULES.md §2 (veri kaybı sıfır tolerans) - sınıf değiştiğinde
 * hiçbir veri silinmez, bu fonksiyon geçmiş sınıfların verisini de gösterir.
 */
export function calculateGradePeriodStats(
  periods: GradePeriod[],
  records: TestRecord[],
  exams: Exam[]
): GradePeriodStats[] {
  return periods
    .map((p) => {
      const periodRecords = records.filter((r) => r.gradePeriodId === p.id)
      const periodExams = exams.filter((e) => e.gradePeriodId === p.id)
      const avgSuccessRate =
        periodRecords.length > 0
          ? Math.round(
              (periodRecords.reduce((s, r) => s + r.successRate, 0) / periodRecords.length) * 10
            ) / 10
          : 0
      const avgExamNet =
        periodExams.length > 0
          ? Math.round((periodExams.reduce((s, e) => s + e.totalNet, 0) / periodExams.length) * 10) / 10
          : 0
      return {
        gradePeriodId: p.id!,
        label: p.label,
        gradeName: p.gradeName,
        startDate: p.startDate,
        endDate: p.endDate,
        isActive: p.isActive,
        testCount: periodRecords.length,
        avgSuccessRate,
        examCount: periodExams.length,
        avgExamNet,
      }
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}
