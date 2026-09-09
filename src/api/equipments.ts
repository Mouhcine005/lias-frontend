import api from './axios'
import type { Equipment, EquipmentAssignment, EquipmentRequest } from '../types'

export const equipmentApi = {
    all: (search?: string) =>
        api.get<Equipment[]>('/api/equipment', { params: search ? { search } : {} }),
    one: (id: number) => api.get<Equipment>(`/api/equipment/${id}`),
    available: () => api.get<Equipment[]>('/api/equipment/available'),
    create: (data: object) => api.post<Equipment>('/api/equipment', data),
    update: (id: number, data: object) => api.put<Equipment>(`/api/equipment/${id}`, data),
    remove: (id: number) => api.delete(`/api/equipment/${id}`),
    assignments: () => api.get<EquipmentAssignment[]>('/api/equipment/assignments'),
    assignmentsForMember: (memberId: number) =>
        api.get<EquipmentAssignment[]>(`/api/equipment/assignments/member/${memberId}`),
    assignmentsForEquipment: (equipmentId: number) =>
        api.get<EquipmentAssignment[]>(`/api/equipment/${equipmentId}/assignments`),
    membersWithoutEquipment: () => api.get<number[]>('/api/equipment/assignments/no-equipment'),
    assign: (data: object) => api.post('/api/equipment/assignments', data),
    returnAssignment: (id: number, returnNote?: string) =>
        api.patch(`/api/equipment/assignments/${id}/return`, returnNote ? { returnNote } : {}),
    myRequests: () => api.get<EquipmentRequest[]>('/api/equipment/requests/my'),
    allRequests: (status?: string) =>
        api.get<EquipmentRequest[]>('/api/equipment/requests', { params: status ? { status } : {} }),
    submitRequest: (data: object) => api.post<EquipmentRequest>('/api/equipment/requests', data),
    validateRequest: (id: number, data: object) =>
        api.patch<EquipmentRequest>(`/api/equipment/requests/${id}/validate`, data),
}
