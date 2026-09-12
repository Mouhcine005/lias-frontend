import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AppLayout from './components/layout/AppLayout'
import PublicLayout from './components/layout/PublicLayout'
import ProtectedRoute from './components/guards/ProtectedRoute'
import RoleRoute from './components/guards/RoleRoute'

import LandingPage from './pages/public/LandingPage'
import PublicTeamsPage from './pages/public/PublicTeamsPage'
import PublicActivitiesPage from './pages/public/PublicActivitiesPage'
import PublicPublicationsPage from './pages/public/PublicPublicationsPage'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import PendingPage from './pages/auth/PendingPage'

import DashboardPage from './pages/member/DashboardPage'
import ProfilePage from './pages/member/ProfilePage'
import MembersPage from './pages/member/MembersPage'
import MemberDetailPage from './pages/member/MemberDetailPage'
import PublicationsPage from './pages/member/PublicationsPage'
import EventsPage from './pages/member/EventsPage'
import MeetingsPage from './pages/member/MeetingsPage'
import DocumentsPage from './pages/member/DocumentsPage'
import EquipmentPage from './pages/member/EquipmentPage'
import NotificationsPage from './pages/member/NotificationsPage'
import SearchPage from './pages/member/SearchPage'
import CalendarPage from './pages/member/CalendarPage'
import MessagingPage from './pages/member/MessagingPage'
import ConventionsPage from './pages/member/ConventionsPage'

import AdminPage from './pages/admin/AdminPage'
import MandatesPage from './pages/admin/MandatesPage'
import ReportsPage from './pages/admin/ReportsPage'
import EquipmentAdminPage from './pages/admin/EquipmentAdminPage'
import AuditPage from './pages/admin/AuditPage'

export default function App() {
    const { token } = useAuth()

    return (
        <Routes>
            {/* Public visitor pages (spec §2.1) — no auth required */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/equipes" element={<PublicTeamsPage />} />
                <Route path="/activites" element={<PublicActivitiesPage />} />
                <Route path="/publications-publiques" element={<PublicPublicationsPage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pending-approval" element={<PendingPage />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/members" element={<RoleRoute roles={['ADMIN', 'DIRECTOR']}><MembersPage /></RoleRoute>} />
                    <Route path="/members/:id" element={<MemberDetailPage />} />
                    <Route path="/publications" element={<PublicationsPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/meetings" element={<MeetingsPage />} />
                    <Route path="/documents" element={<RoleRoute roles={['ADMIN', 'DIRECTOR', 'MEMBER']}><DocumentsPage /></RoleRoute>} />
                    <Route path="/equipment" element={<RoleRoute roles={['ADMIN', 'DIRECTOR', 'MEMBER']}><EquipmentPage /></RoleRoute>} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/messaging" element={<RoleRoute roles={['MEMBER', 'DIRECTOR', 'ADMIN']}><MessagingPage /></RoleRoute>} />
                    <Route path="/conventions" element={<ConventionsPage />} />
                    <Route path="/mandates" element={<RoleRoute roles={['ADMIN']}><MandatesPage /></RoleRoute>} />
                    <Route path="/reports" element={<RoleRoute roles={['ADMIN', 'DIRECTOR']}><ReportsPage /></RoleRoute>} />
                    <Route path="/admin" element={<RoleRoute roles={['ADMIN']}><AdminPage /></RoleRoute>} />
                    <Route path="/audit" element={<RoleRoute roles={['ADMIN', 'DIRECTOR']}><AuditPage /></RoleRoute>} />
                    <Route path="/equipment/admin" element={<RoleRoute roles={['ADMIN', 'DIRECTOR']}><EquipmentAdminPage /></RoleRoute>} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to={token ? '/dashboard' : '/'} replace />} />
        </Routes>
    )
}