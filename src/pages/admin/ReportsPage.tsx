import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileDown, BarChart3, Calendar } from 'lucide-react'
import { reportsApi } from '../../api'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { downloadBlob } from '../../lib/utils'
import { notify, apiErrorMessage } from '../../lib/toast'

export default function ReportsPage() {
    const [year, setYear] = useState(new Date().getFullYear())
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [loading, setLoading] = useState<'annual' | 'monthly' | null>(null)

    const download = async (type: 'annual' | 'monthly') => {
        setLoading(type)
        try {
            const res = type === 'annual'
                ? await reportsApi.annual(year)
                : await reportsApi.monthly(year, month)
            downloadBlob(res.data, type === 'annual' ? `LIAS-Rapport-Annuel-${year}.pdf` : `LIAS-Rapport-${year}-${month}.pdf`)
            notify.success('Rapport téléchargé')
        } catch (e) {
            notify.error(apiErrorMessage(e))
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="max-w-2xl">
            <PageHeader title="Rapports d'activité" subtitle="Génération PDF des activités du laboratoire" />

            <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <Card>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800">Rapport annuel</h3>
                                <p className="text-sm text-slate-500 mt-1">Synthèse complète : événements, publications, membres.</p>
                                <div className="flex items-end gap-3 mt-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600">Année</label>
                                        <input type="number" value={year} onChange={e => setYear(+e.target.value)} className="input-field mt-1 w-28" />
                                    </div>
                                    <Button onClick={() => download('annual')} loading={loading === 'annual'}>
                                        <FileDown className="w-4 h-4" /> Télécharger PDF
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800">Rapport mensuel</h3>
                                <p className="text-sm text-slate-500 mt-1">Activité détaillée pour un mois donné.</p>
                                <div className="flex flex-wrap items-end gap-3 mt-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600">Année</label>
                                        <input type="number" value={year} onChange={e => setYear(+e.target.value)} className="input-field mt-1 w-28" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600">Mois</label>
                                        <select value={month} onChange={e => setMonth(+e.target.value)} className="input-field mt-1">
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                                <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('fr-FR', { month: 'long' })}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <Button onClick={() => download('monthly')} loading={loading === 'monthly'}>
                                        <FileDown className="w-4 h-4" /> Télécharger PDF
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
