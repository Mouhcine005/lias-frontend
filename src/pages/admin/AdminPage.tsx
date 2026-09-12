import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Shield, UserCheck, UserX, Snowflake, FileText, Download } from 'lucide-react'
import { membersApi } from '../../api/members'
import { membershipRequestApi } from '../../api/auth'
import type { AdminMember, MemberStatus, UserRole, UserStatus, MembershipRequestResponse } from '../../types'
import { STATUS_LABELS, ROLE_LABELS } from '../../types'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import Tabs from '../../components/ui/Tabs'
import { Card } from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import { notify, apiErrorMessage } from '../../lib/toast'
import { formatDate } from '../../lib/utils'

const STATUS_COLORS: Record<string, 'green' | 'yellow' | 'orange' | 'red'> = {
    ACTIVE: 'green', PENDING: 'yellow', FROZEN: 'orange', DISABLED: 'red',
}
const MEMBER_STATUSES: MemberStatus[] = ['PERMANENT', 'ASSOCIATE', 'DOCTORAL', 'RETIRED', 'FORMER']

export default function AdminPage() {
    const qc = useQueryClient()
    const [tab, setTab] = useState<'requests' | 'pending' | 'all'>('requests')

    const { data: allMembers = [], isLoading } = useQuery({
        queryKey: ['admin-members'],
        queryFn: async () => (await membersApi.adminAll()).data,
    })

    const { data: pending = [] } = useQuery({
        queryKey: ['admin-pending'],
        queryFn: async () => (await membersApi.adminPending()).data,
    })

    const { data: requests = [] } = useQuery({
        queryKey: ['membership-requests'],
        queryFn: async () => (await membershipRequestApi.getPending()).data,
    })

    const invalidate = () => {
        qc.invalidateQueries({ queryKey: ['admin-members'] })
        qc.invalidateQueries({ queryKey: ['admin-pending'] })
    }

    const invalidateRequests = () => qc.invalidateQueries({ queryKey: ['membership-requests'] })

    const acceptRequest = useMutation({
        mutationFn: (id: number) => membershipRequestApi.accept(id),
        onSuccess: () => { invalidateRequests(); invalidate(); notify.success('Demande acceptée — compte créé') },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })
    const rejectRequest = useMutation({
        mutationFn: ({ id, reason }: { id: number; reason?: string }) => membershipRequestApi.reject(id, reason),
        onSuccess: () => { invalidateRequests(); notify.success('Demande rejetée') },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })

    const approve = useMutation({ mutationFn: (id: number) => membersApi.approve(id), onSuccess: () => { invalidate(); notify.success('Membre approuvé') }, onError: (e) => notify.error(apiErrorMessage(e)) })
    const reject = useMutation({ mutationFn: (id: number) => membersApi.reject(id), onSuccess: () => { invalidate(); notify.success('Demande rejetée') }, onError: (e) => notify.error(apiErrorMessage(e)) })
    const freeze = useMutation({ mutationFn: (id: number) => membersApi.freeze(id), onSuccess: () => { invalidate(); notify.success('Compte gelé') }, onError: (e) => notify.error(apiErrorMessage(e)) })
    const activate = useMutation({ mutationFn: (id: number) => membersApi.activate(id), onSuccess: () => { invalidate(); notify.success('Compte activé') }, onError: (e) => notify.error(apiErrorMessage(e)) })
    const changeRole = useMutation({
        mutationFn: ({ userId, role }: { userId: number; role: string }) => membersApi.changeRole(userId, role),
        onSuccess: () => { invalidate(); notify.success('Rôle mis à jour') },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })
    const changeMemberStatus = useMutation({
        mutationFn: ({ memberId, status }: { memberId: number; status: string }) => membersApi.changeStatus(memberId, status),
        onSuccess: () => { invalidate(); notify.success('Statut membre mis à jour') },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })

    if (isLoading) return <Spinner className="h-64" />

    const displayed = tab === 'pending' ? pending : allMembers

    return (
        <div>
            <PageHeader title="Administration" subtitle="Gestion des comptes membres"
                        badge={<span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold mb-2"><Shield className="w-3 h-3" /> ADMIN</span>} />

            <div className="mb-6">
                <Tabs tabs={[
                    { id: 'requests' as const, label: "Demandes d'adhésion", count: requests.length },
                    { id: 'pending' as const, label: 'En attente', count: pending.length },
                    { id: 'all' as const, label: 'Tous les membres', count: allMembers.length },
                ]} active={tab} onChange={setTab} />
            </div>

            {tab === 'requests' ? (
                requests.length === 0 ? <EmptyState title="Aucune demande d'adhésion" icon={FileText} /> : (
                    <div className="space-y-4">
                        {requests.map((r: MembershipRequestResponse) => (
                            <Card key={r.id}>
                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-900 text-lg">
                                            {r.firstName} {r.lastName}
                                        </p>
                                        <p className="text-sm text-slate-500">{r.email}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <Badge label={r.requestedStatus} color="violet" />
                                            {r.establishment && <Badge label={r.establishment} color="slate" />}
                                        </div>
                                        {r.motivationLetter && (
                                            <p className="text-sm text-slate-600 mt-3 leading-relaxed">{r.motivationLetter}</p>
                                        )}
                                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                                            <span>Soumise le {formatDate(r.submittedAt)}</span>
                                            {r.cvOriginalFilename && (
                                                <span className="inline-flex items-center gap-1">
                                                    <Download className="w-3 h-3" /> {r.cvOriginalFilename}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex lg:flex-col gap-2 lg:w-48 shrink-0">
                                        <Button size="sm" className="flex-1" onClick={() => acceptRequest.mutate(r.id)}>
                                            <UserCheck className="w-3.5 h-3.5" /> Accepter
                                        </Button>
                                        <Button size="sm" variant="danger" className="flex-1" onClick={() => {
                                            const reason = window.prompt('Motif du rejet (optionnel) :') ?? undefined
                                            rejectRequest.mutate({ id: r.id, reason })
                                        }}>
                                            <UserX className="w-3.5 h-3.5" /> Rejeter
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )
            ) : displayed.length === 0 ? <EmptyState title={tab === 'pending' ? 'Aucune demande' : 'Aucun membre'} /> : (
                <div className="space-y-4">
                    {displayed.map((m: AdminMember) => (
                        <Card key={m.userId}>
                            <div className="flex flex-col xl:flex-row gap-6">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <Avatar memberId={m.memberId} firstName={m.firstName} lastName={m.lastName} email={m.email} size="lg" />
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-900 text-lg truncate">
                                            {m.firstName && m.lastName ? `${m.firstName} ${m.lastName}` : m.email}
                                        </p>
                                        <p className="text-sm text-slate-500 truncate">{m.email}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <Badge label={STATUS_LABELS[m.userStatus as UserStatus] ?? m.userStatus} color={STATUS_COLORS[m.userStatus] ?? 'slate'} />
                                            <Badge label={ROLE_LABELS[m.userRole as UserRole] ?? m.userRole} color="cyan" />
                                            {m.memberStatus && <Badge label={m.memberStatus} color="violet" />}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 xl:w-80 shrink-0">
                                    <div className="grid grid-cols-2 gap-2">
                                        {m.userStatus === 'PENDING' && (
                                            <>
                                                <Button size="sm" onClick={() => approve.mutate(m.userId)}><UserCheck className="w-3.5 h-3.5" /> Approuver</Button>
                                                <Button size="sm" variant="danger" onClick={() => reject.mutate(m.userId)}><UserX className="w-3.5 h-3.5" /> Rejeter</Button>
                                            </>
                                        )}
                                        {m.userStatus === 'ACTIVE' && (
                                            <Button size="sm" variant="secondary" className="col-span-2" onClick={() => freeze.mutate(m.userId)}><Snowflake className="w-3.5 h-3.5" /> Geler le compte</Button>
                                        )}
                                        {(m.userStatus === 'FROZEN' || m.userStatus === 'DISABLED') && (
                                            <Button size="sm" className="col-span-2" onClick={() => activate.mutate(m.userId)}>Réactiver</Button>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Rôle utilisateur</label>
                                        <select value={m.userRole} onChange={e => changeRole.mutate({ userId: m.userId, role: e.target.value })} className="input-field mt-1 text-sm w-full">
                                            {(['MEMBER', 'DOCTORAL', 'DIRECTOR', 'ADMIN'] as UserRole[]).map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Statut membre LIAS</label>
                                        <select
                                            value={m.memberStatus ?? 'PERMANENT'}
                                            onChange={e => changeMemberStatus.mutate({ memberId: m.memberId, status: e.target.value })}
                                            className="input-field mt-1 text-sm w-full"
                                        >
                                            {MEMBER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}