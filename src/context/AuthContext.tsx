import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { UserRole } from '../types'

interface AuthContextType {
    token: string | null
    role: UserRole | null
    email: string | null
    login: (token: string, role: string, email: string) => void
    logout: () => void
    isAdmin: () => boolean
    isDirector: () => boolean
    canManageLab: () => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
    const [role, setRole] = useState<UserRole | null>(localStorage.getItem('role') as UserRole | null)
    const [email, setEmail] = useState<string | null>(localStorage.getItem('email'))

    const login = useCallback((t: string, r: string, e: string) => {
        localStorage.setItem('token', t)
        localStorage.setItem('role', r)
        localStorage.setItem('email', e)
        setToken(t)
        setRole(r as UserRole)
        setEmail(e)
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('email')
        setToken(null)
        setRole(null)
        setEmail(null)
        window.location.href = '/login'
    }, [])

    const isAdmin = () => role === 'ADMIN'
    const isDirector = () => role === 'DIRECTOR' || role === 'ADMIN'
    const canManageLab = () => role === 'ADMIN' || role === 'DIRECTOR'

    return (
        <AuthContext.Provider value={{ token, role, email, login, logout, isAdmin, isDirector, canManageLab }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
