"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { CartItem, CatalogItem } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (product: CatalogItem, quantity?: number) => void;
  removeItem: (referencia: string) => void;
  updateQuantity: (referencia: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (referencia: string) => boolean;
  getItemQuantity: (referencia: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("sangabriel-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("sangabriel-cart", JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addItem = (product: CatalogItem, quantity: number = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.referencia === product.referencia
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.referencia === product.referencia
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...currentItems, { product, quantity }];
    });
  };

  const removeItem = (referencia: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.referencia !== referencia)
    );
  };

  const updateQuantity = (referencia: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(referencia);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.referencia === referencia ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce(
      (total, item) => total + item.product.precio * item.quantity,
      0
    );
  };

  const isInCart = (referencia: string) => {
    return items.some((item) => item.product.referencia === referencia);
  };

  const getItemQuantity = (referencia: string) => {
    const item = items.find((item) => item.product.referencia === referencia);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
