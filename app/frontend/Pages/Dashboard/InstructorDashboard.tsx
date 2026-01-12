import React from 'react'
import { Link } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface InstructorDashboardProps {
  instructorProfile: any
  courses: Array<{
    id: string
    title: string
    status: string
    enrolled_count: number
  }>
}

export default function InstructorDashboard({ instructorProfile, courses }: InstructorDashboardProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
         <Button asChild className="bg-primary hover:bg-primary/90 text-white">
           <Link href="/courses/new">Create New Course</Link>
         </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Total Courses</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{courses.length}</p></CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{courses.reduce((acc, c) => acc + c.enrolled_count, 0)}</p></CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Average Rating</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold text-yellow-500">4.8</p></CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mt-8 text-gray-800">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map(course => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
               <CardHeader className="pb-2">
                 <div className="flex justify-between items-start">
                   <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
                   <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                     course.status === 'published' ? 'bg-green-100 text-green-800' : 
                     course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                   }`}>
                     {course.status.toUpperCase()}
                   </span>
                 </div>
               </CardHeader>
               <CardContent>
                  <div className="flex justify-between mb-6 text-sm text-gray-500">
                    <span>{course.enrolled_count} Students</span>
                    <span>Last updated today</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="w-1/2" asChild>
                      <Link href={`/courses/${course.id}/edit`}>Edit</Link>
                    </Button>
                    <Button size="sm" className="w-1/2" asChild>
                       <Link href={`/courses/${course.id}`}>Manage</Link>
                    </Button>
                  </div>
               </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed">
            <p className="text-gray-500 mb-4">You haven't created any courses yet.</p>
            <Button asChild>
              <Link href="/courses/new">Create Your First Course</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
