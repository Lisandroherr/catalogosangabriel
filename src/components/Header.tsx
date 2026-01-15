"use client";

import { motion } from "framer-motion";
import { Factory, Phone, Mail, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-industrial-200">
      {/* Top Bar */}
      <div className="bg-industrial-950 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-2 text-xs md:text-sm">
            <div className="flex items-center gap-4 md:gap-6">
              <a
                href="tel:+5492634211816"
                className="flex items-center gap-1.5 hover:text-accent-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+54 9 2634 211816</span>
              </a>
              <a
                href="mailto:ventas@sangabriel.com"
                className="flex items-center gap-1.5 hover:text-accent-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>ventas@sangabriel.com</span>
              </a>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-industrial-300">
              <Clock className="w-3.5 h-3.5" />
              <span>Lun - Vie: 8:00 AM - 6:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <Factory className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-industrial-900 tracking-tight">
                San Gabriel
              </h1>
              <p className="text-xs text-industrial-500 uppercase tracking-wider">
                Soluciones Industriales
              </p>
            </div>
          </Link>

          {/* CTA Button */}
          <motion.a
            href="tel:+5492634211816"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-accent-500 text-white font-medium rounded-xl hover:bg-accent-600 transition-colors shadow-md"
          >
            <Phone className="w-5 h-5" />
            Solicitar Cotización
          </motion.a>

          {/* Mobile CTA */}
          <motion.a
            href="tel:+5492634211816"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden flex items-center justify-center w-12 h-12 bg-accent-500 text-white rounded-xl"
          >
            <Phone className="w-5 h-5" />
          </motion.a>
        </div>
      </div>
    </header>
  );
}
