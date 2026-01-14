import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { PageProps } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ParentLayout from '@/Layouts/ParentLayout'
import { UserPlus, Activity, Clock, Shield, TrendingUp } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface ParentDashboardProps extends PageProps {
  children_profiles: Array<{
    id: string
    name: string
    avatar_url: string
    level: number
    points: number
  }>
}

export default function Index({ children_profiles }: ParentDashboardProps) {
  const { auth } = usePage<PageProps>().props
  const { t } = useTranslation()

  return (
    <div className="space-y-8">
      {/* Clean Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.parent.title')}</h1>
          <p className="text-gray-500 mt-1">{t('dashboard.welcome_back')}, {auth.user?.name}</p>
        </div>
        <Button asChild className="gap-2 bg-kodibot-green hover:bg-kodibot-green/90">
          <Link href="/parent/children/new">
            <UserPlus className="w-4 h-4" />
            {t('dashboard.parent.add_child')}
          </Link>
        </Button>
      </div>

      {/* Quick Stats - Minimalist */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-kodibot-green">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Children</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{children_profiles.length}</p>
              </div>
              <div className="w-12 h-12 bg-kodibot-green/10 rounded-lg flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-kodibot-green" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-kodibot-orange">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Points</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {children_profiles.reduce((sum, c) => sum + (c.points || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-kodibot-orange/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-kodibot-orange" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active This Week</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{children_profiles.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Children Grid - Clean Cards */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('dashboard.parent.my_children')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children_profiles && children_profiles.length > 0 ? (
            children_profiles.map((child) => (
              <Card key={child.id} className="hover:shadow-md transition-shadow border-t-4 border-t-kodibot-green">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden border-2 border-white shadow">
                      {child.avatar_url ? (
                        <img src={child.avatar_url} alt={child.name} className="w-full h-full object-cover" />
                      ) : (
                        <img src="/assets/profile-kodibot.png" alt={child.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{child.name}</h3>
                      <p className="text-sm text-gray-500">
                        {t('gamification.level')} {child.level} • {child.points} {t('gamification.xp')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center border">
                      <span className="text-xs text-gray-500 block mb-1">{t('dashboard.parent.learning_progress')}</span>
                      <span className="font-bold text-kodibot-green text-lg">85%</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center border">
                      <span className="text-xs text-gray-500 block mb-1">{t('dashboard.parent.this_week')}</span>
                      <span className="font-bold text-blue-600 text-lg">4.5h</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/parent/children/${child.id}`}>
                      {t('dashboard.parent.view_report')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">{t('dashboard.parent.no_children')}</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">Add your child's account to start monitoring their progress.</p>
              <Button asChild className="bg-kodibot-green hover:bg-kodibot-green/90">
                <Link href="/parent/children/new">{t('dashboard.parent.add_child')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Parent Controls - Minimalist */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Parent Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t('dashboard.parent.screen_time')}</h3>
                <p className="text-sm text-gray-500">Set daily learning limits</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-kodibot-green" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Content & Privacy</h3>
                <p className="text-sm text-gray-500">Manage access and data</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-kodibot-orange" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-500">Choose report types</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

Index.layout = (page: React.ReactNode) => <ParentLayout children={page} />
