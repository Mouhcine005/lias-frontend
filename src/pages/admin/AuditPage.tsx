import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, ScrollText } from 'lucide-react'
import { auditApi } from '../../api'
import Spinner from '../../components/ui/Spinner'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import { formatDate } from '../../lib/utils'
import type { AuditLog } from '../../types'

export default function AuditPage() {
    const { data: logs = [] } = useQuery({
        queryKey: ['audit'],
        queryFn: async () => (await auditApi.all()).data as AuditLog[],
    })

    const [search, setSearch] = useState('')
    const [entityType, setEntityType] = useState('')
    const [actor, setActor] = useState('')

    const entityTypes = Array.from(new Set(logs.map((l) => l.entityType).filter(Boolean)))

    const filtered = logs.filter((log: AuditLog) => {
        if (search) {
            const q = search.toLowerCase()
            if (!(
                log.action.toLowerCase().includes(q) ||
                log.entityType.toLowerCase().includes(q) ||
                log.actor.toLowerCase().includes(q)
            )) return false
        }
        if (entityType && log.entityType !== entityType) return false
        if (actor && !log.actor.toLowerCase().includes(actor.toLowerCase())) return false
        return true
    })

    if (logs.length === 0 && !search) return <Spinner className="h-64" />

    return (
        <div>
            <PageHeader
                title="Journal d'audit"
                subtitle="Historique des actions du système"
                badge={
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold mb-2">
                        <ScrollText className="w-3 h-3" /> AUDIT
                    </span>
                }
            />

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Rechercher..."
                        className="input-field pl-10 w-full"
                    />
                </div>
                <select value={entityType} onChange={e => setEntityType(e.target.value)} className="input-field">
                    <option value="">Tous les types</option>
                    {entityTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input
                    value={actor}
                    onChange={e => setActor(e.target.value)}
                    placeholder="Acteur (email)..."
                    className="input-field"
                />
            </div>

            {filtered.length === 0 ? (
                <EmptyState title="Aucun log d'audit" icon={ScrollText} />
            ) : (
                <div className="space-y-3">
                    {filtered.map((log: AuditLog, i: number) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                        >
                            <Card>
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <Badge label={log.action} color="cyan" />
                                            <span className="text-xs text-slate-500">{log.entityType} #{log.entityId}</span>
                                        </div>
                                        <p className="text-sm text-slate-700 truncate">{log.actor}</p>
                                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{log.changes}</p>
                                    </div>
                                    <p className="text-xs text-slate-400 whitespace-nowrap">{formatDate(log.timestamp)}</p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
