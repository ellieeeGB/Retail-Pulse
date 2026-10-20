import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="pt-32 pb-24 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">

      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto text-center relative z-10">

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Inteligencia artificial <br />
          para decisiones reales
        </h1>

        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10">
          Predice demanda, optimiza inventario y aumenta tus ventas con Retail Pulse.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <Link
            to="/login"
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:scale-105 transition"
          >
            Entrar al dashboard
          </Link>

          <a
            href="#contact"
            className="border border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition"
          >
            Solicitar demo
          </a>

        </div>

      </div>
    </section>
  );
};
