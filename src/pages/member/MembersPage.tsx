import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Search, Users } from 'lucide-react'
import { membersApi } from '../../api/members'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import { Card } from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import { STATUS_LABELS, ROLE_LABELS } from '../../types'
import type { UserRole, UserStatus } from '../../types'

export default function MembersPage() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')

    const { data: members = [], isLoading } = useQuery({
        queryKey: ['admin-members'],
        queryFn: async () => (await membersApi.adminAll()).data,
    })

    const filtered = members.filter(m =>
        `${m.firstName} ${m.lastName} ${m.email}`.toLowerCase().includes(search.toLowerCase())
    )

    if (isLoading) return <Spinner className="h-64" />

    return (
        <div>
            <PageHeader title="Membres du laboratoire" subtitle={`${members.length} membres enregistrés`} />
            <div className="relative mb-6 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher un membre..."
                    className="input-field pl-10"
                />
            </div>

            {filtered.length === 0 ? (
                <EmptyState title="Aucun membre trouvé" icon={Users} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(m => (
                        <Card key={m.userId} hover onClick={() => navigate(`/members/${m.memberId}`)} padding>
                            <div className="flex items-center gap-3">
                                <Avatar memberId={m.memberId} firstName={m.firstName} lastName={m.lastName} email={m.email} />
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-slate-800 truncate">
                                        {m.firstName && m.lastName ? `${m.firstName} ${m.lastName}` : m.email}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate">{m.email}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                <Badge label={STATUS_LABELS[m.userStatus as UserStatus] ?? m.userStatus} color={m.userStatus === 'ACTIVE' ? 'green' : m.userStatus === 'PENDING' ? 'yellow' : 'slate'} />
                                <Badge label={ROLE_LABELS[m.userRole as UserRole] ?? m.userRole} color="cyan" />
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
