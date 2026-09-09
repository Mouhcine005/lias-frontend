import api from './axios'
import type { CalendarEvent } from '../types'

export const calendarApi = {
    events: (from?: string, to?: string) =>
        api.get<CalendarEvent[]>('/api/calendar', {
            params: { from, to },
        }),
}
