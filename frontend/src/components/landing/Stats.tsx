// components/landing/Stats.tsx
export const Stats = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-[#2C3E50] mb-2">+50</div>
            <p className="text-gray-600">cafeterías confían en nosotros</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#2C3E50] mb-2">22%</div>
            <p className="text-gray-600">de reducción promedio en mermas</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#2C3E50] mb-2">15%</div>
            <p className="text-gray-600">aumento en ventas cruzadas</p>
          </div>
        </div>
      </div>
    </section>
  );
};
