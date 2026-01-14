import React from 'react'
import { Link, router } from '@inertiajs/react'
import StudentLayout from '@/Layouts/StudentLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'

interface CourseShowProps {
  course: any
  modules: any[]
  isEnrolled: boolean
  canEdit: boolean
}

export default function Show({ course, modules, isEnrolled, canEdit }: CourseShowProps) {
  const { t } = useTranslation()

  const handleEnroll = () => {
    router.post(`/student/courses/${course.id}/enroll`)
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex gap-2 mb-4">
              <span className="px-3 py-1 bg-kodibot-orange/10 text-kodibot-orange rounded-full text-sm font-bold uppercase tracking-wider">
                {course.subject}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-bold uppercase tracking-wider">
                {course.level}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              {course.title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">{course.description}</p>
          </div>

          {/* Modules List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-kodibot-orange text-white flex items-center justify-center text-sm">
                📚
              </span>
              {t('courses.curriculum', { defaultValue: 'Course Curriculum' })}
            </h3>
            <div className="space-y-4">
              {modules && modules.length > 0 ? (
                modules.map((mod: any, index: number) => (
                  <Card
                    key={mod.id}
                    className="border-l-4 border-l-kodibot-orange overflow-hidden hover:shadow-md transition-shadow rounded-2xl"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-lg text-gray-800">
                          Module {index + 1}: {mod.title}
                        </h4>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          {mod.lessons?.length || 0} LESSONS
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">{mod.description}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500">No content available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sticky top-8 space-y-6">
          <Card className="overflow-hidden shadow-lg border-none rounded-2xl">
            {course.thumbnail ? (
              <img src={course.thumbnail} alt={course.title} className="w-full h-56 object-cover" />
            ) : (
              <div className="w-full h-56 bg-gradient-to-br from-kodibot-orange to-kodibot-yellow flex items-center justify-center text-white text-2xl font-bold">
                {course.title?.charAt(0) || 'C'}
              </div>
            )}
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-3xl font-extrabold text-gray-900">
                  {course.enrollment_type === 'paid' ? '$49.99' : 'Free'}
                </span>
                <span className="text-sm text-gray-500 font-medium">Lifetime Access</span>
              </div>

              {isEnrolled ? (
                <Button
                  className="w-full text-lg py-6 font-bold bg-kodibot-green hover:bg-kodibot-green/90 rounded-xl"
                  asChild
                >
                  <Link href={`/student/courses/${course.id}/learn`}>
                    {t('courses.continue_learning', { defaultValue: 'Continue Learning' })}
                  </Link>
                </Button>
              ) : (
                <Button
                  onClick={handleEnroll}
                  className="w-full text-lg py-6 shadow-xl shadow-kodibot-orange/20 font-bold hover:scale-105 transition-transform bg-kodibot-orange hover:bg-kodibot-orange/90 rounded-xl"
                >
                  {t('courses.enroll_now', { defaultValue: 'Enroll Now' })}
                </Button>
              )}

              <div className="pt-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Difficulty</span>
                  <span className="font-bold capitalize bg-gray-100 px-2 py-1 rounded">
                    {course.level}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Duration</span>
                  <span className="font-bold">
                    {course.total_duration_minutes
                      ? Math.round(course.total_duration_minutes / 60)
                      : 0}{' '}
                    Hours
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Total Lessons</span>
                  <span className="font-bold">{course.total_lessons || 0} Lessons</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

Show.layout = (page: React.ReactNode) => <StudentLayout children={page} />
