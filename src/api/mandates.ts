import api from './axios'
import type { Mandate } from '../types'

export const mandatesApi = {
    all: () => api.get<Mandate[]>('/api/mandates'),
    active: () => api.get<Mandate[]>('/api/mandates/active'),
    director: () => api.get<Mandate>('/api/mandates/director'),
    viceDirector: () => api.get<Mandate>('/api/mandates/vice-director'),
    byMember: (memberId: number) => api.get<Mandate[]>(`/api/mandates/member/${memberId}`),
    byRole: (role: string) => api.get<Mandate[]>(`/api/mandates/role/${role}`),
    create: (data: object) => api.post<Mandate>('/api/mandates', data),
    end: (id: number) => api.patch<Mandate>(`/api/mandates/${id}/end`),
    remove: (id: number) => api.delete(`/api/mandates/${id}`),
}
