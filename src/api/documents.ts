import api from './axios'
import type { Document } from '../types'

export const documentsApi = {
    all: () => api.get<Document[]>('/api/documents'),
    mine: () => api.get<Document[]>('/api/documents/me'),
    byType: (type: string) => api.get<Document[]>(`/api/documents/type/${type}`),
    byEvent: (eventId: number) => api.get<Document[]>(`/api/documents/event/${eventId}`),
    update: (id: number, data: object) => api.put<Document>(`/api/documents/${id}`, data),
    upload: (file: File, type: string, description?: string, eventId?: number) => {
        const form = new FormData()
        form.append('file', file)
        form.append('type', type)
        if (description) form.append('description', description)
        if (eventId) form.append('eventId', String(eventId))
        return api.post<Document>('/api/documents', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    download: (id: number) =>
        api.get(`/api/documents/${id}/download`, { responseType: 'blob' }),
    remove: (id: number) => api.delete(`/api/documents/${id}`),
}
