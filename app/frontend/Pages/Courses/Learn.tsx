import React, { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import confetti from 'canvas-confetti'
import { Button } from '@/components/ui/button'
import { CheckCircle, PlayCircle, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface LearnProps {
  course: any
  modules: any[]
  currentLesson: any
}

export default function Learn({ course, modules, currentLesson }: LearnProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLessonSelect = (lessonId: string) => {
    router.visit(`/courses/${course.id}/learn?lesson_id=${lessonId}`)
  }

  const handleComplete = () => {
    if (!currentLesson) return
    router.post(
      `/courses/${course.id}/course_modules/${currentLesson.module_id}/lessons/${currentLesson.id}/complete`,
      {},
      {
        onSuccess: () => {
          // Trigger confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#E18914', '#1D8536', '#F9DB2B'], // Kodibot colors
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
            <div className="px-4 py-2 bg-gray-100 font-bold text-sm text-gray-700 uppercase tracking-wider">
              Module {index + 1}: {mod.title}
            </div>
            <div>
              {mod.lessons.map((les: any) => (
                <button
                  key={les.id}
                  onClick={() => handleLessonSelect(les.id)}
                  className={cn(
                    'w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50',
                    les.isCurrent ? 'bg-blue-50 border-l-4 border-l-blue-500' : '',
                    les.isCompleted ? 'text-gray-500' : 'text-gray-900'
                  )}
                >
                  {les.isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  ) : les.isCurrent ? (
                    <PlayCircle className="w-5 h-5 text-blue-500 shrink-0" />
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
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b flex items-center px-4 justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          {/* Mobile Sidebar Trigger */}
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

          <Link href="/dashboard" className="font-bold text-xl text-primary font-heading">
            Kodilearn
          </Link>
          <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block" />
          <span className="font-medium text-gray-600 hidden md:block">{course.title}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress Bar could go here */}
          <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900">
            Exit
          </Link>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="w-80 bg-white border-r hidden lg:block overflow-hidden flex-shrink-0">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {currentLesson ? (
              <div className="space-y-6">
                {/* Video Player Placeholder */}
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative group">
                  {currentLesson.video_url ? (
                    <iframe
                      src={currentLesson.video_url} // Needs embed logic typically
                      className="w-full h-full"
                      allowFullScreen
                      title={currentLesson.title}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="text-center">
                        <PlayCircle className="w-16 h-16 mx-auto opacity-50 mb-4" />
                        <p>No video content provided.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="prose max-w-none">
                  <h1 className="text-3xl font-bold text-gray-900">{currentLesson.title}</h1>
                  <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <p>{currentLesson.content}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-8">
                  <Button variant="outline">Previous Lesson</Button>
                  <Button
                    onClick={handleComplete}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-8"
                  >
                    Complete & Continue
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-700">
                  Course Completed! (Or No Lessons)
                </h2>
                <p className="text-gray-500 mt-2">
                  Select a lesson to review or return to dashboard.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
