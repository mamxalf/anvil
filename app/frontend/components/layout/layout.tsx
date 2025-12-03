import React, { useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { PageProps } from '@/types'
import {
  LayoutDashboard,
  UtensilsCrossed,
  Apple,
  Building2,
  Users,
  Truck,
  Settings,
  Menu,
  X,
  LogOut,
  Globe,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { auth, flash, locale, translations } = usePage<PageProps>().props
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  const t = translations?.nav || {}
  const user = auth?.user
  const isDietitianOrAdmin = user?.role === 'admin' || user?.role === 'dietitian'

  const navigation = [
    { name: t.dashboard || 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: t.target_groups || 'Kelompok Sasaran', href: '/target_groups', icon: Users, show: isDietitianOrAdmin },
    { name: t.menus || 'Menu', href: '/menus', icon: UtensilsCrossed, show: isDietitianOrAdmin },
    { name: t.food_items || 'Bahan Pangan', href: '/food_items', icon: Apple, show: isDietitianOrAdmin },
    { name: t.institutions || 'Institusi', href: '/institutions', icon: Building2, show: isDietitianOrAdmin },
    { name: t.beneficiaries || 'Penerima Manfaat', href: '/beneficiaries', icon: Users, show: isDietitianOrAdmin },
    { name: t.distributions || 'Distribusi', href: '/meal_distributions', icon: Truck, show: isDietitianOrAdmin },
    { name: t.nutrition_profiles || 'Profil Gizi', href: '/nutrition_profiles', icon: Settings, show: isDietitianOrAdmin },
  ].filter(item => item.show !== false)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-b from-emerald-800 to-emerald-900 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-emerald-700">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-emerald-800 font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-white">MBG App</span>
            </Link>
            <button
              className="lg:hidden text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = window.location.pathname === item.href ||
                window.location.pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-700 text-white'
                      : 'text-emerald-100 hover:bg-emerald-700/50 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          {user && (
            <div className="border-t border-emerald-700 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-emerald-300 capitalize">{user.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {user.role === 'admin' && (
                  <Link
                    href="/avo"
                    className="flex-1 text-center text-xs py-2 px-3 rounded bg-emerald-700 text-white hover:bg-emerald-600 transition"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/users/sign_out"
                  method="delete"
                  as="button"
                  className="flex items-center justify-center gap-1 text-xs py-2 px-3 rounded bg-red-600 text-white hover:bg-red-500 transition"
                >
                  <LogOut className="h-3 w-3" />
                  Keluar
                </Link>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm">
          <button
            className="lg:hidden text-gray-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1" />

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Globe className="h-4 w-4" />
              <span>{locale === 'id' ? 'Indonesia' : 'English'}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-lg bg-white shadow-lg border py-1 z-50">
                <Link
                  href="/locale/id"
                  className={`block px-4 py-2 text-sm hover:bg-gray-100 ${locale === 'id' ? 'text-emerald-600 font-medium' : 'text-gray-700'}`}
                  onClick={() => setLangMenuOpen(false)}
                >
                  🇮🇩 Bahasa Indonesia
                </Link>
                <Link
                  href="/locale/en"
                  className={`block px-4 py-2 text-sm hover:bg-gray-100 ${locale === 'en' ? 'text-emerald-600 font-medium' : 'text-gray-700'}`}
                  onClick={() => setLangMenuOpen(false)}
                >
                  🇬🇧 English
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Flash Messages */}
        {(flash.success || flash.notice) && (
          <div className="mx-4 mt-4">
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3">
              {flash.success || flash.notice}
            </div>
          </div>
        )}
        {(flash.error || flash.alert) && (
          <div className="mx-4 mt-4">
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3">
              {flash.error || flash.alert}
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t bg-white px-4 py-4 text-center text-sm text-gray-500">
          <p>© 2024 Makan Bergizi Gratis - Badan Gizi Nasional Indonesia</p>
        </footer>
      </div>
    </div>
  )
}
