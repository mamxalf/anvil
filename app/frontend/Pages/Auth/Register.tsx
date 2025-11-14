import { Link, router } from '@inertiajs/react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageProps } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { registerSchema, type RegisterFormData } from '@/lib/validations'

interface RegisterProps extends PageProps {}

export default function Register({ errors: pageErrors = {}, translations }: RegisterProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  })

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    router.post(
      '/users',
      {
        user: {
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
        },
      },
      {
        onError: (errors) => {
          Object.keys(errors).forEach((key) => {
            setError(key as keyof RegisterFormData, {
              type: 'server',
              message: errors[key] as string,
            })
          })
        },
      }
    )
  }

  const t = translations?.auth || {
    register: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    sign_up: '',
    already_have_account: '',
    sign_in: '',
  }

  // Merge server errors with form errors
  const getErrorMessage = (field: keyof RegisterFormData): string | undefined => {
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
          <CardTitle className="text-2xl font-bold text-center">
            {t.register || 'Create an account'}
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.name || 'Name'}</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register('name')}
              />
              {getErrorMessage('name') && (
                <p className="text-sm text-red-600 mt-1">
                  {getErrorMessage('name')}
                </p>
              )}
            </div>

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
              <Label htmlFor="password">{t.password || 'Password'}</Label>
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

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">
                {t.password_confirmation || 'Confirm Password'}
              </Label>
              <Input
                id="password_confirmation"
                type="password"
                {...register('password_confirmation')}
              />
              {getErrorMessage('password_confirmation') && (
                <p className="text-sm text-red-600 mt-1">
                  {getErrorMessage('password_confirmation')}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Loading...' : t.sign_up || 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            {t.already_have_account || 'Already have an account?'}{' '}
            <Link href="/users/sign_in" className="text-primary hover:underline font-medium">
              {t.sign_in || 'Login'}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

