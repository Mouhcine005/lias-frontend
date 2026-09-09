import api from './axios'

export const reportsApi = {
    annual: (year: number) =>
        api.get('/api/report/annual', { params: { year }, responseType: 'blob' }),
    monthly: (year: number, month: number) =>
        api.get('/api/report/monthly', { params: { year, month }, responseType: 'blob' }),
}
