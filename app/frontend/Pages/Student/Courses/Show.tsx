import React from 'react'
import { Link, router } from '@inertiajs/react'
import StudentLayout from '@/Layouts/StudentLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { Clock, BookOpen, Users, Trophy, Loader2 } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { Course } from '@/types'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useState } from 'react'
import { Progress } from '@/components/ui/progress'

interface CourseShowProps {
  course: Course
  modules: any[]
  isEnrolled: boolean
  progressPercentage: number
}

export default function Show({ course, modules, isEnrolled, progressPercentage }: CourseShowProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const handleEnroll = () => {
    setIsLoading(true)
    router.post(`/student/courses/${course.id}/enroll`, {}, {
      onFinish: () => setIsLoading(false)
    })
  }

  const handleContinue = () => {
    setIsLoading(true)
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-orange-500 via-kodibot-orange to-yellow-500 p-8 md:p-12 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-xl text-xs font-bold uppercase tracking-wider">
                {course.subject === 'coding' ? t('courses.coding') : t('courses.robotics')}
              </span>
              <span className="px-3 py-1 bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-900/20 rounded-xl text-xs font-bold uppercase tracking-wider">
                {course.level === 'beginner' ? t('courses.beginner') :
                  course.level === 'intermediate' ? t('courses.intermediate') :
                    t('courses.advanced')}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
              {course.title}
            </h1>

            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl font-medium">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-6 text-sm font-bold text-white/80 pt-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-full"><Clock className="w-4 h-4" /></div>
                <span>
                  {course.total_duration_minutes
                    ? Math.round(course.total_duration_minutes / 60)
                    : 0}{' '}
                  Hours
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-full"><BookOpen className="w-4 h-4" /></div>
                <span>{course.total_lessons || 0} Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-full"><Users className="w-4 h-4" /></div>
                <span>120 Students</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* Modules List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-orange-100 text-kodibot-orange flex items-center justify-center text-xl shadow-sm border border-orange-200">
                📚
              </span>
              {t('courses.curriculum', { defaultValue: 'Course Curriculum' })}
            </h3>
            <div className="space-y-4">
              {modules && modules.length > 0 ? (
                modules.map((mod: any, index: number) => (
                  <Card
                    key={mod.id}
                    className="border-0 shadow-sm border-l-4 border-l-kodibot-orange overflow-hidden hover:shadow-lg hover:translate-x-1 transition-all duration-300 rounded-2xl bg-white group"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-lg text-gray-800 group-hover:text-kodibot-orange transition-colors">
                          <span className="text-gray-400 mr-2">#{index + 1}</span> {mod.title}
                        </h4>
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold uppercase tracking-widest">
                          {mod.lessons?.length || 0} LESSONS
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm pl-8">{mod.description}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="p-12 text-center bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl grayscale opacity-50">📂</div>
                  <p className="text-gray-500 font-medium">No content available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sticky top-24 space-y-6">
          <Card className="overflow-hidden shadow-xl shadow-orange-100/50 border-0 rounded-[2rem] bg-white ring-1 ring-gray-100">
            <div className="relative h-56 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-kodibot-orange to-kodibot-yellow flex items-center justify-center text-white text-4xl font-black">
                  {course.title?.charAt(0) || 'C'}
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="inline-block px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/30">
                  OFFICIAL COURSE
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-center mb-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-3xl font-black text-gray-900">
                  {course.enrollment_type === 'paid' ? '$49.99' : 'Free'}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider border border-emerald-100">Lifetime Access</span>
              </div>


              {isEnrolled ? (
                <>
                  {/* Progress Bar */}
                  <div className="mb-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm text-gray-700">{t('courses.your_progress', { defaultValue: 'Your Progress' })}</span>
                      <span className="font-bold text-emerald-600">{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-3 rounded-full bg-gray-100" />
                  </div>

                  <Button
                    className="w-full text-lg h-14 font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-600 hover:to-emerald-400 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 rounded-2xl transition-all hover:scale-[1.02]"
                    asChild
                    onClick={handleContinue}
                  >
                    <Link href={`/student/courses/${course.id}/learn`}>
                      {t('courses.continue_learning', { defaultValue: 'Continue Learning' })}
                    </Link>
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleEnroll}
                  disabled={isLoading}
                  className="w-full text-lg h-14 shadow-lg shadow-orange-200 font-bold hover:scale-[1.02] transition-all bg-gradient-to-r from-orange-500 via-kodibot-orange to-yellow-500 text-white rounded-2xl disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : null}
                  {t('courses.enroll_now', { defaultValue: 'Enroll Now' })}
                </Button>
              )}

              <div className="pt-6 border-t border-gray-100 space-y-4">
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-2">Course Details</h4>
                <div className="flex justify-between items-center text-sm p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="p-2 bg-orange-50 text-orange-500 rounded-lg"><Trophy className="w-4 h-4" /></div>
                    <span className="font-medium">Difficulty</span>
                  </div>
                  <span className="font-bold capitalize text-gray-800">
                    {course.level}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><Clock className="w-4 h-4" /></div>
                    <span className="font-medium">Duration</span>
                  </div>
                  <span className="font-bold text-gray-800">
                    {course.total_duration_minutes
                      ? Math.round(course.total_duration_minutes / 60)
                      : 0}{' '}
                    Hours
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="p-2 bg-purple-50 text-purple-500 rounded-lg"><BookOpen className="w-4 h-4" /></div>
                    <span className="font-medium">Total Lessons</span>
                  </div>
                  <span className="font-bold text-gray-800">{course.total_lessons || 0} Lessons</span>
                </div>
              </div>

              {/* Instructor Mini Profile */}
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-500">
                    {course.instructor.name.charAt(0) || 'I'}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Instructor</p>
                    <p className="font-bold text-gray-900 line-clamp-1">{course.instructor.name}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Loading Modal */}
      <Dialog open={isLoading} onOpenChange={setIsLoading}>
        <DialogContent className="sm:max-w-[425px] flex flex-col items-center justify-center py-10 gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-kodibot-orange/20 blur-xl rounded-full animate-pulse"></div>
            <Loader2 className="w-12 h-12 text-kodibot-orange animate-spin relative z-10" />
          </div>
          <p className="text-lg font-bold text-gray-700 animate-pulse">{t('common.loading', { defaultValue: 'Memuat...' })}</p>
        </DialogContent>
      </Dialog>
    </div>
  )
}

Show.layout = (page: React.ReactNode) => <StudentLayout children={page} />
