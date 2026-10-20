// components/landing/Contact.tsx
export const Contact = () => {
  return (
    <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FDF8F2]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#4A2C2C] mb-4">¿Listo para transformar tu negocio?</h2>
        <p className="text-lg text-gray-600 mb-8">
          Contáctanos y descubre cómo Retail Pulse puede ayudarte.
        </p>
        <a
          href="mailto:elliot.gballesteros@gmail.com"
          className="inline-flex items-center gap-2 bg-[#2C3E50] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#1e2b37] transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          elliot.gballesteros@gmail.com
        </a>
      </div>
    </section>
  );
};
