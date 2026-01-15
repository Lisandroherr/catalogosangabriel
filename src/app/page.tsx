"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Factory, 
  TrendingUp, 
  Users,
  Phone,
  RefreshCw,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import type { CatalogItem, CatalogResponse, LoadingState, CategoryFilter } from "@/types";
import {
  Header,
  Footer,
  ProductCard,
  ProductModal,
  CategoryFilter as CategoryFilterComponent,
  SearchBar,
  SortSelect,
  LoadingSpinner,
  EmptyState,
} from "@/components";
import {
  filterByCategory,
  searchProducts,
  sortProducts,
  formatPrice,
} from "@/services/catalog";

// =============================================================================
// MAIN CATALOG PAGE
// =============================================================================
// This page connects to the live ERP system and displays real-time product data
// It handles loading states, errors, and provides retry functionality
// =============================================================================

export default function CatalogPage() {
  // State management
  const [catalogData, setCatalogData] = useState<CatalogResponse | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<CatalogItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter and search state
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("nombre");
  
  // Derived state for filtered products
  const filteredAndSortedProducts = catalogData?.products
    ? sortProducts(
        searchProducts(
          filterByCategory(catalogData.products, activeCategory),
          searchTerm
        ),
        sortBy as any
      )
    : [];

  /**
   * Fetch catalog data from ERP
   */
  const fetchCatalog = useCallback(async () => {
    setLoadingState("loading");
    setError(null);
    
    try {
      const response = await fetch("/api/catalog", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Disable caching for real-time data
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error de conexión" }));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const data: CatalogResponse = await response.json();
      setCatalogData(data);
      setLoadingState("success");
    } catch (err) {
      console.error("Error fetching catalog:", err);
      setError(err instanceof Error ? err.message : "Error al cargar el catálogo");
      setLoadingState("error");
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  /**
   * Handle product modal
   */
  const handleViewDetails = useCallback((product: CatalogItem) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  /**
   * Reset all filters
   */
  const handleResetFilters = useCallback(() => {
    setActiveCategory("all");
    setSearchTerm("");
    setSortBy("nombre");
  }, []);

  /**
   * Refresh catalog data
   */
  const handleRefresh = useCallback(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-industrial-50 to-industrial-100">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-industrial-950 via-industrial-900 to-industrial-800 text-white py-12 md:py-16 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            {/* Gradient Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            {/* Geometric Pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              </svg>
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-industrial-950/80 via-transparent to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/20 border border-accent-500/30 rounded-full text-accent-400 text-sm font-medium mb-6"
              >
                <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
                Catálogo Actualizado en Tiempo Real
              </motion.span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-white">Productos </span>
                <span className="bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent">San Gabriel</span>
              </h1>
              
              <p className="text-lg md:text-xl text-industrial-300 mb-8 leading-relaxed max-w-2xl mx-auto">
                Descubra nuestra línea completa de productos industriales de alta calidad
              </p>
              
              {/* Quick Stats - Solo visible cuando hay datos */}
              {catalogData && loadingState === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-wrap items-center justify-center gap-6 md:gap-8"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Factory className="w-5 h-5 text-accent-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-bold text-white">{catalogData.products.length}</p>
                      <p className="text-xs text-industrial-400">Productos</p>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-white/20 hidden md:block" />
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-accent-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-bold text-white">{catalogData.categories.length}</p>
                      <p className="text-xs text-industrial-400">Categorías</p>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-white/20 hidden md:block" />
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Wifi className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-green-400">En Línea</p>
                      <p className="text-xs text-industrial-400">Sistema ERP</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Error indicator */}
              {loadingState === "error" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2 text-red-400"
                >
                  <WifiOff className="w-5 h-5" />
                  <span className="text-sm">Sin conexión al ERP</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {/* Loading State */}
            {loadingState === "loading" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <LoadingSpinner />
                <p className="mt-4 text-industrial-600">
                  Cargando datos desde el ERP...
                </p>
              </motion.div>
            )}

            {/* Error State */}
            {loadingState === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-red-200 p-8 text-center max-w-2xl mx-auto"
              >
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-industrial-900 mb-2">
                  Error de Conexión
                </h3>
                <p className="text-industrial-600 mb-6">
                  {error || "No se pudo cargar el catálogo desde el ERP."}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 text-white font-medium rounded-xl hover:bg-accent-600 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reintentar
                </motion.button>
              </motion.div>
            )}

            {/* Success State - Catalog */}
            {loadingState === "success" && catalogData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Controls */}
                <div className="space-y-4 mb-8">
                  {/* Category Filter */}
                  <CategoryFilterComponent
                    categories={catalogData.categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    productCount={filteredAndSortedProducts.length}
                  />

                  {/* Search and Sort */}
                  <div className="bg-white rounded-xl border border-industrial-200 p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <SearchBar
                          value={searchTerm}
                          onChange={setSearchTerm}
                          placeholder="Buscar productos por nombre o referencia..."
                        />
                      </div>
                      <div className="md:w-64">
                        <SortSelect value={sortBy} onChange={setSortBy} />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRefresh}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-industrial-100 text-industrial-700 font-medium rounded-xl hover:bg-industrial-200 transition-colors md:w-auto"
                      >
                        <RefreshCw className="w-5 h-5" />
                        <span className="md:hidden">Actualizar</span>
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                <AnimatePresence mode="wait">
                  {filteredAndSortedProducts.length > 0 ? (
                    <motion.div
                      key="products-grid"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                      {filteredAndSortedProducts.map((product, index) => (
                        <ProductCard
                          key={product.referencia}
                          product={product}
                          onViewDetails={handleViewDetails}
                          index={index}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <EmptyState
                        title="No se encontraron productos"
                        message="No hay productos que coincidan con los filtros aplicados."
                        onReset={handleResetFilters}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Last Updated Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-12 text-sm text-industrial-500"
                >
                  <p>
                    Última actualización: {" "}
                    {new Date(catalogData.lastUpdated).toLocaleString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="mt-1">
                    Lista de precios: <strong>{catalogData.priceListName}</strong>
                  </p>
                </motion.div>
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-accent-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Necesita una cotización personalizada?
              </h2>
              <p className="text-accent-100 text-lg mb-8 max-w-2xl mx-auto">
                Nuestro equipo de expertos está listo para ayudarle con soluciones 
                industriales adaptadas a sus necesidades específicas.
              </p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.a
                  href="tel:+5492634211816"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-accent-600 font-semibold rounded-xl hover:bg-accent-50 transition-colors shadow-lg"
                >
                  <Phone className="w-5 h-5" />
                  Contactar Ventas
                </motion.a>
                <motion.a
                  href="mailto:ventas@sangabriel.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-accent-600 transition-colors"
                >
                  Enviar Email
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <Footer />
    </div>
  );
}
