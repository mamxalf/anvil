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
} & T

// User interface
export interface User {
  id: number
  name: string
  email: string
}

// Add more types as needed
export interface Player {
  id: number
  name: string
  team_id: number
  team_name: string
  position: 'GK' | 'DEF' | 'MID' | 'FWD'
  price: number
  points: number
  avatar_url: string
}

export interface Squad {
  id: number
  user_id: number
  budget: number
  players: Player[]
  total_points: number
}