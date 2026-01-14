import React from 'react'
import ParentLayout from '@/Layouts/ParentLayout'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Clock, Users, ShoppingCart, CheckCircle } from 'lucide-react'
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
  enrolled_children_count: number
}

interface Child {
  id: string
  name: string
}

interface IndexProps {
  courses: Course[]
  children: Child[]
}

export default function Index({ courses, children }: IndexProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-8">
      {/* Clean Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Courses</h1>
          <p className="text-gray-500 mt-1">Find the best courses for your children</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">{t('common.filter')}</Button>
          <Button variant="outline">{t('common.sort')}</Button>
        </div>
      </div>

      {/* Children Quick Select */}
      {children.length > 0 && (
        <Card className="border-l-4 border-l-kodibot-green">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-medium text-gray-600">Purchase for:</span>
              {children.map((child) => (
                <Badge
                  key={child.id}
                  variant="secondary"
                  className="px-3 py-1 cursor-pointer hover:bg-kodibot-green/10"
                >
                  {child.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Grid - Clean Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="flex flex-col overflow-hidden hover:shadow-md transition-shadow border"
          >
            <div className="aspect-video w-full bg-gray-100 relative overflow-hidden">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <BookOpen className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="font-medium bg-white shadow-sm">
                  {course.level === 'beginner'
                    ? t('courses.beginner')
                    : course.level === 'intermediate'
                      ? t('courses.intermediate')
                      : t('courses.advanced')}
                </Badge>
              </div>
              {course.enrolled_children_count > 0 && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-kodibot-green font-medium gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {course.enrolled_children_count} enrolled
                  </Badge>
                </div>
              )}
            </div>

            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start gap-2 mb-2">
                <Badge variant="outline" className="text-xs uppercase tracking-wider">
                  {course.subject === 'coding' ? t('courses.coding') : t('courses.robotics')}
                </Badge>
              </div>
              <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">{course.description}</CardDescription>
            </CardHeader>

            <CardContent className="p-4 pt-0 grow">
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold shrink-0">
                  {course.instructor.name.charAt(0)}
                </div>
                <span className="truncate">{course.instructor.name}</span>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 border-t bg-gray-50 flex justify-between items-center">
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
              <Button size="sm" className="gap-1 bg-kodibot-green hover:bg-kodibot-green/90">
                <ShoppingCart className="w-3.5 h-3.5" />
                Buy
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="mb-6 mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Courses Available</h3>
          <p className="text-gray-500">Check back later for new courses!</p>
        </div>
      )}
    </div>
  )
}

Index.layout = (page: React.ReactNode) => <ParentLayout children={page} />
