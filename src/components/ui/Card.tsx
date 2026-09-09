import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export function Card({
    children,
    className,
    hover = false,
    padding = true,
    onClick,
}: {
    children: ReactNode
    className?: string
    hover?: boolean
    padding?: boolean
    onClick?: () => void
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            className={cn(
                'glass-card rounded-2xl',
                (hover || onClick) && 'glass-card-hover cursor-pointer',
                padding && 'p-5',
                className
            )}
        >
            {children}
        </motion.div>
    )
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 mb-4">
            <div>
                <h3 className="text-base font-bold text-slate-800">{title}</h3>
                {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
            {action}
        </div>
    )
}
