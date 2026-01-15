"use client";

import { motion } from "framer-motion";
import { Package, Layers, Eye } from "lucide-react";
import { useState } from "react";
import type { CatalogItem } from "@/types";
import { formatPrice, getCategoryIcon } from "@/services/catalog";

interface ProductCardProps {
  product: CatalogItem;
  onViewDetails: (product: CatalogItem) => void;
  index: number;
}

export default function ProductCard({
  product,
  onViewDetails,
  index,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-xl border border-industrial-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-accent-400 transition-all duration-300"
    >
      {/* Category Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-industrial-900/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
          <span>{getCategoryIcon(product.categoria)}</span>
          {product.categoria}
        </span>
      </div>

      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-industrial-100 to-industrial-50 overflow-hidden">
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
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-20 h-20 text-industrial-300 animate-pulse" />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-20 h-20 text-industrial-300 group-hover:text-accent-400 transition-colors duration-300" />
          </div>
        )}
        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-industrial-950/80 to-transparent flex items-end justify-center pb-4"
        >
          <button
            onClick={() => onViewDetails(product)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-industrial-900 rounded-lg font-medium text-sm hover:bg-accent-500 hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
            Ver Detalles
          </button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Reference */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono bg-industrial-100 text-industrial-600 px-2 py-0.5 rounded">
            {product.referencia}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-lg font-semibold text-industrial-900 mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-accent-600 transition-colors">
          {product.nombre}
        </h3>

        {/* Currency */}
        <div className="flex items-center gap-2 text-sm text-industrial-500 mb-4">
          <Layers className="w-4 h-4" />
          <span>Moneda: {product.moneda}</span>
        </div>

        {/* Price */}
        <div className="pt-4 border-t border-industrial-100">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-industrial-500 uppercase tracking-wide">
              Precio unitario
            </span>
            <span className="text-2xl font-bold text-accent-600">
              {formatPrice(product.precio, product.moneda)}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onViewDetails(product)}
          className="w-full mt-4 py-3 px-4 bg-industrial-900 text-white font-medium rounded-lg hover:bg-accent-600 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" />
          Solicitar Cotización
        </motion.button>
      </div>

      {/* Decorative accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 to-accent-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </motion.article>
  );
}
