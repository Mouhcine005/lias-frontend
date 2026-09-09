import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, FlaskConical, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../api/auth'
import { apiErrorMessage, notify } from '../../lib/toast'
import Button from '../../components/ui/Button'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await authApi.login(email, password)
            login(res.data.token, res.data.role, res.data.email)
            notify.success('Bienvenue !')
            navigate('/dashboard')
        } catch (err) {
            notify.error(apiErrorMessage(err, 'Identifiants incorrects'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-bg min-h-screen flex">
            <div className="auth-grid" />
            <div className="hidden lg:flex flex-1 flex-col justify-center px-16 relative z-10">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-2xl shadow-cyan-500/40">
                            <FlaskConical className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-white">LIAS Laboratory</h1>
                            <p className="text-cyan-400/90 text-sm font-medium">Faculté des Sciences Ben M&apos;Sik</p>
                        </div>
                    </div>
                    <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                        Portail de gestion du laboratoire d&apos;informatique — membres, publications, événements et ressources.
                    </p>
                    <div className="mt-10 flex gap-6">
                        {['Membres', 'Publications', 'Événements', 'Équipements'].map((t, i) => (
                            <motion.span
                                key={t}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="text-xs font-semibold text-cyan-400/80 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5"
                            >
                                {t}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="glass-card rounded-3xl p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">Connexion</h2>
                        <p className="text-slate-500 text-sm mb-8">Accédez à votre espace membre</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        placeholder="vous@exemple.com"
                                        className="input-field pl-10"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Mot de passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="input-field pl-10"
                                    />
                                </div>
                            </div>
                            <Button type="submit" loading={loading} className="w-full" size="lg">
                                Se connecter
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </form>

                        <p className="text-center text-sm text-slate-500 mt-8">
                            Pas de compte ?{' '}
                            <Link to="/register" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                                S&apos;inscrire
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
