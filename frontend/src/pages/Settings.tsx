import { useAuth } from '../contexts/useAuth'

export default function Settings() {
  const { user, client } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500">
          Información básica de sesión, cuenta y cliente activo
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Usuario actual</h2>
          <div className="mt-5 space-y-4">
            <InfoRow label="Nombre" value={user?.full_name || 'No disponible'} />
            <InfoRow label="Correo" value={user?.email || 'No disponible'} />
            <InfoRow label="Rol" value={user?.role || 'No disponible'} />
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Cliente activo</h2>
          <div className="mt-5 space-y-4">
            <InfoRow label="Nombre del negocio" value={client?.name || 'No disponible'} />
            <InfoRow label="Client ID" value={String(client?.id ?? 'No disponible')} />
          </div>
        </section>
      </div>

      <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Estado del sistema</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatusCard title="Autenticación" value="Activa" tone="green" />
          <StatusCard title="Cliente cargado" value={client?.name ? 'Sí' : 'No'} tone={client?.name ? 'green' : 'yellow'} />
          <StatusCard title="Sesión local" value={localStorage.getItem('token') ? 'Disponible' : 'Vacía'} tone={localStorage.getItem('token') ? 'green' : 'red'} />
        </div>
      </section>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  )
}

function StatusCard({
  title,
  value,
  tone,
}: {
  title: string
  value: string
  tone: 'green' | 'yellow' | 'red'
}) {
  const toneMap = {
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-red-700',
  }

  return (
    <div className="rounded-2xl border border-gray-100 p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${toneMap[tone]}`}>
        {value}
      </span>
    </div>
  )
}
