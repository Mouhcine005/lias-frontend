import api from './axios'
import type { LabInfo, PublicMember, PublicEvent, PublicPublication } from '../types'

// Calls to /api/public/** never carry a JWT and never trigger the 401 →
// /login redirect in axios.ts's interceptor, since these routes are
// permitAll() on the backend and anonymous visitors should never be bounced.
export const publicApi = {
    labInfo: () => api.get<LabInfo>('/api/public/lab-info'),
    teams: () => api.get<PublicMember[]>('/api/public/teams'),
    events: () => api.get<PublicEvent[]>('/api/public/events'),
    publications: () => api.get<PublicPublication[]>('/api/public/publications'),
}
