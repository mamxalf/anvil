import React from 'react'
import { Link } from '@inertiajs/react'
import InstructorLayout from '@/Layouts/InstructorLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, Star, PlusCircle, MoreVertical, Edit, Eye, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string | null
  status: string
  enrolled_count: number
  updated_at: string
}

interface IndexProps {
  courses: Course[]
}

export default function Index({ courses }: IndexProps) {

  return (
    <div className="space-y-8">
      {/* Clean Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-500 mt-1">Manage and create your courses</p>
        </div>
        <Button asChild className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Link href="/courses/new">
            <PlusCircle className="w-4 h-4" />
            Create Course
          </Link>
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold">{courses.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-kodibot-green">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <p className="text-2xl font-bold">{courses.filter(c => c.status === 'published').length}</p>
            </div>
            <Eye className="w-8 h-8 text-kodibot-green" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Draft</p>
              <p className="text-2xl font-bold">{courses.filter(c => c.status === 'draft').length}</p>
            </div>
            <Edit className="w-8 h-8 text-yellow-500" />
          </CardContent>
        </Card>
      </div>

      {/* Courses Table/List */}
      {courses.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  {/* Thumbnail */}
                  <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  
                  {/* Course Info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        course.status === 'published' ? 'bg-green-100 text-green-700' : 
                        course.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{course.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {course.enrolled_count} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        4.8
                      </span>
                      <span>Updated {new Date(course.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/courses/${course.id}/edit`}>Edit</Link>
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href={`/courses/${course.id}`}>View</Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/courses/${course.id}/curriculum`} className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Curriculum
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Courses Yet</h3>
          <p className="text-gray-500 mb-6">Start by creating your first course</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/courses/new">Create Your First Course</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

Index.layout = (page: React.ReactNode) => <InstructorLayout children={page} />
