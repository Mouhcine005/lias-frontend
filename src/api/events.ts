import api from './axios'
import type { Event } from '../types'

export const eventsApi = {
    all: () => api.get<Event[]>('/api/events'),
    one: (id: number) => api.get<Event>(`/api/events/${id}`),
    mine: () => api.get<Event[]>('/api/events/me'),
    byType: (type: string) => api.get<Event[]>(`/api/events/type/${type}`),
    byStatus: (status: string) => api.get<Event[]>(`/api/events/status/${status}`),
    create: (data: object) => api.post<Event>('/api/events', data),
    update: (id: number, data: object) => api.put<Event>(`/api/events/${id}`, data),
    status: (id: number, status: string) =>
        api.patch<Event>(`/api/events/${id}/status`, null, { params: { status } }),
    remove: (id: number) => api.delete(`/api/events/${id}`),
}
