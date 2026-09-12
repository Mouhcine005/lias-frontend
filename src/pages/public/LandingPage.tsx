import { useQuery } from '@tanstack/react-query'
import { publicApi } from '../../api'
import Spinner from '../../components/ui/Spinner'
import { Card } from '../../components/ui/Card'
import { formatDate } from '../../lib/utils'

export default function LandingPage() {
    const { data: labInfo, isLoading } = useQuery({
        queryKey: ['public', 'lab-info'],
        queryFn: async () => (await publicApi.labInfo()).data,
    })

    if (isLoading) return <Spinner className="h-64" />

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-white mb-2">{labInfo?.name}</h1>
            <p className="text-sm text-slate-400 mb-8">{labInfo?.faculty}</p>

            <Card className="mb-6">
                <p className="text-slate-700 leading-relaxed">{labInfo?.presentation}</p>
            </Card>

            {labInfo?.creationDate && (
                <p className="text-xs text-slate-500">
                    Laboratoire créé le {formatDate(labInfo.creationDate)}
                </p>
            )}
        </div>
    )
}
