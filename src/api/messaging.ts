import api from './axios'
import type { ThreadRequest, ThreadResponse, MessageRequest, MessageResponse } from '../types'

export const messagingApi = {
    threads: () => api.get<ThreadResponse[]>('/api/messaging/threads'),
    createThread: (data: ThreadRequest) => api.post<ThreadResponse>('/api/messaging/threads', data),
    messages: (threadId: number) => api.get<MessageResponse[]>(`/api/messaging/threads/${threadId}/messages`),
    sendMessage: (threadId: number, data: MessageRequest) =>
        api.post<MessageResponse>(`/api/messaging/threads/${threadId}/messages`, data),
}
