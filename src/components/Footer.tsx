"use client";

import { Factory, Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-industrial-950 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
                <Factory className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">San Gabriel</h2>
                <p className="text-xs text-industrial-400 uppercase tracking-wider">
                  Soluciones Industriales
                </p>
              </div>
            </Link>
            <p className="text-industrial-400 text-sm leading-relaxed">
              Líderes en la fabricación y distribución de productos de papel,
              stretch film, tubos de cartón y soluciones de empaque para la
              industria.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Productos</h3>
            <ul className="space-y-2">
              {[
                "Papel Higiénico Industrial",
                "Stretch Film",
                "Tubos de Cartón",
                "Empaques y Cajas",
                "Papel Toalla",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/"
                    className="text-industrial-400 hover:text-accent-400 transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2">
              {[
                "Sobre Nosotros",
                "Nuestra Planta",
                "Certificaciones",
                "Sostenibilidad",
                "Trabaja con Nosotros",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/"
                    className="text-industrial-400 hover:text-accent-400 transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+5492634211816"
                  className="flex items-center gap-3 text-industrial-400 hover:text-accent-400 transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  +54 9 2634 211816
                </a>
              </li>
              <li>
                <a
                  href="mailto:ventas@sangabriel.com"
                  className="flex items-center gap-3 text-industrial-400 hover:text-accent-400 transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  ventas@sangabriel.com
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-industrial-400 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Intersección Ruta Nacional 7 y Ruta Provincial 153
                    <br />
                    Las Catitas, Santa Rosa, Mendoza, Argentina
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-industrial-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-industrial-400">
            <p>
              © {new Date().getFullYear()} San Gabriel. Todos los derechos
              reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/" className="hover:text-accent-400 transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/" className="hover:text-accent-400 transition-colors">
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
