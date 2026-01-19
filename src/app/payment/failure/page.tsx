"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function PaymentFailurePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-16 h-16 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold text-industrial-900 mb-4">
          Pago Rechazado
        </h1>
        
        <p className="text-xl text-industrial-600 mb-8">
          No se pudo procesar tu pago
        </p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <p className="text-industrial-700">
            Tu pago no pudo ser procesado. Esto puede deberse a:
          </p>
          <ul className="text-left mt-4 space-y-2 text-industrial-600">
            <li>• Fondos insuficientes</li>
            <li>• Datos de tarjeta incorrectos</li>
            <li>• Límite de compra excedido</li>
            <li>• Restricciones del banco emisor</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/checkout')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            Intentar Nuevamente
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-industrial-100 text-industrial-700 font-semibold rounded-xl hover:bg-industrial-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Catálogo
          </button>
        </div>
      </motion.div>
    </div>
  );
}
