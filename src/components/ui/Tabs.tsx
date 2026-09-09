import { cn } from '../../lib/utils'

export default function Tabs<T extends string>({
    tabs,
    active,
    onChange,
    className,
}: {
    tabs: { id: T; label: string; count?: number }[]
    active: T
    onChange: (id: T) => void
    className?: string
}) {
    return (
        <div className={cn('flex flex-wrap gap-2 p-1.5 bg-slate-100/90 rounded-2xl w-full sm:w-auto', className)}>
            {tabs.map(t => (
                <button
                    key={t.id}
                    type="button"
                    onClick={() => onChange(t.id)}
                    className={cn(
                        'px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap',
                        active === t.id
                            ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200/80'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                    )}
                >
                    {t.label}
                    {t.count !== undefined && (
                        <span className={cn('ml-1.5 text-xs px-1.5 py-0.5 rounded-md', active === t.id ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-200 text-slate-600')}>
                            {t.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    )
}
