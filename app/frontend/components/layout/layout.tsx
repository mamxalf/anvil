import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { PageProps } from '@/types'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { auth, flash } = usePage<PageProps>().props

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Anvil
            </Link>
            
            {auth.user && (
              <div className="flex gap-6">
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Dashboard
                </Link>
              </div>
            )}
            
            <div>
              {auth.user ? (
                <div className="flex items-center gap-4">
                  <Link 
                    href="/dashboard"
                    className="text-gray-700 hover:text-blue-600 transition"
                  >
                    {auth.user.name}
                  </Link>
                  {auth.user.role === 'admin' && (
                    <Link 
                      href="/avo"
                      className="text-gray-700 hover:text-blue-600 transition"
                    >
                      Admin
                    </Link>
                  )}
                  <Link 
                    href="/users/sign_out" 
                    method="delete"
                    as="button"
                    className="text-red-600 hover:text-red-700"
                  >
                    Logout
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link 
                    href="/users/sign_in" 
                    className="text-gray-700 hover:text-blue-600 transition"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/users/sign_up" 
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Flash Messages */}
      {(flash.success || flash.notice) && (
        <div className="bg-green-500 text-white px-4 py-3 text-center">
          {flash.success || flash.notice}
        </div>
      )}
      {(flash.error || flash.alert) && (
        <div className="bg-red-500 text-white px-4 py-3 text-center">
          {flash.error || flash.alert}
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Anvil. Built with Rails + Inertia + React + TypeScript</p>
        </div>
      </footer>
    </div>
  )
}