import { usePage } from '@inertiajs/react'

interface Translations {
  [namespace: string]: {
    [key: string]: string | { [nestedKey: string]: string }
  }
}

interface PagePropsWithTranslations {
  translations: Translations
  locale: string
}

export function useTranslation() {
  const { translations, locale } = usePage().props as unknown as PagePropsWithTranslations

  /**
   * Translate a key. Supports nested keys with dot notation.
   * Example: t('dashboard.welcome', { name: 'John' }) => "Hello, John!"
   */
  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.')
    let value: unknown = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        // Key not found, return the key itself as fallback
        return key
      }
    }

    if (typeof value !== 'string') {
      return key
    }

    // Replace %{param} placeholders
    let result = value
    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        result = result.replace(new RegExp(`%{${paramKey}}`, 'g'), paramValue)
      }
    }

    return result
  }

  return { t, locale }
}
