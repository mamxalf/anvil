import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { PageProps } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import InstructorLayout from '@/Layouts/InstructorLayout'
import { BookOpen, Users, Star, TrendingUp, PlusCircle } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface InstructorDashboardProps extends PageProps {
  instructorProfile: {
    bio: string
    expertise: string
  }
  courses: Array<{
    id: string
    title: string
    status: string
    enrolled_count: number
  }>
}

export default function Index({ courses }: InstructorDashboardProps) {
  const { auth } = usePage<PageProps>().props
  const { t } = useTranslation()
  
  const totalStudents = courses.reduce((acc, c) => acc + c.enrolled_count, 0)
  const publishedCourses = courses.filter(c => c.status === 'published').length

  return (
    <div className="space-y-8">
      {/* Clean Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.instructor.title')}</h1>
          <p className="text-gray-500 mt-1">{t('dashboard.welcome_back')}, {auth.user?.name}</p>
        </div>
        <Button asChild className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Link href="/courses/new">
            <PlusCircle className="w-4 h-4" />
            {t('dashboard.instructor.create_course')}
          </Link>
        </Button>
      </div>
      
      {/* Stats Overview - Minimalist Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{courses.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-kodibot-green">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Published</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{publishedCourses}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-kodibot-green" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-kodibot-orange">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-kodibot-orange" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">4.8</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Courses - Clean List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{t('dashboard.instructor.my_courses')}</h2>
          <Link href="/instructor/courses" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            {t('common.view_all')} →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.slice(0, 6).map(course => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      course.status === 'published' ? 'bg-green-100 text-green-700' : 
                      course.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.enrolled_count} Students
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      4.8
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/courses/${course.id}/edit`}>Edit</Link>
                    </Button>
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href={`/courses/${course.id}`}>Manage</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">You haven't created any courses yet.</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/courses/new">Create Your First Course</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

Index.layout = (page: React.ReactNode) => <InstructorLayout children={page} />
