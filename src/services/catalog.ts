import type { ERPCatalogResponse, CatalogResponse, CatalogItem, CatalogError } from "@/types";

// =============================================================================
// ERP CATALOG SERVICE
// =============================================================================
// Service layer for fetching product data from the live ERP system
// This is the single source of truth for all product and pricing data
// =============================================================================

const ERP_BASE_URL = "https://erp-v0.onrender.com";
const CATALOG_ENDPOINT = "/api/catalogo";
const PRICE_LIST = "Retail";

/**
 * Build full image URL from ERP image field
 * @param imageName - Image filename or URL from ERP
 * @returns Full URL or null if no image
 */
function buildImageUrl(imageName: string | null): string | null {
  if (!imageName) return null;
  
  // If it's already a full URL, return as-is
  if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
    return imageName;
  }
  
  // Build full URL using ERP base URL
  // Assuming images are served from /api/productos/imagen/ endpoint
  return `${ERP_BASE_URL}/api/productos/imagen/${imageName}`;
}

/**
 * Fetches catalog data from the ERP system
 * Returns real-time product data with prices
 * 
 * ERP Business Logic:
 * - Products and prices come from the ERP's active catalog
 * - Only products in the specified price list are returned
 * - Prices are always current and reflect ERP changes immediately
 */
export async function fetchCatalogFromERP(): Promise<CatalogResponse> {
  const url = `${ERP_BASE_URL}${CATALOG_ENDPOINT}?lista=${PRICE_LIST}`;
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      // Disable caching for real-time data
      cache: "no-store",
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 seconds
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching catalog from ERP: ${response.status} ${response.statusText}`
      );
    }

    const erpData: ERPCatalogResponse = await response.json();

    if (!erpData.success) {
      throw new Error("ERP returned unsuccessful response");
    }

    // Transform ERP data to our frontend format
    const products: CatalogItem[] = erpData.productos.map((product) => ({
      referencia: product.referencia,
      nombre: product.nombre,
      categoria: product.categoria,
      precio: product.precio,
      moneda: product.moneda,
      imagen: buildImageUrl(product.imagen),
    }));

    // Extract unique categories
    const categories = [...new Set(products.map((item) => item.categoria))];

    const catalogResponse: CatalogResponse = {
      products,
      categories,
      priceListName: erpData.lista,
      lastUpdated: new Date().toISOString(),
      currency: products[0]?.moneda || "ARS",
    };

    return catalogResponse;
  } catch (error) {
    console.error("Error fetching catalog from ERP:", error);
    
    // Provide detailed error information
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("No se pudo conectar con el sistema ERP. Verifique su conexión a internet.");
    }
    
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("La solicitud al ERP tardó demasiado. Intente nuevamente.");
    }
    
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Error desconocido al cargar el catálogo"
    );
  }
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
 * Format price for display based on currency
 * @param price - Price value
 * @param currency - Currency code (ARS, USD, etc.)
 */
export function formatPrice(price: number, currency: string = "ARS"): string {
  const currencyMap: Record<string, { locale: string; currency: string }> = {
    ARS: { locale: "es-AR", currency: "ARS" },
    USD: { locale: "en-US", currency: "USD" },
    COP: { locale: "es-CO", currency: "COP" },
    // Add more currencies as needed
  };

  const config = currencyMap[currency] || { locale: "es-AR", currency: "ARS" };

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Get category icon based on category name
 */
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    "Papel Higiénico": "🧻",
    "Papel": "📄", 
    "Stretch Film": "🎞️",
    "Tubos de Cartón": "🔲",
    "Empaques": "📦",
    "Toallas": "🗞️",
    "Servilletas": "🥢",
  };
  
  // Try exact match first, then partial matches
  if (icons[category]) {
    return icons[category];
  }
  
  // Partial matching for similar categories
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes("papel")) return "📄";
  if (lowerCategory.includes("stretch") || lowerCategory.includes("film")) return "🎞️";
  if (lowerCategory.includes("tubo") || lowerCategory.includes("cartón")) return "🔲";
  if (lowerCategory.includes("empaque") || lowerCategory.includes("caja")) return "📦";
  if (lowerCategory.includes("toalla")) return "🗞️";
  if (lowerCategory.includes("servilleta")) return "🥢";
  
  return "📋"; // Default icon
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
    `💰 Precio unitario: ${formatPrice(product.precio, product.moneda)}\n\n` +
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
    `Precio unitario actual: ${formatPrice(product.precio, product.moneda)}\n\n` +
    `Por favor, indíquenme disponibilidad y condiciones de compra.\n\n` +
    `Saludos cordiales.`
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

/**
 * Retry helper for failed requests
 */
export async function retryFetch<T>(
  fetchFn: () => Promise<T>,
  retries: number = 2,
  delay: number = 1000
): Promise<T> {
  try {
    return await fetchFn();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retry attempt. ${retries} attempts remaining.`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryFetch(fetchFn, retries - 1, delay * 1.5);
    }
    throw error;
  }
}