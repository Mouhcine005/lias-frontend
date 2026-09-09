import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Calendar, CalendarDays, Bell, BookOpen, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMe } from '../../hooks/useMe'
import { eventsApi, meetingsApi, notificationsApi, publicationsApi } from '../../api'
import Spinner from '../../components/ui/Spinner'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { formatDate } from '../../lib/utils'
import { ROLE_LABELS } from '../../types'

export default function DashboardPage() {
    const { data: me, isLoading } = useMe()

    const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: async () => (await eventsApi.all()).data })
    const { data: meetings = [] } = useQuery({ queryKey: ['meetings'], queryFn: async () => (await meetingsApi.all()).data })
    const { data: notifications = [] } = useQuery({ queryKey: ['notifications'], queryFn: async () => (await notificationsApi.all()).data })
    const { data: publications = [] } = useQuery({ queryKey: ['publications'], queryFn: async () => (await publicationsApi.all()).data })

    if (isLoading) return <Spinner className="h-64" />

    const unread = notifications.filter(n => !n.read).length
    const upcoming = events.filter(e => e.status === 'PLANNED').length
    const plannedMeetings = meetings.filter(m => m.status === 'PLANNED').length

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-2">Tableau de bord</p>
                <h1 className="text-3xl font-extrabold text-slate-900">
                    Bonjour{me?.firstName ? `, ${me.firstName}` : ''} 👋
                </h1>
                <p className="text-slate-500 mt-2">
                    {me?.currentLaboratory && `${me.currentLaboratory}`}
                    {me?.currentTeam && ` · ${me.currentTeam}`}
                    {me?.role && ` · ${ROLE_LABELS[me.role as keyof typeof ROLE_LABELS] ?? me.role}`}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <StatCard label="Événements à venir" value={upcoming} icon={Calendar} color="cyan" delay={0} />
                <StatCard label="Réunions planifiées" value={plannedMeetings} icon={CalendarDays} color="violet" delay={0.05} />
                <StatCard label="Notifications" value={unread} icon={Bell} color="amber" delay={0.1} />
                <StatCard label="Publications" value={publications.length} icon={BookOpen} color="emerald" delay={0.15} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-slate-800">Événements récents</h2>
                        <Link to="/events" className="text-xs font-semibold text-cyan-600 flex items-center gap-1 hover:gap-2 transition-all">
                            Voir tout <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {events.slice(0, 5).map(e => (
                            <div key={e.id} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">{e.title}</p>
                                    <p className="text-xs text-slate-400">{formatDate(e.startDate)}</p>
                                </div>
                                <Badge label={e.status} color={e.status === 'PLANNED' ? 'cyan' : 'slate'} />
                            </div>
                        ))}
                        {events.length === 0 && <p className="text-sm text-slate-400 py-4 text-center">Aucun événement</p>}
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-slate-800">Notifications</h2>
                        <Link to="/notifications" className="text-xs font-semibold text-cyan-600 flex items-center gap-1">
                            Voir tout <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {notifications.slice(0, 5).map(n => (
                            <div key={n.id} className="flex gap-3 py-2.5 border-b border-slate-50 last:border-0">
                                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.read ? 'bg-slate-200' : 'bg-cyan-500'}`} />
                                <div>
                                    <p className="text-sm font-medium text-slate-700">{n.title}</p>
                                    <p className="text-xs text-slate-400 line-clamp-1">{n.message}</p>
                                </div>
                            </div>
                        ))}
                        {notifications.length === 0 && <p className="text-sm text-slate-400 py-4 text-center">Aucune notification</p>}
                    </div>
                </Card>
            </div>
        </div>
    )
}
