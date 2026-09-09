import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

/** Separated action row — avoids cramped controls beside card content */
export default function CardActions({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn('mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2', className)}>
            {children}
        </div>
    )
}
