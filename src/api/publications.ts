import api from './axios'
import type { Publication } from '../types'

export const publicationsApi = {
    all: () => api.get<Publication[]>('/api/publications'),
    byYear: (year: number) => api.get<Publication[]>(`/api/publications/year/${year}`),
    byTeam: (team: string) => api.get<Publication[]>(`/api/publications/team/${team}`),
    mine: () => api.get<Publication[]>('/api/publications/me'),
    byMember: (id: number) => api.get<Publication[]>(`/api/publications/member/${id}`),
    create: (data: object) => api.post<Publication>('/api/publications', data),
    update: (id: number, data: object) => api.put<Publication>(`/api/publications/${id}`, data),
    remove: (id: number) => api.delete(`/api/publications/${id}`),
}
