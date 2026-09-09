import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, CheckCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { notificationsApi } from '../../api'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import Tabs from '../../components/ui/Tabs'
import { Card } from '../../components/ui/Card'
import { formatDate } from '../../lib/utils'

type Tab = 'all' | 'unread'

export default function NotificationsPage() {
    const qc = useQueryClient()
    const [tab, setTab] = useState<Tab>('all')

    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications', tab],
        queryFn: async () => tab === 'unread'
            ? (await notificationsApi.unread()).data
            : (await notificationsApi.all()).data,
    })

    const markRead = useMutation({
        mutationFn: (id: number) => notificationsApi.markRead(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['notifications'] })
            qc.invalidateQueries({ queryKey: ['notifications-unread-count'] })
        },
    })

    const markAll = useMutation({
        mutationFn: () => notificationsApi.markAllRead(),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['notifications'] })
            qc.invalidateQueries({ queryKey: ['notifications-unread-count'] })
        },
    })

    if (isLoading) return <Spinner className="h-64" />

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div className="max-w-2xl">
            <PageHeader title="Notifications"
                action={unreadCount > 0 ? <Button variant="outline" onClick={() => markAll.mutate()}><CheckCheck className="w-4 h-4" /> Tout marquer lu</Button> : undefined} />

            <div className="mb-6">
                <Tabs tabs={[
                    { id: 'all' as Tab, label: 'Toutes' },
                    { id: 'unread' as Tab, label: 'Non lues', count: tab === 'unread' ? notifications.length : undefined },
                ]} active={tab} onChange={setTab} />
            </div>

            {notifications.length === 0 ? <EmptyState title="Aucune notification" icon={Bell} /> : (
                <div className="space-y-3">
                    {notifications.map((n, i) => (
                        <motion.div key={n.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                            <Card
                                className={!n.read ? 'border-cyan-300/60 bg-gradient-to-r from-cyan-50/50 to-white' : ''}
                                onClick={!n.read ? () => markRead.mutate(n.id) : undefined}
                            >
                                <div className="flex gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-slate-200' : 'bg-cyan-500 ring-4 ring-cyan-500/20'}`} />
                                    <div>
                                        <p className="font-semibold text-slate-800">{n.title}</p>
                                        <p className="text-sm text-slate-500 mt-1">{n.message}</p>
                                        <p className="text-xs text-slate-400 mt-2">{formatDate(n.createdAt)}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
