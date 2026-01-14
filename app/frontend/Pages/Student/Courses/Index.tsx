import React, { useState, useEffect } from 'react'
import { Link, router } from '@inertiajs/react'
import StudentLayout from '@/Layouts/StudentLayout'
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
import { BookOpen, Search, Filter, ArrowUpDown, Sparkles, Clock, Users } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Course } from '@/types'



interface IndexProps {
  courses: Course[]
  filters?: {
    search?: string
    filter?: string
    sort?: string
  }
}

export default function Index({ courses, filters = {} }: IndexProps) {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState(filters.search || '')

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== (filters.search || '')) {
        router.get(
          '/student/courses',
          { search: searchTerm, filter: filters.filter, sort: filters.sort },
          { preserveState: true, replace: true }
        )
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, filters.search, filters.filter, filters.sort])

  const handleFilterChange = (value: string) => {
    router.get(
      '/student/courses',
      { search: searchTerm, filter: value, sort: filters.sort },
      { preserveState: true }
    )
  }

  const handleSortChange = (value: string) => {
    router.get(
      '/student/courses',
      { search: searchTerm, filter: filters.filter, sort: value },
      { preserveState: true }
    )
  }

  return (
    <div className="space-y-8">
      {/* Glassmorphism Header */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-orange-500 via-kodibot-orange to-yellow-500 p-8 text-white">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-bold mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Explore & Learn</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              {t('courses.catalog')}
            </h1>
            <p className="text-white/80 mt-2 max-w-md">
              Temukan petualangan belajar coding dan robotik terbaik untukmu.
            </p>
          </div>
        </div>
      </div>

      {/* Search, Filter, Sort - Green Theme */}
      <div className="bg-gradient-to-b from-[#00A86B] to-emerald-600 rounded-[2rem] p-6 shadow-xl shadow-emerald-100/50 flex flex-col md:flex-row gap-4 items-center mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative flex-grow w-full md:w-auto z-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-700" />
          <Input
            placeholder={t('common.search_course', { defaultValue: 'Cari kursus...' })}
            className="pl-12 h-12 rounded-xl border-0 bg-white/90 focus:bg-white focus:ring-2 focus:ring-white/50 text-emerald-950 placeholder:text-emerald-700/60 font-medium transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto z-10">
          <Select value={filters.filter || 'all'} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full md:w-[180px] h-12 rounded-xl border-0 bg-white/90 focus:bg-white text-emerald-900 font-bold focus:ring-2 focus:ring-white/50 shadow-sm">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-700" />
                <SelectValue placeholder={t('common.filter')} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t('common.all_subjects', { defaultValue: 'Semua Subjek' })}
              </SelectItem>
              <SelectItem value="coding">{t('courses.coding')}</SelectItem>
              <SelectItem value="robotics">{t('courses.robotics')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.sort || 'newest'} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full md:w-[180px] h-12 rounded-xl border-0 bg-white/90 focus:bg-white text-emerald-900 font-bold focus:ring-2 focus:ring-white/50 shadow-sm">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-emerald-700" />
                <SelectValue placeholder={t('common.sort')} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                {t('common.newest', { defaultValue: 'Terbaru' })}
              </SelectItem>
              <SelectItem value="popular">
                {t('common.popular', { defaultValue: 'Terpopuler' })}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Glassmorphism Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-kodibot-orange/20 bg-white/80 backdrop-blur-sm rounded-[1.5rem]"
          >
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
                <Badge
                  variant="secondary"
                  className="font-bold bg-yellow-400 text-yellow-900 hover:bg-yellow-500 shadow-lg shadow-yellow-900/20 border-0 rounded-xl px-4 py-1.5 backdrop-blur-none"
                >
                  {course.level === 'beginner'
                    ? t('courses.beginner')
                    : course.level === 'intermediate'
                      ? t('courses.intermediate')
                      : t('courses.advanced')}
                </Badge>
              </div>
              {/* Glassmorphism Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <CardHeader className="p-5 pb-2">
              <div className="flex justify-between items-start gap-2 mb-2">
                <Badge
                  variant="outline"
                  className="text-xs uppercase tracking-wider text-kodibot-orange border-kodibot-orange/30 rounded-lg px-2"
                >
                  {course.subject === 'coding' ? t('courses.coding') : t('courses.robotics')}
                </Badge>
              </div>
              <CardTitle className="text-lg line-clamp-2 hover:text-kodibot-orange transition-colors font-bold">
                <Link href={`/student/courses/${course.id}`}>{course.title}</Link>
              </CardTitle>
              <CardDescription className="line-clamp-2 mt-1 text-sm">
                {course.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0 grow">
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md ring-2 ring-orange-100">
                  {course.instructor.name.charAt(0)}
                </div>
                <span className="truncate font-medium">{course.instructor.name}</span>
              </div>
            </CardContent>

            <CardFooter className="p-5 pt-2 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div className="flex gap-4 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />-
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  99+
                </span>
              </div>
              <Button
                asChild
                size="sm"
                className="font-bold bg-gradient-to-r from-orange-500 via-kodibot-orange to-yellow-500 hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 transition-all duration-300 rounded-xl px-6"
              >
                <Link href={`/student/courses/${course.id}`}>{t('common.view_all')}</Link>
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
