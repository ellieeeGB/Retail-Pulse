import api from './api'
import type { LoginCredentials, AuthResponse } from '../types'

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post('/auth/login', credentials)
  return response.data
}
