"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  Download,
  Home,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CatalogItem, CatalogResponse } from "@/types";
import { formatPrice } from "@/services/catalog";

// Constantes para formato A4
const A4_RATIO = 297 / 210; // Alto / Ancho

export default function CatalogoPage() {
  const [catalogData, setCatalogData] = useState<CatalogResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('right');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.7); // Zoom inicial al 70%
  const bookRef = useRef<HTMLDivElement>(null);

  // Fetch catalog data
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch("/api/catalog");
        if (response.ok) {
          const data: CatalogResponse = await response.json();
          setCatalogData(data);
        }
      } catch (error) {
        console.error("Error fetching catalog:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  // Organizar productos por categoría en secciones
  const productsByCategory = catalogData?.products.reduce((acc, product) => {
    const category = product.categoria || 'Sin categoría';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {} as Record<string, CatalogItem[]>) || {};

  // Crear páginas con productos agrupados por categoría (2 productos por página)
  const pages = catalogData?.products ? [
    { type: 'cover' as const },
    ...Object.entries(productsByCategory).flatMap(([category, products]) => [
      { type: 'category-intro' as const, category },
      ...chunkArray(products, 2).map(prods => ({ 
        type: 'products' as const, 
        products: prods,
        category 
      }))
    ]),
    { type: 'contact' as const }
  ] : [];

  const totalPages = pages.length;

  const goToPage = useCallback((page: number, direction: 'left' | 'right') => {
    if (isFlipping || page < 0 || page >= totalPages) return;
    // Navegar en pares para mostrar dos páginas a la vez
    const newPage = direction === 'right' 
      ? Math.min(page, totalPages - 2)
      : Math.max(page, 0);
    setIsFlipping(true);
    setFlipDirection(direction);
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsFlipping(false);
    }, 400);
  }, [isFlipping, totalPages]);

  const nextPage = () => goToPage(currentPage + 2, 'right');
  const prevPage = () => goToPage(currentPage - 2, 'left');

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isFlipping]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-industrial-900 via-industrial-800 to-industrial-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-white/80 text-lg">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-page {
            page-break-after: always;
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>

      <div className={`min-h-screen bg-gradient-to-br from-industrial-900 via-industrial-800 to-industrial-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        
        {/* Controls - Top Right */}
        <div className="no-print fixed top-4 right-4 z-50 flex items-center gap-2">
          <Link href="/" className="p-2 bg-black/50 backdrop-blur-md rounded-lg hover:bg-black/70 transition-colors text-white border border-white/10">
            <Home className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setZoom(Math.max(0.4, zoom - 0.1))}
            className="p-2 bg-black/50 backdrop-blur-md rounded-lg hover:bg-black/70 transition-colors text-white border border-white/10"
            title="Alejar"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-white/80 text-sm min-w-[60px] text-center bg-black/50 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(1.2, zoom + 0.1))}
            className="p-2 bg-black/50 backdrop-blur-md rounded-lg hover:bg-black/70 transition-colors text-white border border-white/10"
            title="Acercar"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-black/50 backdrop-blur-md rounded-lg hover:bg-black/70 transition-colors text-white border border-white/10"
            title="Pantalla completa"
          >
            {isFullscreen ? <X className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors shadow-lg"
          >
            <Printer className="w-5 h-5" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>

        {/* Book Container */}
        <div className="flex flex-col items-center justify-center py-8 px-4 overflow-auto">
          {/* Page Counter */}
          <div className="no-print mb-4 text-white/60 text-sm">
            Páginas {currentPage + 1}-{Math.min(currentPage + 2, totalPages)} de {totalPages}
          </div>

          {/* Book - Two Pages Side by Side - Fixed A4 Size */}
          <div 
            ref={bookRef}
            className="relative flex gap-1 perspective-[2000px] bg-black/20 p-8 rounded-xl shadow-2xl"
            style={{ 
              transform: `scale(${zoom})`,
              transformOrigin: 'center top',
              transition: 'transform 0.3s ease'
            }}
          >
            {/* Left Page - A4 dimensions (210mm x 297mm) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`left-${currentPage}`}
                initial={{ 
                  rotateY: flipDirection === 'left' ? 90 : 0,
                  opacity: flipDirection === 'left' ? 0 : 1
                }}
                animate={{ 
                  rotateY: 0,
                  opacity: 1 
                }}
                exit={{ 
                  rotateY: flipDirection === 'right' ? -90 : 0,
                  opacity: flipDirection === 'right' ? 0 : 1
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="origin-right shadow-2xl"
                style={{ 
                  transformStyle: 'preserve-3d',
                  width: '210mm',
                  height: '297mm'
                }}
              >
                <div className="w-full h-full bg-white rounded-l-lg overflow-hidden print-page">
                  <PageContent page={pages[currentPage]} pageNumber={currentPage} totalPages={totalPages} />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Right Page - A4 dimensions */}
            {currentPage + 1 < totalPages && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`right-${currentPage + 1}`}
                  initial={{ 
                    rotateY: flipDirection === 'right' ? -90 : 0,
                    opacity: flipDirection === 'right' ? 0 : 1
                  }}
                  animate={{ 
                    rotateY: 0,
                    opacity: 1 
                  }}
                  exit={{ 
                    rotateY: flipDirection === 'left' ? 90 : 0,
                    opacity: flipDirection === 'left' ? 0 : 1
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="origin-left shadow-2xl"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    width: '210mm',
                    height: '297mm'
                  }}
                >
                  <div className="w-full h-full bg-white rounded-r-lg overflow-hidden print-page">
                    <PageContent page={pages[currentPage + 1]} pageNumber={currentPage + 1} totalPages={totalPages} />
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Navigation Arrows */}
            <button
              onClick={prevPage}
              disabled={currentPage === 0 || isFlipping}
              className="no-print absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full mr-4 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-white"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage >= totalPages - 2 || isFlipping}
              className="no-print absolute right-0 top-1/2 -translate-y-1/2 translate-x-full ml-4 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-white"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Page Thumbnails */}
          <div className="no-print mt-8 flex items-center gap-2 overflow-x-auto max-w-full px-4 py-2">
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index, index > currentPage ? 'right' : 'left')}
                className={`w-8 h-10 rounded border-2 transition-all flex-shrink-0 ${
                  currentPage === index 
                    ? 'border-accent-500 bg-accent-500/20' 
                    : 'border-white/20 hover:border-white/40 bg-white/5'
                }`}
              >
                <span className="text-xs text-white/60">{index + 1}</span>
              </button>
            ))}
          </div>

          {/* Instructions */}
          <p className="no-print mt-4 text-white/40 text-sm text-center">
            Usa las flechas ← → del teclado o los botones para navegar
          </p>
        </div>
      </div>

      {/* Print Version - All Pages */}
      <div className="hidden print:block">
        {pages.map((page, index) => (
          <div key={index} className="print-page">
            <PageContent page={page} pageNumber={index} totalPages={totalPages} />
          </div>
        ))}
      </div>
    </>
  );
}

// Helper function to chunk array
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Page Content Component
interface PageContentProps {
  page: { type: 'cover' | 'category-intro' | 'products' | 'contact', products?: CatalogItem[], category?: string };
  pageNumber: number;
  totalPages: number;
}

function PageContent({ page, pageNumber, totalPages }: PageContentProps) {
  if (page.type === 'cover') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-industrial-900 via-industrial-800 to-industrial-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-600/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center">
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 relative">
            <Image 
              src="/logo.png" 
              alt="San Gabriel" 
              fill 
              className="object-contain drop-shadow-2xl"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            CATÁLOGO
          </h1>
          <h2 className="text-2xl md:text-3xl text-accent-400 font-light mb-8">
            Productos Industriales
          </h2>
          
          <div className="w-24 h-1 bg-accent-500 mx-auto mb-8" />
          
          <p className="text-white/60 text-lg">
            {new Date().getFullYear()}
          </p>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-white/40 text-sm">
            www.sangabriel.com
          </p>
        </div>
      </div>
    );
  }

  if (page.type === 'category-intro' && page.category) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-accent-500 via-accent-600 to-industrial-900 flex flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 mx-auto mb-8 relative">
            <Image 
              src="/logo.png" 
              alt="San Gabriel" 
              fill 
              className="object-contain drop-shadow-2xl opacity-90"
            />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            {page.category}
          </h2>
          
          <div className="w-32 h-1 bg-white/50 mx-auto" />
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-white/60 text-sm">Página {pageNumber + 1}</p>
        </div>
      </div>
    );
  }

  if (page.type === 'products' && page.products) {
    return (
      <div className="w-full h-full bg-white p-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-industrial-200">
          <div className="w-12 h-12 relative">
            <Image src="/logo.png" alt="San Gabriel" fill className="object-contain opacity-50" />
          </div>
          <h3 className="text-sm font-semibold text-industrial-500 uppercase tracking-wider">
            Catálogo de Productos
          </h3>
        </div>
        
        {/* Products */}
        <div className="flex-1 space-y-6">
          {page.products.map((product, index) => (
            <div key={product.referencia || index} className="flex gap-6 p-5 bg-gradient-to-br from-industrial-50 to-white rounded-2xl border-2 border-industrial-200 shadow-sm hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-industrial-200 overflow-hidden shadow-sm">
                {product.imagen ? (
                  <Image 
                    src={product.imagen} 
                    alt={product.nombre}
                    width={160}
                    height={160}
                    className="object-contain w-full h-full p-3"
                  />
                ) : (
                  <span className="text-5xl font-bold text-industrial-300">
                    {product.nombre?.charAt(0) || 'P'}
                  </span>
                )}
              </div>
              
              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                <div>
                  <h4 className="text-xl font-bold text-industrial-900 mb-3 line-clamp-2 leading-tight">
                    {product.nombre}
                  </h4>
                  
                  <div className="space-y-2">
                    {product.referencia && (
                      <p className="text-sm text-industrial-600">
                        <span className="font-semibold">Código:</span> <span className="font-mono">{product.referencia}</span>
                      </p>
                    )}
                    {product.categoria && (
                      <p className="text-sm text-industrial-600">
                        <span className="font-semibold">Categoría:</span> {product.categoria}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-3xl font-bold text-accent-500">
                    {formatPrice(product.precio)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-industrial-200 flex justify-between items-center">
          <p className="text-xs text-industrial-400 font-medium">San Gabriel - Soluciones Industriales</p>
          <p className="text-xs text-industrial-400">Página {pageNumber + 1}</p>
        </div>
      </div>
    );
  }

  if (page.type === 'contact') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-industrial-50 to-white p-8 md:p-12 flex flex-col">
        <div className="flex-1">
          <div className="w-20 h-20 mb-6 relative">
            <Image src="/logo.png" alt="San Gabriel" fill className="object-contain" />
          </div>
          
          <h2 className="text-3xl font-bold text-industrial-900 mb-2">
            Contáctenos
          </h2>
          <p className="text-industrial-600 mb-8">
            Estamos para ayudarte con tus necesidades industriales
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-accent-500" />
              </div>
              <div>
                <p className="text-sm text-industrial-500">Teléfono</p>
                <p className="text-lg font-semibold text-industrial-900">+54 9 2634 211816</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-accent-500" />
              </div>
              <div>
                <p className="text-sm text-industrial-500">Email</p>
                <p className="text-lg font-semibold text-industrial-900">ventas@sangabriel.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-accent-500" />
              </div>
              <div>
                <p className="text-sm text-industrial-500">Ubicación</p>
                <p className="text-lg font-semibold text-industrial-900">
                  Ruta Nacional 7 y Ruta Provincial 153
                </p>
                <p className="text-sm text-industrial-600">
                  Las Catitas, Santa Rosa, Mendoza
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-accent-500 rounded-xl text-white text-center">
            <p className="text-lg font-semibold mb-2">¿Necesitas una cotización?</p>
            <p className="text-sm text-white/80">
              Contáctanos y te responderemos a la brevedad
            </p>
          </div>
        </div>
        
        <div className="mt-auto pt-6 border-t border-industrial-200">
          <p className="text-xs text-industrial-400 text-right">Página {pageNumber + 1}</p>
        </div>
      </div>
    );
  }

  return null;
}
