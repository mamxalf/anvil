import React, { FormEvent } from 'react'
import { Link, useForm } from '@inertiajs/react'
import { PageProps } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

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
        login_description: 'Enter your email to sign in to your account',
      },
      id: {
        login: 'Masuk',
        email: 'Email',
        password: 'Kata Sandi',
        remember_me: 'Ingat saya',
        sign_in: 'Masuk',
        dont_have_account: 'Belum punya akun?',
        register: 'Daftar',
        login_description: 'Masukkan email Anda untuk masuk ke akun Anda',
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
          <CardTitle className="text-2xl font-bold text-center">{t('login')}</CardTitle>
          <CardDescription className="text-center">{t('login_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('password')}</Label>
              </div>
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

            <div className="flex items-center space-x-2">
              <input
                id="remember_me"
                type="checkbox"
                checked={data.remember_me}
                onChange={(e) => setData('remember_me', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="remember_me" className="text-sm font-normal cursor-pointer">
                {t('remember_me')}
              </Label>
            </div>

            <Button type="submit" disabled={processing} className="w-full">
              {processing ? 'Loading...' : t('sign_in')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            {t('dont_have_account')}{' '}
            <Link href="/users/sign_up" className="text-primary hover:underline font-medium">
              {t('register')}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

