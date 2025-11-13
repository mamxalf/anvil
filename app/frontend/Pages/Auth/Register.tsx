import React, { FormEvent } from 'react'
import { Link, useForm } from '@inertiajs/react'
import { PageProps } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Layout from '@/components/layout/layout'

interface RegisterProps extends PageProps {
  errors?: Record<string, string>
}

export default function Register({ errors: pageErrors, locale }: RegisterProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    post('/users')
  }

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        register: 'Register',
        name: 'Name',
        email: 'Email',
        password: 'Password',
        password_confirmation: 'Password Confirmation',
        sign_up: 'Sign Up',
        already_have_account: 'Already have an account?',
        login: 'Login',
      },
      id: {
        register: 'Daftar',
        name: 'Nama',
        email: 'Email',
        password: 'Kata Sandi',
        password_confirmation: 'Konfirmasi Kata Sandi',
        sign_up: 'Daftar',
        already_have_account: 'Sudah punya akun?',
        login: 'Masuk',
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
          <h1 className="text-3xl font-bold text-center mb-8">{t('register')}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">{t('name')}</Label>
              <Input
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="mt-1"
                required
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

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

            <div>
              <Label htmlFor="password_confirmation">{t('password_confirmation')}</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                className="mt-1"
                required
              />
              {formErrors.password_confirmation && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password_confirmation}</p>
              )}
            </div>

            <Button type="submit" disabled={processing} className="w-full">
              {processing ? 'Loading...' : t('sign_up')}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t('already_have_account')}{' '}
                <Link href="/users/sign_in" className="text-blue-600 hover:underline">
                  {t('login')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

