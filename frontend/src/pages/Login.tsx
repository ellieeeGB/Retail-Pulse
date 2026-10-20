import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch {
      setError('Credenciales inválidas')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8FAFC] px-6 py-12">
      <div className="absolute left-[-80px] top-[-80px] h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />
      <div className="absolute bottom-[-80px] right-[-60px] h-72 w-72 rounded-full bg-violet-200/50 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_80px_rgba(15,23,42,0.10)] lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-white/15 px-4 py-1 text-sm backdrop-blur">
              Retail Pulse
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight">
              Controla tu operación con una vista mucho más inteligente
            </h1>
            <p className="mt-4 max-w-md text-blue-50">
              Centraliza KPIs, productos, inventario y recomendaciones en una sola plataforma.
            </p>
          </div>

          <div className="space-y-3 text-sm text-blue-50">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              Predicción de demanda y decisiones más rápidas.
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              Dashboard multi-tenant con métricas claras.
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-8">
            <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              ← Volver al inicio
            </Link>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Iniciar sesión</h2>
            <p className="mt-2 text-sm text-gray-500">
              Accede a tu panel y revisa el rendimiento de tu negocio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Correo</label>
              <input
                type="email"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@empresa.com"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Entrar al dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
