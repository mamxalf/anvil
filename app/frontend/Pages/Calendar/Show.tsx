import React from 'react'
import Layout from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'
import { Calendar, Clock, Users, Video, User, ArrowLeft } from 'lucide-react'
import { Link, router } from '@inertiajs/react'

interface ScheduledClassDetails {
  id: string
  title: string
  description: string
  scheduled_at: string
  duration_minutes: number
  meeting_url?: string
  max_participants?: number
  spots_remaining: number | null
  'in_progress?': boolean
  'upcoming?': boolean
  course: {
    id: string
    title: string
    slug: string
  }
  instructor_profile: {
    user: {
      name: string
      avatar?: string
    }
  }
}

interface CalendarShowProps {
  scheduledClass: ScheduledClassDetails
  isRegistered: boolean
}

export default function CalendarShow({ scheduledClass, isRegistered }: CalendarShowProps) {
  const { t } = useTranslation()

  const handleRegister = () => {
    router.post(`/scheduled_classes/${scheduledClass.id}/register`)
  }

  const startTime = new Date(scheduledClass.scheduled_at)
  const endTime = new Date(startTime.getTime() + scheduledClass.duration_minutes * 60000)

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link href="/scheduled_classes" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Kalender
      </Link>

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-orange-400 p-6 text-white">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            <Link href={`/courses/${scheduledClass.course.slug}`} className="hover:underline">
              {scheduledClass.course.title}
            </Link>
          </div>
          <h1 className="text-2xl font-bold">{scheduledClass.title}</h1>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Time & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Calendar className="w-6 h-6 text-primary" />
              <div>
                <div className="text-xs text-gray-500">Tanggal</div>
                <div className="font-bold">{startTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <div className="text-xs text-gray-500">Waktu</div>
                <div className="font-bold">
                  {startTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
              {scheduledClass.instructor_profile.user.name.charAt(0)}
            </div>
            <div>
              <div className="text-xs text-gray-500">Instruktur</div>
              <div className="font-bold">{scheduledClass.instructor_profile.user.name}</div>
            </div>
          </div>

          {/* Description */}
          {scheduledClass.description && (
            <div>
              <h3 className="font-bold text-gray-700 mb-2">Deskripsi</h3>
              <p className="text-gray-600">{scheduledClass.description}</p>
            </div>
          )}

          {/* Spots */}
          {scheduledClass.max_participants && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>{scheduledClass.spots_remaining} dari {scheduledClass.max_participants} tempat tersisa</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            {scheduledClass['in_progress?'] && scheduledClass.meeting_url && (
              <a href={scheduledClass.meeting_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full gap-2 bg-green-500 hover:bg-green-600">
                  <Video className="w-4 h-4" />
                  Gabung Sekarang (LIVE)
                </Button>
              </a>
            )}

            {!isRegistered && scheduledClass['upcoming?'] && (
              <Button onClick={handleRegister} className="flex-1">
                Daftar Kelas Ini
              </Button>
            )}

            {isRegistered && !scheduledClass['in_progress?'] && (
              <div className="flex-1 text-center py-3 bg-green-50 text-green-700 font-bold rounded-xl border border-green-200">
                ✓ Anda Terdaftar
              </div>
            )}

            {!scheduledClass['upcoming?'] && !scheduledClass['in_progress?'] && (
              <div className="flex-1 text-center py-3 bg-gray-100 text-gray-500 font-bold rounded-xl">
                Kelas Sudah Selesai
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

CalendarShow.layout = (page: React.ReactNode) => <Layout children={page} />
