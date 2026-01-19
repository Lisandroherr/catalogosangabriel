"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, ArrowLeft, Download } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    // Limpiar el carrito cuando el pago es exitoso
    clearCart();

    // Obtener información del pago de los parámetros
    const info = {
      paymentId: searchParams.get('payment_id'),
      status: searchParams.get('status'),
      externalReference: searchParams.get('external_reference'),
      preferenceId: searchParams.get('preference_id'),
    };
    
    setPaymentInfo(info);

    // Redirigir al inicio después de 10 segundos
    const timeout = setTimeout(() => {
      router.push('/');
    }, 10000);

    return () => clearTimeout(timeout);
  }, [clearCart, router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-16 h-16 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold text-industrial-900 mb-4">
          ¡Pago Exitoso!
        </h1>
        
        <p className="text-xl text-industrial-600 mb-8">
          Tu pago ha sido procesado correctamente
        </p>

        {paymentInfo?.paymentId && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-industrial-900 mb-4">
              Detalles del Pago
            </h3>
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-industrial-600">ID de Pago:</span>
                <span className="font-mono font-semibold">{paymentInfo.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-industrial-600">Estado:</span>
                <span className="font-semibold text-green-600">Aprobado</span>
              </div>
              {paymentInfo.externalReference && (
                <div className="flex justify-between">
                  <span className="text-industrial-600">Nº de Pedido:</span>
                  <span className="font-mono font-semibold">{paymentInfo.externalReference}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-industrial-600">
            Recibirás un email con los detalles de tu compra.
            <br />
            Te contactaremos pronto para coordinar la entrega.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al Catálogo
            </button>
          </div>

          <p className="text-sm text-industrial-500 mt-6">
            Serás redirigido automáticamente en 10 segundos...
          </p>
        </div>
      </motion.div>
    </div>
  );
}
