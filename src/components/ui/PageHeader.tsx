import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export default function PageHeader({
    title,
    subtitle,
    action,
    badge,
}: {
    title: string
    subtitle?: string
    action?: ReactNode
    badge?: ReactNode
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
            <div>
                {badge}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
                {subtitle && <p className="text-slate-500 text-sm mt-1.5 max-w-xl">{subtitle}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </motion.div>
    )
}
