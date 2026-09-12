import { useQuery } from '@tanstack/react-query'
import { Users } from 'lucide-react'
import { publicApi } from '../../api'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { getInitials } from '../../lib/utils'

const STATUS_COLORS: Record<string, 'cyan' | 'purple' | 'orange'> = {
    PERMANENT: 'cyan',
    ASSOCIATE: 'purple',
    DOCTORAL: 'orange',
}

export default function PublicTeamsPage() {
    const { data: members = [], isLoading } = useQuery({
        queryKey: ['public', 'teams'],
        queryFn: async () => (await publicApi.teams()).data,
    })

    if (isLoading) return <Spinner className="h-64" />

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-1">Équipes</h1>
            <p className="text-sm text-slate-400 mb-8">Membres du laboratoire LIAS</p>

            {members.length === 0 ? (
                <EmptyState title="Aucun membre à afficher" icon={Users} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map(m => (
                        <Card key={m.id}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-11 h-11 rounded-full bg-cyan-500/10 text-cyan-700 font-bold flex items-center justify-center text-sm">
                                    {getInitials(m.firstName, m.lastName)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{m.firstName} {m.lastName}</h3>
                                    {m.establishment && <p className="text-xs text-slate-500">{m.establishment}</p>}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                                <Badge label={m.status} color={STATUS_COLORS[m.status] ?? 'slate'} />
                                {m.team && <Badge label={m.team} color="violet" />}
                            </div>
                            {m.biography && <p className="text-sm text-slate-600 mt-2 line-clamp-3">{m.biography}</p>}
                            {m.interests && <p className="text-xs text-slate-400 mt-2 italic">{m.interests}</p>}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
