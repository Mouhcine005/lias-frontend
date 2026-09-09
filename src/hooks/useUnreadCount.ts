import { useQuery } from '@tanstack/react-query'
import { notificationsApi } from '../api'
import { useAuth } from '../context/AuthContext'

export function useUnreadCount() {
    const { token } = useAuth()
    const { data } = useQuery({
        queryKey: ['notifications-unread-count'],
        queryFn: async () => (await notificationsApi.unreadCount()).data.count,
        enabled: !!token,
        refetchInterval: 60_000,
    })
    return { count: data ?? 0 }
}
