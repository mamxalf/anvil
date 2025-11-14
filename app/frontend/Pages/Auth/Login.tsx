import { Link, router } from '@inertiajs/react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageProps } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { loginSchema, type LoginFormData } from '@/lib/validations'

interface LoginProps extends PageProps {}

export default function Login({ errors: pageErrors = {}, translations }: LoginProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    },
  })

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    router.post(
      '/users/sign_in',
      {
        user: {
          email: data.email,
          password: data.password,
          remember_me: data.remember_me,
        },
      },
      {
        onError: (errors) => {
          Object.keys(errors).forEach((key) => {
            setError(key as keyof LoginFormData, {
              type: 'server',
              message: errors[key] as string,
            })
          })
        },
      }
    )
  }

  const t = translations?.auth || {
    login: '',
    email: '',
    password: '',
    remember_me: '',
    sign_in: '',
    dont_have_account: '',
    register: '',
  }

  // Merge server errors with form errors
  const getErrorMessage = (field: keyof LoginFormData): string | undefined => {
    if (errors[field]?.message) {
      return errors[field]?.message as string
    }
    if (pageErrors[field]) {
      return pageErrors[field] as string
    }
    return undefined
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t.login || 'Login'}</CardTitle>
          <CardDescription className="text-center">
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.email || 'Email'}</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
              />
              {getErrorMessage('email') && (
                <p className="text-sm text-red-600 mt-1">
                  {getErrorMessage('email')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t.password || 'Password'}</Label>
              </div>
              <Input
                id="password"
                type="password"
                {...register('password')}
              />
              {getErrorMessage('password') && (
                <p className="text-sm text-red-600 mt-1">
                  {getErrorMessage('password')}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="remember_me"
                type="checkbox"
                {...register('remember_me')}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="remember_me" className="text-sm font-normal cursor-pointer">
                {t.remember_me || 'Remember me'}
              </Label>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Loading...' : t.sign_in || 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            {t.dont_have_account || "Don't have an account?"}{' '}
            <Link href="/users/sign_up" className="text-primary hover:underline font-medium">
              {t.register || 'Register'}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

