import api from './axios'
import type { AuthResponse } from '../types'

export const authApi = {
    login: (email: string, password: string) =>
        api.post<AuthResponse>('/api/auth/login', { email, password }),
    register: (email: string, password: string) =>
        api.post<AuthResponse>('/api/auth/register', { email, password }),
}
