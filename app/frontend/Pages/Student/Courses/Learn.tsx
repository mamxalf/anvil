import React, { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import confetti from 'canvas-confetti'
import StudentLayout from '@/Layouts/StudentLayout'
import { Button } from '@/components/ui/button'
import { CheckCircle, PlayCircle, Menu, ArrowLeft } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'

interface LearnProps {
  course: any
  modules: any[]
  currentLesson: any
}

export default function Learn({ course, modules, currentLesson }: LearnProps) {
  const { t } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLessonSelect = (lessonId: string) => {
    router.visit(`/student/courses/${course.id}/learn?lesson_id=${lessonId}`)
  }

  const handleComplete = () => {
    if (!currentLesson) return
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
      }
    )
  }

  const SidebarContent = () => (
    <div className="h-full overflow-y-auto py-4">
      <h2 className="px-4 text-lg font-bold mb-4">{course.title}</h2>
      <div className="space-y-4">
        {modules.map((mod: any, index: number) => (
          <div key={mod.id}>
            <div className="px-4 py-2 bg-kodibot-orange/10 font-bold text-sm text-kodibot-orange uppercase tracking-wider">
              Module {index + 1}: {mod.title}
            </div>
            <div>
              {mod.lessons.map((les: any) => (
                <button
                  key={les.id}
                  onClick={() => handleLessonSelect(les.id)}
                  className={cn(
                    'w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-orange-50 transition-colors border-b border-gray-50',
                    les.isCurrent ? 'bg-kodibot-orange/10 border-l-4 border-l-kodibot-orange' : '',
                    les.isCompleted ? 'text-gray-500' : 'text-gray-900'
                  )}
                >
                  {les.isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-kodibot-green shrink-0" />
                  ) : les.isCurrent ? (
                    <PlayCircle className="w-5 h-5 text-kodibot-orange shrink-0" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full shrink-0" />
                  )}
                  <span className="text-sm font-medium line-clamp-1">{les.title}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col -m-4 sm:-m-6 lg:-m-8">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b flex items-center px-4 justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <Link
            href="/student/dashboard"
            className="font-bold text-xl text-kodibot-orange font-heading"
          >
            Kodilearn
          </Link>
          <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block" />
          <span className="font-medium text-gray-600 hidden md:block">{course.title}</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/student/courses"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-kodibot-orange transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('common.back', { defaultValue: 'Back' })}
          </Link>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="w-80 bg-white border-r hidden lg:block overflow-hidden flex-shrink-0">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-orange-50/30 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {currentLesson ? (
              <div className="space-y-6">
                {/* Video Player */}
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg relative group">
                  {currentLesson.video_url ? (
                    <iframe
                      src={currentLesson.video_url}
                      className="w-full h-full"
                      allowFullScreen
                      title={currentLesson.title}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white bg-gradient-to-br from-kodibot-orange to-kodibot-yellow">
                      <div className="text-center">
                        <PlayCircle className="w-16 h-16 mx-auto opacity-80 mb-4" />
                        <p className="font-bold">No video content provided.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="prose max-w-none">
                  <h1 className="text-3xl font-bold text-gray-900">{currentLesson.title}</h1>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <p>{currentLesson.content}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-8">
                  <Button variant="outline" className="rounded-xl font-bold">
                    Previous Lesson
                  </Button>
                  <Button
                    onClick={handleComplete}
                    size="lg"
                    className="bg-kodibot-green hover:bg-kodibot-green/90 text-white font-bold px-8 rounded-xl shadow-lg"
                  >
                    {t('courses.complete_continue', { defaultValue: 'Complete & Continue' })} 🎉
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-700">🎉 Course Completed!</h2>
                <p className="text-gray-500 mt-2">
                  Select a lesson to review or return to dashboard.
                </p>
                <Button
                  asChild
                  className="mt-6 bg-kodibot-orange hover:bg-kodibot-orange/90 rounded-xl"
                >
                  <Link href="/student/dashboard">Back to Dashboard</Link>
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

Learn.layout = (page: React.ReactNode) => <StudentLayout children={page} />
