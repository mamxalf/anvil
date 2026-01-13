import { Link, usePage } from '@inertiajs/react'
import { PageProps } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Mascot from '@/components/ui/mascot'
import { useTranslation } from '@/hooks/useTranslation'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Trophy, Calendar, BookOpen, Star, Sparkles, Clock, ArrowRight } from 'lucide-react'

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-700 pb-12 pt-6">
      {/* Hero / Welcome Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-orange-500 bg-gradient-to-br from-kodibot-orange to-kodibot-yellow p-8 md:p-12 lg:px-16 lg:py-14 shadow-2xl transition-all hover:shadow-orange-200/50">
        
        {/* Language Switcher Positioned Absolute Top-Right */}
        <div className="absolute top-6 right-6 z-30">
           <LanguageSwitcher className="bg-white/30 backdrop-blur-md rounded-full p-1.5 shadow-sm border border-white/40 hover:bg-white/40 transition-colors" />
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-white md:max-w-xl">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-bold shadow-inner">
                <Sparkles className="w-4 h-4 text-white" />
                <span>{t('dashboard.welcome_back', { defaultValue: 'Welcome Back!' })}</span>
             </div>
             
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight drop-shadow-md">
                {t('dashboard.welcome', { name: auth.user?.name || 'Siswa' })} <span className="animate-wave inline-block origin-bottom-right">👋</span>
             </h1>
             
             <p className="text-lg md:text-xl font-medium text-white/90 leading-relaxed max-w-md">
               {t('dashboard.student.ready_to_learn', { defaultValue: 'Ready for today\'s learning adventure?' })}
             </p>

            {/* Glassmorphism Stats */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex-1 min-w-[140px] flex items-center gap-4 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg hover:bg-white/25 transition-colors cursor-default group">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  ⭐
                </div>
                <div>
                  <p className="text-xs font-bold text-white/80 uppercase tracking-wider">{t('dashboard.student.level')} {studentProfile?.level || 1}</p>
                  <p className="text-2xl font-black text-white leading-none mt-0.5">{studentProfile?.total_points || 0} <span className="text-sm font-bold opacity-80">XP</span></p>
                </div>
              </div>

              <div className="flex-1 min-w-[140px] flex items-center gap-4 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg hover:bg-white/25 transition-colors cursor-default group">
                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  🔥
                </div>
                <div>
                  <p className="text-xs font-bold text-white/80 uppercase tracking-wider">{t('dashboard.student.streak')}</p>
                  <p className="text-2xl font-black text-white leading-none mt-0.5">{studentProfile?.current_streak || 0} <span className="text-sm font-bold opacity-80">{t('dashboard.student.days', { defaultValue: 'Days' })}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Mascot Floating Effect */}
          <div className="relative hidden md:flex justify-end items-center h-full min-h-[300px] pointer-events-none">
             <div className="absolute inset-0 bg-white/30 blur-[60px] rounded-full transform scale-75 animate-pulse"></div>
             <div className="relative z-20 transform hover:-translate-y-4 transition-transform duration-700 ease-in-out cursor-pointer hover:rotate-2 pointer-events-auto">
                <Mascot mood="happy" size="lg" message={t('mascot.messages.welcome')} />
             </div>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-300/30 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-600/30 rounded-full blur-3xl mix-blend-overlay"></div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: My Courses & Upcoming (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          
            {/* Active Courses */}
          <section>
            <div className="flex justify-between items-end mb-6 px-1">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-green-100 text-secondary rounded-lg">
                    <BookOpen className="w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-extrabold text-kodibot-dark tracking-tight">{t('dashboard.student.my_courses')}</h2>
              </div>
              <Link href="/courses" className="text-kodibot-orange font-bold hover:text-kodibot-orange/80 flex items-center gap-1 transition-colors text-sm group">
                {t('common.view_all')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {courses && courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="group relative overflow-hidden border-2 border-transparent hover:border-primary/20 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                    <div className="relative h-48 overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                       <img 
                          src={course.thumbnail || 'https://placehold.co/600x400/orange/white?text=KodiCourse'} 
                          alt={course.title} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                       />
                       <div className="absolute bottom-4 left-4 right-4 z-20">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-primary/90 text-white text-[10px] font-bold uppercase tracking-wider mb-2 backdrop-blur-sm">
                             Course
                          </span>
                          <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 drop-shadow-sm">{course.title}</h3>
                       </div>
                    </div>
                    
                    <CardContent className="p-6 pt-5">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm font-bold text-muted-foreground">
                            <span>{t('courses.progress')}</span>
                            <span className="text-primary">{course.progress}%</span>
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
                        <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all group-hover:scale-[1.02]">
                          {t('dashboard.student.continue_learning')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
                <div className="bg-gray-50 rounded-[2.5rem] p-12 text-center border-4 border-dashed border-gray-200 hover:border-primary/30 transition-colors group">
                   <div className="mb-6 mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-10 h-10 text-gray-300" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-700 mb-2">{t('dashboard.student.no_courses_title', {defaultValue: 'No Courses Yet'})}</h3>
                   <p className="text-gray-500 mb-8 max-w-sm mx-auto">{t('dashboard.student.no_courses_desc', {defaultValue: 'Start your learning journey today by exploring our amazing courses!'})}</p>
                   <Button asChild size="lg" className="bg-primary text-white rounded-2xl px-8 shadow-xl shadow-primary/20 hover:shadow-primary/40 text-lg font-bold">
                     <Link href="/courses">{t('dashboard.student.start_adventure')}</Link>
                   </Button>
                </div>
            )}
          </section>

          {/* Upcoming Classes */}
          {upcomingClasses && upcomingClasses.length > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
               <div className="flex items-center gap-3 mb-6 px-1">
                 <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <Calendar className="w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-extrabold text-foreground tracking-tight">{t('dashboard.student.upcoming_classes')}</h2>
               </div>
               
               <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
                 {upcomingClasses.map((cls) => (
                   <div key={cls.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 hover:bg-gray-50/50 transition-colors group cursor-pointer">
                     <div className="flex-shrink-0">
                       <div className="bg-gradient-to-br from-kodibot-green to-emerald-600 text-white font-bold p-1 rounded-2xl text-center min-w-[70px] shadow-lg shadow-green-200 group-hover:shadow-green-300 transition-all">
                         <div className="text-[10px] uppercase tracking-widest pt-2 opacity-80">{new Date(cls.scheduled_at).toLocaleDateString('id-ID', { month: 'short' })}</div>
                         <div className="text-2xl pb-2 font-black">{new Date(cls.scheduled_at).getDate()}</div>
                       </div>
                     </div>
                     
                     <div className="flex-grow space-y-1">
                       <h4 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">{cls.title}</h4>
                       <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                          <span className="flex items-center gap-1.5">
                             <div className="w-6 h-6 rounded-full bg-gray-200 mr-1 overflow-hidden">
                                {/* Placeholder for avatar */}
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

        {/* Right Column: Gamification & Badges (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Badges Widget */}
          <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-orange-100/50 bg-white overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-kodibot-orange to-red-500"></div>
            <CardHeader className="pb-2 pt-8 px-8">
               <CardTitle className="text-xl font-extrabold flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <Trophy className="w-5 h-5" />
                 </div>
                 {t('dashboard.student.recent_badges')}
               </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="grid grid-cols-3 gap-4 py-4">
                {recentBadges && recentBadges.length > 0 ? (
                  recentBadges.map((badge, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-2 group/badge">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-gray-100 group-hover/badge:scale-110 group-hover/badge:shadow-md transition-all duration-300 relative overflow-hidden" title={badge.name}>
                        <div className="relative z-10">{badge.icon}</div>
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-white/50 opacity-0 group-hover/badge:opacity-100 transition-opacity"></div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide line-clamp-2 leading-tight">{badge.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 text-sm font-medium mb-1">Belum ada lencana</p>
                    <p className="text-xs text-gray-300">Ayo selesaikan kursus!</p>
                  </div>
                )}
              </div>
              <Button variant="outline" className="w-full mt-2 h-12 rounded-xl border-2 border-gray-100 hover:border-primary/30 hover:bg-orange-50 hover:text-primary font-bold transition-all">
                {t('common.view_all')}
              </Button>
            </CardContent>
          </Card>

          {/* Daily Challenge */}
          <div className="bg-gradient-to-br from-secondary/90 to-emerald-900/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            {/* Background pattern - Gloss Effect */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none"></div>
            
            <h3 className="font-extrabold text-xl mb-6 flex items-center gap-3 relative z-10 text-white">
               <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Star className="w-5 h-5 text-kodibot-yellow fill-current" />
               </div>
               {t('dashboard.student.daily_challenge')}
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-4 bg-black/10 p-3 rounded-2xl border border-white/10">
                <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer w-6 h-6 rounded-lg text-kodibot-green border-2 border-white/30 focus:ring-kodibot-green focus:ring-offset-0 bg-transparent cursor-default" checked readOnly />
                    {/* Fake check if needed or rely on default styling */}
                </div>
                <div className="flex-grow opacity-50">
                   <span className="text-sm font-bold block line-through">Login hari ini</span>
                   <span className="text-xs font-medium text-kodibot-yellow">+10 XP</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                <input type="checkbox" className="w-6 h-6 rounded-lg text-kodibot-green border-2 border-white/40 focus:ring-kodibot-green bg-transparent" />
                <div className="flex-grow">
                   <span className="text-sm font-bold block">Selesaikan 1 Kuis</span>
                   <span className="text-xs font-medium text-kodibot-yellow">+50 XP</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                <input type="checkbox" className="w-6 h-6 rounded-lg text-kodibot-green border-2 border-white/40 focus:ring-kodibot-green bg-transparent" />
                <div className="flex-grow">
                   <span className="text-sm font-bold block">Tonton 1 Video</span>
                   <span className="text-xs font-medium text-kodibot-yellow">+20 XP</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
               <p className="text-xs font-medium text-white/90 mb-2">Progress: 1/3</p>
               <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                  <div className="h-full bg-kodibot-yellow w-1/3 rounded-full shadow-[0_0_10px_rgba(249,219,43,0.5)]"></div>
               </div>
            </div>
          </div>

        </div>
      
      </div>
    </div>
  )
}
