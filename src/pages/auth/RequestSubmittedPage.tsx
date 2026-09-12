import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MailCheck, FlaskConical, ArrowLeft } from 'lucide-react'
import Button from '../../components/ui/Button'

export default function RequestSubmittedPage() {
    const location = useLocation()
    const email = (location.state as { email?: string } | null)?.email

    return (
        <div className="auth-bg min-h-screen flex items-center justify-center p-6 relative">
            <div className="auth-grid" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg text-center relative z-10"
            >
                <div className="inline-flex w-20 h-20 rounded-3xl bg-cyan-500/20 border border-cyan-500/30 items-center justify-center mb-6">
                    <MailCheck className="w-10 h-10 text-cyan-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">Demande envoyée</h1>
                <p className="text-slate-400 mb-2">
                    {email
                        ? <>Votre demande d&apos;adhésion pour <span className="text-cyan-400 font-semibold">{email}</span> a été soumise.</>
                        : 'Votre demande d\'adhésion a été soumise.'}
                </p>
                <p className="text-slate-500 text-sm mb-10 max-w-md mx-auto">
                    Le directeur du laboratoire examinera votre demande. Vous recevrez un email dès qu&apos;une décision aura été prise — aucun compte n&apos;existe tant que la demande n&apos;est pas acceptée.
                </p>
                <div className="flex items-center justify-center gap-2 mb-8">
                    <FlaskConical className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-slate-500">LIAS Laboratory</span>
                </div>
                <Link to="/">
                    <Button variant="outline">
                        <ArrowLeft className="w-4 h-4" />
                        Retour à l&apos;accueil
                    </Button>
                </Link>
            </motion.div>
        </div>
    )
}