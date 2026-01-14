import React from 'react'
import { Link, router } from '@inertiajs/react'
import StudentLayout from '@/Layouts/StudentLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'
import { Calendar, Clock, Users, Video, ArrowLeft, MapPin } from 'lucide-react'

interface ScheduledClassShowProps {
  scheduledClass: any
  isRegistered: boolean
}

export default function Show({ scheduledClass, isRegistered }: ScheduledClassShowProps) {
  const { t } = useTranslation()

  const handleRegister = () => {
    router.post(`/student/scheduled_classes/${scheduledClass.id}/register`)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        href="/student/scheduled_classes"
        className="flex items-center gap-2 text-gray-500 hover:text-kodibot-orange transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('common.back_to_calendar', { defaultValue: 'Back to Calendar' })}
      </Link>

      {/* Main Content */}
      <Card className="rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-kodibot-orange to-kodibot-yellow p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            {scheduledClass.title || scheduledClass.course?.title}
          </h1>
          <p className="text-white/80">{scheduledClass.description}</p>
        </div>

        <CardContent className="p-8 space-y-6">
          {/* Class Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-kodibot-orange/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-kodibot-orange" />
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
                <div className="w-10 h-10 rounded-xl bg-kodibot-orange/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-kodibot-orange" />
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
                <div className="w-10 h-10 rounded-xl bg-kodibot-orange/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-kodibot-orange" />
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
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-kodibot-orange to-kodibot-yellow flex items-center justify-center text-white font-bold">
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

          {/* Status & Actions */}
          <div className="pt-6 border-t border-gray-100">
            {scheduledClass.in_progress && (
              <div className="mb-4 p-4 bg-kodibot-green/10 rounded-xl flex items-center gap-3">
                <span className="w-3 h-3 bg-kodibot-green rounded-full animate-pulse" />
                <span className="font-bold text-kodibot-green">
                  {t('calendar.class_in_progress', { defaultValue: 'Class is in progress!' })}
                </span>
              </div>
            )}

            {isRegistered ? (
              <div className="space-y-4">
                <div className="p-4 bg-kodibot-green/10 rounded-xl text-center">
                  <p className="font-bold text-kodibot-green">
                    ✓{' '}
                    {t('calendar.registered', {
                      defaultValue: "You're registered for this class!",
                    })}
                  </p>
                </div>
                {scheduledClass.meeting_url && (
                  <Button
                    asChild
                    className="w-full bg-kodibot-orange hover:bg-kodibot-orange/90 rounded-xl font-bold text-lg py-6"
                  >
                    <a href={scheduledClass.meeting_url} target="_blank" rel="noopener noreferrer">
                      <Video className="w-5 h-5 mr-2" />
                      {t('calendar.join_class', { defaultValue: 'Join Class' })}
                    </a>
                  </Button>
                )}
              </div>
            ) : scheduledClass.upcoming ? (
              <Button
                onClick={handleRegister}
                className="w-full bg-kodibot-orange hover:bg-kodibot-orange/90 rounded-xl font-bold text-lg py-6 shadow-lg hover:scale-105 transition-transform"
              >
                {t('calendar.register_now', { defaultValue: 'Register Now' })}
              </Button>
            ) : (
              <div className="p-4 bg-gray-100 rounded-xl text-center">
                <p className="text-gray-500">
                  {t('calendar.registration_closed', {
                    defaultValue: 'Registration is closed for this class.',
                  })}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

Show.layout = (page: React.ReactNode) => <StudentLayout children={page} />
