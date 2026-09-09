import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, MapPin, Calendar, Trash2, Pencil } from 'lucide-react'
import { eventsApi } from '../../api'
import type { Event, EventStatus, EventType } from '../../types'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import Tabs from '../../components/ui/Tabs'
import CardActions from '../../components/ui/CardActions'
import { Card } from '../../components/ui/Card'
import { formatDate } from '../../lib/utils'
import { notify, apiErrorMessage } from '../../lib/toast'

const STATUSES: EventStatus[] = ['PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED']
const TYPES: EventType[] = ['CONFERENCE', 'SEMINAR', 'WORKSHOP', 'OTHER']
const emptyForm = { title: '', description: '', location: '', edition: '', website: '', startDate: '', endDate: '', type: 'CONFERENCE' as EventType, status: 'PLANNED' as EventStatus }

type FilterTab = 'all' | 'mine' | 'PLANNED' | 'ONGOING'

export default function EventsPage() {
    const { canManageLab } = useAuth()
    const qc = useQueryClient()
    const [tab, setTab] = useState<FilterTab>('all')
    const [modal, setModal] = useState<'create' | 'edit' | null>(null)
    const [editId, setEditId] = useState<number | null>(null)
    const [form, setForm] = useState(emptyForm)

    const { data: events = [], isLoading } = useQuery({
        queryKey: ['events', tab],
        queryFn: async () => {
            if (tab === 'mine') return (await eventsApi.mine()).data
            if (tab === 'PLANNED' || tab === 'ONGOING') return (await eventsApi.byStatus(tab)).data
            return (await eventsApi.all()).data
        },
    })

    const openEdit = (e: Event) => {
        setEditId(e.id)
        setForm({
            title: e.title, description: e.description ?? '', location: e.location ?? '',
            edition: e.edition ?? '', website: e.website ?? '', startDate: e.startDate?.slice(0, 10) ?? '',
            endDate: e.endDate?.slice(0, 10) ?? '', type: e.type, status: e.status,
        })
        setModal('edit')
    }

    const save = useMutation({
        mutationFn: () => modal === 'edit' && editId
            ? eventsApi.update(editId, form)
            : eventsApi.create(form),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['events'] })
            setModal(null); setForm(emptyForm); setEditId(null)
            notify.success(modal === 'edit' ? 'Événement mis à jour' : 'Événement créé')
        },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })

    const updateStatus = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => eventsApi.status(id, status),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
    })

    const remove = useMutation({
        mutationFn: (id: number) => eventsApi.remove(id),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['events'] }); notify.success('Supprimé') },
    })

    if (isLoading) return <Spinner className="h-64" />

    return (
        <div>
            <PageHeader title="Événements" subtitle={`${events.length} événement(s)`}
                action={canManageLab() ? <Button onClick={() => { setModal('create'); setForm(emptyForm) }}><Plus className="w-4 h-4" /> Nouvel événement</Button> : undefined} />

            <div className="mb-6">
                <Tabs tabs={[
                    { id: 'all' as FilterTab, label: 'Tous' },
                    { id: 'mine' as FilterTab, label: 'Mes événements' },
                    { id: 'PLANNED' as FilterTab, label: 'Planifiés' },
                    { id: 'ONGOING' as FilterTab, label: 'En cours' },
                ]} active={tab} onChange={setTab} />
            </div>

            {events.length === 0 ? <EmptyState title="Aucun événement" /> : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {events.map(e => (
                        <Card key={e.id} hover={false}>
                            <div className="flex flex-wrap gap-2 mb-2">
                                <Badge label={e.type} color="cyan" />
                                <Badge label={e.status} color={e.status === 'PLANNED' ? 'blue' : e.status === 'ONGOING' ? 'green' : 'slate'} />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">{e.title}</h3>
                            {e.description && <p className="text-sm text-slate-500 mt-2 line-clamp-2">{e.description}</p>}
                            <div className="flex flex-col gap-1 mt-3 text-xs text-slate-500">
                                {e.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 shrink-0" />{e.location}</span>}
                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 shrink-0" />{formatDate(e.startDate)}{e.endDate ? ` → ${formatDate(e.endDate)}` : ''}</span>
                            </div>
                            {canManageLab() && (
                                <CardActions>
                                    <select
                                        value={e.status}
                                        onChange={ev => updateStatus.mutate({ id: e.id, status: ev.target.value })}
                                        className="input-field text-xs py-2 min-w-[140px] flex-1 sm:flex-none sm:max-w-[160px]"
                                    >
                                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <Button variant="outline" size="sm" onClick={() => openEdit(e)}><Pencil className="w-3.5 h-3.5" /> Modifier</Button>
                                    <Button variant="danger" size="sm" onClick={() => remove.mutate(e.id)}><Trash2 className="w-3.5 h-3.5" /> Supprimer</Button>
                                </CardActions>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            <Modal open={modal !== null} onClose={() => setModal(null)} title={modal === 'edit' ? 'Modifier l\'événement' : 'Créer un événement'} size="lg">
                <div className="space-y-3">
                    <div><label className="text-xs font-semibold text-slate-600">Titre *</label>
                        <input className="input-field mt-1" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
                    <div><label className="text-xs font-semibold text-slate-600">Description</label>
                        <textarea className="input-field mt-1 resize-none" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <div><label className="text-xs font-semibold text-slate-600">Lieu</label>
                            <input className="input-field mt-1" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} /></div>
                        <div><label className="text-xs font-semibold text-slate-600">Édition</label>
                            <input className="input-field mt-1" value={form.edition} onChange={e => setForm(p => ({ ...p, edition: e.target.value }))} /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <div><label className="text-xs font-semibold text-slate-600">Début</label>
                            <input type="date" className="input-field mt-1" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} /></div>
                        <div><label className="text-xs font-semibold text-slate-600">Fin</label>
                            <input type="date" className="input-field mt-1" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <select className="input-field" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as EventType }))}>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
                        <select className="input-field" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as EventStatus }))}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button onClick={() => save.mutate()} loading={save.isPending} disabled={!form.title}>Enregistrer</Button>
                        <Button variant="secondary" onClick={() => setModal(null)}>Annuler</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
