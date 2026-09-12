import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Mail, Building2, BookOpen, ArrowLeft, History } from 'lucide-react'
import { membersApi } from '../../api/members'
import { publicationsApi } from '../../api'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import { formatDate } from '../../lib/utils'
import { ROLE_LABELS } from '../../types'
import { useAuth } from '../../context/AuthContext'

export default function MemberDetailPage() {
    const { id } = useParams()
    const memberId = Number(id)
    const { isAdmin, isDirector } = useAuth()
    const canViewHistory = isAdmin() || isDirector()

    const { data: member, isLoading } = useQuery({
        queryKey: ['member', id],
        queryFn: async () => (await membersApi.get(memberId)).data,
        enabled: !!id,
    })

    const { data: affiliations = [] } = useQuery({
        queryKey: ['affiliations', id],
        queryFn: async () => (await membersApi.affiliationsForMember(memberId)).data,
        enabled: !!id,
    })

    const { data: publications = [] } = useQuery({
        queryKey: ['publications-member', id],
        queryFn: async () => (await publicationsApi.byMember(memberId)).data,
        enabled: !!id,
    })

    const { data: roleHistory = [] } = useQuery({
        queryKey: ['role-history', member?.userId],
        queryFn: async () => (await membersApi.roleHistory(member!.userId)).data,
        enabled: canViewHistory && !!member?.userId,
    })

    const { data: statusHistory = [] } = useQuery({
        queryKey: ['status-history', memberId],
        queryFn: async () => (await membersApi.statusHistory(memberId)).data,
        enabled: canViewHistory && !!memberId,
    })

    if (isLoading) return <Spinner className="h-64" />
    if (!member) return <p className="text-slate-500">Membre introuvable</p>

    return (
        <div className="max-w-4xl">
            <Link to="/members" className="inline-flex items-center gap-1 text-sm text-cyan-600 font-medium mb-4 hover:underline">
                <ArrowLeft className="w-4 h-4" /> Retour aux membres
            </Link>
            <PageHeader title="Profil membre" />

            <Card padding={false} className="overflow-hidden mb-6">
                <div className="h-32 bg-gradient-to-r from-lias-900 via-lias-800 to-cyan-700" />
                <div className="px-6 pb-6 -mt-12">
                    <Avatar memberId={member.id} firstName={member.firstName} lastName={member.lastName} email={member.email} size="xl" className="border-4 border-white shadow-xl" />
                    <h2 className="text-2xl font-bold text-slate-900 mt-4">
                        {member.firstName && member.lastName ? `${member.firstName} ${member.lastName}` : member.email}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {member.status && <Badge label={member.status} color="violet" />}
                        <Badge label={ROLE_LABELS[member.role as keyof typeof ROLE_LABELS] ?? member.role} color="cyan" />
                    </div>
                    <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-600"><Mail className="w-4 h-4 text-slate-400" /> {member.email}</div>
                        {member.establishment && <div className="flex items-center gap-2 text-slate-600"><Building2 className="w-4 h-4" /> {member.establishment}</div>}
                        {member.currentLaboratory && <p><span className="text-slate-400">Labo:</span> {member.currentLaboratory}</p>}
                        {member.currentTeam && <p><span className="text-slate-400">Équipe:</span> {member.currentTeam}</p>}
                    </div>
                    {member.biography && <p className="text-sm text-slate-600 mt-4 leading-relaxed border-t pt-4">{member.biography}</p>}
                </div>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="font-bold text-slate-800 mb-3">Affiliations</h3>
                    {affiliations.length === 0 ? <p className="text-sm text-slate-400">Aucune</p> : affiliations.map(a => (
                        <div key={a.id} className="flex justify-between py-2 border-b border-slate-50 last:border-0 text-sm">
                            <span className="font-medium">{a.laboratory}{a.team ? ` · ${a.team}` : ''}</span>
                            <span className="text-slate-400">{formatDate(a.startDate)}</span>
                        </div>
                    ))}
                </Card>
                <Card>
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Publications ({publications.length})</h3>
                    {publications.length === 0 ? <p className="text-sm text-slate-400">Aucune</p> : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {publications.map(p => (
                                <div key={p.id} className="text-sm py-2 border-b border-slate-50 last:border-0">
                                    <p className="font-medium text-slate-700">{p.title}</p>
                                    <p className="text-xs text-slate-400">{p.year} · {p.type}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            {canViewHistory && (
                <div className="grid lg:grid-cols-2 gap-6 mt-6">
                    <Card>
                        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <History className="w-4 h-4" /> Historique des rôles
                        </h3>
                        {roleHistory.length === 0 ? <p className="text-sm text-slate-400">Aucun historique</p> : roleHistory.map(h => (
                            <div key={h.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 text-sm">
                                <div className="flex items-center gap-2">
                                    <Badge label={ROLE_LABELS[h.role as keyof typeof ROLE_LABELS] ?? h.role} color={h.active ? 'cyan' : 'slate'} />
                                    {h.active && <span className="text-[10px] font-bold text-emerald-600 uppercase">Actuel</span>}
                                </div>
                                <span className="text-slate-400 text-xs">
                                    {formatDate(h.startDate)} {h.endDate ? `→ ${formatDate(h.endDate)}` : '→ présent'}
                                </span>
                            </div>
                        ))}
                    </Card>
                    <Card>
                        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <History className="w-4 h-4" /> Historique du statut
                        </h3>
                        {statusHistory.length === 0 ? <p className="text-sm text-slate-400">Aucun historique</p> : statusHistory.map(h => (
                            <div key={h.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 text-sm">
                                <div className="flex items-center gap-2">
                                    <Badge label={h.status} color={h.active ? 'violet' : 'slate'} />
                                    {h.active && <span className="text-[10px] font-bold text-emerald-600 uppercase">Actuel</span>}
                                </div>
                                <span className="text-slate-400 text-xs">
                                    {formatDate(h.startDate)} {h.endDate ? `→ ${formatDate(h.endDate)}` : '→ présent'}
                                </span>
                            </div>
                        ))}
                    </Card>
                </div>
            )}
        </div>
    )
}