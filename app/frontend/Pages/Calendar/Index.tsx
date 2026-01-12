import React, { useState } from 'react'
import Layout from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'
import { Calendar as CalendarIcon, Clock, Users, Video, ChevronLeft, ChevronRight } from 'lucide-react'
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

export default function CalendarIndex({ events, availableClasses, currentMonth }: CalendarIndexProps) {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Parse currentMonth (YYYY-MM)
  const [year, month] = currentMonth.split('-').map(Number)
  const monthDate = new Date(year, month - 1, 1)

  const navigateMonth = (direction: number) => {
    const newDate = new Date(year, month - 1 + direction, 1)
    router.get('/scheduled_classes', {
      start_date: newDate.toISOString().split('T')[0],
      end_date: new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).toISOString().split('T')[0]
    }, { preserveState: true })
  }

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = new Date(event.start).toDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(event)
    return acc
  }, {} as Record<string, CalendarEvent[]>)

  // Generate calendar grid
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
      case 'registered': return 'bg-green-500'
      case 'teaching': return 'bg-blue-500'
      case 'available': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-primary" />
          Kalender Kelas
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <CardTitle className="text-xl">
                  {monthDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                  <div key={day} className="text-center text-xs font-bold text-gray-500 py-2">{day}</div>
                ))}
              </div>

              {/* Calendar days */}
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
                      className={`h-20 p-1 border rounded-lg cursor-pointer transition-colors
                        ${isToday ? 'border-primary bg-primary/5' : 'border-gray-100'}
                        ${isSelected ? 'ring-2 ring-primary' : ''}
                        hover:bg-gray-50`}
                    >
                      <div className={`text-sm font-bold ${isToday ? 'text-primary' : 'text-gray-700'}`}>
                        {date.getDate()}
                      </div>
                      <div className="flex flex-wrap gap-0.5 mt-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div key={event.id} className={`w-2 h-2 rounded-full ${getEventBadgeColor(event.event_type)}`} title={event.title} />
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

        {/* Sidebar - Selected Date Events / Upcoming */}
        <div className="space-y-6">
          {selectedDate && eventsByDate[selectedDate.toDateString()] ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {eventsByDate[selectedDate.toDateString()].map(event => (
                  <Link key={event.id} href={`/scheduled_classes/${event.id}`} className="block p-3 rounded-xl border hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${getEventBadgeColor(event.event_type)}`} />
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-900">{event.title}</h4>
                        <p className="text-xs text-gray-500">{event.course_title}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(event.start).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {event.in_progress && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">LIVE</span>
                      )}
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kelas Tersedia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableClasses.length > 0 ? availableClasses.map(cls => (
                  <Link key={cls.id} href={`/scheduled_classes/${cls.id}`} className="block p-3 rounded-xl border hover:bg-gray-50 transition-colors">
                    <h4 className="font-bold text-gray-900">{cls.title}</h4>
                    <p className="text-xs text-gray-500">{cls.course_title}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> {new Date(cls.start).toLocaleDateString('id-ID')}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(cls.start).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                      {cls.spots_remaining !== null && (
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {cls.spots_remaining} spots</span>
                      )}
                    </div>
                  </Link>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-4">Tidak ada kelas baru saat ini.</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-bold text-sm mb-3">Legend</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /> Terdaftar</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /> Mengajar</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500" /> Tersedia</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

CalendarIndex.layout = (page: React.ReactNode) => <Layout children={page} />
