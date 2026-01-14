import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { PageProps } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ParentLayout from '@/Layouts/ParentLayout'
import { UserPlus, Activity, Clock, Shield } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface ParentDashboardProps {
  children_profiles: Array<{
    id: string
    name: string
    avatar_url: string
    level: number
    totalpoints: number
  }>
}

export default function ParentDashboard({ children_profiles }: ParentDashboardProps) {
  const { auth } = usePage<PageProps>().props
  const { t } = useTranslation()

  return (
    <div className="space-y-8">
       {/* Header */}
       <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.parent.title')}</h1>
            <p className="text-gray-500">Welcome back, {auth.user?.name}</p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/parent/children/new">
              <UserPlus className="w-4 h-4" />
              {t('dashboard.parent.add_child')}
            </Link>
          </Button>
       </div>

       {/* Children Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children_profiles && children_profiles.length > 0 ? (
            children_profiles.map((child) => (
              <Card key={child.id} className="hover:shadow-lg transition-shadow cursor-pointer border-t-4 border-t-primary">
                <CardContent className="pt-6">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                        {child.avatar_url ? (
                          <img src={child.avatar_url} alt={child.name} className="w-full h-full object-cover" />
                        ) : (
                          <img src="/assets/profile-kodibot.png" alt={child.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{child.name}</h3>
                        <p className="text-sm text-gray-500">{t('gamification.level')} {child.level} • {child.totalpoints} {t('gamification.xp')}</p>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-gray-50 p-2 rounded-lg text-center">
                         <span className="text-xs text-gray-500 block">{t('dashboard.parent.learning_progress')}</span>
                         <span className="font-bold text-kodibot-green">85%</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg text-center">
                         <span className="text-xs text-gray-500 block">{t('dashboard.parent.this_week')}</span>
                         <span className="font-bold text-blue-600">4.5h</span>
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
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <UserPlus className="w-8 h-8 text-gray-400" />
               </div>
               <h3 className="text-lg font-medium text-gray-900">{t('dashboard.parent.no_children')}</h3>
               <p className="text-gray-500 mb-6">Tambahkan akun anak untuk mulai memantau progress belajar mereka.</p>
               <Button asChild>
                 <Link href="/parent/children/new">{t('dashboard.parent.add_child')}</Link>
               </Button>
            </div>
          )}
       </div>

       {/* Parent Controls Preview (Placeholder) */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50 pointer-events-none">
          <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-lg flex items-center gap-2">
                 <Clock className="w-5 h-5" />
                 {t('dashboard.parent.screen_time')}
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-gray-500">Atur batas waktu belajar harian.</p>
             </CardContent>
          </Card>
          <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-lg flex items-center gap-2">
                 <Shield className="w-5 h-5" />
                 Konten & Privasi
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-gray-500">Kelola akses materi dan data privasi.</p>
             </CardContent>
          </Card>
          <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-lg flex items-center gap-2">
                 <Activity className="w-5 h-5" />
                 Notifikasi
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-gray-500">Pilih jenis laporan yang ingin diterima.</p>
             </CardContent>
          </Card>
       </div>
    </div>
  )
}

ParentDashboard.layout = (page: React.ReactNode) => <ParentLayout children={page} />
