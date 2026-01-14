import React, { useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { PageProps } from '@/types'
import { LayoutDashboard, BookOpen, Trophy, Medal, Menu, X, LogOut, Bell } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import LanguageSwitcher from '@/components/LanguageSwitcher'

interface StudentLayoutProps {
  children: React.ReactNode
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const { auth } = usePage<PageProps>().props
  const { t } = useTranslation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { url } = usePage()
  const currentPath = url

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const menuItems = [
    {
      name: t('menu.dashboard', { defaultValue: 'Dashboard' }),
      href: '/student/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      active: currentPath === '/student/dashboard',
    },
    {
      name: t('menu.courses', { defaultValue: 'Courses' }),
      href: '/student/courses',
      icon: <BookOpen className="w-5 h-5" />,
      active: currentPath.startsWith('/student/courses'),
    },
    {
      name: t('menu.achievements', { defaultValue: 'Achievements' }),
      href: '/student/achievements',
      icon: <Trophy className="w-5 h-5" />,
      active: currentPath.startsWith('/student/achievements'),
    },
    {
      name: t('menu.leaderboard', { defaultValue: 'Leaderboard' }),
      href: '/student/leaderboard',
      icon: <Medal className="w-5 h-5" />,
      active: currentPath.startsWith('/student/leaderboard'),
    },
  ]

  return (
    <div className="min-h-screen bg-orange-50/30 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white shadow-2xl shadow-orange-100/50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Logo Area */}
        <div className="p-6 flex items-center justify-between">
          <Link href="/student/dashboard" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-kodibot-orange to-kodibot-yellow p-2 rounded-xl shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform">
              <img
                src="/assets/profile-kodibot.png"
                alt="Kodibot Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                Kodi<span className="text-kodibot-orange">learn</span>
              </span>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                Student Area
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative ${
                item.active
                  ? 'bg-gradient-to-r from-orange-500 via-kodibot-orange to-yellow-500 text-white shadow-lg shadow-orange-200 font-bold'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-kodibot-orange font-medium'
              }`}
            >
              <div
                className={`${item.active ? 'text-white' : 'text-gray-400 group-hover:text-kodibot-orange'} transition-colors`}
              >
                {item.icon}
              </div>
              <span className="tracking-wide">{item.name}</span>
              {item.active && (
                <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile / Footer */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-3 hover:bg-gray-100 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-white shrink-0">
              <img
                src={
                  auth.user?.avatar_url ||
                  `https://ui-avatars.com/api/?name=${auth.user?.name || 'User'}&background=random`
                }
                alt={auth.user?.name || 'User'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 truncate">{auth.user?.name}</p>
              <p className="text-xs text-gray-500 font-medium truncate">
                Level {(auth.user as any)?.student_profile?.level || 1} Student
              </p>
            </div>
          </div>

          <Link
            href="/users/sign_out"
            method="delete"
            as="button"
            className="w-full flex items-center justify-center gap-2 p-3 text-red-500 hover:bg-red-50 rounded-xl text-sm font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('auth.sign_out', { defaultValue: 'Sign Out' })}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header (Mobile Only / Accessories) */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-4 py-3 border-b border-gray-100 flex items-center justify-between lg:justify-end">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                Online Learning
              </span>
            </div>

            <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>

            <Link
              href="/student/notifications"
              className="relative p-2 text-gray-400 hover:text-kodibot-orange hover:bg-orange-50 rounded-full transition-all"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </Link>

            <LanguageSwitcher className="" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
