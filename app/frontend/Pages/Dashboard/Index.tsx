import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { PageProps, User } from '@/types'
import Layout from '@/components/layout/layout'
import { Button } from '@/components/ui/button'

interface DashboardProps extends PageProps {
  user: User
}

export default function Index({ user, locale }: DashboardProps) {
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('dashboard')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('welcome')}, {user.name}!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Name:</span> {user.name}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Role:</span>{' '}
                <span className="capitalize">{user.role}</span>
              </p>
            </div>
          </div>

          {user.role === 'admin' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">{t('admin_panel')}</h2>
              <Link href="/avo">
                <Button>Go to Admin Panel</Button>
              </Link>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <p className="text-gray-600">Dashboard features coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

