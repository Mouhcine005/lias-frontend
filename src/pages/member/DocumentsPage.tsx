import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, Download, FileText, Trash2 } from 'lucide-react'
import { documentsApi } from '../../api'
import type { Document, DocumentType } from '../../types'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import Tabs from '../../components/ui/Tabs'
import { Card } from '../../components/ui/Card'
import { downloadBlob } from '../../lib/utils'
import { notify, apiErrorMessage } from '../../lib/toast'

const DOC_TYPES: DocumentType[] = ['FUNDING_REQUEST', 'PROGRAM', 'CERTIFICATE', 'REPORT', 'ADMINISTRATIVE', 'OTHER']
const TYPE_COLORS: Record<string, 'orange' | 'blue' | 'green' | 'purple' | 'slate'> = {
    FUNDING_REQUEST: 'orange', PROGRAM: 'blue', CERTIFICATE: 'green', REPORT: 'purple', ADMINISTRATIVE: 'slate', OTHER: 'slate',
}

type Tab = 'all' | 'mine'

export default function DocumentsPage() {
    const { canManageLab } = useAuth()
    const qc = useQueryClient()
    const [tab, setTab] = useState<Tab>('all')
    const [typeFilter, setTypeFilter] = useState<DocumentType | ''>('')
    const [file, setFile] = useState<File | null>(null)
    const [description, setDescription] = useState('')
    const [docType, setDocType] = useState<DocumentType>('REPORT')

    const { data: documents = [], isLoading } = useQuery({
        queryKey: ['documents', tab, typeFilter],
        queryFn: async () => {
            if (typeFilter) return (await documentsApi.byType(typeFilter)).data
            if (tab === 'mine') return (await documentsApi.mine()).data
            return (await documentsApi.all()).data
        },
    })

    const upload = useMutation({
        mutationFn: () => {
            if (!file) throw new Error('Fichier requis')
            return documentsApi.upload(file, docType, description)
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['documents'] })
            setFile(null); setDescription('')
            notify.success('Document téléversé')
        },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })

    const remove = useMutation({
        mutationFn: (id: number) => documentsApi.remove(id),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['documents'] }); notify.success('Document supprimé') },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })

    const download = async (doc: Document) => {
        try {
            const res = await documentsApi.download(doc.id)
            downloadBlob(res.data, doc.fileName)
        } catch (e) {
            notify.error(apiErrorMessage(e))
        }
    }

    if (isLoading) return <Spinner className="h-64" />

    return (
        <div>
            <PageHeader title="Documents" subtitle="Archives et fichiers du laboratoire" />

            <Card className="mb-8">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Upload className="w-4 h-4 text-cyan-600" /> Téléverser</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-end">
                    <div className="xl:col-span-2">
                        <label className="text-xs font-semibold text-slate-600">Fichier *</label>
                        <input type="file" onChange={e => setFile(e.target.files?.[0] ?? null)}
                            className="mt-1 block w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-cyan-50 file:text-cyan-700 file:font-semibold" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-600">Type</label>
                        <select value={docType} onChange={e => setDocType(e.target.value as DocumentType)} className="input-field mt-1">
                            {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-600">Description</label>
                        <input value={description} onChange={e => setDescription(e.target.value)} className="input-field mt-1" />
                    </div>
                </div>
                <div className="mt-4">
                    <Button onClick={() => upload.mutate()} loading={upload.isPending} disabled={!file}>Téléverser</Button>
                </div>
            </Card>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <Tabs tabs={[
                    { id: 'all' as Tab, label: 'Tous' },
                    { id: 'mine' as Tab, label: 'Mes documents' },
                ]} active={tab} onChange={setTab} />
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as DocumentType | '')} className="input-field sm:max-w-xs">
                    <option value="">Tous les types</option>
                    {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {documents.length === 0 ? <EmptyState title="Aucun document" icon={FileText} /> : (
                <div className="grid gap-3 sm:grid-cols-2">
                    {documents.map(doc => (
                        <Card key={doc.id}>
                            <div className="flex gap-3">
                                <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5 text-cyan-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 truncate">{doc.fileName}</p>
                                    <Badge label={doc.type} color={TYPE_COLORS[doc.type] ?? 'slate'} />
                                    {doc.description && <p className="text-xs text-slate-400 mt-1 truncate">{doc.description}</p>}
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                                <Button variant="outline" size="sm" className="flex-1" onClick={() => download(doc)}>
                                    <Download className="w-3.5 h-3.5" /> Télécharger
                                </Button>
                                {canManageLab() && (
                                    <Button variant="danger" size="sm" onClick={() => remove.mutate(doc.id)}>
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
