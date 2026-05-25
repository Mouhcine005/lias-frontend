import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/member/DashboardPage'
import ProfilePage from './pages/member/ProfilePage'
import PublicationsPage from './pages/member/PublicationsPage'
import EventsPage from './pages/member/EventsPage'
import MeetingsPage from './pages/member/MeetingsPage'
import NotificationsPage from './pages/member/NotificationsPage'
import AdminPage from './pages/admin/AdminPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  return token ? <>{children}</> : <Navigate to="/login" />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { token, isDirector } = useAuth()
  return token && isDirector() ? <>{children}</> : <Navigate to="/dashboard" />
}

export default function App() {
  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/publications" element={<ProtectedRoute><PublicationsPage /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
        <Route path="/meetings" element={<ProtectedRoute><MeetingsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
  )
}