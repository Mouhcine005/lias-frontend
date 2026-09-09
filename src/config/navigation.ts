import type { LucideIcon } from 'lucide-react'
import {
    LayoutDashboard, User, Users, BookOpen, Calendar, CalendarDays,
    FileText, Package, Bell, Shield, ScrollText, BarChart3, Wrench,
    Search, MessageSquare, ClipboardList,
} from 'lucide-react'
import type { UserRole } from '../types'

export interface NavItem {
    label: string
    path: string
    icon: LucideIcon
    roles?: UserRole[]
    section?: string
}

export const navItems: NavItem[] = [
    { label: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard, section: 'Principal' },
    { label: 'Mon profil', path: '/profile', icon: User, section: 'Principal' },
    { label: 'Membres', path: '/members', icon: Users, roles: ['ADMIN', 'DIRECTOR'], section: 'Principal' },
    { label: 'Publications', path: '/publications', icon: BookOpen, section: 'Recherche' },
    { label: 'Événements', path: '/events', icon: Calendar, section: 'Recherche' },
    { label: 'Réunions', path: '/meetings', icon: CalendarDays, section: 'Recherche' },
    { label: 'Documents', path: '/documents', icon: FileText, section: 'Recherche' },
    { label: 'Équipements', path: '/equipment', icon: Package, section: 'Ressources' },
    { label: 'Notifications', path: '/notifications', icon: Bell, section: 'Ressources' },
    { label: 'Messagerie', path: '/messaging', icon: MessageSquare, roles: ['MEMBER', 'DOCTORAL', 'DIRECTOR', 'ADMIN'], section: 'Ressources' },
    { label: 'Recherche', path: '/search', icon: Search, section: 'Ressources' },
    { label: 'Calendrier', path: '/calendar', icon: CalendarDays, section: 'Recherche' },
    { label: 'Conventions', path: '/conventions', icon: ClipboardList, section: 'Ressources' },
    { label: 'Gestion équip.', path: '/equipment/admin', icon: Wrench, roles: ['ADMIN', 'DIRECTOR'], section: 'Administration' },
    { label: 'Mandats', path: '/mandates', icon: ScrollText, roles: ['ADMIN'], section: 'Administration' },
    { label: 'Rapports', path: '/reports', icon: BarChart3, roles: ['ADMIN', 'DIRECTOR'], section: 'Administration' },
    { label: 'Audit', path: '/audit', icon: ScrollText, roles: ['ADMIN', 'DIRECTOR'], section: 'Administration' },
    { label: 'Administration', path: '/admin', icon: Shield, roles: ['ADMIN'], section: 'Administration' },
]

export function getVisibleNav(role: UserRole | null) {
    return navItems.filter(item => !item.roles || (role && item.roles.includes(role)))
}

export function groupNav(items: NavItem[]) {
    const groups: Record<string, NavItem[]> = {}
    for (const item of items) {
        const s = item.section ?? 'Autre'
        if (!groups[s]) groups[s] = []
        groups[s].push(item)
    }
    return groups
}
