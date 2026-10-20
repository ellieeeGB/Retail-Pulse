import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold text-gray-900">
              Retail Pulse
            </span>
          </Link>

          {/* LINKS */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">

            <a href="#features" className="hover:text-gray-900 transition">
              Características
            </a>

            <a href="#how-it-works" className="hover:text-gray-900 transition">
              Cómo funciona
            </a>

            <a href="#contact" className="hover:text-gray-900 transition">
              Contacto
            </a>

          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">

            <Link
              to="/login"
              className="hidden sm:block text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Login
            </Link>

            <Link
              to="/login"
              className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition shadow-sm hover:shadow-md"
            >
              Dashboard
            </Link>

          </div>

        </div>
      </div>
    </nav>
  );
};
