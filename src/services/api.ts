import type { CatalogResponse, CatalogItem } from "@/types";

// =============================================================================
// API SERVICE LAYER
// =============================================================================
// Centralized API calls for the catalog frontend
// All data fetching should go through this layer
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Fetches the catalog data from the backend
 * Returns products joined with prices from the active price list
 * 
 * Business Logic:
 * - Only active products (producto.activo = true) are returned
 * - Only products with prices in the active price list are included
 * - Prices come from lista_precio_item, NOT from producto table
 */
export async function fetchCatalog(): Promise<CatalogResponse> {
  const response = await fetch(`${API_BASE_URL}/api/catalog`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // Disable caching to always get fresh prices
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error fetching catalog: ${response.status}`);
  }

  return response.json();
}

/**
 * Filter products by category
 * @param products - Array of catalog items
 * @param category - Category to filter by, or "all" for no filter
 */
export function filterByCategory(
  products: CatalogItem[],
  category: string
): CatalogItem[] {
  if (category === "all") {
    return products;
  }
  return products.filter((product) => product.categoria === category);
}

/**
 * Search products by name or reference
 * @param products - Array of catalog items
 * @param searchTerm - Search term to filter by
 */
export function searchProducts(
  products: CatalogItem[],
  searchTerm: string
): CatalogItem[] {
  if (!searchTerm.trim()) {
    return products;
  }
  
  const term = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(term) ||
      product.referencia.toLowerCase().includes(term)
  );
}

/**
 * Sort products by various criteria
 */
export function sortProducts(
  products: CatalogItem[],
  sortBy: "nombre" | "precio-asc" | "precio-desc" | "referencia"
): CatalogItem[] {
  const sorted = [...products];
  
  switch (sortBy) {
    case "nombre":
      return sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
    case "precio-asc":
      return sorted.sort((a, b) => a.precio - b.precio);
    case "precio-desc":
      return sorted.sort((a, b) => b.precio - a.precio);
    case "referencia":
      return sorted.sort((a, b) => a.referencia.localeCompare(b.referencia));
    default:
      return sorted;
  }
}

/**
 * Format price for display (Colombian Peso format)
 * @param price - Price value
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format volume for display
 * @param volume - Volume in cubic meters
 */
export function formatVolume(volume: number): string {
  return `${volume.toFixed(2)} m³`;
}

/**
 * Get category icon based on category name
 */
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    "Papel": "📄",
    "Stretch Film": "🎞️",
    "Tubos de Cartón": "🔲",
    "Empaques": "📦",
  };
  return icons[category] || "📋";
}

/**
 * Generate WhatsApp link for quote request
 */
export function generateWhatsAppLink(
  product: CatalogItem,
  phoneNumber: string = "573001234567"
): string {
  const message = encodeURIComponent(
    `Hola, me interesa solicitar una cotización para:\n\n` +
    `📦 Producto: ${product.nombre}\n` +
    `🏷️ Referencia: ${product.referencia}\n` +
    `💰 Precio unitario: ${formatPrice(product.precio)}\n\n` +
    `Por favor, envíenme más información.`
  );
  return `https://wa.me/${phoneNumber}?text=${message}`;
}

/**
 * Generate email link for quote request
 */
export function generateEmailLink(
  product: CatalogItem,
  email: string = "ventas@sangabriel.com"
): string {
  const subject = encodeURIComponent(
    `Solicitud de Cotización - ${product.referencia}`
  );
  const body = encodeURIComponent(
    `Estimados,\n\n` +
    `Me gustaría solicitar una cotización para el siguiente producto:\n\n` +
    `Producto: ${product.nombre}\n` +
    `Referencia: ${product.referencia}\n` +
    `Precio unitario actual: ${formatPrice(product.precio)}\n\n` +
    `Por favor, indíquenme disponibilidad y condiciones de compra.\n\n` +
    `Saludos cordiales.`
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}
