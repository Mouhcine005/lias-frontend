import api from './axios'
import type { AuthResponse, MembershipRequestResponse } from '../types'

export const authApi = {
    login: (email: string, password: string) =>
        api.post<AuthResponse>('/api/auth/login', { email, password }),
    register: (email: string, password: string) =>
        api.post<AuthResponse>('/api/auth/register', { email, password }),
}

// Spec §6 — Gestion des demandes d'adhésion. Public submission, no auth.
export const membershipRequestApi = {
    submit: (form: FormData) =>
        api.post<MembershipRequestResponse>('/api/membership-requests', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    getAll: () => api.get<MembershipRequestResponse[]>('/api/membership-requests'),
    getPending: () => api.get<MembershipRequestResponse[]>('/api/membership-requests/pending'),
    accept: (id: number) => api.post<MembershipRequestResponse>(`/api/membership-requests/${id}/accept`),
    reject: (id: number, reason?: string) =>
        api.post<MembershipRequestResponse>(`/api/membership-requests/${id}/reject`, { reason }),
}