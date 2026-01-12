import { Link, router } from '@inertiajs/react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageProps } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { registerSchema, type RegisterFormData } from '@/lib/validations'
import profileKodibot from '../../../assets/images/profile-kodibot.png'

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

  const t = translations?.auth_kids || {
    register_title: 'Join the Adventure!',
    register_description: 'Start your coding journey with Kodibot!',
    name_placeholder: 'Super Coder Name',
    email_placeholder: "Parent's Email Address",
    password_placeholder: 'Secret Password',
    password_confirmation_placeholder: 'Repeat Secret Password',
    register_button: 'Start My Journey!',
    login_button: "I'm already a member",
    // Fallbacks
    register: 'Register',
    sign_up: 'Sign Up',
    sign_in: 'Login',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    password_confirmation: 'Confirm Password',
    already_have_account: 'Already have an account?',
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-orange-50 px-4 relative overflow-hidden">
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-kodibot-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-kodibot-green/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <Card className="w-full max-w-md shadow-2xl border-4 border-white/50 rounded-[2rem] bg-white/80 backdrop-blur-sm relative z-10 overflow-hidden my-8">
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-kodibot-green via-kodibot-yellow to-kodibot-orange" />
        
        <CardHeader className="space-y-2 flex flex-col items-center pt-8">
          <div className="w-28 h-28 mb-2 relative hover:scale-110 transition-transform duration-300">
             <img 
              src={profileKodibot} 
              alt="Kodibot" 
              className="object-contain w-full h-full drop-shadow-lg"
            />
          </div>
          <CardTitle className="text-3xl font-extrabold text-center text-primary tracking-tight">
            {t.register_title || 'Create an account'}
          </CardTitle>
          <CardDescription className="text-center text-base font-medium text-gray-600">
            {t.register_description || 'Enter your information to create your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-bold text-gray-700 ml-1">{t.name || 'Name'}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t.name_placeholder || "John Doe"}
                {...register('name')}
                className="rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 h-11 bg-white/50 transition-all duration-300"
              />
              {getErrorMessage('name') && (
                <p className="text-sm text-red-600 mt-1 font-medium ml-2 animated shake">
                  {getErrorMessage('name')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-bold text-gray-700 ml-1">{t.email || 'Email'}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t.email_placeholder || "name@example.com"}
                {...register('email')}
                className="rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 h-11 bg-white/50 transition-all duration-300"
              />
              {getErrorMessage('email') && (
                <p className="text-sm text-red-600 mt-1 font-medium ml-2">
                  {getErrorMessage('email')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-bold text-gray-700 ml-1">{t.password || 'Password'}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t.password_placeholder || "***"}
                {...register('password')}
                className="rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 h-11 bg-white/50 transition-all duration-300"
              />
              {getErrorMessage('password') && (
                <p className="text-sm text-red-600 mt-1 font-medium ml-2">
                  {getErrorMessage('password')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation" className="text-base font-bold text-gray-700 ml-1">
                {t.password_confirmation || 'Confirm Password'}
              </Label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder={t.password_confirmation_placeholder || "***"}
                {...register('password_confirmation')}
                className="rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 h-11 bg-white/50 transition-all duration-300"
              />
              {getErrorMessage('password_confirmation') && (
                <p className="text-sm text-red-600 mt-1 font-medium ml-2">
                  {getErrorMessage('password_confirmation')}
                </p>
              )}
            </div>

            <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-black py-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 mt-4"
            >
              {isSubmitting ? 'Loading...' : t.register_button || 'Start Adventure!'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-8">
          <div className="text-sm text-center font-medium text-gray-500">
            {t.already_have_account || 'Already have an account?'}{' '}
            <Link href="/users/sign_in" className="text-primary hover:text-primary/80 hover:underline font-bold transition-all text-base ml-1">
              {t.sign_in || 'Login'}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

