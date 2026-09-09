import api from './axios'
import type { Meeting } from '../types'

export const meetingsApi = {
    all: () => api.get<Meeting[]>('/api/meetings'),
    one: (id: number) => api.get<Meeting>(`/api/meetings/${id}`),
    byStatus: (status: string) => api.get<Meeting[]>(`/api/meetings/status/${status}`),
    create: (data: object) => api.post<Meeting>('/api/meetings', data),
    update: (id: number, data: object) => api.put<Meeting>(`/api/meetings/${id}`, data),
    status: (id: number, status: string) =>
        api.patch<Meeting>(`/api/meetings/${id}/status`, null, { params: { status } }),
    uploadPv: (id: number, file: File) => {
        const form = new FormData()
        form.append('file', file)
        return api.post<Meeting>(`/api/meetings/${id}/pv`, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    downloadPv: (id: number) =>
        api.get(`/api/meetings/${id}/pv/download`, { responseType: 'blob' }),
    remove: (id: number) => api.delete(`/api/meetings/${id}`),
}
