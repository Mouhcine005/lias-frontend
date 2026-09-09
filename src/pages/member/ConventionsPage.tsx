import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ScrollText, Plus, MapPin, Calendar, Pencil, Trash2, Upload, Download } from 'lucide-react'
import { conventionsApi } from '../../api'
import type { Convention } from '../../types'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import CardActions from '../../components/ui/CardActions'
import { Card } from '../../components/ui/Card'
import { formatDate, downloadBlob } from '../../lib/utils'
import { notify, apiErrorMessage } from '../../lib/toast'

const STATUSES = ['ACTIVE', 'EXPIRED', 'PENDING'] as const
const emptyForm: Omit<Convention, 'id' | 'createdAt'> = {
    title: '',
    partnerName: '',
    partnerCountry: '',
    startDate: '',
    endDate: '',
    status: 'ACTIVE',
    documentFileName: undefined,
    documentDownloadUrl: undefined,
}

const STATUS_COLORS: Record<string, 'cyan' | 'green' | 'yellow' | 'slate'> = {
    ACTIVE: 'green',
    EXPIRED: 'slate',
    PENDING: 'yellow',
}

export default function ConventionsPage() {
    const { canManageLab } = useAuth()
    const qc = useQueryClient()
    const fileRef = useRef<HTMLInputElement>(null)
    const [modal, setModal] = useState<'create' | 'edit' | null>(null)
    const [editId, setEditId] = useState<number | null>(null)
    const [form, setForm] = useState(emptyForm)

    const { data: conventions = [], isLoading } = useQuery({
        queryKey: ['conventions'],
        queryFn: async () => (await conventionsApi.all()).data,
    })

    const openEdit = (c: Convention) => {
        setEditId(c.id)
        setForm({
            title: c.title,
            partnerName: c.partnerName,
            partnerCountry: c.partnerCountry,
            startDate: c.startDate?.slice(0, 10) ?? '',
            endDate: c.endDate?.slice(0, 10) ?? '',
            status: c.status,
            documentFileName: c.documentFileName,
            documentDownloadUrl: c.documentDownloadUrl,
        })
        setModal('edit')
    }

    const save = useMutation({
        mutationFn: () =>
            modal === 'edit' && editId
                ? conventionsApi.update(editId, form)
                : conventionsApi.create(form),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['conventions'] })
            setModal(null)
            setForm(emptyForm)
            setEditId(null)
            notify.success(modal === 'edit' ? 'Convention mise à jour' : 'Convention créée')
        },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })

    const remove = useMutation({
        mutationFn: (id: number) => conventionsApi.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['conventions'] })
            notify.success('Convention supprimée')
        },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })

    const uploadDocument = useMutation({
        mutationFn: ({ id, file }: { id: number; file: File }) =>
            conventionsApi.uploadDocument(id, file),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['conventions'] })
            notify.success('Document téléversé')
        },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, conventionId: number) => {
        const file = e.target.files?.[0]
        if (file) uploadDocument.mutate({ id: conventionId, file })
    }

    const downloadDocument = async (id: number) => {
        try {
            const res = await conventionsApi.downloadDocument(id)
            const filename = conventions.find(c => c.id === id)?.documentFileName ?? 'document'
            downloadBlob(res.data, filename)
        } catch (e) {
            notify.error(apiErrorMessage(e))
        }
    }

    if (isLoading) return <Spinner className="h-64" />

    return (
        <div>
            <PageHeader
                title="Conventions"
                subtitle={`${conventions.length} convention(s)`}
                action={
                    canManageLab()
                        ? (
                            <Button onClick={() => { setModal('create'); setForm(emptyForm); setEditId(null) }}>
                                <Plus className="w-4 h-4" /> Nouvelle convention
                            </Button>
                        )
                        : undefined
                }
            />

            {conventions.length === 0 ? (
                <EmptyState
                    title="Aucune convention"
                    description="Les conventions de partenariat apparaîtront ici"
                    icon={ScrollText}
                />
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {conventions.map(c => (
                        <Card key={c.id} hover={false}>
                            <div className="flex flex-wrap gap-2 mb-2">
                                <Badge label={c.status} color={STATUS_COLORS[c.status] ?? 'slate'} />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">{c.title}</h3>
                            <div className="flex flex-col gap-1 mt-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                                    {c.partnerName}
                                    {c.partnerCountry ? ` — ${c.partnerCountry}` : ''}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                                    {formatDate(c.startDate)}{c.endDate ? ` → ${formatDate(c.endDate)}` : ''}
                                </span>
                                {c.documentFileName && (
                                    <span className="flex items-center gap-1.5">
                                        <ScrollText className="w-3.5 h-3.5 shrink-0" />
                                        {c.documentFileName}
                                    </span>
                                )}
                            </div>
                            {canManageLab() && (
                                <CardActions>
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        className="hidden"
                                        onChange={e => handleFileChange(e, c.id)}
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileRef.current?.click()}
                                    >
                                        <Upload className="w-3.5 h-3.5" /> Document
                                    </Button>
                                    {c.documentDownloadUrl && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => downloadDocument(c.id)}
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                        </Button>
                                    )}
                                    <div className="flex-1" />
                                    <Button variant="outline" size="sm" onClick={() => openEdit(c)}>
                                        <Pencil className="w-3.5 h-3.5" /> Modifier
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => remove.mutate(c.id)}>
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </CardActions>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            <Modal
                open={modal !== null}
                onClose={() => { setModal(null); setForm(emptyForm); setEditId(null) }}
                title={modal === 'edit' ? "Modifier la convention" : "Nouvelle convention"}
                size="lg"
            >
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-semibold text-slate-600">Titre *</label>
                        <input
                            className="input-field mt-1"
                            value={form.title}
                            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                        />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-slate-600">Partenaire *</label>
                            <input
                                className="input-field mt-1"
                                value={form.partnerName}
                                onChange={e => setForm(p => ({ ...p, partnerName: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600">Pays</label>
                            <input
                                className="input-field mt-1"
                                value={form.partnerCountry}
                                onChange={e => setForm(p => ({ ...p, partnerCountry: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-slate-600">Date de début</label>
                            <input
                                type="date"
                                className="input-field mt-1"
                                value={form.startDate}
                                onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600">Date de fin</label>
                            <input
                                type="date"
                                className="input-field mt-1"
                                value={form.endDate}
                                onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-600">Statut</label>
                        <select
                            className="input-field mt-1"
                            value={form.status}
                            onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                        >
                            {STATUSES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button onClick={() => save.mutate()} loading={save.isPending} disabled={!form.title}>
                            Enregistrer
                        </Button>
                        <Button variant="secondary" onClick={() => { setModal(null); setForm(emptyForm); setEditId(null) }}>
                            Annuler
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
