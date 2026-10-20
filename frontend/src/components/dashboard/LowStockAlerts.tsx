import type { InventoryAlert } from '../../types'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface LowStockAlertsProps {
  data: InventoryAlert[]
}

export function LowStockAlerts({ data }: LowStockAlertsProps) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Inventario</h3>
          <p className="text-sm text-gray-500">
            Productos que requieren atención
          </p>
        </div>
        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
          Stock bajo
        </span>
      </div>

      {data.length === 0 ? (
        <div className="rounded-2xl bg-green-50 px-4 py-5 text-sm text-green-700">
          Inventario saludable. No hay productos por debajo del punto de reorden.
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3"
            >
              <div>
                <p className="font-medium text-gray-900">{item.product_name}</p>
                <p className="text-sm text-gray-500">
                  Stock actual: {item.current_stock} · Punto de reorden: {item.reorder_point}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                <ExclamationTriangleIcon className="h-4 w-4" />
                Reabastecer
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
