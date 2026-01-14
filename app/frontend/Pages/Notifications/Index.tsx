import React from 'react'
import Layout from '@/components/layout/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'
import { Bell, Check, CheckCheck, Info, Trophy, BookOpen } from 'lucide-react'
import { router } from '@inertiajs/react'

interface Notification {
  id: string
  title: string
  message: string
  notification_type: string
  read_at: string | null
  created_at: string
  data: any
}

interface NotificationsIndexProps {
  notifications: Notification[]
}

export default function NotificationsIndex({ notifications }: NotificationsIndexProps) {
  const { t } = useTranslation()

  const handleMarkAsRead = (id: string) => {
    router.post(`/notifications/${id}/mark_as_read`)
  }

  const handleMarkAllAsRead = () => {
    router.post('/notifications/mark_all_as_read')
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'badge_earned':
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 'course_completed':
        return <BookOpen className="w-5 h-5 text-green-500" />
      case 'progress_update':
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Bell className="w-8 h-8 text-primary" />
          {t('notifications.title') || 'Notifikasi'}
        </h1>
        <div className="flex gap-2">
          {notifications.some((n) => !n.read_at) && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} className="gap-2">
              <CheckCheck className="w-4 h-4" />
              {t('notifications.mark_all_read') || 'Tandai Semua Dibaca'}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-colors ${notification.read_at ? 'bg-white opacity-80' : 'bg-blue-50 border-blue-200'}`}
            >
              <CardContent className="p-4 flex gap-4 items-start">
                <div
                  className={`mt-1 p-2 rounded-full ${notification.read_at ? 'bg-gray-100' : 'bg-white shadow-sm'}`}
                >
                  {getIcon(notification.notification_type)}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3
                      className={`font-bold ${notification.read_at ? 'text-gray-700' : 'text-gray-900'}`}
                    >
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                </div>
                {!notification.read_at && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                    onClick={() => handleMarkAsRead(notification.id)}
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada notifikasi baru.</p>
          </div>
        )}
      </div>
    </div>
  )
}

NotificationsIndex.layout = (page: React.ReactNode) => <Layout children={page} />
