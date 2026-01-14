import React from 'react'
import { Link } from '@inertiajs/react'
import ParentLayout from '@/Layouts/ParentLayout'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Video, ArrowLeft } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface CurriculumProps {
  course: any
  modules: any[]
}

export default function Curriculum({ course, modules }: CurriculumProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Link href={`/parent/courses/${course.id}`} className="flex items-center gap-1 hover:text-kodibot-green transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t('common.back', { defaultValue: 'Back to Course' })}
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-kodibot-green" />
            {t('courses.curriculum', { defaultValue: 'Curriculum' })}
          </h1>
          <p className="text-gray-500">{course.title}</p>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-6">
        {modules.length === 0 && (
          <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-200">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No modules available yet.</p>
          </div>
        )}

        {modules.map((mod: any, index: number) => (
          <Card key={mod.id} className="border border-gray-200 rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-kodibot-green/10 to-emerald-100 p-4 flex justify-between items-center border-b">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-kodibot-green text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="font-bold text-gray-900 text-lg">{mod.title}</span>
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {mod.lessons?.length || 0} {t('courses.lessons', { defaultValue: 'Lessons' })}
                </span>
              </div>

              <div className="divide-y divide-gray-50">
                {mod.lessons && mod.lessons.map((lesson: any, lIndex: number) => (
                  <div key={lesson.id} className="flex items-center gap-4 p-4 hover:bg-green-50/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <Video className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-900">{lIndex + 1}. {lesson.title}</span>
                      {lesson.duration_minutes && (
                        <span className="text-xs text-gray-400 ml-2">{lesson.duration_minutes} min</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

Curriculum.layout = (page: React.ReactNode) => <ParentLayout children={page} />
