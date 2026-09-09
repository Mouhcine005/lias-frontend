import { useNavigate } from 'react-router-dom'
import { Bell, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useUnreadCount } from '../../hooks/useUnreadCount'

export default function TopBar() {
    const navigate = useNavigate()
    const { count } = useUnreadCount()

    return (
        <header className="h-14 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs text-slate-500 font-medium">Système opérationnel</span>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-100">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    <span className="text-[10px] font-semibold text-cyan-700">Portail LIAS</span>
                </div>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/notifications')}
                    className="relative w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-cyan-600 transition-colors"
                >
                    <Bell className="w-5 h-5" />
                    {count > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-rose-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-lg">
                            {count > 9 ? '9+' : count}
                        </span>
                    )}
                </motion.button>
            </div>
        </header>
    )
}
