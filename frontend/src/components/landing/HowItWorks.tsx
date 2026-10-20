// components/landing/HowItWorks.tsx
const steps = [
  { number: '1', title: 'Conecta tu POS', description: 'Integramos tu sistema de punto de venta en minutos.' },
  { number: '2', title: 'Analizamos datos', description: 'Procesamos ventas, clima y eventos en tiempo real.' },
  { number: '3', title: 'Predecimos la demanda', description: 'Modelos de Machine Learning personalizados por tienda.' },
  { number: '4', title: 'Automatizamos decisiones', description: 'Generamos pedidos y recomendaciones automáticamente.' },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FDF8F2]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#4A2C2C] mb-12">
          Cómo funciona
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="w-12 h-12 bg-[#A67B5B] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-[#4A2C2C] mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
