import React from 'react'
import { Link } from '@inertiajs/react'
import Layout from '@/components/layout/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CourseShowProps {
  course: any
  modules: any[]
  isEnrolled: boolean
  canEdit: boolean
}

export default function CourseShow({ course, modules, isEnrolled, canEdit }: CourseShowProps) {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8">
         {/* Hero Section */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">{course.subject}</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-bold uppercase tracking-wider">{course.level}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">{course.title}</h1>
                <p className="text-xl text-gray-600 leading-relaxed">{course.description}</p>
              </div>
              
              {/* Modules List */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">📚</span>
                  Course Curriculum
                </h3>
                <div className="space-y-4">
                {modules && modules.length > 0 ? modules.map((mod: any, index: number) => (
                   <Card key={mod.id} className="border-l-4 border-l-primary overflow-hidden hover:shadow-md transition-shadow">
                     <CardContent className="p-6">
                       <div className="flex justify-between items-center mb-2">
                         <h4 className="font-bold text-lg text-gray-800">Module {index + 1}: {mod.title}</h4>
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{mod.lessons?.length || 0} LESSONS</span>
                       </div>
                       <p className="text-gray-500 text-sm">{mod.description}</p>
                       {/* Dropdown for lessons would go here */}
                     </CardContent>
                   </Card>
                )) : (
                  <div className="p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">No content available yet.</p>
                  </div>
                )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="sticky top-8 space-y-6">
               <Card className="overflow-hidden shadow-lg border-none">
                 {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-56 object-cover" />
                 ) : (
                    <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-400">Course Preview</div>
                 )}
                 <CardContent className="p-8 space-y-6">
                    <div className="flex justify-between items-baseline mb-2">
                       <span className="text-3xl font-extrabold text-gray-900">{course.enrollment_type === 'paid' ? '$49.99' : 'Free'}</span>
                       <span className="text-sm text-gray-500 font-medium">Lifetime Access</span>
                    </div>

                    {isEnrolled ? (
                      <Button className="w-full text-lg py-6 font-bold" asChild>
                         <Link href={`/courses/${course.id}/learn`}>Continue Learning</Link>
                      </Button>
                    ) : (
                      <Button className="w-full text-lg py-6 shadow-xl shadow-primary/20 font-bold hover:scale-105 transition-transform">Enroll Now</Button>
                    )}

                    {canEdit && (
                       <div className="space-y-2">
                         <Button variant="outline" className="w-full font-bold border-2" asChild>
                            <Link href={`/courses/${course.id}/edit`}>Edit Details</Link>
                         </Button>
                         <Button variant="secondary" className="w-full font-bold bg-gray-100 hover:bg-gray-200 text-gray-800" asChild>
                            <Link href={`/courses/${course.id}/curriculum`}>Manage Curriculum</Link>
                         </Button>
                       </div>
                    )}

                    <div className="pt-6 border-t border-gray-100 space-y-4">
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 font-medium">Difficulty</span>
                          <span className="font-bold capitalize bg-gray-100 px-2 py-1 rounded">{course.level}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 font-medium">Duration</span>
                          <span className="font-bold">{course.total_duration_minutes ? Math.round(course.total_duration_minutes / 60) : 0} Hours</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 font-medium">Total Lessons</span>
                          <span className="font-bold">{course.total_lessons || 0} Lessons</span>
                       </div>
                    </div>
                 </CardContent>
               </Card>
            </div>
         </div>
      </div>
    </Layout>
  )
}
