import { cn } from '../../lib/utils'

type BadgeColor = 'cyan' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'slate' | 'purple' | 'violet'

const colors: Record<BadgeColor, string> = {
    cyan: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20',
    blue: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    green: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    yellow: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    orange: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
    red: 'bg-red-500/10 text-red-700 border-red-500/20',
    slate: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
    purple: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    violet: 'bg-violet-500/10 text-violet-700 border-violet-500/20',
}

export default function Badge({
    label,
    color = 'slate',
    className,
}: {
    label: string
    color?: BadgeColor | string
    className?: string
}) {
    const c = (colors[color as BadgeColor] ?? colors.slate)
    return (
        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border', c, className)}>
            {label.replace(/_/g, ' ')}
        </span>
    )
}
