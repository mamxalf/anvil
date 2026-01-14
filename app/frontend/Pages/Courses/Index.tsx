import React from 'react'
import { Link } from '@inertiajs/react'
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
import { BookOpen, Clock, Users } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import Layout from '@/components/layout/layout'

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {t('courses.catalog')}
          </h1>
          <p className="text-muted-foreground mt-1">
            Temukan petualangan belajar coding dan robotik terbaik untukmu.
          </p>
        </div>

        {/* Search/Filter placeholder */}
        <div className="flex gap-2">
          <Button variant="outline">{t('common.filter')}</Button>
          <Button variant="outline">{t('common.sort')}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/20 bg-white"
          >
            <div className="aspect-video w-full bg-gray-100 relative overflow-hidden group">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                  <BookOpen className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge
                  variant="secondary"
                  className="font-bold bg-white/90 backdrop-blur-sm shadow-sm"
                >
                  {course.level === 'beginner'
                    ? t('courses.beginner')
                    : course.level === 'intermediate'
                      ? t('courses.intermediate')
                      : t('courses.advanced')}
                </Badge>
              </div>
            </div>

            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start gap-2 mb-2">
                <Badge
                  variant="outline"
                  className="text-xs uppercase tracking-wider text-primary border-primary/30"
                >
                  {course.subject === 'coding' ? t('courses.coding') : t('courses.robotics')}
                </Badge>
              </div>
              <CardTitle className="text-xl line-clamp-2 hover:text-primary transition-colors">
                <Link href={`/courses/${course.id}`}>{course.title}</Link>
              </CardTitle>
              <CardDescription className="line-clamp-2 mt-1">{course.description}</CardDescription>
            </CardHeader>

            <CardContent className="p-4 pt-0 grow">
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold shrink-0">
                  {course.instructor.name.charAt(0)}
                </div>
                <span className="truncate">{course.instructor.name}</span>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 border-t bg-gray-50/50 p-4 flex justify-between items-center">
              <div className="flex gap-4 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  4h 30m
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  120
                </span>
              </div>
              <Button asChild size="sm" className="font-bold">
                <Link href={`/courses/${course.id}`}>{t('common.view_all')}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

Index.layout = (page: React.ReactNode) => <Layout children={page} />
