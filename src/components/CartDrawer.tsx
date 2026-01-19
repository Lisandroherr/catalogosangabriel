"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/services/catalog";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-industrial-200">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-accent-500" />
                <div>
                  <h2 className="text-2xl font-bold text-industrial-900">
                    Mi Carrito
                  </h2>
                  <p className="text-sm text-industrial-500">
                    {getTotalItems()} {getTotalItems() === 1 ? "artículo" : "artículos"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-industrial-100 rounded-lg transition-colors"
                aria-label="Cerrar carrito"
              >
                <X className="w-6 h-6 text-industrial-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-20 h-20 text-industrial-300 mb-4" />
                  <h3 className="text-xl font-semibold text-industrial-900 mb-2">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-industrial-600 mb-6">
                    Agrega productos para comenzar tu pedido
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-colors"
                  >
                    Continuar Comprando
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.referencia}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-4 bg-industrial-50 rounded-xl border border-industrial-200"
                    >
                      {/* Product Image */}
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

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-industrial-900 mb-1 line-clamp-2">
                          {item.product.nombre}
                        </h3>
                        <p className="text-xs font-mono text-industrial-500 mb-2">
                          Ref: {item.product.referencia}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-accent-600">
                            {formatPrice(item.product.precio * item.quantity)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.referencia,
                                  item.quantity - 1
                                )
                              }
                              className="p-1.5 bg-white border border-industrial-300 rounded-lg hover:bg-industrial-100 transition-colors"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="w-4 h-4 text-industrial-600" />
                            </button>
                            <span className="w-8 text-center font-semibold text-industrial-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.referencia,
                                  item.quantity + 1
                                )
                              }
                              className="p-1.5 bg-white border border-industrial-300 rounded-lg hover:bg-industrial-100 transition-colors"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-4 h-4 text-industrial-600" />
                            </button>
                            <button
                              onClick={() => removeItem(item.product.referencia)}
                              className="p-1.5 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors ml-2"
                              aria-label="Eliminar producto"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-industrial-200 p-6 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold text-industrial-900">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-accent-600">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 transition-colors shadow-lg"
                >
                  Proceder al Pago
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={onClose}
                  className="w-full px-6 py-3 bg-industrial-100 text-industrial-700 font-medium rounded-xl hover:bg-industrial-200 transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
