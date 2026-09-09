import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Check, X, Package, ClipboardList, Link2 } from 'lucide-react'
import { equipmentApi } from '../../api'
import type { Equipment, EquipmentAssignment, EquipmentCondition, EquipmentRequest } from '../../types'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import Tabs from '../../components/ui/Tabs'
import { Card } from '../../components/ui/Card'
import { notify, apiErrorMessage } from '../../lib/toast'

const CONDITIONS: EquipmentCondition[] = ['NEW', 'GOOD', 'FAIR', 'POOR', 'OUT_OF_SERVICE']
const emptyForm = { name: '', description: '', serialNumber: '', quantity: 1, arrivalDate: new Date().toISOString().slice(0, 10), condition: 'NEW' as EquipmentCondition, notes: '' }

type Tab = 'inventory' | 'requests' | 'assignments'

export default function EquipmentAdminPage() {
    const qc = useQueryClient()
    const [tab, setTab] = useState<Tab>('requests')
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [search, setSearch] = useState('')

    const { data: equipment = [] } = useQuery({
        queryKey: ['equipment', search],
        queryFn: async () => (await equipmentApi.all(search || undefined)).data,
    })

    const { data: available = [] } = useQuery({
        queryKey: ['equipment-available'],
        queryFn: async () => (await equipmentApi.available()).data,
    })

    const { data: requests = [] } = useQuery({
        queryKey: ['equipment-requests'],
        queryFn: async () => (await equipmentApi.allRequests('PENDING')).data,
    })

    const { data: assignments = [] } = useQuery({
        queryKey: ['equipment-assignments'],
        queryFn: async () => (await equipmentApi.assignments()).data,
        enabled: tab === 'assignments',
    })

    const create = useMutation({
        mutationFn: () => equipmentApi.create(form),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['equipment'] }); setModal(false); setForm(emptyForm); notify.success('Équipement ajouté') },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })

    const validate = useMutation({
        mutationFn: ({ id, decision, equipmentId }: { id: number; decision: 'APPROVED' | 'REJECTED'; equipmentId?: number }) =>
            equipmentApi.validateRequest(id, { decision, equipmentId }),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['equipment-requests'] }); notify.success('Demande traitée') },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })

    const returnAssign = useMutation({
        mutationFn: (id: number) => equipmentApi.returnAssignment(id),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['equipment-assignments'] }); notify.success('Retour enregistré') },
    })

    const remove = useMutation({
        mutationFn: (id: number) => equipmentApi.remove(id),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['equipment'] }); notify.success('Supprimé') },
    })

    const pending = requests.filter((r: EquipmentRequest) => r.status === 'PENDING')

    return (
        <div>
            <PageHeader title="Gestion des équipements" subtitle={`${available.length} disponible(s) · ${pending.length} demande(s)`}
                action={tab === 'inventory' ? <Button onClick={() => setModal(true)}><Plus className="w-4 h-4" /> Ajouter</Button> : undefined} />

            <div className="mb-6">
                <Tabs tabs={[
                    { id: 'requests' as Tab, label: 'Demandes', count: pending.length },
                    { id: 'inventory' as Tab, label: 'Inventaire', count: equipment.length },
                    { id: 'assignments' as Tab, label: 'Attributions', count: assignments.length },
                ]} active={tab} onChange={setTab} />
            </div>

            {tab === 'requests' && (
                pending.length === 0 ? <EmptyState title="Aucune demande en attente" icon={ClipboardList} /> : (
                    <div className="space-y-4">
                        {pending.map((req: EquipmentRequest) => (
                            <div key={req.id} className="glass-card rounded-2xl p-5 border-amber-200/50 bg-gradient-to-r from-amber-50/80 to-white">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-900 text-lg">{req.equipmentName}</p>
                                        <p className="text-sm text-slate-600 mt-1">{req.justification}</p>
                                        <p className="text-xs text-slate-400 mt-2">Quantité: {req.quantityRequested} · {req.requestedByName ?? req.memberEmail}</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                                        <Button size="sm" onClick={() => validate.mutate({ id: req.id, decision: 'APPROVED' })}>
                                            <Check className="w-4 h-4" /> Approuver
                                        </Button>
                                        <Button size="sm" variant="danger" onClick={() => validate.mutate({ id: req.id, decision: 'REJECTED' })}>
                                            <X className="w-4 h-4" /> Refuser
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}

            {tab === 'inventory' && (
                <>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="input-field max-w-sm mb-4" />
                    {equipment.length === 0 ? <EmptyState title="Inventaire vide" icon={Package} /> : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {equipment.map((item: Equipment) => (
                                <Card key={item.id}>
                                    <p className="font-bold text-slate-800">{item.name}</p>
                                    <p className="text-xs text-slate-400 mt-1">S/N {item.serialNumber}</p>
                                    <p className="text-sm font-semibold text-cyan-700 mt-2">{item.availableQuantity} / {item.quantity} dispo</p>
                                    <div className="flex gap-2 mt-3">
                                        <Badge label={item.status} color="green" />
                                        <Badge label={item.condition} color="slate" />
                                    </div>
                                    <button onClick={() => remove.mutate(item.id)} className="mt-4 text-xs text-red-500 hover:underline flex items-center gap-1">
                                        <Trash2 className="w-3 h-3" /> Supprimer
                                    </button>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}

            {tab === 'assignments' && (
                assignments.length === 0 ? <EmptyState title="Aucune attribution active" icon={Link2} /> : (
                    <div className="space-y-3">
                        {assignments.map((a: EquipmentAssignment) => (
                            <Card key={a.id}>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-slate-800">{a.equipmentName}</p>
                                        <p className="text-sm text-slate-500">{a.memberName} · Qté {a.quantityAssigned}</p>
                                        <p className="text-xs text-slate-400">{a.assignmentDate}</p>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => returnAssign.mutate(a.id)}>Enregistrer retour</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )
            )}

            <Modal open={modal} onClose={() => setModal(false)} title="Nouvel équipement" size="lg">
                <div className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                        <div><label className="text-xs font-semibold text-slate-600">Nom *</label>
                            <input className="input-field mt-1" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
                        <div><label className="text-xs font-semibold text-slate-600">N° série *</label>
                            <input className="input-field mt-1" value={form.serialNumber} onChange={e => setForm(p => ({ ...p, serialNumber: e.target.value }))} /></div>
                    </div>
                    <textarea className="input-field resize-none" rows={2} placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                    <div className="grid sm:grid-cols-3 gap-3">
                        <input type="number" min={1} className="input-field" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: +e.target.value }))} />
                        <select className="input-field" value={form.condition} onChange={e => setForm(p => ({ ...p, condition: e.target.value as EquipmentCondition }))}>{CONDITIONS.map(c => <option key={c}>{c}</option>)}</select>
                        <input type="date" className="input-field" value={form.arrivalDate} onChange={e => setForm(p => ({ ...p, arrivalDate: e.target.value }))} />
                    </div>
                    <Button onClick={() => create.mutate()} loading={create.isPending}>Enregistrer</Button>
                </div>
            </Modal>
        </div>
    )
}
