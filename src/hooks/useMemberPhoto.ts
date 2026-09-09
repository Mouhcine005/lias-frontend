import { useEffect, useState } from 'react'
import api, { API_BASE } from '../api/axios'

export function useMemberPhoto(memberId?: number) {
    const [src, setSrc] = useState<string | null>(null)

    useEffect(() => {
        if (!memberId) return
        let revoked: string | null = null
        let cancelled = false

        api.get(`/api/members/${memberId}/photo`, { responseType: 'blob' })
            .then((res) => {
                if (cancelled) return
                if (res.data?.size > 0) {
                    revoked = URL.createObjectURL(res.data)
                    setSrc(revoked)
                }
            })
            .catch(() => setSrc(null))

        return () => {
            cancelled = true
            if (revoked) URL.revokeObjectURL(revoked)
        }
    }, [memberId])

    return src
}

export function memberPhotoSrc(memberId: number) {
    return `${API_BASE}/api/members/${memberId}/photo`
}
