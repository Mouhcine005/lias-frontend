import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

const glows = {
    cyan: 'from-cyan-500/20 to-transparent border-cyan-500/30',
    violet: 'from-violet-500/20 to-transparent border-violet-500/30',
    amber: 'from-amber-500/20 to-transparent border-amber-500/30',
    emerald: 'from-emerald-500/20 to-transparent border-emerald-500/30',
}

export default function StatCard({
    label,
    value,
    icon: Icon,
    color = 'cyan',
    delay = 0,
}: {
    label: string
    value: number | string
    icon: LucideIcon
    color?: keyof typeof glows
    delay?: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className={cn(
                'glass-card rounded-2xl p-5 relative overflow-hidden border',
                glows[color]
            )}
        >
            <div className={cn('absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl rounded-full blur-2xl opacity-60', glows[color].split(' ')[0])} />
            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">{value}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-white/80 border border-slate-200/60 flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 text-cyan-600" />
                </div>
            </div>
        </motion.div>
    )
}
