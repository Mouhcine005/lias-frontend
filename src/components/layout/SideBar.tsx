import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, FlaskConical } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getVisibleNav, groupNav } from '../../config/navigation'
import { ROLE_LABELS } from '../../types'
import Avatar from '../ui/Avatar'
import { useMe } from '../../hooks/useMe'

export default function Sidebar() {
    const { role, email, logout } = useAuth()
    const { data: me } = useMe()
    const visible = getVisibleNav(role)
    const groups = groupNav(visible)

    return (
        <aside className="w-64 sidebar-gradient flex flex-col h-full shrink-0 border-r border-cyan-500/10">
            <div className="px-5 py-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                        <FlaskConical className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm tracking-tight">LIAS Lab</p>
                        <p className="text-cyan-400/70 text-[10px] font-medium leading-tight mt-0.5">
                            Informatique & Sciences
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
                {Object.entries(groups).map(([section, items]) => (
                    <div key={section}>
                        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            {section}
                        </p>
                        <div className="space-y-0.5">
                            {items.map(item => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                                        ${isActive
                                            ? 'bg-gradient-to-r from-cyan-600/90 to-cyan-500/80 text-white nav-active-glow'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'}`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-cyan-400'}`} />
                                            {item.label}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="px-3 py-4 border-t border-white/5">
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5">
                    <Avatar
                        memberId={me?.id}
                        firstName={me?.firstName}
                        lastName={me?.lastName}
                        email={email ?? undefined}
                        size="sm"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">
                            {me?.firstName ? `${me.firstName} ${me.lastName ?? ''}` : email}
                        </p>
                        <p className="text-cyan-400/80 text-[10px] font-medium">
                            {role ? ROLE_LABELS[role] : ''}
                        </p>
                    </div>
                </div>
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={logout}
                    className="mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                </motion.button>
            </div>
        </aside>
    )
}
