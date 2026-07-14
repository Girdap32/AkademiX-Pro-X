import type { ExamSubjectResult, ExamType } from '../data/db'

/**
 * bkz. 08_EXAMS.md, 10_LGS.md, 11_TYT_AYT.md
 * Not: Resmi ÖSYM/MEB puan hesaplama yöntemleri yıllık istatistiksel
 * dönüşümlere dayanır. Burada kullanılan katsayılar TAHMİNİ puan
 * üretir; kullanıcı bunu ayarlardan güncelleyebilir (bkz. 10/11 §3).
 */

export interface ExamFormatSubject {
  name: string
  questionCount: number
  weight: number // tahmini puan hesabında ağırlık katsayısı
}

export interface ExamFormatTemplate {
  examType: ExamType
  wrongCoefficient: number // 0 = yanlış etkisiz (LGS), 4 = klasik (TYT/AYT vb.)
  subjects: ExamFormatSubject[]
  maxScore: number
}

// bkz. 10_LGS.md §1
export const LGS_FORMAT: ExamFormatTemplate = {
  examType: 'LGS',
  wrongCoefficient: 0,
  maxScore: 500,
  subjects: [
    { name: 'Türkçe', questionCount: 20, weight: 4.4 },
    { name: 'Matematik', questionCount: 20, weight: 4.4 },
    { name: 'Fen Bilimleri', questionCount: 20, weight: 4.4 },
    { name: 'T.C. İnkılap Tarihi', questionCount: 10, weight: 3.4 },
    { name: 'Din Kültürü', questionCount: 10, weight: 3.4 },
    { name: 'Yabancı Dil', questionCount: 10, weight: 3.4 },
  ],
}

// bkz. 11_TYT_AYT.md §1
export const TYT_FORMAT: ExamFormatTemplate = {
  examType: 'TYT',
  wrongCoefficient: 4,
  maxScore: 500,
  subjects: [
    { name: 'Türkçe', questionCount: 40, weight: 3.3 },
    { name: 'Sosyal Bilimler', questionCount: 20, weight: 3.3 },
    { name: 'Temel Matematik', questionCount: 40, weight: 3.3 },
    { name: 'Fen Bilimleri', questionCount: 20, weight: 3.3 },
  ],
}

export const AYT_FORMAT: ExamFormatTemplate = {
  examType: 'AYT',
  wrongCoefficient: 4,
  maxScore: 500,
  subjects: [
    { name: 'Matematik', questionCount: 40, weight: 3 },
    { name: 'Fizik', questionCount: 14, weight: 3 },
    { name: 'Kimya', questionCount: 13, weight: 3 },
    { name: 'Biyoloji', questionCount: 13, weight: 3 },
    { name: 'Edebiyat', questionCount: 24, weight: 3 },
    { name: 'Tarih', questionCount: 10, weight: 3 },
    { name: 'Coğrafya', questionCount: 6, weight: 3 },
    { name: 'Felsefe Grubu', questionCount: 12, weight: 3 },
    { name: 'Din Kültürü', questionCount: 6, weight: 3 },
  ],
}

// Genel çekirdek şablon (KPSS/ALES/DGS/YDS/YÖKDİL) - bkz. 08_EXAMS.md §4
function genericFormat(examType: ExamType): ExamFormatTemplate {
  return {
    examType,
    wrongCoefficient: 4,
    maxScore: 100,
    subjects: [{ name: 'Genel Yetenek', questionCount: 60, weight: 1 }],
  }
}

export const EXAM_FORMATS: Record<ExamType, ExamFormatTemplate> = {
  LGS: LGS_FORMAT,
  TYT: TYT_FORMAT,
  AYT: AYT_FORMAT,
  KPSS: genericFormat('KPSS'),
  ALES: genericFormat('ALES'),
  DGS: genericFormat('DGS'),
  YDS: genericFormat('YDS'),
  YOKDIL: genericFormat('YOKDIL'),
}

export function calculateSubjectNet(
  correct: number,
  wrong: number,
  wrongCoefficient: number
): number {
  if (wrongCoefficient === 0) return correct
  return Math.round((correct - wrong / wrongCoefficient) * 100) / 100
}

/**
 * bkz. 08_EXAMS.md §5 - Doğrulama kuralları
 */
export function validateExamSubjectResult(
  result: { correct: number; wrong: number; blank: number },
  formatSubject: ExamFormatSubject
): string | null {
  if (result.correct < 0 || result.wrong < 0 || result.blank < 0) return 'Değerler negatif olamaz.'
  const total = result.correct + result.wrong + result.blank
  if (total !== formatSubject.questionCount) {
    return `${formatSubject.name}: Doğru+Yanlış+Boş toplamı ${formatSubject.questionCount} olmalı.`
  }
  return null
}

/**
 * Tahmini puan = ders bazlı net * ağırlık katsayısı toplamı, maxScore ile sınırlanır.
 * bkz. 10_LGS.md §3, 11_TYT_AYT.md §3
 */
export function calculateEstimatedScore(
  results: ExamSubjectResult[],
  format: ExamFormatTemplate
): number {
  let raw = 0
  results.forEach((r) => {
    const formatSubject = format.subjects.find((s) => s.name === r.subjectName)
    const weight = formatSubject?.weight ?? 1
    raw += r.net * weight
  })
  const base = format.examType === 'LGS' || format.examType === 'TYT' || format.examType === 'AYT' ? 100 : 0
  const score = Math.min(format.maxScore, Math.max(0, raw + base))
  return Math.round(score * 100) / 100
}

export function calculateTotalNet(results: ExamSubjectResult[]): number {
  return Math.round(results.reduce((sum, r) => sum + r.net, 0) * 100) / 100
}
