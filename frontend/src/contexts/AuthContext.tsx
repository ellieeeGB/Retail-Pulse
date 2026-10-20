import React, { useState } from 'react'
import { login as apiLogin } from '../services/auth'
import type { User, LoginCredentials, AuthResponse, Client } from '../types'
import { AuthContext } from './auth-context'

function readStoredJson<T>(key: string): T | null {
  const token = localStorage.getItem('token')
  const value = localStorage.getItem(key)

  if (!token || !value) return null

  try {
    return JSON.parse(value) as T
  } catch {
    localStorage.removeItem(key)
    return null
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => readStoredJson<User>('user'))
  const [client, setClient] = useState<Client | null>(() => readStoredJson<Client>('client'))
  const [loading] = useState(false)

  const login = async (credentials: LoginCredentials) => {
    const response: AuthResponse = await apiLogin(credentials)

    localStorage.setItem('token', response.access_token)
    localStorage.setItem('user', JSON.stringify(response.user))
    localStorage.setItem('client', JSON.stringify(response.client))

    setUser(response.user)
    setClient(response.client)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('client')
    setUser(null)
    setClient(null)
  }

  return (
    <AuthContext.Provider value={{ user, client, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
