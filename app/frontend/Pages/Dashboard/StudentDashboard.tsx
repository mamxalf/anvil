import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { PageProps } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import Layout from '@/components/layout/layout'
import Mascot from '@/components/ui/mascot'
import { useTranslation } from '@/hooks/useTranslation'

interface StudentDashboardProps {
  studentProfile: {
    level: number
    total_points: number
    current_streak: number
    rank_name: string
  }
  recentBadges: Array<{
    name: string
    icon: string
    earned_at: string
  }>
  courses: Array<{
    id: string
    title: string
    thumbnail: string
    progress: number
  }>
  upcomingClasses: Array<{
    id: string
    title: string
    scheduled_at: string
    instructor_name: string
  }>
}

export default function StudentDashboard({ 
  studentProfile, 
  recentBadges, 
  courses, 
  upcomingClasses 
}: StudentDashboardProps) {
  const { auth } = usePage<PageProps>().props
  const { t } = useTranslation()

  return (
    <div className="space-y-8">
      {/* Hero / Welcome Section */}
      <section className="bg-white rounded-3xl p-8 shadow-xl border-b-4 border-primary/20 flex items-center justify-between overflow-hidden relative">
        <div className="z-10">
          <h1 className="text-4xl font-extrabold text-foreground mb-2">
            {t('dashboard.welcome', { name: auth.user?.name || 'Siswa' })} 👋
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            {t('dashboard.student.ready_to_learn')}
          </p>
          
          <div className="flex gap-4">
            <div className="bg-kodibot-yellow/10 p-4 rounded-2xl border-2 border-kodibot-yellow/30 flex items-center gap-3">
              <span className="text-3xl">⭐</span>
              <div>
                <p className="text-sm font-bold text-kodibot-yellow">{t('dashboard.student.level')} {studentProfile?.level || 1}</p>
                <p className="text-2xl font-black text-kodibot-yellow">{studentProfile?.total_points || 0} {t('gamification.xp')}</p>
              </div>
            </div>
            
            <div className="bg-kodibot-orange/10 p-4 rounded-2xl border-2 border-kodibot-orange/30 flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              <div>
                <p className="text-sm font-bold text-kodibot-orange">{t('dashboard.student.streak')}</p>
                <p className="text-2xl font-black text-kodibot-orange">{studentProfile?.current_streak || 0} {t('dashboard.student.days')}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mascot Decoration */}
        <div className="absolute right-[-20px] bottom-[-40px] z-20 transform scale-90 md:scale-100">
           <Mascot mood="happy" size="lg" message={t('mascot.messages.welcome')} />
        </div>
        
        {/* Background Blob */}
        <div className="absolute right-0 bottom-0 opacity-10">
           <div className="w-96 h-96 bg-primary rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: My Courses (2 cols wide) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Courses */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">{t('dashboard.student.my_courses')}</h2>
              <Link href="/courses" className="text-primary font-bold hover:underline">
                {t('common.view_all')}
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses && courses.length > 0 ? (
                courses.map((course) => (
                  <Card key={course.id} className="hover:transform hover:scale-105 transition-all duration-300 border-2 hover:border-primary cursor-pointer overflow-hidden rounded-2xl">
                    <img src={course.thumbnail || 'https://placehold.co/600x400/orange/white?text=KodiCourse'} alt={course.title} className="w-full h-40 object-cover" />
                    <CardHeader className="pb-2">
                       <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span>{t('courses.progress')}</span>
                          <span className="text-primary">{course.progress}%</span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-500 rounded-full" 
                            style={{ width: `${course.progress}%` }} 
                          />
                        </div>
                      </div>
                      <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold">
                        {t('dashboard.student.continue_learning')}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 bg-gray-50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 mb-4">{t('dashboard.student.no_courses')}</p>
                  <Button asChild className="bg-primary text-white rounded-xl">
                    <Link href="/courses">{t('dashboard.student.start_adventure')}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Classes */}
          {upcomingClasses && upcomingClasses.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">{t('dashboard.student.upcoming_classes')}</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                {upcomingClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                    <div className="bg-kodibot-green/10 text-kodibot-green font-bold p-3 rounded-xl text-center min-w-[80px]">
                      <div className="text-xs uppercase">{new Date(cls.scheduled_at).toLocaleDateString('id-ID', { month: 'short' })}</div>
                      <div className="text-xl">{new Date(cls.scheduled_at).getDate()}</div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-lg">{cls.title}</h4>
                      <p className="text-sm text-gray-500">bersama {cls.instructor_name} • {new Date(cls.scheduled_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <Button variant="outline" className="rounded-xl border-2 border-kodibot-green text-kodibot-green hover:bg-kodibot-green/10">
                      {t('dashboard.student.join')}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Gamification & Badges */}
        <div className="space-y-8">
          
          {/* Badges Widget */}
          <Card className="rounded-3xl border-none shadow-lg bg-gradient-to-br from-primary to-orange-600 text-white overflow-hidden">
            <CardHeader>
               <CardTitle className="text-2xl flex items-center gap-2">
                 <span>🏆</span> {t('dashboard.student.recent_badges')}
               </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {recentBadges && recentBadges.length > 0 ? (
                  recentBadges.map((badge, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl mb-2 shadow-inner border-2 border-white/30" title={badge.name}>
                        {badge.icon}
                      </div>
                      <span className="text-xs font-bold text-white/90 line-clamp-2">{badge.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-4 text-white/80">
                    Belum ada lencana. Ayo selesaikan kursus!
                  </div>
                )}
              </div>
              <Button variant="secondary" className="w-full mt-6 bg-white text-primary hover:bg-gray-100 rounded-xl font-bold">
                {t('common.view_all')}
              </Button>
            </CardContent>
          </Card>

          {/* Daily Challenge (Mockup) */}
          <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-gray-100">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <span>📅</span> {t('dashboard.student.daily_challenge')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-6 h-6 rounded-md text-primary focus:ring-primary" checked readOnly />
                <span className="line-through text-gray-400">Login hari ini (+10 XP)</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-6 h-6 rounded-md text-primary focus:ring-primary" />
                <span>Selesaikan 1 Kuis (+50 XP)</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-6 h-6 rounded-md text-primary focus:ring-primary" />
                <span>Tonton 1 Video (+20 XP)</span>
              </div>
            </div>
          </div>

        </div>
      
      </div>
    </div>
  )
}
