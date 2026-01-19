"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Building2,
  Copy,
  Check,
  Trash2,
  Plus,
  Minus,
  Smartphone,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/services/catalog";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    getTotalPrice,
    getTotalItems,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  // Información de pago
  const paymentInfo = {
    cbu: "1430001713003688800016",
    alias: "herrera.moreno",
    bankName: "Banco Ejemplo",
    accountHolder: "San Gabriel S.A.",
  };

  // Link de pago de Mercado Pago
  const mercadoPagoLink = "https://link.mercadopago.com.ar/mapleleafssoftwares";

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmitOrder = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    // Aquí podrías enviar la orden a un backend
    const orderData = {
      customer: customerInfo,
      items: items,
      total: getTotalPrice(),
      date: new Date().toISOString(),
    };

    console.log("Orden enviada:", orderData);
    
    setOrderSubmitted(true);

    // Limpiar el carrito después de enviar
    setTimeout(() => {
      clearCart();
      router.push("/");
    }, 5000);
  };

  const handleMercadoPagoPayment = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    // Guardar la información del pedido antes de redirigir
    const orderData = {
      customer: customerInfo,
      items: items,
      total: getTotalPrice(),
      date: new Date().toISOString(),
    };

    // Guardar en localStorage para recuperar después
    localStorage.setItem('sangabriel-pending-order', JSON.stringify(orderData));

    // Redirigir al link de pago de Mercado Pago
    window.location.href = mercadoPagoLink;
  };

  const sendWhatsAppMessage = () => {
    const amount = getTotalPrice();
    const formattedAmount = amount.toFixed(2);
    
    // Crear mensaje para WhatsApp
    const message = `
🛒 *Pedido San Gabriel*

📦 Productos: ${getTotalItems()}
💰 Total: $${formattedAmount}

💳 *Datos para transferencia:*
• Alias: ${paymentInfo.alias}
• CBU: ${paymentInfo.cbu}
• Titular: ${paymentInfo.accountHolder}

Nombre: ${customerInfo.name}
Email: ${customerInfo.email}
Teléfono: ${customerInfo.phone}
${customerInfo.notes ? `\nNotas: ${customerInfo.notes}` : ''}
    `.trim();
    
    // Número de WhatsApp del negocio (reemplazar con el número real)
    const whatsappNumber = '5492634211816'; // Formato: código país + número sin espacios ni signos
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (items.length === 0 && !orderSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-industrial-50 to-industrial-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <ShoppingBag className="w-20 h-20 text-industrial-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-industrial-900 mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-industrial-600 mb-6">
            Agrega productos para continuar con tu pedido
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-colors font-medium"
          >
            Ir al Catálogo
          </button>
        </div>
      </div>
    );
  }

  if (orderSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-industrial-900 mb-4">
            ¡Pedido Recibido!
          </h2>
          <p className="text-lg text-industrial-600 mb-6">
            Gracias por tu pedido. Nos pondremos en contacto contigo pronto.
          </p>
          <div className="bg-accent-50 border border-accent-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-industrial-900 mb-4 text-lg">
              Opciones de Pago:
            </h3>
            
            <div className="space-y-3 mb-4">
              {/* Mercado Pago Button */}
              <button
                onClick={handleMercadoPagoPayment}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#009EE3] text-white font-semibold rounded-xl hover:bg-[#0083c1] transition-colors shadow-lg"
              >
                <CreditCard className="w-5 h-5" />
                Pagar con Mercado Pago
              </button>

              {/* WhatsApp Button */}
              <button
                onClick={sendWhatsAppMessage}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#20BA5A] transition-colors shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Enviar por WhatsApp
              </button>
            </div>
            
            <div className="border-t border-accent-200 pt-4 mt-4">
              <p className="text-sm text-industrial-700 mb-2">
                <strong>O realiza la transferencia manualmente:</strong>
              </p>
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center bg-white rounded-lg p-3">
                  <span className="text-sm text-industrial-600">CBU:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono">{paymentInfo.cbu}</code>
                    <button
                      onClick={() => handleCopy(paymentInfo.cbu, "cbu-confirm")}
                      className="p-1 hover:bg-industrial-100 rounded"
                    >
                      {copiedField === "cbu-confirm" ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-industrial-600" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3">
                  <span className="text-sm text-industrial-600">Alias:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono">{paymentInfo.alias}</code>
                    <button
                      onClick={() => handleCopy(paymentInfo.alias, "alias-confirm")}
                      className="p-1 hover:bg-industrial-100 rounded"
                    >
                      {copiedField === "alias-confirm" ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-industrial-600" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3">
                  <span className="text-sm text-industrial-600">Titular:</span>
                  <span className="text-sm font-semibold">{paymentInfo.accountHolder}</span>
                </div>
              </div>
            </div>
            
            <p className="text-2xl font-bold text-accent-600 mt-4">
              Monto: {formatPrice(getTotalPrice())}
            </p>
          </div>
          <p className="text-sm text-industrial-500">
            Serás redirigido al catálogo en unos segundos...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-industrial-50 to-industrial-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-industrial-600 hover:text-accent-500 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Catálogo
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-industrial-900">
            Finalizar Pedido
          </h1>
          <p className="text-industrial-600 mt-2">
            {getTotalItems()} {getTotalItems() === 1 ? "artículo" : "artículos"} en tu carrito
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details & Customer Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-industrial-900 mb-4">
                Información de Contacto
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-industrial-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-industrial-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="juan@ejemplo.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-industrial-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="+54 9 2634 211816"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-industrial-700 mb-2">
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, notes: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-industrial-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
                    rows={3}
                    placeholder="Instrucciones especiales, dirección de entrega, etc."
                  />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-industrial-900 mb-4">
                Resumen del Pedido
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.referencia}
                    className="flex gap-4 p-4 bg-industrial-50 rounded-xl border border-industrial-200"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                      {item.product.imagen ? (
                        <img
                          src={item.product.imagen}
                          alt={item.product.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-industrial-100">
                          <ShoppingBag className="w-8 h-8 text-industrial-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-industrial-900 mb-1">
                        {item.product.nombre}
                      </h3>
                      <p className="text-xs font-mono text-industrial-500 mb-2">
                        Ref: {item.product.referencia}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-accent-600">
                          {formatPrice(item.product.precio * item.quantity)}
                        </p>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.referencia,
                                item.quantity - 1
                              )
                            }
                            className="p-1.5 bg-white border border-industrial-300 rounded-lg hover:bg-industrial-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.referencia,
                                item.quantity + 1
                              )
                            }
                            className="p-1.5 bg-white border border-industrial-300 rounded-lg hover:bg-industrial-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeItem(item.product.referencia)}
                            className="p-1.5 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 ml-2"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Payment & Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-industrial-900 mb-4">
                Total del Pedido
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-industrial-600">
                  <span>Subtotal ({getTotalItems()} artículos)</span>
                  <span className="font-semibold">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <div className="flex justify-between text-industrial-600">
                  <span>Envío</span>
                  <span className="font-semibold">A coordinar</span>
                </div>
                <div className="border-t border-industrial-200 pt-3">
                  <div className="flex justify-between text-xl">
                    <span className="font-bold text-industrial-900">Total</span>
                    <span className="font-bold text-accent-600">
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-accent-600" />
                  <h3 className="font-semibold text-industrial-900">
                    Datos para Transferencia
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-industrial-600 block mb-1">
                      CBU
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-white rounded-lg text-sm font-mono text-industrial-900 border border-industrial-200">
                        {paymentInfo.cbu}
                      </code>
                      <button
                        onClick={() => handleCopy(paymentInfo.cbu, "cbu")}
                        className="p-2 bg-white border border-industrial-200 rounded-lg hover:bg-industrial-100 transition-colors"
                        title="Copiar CBU"
                      >
                        {copiedField === "cbu" ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-industrial-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-industrial-600 block mb-1">
                      Alias
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-white rounded-lg text-sm font-mono text-industrial-900 border border-industrial-200">
                        {paymentInfo.alias}
                      </code>
                      <button
                        onClick={() => handleCopy(paymentInfo.alias, "alias")}
                        className="p-2 bg-white border border-industrial-200 rounded-lg hover:bg-industrial-100 transition-colors"
                        title="Copiar Alias"
                      >
                        {copiedField === "alias" ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-industrial-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-accent-200">
                    <p className="text-xs text-industrial-600">
                      <strong>Titular:</strong> {paymentInfo.accountHolder}
                    </p>
                    <p className="text-xs text-industrial-600">
                      <strong>Banco:</strong> {paymentInfo.bankName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Buttons */}
              <div className="space-y-3">
                {/* Mercado Pago Button - PRINCIPAL */}
                <button
                  onClick={handleMercadoPagoPayment}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#009EE3] text-white font-semibold rounded-xl hover:bg-[#0083c1] transition-colors shadow-lg"
                >
                  <CreditCard className="w-5 h-5" />
                  Pagar con Mercado Pago
                </button>

                {/* WhatsApp Button */}
                <button
                  onClick={() => {
                    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
                      alert("Por favor completa todos los campos obligatorios");
                      return;
                    }
                    sendWhatsAppMessage();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white font-medium rounded-xl hover:bg-[#20BA5A] transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Enviar Pedido por WhatsApp
                </button>

                {/* Confirm Order Button */}
                <button
                  onClick={handleSubmitOrder}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-industrial-100 text-industrial-700 font-medium rounded-xl hover:bg-industrial-200 transition-colors"
                >
                  <Check className="w-5 h-5" />
                  Solo Confirmar (sin pagar ahora)
                </button>
              </div>

              <div className="text-xs text-center text-industrial-500 mt-4 space-y-1">
                <p><strong className="text-blue-600">🔵 Mercado Pago:</strong> Paga con tarjeta, efectivo o transferencia</p>
                <p><strong className="text-green-600">🟢 WhatsApp:</strong> Envía tu pedido y coordina el pago</p>
                <p><strong>⚪ Confirmar:</strong> Te contactaremos para coordinar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
