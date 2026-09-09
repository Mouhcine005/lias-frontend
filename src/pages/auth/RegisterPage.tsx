import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, FlaskConical, UserPlus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../api/auth'
import { apiErrorMessage, notify } from '../../lib/toast'
import Button from '../../components/ui/Button'

export default function RegisterPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await authApi.register(email, password)
            login(res.data.token, res.data.role, res.data.email)
            notify.success('Inscription réussie — en attente de validation')
            navigate('/pending-approval')
        } catch (err) {
            notify.error(apiErrorMessage(err, 'Inscription échouée'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-bg min-h-screen flex items-center justify-center p-6 relative">
            <div className="auth-grid" />
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 items-center justify-center shadow-2xl shadow-cyan-500/30 mb-4">
                        <FlaskConical className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Rejoindre LIAS</h1>
                    <p className="text-slate-400 text-sm mt-1">Créer un compte membre</p>
                </div>

                <div className="glass-card rounded-3xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-field pl-10" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Mot de passe (min. 8 car.)</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} className="input-field pl-10" />
                            </div>
                        </div>
                        <Button type="submit" loading={loading} className="w-full" size="lg">
                            <UserPlus className="w-4 h-4" />
                            S&apos;inscrire
                        </Button>
                    </form>
                    <p className="text-center text-sm text-slate-500 mt-6">
                        Déjà membre ? <Link to="/login" className="text-cyan-600 font-semibold">Connexion</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
