import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Calendar, MapPin } from 'lucide-react'
import { calendarApi, eventsApi } from '../../api'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import PageHeader from '../../components/ui/PageHeader'
import { formatDate } from '../../lib/utils'

export default function CalendarPage() {
    const { data: calEvents = [], isLoading: calLoading } = useQuery({
        queryKey: ['calendar-events'],
        queryFn: async () => (await calendarApi.events()).data,
    })

    const { data: events = [], isLoading: eventsLoading } = useQuery({
        queryKey: ['events'],
        queryFn: async () => (await eventsApi.all()).data,
    })

    const isLoading = calLoading || eventsLoading

    if (isLoading && calEvents.length === 0 && events.length === 0) return <Spinner className="h-64" />

    return (
        <div>
            <PageHeader
                title="Calendrier"
                subtitle={`${calEvents.length + events.length} événement(s) au total`}
                badge={<Badge label="Vue d'ensemble" color="cyan" />}
            />

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mb-8"
            >
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-600" />
                    Calendrier
                </h2>
                {calEvents.length === 0 ? (
                    <EmptyState title="Aucun événement calendaire" />
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {calEvents.map(ev => (
                            <Card key={ev.id} hover={false}>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <Badge label={ev.type} color="cyan" />
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg">{ev.title}</h3>
                                <div className="flex flex-col gap-1 mt-3 text-xs text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                                        {formatDate(ev.start)}
                                        {ev.end ? ` → ${formatDate(ev.end)}` : ''}
                                    </span>
                                    {ev.location && (
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                                            {ev.location}
                                        </span>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <h2 className="text-lg font-bold text-slate-800 mb-4">Tous les événements</h2>
                {events.length === 0 ? (
                    <EmptyState title="Aucun événement" />
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {events.map(ev => (
                            <Card key={ev.id} hover={false}>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <Badge label={ev.type} color="cyan" />
                                    <Badge
                                        label={ev.status}
                                        color={
                                            ev.status === 'PLANNED'
                                                ? 'blue'
                                                : ev.status === 'ONGOING'
                                                    ? 'green'
                                                    : ev.status === 'COMPLETED'
                                                        ? 'slate'
                                                        : 'red'
                                        }
                                    />
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg">{ev.title}</h3>
                                {ev.description && (
                                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">{ev.description}</p>
                                )}
                                <div className="flex flex-col gap-1 mt-3 text-xs text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                                        {formatDate(ev.startDate)}
                                        {ev.endDate ? ` → ${formatDate(ev.endDate)}` : ''}
                                    </span>
                                    {ev.location && (
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                                            {ev.location}
                                        </span>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    )
}
