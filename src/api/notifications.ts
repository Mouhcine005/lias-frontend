import api from './axios'
import type { Notification } from '../types'

export const notificationsApi = {
    all: () => api.get<Notification[]>('/api/notifications'),
    unread: () => api.get<Notification[]>('/api/notifications/unread'),
    unreadCount: () => api.get<{ count: number }>('/api/notifications/unread/count'),
    markRead: (id: number) => api.patch(`/api/notifications/${id}/read`),
    markAllRead: () => api.patch('/api/notifications/read-all'),
}
