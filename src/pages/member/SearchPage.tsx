import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { searchApi } from '../../api'
import PageHeader from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'

const TYPE_COLORS: Record<string, string> = {
    MEMBER: 'cyan',
    DOCUMENT: 'blue',
    EVENT: 'green',
    PUBLICATION: 'violet',
}

const DEBOUNCE_MS = 300

export default function SearchPage() {
    const [q, setQ] = useState('')
    const [debouncedQ, setDebouncedQ] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQ(q), DEBOUNCE_MS)
        return () => clearTimeout(timer)
    }, [q])

    const { data: results = [], isLoading } = useQuery({
        queryKey: ['search', debouncedQ],
        queryFn: () => searchApi.search(debouncedQ).then(r => r.data),
        enabled: debouncedQ.length > 0,
    })

    if (!debouncedQ) {
        return (
            <div>
                <PageHeader title="Recherche" subtitle="Rechercher des membres, documents, événements et publications" />
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input value={q} onChange={e => setQ(e.target.value)} placeholder="Tapez un terme pour rechercher..." className="input-field pl-10" />
                </div>
                <EmptyState title="Recherche globale" icon={Search} />
            </div>
        )
    }

    if (isLoading) return <Spinner className="h-64" />

    return (
        <div>
            <PageHeader title="Recherche" subtitle="Rechercher des membres, documents, événements et publications" />
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher..." className="input-field pl-10" />
            </div>
            {results.length === 0 ? (
                <EmptyState title="Aucun résultat" icon={Search} description={`Aucun résultat pour « ${debouncedQ} »`} />
            ) : (
                <div className="grid gap-4">
                    {results.map(r => (
                        <Card key={`${r.type}-${r.id}`}>
                            <div className="flex flex-wrap gap-2 mb-2">
                                <Badge label={r.type} color={TYPE_COLORS[r.type] ?? 'slate'} />
                            </div>
                            <h3 className="font-bold text-slate-800">{r.title}</h3>
                            <p className="text-sm text-slate-500 mt-1">{r.subtitle}</p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
