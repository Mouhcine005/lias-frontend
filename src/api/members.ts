import api from './axios'
import type { AdminMember, MemberProfile, Affiliation, RoleHistoryEntry, MemberStatusHistoryEntry } from '../types'

export const membersApi = {
    me: () => api.get<MemberProfile>('/api/members/me'),
    updateMe: (data: Partial<MemberProfile>) => api.put<MemberProfile>('/api/members/me', data),
    get: (id: number) => api.get<MemberProfile>(`/api/members/${id}`),
    uploadPhoto: (file: File) => {
        const form = new FormData()
        form.append('photo', file)
        return api.post<MemberProfile>('/api/members/me/photo', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    photoUrl: (id: number) => `/api/members/${id}/photo`,
    adminAll: () => api.get<AdminMember[]>('/api/admin/members'),
    adminPending: () => api.get<AdminMember[]>('/api/admin/members/pending'),
    approve: (userId: number) => api.patch<AdminMember>(`/api/admin/members/${userId}/approve`),
    reject: (userId: number) => api.patch<AdminMember>(`/api/admin/members/${userId}/reject`),
    freeze: (userId: number) => api.patch<AdminMember>(`/api/admin/members/${userId}/freeze`),
    activate: (userId: number) => api.patch<AdminMember>(`/api/admin/members/${userId}/activate`),
    changeRole: (userId: number, role: string) =>
        api.patch<AdminMember>(`/api/admin/members/${userId}/role`, null, { params: { role } }),
    changeStatus: (memberId: number, status: string) =>
        api.patch<AdminMember>(`/api/admin/members/${memberId}/status`, null, { params: { status } }),
    roleHistory: (userId: number) =>
        api.get<RoleHistoryEntry[]>(`/api/admin/members/${userId}/role-history`),
    statusHistory: (memberId: number) =>
        api.get<MemberStatusHistoryEntry[]>(`/api/admin/members/${memberId}/status-history`),
    affiliationsMe: () => api.get<Affiliation[]>('/api/affiliations/me'),
    affiliationsForMember: (memberId: number) =>
        api.get<Affiliation[]>(`/api/affiliations/member/${memberId}`),
    addAffiliation: (memberId: number, data: { laboratory: string; team?: string; startDate: string }) =>
        api.post<Affiliation>(`/api/affiliations/member/${memberId}`, data),
    closeAffiliation: (memberId: number) =>
        api.patch<Affiliation>(`/api/affiliations/member/${memberId}/close`),
}