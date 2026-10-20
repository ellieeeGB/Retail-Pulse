import { useEffect, useMemo, useState } from 'react'
import { getKPIRange, getTopProducts } from '../services/endpoints/kpis'
import { getLowStockAlerts } from '../services/endpoints/inventory'
import { getRecommendationSummary } from '../services/endpoints/recommendations'
import type {
  KPIDaily,
  InventoryAlert,
  RecommendationSummary,
  TopProduct,
} from '../types'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts'
import {
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  ShoppingBagIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

type RawKPI = Partial<KPIDaily> & {
  revenue?: number | string
  gross_profit?: number | string
  transactions?: number | string
}

export default function Dashboard() {
  const [kpiData, setKpiData] = useState<KPIDaily[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [lowStock, setLowStock] = useState<InventoryAlert[]>([])
  const [recommendationSummary, setRecommendationSummary] =
    useState<RecommendationSummary | null>(null)
  const [loading, setLoading] = useState(true)

  const [dateRange, setDateRange] = useState({
    start: '2025-12-24',
    end: '2025-12-31',
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const rawKpis: RawKPI[] = await getKPIRange(dateRange.start, dateRange.end)
        setKpiData(rawKpis.map(normalizeKPI))
      } catch (error) {
        console.error('Error fetching KPI data:', error)
        setKpiData([])
      }

      try {
        const topResponse = await getTopProducts(5)
        setTopProducts(topResponse)
      } catch (error) {
        console.error('Error fetching top products:', error)
        setTopProducts([])
      }

      try {
        const lowStockResponse = await getLowStockAlerts()
        setLowStock(lowStockResponse)
      } catch (error) {
        console.warn('Low stock no disponible:', error)
        setLowStock([])
      }

      try {
        const summary = await getRecommendationSummary()
        setRecommendationSummary(summary)
      } catch (error) {
        console.warn('Recommendation summary no disponible:', error)
        setRecommendationSummary(null)
      }

      setLoading(false)
    }

    fetchData()
  }, [dateRange])

  const totals = useMemo(() => {
    const totalRevenue = kpiData.reduce((acc, day) => acc + safeNum(day.revenue_mxn), 0)
    const totalTickets = kpiData.reduce((acc, day) => acc + safeNum(day.tickets), 0)
    const avgTicket = totalTickets > 0 ? totalRevenue / totalTickets : 0

    return {
      totalRevenue,
      totalTickets,
      avgTicket,
    }
  }, [kpiData])

  const topProduct = topProducts?.[0]
  const salesRecommendations = recommendationSummary?.sales_recommendations || []
  const wasteRiskAlerts = recommendationSummary?.waste_risk_alerts || []

  if (loading) {
    return <div className="p-6">Cargando resumen del negocio...</div>
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-8 py-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-medium">
              Resumen simple del negocio
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Lo más importante de tu operación
            </h1>
            <p className="mt-3 text-sm text-blue-50 md:text-base">
              Aquí puedes ver cuánto vendiste, qué producto destaca y qué conviene hacer después.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <DateBox
              label="Desde"
              value={dateRange.start}
              onChange={(value) => setDateRange({ ...dateRange, start: value })}
            />
            <DateBox
              label="Hasta"
              value={dateRange.end}
              onChange={(value) => setDateRange({ ...dateRange, end: value })}
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title="Dinero vendido"
          value={`$${Math.round(totals.totalRevenue).toLocaleString()}`}
          subtitle="Ventas del periodo"
          icon={<CurrencyDollarIcon className="h-6 w-6" />}
          iconBg="bg-blue-100"
          iconText="text-blue-600"
        />

        <MetricCard
          title="Número de ventas"
          value={totals.totalTickets.toLocaleString()}
          subtitle="Tickets registrados"
          icon={<ReceiptPercentIcon className="h-6 w-6" />}
          iconBg="bg-emerald-100"
          iconText="text-emerald-600"
        />

        <MetricCard
          title="Promedio por compra"
          value={`$${Math.round(totals.avgTicket).toLocaleString()}`}
          subtitle="Ticket promedio"
          icon={<ShoppingBagIcon className="h-6 w-6" />}
          iconBg="bg-cyan-100"
          iconText="text-cyan-600"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SimpleBox
          title="Producto que mejor va"
          subtitle="El más fuerte en el periodo"
          badge="Producto líder"
        >
          {topProduct ? (
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900">{topProduct.product_name}</p>
              <p className="text-sm text-gray-600">
                Vendiste {safeNum(topProduct.units_sold).toLocaleString()} unidades.
              </p>
              <p className="text-sm text-gray-600">
                Generó cerca de ${Math.round(safeNum(topProduct.revenue)).toLocaleString()}.
              </p>
            </div>
          ) : (
            <EmptyText text="Todavía no hay suficiente información para identificar un producto líder." />
          )}
        </SimpleBox>

        <SimpleBox
          title="Qué conviene hacer hoy"
          subtitle="Acciones rápidas sugeridas"
          badge="Acciones"
        >
          <div className="space-y-3">
            {salesRecommendations.length > 0 ? (
              <ActionRow
                icon={<SparklesIcon className="h-5 w-5" />}
                tone="violet"
                title={`Impulsar ${salesRecommendations[0].product_name}`}
                description={salesRecommendations[0].action}
              />
            ) : (
              <ActionRow
                icon={<SparklesIcon className="h-5 w-5" />}
                tone="gray"
                title="Sin sugerencia comercial fuerte"
                description="Por ahora no hay una promoción clara que recomendar."
              />
            )}

            {wasteRiskAlerts.length > 0 ? (
              <ActionRow
                icon={<ExclamationTriangleIcon className="h-5 w-5" />}
                tone="amber"
                title={`Revisar ${wasteRiskAlerts[0].product_name}`}
                description={wasteRiskAlerts[0].action}
              />
            ) : (
              <ActionRow
                icon={<ExclamationTriangleIcon className="h-5 w-5" />}
                tone="green"
                title="Sin alertas importantes"
                description="No se detectaron riesgos fuertes de merma por ahora."
              />
            )}
          </div>
        </SimpleBox>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SimpleBox
          title="Cómo se movieron tus ventas"
          subtitle="Dinero vendido por día"
          badge="Ventas"
        >
          {kpiData.length === 0 ? (
            <EmptyText text="No hay datos suficientes para mostrar esta gráfica." />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={kpiData}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue_mxn"
                  stroke="#2563EB"
                  strokeWidth={3}
                  fill="url(#revenueFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </SimpleBox>

        <SimpleBox
          title="Productos más vendidos"
          subtitle="Top 5 por unidades"
          badge="Productos"
        >
          {topProducts.length === 0 ? (
            <EmptyText text="No hay productos suficientes para mostrar esta gráfica." />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={topProducts}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="product_name"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="units_sold" fill="#2563EB" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </SimpleBox>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SimpleBox
          title="Productos que conviene impulsar"
          subtitle="Ideas sencillas para vender mejor"
          badge="Impulsar"
        >
          {salesRecommendations.length === 0 ? (
            <EmptyText text="Todavía no hay oportunidades claras para impulsar productos." />
          ) : (
            <div className="space-y-4">
              {salesRecommendations.slice(0, 3).map((item, index) => (
                <div key={`${item.product_name}-${index}`} className="rounded-2xl bg-gray-50 p-4">
                  <p className="font-semibold text-gray-900">{item.product_name}</p>
                  <p className="mt-1 text-sm text-gray-600">{item.action}</p>
                  <p className="mt-2 text-xs text-violet-700">
                    Prioridad: {item.opportunity_level}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SimpleBox>

        <SimpleBox
          title="Productos que requieren atención"
          subtitle="Inventario bajo o riesgo operativo"
          badge="Revisar"
        >
          {lowStock.length === 0 && wasteRiskAlerts.length === 0 ? (
            <EmptyText text="No hay alertas importantes por ahora." />
          ) : (
            <div className="space-y-4">
              {lowStock.slice(0, 3).map((item) => (
                <div key={`stock-${item.product_id}`} className="rounded-2xl bg-gray-50 p-4">
                  <p className="font-semibold text-gray-900">{item.product_name}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Te quedan {item.current_stock} unidades y tu punto de reorden es {item.reorder_point}.
                  </p>
                  <p className="mt-2 text-xs text-red-700">
                    Acción sugerida: considerar reabastecimiento pronto.
                  </p>
                </div>
              ))}

              {wasteRiskAlerts.slice(0, 2).map((item, index) => (
                <div key={`waste-${item.product_name}-${index}`} className="rounded-2xl bg-gray-50 p-4">
                  <p className="font-semibold text-gray-900">{item.product_name}</p>
                  <p className="mt-1 text-sm text-gray-600">{item.action}</p>
                  <p className="mt-2 text-xs text-amber-700">
                    Nivel de riesgo: {item.risk_level}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SimpleBox>
      </section>
    </div>
  )
}

function normalizeKPI(row: RawKPI): KPIDaily {
  const revenue = safeNum(row.revenue_mxn ?? row.revenue)
  const grossMargin = safeNum(row.gross_margin_mxn ?? row.gross_profit)
  const tickets = safeNum(row.tickets ?? row.transactions)
  const grossMarginPct =
    row.gross_margin_pct != null
      ? safeNum(row.gross_margin_pct)
      : revenue > 0
      ? (grossMargin / revenue) * 100
      : 0

  return {
    date: row.date ?? '',
    tickets,
    units_sold: safeNum(row.units_sold),
    revenue_mxn: revenue,
    gross_margin_mxn: grossMargin,
    gross_margin_pct: grossMarginPct,
    avg_temp_c: row.avg_temp_c ?? null,
  }
}

function safeNum(value: unknown) {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

function DateBox({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
      <p className="text-xs uppercase tracking-wide text-blue-100">{label}</p>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none"
      />
    </div>
  )
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconText,
}: {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  iconBg: string
  iconText: string
}) {
  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900">{value}</p>
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className={`rounded-2xl p-3 ${iconBg} ${iconText}`}>{icon}</div>
      </div>
    </div>
  )
}

function SimpleBox({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string
  subtitle: string
  badge: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          {badge}
        </span>
      </div>
      {children}
    </div>
  )
}

function EmptyText({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-gray-50 px-4 py-6 text-sm text-gray-500">
      {text}
    </div>
  )
}

function ActionRow({
  icon,
  tone,
  title,
  description,
}: {
  icon: React.ReactNode
  tone: 'violet' | 'amber' | 'green' | 'gray'
  title: string
  description: string
}) {
  const tones = {
    violet: 'bg-violet-50 text-violet-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-green-50 text-green-700',
    gray: 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className={`inline-flex rounded-xl p-2 ${tones[tone]}`}>{icon}</div>
      <p className="mt-3 font-semibold text-gray-900">{title}</p>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  )
}
