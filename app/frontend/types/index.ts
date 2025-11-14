// Base PageProps that all pages inherit
export type PageProps<T = Record<string, unknown>> = {
  auth: {
    user: User | null
  }
  flash: {
    success?: string
    error?: string
    notice?: string
    alert?: string
  }
  errors: Record<string, string>
  locale?: string
  translations?: {
    auth: {
      login: string
      register: string
      logout: string
      email: string
      password: string
      password_confirmation: string
      name: string
      remember_me: string
      forgot_password: string
      already_have_account: string
      dont_have_account: string
      sign_in: string
      sign_up: string
      sign_out: string
    }
    dashboard: {
      title: string
      welcome: string
      admin_panel: string
    }
    common: {
      save: string
      cancel: string
      edit: string
      delete: string
      create: string
      update: string
      back: string
    }
  }
} & T

// User interface
export interface User {
  id: string // UUID
  name: string
  email: string
  role: 'user' | 'admin'
}

// Add more types as needed