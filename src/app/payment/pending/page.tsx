"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, ArrowLeft } from "lucide-react";

export default function PaymentPendingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-16 h-16 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold text-industrial-900 mb-4">
          Pago Pendiente
        </h1>
        
        <p className="text-xl text-industrial-600 mb-8">
          Tu pago está siendo procesado
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <p className="text-industrial-700 mb-4">
            Tu pago está en proceso de confirmación.
          </p>
          <p className="text-industrial-600">
            Esto puede deberse a:
          </p>
          <ul className="text-left mt-4 space-y-2 text-industrial-600">
            <li>• Pago en efectivo pendiente de acreditación</li>
            <li>• Transferencia bancaria en proceso</li>
            <li>• Verificación de seguridad del banco</li>
          </ul>
          <p className="text-industrial-700 mt-4">
            Te notificaremos cuando se confirme el pago.
          </p>
        </div>

        <button
          onClick={() => router.push('/')}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors shadow-lg mx-auto"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al Catálogo
        </button>
      </motion.div>
    </div>
  );
}
