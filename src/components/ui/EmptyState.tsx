import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

export default function EmptyState({
    title,
    description,
    icon: Icon = Inbox,
    action,
}: {
    title: string
    description?: string
    icon?: LucideIcon
    action?: React.ReactNode
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/80 flex items-center justify-center mb-4">
                <Icon className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-700">{title}</p>
            {description && <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    )
}
