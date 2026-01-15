"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  X,
  Package,
  Layers,
  Tag,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import type { CatalogItem } from "@/types";
import {
  formatPrice,
  getCategoryIcon,
  generateWhatsAppLink,
  generateEmailLink,
} from "@/services/catalog";

interface ProductModalProps {
  product: CatalogItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
}: ProductModalProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Reset image state when product changes
  useEffect(() => {
    setImageError(false);
    setImageLoading(true);
  }, [product]);

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with enhanced design */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: 'radial-gradient(circle at 30% 50%, rgba(249, 115, 22, 0.15), transparent 60%), radial-gradient(circle at 70% 70%, rgba(249, 115, 22, 0.1), transparent 50%), rgba(17, 24, 39, 0.75)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Animated pattern overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }} />
            </div>
          </motion.div>

          {/* Modal - Centered with flex */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col pointer-events-auto"
              style={{ maxHeight: '85vh' }}
            >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 p-1.5 bg-white shadow-xl rounded-full transition-all hover:scale-110 hover:rotate-90 border border-industrial-200"
            >
              <X className="w-4 h-4 text-industrial-700" />
            </button>

            {/* Header with Image */}
            <div className="relative h-40 bg-gradient-to-br from-industrial-900 to-industrial-800 overflow-hidden flex-shrink-0 rounded-t-2xl">
              {product.imagen && !imageError ? (
                <>
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageError(true);
                      setImageLoading(false);
                    }}
                  />
                  {/* Loading state */}
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-16 h-16 text-white/30 animate-pulse" />
                    </div>
                  )}
                  {/* Gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-industrial-950/80 via-industrial-950/40 to-transparent" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Package className="w-16 h-16 text-white/30" />
                    </motion.div>
                  </div>
                </>
              )}
              {/* Category Badge */}
              <div className="absolute bottom-4 left-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full">
                  <span className="text-lg">{getCategoryIcon(product.categoria)}</span>
                  <span className="font-medium">{product.categoria}</span>
                </span>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* Reference & Name */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono bg-accent-100 text-accent-700 px-2.5 py-1 rounded-full">
                    {product.referencia}
                  </span>
                </div>
                <h2 className="text-base font-bold text-industrial-900 leading-tight">
                  {product.nombre}
                </h2>
              </div>

              {/* Product Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-industrial-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-industrial-500 mb-1">
                    <Tag className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-wide">Referencia</span>
                  </div>
                  <p className="text-sm font-semibold text-industrial-900">
                    {product.referencia}
                  </p>
                </div>
                <div className="bg-industrial-50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-industrial-500 mb-1">
                    <Layers className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-wide">Moneda</span>
                  </div>
                  <p className="text-sm font-semibold text-industrial-900">
                    {product.moneda}
                  </p>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl p-4 mb-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-accent-100 text-[10px] uppercase tracking-wide mb-1">
                      Precio Unitario
                    </p>
                    <p className="text-2xl font-bold">
                      {formatPrice(product.precio, product.moneda)}
                    </p>
                  </div>
                  <Package className="w-10 h-10 text-white/30" />
                </div>
                <p className="text-accent-100 text-[10px] mt-2">
                  * Precios sujetos a cantidades mínimas
                </p>
              </div>

              {/* Contact CTA Section */}
              <div>
                <h3 className="text-sm font-semibold text-industrial-900 mb-3">
                  Solicitar Cotización
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  {/* WhatsApp */}
                  <motion.a
                    href={generateWhatsAppLink(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center justify-center gap-1 py-3 px-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors shadow-md"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-[10px]">WhatsApp</span>
                  </motion.a>

                  {/* Email */}
                  <motion.a
                    href={generateEmailLink(product)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center justify-center gap-1 py-3 px-2 bg-industrial-900 text-white font-medium rounded-lg hover:bg-industrial-800 transition-colors shadow-md"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-[10px]">Email</span>
                  </motion.a>

                  {/* Phone */}
                  <motion.a
                    href="tel:+5492634211816"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center justify-center gap-1 py-3 px-2 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-colors shadow-md"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="text-[10px]">Llamar</span>
                  </motion.a>
                </div>

                <p className="text-center text-[10px] text-industrial-500 mt-3">
                  Le responderemos en menos de 24 horas
                </p>
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
