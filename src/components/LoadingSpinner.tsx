"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-industrial-200 border-t-accent-500 rounded-full"
      />
      <p className="mt-4 text-industrial-500 font-medium">
        Cargando catálogo...
      </p>
    </div>
  );
}
