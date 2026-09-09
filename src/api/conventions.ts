import api from './axios'
import type { Convention } from '../types'

export const conventionsApi = {
    all: () => api.get<Convention[]>('/api/conventions'),
    one: (id: number) => api.get<Convention>(`/api/conventions/${id}`),
    byStatus: (status: string) => api.get<Convention[]>(`/api/conventions/status/${status}`),
    create: (data: object) => api.post<Convention>('/api/conventions', data),
    update: (id: number, data: object) => api.put<Convention>(`/api/conventions/${id}`, data),
    delete: (id: number) => api.delete(`/api/conventions/${id}`),
    uploadDocument: (id: number, file: File) => {
        const form = new FormData()
        form.append('file', file)
        return api.post<Convention>(`/api/conventions/${id}/document`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    downloadDocument: (id: number) =>
        api.get(`/api/conventions/${id}/document`, { responseType: 'blob' }),
}
