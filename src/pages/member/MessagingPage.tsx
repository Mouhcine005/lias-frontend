import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, Plus, Send, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { messagingApi } from '../../api'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { Card } from '../../components/ui/Card'
import { notify, apiErrorMessage } from '../../lib/toast'
import { useAuth } from '../../context/AuthContext'
import type { MessageThread, ThreadType } from '../../types'

const TYPE_COLORS: Record<string, 'cyan' | 'green' | 'purple' | 'slate'> = {
    GENERAL: 'cyan', TEAM: 'green', EVENT: 'purple',
}

const THREAD_TYPES: ThreadType[] = ['GENERAL', 'TEAM', 'EVENT']

interface NewThreadForm {
    title: string
    type: ThreadType
    team: string
    eventId: string
}

const emptyThreadForm: NewThreadForm = {
    title: '',
    type: 'GENERAL',
    team: '',
    eventId: '',
}

export default function MessagingPage() {
    const { email } = useAuth()
    const qc = useQueryClient()
    const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [form, setForm] = useState<NewThreadForm>(emptyThreadForm)
    const [messageText, setMessageText] = useState('')

    const { data: threads = [], isLoading: threadsLoading } = useQuery({
        queryKey: ['messaging-threads'],
        queryFn: async () => (await messagingApi.threads()).data,
    })

    const { data: messages = [], isLoading: messagesLoading } = useQuery({
        queryKey: ['messaging-messages', selectedThread?.id],
        queryFn: async () => (await messagingApi.messages(selectedThread!.id)).data,
        enabled: !!selectedThread?.id,
    })

    const createThread = useMutation({
        mutationFn: () =>
            messagingApi.createThread({
                title: form.title,
                type: form.type,
                team: form.team || undefined,
                eventId: form.eventId ? +form.eventId : undefined,
            }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['messaging-threads'] })
            setModalOpen(false)
            setForm(emptyThreadForm)
            notify.success('Discussion créée')
        },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })

    const sendMessage = useMutation({
        mutationFn: (content: string) => messagingApi.sendMessage(selectedThread!.id, { content }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['messaging-messages', selectedThread!.id] })
            setMessageText('')
        },
        onError: (e) => notify.error(apiErrorMessage(e)),
    })

    if (threadsLoading) return <Spinner className="h-64" />

    if (selectedThread) {
        return (
            <div>
                <PageHeader
                    title={selectedThread.title}
                    action={
                        <Button variant="ghost" onClick={() => setSelectedThread(null)}>
                            <ArrowLeft className="w-4 h-4" />
                            Retour
                        </Button>
                    }
                />

                {messagesLoading ? (
                    <Spinner className="h-64" />
                ) : messages.length === 0 ? (
                    <EmptyState title="Aucun message" icon={MessageSquare} description="Soyez le premier à écrire dans cette discussion." />
                ) : (
                    <div className="space-y-3 mb-6">
                        {messages.map((msg, i) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className={`flex ${msg.senderEmail === email ? 'justify-end' : 'justify-start'}`}
                            >
                                <Card className="max-w-[75%] p-4" padding={true}>
                                    <p className="text-xs font-semibold text-slate-700 mb-1">{msg.senderName}</p>
                                    <p className="text-sm text-slate-800 whitespace-pre-wrap">{msg.content}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{new Date(msg.timestamp).toLocaleString('fr-FR')}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="flex gap-2">
                    <input
                        value={messageText}
                        onChange={e => setMessageText(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey && messageText.trim()) {
                                e.preventDefault()
                                sendMessage.mutate(messageText.trim())
                            }
                        }}
                        placeholder="Écrire un message..."
                        className="input-field flex-1"
                    />
                    <Button
                        onClick={() => messageText.trim() && sendMessage.mutate(messageText.trim())}
                        disabled={!messageText.trim()}
                        loading={sendMessage.isPending}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <PageHeader
                title="Messagerie"
                subtitle="Discussions et échanges du laboratoire"
                action={
                    <Button onClick={() => { setForm(emptyThreadForm); setModalOpen(true) }}>
                        <Plus className="w-4 h-4" />
                        Nouvelle discussion
                    </Button>
                }
            />

            {threads.length === 0 ? (
                <EmptyState title="Aucune discussion" icon={MessageSquare} description="Commencez une nouvelle discussion pour échanger avec l'équipe." action={<Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" /> Nouvelle discussion</Button>} />
            ) : (
                <div className="grid gap-3">
                    {threads.map((t, i) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                        >
                            <Card
                                className="cursor-pointer hover:border-cyan-400/40"
                                onClick={() => setSelectedThread(t)}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-slate-800 truncate">{t.title}</h3>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {new Date(t.createdAt).toLocaleDateString('fr-FR')}
                                            <span className="mx-1.5">·</span>
                                            {t.participantIds.length} participant{t.participantIds.length > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {t.team && <Badge label={t.team} color="violet" />}
                                        <Badge label={t.type} color={TYPE_COLORS[t.type] ?? 'slate'} />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvelle discussion" size="md">
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-semibold text-slate-600">Titre *</label>
                        <input
                            className="input-field mt-1"
                            value={form.title}
                            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                            placeholder="Sujet de la discussion"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-slate-600">Type</label>
                            <select
                                className="input-field mt-1"
                                value={form.type}
                                onChange={e => setForm(p => ({ ...p, type: e.target.value as ThreadType }))}
                            >
                                {THREAD_TYPES.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600">Équipe (optionnel)</label>
                            <input
                                className="input-field mt-1"
                                value={form.team}
                                onChange={e => setForm(p => ({ ...p, team: e.target.value }))}
                                placeholder="Nom de l'équipe"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-600">Événement (optionnel)</label>
                        <input
                            type="number"
                            className="input-field mt-1"
                            value={form.eventId}
                            onChange={e => setForm(p => ({ ...p, eventId: e.target.value }))}
                            placeholder="ID de l'événement"
                        />
                    </div>
                    <Button
                        onClick={() => createThread.mutate()}
                        loading={createThread.isPending}
                        disabled={!form.title.trim()}
                    >
                        Créer la discussion
                    </Button>
                </div>
            </Modal>
        </div>
    )
}
