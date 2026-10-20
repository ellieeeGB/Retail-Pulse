import type { RecommendationItem } from '../../types'

interface Props {
  data: RecommendationItem[]
}

export function MLRecommendations({ data }: Props) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recomendaciones</h3>
          <p className="text-sm text-gray-500">
            Sugerencias basadas en reglas de asociación
          </p>
        </div>
        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600">
          ML
        </span>
      </div>

      {data.length === 0 ? (
        <div className="rounded-2xl bg-gray-50 px-4 py-6 text-sm text-gray-500">
          No hay recomendaciones disponibles todavía.
        </div>
      ) : (
        <div className="space-y-3">
          {data.slice(0, 5).map((item) => (
            <div
              key={item.product_id}
              className="rounded-2xl border border-gray-100 px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">{item.product_name}</p>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  Lift {item.lift.toFixed(2)}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Confianza: {(item.confidence * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
