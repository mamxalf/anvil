import React, { FormEvent, useState } from 'react'
import { Link, useForm } from '@inertiajs/react'
import { PageProps } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Layout from '@/components/layout/layout'

interface LoginProps extends PageProps {
  errors?: Record<string, string>
}

export default function Login({ errors: pageErrors, locale }: LoginProps) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember_me: false,
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    post('/users/sign_in')
  }

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        login: 'Login',
        email: 'Email',
        password: 'Password',
        remember_me: 'Remember me',
        sign_in: 'Sign In',
        dont_have_account: "Don't have an account?",
        register: 'Register',
      },
      id: {
        login: 'Masuk',
        email: 'Email',
        password: 'Kata Sandi',
        remember_me: 'Ingat saya',
        sign_in: 'Masuk',
        dont_have_account: 'Belum punya akun?',
        register: 'Daftar',
      },
    }
    const lang = (locale as string) || 'en'
    return translations[lang]?.[key] || key
  }

  const formErrors = errors || pageErrors || {}

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">{t('login')}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="mt-1"
                required
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="mt-1"
                required
              />
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                checked={data.remember_me}
                onChange={(e) => setData('remember_me', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="remember_me" className="ml-2">
                {t('remember_me')}
              </Label>
            </div>

            <Button type="submit" disabled={processing} className="w-full">
              {processing ? 'Loading...' : t('sign_in')}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t('dont_have_account')}{' '}
                <Link href="/users/sign_up" className="text-blue-600 hover:underline">
                  {t('register')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

