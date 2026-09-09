import { useState, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Camera, Pencil, Save } from 'lucide-react'
import { useMe } from '../../hooks/useMe'
import { membersApi } from '../../api/members'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import { formatDate } from '../../lib/utils'
import { notify, apiErrorMessage } from '../../lib/toast'
import { ROLE_LABELS } from '../../types'

export default function ProfilePage() {
    const { data: me, isLoading } = useMe()
    const qc = useQueryClient()
    const fileRef = useRef<HTMLInputElement>(null)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({ firstName: '', lastName: '', biography: '', interests: '', establishment: '', originLaboratory: '' })

    const { data: affiliations = [] } = useQuery({
        queryKey: ['affiliations-me'],
        queryFn: async () => (await membersApi.affiliationsMe()).data,
        enabled: !!me,
    })

    const startEdit = () => {
        setForm({
            firstName: me?.firstName ?? '',
            lastName: me?.lastName ?? '',
            biography: me?.biography ?? '',
            interests: me?.interests ?? '',
            establishment: me?.establishment ?? '',
            originLaboratory: me?.originLaboratory ?? '',
        })
        setEditing(true)
    }

    const save = async () => {
        setSaving(true)
        try {
            await membersApi.updateMe(form)
            qc.invalidateQueries({ queryKey: ['me'] })
            setEditing(false)
            notify.success('Profil mis à jour')
        } catch (err) {
            notify.error(apiErrorMessage(err))
        } finally {
            setSaving(false)
        }
    }

    const onPhoto = async (file: File) => {
        try {
            await membersApi.uploadPhoto(file)
            qc.invalidateQueries({ queryKey: ['me'] })
            notify.success('Photo mise à jour')
        } catch (err) {
            notify.error(apiErrorMessage(err))
        }
    }

    if (isLoading) return <Spinner className="h-64" />

    return (
        <div className="max-w-3xl">
            <PageHeader
                title="Mon profil"
                subtitle="Informations personnelles et affiliations"
                action={!editing ? <Button onClick={startEdit} variant="outline"><Pencil className="w-4 h-4" /> Modifier</Button> : undefined}
            />

            <Card padding={false} className="overflow-hidden mb-6">
                <div className="h-32 bg-gradient-to-r from-lias-900 via-cyan-800 to-cyan-600 relative" />
                <div className="px-6 pb-6 -mt-12 relative">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="relative group">
                            <Avatar memberId={me?.id} firstName={me?.firstName} lastName={me?.lastName} email={me?.email} size="xl" className="border-4 border-white" />
                            <button
                                onClick={() => fileRef.current?.click()}
                                className="absolute bottom-1 right-1 w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && onPhoto(e.target.files[0])} />
                        </div>
                        <div className="pb-1">
                            <h2 className="text-xl font-bold text-slate-900">
                                {me?.firstName && me?.lastName ? `${me.firstName} ${me.lastName}` : me?.email}
                            </h2>
                            <div className="flex gap-2 mt-2">
                                {me?.status && <Badge label={me.status} color="violet" />}
                                <Badge label={ROLE_LABELS[me?.role as keyof typeof ROLE_LABELS] ?? me?.role ?? ''} color="cyan" />
                            </div>
                        </div>
                    </div>

                    {editing ? (
                        <div className="mt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {(['firstName', 'lastName'] as const).map(k => (
                                    <div key={k}>
                                        <label className="text-xs font-semibold text-slate-600">{k === 'firstName' ? 'Prénom' : 'Nom'}</label>
                                        <input className="input-field mt-1" value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
                                    </div>
                                ))}
                            </div>
                            {(['establishment', 'originLaboratory'] as const).map(k => (
                                <div key={k}>
                                    <label className="text-xs font-semibold text-slate-600">{k === 'establishment' ? 'Établissement' : 'Laboratoire d\'origine'}</label>
                                    <input className="input-field mt-1" value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
                                </div>
                            ))}
                            <div>
                                <label className="text-xs font-semibold text-slate-600">Biographie</label>
                                <textarea className="input-field mt-1 resize-none" rows={3} value={form.biography} onChange={e => setForm(p => ({ ...p, biography: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-600">Centres d&apos;intérêt</label>
                                <textarea className="input-field mt-1 resize-none" rows={2} value={form.interests} onChange={e => setForm(p => ({ ...p, interests: e.target.value }))} />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={save} loading={saving}><Save className="w-4 h-4" /> Enregistrer</Button>
                                <Button variant="secondary" onClick={() => setEditing(false)}>Annuler</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {[
                                ['Email', me?.email],
                                ['Établissement', me?.establishment],
                                ['Laboratoire d\'origine', me?.originLaboratory],
                                ['Équipe actuelle', me?.currentTeam],
                                ['Laboratoire actuel', me?.currentLaboratory],
                                ['Date d\'embauche', formatDate(me?.hireDate)],
                            ].map(([l, v]) => v ? (
                                <div key={l as string}>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{l}</p>
                                    <p className="text-sm text-slate-700 mt-0.5">{v}</p>
                                </div>
                            ) : null)}
                            {me?.biography && (
                                <div className="sm:col-span-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Biographie</p>
                                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{me.biography}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Card>

            <Card>
                <h3 className="font-bold text-slate-800 mb-4">Historique d&apos;affiliations</h3>
                {affiliations.length === 0 ? (
                    <p className="text-sm text-slate-400">Aucune affiliation enregistrée</p>
                ) : (
                    <div className="space-y-3">
                        {affiliations.map(a => (
                            <div key={a.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">{a.laboratory}</p>
                                    {a.team && <p className="text-xs text-slate-400">{a.team}</p>}
                                </div>
                                <div className="text-right">
                                    <Badge label={a.active ? 'Actif' : 'Terminé'} color={a.active ? 'green' : 'slate'} />
                                    <p className="text-xs text-slate-400 mt-1">{formatDate(a.startDate)} — {a.endDate ? formatDate(a.endDate) : 'présent'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}
