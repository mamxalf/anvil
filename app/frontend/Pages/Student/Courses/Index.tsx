import React from 'react'
import { Link } from '@inertiajs/react'
import StudentLayout from '@/Layouts/StudentLayout'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Clock, Users, Sparkles } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string | null
  level: string
  subject: string
  instructor: {
    name: string
  }
}

interface IndexProps {
  courses: Course[]
}

export default function Index({ courses }: IndexProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-8">
      {/* Glassmorphism Header */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-kodibot-orange to-kodibot-yellow p-8 text-white">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-600/30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-bold mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Explore & Learn</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t('courses.catalog')}</h1>
            <p className="text-white/80 mt-2 max-w-md">
              Temukan petualangan belajar coding dan robotik terbaik untukmu.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="secondary" className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 font-bold rounded-xl">
              {t('common.filter')}
            </Button>
            <Button variant="secondary" className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 font-bold rounded-xl">
              {t('common.sort')}
            </Button>
          </div>
        </div>
      </div>

      {/* Glassmorphism Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-kodibot-orange/20 bg-white/80 backdrop-blur-sm rounded-[1.5rem]">
            <div className="aspect-video w-full bg-gray-100 relative overflow-hidden group">
              {course.thumbnail ? (
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                  <BookOpen className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-3 right-3">
                 <Badge variant="secondary" className="font-bold bg-white/90 backdrop-blur-sm shadow-sm border-0 rounded-lg px-3">
                    {course.level === 'beginner' ? t('courses.beginner') : 
                     course.level === 'intermediate' ? t('courses.intermediate') : 
                     t('courses.advanced')}
                 </Badge>
              </div>
              {/* Glassmorphism Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <CardHeader className="p-5 pb-2">
              <div className="flex justify-between items-start gap-2 mb-2">
                 <Badge variant="outline" className="text-xs uppercase tracking-wider text-kodibot-orange border-kodibot-orange/30 rounded-lg px-2">
                   {course.subject === 'coding' ? t('courses.coding') : t('courses.robotics')}
                 </Badge>
              </div>
              <CardTitle className="text-lg line-clamp-2 hover:text-kodibot-orange transition-colors font-bold">
                 <Link href={`/courses/${course.id}`}>
                   {course.title}
                 </Link>
              </CardTitle>
              <CardDescription className="line-clamp-2 mt-1 text-sm">
                {course.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-5 pt-0 grow">
               <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-kodibot-orange to-kodibot-yellow flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {course.instructor.name.charAt(0)}
                  </div>
                  <span className="truncate font-medium">{course.instructor.name}</span>
               </div>
            </CardContent>

            <CardFooter className="p-5 pt-0 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
               <div className="flex gap-4 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    4h 30m
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    120
                  </span>
               </div>
               <Button asChild size="sm" className="font-bold bg-kodibot-orange hover:bg-kodibot-orange/90 rounded-xl">
                 <Link href={`/courses/${course.id}`}>{t('common.view_all')}</Link>
               </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-12 text-center border-4 border-dashed border-gray-200">
          <div className="mb-6 mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Courses Available</h3>
          <p className="text-gray-500">Check back later for new courses!</p>
        </div>
      )}
    </div>
  )
}

Index.layout = (page: React.ReactNode) => <StudentLayout children={page} />
