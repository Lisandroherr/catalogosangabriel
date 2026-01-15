import { NextResponse } from "next/server";
import { fetchCatalogFromERP, retryFetch } from "@/services/catalog";

// =============================================================================
// ERP PROXY API ROUTE
// =============================================================================
// This route proxies requests to the live ERP system
// It provides a consistent interface for the frontend while connecting
// to the real-time ERP data at: https://erp-v0.onrender.com/api/catalogo
// =============================================================================

export async function GET() {
  try {
    // Fetch real-time data from ERP with retry logic
    const catalogData = await retryFetch(() => fetchCatalogFromERP(), 2, 1000);

    return NextResponse.json(catalogData, {
      status: 200,
      headers: {
        // Disable caching for real-time ERP data
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error fetching catalog from ERP:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Error al conectar con el sistema ERP";

    return NextResponse.json(
      { 
        error: errorMessage,
        code: "ERP_CONNECTION_ERROR",
        timestamp: new Date().toISOString(),
      },
      { 
        status: 503, // Service Unavailable
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
