export const Features = () => {
  return (
    <section id="features" className="py-24 px-6 bg-[#F9FAFB]">

      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Todo lo que necesitas para optimizar tu negocio
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          Retail Pulse automatiza decisiones clave con datos y machine learning.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

        {[
          { title: 'Predicción de demanda', color: 'bg-blue-100 text-blue-600' },
          { title: 'Inventario inteligente', color: 'bg-green-100 text-green-600' },
          { title: 'Recomendaciones de venta', color: 'bg-purple-100 text-purple-600' },
          { title: 'Análisis en tiempo real', color: 'bg-orange-100 text-orange-600' },
        ].map((f, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition text-left"
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-4 ${f.color}`}>
              ⚡
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {f.title}
            </h3>
            <p className="text-gray-500 text-sm">
              Automatiza decisiones con datos en tiempo real y mejora tu rentabilidad.
            </p>
          </div>
        ))}

      </div>
    </section>
  )
}
