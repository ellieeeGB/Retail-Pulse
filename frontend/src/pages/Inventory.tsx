import { useEffect, useMemo, useState } from 'react'
import { getLowStockAlerts } from '../services/endpoints/inventory'
import type { InventoryAlert } from '../types'
import {
  ExclamationTriangleIcon,
  ArchiveBoxIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

export default function Inventory() {
  const [alerts, setAlerts] = useState<InventoryAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await getLowStockAlerts()
        setAlerts(data)
      } catch (error) {
        console.error('Error fetching inventory alerts:', error)
        setAlerts([])
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
  }, [])

  const summary = useMemo(() => {
    return {
      totalAlerts: alerts.length,
      critical: alerts.filter((a) => Number(a.current_stock) <= Number(a.reorder_point) * 0.5).length,
      reorderSoon: alerts.filter((a) => Number(a.current_stock) > Number(a.reorder_point) * 0.5).length,
    }
  }, [alerts])

  if (loading) return <div className="p-6">Cargando inventario...</div>

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 px-8 py-8 text-white shadow-lg">
        <span className="inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur">
          Inventario
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Estado del inventario
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-emerald-50 md:text-base">
          Revisa productos críticos, prioriza reabastecimiento y mantén operación sin quiebres de stock.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard
          title="Alertas activas"
          value={String(summary.totalAlerts)}
          subtitle="Productos a revisar"
          tone="yellow"
        />
        <SummaryCard
          title="Críticos"
          value={String(summary.critical)}
          subtitle="Prioridad alta"
          tone="red"
        />
        <SummaryCard
          title="Sin riesgo inmediato"
          value={String(Math.max(0, summary.totalAlerts - summary.critical))}
          subtitle="Revisión preventiva"
          tone="green"
        />
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-10 shadow-sm ring-1 ring-gray-100">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <CheckCircleIcon className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-center text-xl font-semibold text-gray-900">
            Inventario saludable
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            No hay productos por debajo del punto de reorden.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((item) => {
            const isCritical =
              Number(item.current_stock) <= Number(item.reorder_point) * 0.5

            return (
              <div
                key={item.product_id}
                className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-2xl p-3 ${
                        isCritical
                          ? 'bg-red-50 text-red-600'
                          : 'bg-yellow-50 text-yellow-600'
                      }`}
                    >
                      {isCritical ? (
                        <ExclamationTriangleIcon className="h-6 w-6" />
                      ) : (
                        <ArchiveBoxIcon className="h-6 w-6" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.product_name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Revisión recomendada para evitar quiebre de stock.
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      isCritical
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {isCritical ? 'Crítico' : 'Reabastecer pronto'}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <MetricBox label="Stock actual" value={String(item.current_stock)} />
                  <MetricBox label="Punto de reorden" value={String(item.reorder_point)} />
                  <MetricBox
                    label="Estado"
                    value={isCritical ? 'Riesgo alto' : 'Atención preventiva'}
                  />
                </div>

                <div className="mt-5 rounded-2xl bg-gray-50 px-4 py-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Acción sugerida
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    {isCritical
                      ? 'Reabastece este producto cuanto antes para evitar afectar ventas.'
                      : 'Inclúyelo en tu próxima orden de compra para mantener inventario estable.'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function SummaryCard({
  title,
  value,
  subtitle,
  tone,
}: {
  title: string
  value: string
  subtitle: string
  tone: 'red' | 'yellow' | 'green'
}) {
  const tones = {
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    green: 'bg-green-50 text-green-700',
  }

  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
        {title}
      </span>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
  )
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-gray-50 px-4 py-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 font-semibold text-gray-900">{value}</p>
    </div>
  )
}
