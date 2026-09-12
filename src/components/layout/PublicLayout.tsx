import { Outlet, Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { useAuth } from '../../context/AuthContext'

const NAV = [
    { to: '/', label: 'Accueil' },
    { to: '/equipes', label: 'Équipes' },
    { to: '/activites', label: 'Activités' },
    { to: '/publications-publiques', label: 'Publications' },
]

export default function PublicLayout() {
    const location = useLocation()
    const { token } = useAuth()

    return (
        <div className="min-h-screen bg-lias-950 app-mesh">
            <header className="border-b border-slate-200/10 bg-lias-950/80 backdrop-blur sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="font-bold text-white text-lg tracking-tight">LIAS</Link>
                    <nav className="hidden sm:flex items-center gap-1">
                        {NAV.map(item => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={cn(
                                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                    location.pathname === item.to
                                        ? 'bg-white/10 text-white'
                                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <Link
                        to={token ? '/dashboard' : '/login'}
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-cyan-500 text-white hover:bg-cyan-400 transition-colors"
                    >
                        {token ? 'Mon espace' : 'Connexion'}
                    </Link>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Outlet />
            </main>
        </div>
    )
}
