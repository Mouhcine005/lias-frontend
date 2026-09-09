import api from './axios'

export const auditApi = {
    all: () => api.get('/api/audit'),
    byEntity: (type: string, id: number) => api.get(`/api/audit/entity/${type}/${id}`),
    byActor: (email: string) => api.get(`/api/audit/actor/${email}`),
}
