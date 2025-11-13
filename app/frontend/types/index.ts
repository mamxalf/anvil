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
} & T

// User interface
export interface User {
  id: string // UUID
  name: string
  email: string
  role: 'user' | 'admin'
}

// Add more types as needed