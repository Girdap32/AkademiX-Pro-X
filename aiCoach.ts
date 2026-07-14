import type { TestRecord, Subject, Topic } from '../data/db'
import { calculateTrendSlope } from './calculations'

/**
 * bkz. 06_AI_SYSTEM.md §2 - Yerel Analiz Motoru
 * Bu motor tamamen offline çalışır, LLM'e bağımlı değildir.
 */

export interface Insight {
  type: 'trend_up' | 'trend_down' | 'weak_subject' | 'weak_topic' | 'strong_topic' | 'no_recent_activity' | 'best_subject'
  subjectId?: number
  topicId?: number
  message: string
}

export interface TopicAnalysis {
  topicId: number
  topicName: string
  subjectId: number
  subjectName: string
  avgSuccessRate: number
  testCount: number
}

const TREND_WINDOW = 8
const TREND_THRESHOLD = 0.5
const WEAK_SUBJECT_THRESHOLD = 10 // genel ortalamanın altında bu kadar puan düşükse zayıf sayılır
const WEAK_TOPIC_RATE = 60 // bu yüzdenin altındaki konular "büyük eksik" sayılır
const STRONG_TOPIC_RATE = 80

/**
 * Konu bazlı başarı analizi (bkz. 03_DATABASE.md §3.5, 07_ANALYTICS.md §1)
 * Örnek çıktı: "Matematik → Olasılık konusunda büyük eksik var (%42 başarı)"
 * Bu, veliye/öğrenciye "hangi konuda eksik var" sorusunun doğrudan cevabıdır.
 */
export function analyzeTopics(
  records: TestRecord[],
  topics: Topic[],
  subjects: Subject[]
): TopicAnalysis[] {
  return topics
    .map((topic) => {
      const topicRecords = records.filter((r) => r.topicId === topic.id)
      if (topicRecords.length === 0) return null
      const avg = topicRecords.reduce((sum, r) => sum + r.successRate, 0) / topicRecords.length
      const subject = subjects.find((s) => s.id === topic.subjectId)
      return {
        topicId: topic.id!,
        topicName: topic.name,
        subjectId: topic.subjectId,
        subjectName: subject?.name ?? '-',
        avgSuccessRate: Math.round(avg * 10) / 10,
        testCount: topicRecords.length,
      }
    })
    .filter((x): x is TopicAnalysis => x !== null)
    .sort((a, b) => a.avgSuccessRate - b.avgSuccessRate)
}

export function generateInsights(
  records: TestRecord[],
  subjects: Subject[],
  topics: Topic[] = []
): Insight[] {
  const insights: Insight[] = []
  if (records.length === 0) return insights

  const overallAvg =
    records.reduce((sum, r) => sum + r.successRate, 0) / records.length

  // Konu bazlı zayıflık/güç tespiti (bkz. 06_AI_SYSTEM.md §2 "Unutma Uyarısı"/"Zayıf Konu Tespiti")
  const topicAnalysis = analyzeTopics(records, topics, subjects)
  topicAnalysis
    .filter((t) => t.avgSuccessRate < WEAK_TOPIC_RATE)
    .forEach((t) => {
      insights.push({
        type: 'weak_topic',
        subjectId: t.subjectId,
        topicId: t.topicId,
        message: `${t.subjectName} → ${t.topicName} konusunda büyük eksik var (%${t.avgSuccessRate} başarı, ${t.testCount} test). Bu konuya öncelik verin.`,
      })
    })
  topicAnalysis
    .filter((t) => t.avgSuccessRate >= STRONG_TOPIC_RATE)
    .slice(-2)
    .forEach((t) => {
      insights.push({
        type: 'strong_topic',
        subjectId: t.subjectId,
        topicId: t.topicId,
        message: `${t.subjectName} → ${t.topicName} güçlü konunuz (%${t.avgSuccessRate}).`,
      })
    })

  for (const subject of subjects) {
    const subjectRecords = records
      .filter((r) => r.subjectId === subject.id)
      .sort((a, b) => a.date.localeCompare(b.date))

    if (subjectRecords.length === 0) continue

    // Trend tespiti (bkz. 06_AI_SYSTEM.md §2)
    const recent = subjectRecords.slice(-TREND_WINDOW).map((r) => r.net)
    if (recent.length >= 3) {
      const slope = calculateTrendSlope(recent)
      if (slope >= TREND_THRESHOLD) {
        insights.push({
          type: 'trend_up',
          subjectId: subject.id,
          message: `${subject.name} yükseliyor (son ${recent.length} testte eğim: +${slope}).`,
        })
      } else if (slope <= -TREND_THRESHOLD) {
        insights.push({
          type: 'trend_down',
          subjectId: subject.id,
          message: `${subject.name} düşüyor (son ${recent.length} testte eğim: ${slope}). Tekrar zamanı gelmiş olabilir.`,
        })
      }
    }

    // Zayıf ders tespiti
    const subjectAvg =
      subjectRecords.reduce((sum, r) => sum + r.successRate, 0) / subjectRecords.length
    if (overallAvg - subjectAvg >= WEAK_SUBJECT_THRESHOLD) {
      insights.push({
        type: 'weak_subject',
        subjectId: subject.id,
        message: `${subject.name}, genel ortalamanızın belirgin altında (%${Math.round(subjectAvg)} vs %${Math.round(overallAvg)}). Bu derse daha fazla zaman ayırmayı düşünün.`,
      })
    }

    // Son çalışma tarihi kontrolü
    const lastDate = new Date(subjectRecords[subjectRecords.length - 1].date)
    const daysSince = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysSince >= 14) {
      insights.push({
        type: 'no_recent_activity',
        subjectId: subject.id,
        message: `${subject.name} için ${daysSince} gündür test çözülmedi. Unutma riski artıyor olabilir.`,
      })
    }
  }

  // En iyi ders
  const bySubject = new Map<number, number[]>()
  records.forEach((r) => {
    const list = bySubject.get(r.subjectId) ?? []
    list.push(r.successRate)
    bySubject.set(r.subjectId, list)
  })
  let bestSubjectId: number | null = null
  let bestAvg = -1
  bySubject.forEach((rates, subjectId) => {
    const avg = rates.reduce((a, b) => a + b, 0) / rates.length
    if (avg > bestAvg) {
      bestAvg = avg
      bestSubjectId = subjectId
    }
  })
  if (bestSubjectId !== null) {
    const subj = subjects.find((s) => s.id === bestSubjectId)
    if (subj) {
      insights.push({
        type: 'best_subject',
        subjectId: bestSubjectId,
        message: `En güçlü dersiniz ${subj.name} (%${Math.round(bestAvg)} ortalama başarı).`,
      })
    }
  }

  return insights
}

/**
 * bkz. 06_AI_SYSTEM.md §3 - "Bugün hangi konuları çalışmalıyım?" sorusuna
 * yerel motorla cevap: en düşük başarı oranına sahip konular (varsa), yoksa dersler.
 */
export function recommendTodayFocus(
  records: TestRecord[],
  subjects: Subject[],
  topics: Topic[] = []
): { label: string; subjectId: number; topicId?: number }[] {
  const topicAnalysis = analyzeTopics(records, topics, subjects)
  if (topicAnalysis.length > 0) {
    return topicAnalysis.slice(0, 3).map((t) => ({
      label: `${t.subjectName} · ${t.topicName}`,
      subjectId: t.subjectId,
      topicId: t.topicId,
    }))
  }

  const bySubject = new Map<number, number[]>()
  records.forEach((r) => {
    const list = bySubject.get(r.subjectId) ?? []
    list.push(r.successRate)
    bySubject.set(r.subjectId, list)
  })
  const ranked = subjects
    .filter((s) => bySubject.has(s.id!))
    .map((s) => {
      const rates = bySubject.get(s.id!)!
      const avg = rates.reduce((a, b) => a + b, 0) / rates.length
      return { subject: s, avg }
    })
    .sort((a, b) => a.avg - b.avg)
  return ranked.slice(0, 3).map((r) => ({ label: r.subject.name, subjectId: r.subject.id! }))
}
