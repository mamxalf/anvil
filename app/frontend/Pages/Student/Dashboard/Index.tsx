import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { PageProps } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Mascot from '@/components/ui/mascot'
import { useTranslation } from '@/hooks/useTranslation'
import StudentLayout from '@/Layouts/StudentLayout'
import { Trophy, Calendar, BookOpen, Star, Sparkles, Clock, ArrowRight } from 'lucide-react'

interface StudentDashboardProps extends PageProps {
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

export default function Index({ 
  studentProfile, 
  recentBadges, 
  courses, 
  upcomingClasses 
}: StudentDashboardProps) {
  const { auth } = usePage<PageProps>().props
  const { t } = useTranslation()

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section - Vibrant Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-kodibot-orange to-yellow-500 p-8 md:p-10 shadow-xl">
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-white md:max-w-xl">
             {/* Welcome Badge */}
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/25 text-sm font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-yellow-200" />
                <span>{t('dashboard.welcome_back')}</span>
             </div>
             
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                {t('dashboard.welcome', { name: auth.user?.name || 'Siswa' })} <span className="animate-wave inline-block origin-bottom-right">👋</span>
             </h1>
             
             <p className="text-lg md:text-xl font-medium text-white/90 leading-relaxed max-w-md">
               {t('dashboard.student.ready_to_learn')}
             </p>

            {/* Stats Cards - Vibrant */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex-1 min-w-[140px] flex items-center gap-4 bg-white/20 rounded-2xl p-4 border border-white/30 shadow-lg">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                  ⭐
                </div>
                <div>
                  <p className="text-xs font-bold text-white/90 uppercase tracking-wider">{t('dashboard.student.level')} {studentProfile?.level || 1}</p>
                  <p className="text-2xl font-black text-white leading-none mt-0.5">{studentProfile?.total_points || 0} <span className="text-sm font-bold opacity-80">XP</span></p>
                </div>
              </div>

              <div className="flex-1 min-w-[140px] flex items-center gap-4 bg-white/20 rounded-2xl p-4 border border-white/30 shadow-lg">
                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                  🔥
                </div>
                <div>
                  <p className="text-xs font-bold text-white/90 uppercase tracking-wider">{t('dashboard.student.streak')}</p>
                  <p className="text-2xl font-black text-white leading-none mt-0.5">{studentProfile?.current_streak || 0} <span className="text-sm font-bold opacity-80">{t('dashboard.student.days')}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Mascot */}
          <div className="relative hidden md:flex justify-end items-center h-full min-h-[300px] pointer-events-none">
             <div className="absolute inset-0 bg-yellow-300/30 blur-[60px] rounded-full transform scale-75 animate-pulse"></div>
             <div className="relative z-20 transform hover:-translate-y-4 transition-transform duration-700 ease-in-out cursor-pointer hover:rotate-2 pointer-events-auto">
                <Mascot mood="happy" size="lg" message={t('mascot.messages.welcome')} />
             </div>
          </div>
        </div>

        {/* Decorative Shapes */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-yellow-400/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-600/40 rounded-full blur-3xl"></div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Active Courses Section */}
          <section>
            <div className="flex justify-between items-end mb-6 px-1">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-green-100 text-kodibot-green rounded-lg">
                    <BookOpen className="w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{t('dashboard.student.my_courses')}</h2>
              </div>
              <Link href="/student/courses" className="text-kodibot-orange font-bold hover:text-kodibot-orange/80 flex items-center gap-1 transition-colors text-sm group">
                {t('common.view_all')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {courses && courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="group relative overflow-hidden border-2 border-transparent hover:border-kodibot-orange/20 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
                    <div className="relative h-48 overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                       <img 
                          src={course.thumbnail || 'https://placehold.co/600x400/orange/white?text=KodiCourse'} 
                          alt={course.title} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                       />
                       <div className="absolute bottom-4 left-4 right-4 z-20">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-kodibot-orange/90 text-white text-[10px] font-bold uppercase tracking-wider mb-2 backdrop-blur-sm">
                             Course
                          </span>
                          <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 drop-shadow-sm">{course.title}</h3>
                       </div>
                    </div>
                    
                    <CardContent className="p-6 pt-5">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm font-bold text-gray-500">
                            <span>{t('courses.progress')}</span>
                            <span className="text-kodibot-orange">{course.progress}%</span>
                          </div>
                          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-kodibot-orange to-kodibot-yellow transition-all duration-1000 ease-out rounded-full relative" 
                              style={{ width: `${course.progress}%` }} 
                            >
                               <div className="absolute top-0 right-0 w-full h-full bg-white/20 animate-shimmer" />
                            </div>
                          </div>
                        </div>
                        <Button className="w-full h-12 bg-kodibot-orange hover:bg-kodibot-orange/90 text-white rounded-2xl font-bold text-base shadow-lg shadow-kodibot-orange/20 hover:shadow-kodibot-orange/40 transition-all group-hover:scale-[1.02]">
                          {t('dashboard.student.continue_learning')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
                <div className="bg-white/60 backdrop-blur-sm rounded-[2.5rem] p-12 text-center border-4 border-dashed border-gray-200 hover:border-kodibot-orange/30 transition-colors group">
                   <div className="mb-6 mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-10 h-10 text-gray-300" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-700 mb-2">{t('dashboard.student.no_courses_title', {defaultValue: 'No Courses Yet'})}</h3>
                   <p className="text-gray-500 mb-8 max-w-sm mx-auto">{t('dashboard.student.no_courses_desc', {defaultValue: 'Start your learning journey today by exploring our amazing courses!'})}</p>
                   <Button asChild size="lg" className="bg-kodibot-orange text-white rounded-2xl px-8 shadow-xl shadow-kodibot-orange/20 hover:shadow-kodibot-orange/40 text-lg font-bold">
                     <Link href="/student/courses">{t('dashboard.student.start_adventure')}</Link>
                   </Button>
                </div>
            )}
          </section>

          {/* Upcoming Classes */}
          {upcomingClasses && upcomingClasses.length > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
               <div className="flex items-center gap-3 mb-6 px-1">
                 <div className="p-2 bg-green-100 text-kodibot-green rounded-lg">
                    <Calendar className="w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{t('dashboard.student.upcoming_classes')}</h2>
               </div>
               
               <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                 {upcomingClasses.map((cls) => (
                   <div key={cls.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 hover:bg-gray-50/50 transition-colors group cursor-pointer">
                     <div className="flex-shrink-0">
                       <div className="bg-gradient-to-br from-kodibot-green to-emerald-600 text-white font-bold p-1 rounded-2xl text-center min-w-[70px] shadow-lg shadow-green-200 group-hover:shadow-green-300 transition-all">
                         <div className="text-[10px] uppercase tracking-widest pt-2 opacity-80">{new Date(cls.scheduled_at).toLocaleDateString('id-ID', { month: 'short' })}</div>
                         <div className="text-2xl pb-2 font-black">{new Date(cls.scheduled_at).getDate()}</div>
                       </div>
                     </div>
                     
                     <div className="flex-grow space-y-1">
                       <h4 className="font-bold text-lg text-gray-900 group-hover:text-kodibot-orange transition-colors">{cls.title}</h4>
                       <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                          <span className="flex items-center gap-1.5">
                             <div className="w-6 h-6 rounded-full bg-gray-200 mr-1 overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=${cls.instructor_name}&background=random`} alt="" />
                             </div>
                             {cls.instructor_name}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span className="flex items-center gap-1.5 text-kodibot-green">
                             <Clock className="w-4 h-4" />
                             {new Date(cls.scheduled_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                       </div>
                     </div>
                     
                     <Button className="w-full sm:w-auto rounded-xl bg-white border-2 border-kodibot-green text-kodibot-green hover:bg-kodibot-green hover:text-white font-bold shadow-none hover:shadow-md transition-all">
                       {t('dashboard.student.join')}
                     </Button>
                   </div>
                 ))}
               </div>
            </section>
          )}

        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Badges Widget - Vibrant Orange */}
          <div className="bg-gradient-to-br from-kodibot-orange to-orange-600 rounded-3xl p-6 text-white shadow-xl overflow-hidden relative">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-yellow-400/30 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-red-500/20 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-kodibot-yellow" />
                </div>
                <h3 className="text-lg font-bold">{t('dashboard.student.recent_badges')}</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {recentBadges && recentBadges.length > 0 ? (
                  recentBadges.map((badge, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-2">
                      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform">
                        {badge.icon}
                      </div>
                      <span className="text-[10px] font-semibold text-white/90 line-clamp-2">{badge.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-6 bg-white/10 rounded-2xl">
                    <p className="text-white/80 text-sm font-medium">{t('gamification.no_badges', { defaultValue: 'Belum ada lencana' })}</p>
                    <p className="text-xs text-white/60 mt-1">{t('gamification.complete_courses', { defaultValue: 'Ayo selesaikan kursus!' })}</p>
                  </div>
                )}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4 h-11 rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold"
                asChild
              >
                <Link href="/student/achievements">{t('common.view_all')}</Link>
              </Button>
            </div>
          </div>

          {/* Daily Challenge - Vibrant Yellow/Green */}
          <div className="bg-gradient-to-br from-kodibot-yellow via-yellow-400 to-kodibot-green rounded-3xl p-6 shadow-xl overflow-hidden relative">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-green-400/30 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-yellow-300/40 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-kodibot-orange fill-current" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{t('dashboard.student.daily_challenge')}</h3>
              </div>
              
              <div className="space-y-3">
                {/* Completed task */}
                <div className="flex items-center gap-3 bg-kodibot-green/20 p-3 rounded-xl border border-kodibot-green/30">
                  <div className="w-6 h-6 bg-kodibot-green rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-grow opacity-70">
                    <span className="text-sm font-bold text-gray-800 block line-through">{t('gamification.login_today', { defaultValue: 'Login hari ini' })}</span>
                    <span className="text-xs font-bold text-kodibot-green">+10 XP ✓</span>
                  </div>
                </div>
                
                {/* Pending tasks */}
                <div className="flex items-center gap-3 bg-white/40 p-3 rounded-xl border border-white/50 hover:bg-white/60 transition-colors cursor-pointer">
                  <div className="w-6 h-6 bg-white/50 rounded-lg border-2 border-gray-400"></div>
                  <div className="flex-grow">
                    <span className="text-sm font-bold text-gray-800 block">{t('gamification.complete_quiz', { defaultValue: 'Selesaikan 1 Kuis' })}</span>
                    <span className="text-xs font-bold text-kodibot-orange">+50 XP</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white/40 p-3 rounded-xl border border-white/50 hover:bg-white/60 transition-colors cursor-pointer">
                  <div className="w-6 h-6 bg-white/50 rounded-lg border-2 border-gray-400"></div>
                  <div className="flex-grow">
                    <span className="text-sm font-bold text-gray-800 block">{t('gamification.watch_video', { defaultValue: 'Tonton 1 Video' })}</span>
                    <span className="text-xs font-bold text-kodibot-orange">+20 XP</span>
                  </div>
                </div>
              </div>
              
              {/* Progress */}
              <div className="mt-5 pt-4 border-t border-gray-900/10">
                <div className="flex justify-between text-sm font-bold text-gray-800 mb-2">
                  <span>Progress</span>
                  <span>1/3</span>
                </div>
                <div className="h-3 w-full bg-white/50 rounded-full overflow-hidden">
                  <div className="h-full bg-kodibot-green w-1/3 rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      
      </div>
    </div>
  )
}

Index.layout = (page: React.ReactNode) => <StudentLayout children={page} />
