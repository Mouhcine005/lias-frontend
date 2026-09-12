import { useQuery } from '@tanstack/react-query'
import { CalendarDays } from 'lucide-react'
import { publicApi } from '../../api'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { formatDate } from '../../lib/utils'

const TYPE_COLORS: Record<string, 'cyan' | 'green' | 'purple' | 'slate'> = {
    CONFERENCE: 'cyan',
    SEMINAR: 'green',
    WORKSHOP: 'purple',
    OTHER: 'slate',
}

export default function PublicActivitiesPage() {
    const { data: events = [], isLoading } = useQuery({
        queryKey: ['public', 'events'],
        queryFn: async () => (await publicApi.events()).data,
    })

    if (isLoading) return <Spinner className="h-64" />

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-1">Activités</h1>
            <p className="text-sm text-slate-400 mb-8">Conférences, séminaires et workshops</p>

            {events.length === 0 ? (
                <EmptyState title="Aucune activité à afficher" icon={CalendarDays} />
            ) : (
                <div className="grid gap-4">
                    {events.map(e => (
                        <Card key={e.id}>
                            <div className="flex flex-wrap gap-2 mb-2">
                                <Badge label={e.type} color={TYPE_COLORS[e.type] ?? 'slate'} />
                                <Badge label={e.status} color="slate" />
                                {e.edition && <Badge label={e.edition} color="violet" />}
                            </div>
                            <h3 className="font-bold text-slate-800">{e.title}</h3>
                            {e.description && <p className="text-sm text-slate-600 mt-1">{e.description}</p>}
                            <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-400">
                                <span>{formatDate(e.startDate)}{e.endDate ? ` – ${formatDate(e.endDate)}` : ''}</span>
                                {e.location && <span>{e.location}</span>}
                                {e.website && (
                                    <a href={e.website} target="_blank" rel="noreferrer" className="text-cyan-600 hover:underline">
                                        Site web
                                    </a>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
