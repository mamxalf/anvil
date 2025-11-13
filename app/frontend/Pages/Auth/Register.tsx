import React, { FormEvent } from 'react'
import { Link, useForm } from '@inertiajs/react'
import { PageProps } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

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
        register: 'Create an account',
        name: 'Name',
        email: 'Email',
        password: 'Password',
        password_confirmation: 'Confirm Password',
        sign_up: 'Sign Up',
        already_have_account: 'Already have an account?',
        login: 'Login',
        register_description: 'Enter your information to create your account',
      },
      id: {
        register: 'Buat akun',
        name: 'Nama',
        email: 'Email',
        password: 'Kata Sandi',
        password_confirmation: 'Konfirmasi Kata Sandi',
        sign_up: 'Daftar',
        already_have_account: 'Sudah punya akun?',
        login: 'Masuk',
        register_description: 'Masukkan informasi Anda untuk membuat akun',
      },
    }
    const lang = (locale as string) || 'en'
    return translations[lang]?.[key] || key
  }

  const formErrors = errors || pageErrors || {}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t('register')}</CardTitle>
          <CardDescription className="text-center">{t('register_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('name')}</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
              />
              {formErrors.name && (
                <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
              />
              {formErrors.email && (
                <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                required
              />
              {formErrors.password && (
                <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">{t('password_confirmation')}</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                required
              />
              {formErrors.password_confirmation && (
                <p className="text-sm text-red-600 mt-1">{formErrors.password_confirmation}</p>
              )}
            </div>

            <Button type="submit" disabled={processing} className="w-full">
              {processing ? 'Loading...' : t('sign_up')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            {t('already_have_account')}{' '}
            <Link href="/users/sign_in" className="text-primary hover:underline font-medium">
              {t('login')}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

