import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, BookOpen } from 'lucide-react'
import { publicApi } from '../../api'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'

const TYPE_COLORS: Record<string, 'cyan' | 'green' | 'purple' | 'orange' | 'slate'> = {
    JOURNAL: 'cyan', CONFERENCE: 'green', BOOK: 'purple', THESIS: 'orange', OTHER: 'slate',
}

export default function PublicPublicationsPage() {
    const [search, setSearch] = useState('')

    const { data: publications = [], isLoading } = useQuery({
        queryKey: ['public', 'publications'],
        queryFn: async () => (await publicApi.publications()).data,
    })

    const filtered = publications.filter(p =>
        `${p.title} ${p.authors} ${p.journal}`.toLowerCase().includes(search.toLowerCase())
    )

    if (isLoading) return <Spinner className="h-64" />

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-1">Publications</h1>
            <p className="text-sm text-slate-400 mb-6">Production scientifique du laboratoire</p>

            <div className="relative mb-6 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher..."
                    className="input-field pl-10"
                />
            </div>

            {filtered.length === 0 ? (
                <EmptyState title="Aucune publication à afficher" icon={BookOpen} />
            ) : (
                <div className="grid gap-4">
                    {filtered.map(p => (
                        <Card key={p.id}>
                            <div className="flex flex-wrap gap-2 mb-2">
                                <Badge label={p.type} color={TYPE_COLORS[p.type] ?? 'slate'} />
                                <span className="text-xs font-bold text-slate-400">{p.year}</span>
                                {p.team && <Badge label={p.team} color="violet" />}
                            </div>
                            <h3 className="font-bold text-slate-800">{p.title}</h3>
                            {p.authors && <p className="text-sm text-slate-500 mt-1">{p.authors}</p>}
                            {(p.journal || p.conference) && (
                                <p className="text-xs text-slate-400 italic mt-1">{p.journal || p.conference}</p>
                            )}
                            <p className="text-xs text-slate-400 mt-2">{p.memberFirstName} {p.memberLastName}</p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
