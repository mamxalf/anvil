import { PageProps, User } from '@/types'
import Layout from '@/components/layout/layout'
import { Button } from '@/components/ui/button'

interface DashboardProps extends PageProps {
  user: User
}

export default function Index({
  user,
  locale,
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

