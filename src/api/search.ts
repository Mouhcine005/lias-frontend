import api from './axios'
import type { SearchResult } from '../types'

export const searchApi = {
    search: (q: string) => api.get<SearchResult[]>('/api/search', { params: { q } }),
}
