import { createContext } from 'react'
import type { Client, LoginCredentials, User } from '../types'

export interface AuthContextType {
  user: User | null
  client: Client | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
