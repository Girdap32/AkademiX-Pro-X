import { db } from './db'
import * as XLSX from 'xlsx'

const EXPORT_VERSION = '1.0'

/**
 * bkz. 14_EXPORTS.md §2 - JSON Tam Yedek Formatı
 */
export async function exportToJson(): Promise<string> {
  const data = {
    subjects: await db.subjects.toArray(),
    topics: await db.topics.toArray(),
    subtopics: await db.subtopics.toArray(),
    outcomes: await db.outcomes.toArray(),
    resources: await db.resources.toArray(),
    books: await db.books.toArray(),
    testRecords: await db.testRecords.toArray(),
    exams: await db.exams.toArray(),
    schoolExams: await db.schoolExams.toArray(),
    universityCourses: await db.universityCourses.toArray(),
    wrongAnalysis: await db.wrongAnalysis.toArray(),
    reviewQueue: await db.reviewQueue.toArray(),
    studyPlans: await db.studyPlans.toArray(),
    planTasks: await db.planTasks.toArray(),
    userXp: await db.userXp.toArray(),
    streaks: await db.streaks.toArray(),
    badges: await db.badges.toArray(),
    aiInsights: await db.aiInsights.toArray(),
  }
  const payload = {
    export_version: EXPORT_VERSION,
    exported_at: new Date().toISOString(),
    app_version: '0.1.0-mvp',
    data,
  }
  return JSON.stringify(payload, null, 2)
}

/**
 * bkz. 14_EXPORTS.md §2 - Import (replace modu; merge v2'de eklenecek)
 */
export async function importFromJson(jsonText: string): Promise<{ success: boolean; message: string }> {
  try {
    const parsed = JSON.parse(jsonText)
    if (!parsed.data) return { success: false, message: 'Geçersiz dosya formatı.' }
    const d = parsed.data

    await db.transaction(
      'rw',
      [
        db.subjects, db.topics, db.subtopics, db.outcomes, db.resources, db.books,
        db.testRecords, db.exams, db.schoolExams, db.universityCourses, db.wrongAnalysis,
        db.reviewQueue, db.studyPlans, db.planTasks, db.userXp, db.streaks, db.badges, db.aiInsights,
      ],
      async () => {
        const tables: [string, any][] = [
          ['subjects', db.subjects], ['topics', db.topics], ['subtopics', db.subtopics],
          ['outcomes', db.outcomes], ['resources', db.resources], ['books', db.books],
          ['testRecords', db.testRecords], ['exams', db.exams], ['schoolExams', db.schoolExams],
          ['universityCourses', db.universityCourses], ['wrongAnalysis', db.wrongAnalysis],
          ['reviewQueue', db.reviewQueue], ['studyPlans', db.studyPlans], ['planTasks', db.planTasks],
          ['userXp', db.userXp], ['streaks', db.streaks], ['badges', db.badges], ['aiInsights', db.aiInsights],
        ]
        for (const [key, table] of tables) {
          if (Array.isArray(d[key])) {
            await table.clear()
            await table.bulkAdd(d[key])
          }
        }
      }
    )
    return { success: true, message: 'İçe aktarma başarılı. Sayfa yenileniyor...' }
  } catch (e) {
    return { success: false, message: `İçe aktarma hatası: ${(e as Error).message}` }
  }
}

/**
 * bkz. 14_EXPORTS.md §3 - Excel Export (her ana varlık ayrı sheet)
 */
export async function exportToExcel(): Promise<void> {
  const wb = XLSX.utils.book_new()

  const subjects = await db.subjects.filter((s) => !s.isDeleted).toArray()
  const tests = await db.testRecords.filter((t) => !t.isDeleted).toArray()
  const exams = await db.exams.filter((e) => !e.isDeleted).toArray()

  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]))

  const testRows = tests.map((t) => ({
    Tarih: t.date,
    Ders: subjectMap.get(t.subjectId) ?? '-',
    Süre_Dakika: t.durationMinutes,
    Soru: t.questionCount,
    Doğru: t.correct,
    Yanlış: t.wrong,
    Boş: t.blank,
    Net: t.net,
    'Başarı_%': t.successRate,
    Not: t.note ?? '',
  }))

  const examRows = exams.flatMap((e) =>
    e.subjectResults.map((r) => ({
      Tarih: e.date,
      SınavTürü: e.examType,
      Yayınevi: e.publisher ?? '',
      Ders: r.subjectName,
      Doğru: r.correct,
      Yanlış: r.wrong,
      Boş: r.blank,
      Net: r.net,
      TahminiToplamPuan: e.estimatedScore,
    }))
  )

  wb.SheetNames.push('Testler')
  wb.Sheets['Testler'] = XLSX.utils.json_to_sheet(testRows)
  wb.SheetNames.push('Denemeler')
  wb.Sheets['Denemeler'] = XLSX.utils.json_to_sheet(examRows)

  XLSX.writeFile(wb, `akademix-export-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

export function downloadJsonFile(jsonText: string) {
  const blob = new Blob([jsonText], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `akademix-yedek-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
