import React from 'react'
import { Link } from '@inertiajs/react'
import ParentLayout from '@/Layouts/ParentLayout'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from '@/hooks/useTranslation'
import { Calendar, Clock, Users, Video, ArrowLeft } from 'lucide-react'

interface ScheduledClassShowProps {
  scheduledClass: any
}

export default function Show({ scheduledClass }: ScheduledClassShowProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Link
        href="/parent/scheduled_classes"
        className="flex items-center gap-2 text-gray-500 hover:text-kodibot-green transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('common.back_to_calendar', { defaultValue: 'Back to Calendar' })}
      </Link>

      <Card className="rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-kodibot-green to-emerald-500 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            {scheduledClass.title || scheduledClass.course?.title}
          </h1>
          <p className="text-white/80">{scheduledClass.description}</p>
        </div>

        <CardContent className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-kodibot-green/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-kodibot-green" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {t('calendar.date', { defaultValue: 'Date' })}
                  </p>
                  <p className="font-bold">
                    {new Date(scheduledClass.start_time).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-kodibot-green/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-kodibot-green" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {t('calendar.time', { defaultValue: 'Time' })}
                  </p>
                  <p className="font-bold">
                    {new Date(scheduledClass.start_time).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -
                    {new Date(scheduledClass.end_time).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-kodibot-green/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-kodibot-green" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {t('calendar.spots', { defaultValue: 'Available Spots' })}
                  </p>
                  <p className="font-bold">
                    {scheduledClass.spots_remaining}{' '}
                    {t('calendar.spots_left', { defaultValue: 'spots left' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {scheduledClass.instructor_profile && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-kodibot-green to-emerald-500 flex items-center justify-center text-white font-bold">
                    {scheduledClass.instructor_profile.user?.name?.charAt(0) || 'T'}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {t('calendar.instructor', { defaultValue: 'Instructor' })}
                    </p>
                    <p className="font-bold">{scheduledClass.instructor_profile.user?.name}</p>
                  </div>
                </div>
              )}

              {scheduledClass.meeting_url && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Video className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {t('calendar.meeting', { defaultValue: 'Meeting' })}
                    </p>
                    <p className="font-bold text-blue-600">Online Class</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

Show.layout = (page: React.ReactNode) => <ParentLayout children={page} />
