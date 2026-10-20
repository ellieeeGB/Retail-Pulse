import { useAuth } from '../../contexts/useAuth'

export const Header = () => {
  const { user, client, logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {client?.name || 'Mi negocio'}
        </h2>
        <p className="text-sm text-gray-500">
          {user?.full_name || user?.email || 'Sin usuario'}
        </p>
      </div>

      <button
        onClick={logout}
        className="text-sm bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition"
      >
        Cerrar sesión
      </button>
    </header>
  )
}
