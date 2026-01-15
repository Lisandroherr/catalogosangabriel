"use client";

import { motion } from "framer-motion";
import { PackageX, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
}

export default function EmptyState({
  title = "No se encontraron productos",
  message = "Intenta ajustar los filtros o realizar otra búsqueda.",
  onReset,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-20 h-20 bg-industrial-100 rounded-full flex items-center justify-center mb-6">
        <PackageX className="w-10 h-10 text-industrial-400" />
      </div>
      <h3 className="text-xl font-semibold text-industrial-900 mb-2">{title}</h3>
      <p className="text-industrial-500 mb-6 max-w-md">{message}</p>
      {onReset && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-accent-500 text-white font-medium rounded-xl hover:bg-accent-600 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Restablecer Filtros
        </motion.button>
      )}
    </motion.div>
  );
}
