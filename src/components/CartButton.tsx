"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface CartButtonProps {
  onClick: () => void;
}

export default function CartButton({ onClick }: CartButtonProps) {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center gap-2 px-4 py-2.5 md:py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-white/20 transition-all border border-white/20"
      aria-label={`Carrito de compras con ${itemCount} artículos`}
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="hidden md:inline">Carrito</span>
      {itemCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </motion.span>
      )}
    </motion.button>
  );
}
