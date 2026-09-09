import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Download, Upload, Trash2 } from 'lucide-react'
import { meetingsApi } from '../../api'
import type { Meeting, MeetingStatus } from '../../types'
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
import { formatDate, downloadBlob } from '../../lib/utils'
import { notify, apiErrorMessage } from '../../lib/toast'

const STATUSES: MeetingStatus[] = ['PLANNED', 'COMPLETED', 'CANCELLED']
const emptyForm = { title: '', description: '', location: '', agenda: '', date: '', status: 'PLANNED' as MeetingStatus }

type Tab = 'all' | 'PLANNED' | 'COMPLETED'

export default function MeetingsPage() {
    const { canManageLab } = useAuth()
    const qc = useQueryClient()
    const pvRef = useRef<HTMLInputElement>(null)
    const [pvMeetingId, setPvMeetingId] = useState<number | null>(null)
    const [tab, setTab] = useState<Tab>('all')
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(emptyForm)

    const { data: meetings = [], isLoading } = useQuery({
        queryKey: ['meetings', tab],
        queryFn: async () => tab === 'all'
            ? (await meetingsApi.all()).data
            : (await meetingsApi.byStatus(tab)).data,
    })

    const create = useMutation({
        mutationFn: () => meetingsApi.create(form),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['meetings'] }); setModal(false); setForm(emptyForm); notify.success('Réunion créée') },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })

    const updateStatus = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => meetingsApi.status(id, status),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['meetings'] }),
    })

    const remove = useMutation({
        mutationFn: (id: number) => meetingsApi.remove(id),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['meetings'] }); notify.success('Réunion supprimée') },
    })

    const uploadPv = useMutation({
        mutationFn: ({ id, file }: { id: number; file: File }) => meetingsApi.uploadPv(id, file),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['meetings'] }); notify.success('PV téléversé') },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })

    const downloadPV = async (m: Meeting) => {
        try {
            const res = await meetingsApi.downloadPv(m.id)
            downloadBlob(res.data, m.pvFileName ?? 'pv.pdf')
        } catch (e) {
            notify.error(apiErrorMessage(e))
        }
    }

    if (isLoading) return <Spinner className="h-64" />

    return (
        <div>
            <PageHeader title="Réunions" subtitle="Procès-verbaux et planification"
                action={canManageLab() ? <Button onClick={() => setModal(true)}><Plus className="w-4 h-4" /> Nouvelle réunion</Button> : undefined} />
            <input ref={pvRef} type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={e => {
                const f = e.target.files?.[0]
                if (f && pvMeetingId) uploadPv.mutate({ id: pvMeetingId, file: f })
                e.target.value = ''
            }} />

            <div className="mb-6">
                <Tabs tabs={[
                    { id: 'all' as Tab, label: 'Toutes' },
                    { id: 'PLANNED' as Tab, label: 'Planifiées' },
                    { id: 'COMPLETED' as Tab, label: 'Terminées' },
                ]} active={tab} onChange={setTab} />
            </div>

            {meetings.length === 0 ? <EmptyState title="Aucune réunion" /> : (
                <div className="space-y-4">
                    {meetings.map(m => (
                        <Card key={m.id}>
                            <Badge label={m.status} color={m.status === 'COMPLETED' ? 'green' : m.status === 'CANCELLED' ? 'red' : 'cyan'} />
                            <h3 className="font-bold text-slate-800 text-lg mt-2">{m.title}</h3>
                            <p className="text-sm text-slate-500 mt-1">{formatDate(m.date)}{m.location ? ` · ${m.location}` : ''}</p>
                            {m.agenda && <p className="text-xs text-slate-400 mt-2 line-clamp-2">{m.agenda}</p>}
                            {m.pvFileName && <p className="text-xs text-cyan-600 font-medium mt-2">📄 {m.pvFileName}</p>}

                            <CardActions>
                                {m.pvDownloadUrl && (
                                    <Button variant="outline" size="sm" onClick={() => downloadPV(m)}>
                                        <Download className="w-3.5 h-3.5" /> Télécharger PV
                                    </Button>
                                )}
                                {canManageLab() && (
                                    <>
                                        <Button variant="secondary" size="sm" onClick={() => { setPvMeetingId(m.id); pvRef.current?.click() }}>
                                            <Upload className="w-3.5 h-3.5" /> Déposer PV
                                        </Button>
                                        <select
                                            value={m.status}
                                            onChange={e => updateStatus.mutate({ id: m.id, status: e.target.value })}
                                            className="input-field text-xs py-2 min-w-[130px]"
                                        >
                                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <Button variant="danger" size="sm" onClick={() => remove.mutate(m.id)}>
                                            <Trash2 className="w-3.5 h-3.5" /> Supprimer
                                        </Button>
                                    </>
                                )}
                            </CardActions>
                        </Card>
                    ))}
                </div>
            )}

            <Modal open={modal} onClose={() => setModal(false)} title="Nouvelle réunion" size="lg">
                <div className="space-y-3">
                    {(['title', 'description', 'location'] as const).map(k => (
                        <div key={k}><label className="text-xs font-semibold text-slate-600 capitalize">{k === 'title' ? 'Titre *' : k}</label>
                            <input className="input-field mt-1" value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} /></div>
                    ))}
                    <div><label className="text-xs font-semibold text-slate-600">Ordre du jour</label>
                        <textarea className="input-field mt-1 resize-none" rows={3} value={form.agenda} onChange={e => setForm(p => ({ ...p, agenda: e.target.value }))} /></div>
                    <div><label className="text-xs font-semibold text-slate-600">Date</label>
                        <input type="date" className="input-field mt-1" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
                    <Button onClick={() => create.mutate()} loading={create.isPending} disabled={!form.title}>Créer</Button>
                </div>
            </Modal>
        </div>
    )
}
