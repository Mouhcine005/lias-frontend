import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Trash2, Pencil, BookOpen } from 'lucide-react'
import { publicationsApi } from '../../api'
import type { Publication, PublicationType } from '../../types'
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
import { notify, apiErrorMessage } from '../../lib/toast'

const TYPES: PublicationType[] = ['JOURNAL', 'CONFERENCE', 'BOOK', 'THESIS', 'OTHER']
const TYPE_COLORS: Record<string, 'cyan' | 'green' | 'purple' | 'orange' | 'slate'> = {
    JOURNAL: 'cyan', CONFERENCE: 'green', BOOK: 'purple', THESIS: 'orange', OTHER: 'slate',
}
const emptyForm = { title: '', journal: '', conference: '', authors: '', year: new Date().getFullYear(), type: 'JOURNAL' as PublicationType, team: '', doi: '', url: '', abstractText: '' }

type Tab = 'all' | 'mine'

export default function PublicationsPage() {
    const { email } = useAuth()
    const qc = useQueryClient()
    const [tab, setTab] = useState<Tab>('all')
    const [modal, setModal] = useState<'create' | 'edit' | null>(null)
    const [editId, setEditId] = useState<number | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [search, setSearch] = useState('')
    const [yearFilter, setYearFilter] = useState<number | ''>('')
    const [teamFilter, setTeamFilter] = useState('')

    const { data: publications = [], isLoading } = useQuery({
        queryKey: ['publications', tab, yearFilter, teamFilter],
        queryFn: async () => {
            if (tab === 'mine') return (await publicationsApi.mine()).data
            if (yearFilter) return (await publicationsApi.byYear(yearFilter)).data
            if (teamFilter.trim()) return (await publicationsApi.byTeam(teamFilter.trim())).data
            return (await publicationsApi.all()).data
        },
    })

    const openEdit = (p: Publication) => {
        setEditId(p.id)
        setForm({
            title: p.title, journal: p.journal ?? '', conference: p.conference ?? '',
            authors: p.authors ?? '', year: p.year, type: p.type, team: p.team ?? '',
            doi: p.doi ?? '', url: p.url ?? '', abstractText: p.abstractText ?? '',
        })
        setModal('edit')
    }

    const save = useMutation({
        mutationFn: () => modal === 'edit' && editId
            ? publicationsApi.update(editId, form)
            : publicationsApi.create(form),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['publications'] })
            setModal(null); setForm(emptyForm); setEditId(null)
            notify.success('Publication enregistrée')
        },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })

    const remove = useMutation({
        mutationFn: (id: number) => publicationsApi.remove(id),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['publications'] }); notify.success('Supprimée') },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })

    const filtered = publications.filter(p =>
        `${p.title} ${p.authors} ${p.journal}`.toLowerCase().includes(search.toLowerCase())
    )

    if (isLoading) return <Spinner className="h-64" />

    return (
        <div>
            <PageHeader title="Publications" subtitle="Production scientifique du laboratoire"
                action={<Button onClick={() => { setModal('create'); setForm(emptyForm) }}><Plus className="w-4 h-4" /> Nouvelle publication</Button>} />

            <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
                <Tabs tabs={[
                    { id: 'all' as Tab, label: 'Toutes' },
                    { id: 'mine' as Tab, label: 'Mes publications' },
                ]} active={tab} onChange={setTab} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <div className="sm:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="input-field pl-10" />
                </div>
                <select value={yearFilter} onChange={e => setYearFilter(e.target.value ? +e.target.value : '')} className="input-field">
                    <option value="">Toutes années</option>
                    {[2026, 2025, 2024, 2023, 2022].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <input value={teamFilter} onChange={e => setTeamFilter(e.target.value)} placeholder="Filtrer par équipe..." className="input-field" />
            </div>

            {filtered.length === 0 ? <EmptyState title="Aucune publication" icon={BookOpen} /> : (
                <div className="grid gap-4">
                    {filtered.map(p => (
                        <Card key={p.id}>
                            <div className="flex flex-wrap gap-2 mb-2">
                                <Badge label={p.type} color={TYPE_COLORS[p.type] ?? 'slate'} />
                                <span className="text-xs font-bold text-slate-400">{p.year}</span>
                                {p.team && <Badge label={p.team} color="violet" />}
                            </div>
                            <h3 className="font-bold text-slate-800">{p.title}</h3>
                            {p.authors && <p className="text-sm text-slate-500 mt-1">{p.authors}</p>}
                            {(p.journal || p.conference) && <p className="text-xs text-slate-400 italic mt-1">{p.journal || p.conference}</p>}
                            <p className="text-xs text-slate-400 mt-2">{p.memberFirstName} {p.memberLastName}</p>
                            {p.memberEmail === email && (
                                <CardActions>
                                    <Button variant="outline" size="sm" onClick={() => openEdit(p)}><Pencil className="w-3.5 h-3.5" /> Modifier</Button>
                                    <Button variant="danger" size="sm" onClick={() => remove.mutate(p.id)}><Trash2 className="w-3.5 h-3.5" /> Supprimer</Button>
                                </CardActions>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            <Modal open={modal !== null} onClose={() => setModal(null)} title={modal === 'edit' ? 'Modifier' : 'Nouvelle publication'} size="lg">
                <div className="space-y-3">
                    <div><label className="text-xs font-semibold text-slate-600">Titre *</label>
                        <input className="input-field mt-1" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <select className="input-field" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as PublicationType }))}>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
                        <input type="number" className="input-field" value={form.year} onChange={e => setForm(p => ({ ...p, year: +e.target.value }))} />
                    </div>
                    {(['authors', 'journal', 'conference', 'team', 'doi', 'url'] as const).map(k => (
                        <div key={k}><label className="text-xs font-semibold text-slate-600 capitalize">{k}</label>
                            <input className="input-field mt-1" value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} /></div>
                    ))}
                    <textarea className="input-field resize-none" rows={3} placeholder="Résumé" value={form.abstractText} onChange={e => setForm(p => ({ ...p, abstractText: e.target.value }))} />
                    <Button onClick={() => save.mutate()} loading={save.isPending} disabled={!form.title}>Enregistrer</Button>
                </div>
            </Modal>
        </div>
    )
}
