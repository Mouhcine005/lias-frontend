import { cn, getInitials } from '../../lib/utils'
import { useMemberPhoto } from '../../hooks/useMemberPhoto'

export default function Avatar({
    memberId,
    firstName,
    lastName,
    email,
    size = 'md',
    className,
}: {
    memberId?: number
    firstName?: string | null
    lastName?: string | null
    email?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}) {
    const photo = useMemberPhoto(memberId)
    const sizes = {
        sm: 'w-8 h-8 text-xs rounded-lg',
        md: 'w-10 h-10 text-sm rounded-xl',
        lg: 'w-16 h-16 text-lg rounded-2xl',
        xl: 'w-24 h-24 text-2xl rounded-2xl',
    }

    if (photo) {
        return (
            <img
                src={photo}
                alt=""
                className={cn(sizes[size], 'object-cover border-2 border-white shadow-md', className)}
            />
        )
    }

    return (
        <div
            className={cn(
                sizes[size],
                'bg-gradient-to-br from-cyan-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20',
                className
            )}
        >
            {getInitials(firstName, lastName, email)}
        </div>
    )
}
