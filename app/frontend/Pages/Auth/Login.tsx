import { Link, router } from '@inertiajs/react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageProps } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import profileKodibot from '../../../assets/images/profile-kodibot.png'

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

  const t = translations?.auth_kids || {
    login_title: 'Welcome Back!',
    login_description: 'Ready for your next coding mission?',
    email_placeholder: "Parent's Email Address",
    password_placeholder: 'Secret Password',
    login_button: "Let's Go!",
    register_button: 'Start My Journey!',
    // Fallbacks
    login: 'Login',
    email: 'Email',
    password: 'Password',
    remember_me: 'Remember me',
    sign_in: 'Sign In',
    register: 'Register',
    dont_have_account: "Don't have an account?",
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-green-50 px-4 relative overflow-hidden">
        {/* Decorative Background Blobs */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-kodibot-yellow/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-kodibot-green/20 rounded-full blur-3xl animate-pulse delay-700" />
        
      <Card className="w-full max-w-md shadow-2xl border-4 border-white/50 rounded-[2rem] bg-white/80 backdrop-blur-sm relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-kodibot-orange via-kodibot-yellow to-kodibot-green" />
        
        <CardHeader className="space-y-2 flex flex-col items-center pt-8">
          <div className="w-32 h-32 mb-2 relative hover:scale-110 transition-transform duration-300">
             <img 
              src={profileKodibot} 
              alt="Kodibot" 
              className="object-contain w-full h-full drop-shadow-lg"
            />
          </div>
          <CardTitle className="text-3xl font-extrabold text-center text-primary tracking-tight">
            {t.login_title || 'Welcome Back!'}
          </CardTitle>
          <CardDescription className="text-center text-base font-medium text-gray-600">
            {t.login_description || 'Ready for your next mission?'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-bold text-gray-700 ml-1">
                {t.email || 'Email'}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t.email_placeholder || "Parent's Email"}
                {...register('email')}
                className="rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 h-12 bg-white/50 transition-all duration-300"
              />
              {getErrorMessage('email') && (
                <p className="text-sm text-red-600 mt-1 font-medium ml-2 animated shake">
                  {getErrorMessage('email')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-base font-bold text-gray-700 ml-1">{t.password || 'Password'}</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder={t.password_placeholder || "***"}
                {...register('password')}
                className="rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 h-12 bg-white/50 transition-all duration-300"
              />
              {getErrorMessage('password') && (
                <p className="text-sm text-red-600 mt-1 font-medium ml-2">
                  {getErrorMessage('password')}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3 ml-1">
              <input
                id="remember_me"
                type="checkbox"
                {...register('remember_me')}
                className="h-5 w-5 rounded-md border-2 border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <Label htmlFor="remember_me" className="text-sm font-semibold text-gray-600 cursor-pointer select-none">
                {t.remember_me || 'Remember me'}
              </Label>
            </div>

            <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-black py-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 mt-4"
            >
              {isSubmitting ? 'Loading...' : t.login_button || "Let's Go!"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <div className="text-sm text-center font-medium text-gray-500">
            {t.dont_have_account || "Don't have an account?"}{' '}
            <Link href="/users/sign_up" className="text-primary hover:text-primary/80 hover:underline font-bold transition-all text-base ml-1">
              {t.register_button || 'Start My Journey!'}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

