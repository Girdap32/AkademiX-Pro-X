import Dexie, { type Table } from 'dexie'

// bkz. 03_DATABASE.md

// Öğrenci profili ve sınıf geçmişi (bkz. 01_PROJECT_RULES.md — veri kaybı sıfır tolerans)
export interface StudentProfile {
  id?: number
  firstName: string
  lastName: string
  activeGradePeriodId?: number
}

export const GRADE_PRESETS = [
  '1. Sınıf', '2. Sınıf', '3. Sınıf', '4. Sınıf',
  '5. Sınıf', '6. Sınıf', '7. Sınıf', '8. Sınıf',
  '9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf',
  'Mezun (Sınav Hazırlık)',
  'Üniversite 1. Sınıf', 'Üniversite 2. Sınıf', 'Üniversite 3. Sınıf', 'Üniversite 4. Sınıf',
]

export interface GradePeriod {
  id?: number
  label: string // örn. "8. Sınıf (2025-2026)"
  gradeName: string // örn. "8. Sınıf" - GRADE_PRESETS'ten veya serbest metin
  startDate: string
  endDate?: string // boşsa hâlâ aktif
  isActive: boolean
}

export interface Subject {
  id?: number
  name: string
  moduleType: string // 'lgs' | 'tyt_ayt' | 'university' | 'custom'
  color: string
  wrongCoefficient: number
  isDeleted?: boolean
  createdAt: string
}

export interface Topic {
  id?: number
  subjectId: number
  name: string
  orderIndex: number
  isDeleted?: boolean
}

export interface Subtopic {
  id?: number
  topicId: number
  name: string
  orderIndex: number
  isDeleted?: boolean
}

export interface Outcome {
  id?: number
  subtopicId: number
  name: string
  isMastered: boolean
  isDeleted?: boolean
}

export interface Resource {
  id?: number
  subjectId: number
  name: string
  isDeleted?: boolean
}

export interface Book {
  id?: number
  resourceId: number
  name: string
  totalTests?: number
  isDeleted?: boolean
}

export interface TestRecord {
  id?: number
  subjectId: number
  topicId?: number
  subtopicId?: number
  resourceId?: number
  bookId?: number
  testNumber?: number
  gradePeriodId?: number // hangi sınıf döneminde girildi (bkz. profil/sınıf geçmişi)
  date: string
  durationMinutes: number
  questionCount: number
  correct: number
  wrong: number
  blank: number
  net: number
  successRate: number
  note?: string
  isDeleted?: boolean
  createdAt: string
}

// bkz. 08_EXAMS.md, 10_LGS.md, 11_TYT_AYT.md
export type ExamType = 'LGS' | 'TYT' | 'AYT' | 'KPSS' | 'ALES' | 'DGS' | 'YDS' | 'YOKDIL'

export interface ExamSubjectResult {
  subjectName: string
  questionCount: number
  correct: number
  wrong: number
  blank: number
  net: number
}

export interface Exam {
  id?: number
  examType: ExamType
  date: string
  publisher?: string
  gradePeriodId?: number
  subjectResults: ExamSubjectResult[]
  totalNet: number
  estimatedScore: number
  targetScore?: number
  note?: string
  isDeleted?: boolean
  createdAt: string
}

// bkz. 03_DATABASE.md §3.8, 12_UNIVERSITY.md
export interface SchoolExam {
  id?: number
  subjectId: number // universityCourses.id referansı
  examType: string // vize | final | quiz | lab | proje
  score: number
  maxScore: number
  weightPercent: number
  semester: string
  isDeleted?: boolean
}

export interface UniversityCourse {
  id?: number
  name: string
  credit: number
  semester: string
  gradeSystem: '4' | '100'
  isDeleted?: boolean
}

// bkz. 03_DATABASE.md §3.9
export type ErrorType = 'bilgi_eksikligi' | 'dikkatsizlik' | 'zaman_yetersizligi' | 'soru_tipi_bilinmiyor'

export interface WrongAnalysis {
  id?: number
  testRecordId: number
  outcomeId?: number
  errorType: ErrorType
  note?: string
}

// bkz. 03_DATABASE.md §3.10
export interface ReviewQueueItem {
  id?: number
  label: string // kazanım/konu adı (serbest metin, hızlı ekleme için)
  subjectId?: number
  nextReviewDate: string
  reviewCount: number
  lastResult?: 'basarili' | 'basarisiz'
  isDeleted?: boolean
}

// bkz. 03_DATABASE.md §3.11
export interface StudyPlan {
  id?: number
  periodType: 'gunluk' | 'haftalik' | 'aylik'
  startDate: string
  endDate: string
  isDeleted?: boolean
}

export interface PlanTask {
  id?: number
  planId: number
  subjectId?: number
  topicId?: number
  title: string
  targetDate: string
  isCompleted: boolean
  isDeleted?: boolean
}

// bkz. 03_DATABASE.md §3.12
export interface UserXp {
  id?: number
  totalXp: number
  level: number
}

export interface Streak {
  id?: number
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
}

export interface Badge {
  id?: number
  badgeKey: string
  label: string
  earnedAt: string
}

// bkz. 03_DATABASE.md §3.13
export interface AiInsight {
  id?: number
  insightType: string
  subjectId?: number
  message: string
  generatedAt: string
  isRead: boolean
}

class AkademiXDatabase extends Dexie {
  studentProfile!: Table<StudentProfile, number>
  gradePeriods!: Table<GradePeriod, number>
  subjects!: Table<Subject, number>
  topics!: Table<Topic, number>
  subtopics!: Table<Subtopic, number>
  outcomes!: Table<Outcome, number>
  resources!: Table<Resource, number>
  books!: Table<Book, number>
  testRecords!: Table<TestRecord, number>
  exams!: Table<Exam, number>
  schoolExams!: Table<SchoolExam, number>
  universityCourses!: Table<UniversityCourse, number>
  wrongAnalysis!: Table<WrongAnalysis, number>
  reviewQueue!: Table<ReviewQueueItem, number>
  studyPlans!: Table<StudyPlan, number>
  planTasks!: Table<PlanTask, number>
  userXp!: Table<UserXp, number>
  streaks!: Table<Streak, number>
  badges!: Table<Badge, number>
  aiInsights!: Table<AiInsight, number>

  constructor() {
    super('AkademiXProX')
    this.version(1).stores({
      subjects: '++id, name, moduleType, isDeleted',
      topics: '++id, subjectId, isDeleted',
      subtopics: '++id, topicId, isDeleted',
      outcomes: '++id, subtopicId, isDeleted',
      resources: '++id, subjectId, isDeleted',
      books: '++id, resourceId, isDeleted',
      testRecords: '++id, subjectId, topicId, date, isDeleted',
    })
    this.version(2).stores({
      exams: '++id, examType, date, isDeleted',
      schoolExams: '++id, subjectId, semester, isDeleted',
      universityCourses: '++id, semester, isDeleted',
      wrongAnalysis: '++id, testRecordId, outcomeId',
      reviewQueue: '++id, nextReviewDate, isDeleted',
      studyPlans: '++id, periodType, isDeleted',
      planTasks: '++id, planId, targetDate, isCompleted, isDeleted',
      userXp: '++id',
      streaks: '++id',
      badges: '++id, badgeKey',
      aiInsights: '++id, insightType, isRead, generatedAt',
    })
    this.version(3).stores({
      studentProfile: '++id',
      gradePeriods: '++id, isActive',
      testRecords: '++id, subjectId, topicId, date, isDeleted, gradePeriodId',
      exams: '++id, examType, date, isDeleted, gradePeriodId',
    })
  }
}

export const db = new AkademiXDatabase()

export async function ensureGamificationSingletons() {
  const xpCount = await db.userXp.count()
  if (xpCount === 0) await db.userXp.add({ totalXp: 0, level: 1 })
  const streakCount = await db.streaks.count()
  if (streakCount === 0) {
    await db.streaks.add({ currentStreak: 0, longestStreak: 0, lastActiveDate: '' })
  }
}

/**
 * Profil ve en az bir aktif sınıf dönemi olmasını garanti eder.
 * bkz. 01_PROJECT_RULES.md — ilk açılışta veri kaybı olmadan başlangıç durumu.
 */
export async function ensureProfileAndGradePeriod() {
  let profile = await db.studentProfile.toCollection().first()
  if (!profile) {
    const id = await db.studentProfile.add({ firstName: '', lastName: '' })
    profile = { id, firstName: '', lastName: '' }
  }
  let activePeriod = await db.gradePeriods.filter((p) => p.isActive).first()
  if (!activePeriod) {
    const id = await db.gradePeriods.add({
      label: 'Genel',
      gradeName: 'Genel',
      startDate: new Date().toISOString().slice(0, 10),
      isActive: true,
    })
    activePeriod = { id, label: 'Genel', gradeName: 'Genel', startDate: '', isActive: true }
    await db.studentProfile.update(profile.id!, { activeGradePeriodId: id })
  } else if (!profile.activeGradePeriodId) {
    await db.studentProfile.update(profile.id!, { activeGradePeriodId: activePeriod.id })
  }
  return { profile, activePeriod }
}

/**
 * Sınıf değişikliği: eski dönem KAPATILIR (silinmez), yeni dönem AÇILIR.
 * Tüm eski test/deneme kayıtları eski gradePeriodId ile korunur ve
 * "Sınıf Gelişimi" sayfasından her zaman görüntülenebilir.
 * bkz. 01_PROJECT_RULES.md §2 "Veri Kaybı Sıfır Tolerans"
 */
export async function changeGradePeriod(gradeName: string) {
  const currentActive = await db.gradePeriods.filter((p) => p.isActive).first()
  const today = new Date().toISOString().slice(0, 10)
  if (currentActive?.id) {
    await db.gradePeriods.update(currentActive.id, { isActive: false, endDate: today })
  }
  const year = new Date().getFullYear()
  const newId = await db.gradePeriods.add({
    label: `${gradeName} (${year}-${year + 1})`,
    gradeName,
    startDate: today,
    isActive: true,
  })
  const profile = await db.studentProfile.toCollection().first()
  if (profile?.id) {
    await db.studentProfile.update(profile.id, { activeGradePeriodId: newId })
  }
  return newId
}
