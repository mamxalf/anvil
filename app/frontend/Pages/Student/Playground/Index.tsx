import { Head, Link } from '@inertiajs/react'
import StudentLayout from '@/Layouts/StudentLayout'
import { useTranslation } from '@/hooks/useTranslation'
import { Cpu, Gamepad2, Sparkles, ArrowRight, Globe } from 'lucide-react'

export default function PlaygroundHub() {
  const { t } = useTranslation()

  const playgrounds = [
    {
      id: 'maze',
      title: t('playground.maze_game.title', { defaultValue: 'Maze Game' }),
      description: t('playground.maze_game.description', {
        defaultValue: 'Help the rabbit reach the goal using block programming',
      }),
      badge: t('playground.maze_game.badge', { defaultValue: 'Coding Logic' }),
      buttonText: t('playground.maze_game.play', { defaultValue: 'Play Now' }),
      href: '/student/playground/maze',
      icon: <Gamepad2 className="w-8 h-8" />,
      emoji: '🐰',
      gradient: 'from-emerald-500 via-green-500 to-teal-500',
      shadowColor: 'shadow-green-200',
      hoverShadow: 'hover:shadow-green-300',
      bgPattern: 'bg-gradient-to-br from-emerald-100 to-teal-50',
    },
    {
      id: 'community',
      title: t('playground.community.title', { defaultValue: 'Community Showcase' }),
      description: t('playground.community.description', {
        defaultValue: 'Discover and play amazing projects created by other students',
      }),
      badge: t('playground.community.badge', { defaultValue: 'Inspiration' }),
      buttonText: t('playground.community.explore', { defaultValue: 'Explore' }),
      href: '/student/community',
      icon: <Globe className="w-8 h-8" />,
      emoji: '🌍',
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      shadowColor: 'shadow-purple-200',
      hoverShadow: 'hover:shadow-purple-300',
      bgPattern: 'bg-gradient-to-br from-indigo-100 to-pink-50',
    },
    {
      id: 'arduino',
      title: t('playground.arduino.title', { defaultValue: 'Arduino Lab' }),
      description: t('playground.arduino.description', {
        defaultValue: 'Build circuits and program Arduino with visual blocks',
      }),
      badge: t('playground.arduino.badge', { defaultValue: 'Robotics' }),
      buttonText: t('playground.arduino.open', { defaultValue: 'Open Lab' }),
      href: '/student/playground/arduino',
      icon: <Cpu className="w-8 h-8" />,
      emoji: '🤖',
      gradient: 'from-orange-500 via-kodibot-orange to-yellow-500',
      shadowColor: 'shadow-orange-200',
      hoverShadow: 'hover:shadow-orange-300',
      bgPattern: 'bg-gradient-to-br from-orange-100 to-yellow-50',
    },
  ]

  return (
    <StudentLayout>
      <Head title={t('playground.title', { defaultValue: 'Playground' })} />

      <div className="space-y-8 pb-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-kodibot-orange to-yellow-500 p-8 md:p-10 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/25 text-sm font-bold text-white shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-yellow-200" />
              <span>{t('playground.title', { defaultValue: 'Playground' })}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4">
              {t('playground.subtitle', { defaultValue: 'Choose your adventure!' })}{' '}
              <span className="animate-wave inline-block origin-bottom-right">🚀</span>
            </h1>

            <p className="text-lg md:text-xl font-medium text-white/90 max-w-lg mx-auto">
              {t('playground.hero_description', { defaultValue: 'Learn coding and robotics the fun way!' })}
            </p>
          </div>
        </section>

        {/* Playground Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {playgrounds.map((playground) => (
            <Link
              key={playground.id}
              href={playground.href}
              className={`group relative overflow-hidden rounded-[2rem] ${playground.bgPattern} border-2 border-transparent hover:border-white shadow-xl ${playground.shadowColor} ${playground.hoverShadow} transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]`}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

              {/* Content */}
              <div className="relative z-10 p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-r ${playground.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {playground.icon}
                  </div>
                  <span className="text-6xl group-hover:scale-125 transition-transform duration-300">
                    {playground.emoji}
                  </span>
                </div>

                {/* Badge */}
                <span
                  className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${playground.gradient} text-white text-xs font-bold uppercase tracking-wider mb-4`}
                >
                  {playground.badge}
                </span>

                {/* Title & Description */}
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 group-hover:text-kodibot-orange transition-colors">
                  {playground.title}
                </h2>
                <p className="text-gray-600 text-base leading-relaxed mb-6">{playground.description}</p>

                {/* Button */}
                <div
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r ${playground.gradient} text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-all`}
                >
                  {playground.buttonText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 border-2 border-dashed border-gray-200 text-center">
          <div className="flex items-center justify-center gap-4 text-gray-400 mb-4">
            <span className="text-4xl">🎮</span>
            <span className="text-4xl">🎨</span>
            <span className="text-4xl">🎵</span>
          </div>
          <h3 className="text-xl font-bold text-gray-600 mb-2">{t('playground.coming_soon', { defaultValue: 'Coming Soon!' })}</h3>
          <p className="text-gray-500">{t('playground.coming_soon_desc', { defaultValue: 'More exciting playgrounds are on the way...' })}</p>
        </div>
      </div>
    </StudentLayout>
  )
}
