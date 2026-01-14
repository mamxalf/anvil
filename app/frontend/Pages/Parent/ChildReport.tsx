import React from 'react'
import { Link } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import ParentLayout from '@/Layouts/ParentLayout'

interface ChildReportProps {
  child: {
    id: string
    name: string
    email: string
    avatar_url: string
    level: number
    totalpoints: number
    streak: number
    joined_at: string
  }
  recentActivity: Array<{
    id: string
    lesson_title: string
    course_title: string
    completed_at: string
    xp_earned: number
  }>
  enrollments: Array<{
    id: string
    course_title: string
    progress: number
    status: string
  }>
}

export default function ChildReport({ child, recentActivity, enrollments }: ChildReportProps) {
  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Navigation and Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="flex items-center text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <span className="text-primary">{child.name}'s</span> Progress Report
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 uppercase">Current Level</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-gray-800">{child.level}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 uppercase">Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-primary">{child.totalpoints} XP</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 uppercase">Learning Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-orange-500">{child.streak} Days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-bold text-gray-800">{activity.lesson_title}</p>
                      <p className="text-xs text-gray-500">{activity.course_title}</p>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-green-600">
                        +{activity.xp_earned} XP
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(activity.completed_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No activity yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Course Progress */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enrollments && enrollments.length > 0 ? (
                enrollments.map((enr) => (
                  <div key={enr.id} className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{enr.course_title}</span>
                      <span>{enr.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${enr.progress}%` }} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Not enrolled in any courses.</p>
                  <Button variant="outline" asChild>
                    <Link href="/courses">Browse Courses</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

ChildReport.layout = (page: React.ReactNode) => <ParentLayout children={page} />
