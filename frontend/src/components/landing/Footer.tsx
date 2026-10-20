import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="bg-[#4A2C2C] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Logo />
              <span className="text-xl font-bold">Retail Pulse</span>
            </div>
            <p className="text-sm text-gray-300">
              Automatización inteligente para el sector gastronómico.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#features" className="hover:text-white">Características</a></li>
              <li><a href="#how-it-works" className="hover:text-white">Cómo funciona</a></li>
              <li><a href="#contact" className="hover:text-white">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/privacidad" className="hover:text-white">Aviso de privacidad</a></li>
              <li><a href="/terminos" className="hover:text-white">Términos de uso</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="mailto:elliot.gballesteros@gmail.com" className="hover:text-white">
                  elliot.gballesteros@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#A67B5B] mt-8 pt-8 text-center text-sm text-gray-300">
          © {new Date().getFullYear()} Retail Pulse. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
