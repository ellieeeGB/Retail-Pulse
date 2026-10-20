import { useEffect, useState } from 'react'
import { getRecommendationSummary } from '../services/endpoints/recommendations'
import type {
  RecommendationSummary,
  BusinessRecommendation,
  WasteRiskAlert,
} from '../types'
import {
  SparklesIcon,
  ShoppingBagIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline'

export default function Recommendations() {
  const [data, setData] = useState<RecommendationSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await getRecommendationSummary()
        setData(response)
      } catch (error) {
        console.error('Error fetching recommendation summary:', error)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  if (loading) return <div className="p-6">Cargando recomendaciones...</div>

  const salesRecommendations = data?.sales_recommendations || []
  const wasteRiskAlerts = data?.waste_risk_alerts || []

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 px-8 py-8 text-white shadow-lg">
        <span className="inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur">
          Recomendaciones inteligentes
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Sugerencias para vender mejor y operar con menos riesgo
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-violet-50 md:text-base">
          Esta vista traduce el modelo en acciones más claras para negocio:
          qué producto impulsar, qué contexto influye y dónde podría existir
          riesgo operativo por merma.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MiniCard
          title="Recomendaciones de venta"
          value={String(salesRecommendations.length)}
          subtitle="Oportunidades activas"
        />
        <MiniCard
          title="Alertas de merma"
          value={String(wasteRiskAlerts.length)}
          subtitle="Riesgos detectados"
        />
        <MiniCard
          title="Cobertura del modelo"
          value={
            data?.metadata?.n_reglas_significativas
              ? String(data.metadata.n_reglas_significativas)
              : 'Disponible'
          }
          subtitle="Reglas significativas"
        />
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Oportunidades de venta
              </h2>
              <p className="text-sm text-gray-500">
                Productos que conviene impulsar según patrones detectados.
              </p>
            </div>
            <div className="rounded-2xl bg-violet-50 p-3 text-violet-600">
              <SparklesIcon className="h-6 w-6" />
            </div>
          </div>

          {salesRecommendations.length === 0 ? (
            <EmptyState
              icon={<ShoppingBagIcon className="h-7 w-7" />}
              title="Sin recomendaciones disponibles"
              description="Todavía no hay reglas suficientes para mostrar sugerencias de venta."
            />
          ) : (
            <div className="space-y-4">
              {salesRecommendations.map((item, index) => (
                <SalesRecommendationCard key={`${item.product_name}-${index}`} item={item} />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Riesgo de merma
              </h2>
              <p className="text-sm text-gray-500">
                Productos que requieren vigilancia operativa.
              </p>
            </div>
            <div className="rounded-2xl bg-red-50 p-3 text-red-600">
              <ShieldExclamationIcon className="h-6 w-6" />
            </div>
          </div>

          {wasteRiskAlerts.length === 0 ? (
            <EmptyState
              icon={<ExclamationTriangleIcon className="h-7 w-7" />}
              title="Sin alertas de merma"
              description="No se detectaron patrones relevantes de riesgo en este momento."
            />
          ) : (
            <div className="space-y-4">
              {wasteRiskAlerts.map((item, index) => (
                <WasteAlertCard key={`${item.product_name}-${index}`} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function SalesRecommendationCard({ item }: { item: BusinessRecommendation }) {
  return (
    <div className="rounded-[2rem] border border-gray-100 bg-gray-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Impulsar {item.product_name}
          </h3>
          <p className="mt-1 text-sm text-gray-600">{item.message}</p>
        </div>

        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
          {item.opportunity_level}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoBox label="Confianza" value={`${(item.confidence * 100).toFixed(1)}%`} />
        <InfoBox label="Lift" value={item.lift.toFixed(2)} />
        <InfoBox label="Fuerza" value={item.strength} />
        <InfoBox label="Soporte absoluto" value={String(item.support_abs)} />
      </div>

      <div className="mt-4 rounded-2xl bg-white px-4 py-4 ring-1 ring-gray-100">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Contexto detectado
        </p>
        <p className="mt-1 text-sm text-gray-700">{item.context}</p>
      </div>

      <div className="mt-4 rounded-2xl bg-violet-50 px-4 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-violet-700">
          Acción sugerida
        </p>
        <p className="mt-1 text-sm text-violet-900">{item.action}</p>
      </div>
    </div>
  )
}

function WasteAlertCard({ item }: { item: WasteRiskAlert }) {
  return (
    <div className="rounded-[2rem] border border-gray-100 bg-gray-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Revisar {item.product_name}
          </h3>
          <p className="mt-1 text-sm text-gray-600">{item.message}</p>
        </div>

        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          Riesgo {item.risk_level}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoBox label="Confianza" value={`${(item.confidence * 100).toFixed(1)}%`} />
        <InfoBox label="Lift" value={item.lift.toFixed(2)} />
        <InfoBox label="Fuerza" value={item.strength} />
        <InfoBox label="Merma total" value={Math.round(item.waste_total).toLocaleString()} />
      </div>

      <div className="mt-4 rounded-2xl bg-white px-4 py-4 ring-1 ring-gray-100">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Contexto detectado
        </p>
        <p className="mt-1 text-sm text-gray-700">{item.context}</p>
      </div>

      <div className="mt-4 rounded-2xl bg-red-50 px-4 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-red-700">
          Acción sugerida
        </p>
        <p className="mt-1 text-sm text-red-900">{item.action}</p>
      </div>
    </div>
  )
}

function MiniCard({
  title,
  value,
  subtitle,
}: {
  title: string
  value: string
  subtitle: string
}) {
  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-4 ring-1 ring-gray-100">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl bg-gray-50 px-4 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-500 shadow-sm">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  )
}
