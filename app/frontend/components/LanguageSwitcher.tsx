import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'

interface LanguageSwitcherProps {
  className?: string
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { locale } = useTranslation()

  const handleSwitch = (newLocale: string) => {
    // Send request to switch locale (will be stored in session)
    router.get(window.location.pathname, { locale: newLocale }, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        variant={locale === 'id' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleSwitch('id')}
        className="px-2 py-1 text-xs"
      >
        🇮🇩 ID
      </Button>
      <Button
        variant={locale === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleSwitch('en')}
        className="px-2 py-1 text-xs"
      >
        🇬🇧 EN
      </Button>
    </div>
  )
}
