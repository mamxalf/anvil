import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { PageProps } from '@/types'

import LanguageSwitcher from '@/components/LanguageSwitcher'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { auth, flash } = usePage<PageProps>().props
  const user = auth.user

  // Helper to determine role color (optional, but good for differentiation)
  const navColor = 'bg-primary' // Always orange for consistency, or change based on user.role

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navigation */}
      <nav className={`${navColor} shadow-lg border-b-4 border-kodibot-orange/50`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo area */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-white p-2 rounded-xl shadow-inner group-hover:scale-105 transition-transform">
                 {/* Placeholder Kodibot Logo / Mascot Head */}
                 <img src="/assets/profile-kodibot.png" alt="Kodibot Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-3xl font-black text-white tracking-tight drop-shadow-md">
                Kodi<span className="text-kodibot-yellow">learn</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-white/90 hover:text-white font-bold px-4 py-2 hover:bg-white/10 rounded-xl transition-all">
                    Dashboard
                  </Link>
                  <Link href="/courses" className="text-white/90 hover:text-white font-bold px-4 py-2 hover:bg-white/10 rounded-xl transition-all">
                    Kursus
                  </Link>
                  <Link href="/achievements" className="text-white/90 hover:text-white font-bold px-4 py-2 hover:bg-white/10 rounded-xl transition-all">
                    Achievements
                  </Link>
                   <Link href="/leaderboard" className="text-white/90 hover:text-white font-bold px-4 py-2 hover:bg-white/10 rounded-xl transition-all">
                    Leaderboard
                  </Link>
                  
                   {/* User Dropdown / Profile */}
                   <div className="ml-4 flex items-center gap-3 bg-white/10 p-2 pl-4 pr-2 rounded-full border border-white/20">
                      <span className="text-white font-bold text-sm">{user.name}</span>
                      <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white bg-white">
                         <img src={user.avatar_url || "/assets/profile-kodibot.png"} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                   </div>

                  {user.role === 'admin' && (
                    <Link href="/avo" className="text-yellow-200 hover:text-yellow-100 text-sm font-bold">
                      Admin Panel
                    </Link>
                  )}
                  
                  <Link
                    href="/users/sign_out"
                    method="delete"
                    as="button"
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-transform hover:scale-105"
                  >
                    Keluar
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/users/sign_in" className="text-white hover:text-yellow-200 font-bold px-4">
                    Masuk
                  </Link>
                  <Link
                    href="/users/sign_up"
                    className="bg-kodibot-green hover:bg-kodibot-green/90 text-white px-6 py-2.5 rounded-xl font-bold shadow-[0_4px_0_rgb(29,133,54)] hover:shadow-[0_2px_0_rgb(29,133,54)] hover:translate-y-[2px] transition-all"
                  >
                    Daftar Gratis!
                  </Link>
                </>
              )}
            </div>
            
            {/* Mobile Menu Button (Placeholder) */}
            <button className="md:hidden text-white p-2">
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Flash Messages */}
      {(flash.success || flash.notice) && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mx-auto container mt-4 rounded-r-xl shadow-sm" role="alert">
          <p className="font-bold">Berhasil!</p>
          <p>{flash.success || flash.notice}</p>
        </div>
      )}
      {(flash.error || flash.alert) && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-auto container mt-4 rounded-r-xl shadow-sm" role="alert">
          <p className="font-bold">Oops!</p>
          <p>{flash.error || flash.alert}</p>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary-foreground border-t-2 border-primary/10 mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div>
              <span className="text-2xl font-black text-primary tracking-tight">
                Kodi<span className="text-kodibot-orange">learn</span>
              </span>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Platform belajar coding dan robotik yang seru untuk anak-anak Indonesia.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <LanguageSwitcher />
              <span>&copy; {new Date().getFullYear()} Kodilearn. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}