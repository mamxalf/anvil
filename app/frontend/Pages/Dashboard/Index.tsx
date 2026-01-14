import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { PageProps, User } from '@/types'
import Layout from '@/components/layout/layout'
import { Button } from '@/components/ui/button'
import StudentDashboard from './StudentDashboard'
import InstructorDashboard from './InstructorDashboard'
import ParentDashboard from './ParentDashboard'
import StudentLayout from '@/Layouts/StudentLayout'
import InstructorLayout from '@/Layouts/InstructorLayout'
import ParentLayout from '@/Layouts/ParentLayout'

interface DashboardProps extends PageProps {
  user: User
  studentProfile?: any
  recentBadges?: any[]
  courses?: any[]
  upcomingClasses?: any[]
  instructorProfile?: any
  children_profiles?: any[]
}

export default function Index({ 
  user, 
  locale,
  studentProfile,
  recentBadges,
  courses,
  upcomingClasses,
  instructorProfile,
  children_profiles
}: DashboardProps) {
  // ... translations (kept same)
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        dashboard: 'Dashboard',
        welcome: 'Welcome',
        admin_panel: 'Admin Panel',
        logout: 'Logout',
      },
      id: {
        dashboard: 'Dasbor',
        welcome: 'Selamat datang',
        admin_panel: 'Panel Admin',
        logout: 'Keluar',
      },
    }
    const lang = (locale as string) || 'en'
    return translations[lang]?.[key] || key
  }

  // Role Routing
  if (user.role === 'student' && studentProfile) {
    return (
      <StudentLayout>
        <StudentDashboard 
          studentProfile={studentProfile}
          recentBadges={recentBadges || []}
          courses={courses || []}
          upcomingClasses={upcomingClasses || []}
        />
      </StudentLayout>
    )
  }

  if (user.role === 'instructor' && instructorProfile) {
    return (
      <InstructorLayout>
        <InstructorDashboard
          instructorProfile={instructorProfile}
          courses={courses || []}
        />
      </InstructorLayout>
    )
  }

  if (user.role === 'parent') {
    return (
      <ParentLayout>
        <ParentDashboard
          children_profiles={children_profiles || []}
        />
      </ParentLayout>
    )
  }

  // Default Dashboard (Admin/Fallback)
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            {t('dashboard')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('welcome')}, <span className="text-primary">{user.name}</span>!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>👤</span> Profile
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Name:</span> {user.name}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Email:</span> {user.email}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="font-semibold text-gray-800">Role:</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold capitalize">{user.role}</span>
              </p>
            </div>
          </div>

          {user.role === 'admin' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold mb-4">{t('admin_panel')}</h2>
              <p className="text-gray-500 mb-6">Manage users, courses, and content.</p>
              <a href="/avo" className="block w-full">
                <Button className="w-full font-bold">Go to Admin Panel</Button>
              </a>
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <p className="text-gray-500 italic">Dashboard features for {user.role} are coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

