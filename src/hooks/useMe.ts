import { useQuery } from '@tanstack/react-query'
import { membersApi } from '../api/members'

export function useMe() {
    return useQuery({
        queryKey: ['me'],
        queryFn: async () => (await membersApi.me()).data,
    })
}
