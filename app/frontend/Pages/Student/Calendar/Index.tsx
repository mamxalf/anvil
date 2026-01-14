import React, { useState } from 'react'
import StudentLayout from '@/Layouts/StudentLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'
import { Calendar as CalendarIcon, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, router } from '@inertiajs/react'

interface CalendarEvent {
  id: string
  title: string
  description: string
  start: string
  end: string
  course_title: string
  instructor_name: string
  meeting_url?: string
  event_type: 'registered' | 'teaching' | 'available'
  in_progress: boolean
  spots_remaining: number | null
}

interface CalendarIndexProps {
  events: CalendarEvent[]
  availableClasses: CalendarEvent[]
  currentMonth: string
}

export default function Index({ events, availableClasses, currentMonth }: CalendarIndexProps) {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const [year, month] = currentMonth.split('-').map(Number)
  const monthDate = new Date(year, month - 1, 1)

  const navigateMonth = (direction: number) => {
    const newDate = new Date(year, month - 1 + direction, 1)
    router.get(
      '/student/scheduled_classes',
      {
        start_date: newDate.toISOString().split('T')[0],
        end_date: new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0)
          .toISOString()
          .split('T')[0],
      },
      { preserveState: true }
    )
  }

  const eventsByDate = events.reduce(
    (acc, event) => {
      const date = new Date(event.start).toDateString()
      if (!acc[date]) acc[date] = []
      acc[date].push(event)
      return acc
    },
    {} as Record<string, CalendarEvent[]>
  )

  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay()
  const calendarDays = []

  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month - 1, day))
  }

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'registered':
        return 'bg-kodibot-green'
      case 'teaching':
        return 'bg-blue-500'
      case 'available':
        return 'bg-kodibot-yellow'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-kodibot-orange" />
          {t('calendar.title', { defaultValue: 'Class Calendar' })}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth(-1)}
                  className="rounded-xl"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <CardTitle className="text-xl">
                  {monthDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth(1)}
                  className="rounded-xl"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                  <div key={day} className="text-center text-xs font-bold text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, idx) => {
                  if (!date) return <div key={idx} className="h-20" />

                  const dateStr = date.toDateString()
                  const dayEvents = eventsByDate[dateStr] || []
                  const isToday = date.toDateString() === new Date().toDateString()
                  const isSelected = selectedDate?.toDateString() === dateStr

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      className={`h-20 p-1 border rounded-xl cursor-pointer transition-colors
                        ${isToday ? 'border-kodibot-orange bg-kodibot-orange/5' : 'border-gray-100'}
                        ${isSelected ? 'ring-2 ring-kodibot-orange' : ''}
                        hover:bg-orange-50`}
                    >
                      <div
                        className={`text-sm font-bold ${isToday ? 'text-kodibot-orange' : 'text-gray-700'}`}
                      >
                        {date.getDate()}
                      </div>
                      <div className="flex flex-wrap gap-0.5 mt-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className={`w-2 h-2 rounded-full ${getEventBadgeColor(event.event_type)}`}
                            title={event.title}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-xs text-gray-400">+{dayEvents.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {selectedDate && eventsByDate[selectedDate.toDateString()] ? (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedDate.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {eventsByDate[selectedDate.toDateString()].map((event) => (
                  <Link
                    key={event.id}
                    href={`/student/scheduled_classes/${event.id}`}
                    className="block p-3 rounded-xl border hover:bg-orange-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-3 h-3 rounded-full mt-1.5 ${getEventBadgeColor(event.event_type)}`}
                      />
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-900">{event.title}</h4>
                        <p className="text-xs text-gray-500">{event.course_title}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(event.start).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      {event.in_progress && (
                        <span className="px-2 py-0.5 bg-kodibot-green/10 text-kodibot-green text-xs font-bold rounded-full">
                          LIVE
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">
                  {t('calendar.available_classes', { defaultValue: 'Available Classes' })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableClasses.length > 0 ? (
                  availableClasses.map((cls) => (
                    <Link
                      key={cls.id}
                      href={`/student/scheduled_classes/${cls.id}`}
                      className="block p-3 rounded-xl border hover:bg-orange-50 transition-colors"
                    >
                      <h4 className="font-bold text-gray-900">{cls.title}</h4>
                      <p className="text-xs text-gray-500">{cls.course_title}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />{' '}
                          {new Date(cls.start).toLocaleDateString('id-ID')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />{' '}
                          {new Date(cls.start).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {cls.spots_remaining !== null && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> {cls.spots_remaining} spots
                          </span>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    {t('calendar.no_classes', { defaultValue: 'No new classes available.' })}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <h4 className="font-bold text-sm mb-3">Legend</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-kodibot-green" /> Registered
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" /> Teaching
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-kodibot-yellow" /> Available
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

Index.layout = (page: React.ReactNode) => <StudentLayout children={page} />
