import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
}

const variants = {
    primary: 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-lg shadow-cyan-500/25 disabled:opacity-50',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80',
    danger: 'bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 text-white shadow-lg shadow-red-500/20',
    ghost: 'bg-transparent hover:bg-slate-100/80 text-slate-600',
    outline: 'bg-white/80 border border-slate-200 hover:border-cyan-400/50 text-slate-700 hover:text-cyan-700',
}

const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-sm rounded-xl',
}

export default function Button({
    variant = 'primary',
    size = 'md',
    loading,
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={disabled || loading}
            className={cn(
                'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-[0.98]',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {loading && (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
            )}
            {children}
        </button>
    )
}
