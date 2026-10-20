import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  GiftIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { name: 'Productos', to: '/products', icon: CubeIcon },
  { name: 'Inventario', to: '/inventory', icon: ShoppingCartIcon },
  { name: 'Recomendaciones', to: '/recommendations', icon: GiftIcon },
  { name: 'Configuración', to: '/settings', icon: Cog6ToothIcon },
]

export const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-lg font-bold text-gray-900">Retail Pulse</h1>
        <p className="mt-1 text-sm text-gray-500">Control inteligente del negocio</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
