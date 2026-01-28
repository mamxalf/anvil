import React, { useState, lazy, Suspense } from 'react'
import { Link, router } from '@inertiajs/react'
import confetti from 'canvas-confetti'
import StudentLayout from '@/Layouts/StudentLayout'
import { Button } from '@/components/ui/button'
import {
  CheckCircle,
  PlayCircle,
  Menu,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Trophy,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'
import { Course } from '@/types'
import QuizPlayer from '@/components/Quiz/QuizPlayer'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Lazy load LessonMaze component for better performance (maze activity)
const LessonMaze = lazy(() => import('@/components/MazeGame/LessonMaze'))

interface LearnProps {
  course: Course
  modules: any[]
  currentLesson: any
}

export default function Learn({ course, modules, currentLesson }: LearnProps) {
  const { t } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const isMazeActivity = currentLesson?.activity_type === 'maze'

  // Debug logging
  React.useEffect(() => {
    if (currentLesson) {
      console.log('Current Lesson:', {
        id: currentLesson.id,
        title: currentLesson.title,
        activity_type: currentLesson.activity_type,
        activity_config: currentLesson.activity_config,
        isMazeActivity
      })
    }
  }, [currentLesson, isMazeActivity])

  const handleLessonSelect = (lessonId: string) => {
    if (isLoading) return
    setIsLoading(true)
    router.visit(`/student/courses/${course.id}/learn?lesson_id=${lessonId}`, {
      onFinish: () => setIsLoading(false),
    })
  }

  const handleComplete = () => {
    if (!currentLesson || isLoading) return
    setIsLoading(true)
    router.post(
      `/student/courses/${course.id}/course_modules/${currentLesson.module_id}/lessons/${currentLesson.id}/complete`,
      {},
      {
        onSuccess: () => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#E18914', '#1D8536', '#F9DB2B'],
          })
        },
        onFinish: () => setIsLoading(false),
      }
    )
  }

  // Get next lesson ID from all lessons across modules
  const getNextLessonId = (): string | null => {
    if (!currentLesson) return null
    const allLessons = modules.flatMap((mod: any) => mod.lessons)
    const currentIndex = allLessons.findIndex((l: any) => l.id === currentLesson.id)
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1].id
    }
    return null
  }

  const handleNextLesson = () => {
    const nextId = getNextLessonId()
    if (nextId) {
      handleLessonSelect(nextId)
    }
  }


  const SidebarContent = () => (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-500 via-kodibot-orange to-yellow-500 text-white">
        <h2 className="text-lg font-black leading-tight mb-1">{course.title}</h2>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-300">
          <BookOpen className="w-3 h-3" />
          <span>Course Content</span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {modules.map((mod: any, index: number) => (
          <div key={mod.id} className="space-y-3">
            <div className="px-2 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                {index + 1}
              </span>
              <span className="line-clamp-1">{mod.title}</span>
            </div>
            <div className="space-y-2">
              {mod.lessons.map((les: any) => (
                <button
                  key={les.id}
                  onClick={() => handleLessonSelect(les.id)}
                  className={cn(
                    'w-full text-left flex items-center gap-4 p-4 rounded-[1.5rem] border transition-all duration-200 group relative overflow-hidden',
                    les.isCurrent
                      ? 'bg-gradient-to-r from-orange-500 via-kodibot-orange to-yellow-500 border-transparent shadow-lg shadow-orange-200 scale-[1.02] z-10'
                      : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-gray-600 hover:text-gray-900 shadow-sm'
                  )}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md transition-colors',
                      les.isCurrent
                        ? 'bg-white/20 backdrop-blur-md border border-white/30 text-white'
                        : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-kodibot-orange'
                    )}
                  >
                    {les.isCompleted ? (
                      <CheckCircle
                        className={cn('w-6 h-6', les.isCurrent ? 'text-white' : 'text-emerald-500')}
                      />
                    ) : les.isCurrent ? (
                      <div className="w-8 h-8 rounded-full border-4 border-white bg-transparent animate-pulse" />
                    ) : (
                      <div className="w-8 h-8 rounded-full border-4 border-gray-300 bg-white group-hover:border-kodibot-orange transition-colors" />
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <span
                      className={cn(
                        'text-sm font-bold block line-clamp-1 mb-0.5',
                        les.isCurrent ? 'text-white' : 'text-gray-800'
                      )}
                    >
                      {les.title}
                    </span>
                    <span
                      className={cn(
                        'text-xs font-bold flex items-center gap-1',
                        les.isCurrent ? 'text-yellow-100' : 'text-gray-400'
                      )}
                    >
                      {les.isCompleted ? (
                        <span
                          className={cn(
                            'flex items-center gap-1',
                            les.isCurrent ? 'text-emerald-100' : 'text-emerald-600'
                          )}
                        >
                          {t('common.completed', { defaultValue: 'Completed' })}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          {les.duration_minutes}m
                          {les.isCurrent && (
                            <span className="w-1 h-1 rounded-full bg-white/50 mx-1" />
                          )}
                          {les.isCurrent && 'Playing Now'}
                        </span>
                      )}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center px-4 justify-between shrink-0 z-20 shadow-sm sticky top-0">
        <div className="flex items-center gap-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-orange-50 text-gray-500"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80 border-r-0">
              <SheetTitle className="sr-only">Course Navigation</SheetTitle>
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-3">
            <Link
              href={`/student/courses/${course.id}`}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-orange-100 text-gray-500 hover:text-kodibot-orange transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <Link
                href="/student/dashboard"
                className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 hidden md:block"
              >
                Kodilearn
              </Link>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:block">
                Student Portal
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar - Collapsible */}
        <aside className={cn(
          "bg-white border-r border-gray-100 hidden lg:flex flex-col overflow-hidden flex-shrink-0 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10 transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-96"
        )}>
          <div className="flex-1 overflow-hidden flex flex-col">
            {!sidebarCollapsed && <SidebarContent />}
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-12 flex items-center justify-center border-t border-gray-100 hover:bg-gray-50 transition-colors shrink-0 text-gray-500 hover:text-gray-900"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <div className="flex items-center gap-2 font-medium text-sm">
                <PanelLeftClose className="w-4 h-4" />
                <span>Sembunyikan Sidebar</span>
              </div>
            )}
          </button>
        </aside>

        {/* Main Content */}
        <main className={cn(
          "flex-1 overflow-y-auto bg-gray-50/50",
          isMazeActivity ? "p-0" : "p-4 md:p-8"
        )}>
          <div className={cn(
            "mx-auto space-y-6",
            isMazeActivity ? "max-w-full h-full" : "max-w-5xl"
          )}>
            {currentLesson ? (
              <>
                {isMazeActivity ? (
                  // Maze Activity: Show unified LessonMaze component (3-column layout)
                  <Suspense fallback={<LoadingSpinner message="Memuat maze..." />}>
                    <div className="h-full">
                      <LessonMaze
                        lessonId={currentLesson.id}
                        activityConfig={currentLesson.activity_config}
                        lessonContent={currentLesson.content || ''}
                        videoUrl={currentLesson.video_url}
                        onComplete={(stars: number) => {
                          confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 },
                            colors: ['#E18914', '#1D8536', '#F9DB2B'],
                          })
                          console.log('Maze completed with stars:', stars)
                        }}
                        onNextLesson={getNextLessonId() ? handleNextLesson : undefined}
                      />
                    </div>
                  </Suspense>
                ) : (
                  // Regular Activity: Show video player + content
                  <>
                    {/* Video Player - Only show if video_url exists */}
                    {currentLesson.video_url && (
                      <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-orange-100 ring-1 ring-black/5 bg-black">
                        <div className="aspect-video relative group">
                          <iframe
                            src={currentLesson.video_url}
                            className="w-full h-full"
                            allowFullScreen
                            title={currentLesson.title}
                          />
                        </div>
                      </div>
                    )}

                    {/* Content Card */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12">
                      <div className="flex items-start justify-between gap-4 mb-8 pb-8 border-b border-gray-100">
                        <div>
                          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                            {currentLesson.title}
                          </h1>
                          <p className="text-gray-500 font-medium">Lesson Content & Instructions</p>
                        </div>
                        <div className="hidden sm:block">
                          <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold border border-emerald-100">
                            {currentLesson.xp_reward || 10} XP
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <div
                          className={cn(
                            'prose prose-lg prose-orange max-w-none text-gray-600 transition-all duration-500 ease-in-out',
                            !isExpanded && 'max-h-[300px] overflow-hidden'
                          )}
                        >
                          <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                        </div>

                        {!isExpanded && (
                          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                        )}

                        <div
                          className={cn(
                            'text-center',
                            !isExpanded ? 'mt-4 absolute bottom-0 left-0 w-full z-10' : 'mt-8'
                          )}
                        >
                          <Button
                            onClick={() => setIsExpanded(!isExpanded)}
                            variant="ghost"
                            className="rounded-full bg-white/80 hover:bg-orange-50 text-kodibot-orange font-bold border border-orange-100 shadow-sm backdrop-blur-sm"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronLeft className="w-4 h-4 mr-2 rotate-90" />
                                Read Less
                              </>
                            ) : (
                              <>
                                Read More
                                <ChevronRight className="w-4 h-4 ml-2 rotate-90" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Quiz Section - Only show for non-maze activities */}
                {!isMazeActivity && (
                  <>
                    {currentLesson.quiz && (
                      <div className="mt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                            <HelpCircle className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {t('quiz.title', { defaultValue: 'Quiz' })}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {t('quiz.complete_lesson_first', { defaultValue: 'Test your knowledge' })}
                            </p>
                          </div>
                        </div>
                        <QuizPlayer
                          quiz={currentLesson.quiz}
                          lessonId={currentLesson.id}
                          courseId={course.id}
                        />
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 pb-12">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto rounded-2xl h-14 font-bold border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Previous Lesson
                      </Button>

                      <Button
                        onClick={handleComplete}
                        disabled={isLoading}
                        size="lg"
                        className="w-full sm:w-auto h-14 bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-bold px-8 rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:scale-[1.02] transition-all"
                      >
                        {isLoading
                          ? 'Saving...'
                          : modules[modules.length - 1]?.lessons[
                            modules[modules.length - 1].lessons.length - 1
                          ]?.id === currentLesson.id
                            ? t('courses.done', { defaultValue: 'Done' })
                            : t('courses.complete_continue', { defaultValue: 'Complete & Continue' })}
                        {!isLoading && <ChevronRight className="w-5 h-5 ml-2" />}
                      </Button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <Trophy className="w-12 h-12 text-kodibot-orange" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4">
                  {t('courses.course_completed', { defaultValue: '🎉 Course Completed!' })}
                </h2>
                <p className="text-xl text-gray-500 max-w-md mb-8">
                  {t('courses.course_completed_message', {
                    defaultValue:
                      "Congratulations! You've finished all the lessons in this course. Great job!",
                  })}
                </p>
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-500/20 backdrop-blur-md shadow-xl shadow-emerald-500/10 rounded-2xl font-bold text-lg transition-all hover:scale-105"
                >
                  <Link href="/student/dashboard">
                    {t('courses.back_to_dashboard', { defaultValue: 'Back to Dashboard' })}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

Learn.layout = (page: React.ReactNode) => <StudentLayout children={page} fullWidth={true} />
