import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'
import type { Notification } from '../types'

export function useNotifications() {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await api.get('/api/notifications')
            return res.data as Notification[]
        },
    })
}

export function useMarkRead() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => api.patch(`/api/notifications/${id}/read`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['notifications'] })
            qc.invalidateQueries({ queryKey: ['unread-count'] })
        },
    })
}

export function useMarkAllRead() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: () => api.patch('/api/notifications/read-all'),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['notifications'] })
            qc.invalidateQueries({ queryKey: ['unread-count'] })
        },
    })
}