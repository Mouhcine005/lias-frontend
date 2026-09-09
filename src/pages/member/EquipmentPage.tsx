import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Package, Plus } from 'lucide-react'
import { equipmentApi } from '../../api'
import type { Equipment, EquipmentRequest } from '../../types'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import Tabs from '../../components/ui/Tabs'
import { Card } from '../../components/ui/Card'
import { notify, apiErrorMessage } from '../../lib/toast'

type Tab = 'inventory' | 'available' | 'requests'

export default function EquipmentPage() {
    const qc = useQueryClient()
    const [tab, setTab] = useState<Tab>('inventory')
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState({ equipmentName: '', equipmentDescription: '', quantityRequested: 1, justification: '' })

    const { data: equipment = [], isLoading } = useQuery({
        queryKey: ['equipment', tab],
        queryFn: async () => tab === 'available'
            ? (await equipmentApi.available()).data
            : (await equipmentApi.all()).data,
    })

    const { data: myRequests = [] } = useQuery({
        queryKey: ['my-equipment-requests'],
        queryFn: async () => (await equipmentApi.myRequests()).data,
    })

    const submitRequest = useMutation({
        mutationFn: () => equipmentApi.submitRequest(form),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['my-equipment-requests'] })
            setModal(false)
            setForm({ equipmentName: '', equipmentDescription: '', quantityRequested: 1, justification: '' })
            notify.success('Demande envoyée')
        },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })

    if (isLoading && tab !== 'requests') return <Spinner className="h-64" />

    return (
        <div>
            <PageHeader title="Équipements" subtitle="Inventaire du laboratoire"
                action={<Button onClick={() => setModal(true)}><Plus className="w-4 h-4" /> Demander</Button>} />

            <div className="mb-6">
                <Tabs tabs={[
                    { id: 'inventory' as Tab, label: 'Inventaire' },
                    { id: 'available' as Tab, label: 'Disponibles' },
                    { id: 'requests' as Tab, label: 'Mes demandes', count: myRequests.length },
                ]} active={tab} onChange={setTab} />
            </div>

            {tab === 'requests' ? (
                myRequests.length === 0 ? <EmptyState title="Aucune demande" /> : (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {myRequests.map((req: EquipmentRequest) => (
                            <Card key={req.id}>
                                <p className="font-bold text-slate-800">{req.equipmentName}</p>
                                <p className="text-sm text-slate-500 mt-1">{req.justification}</p>
                                <Badge label={req.status} color={req.status === 'APPROVED' ? 'green' : req.status === 'REJECTED' ? 'red' : 'yellow'} className="mt-3" />
                            </Card>
                        ))}
                    </div>
                )
            ) : equipment.length === 0 ? (
                <EmptyState title="Aucun équipement" icon={Package} />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {equipment.map((item: Equipment) => (
                        <Card key={item.id}>
                            <p className="font-bold text-slate-800">{item.name}</p>
                            {item.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>}
                            <p className="text-xs text-slate-400 mt-2 font-mono">S/N {item.serialNumber}</p>
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-sm font-bold text-cyan-700">{item.availableQuantity}<span className="text-slate-400 font-normal">/{item.quantity}</span></span>
                                <Badge label={item.status} color={item.status === 'AVAILABLE' ? 'green' : 'blue'} />
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Modal open={modal} onClose={() => setModal(false)} title="Demande d'équipement">
                <div className="space-y-3">
                    <div><label className="text-xs font-semibold text-slate-600">Nom *</label>
                        <input className="input-field mt-1" value={form.equipmentName} onChange={e => setForm(p => ({ ...p, equipmentName: e.target.value }))} /></div>
                    <div><label className="text-xs font-semibold text-slate-600">Description</label>
                        <input className="input-field mt-1" value={form.equipmentDescription} onChange={e => setForm(p => ({ ...p, equipmentDescription: e.target.value }))} /></div>
                    <div><label className="text-xs font-semibold text-slate-600">Quantité</label>
                        <input type="number" min={1} className="input-field mt-1" value={form.quantityRequested} onChange={e => setForm(p => ({ ...p, quantityRequested: +e.target.value }))} /></div>
                    <div><label className="text-xs font-semibold text-slate-600">Justification *</label>
                        <textarea className="input-field mt-1 resize-none" rows={3} value={form.justification} onChange={e => setForm(p => ({ ...p, justification: e.target.value }))} /></div>
                    <Button onClick={() => submitRequest.mutate()} loading={submitRequest.isPending} disabled={!form.equipmentName || !form.justification}>Envoyer</Button>
                </div>
            </Modal>
        </div>
    )
}
