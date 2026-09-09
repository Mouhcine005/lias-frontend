import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, ScrollText, Crown } from 'lucide-react'
import { mandatesApi } from '../../api'
import type { Mandate, MandateRole } from '../../types'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import Tabs from '../../components/ui/Tabs'
import { Card } from '../../components/ui/Card'
import { formatDate } from '../../lib/utils'
import { notify, apiErrorMessage } from '../../lib/toast'

const ROLES: MandateRole[] = ['DIRECTOR', 'VICE_DIRECTOR', 'TEAM_LEADER', 'TEAM_MEMBER']
const emptyForm = { memberId: 0, role: 'DIRECTOR' as MandateRole, startDate: '', endDate: '', team: '' }

type Tab = 'all' | 'active'

export default function MandatesPage() {
    const qc = useQueryClient()
    const [tab, setTab] = useState<Tab>('active')
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(emptyForm)

    const { data: mandates = [], isLoading } = useQuery({
        queryKey: ['mandates', tab],
        queryFn: async () => tab === 'active'
            ? (await mandatesApi.active()).data
            : (await mandatesApi.all()).data,
    })

    const { data: director } = useQuery({
        queryKey: ['mandate-director'],
        queryFn: async () => { try { return (await mandatesApi.director()).data } catch { return null } },
    })

    const { data: viceDirector } = useQuery({
        queryKey: ['mandate-vice'],
        queryFn: async () => { try { return (await mandatesApi.viceDirector()).data } catch { return null } },
    })

    const create = useMutation({
        mutationFn: () => mandatesApi.create(form),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['mandates'] }); setModal(false); notify.success('Mandat créé') },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })

    const endMandate = useMutation({
        mutationFn: (id: number) => mandatesApi.end(id),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['mandates'] }); notify.success('Mandat clôturé') },
    })

    const remove = useMutation({
        mutationFn: (id: number) => mandatesApi.remove(id),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['mandates'] }); notify.success('Mandat supprimé') },
    })

    if (isLoading) return <Spinner className="h-64" />

    return (
        <div>
            <PageHeader title="Mandats & gouvernance" subtitle="Direction et organisation du laboratoire"
                action={<Button onClick={() => setModal(true)}><Plus className="w-4 h-4" /> Nouveau mandat</Button>} />

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[director, viceDirector].map((m, i) => m ? (
                    <div key={i} className="glass-card rounded-2xl p-5 border-cyan-200/40 bg-gradient-to-br from-cyan-50/80 to-white">
                        <div className="flex items-center gap-2 mb-2">
                            <Crown className="w-5 h-5 text-amber-500" />
                            <Badge label={m.role} color="cyan" />
                        </div>
                        <p className="font-bold text-slate-900">{m.memberFirstName} {m.memberLastName}</p>
                        <p className="text-xs text-slate-500">{m.memberEmail}</p>
                    </div>
                ) : null)}
            </div>

            <div className="mb-6">
                <Tabs tabs={[
                    { id: 'active' as Tab, label: 'Actifs' },
                    { id: 'all' as Tab, label: 'Historique' },
                ]} active={tab} onChange={setTab} />
            </div>

            {mandates.length === 0 ? <EmptyState title="Aucun mandat" icon={ScrollText} /> : (
                <div className="grid gap-4 md:grid-cols-2">
                    {mandates.map((m: Mandate) => (
                        <Card key={m.id}>
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-2">
                                    <Badge label={m.role} color="cyan" />
                                    <Badge label={m.active ? 'Actif' : 'Terminé'} color={m.active ? 'green' : 'slate'} />
                                </div>
                                <p className="font-bold text-slate-800">{m.memberFirstName} {m.memberLastName}</p>
                                {m.team && <p className="text-xs text-slate-500">Équipe {m.team}</p>}
                                <p className="text-xs text-slate-400">{formatDate(m.startDate)} → {m.endDate ? formatDate(m.endDate) : 'présent'}</p>
                                <div className="flex gap-2 pt-2 border-t border-slate-100">
                                    {m.active && <Button size="sm" variant="secondary" onClick={() => endMandate.mutate(m.id)}>Clôturer</Button>}
                                    <Button size="sm" variant="ghost" onClick={() => remove.mutate(m.id)}>Supprimer</Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Modal open={modal} onClose={() => setModal(false)} title="Nouveau mandat">
                <div className="space-y-3">
                    <div><label className="text-xs font-semibold text-slate-600">ID membre</label>
                        <input type="number" className="input-field mt-1" value={form.memberId || ''} onChange={e => setForm(p => ({ ...p, memberId: +e.target.value }))} /></div>
                    <select className="input-field" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as MandateRole }))}>{ROLES.map(r => <option key={r}>{r}</option>)}</select>
                    <input className="input-field" placeholder="Équipe" value={form.team} onChange={e => setForm(p => ({ ...p, team: e.target.value }))} />
                    <input type="date" className="input-field" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
                    <Button onClick={() => create.mutate()} loading={create.isPending} disabled={!form.memberId}>Créer</Button>
                </div>
            </Modal>
        </div>
    )
}
