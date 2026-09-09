import { toast } from 'sonner'

export const notify = {
    success: (msg: string) => toast.success(msg),
    error: (msg: string) => toast.error(msg),
    info: (msg: string) => toast.info(msg),
}

export function apiErrorMessage(err: unknown, fallback = 'Une erreur est survenue') {
    const e = err as { response?: { data?: { message?: string } } }
    return e.response?.data?.message ?? fallback
}
