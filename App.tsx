import { useEffect, useState } from 'react'
import {
  LayoutDashboard, BookOpen, ClipboardList, FileBarChart, GraduationCap,
  RotateCcw, CalendarCheck, Trophy, Sparkles, Settings, Sun, Moon, User, TrendingUp,
} from 'lucide-react'
import { useThemeStore } from './store/themeStore'
import { useProfileStore } from './store/profileStore'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { SubjectsPage } from './features/subjects/SubjectsPage'
import { TestsPage } from './features/tests/TestsPage'
import { ExamsPage } from './features/exams/ExamsPage'
import { AnalyticsPage } from './features/analytics/AnalyticsPage'
import { UniversityPage } from './features/university/UniversityPage'
import { ReviewPage } from './features/review/ReviewPage'
import { PlanPage } from './features/plan/PlanPage'
import { GamificationPage } from './features/gamification/GamificationPage'
import { AiCoachPage } from './features/ai-coach/AiCoachPage'
import { SettingsPage } from './features/settings/SettingsPage'
import { ProfilePage } from './features/profile/ProfilePage'
import { GradeProgressPage } from './features/grade-progress/GradeProgressPage'

type Page =
  | 'dashboard' | 'subjects' | 'tests' | 'exams' | 'analytics'
  | 'university' | 'review' | 'plan' | 'gamification' | 'ai-coach' | 'settings'
  | 'profile' | 'grade-progress'

function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const { isDark, toggle } = useThemeStore()
  const { profile, activePeriod, loadAll } = useProfileStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const navItems: { key: Page; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { key: 'profile', label: 'Profilim', icon: <User size={18} /> },
    { key: 'subjects', label: 'Derslerim', icon: <BookOpen size={18} /> },
    { key: 'tests', label: 'Testler', icon: <ClipboardList size={18} /> },
    { key: 'exams', label: 'Denemeler', icon: <FileBarChart size={18} /> },
    { key: 'university', label: 'Üniversite', icon: <GraduationCap size={18} /> },
    { key: 'review', label: 'Tekrar Sistemi', icon: <RotateCcw size={18} /> },
    { key: 'plan', label: 'Çalışma Planı', icon: <CalendarCheck size={18} /> },
    { key: 'analytics', label: 'Raporlar', icon: <FileBarChart size={18} /> },
    { key: 'grade-progress', label: 'Sınıf Gelişimi', icon: <TrendingUp size={18} /> },
    { key: 'ai-coach', label: 'Akademi AI', icon: <Sparkles size={18} /> },
    { key: 'gamification', label: 'Başarılar', icon: <Trophy size={18} /> },
    { key: 'settings', label: 'Ayarlar', icon: <Settings size={18} /> },
  ]

  const pages: Record<Page, React.ReactNode> = {
    dashboard: <DashboardPage />,
    profile: <ProfilePage />,
    subjects: <SubjectsPage />,
    tests: <TestsPage />,
    exams: <ExamsPage />,
    analytics: <AnalyticsPage />,
    'grade-progress': <GradeProgressPage />,
    university: <UniversityPage />,
    review: <ReviewPage />,
    plan: <PlanPage />,
    gamification: <GamificationPage />,
    'ai-coach': <AiCoachPage />,
    settings: <SettingsPage />,
  }

  const displayName =
    profile?.firstName || profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`.trim()
      : 'İsimsiz Öğrenci'

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <aside
        className="w-60 flex flex-col p-4 overflow-y-auto"
        style={{ backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}
      >
        <h1 className="text-lg font-semibold mb-1 px-2">AkademiX Pro X</h1>
        <button
          onClick={() => setPage('profile')}
          className="text-left px-2 mb-4 text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          {displayName} · {activePeriod?.gradeName ?? '-'}
        </button>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: page === item.key ? 'var(--accent)' : 'transparent',
                color: page === item.key ? 'white' : 'var(--text-primary)',
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={toggle}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm mt-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          {isDark ? 'Aydınlık Mod' : 'Karanlık Mod'}
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto">{pages[page]}</main>
    </div>
  )
}

export default App
