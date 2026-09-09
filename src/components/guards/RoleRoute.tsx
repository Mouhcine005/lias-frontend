import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types'
import type { ReactNode } from 'react'

export default function RoleRoute({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
    const { role } = useAuth()
    if (!role || !roles.includes(role)) return <Navigate to="/dashboard" replace />
    return <>{children}</>
}
