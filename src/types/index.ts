// Type definitions for the ERP catalog system

// ERP Response types
export interface ERPProduct {
  referencia: string;
  nombre: string;
  categoria: string;
  precio: number;
  moneda: string;
  imagen: string | null;
}

export interface ERPCatalogResponse {
  success: boolean;
  lista: string;
  productos: ERPProduct[];
}

// Frontend catalog item (normalized from ERP data)
export interface CatalogItem {
  referencia: string;
  nombre: string;
  categoria: string;
  precio: number;
  moneda: string;
  imagen: string | null;
}

export interface CatalogResponse {
  products: CatalogItem[];
  categories: string[];
  priceListName: string;
  lastUpdated: string;
  currency: string;
}

export interface CatalogError {
  message: string;
  code?: string;
}

export type CategoryFilter = string | "all";
export type LoadingState = "idle" | "loading" | "success" | "error";

// Cart types
export interface CartItem {
  product: CatalogItem;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface PaymentInfo {
  cbu: string;
  alias: string;
  bankName: string;
  accountHolder: string;
}
