"use client";

import { motion } from "framer-motion";
import { Phone, Mail, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CartButton from "./CartButton";

interface HeaderProps {
  onCartClick: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-industrial-950/80 backdrop-blur-md border-b border-white/10 shadow-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 relative">
                <Image 
                  src="/logo.png" 
                  alt="San Gabriel" 
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </motion.div>
          </Link>

          {/* Contact Info - Desktop */}
          <div className="hidden xl:flex items-center gap-6 text-white/80 text-sm">
            <a
              href="tel:+5492634211816"
              className="flex items-center gap-2 hover:text-accent-400 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>+54 9 2634 211816</span>
            </a>
            <a
              href="mailto:ventas@sangabriel.com"
              className="flex items-center gap-2 hover:text-accent-400 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>ventas@sangabriel.com</span>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Catalog Button */}
            <Link href="/catalogo">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 md:px-5 py-2.5 md:py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-white/20 transition-all border border-white/20"
              >
                <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Catálogo</span>
              </motion.div>
            </Link>

            {/* Cart Button */}
            <CartButton onClick={onCartClick} />

            {/* Contact CTA */}
            <motion.a
              href="tel:+5492634211816"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 md:px-5 py-2.5 md:py-3 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-all shadow-lg hover:shadow-accent-500/50"
            >
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Cotización</span>
            </motion.a>
          </div>
        </div>
      </div>
    </header>
  );
}
