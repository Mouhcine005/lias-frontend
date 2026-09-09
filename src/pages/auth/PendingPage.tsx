import { motion } from 'framer-motion'
import { Clock, LogOut, FlaskConical } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'

export default function PendingPage() {
    const { logout, email } = useAuth()

    return (
        <div className="auth-bg min-h-screen flex items-center justify-center p-6 relative">
            <div className="auth-grid" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg text-center relative z-10"
            >
                <div className="inline-flex w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-500/30 items-center justify-center mb-6">
                    <Clock className="w-10 h-10 text-amber-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">En attente d&apos;approbation</h1>
                <p className="text-slate-400 mb-2">
                    Le compte <span className="text-cyan-400 font-semibold">{email}</span> a été créé.
                </p>
                <p className="text-slate-500 text-sm mb-10 max-w-md mx-auto">
                    Un administrateur validera votre accès. Vous recevrez une notification une fois votre compte activé.
                </p>
                <div className="flex items-center justify-center gap-2 mb-8">
                    <FlaskConical className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs text-slate-500">LIAS Laboratory</span>
                </div>
                <Button variant="outline" onClick={logout}>
                    <LogOut className="w-4 h-4" />
                    Retour à la connexion
                </Button>
            </motion.div>
        </div>
    )
}
