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

  // Definir secciones con sus referencias específicas
  const sections = [
    { name: 'Línea Clásica', refs: ['3', '6', '2', '5'] },
    { name: 'Línea Extra Suave', refs: ['9', '10', '11'] },
    { name: 'Línea San Marino', refs: ['12', '13', '14'] },
    { name: 'Individual Natural', refs: ['1', '7', '4', '8'] },
    { name: 'Rollos Blancos', refs: ['15', '18', '17', '16', '19', '20', '22', '26', '25'] },
    { name: 'Otros Productos', refs: ['24', '23'] },
    { name: 'Film Stretch', refs: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'] }
  ];

  // Debug: Ver todas las referencias disponibles
  useEffect(() => {
    if (catalogData?.products) {
      console.log('Referencias disponibles:', catalogData.products.map(p => p.referencia));
      console.log('Total productos:', catalogData.products.length);
    }
  }, [catalogData]);

  // Organizar productos por secciones
  const productsBySections = sections.map(section => {
    const sectionProducts = catalogData?.products.filter(p => 
      section.refs.some(ref => p.referencia.toLowerCase().includes(ref.toLowerCase()))
    ) || [];
    // Ordenar productos según el orden de las referencias en la sección
    const orderedProducts = section.refs
      .map(ref => sectionProducts.find(p => p.referencia.toLowerCase().includes(ref.toLowerCase())))
      .filter(Boolean) as CatalogItem[];
    console.log(`Sección ${section.name}:`, orderedProducts.length, 'productos');
    return { ...section, products: orderedProducts };
  }).filter(section => section.products.length > 0);

  // Crear páginas con productos agrupados por sección (4 productos por página)
  const pages = catalogData?.products ? [
    { type: 'cover' as const },
    { type: 'about' as const },
    { type: 'index' as const, sections: productsBySections },
    ...productsBySections.flatMap(section => 
      chunkArray(section.products, 4).map(prods => ({ 
        type: 'products' as const, 
        products: prods,
        category: section.name 
      }))
    ),
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
          html, body {
            margin: 0;
            padding: 0;
            overflow: visible;
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
            display: block;
          }
          .print-only {
            display: block !important;
          }
          .screen-only {
            display: none !important;
          }
        }
        @media screen {
          .print-only {
            display: none;
          }
          .screen-only {
            display: block;
          }
        }
      `}</style>

      <div className={`screen-only min-h-screen bg-gradient-to-br from-industrial-900 via-industrial-800 to-industrial-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        
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
                transition={{ duration: 0.4, ease: "easeInOut" }}
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
                  transition={{ duration: 0.4, ease: "easeInOut" }}
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
      <div className="print-only">
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
  page: { 
    type: 'cover' | 'about' | 'index' | 'category-intro' | 'products' | 'contact', 
    products?: CatalogItem[], 
    category?: string,
    sections?: { name: string, products: CatalogItem[] }[]
  };
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

  if (page.type === 'about') {
    return (
      <div className="w-full h-full bg-white flex flex-col">
        {/* Header oscuro */}
        <div className="bg-industrial-900 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative">
                <Image src="/logo.png" alt="San Gabriel" fill className="object-contain brightness-0 invert" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wide">Sobre Nosotros</h3>
                <p className="text-[10px] text-white/60">San Gabriel - Soluciones Industriales</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/60">Página {pageNumber + 1}</p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <div className="w-48 h-32 mx-auto mb-6 relative">
                <Image src="/logoblack.png" alt="San Gabriel" fill className="object-contain" />
              </div>
              <div className="w-16 h-1 bg-accent-500 mx-auto mb-4" />
              <p className="text-lg text-accent-600 font-semibold">Soluciones Industriales de Calidad</p>
            </div>

            <div className="space-y-4 text-industrial-700">
              <p className="text-sm leading-relaxed">
                En <strong>San Gabriel</strong>, nos dedicamos a ofrecer productos industriales de la más alta calidad 
                para satisfacer las necesidades de nuestros clientes. Con años de experiencia en el mercado, nos hemos 
                consolidado como una empresa confiable y comprometida con la excelencia.
              </p>
              
              <p className="text-sm leading-relaxed">
                Nuestro catálogo incluye una amplia variedad de productos, desde papel higiénico de diferentes líneas 
                hasta rollos industriales y film stretch, todos diseñados para brindar el mejor desempeño y rendimiento.
              </p>

              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-accent-50 p-4 rounded-lg">
                  <h3 className="text-sm font-bold text-accent-600 mb-2">✓ Calidad Garantizada</h3>
                  <p className="text-xs text-industrial-600">Productos certificados y de primer nivel</p>
                </div>
                <div className="bg-accent-50 p-4 rounded-lg">
                  <h3 className="text-sm font-bold text-accent-600 mb-2">✓ Atención Personalizada</h3>
                  <p className="text-xs text-industrial-600">Asesoramiento profesional para cada cliente</p>
                </div>
                <div className="bg-accent-50 p-4 rounded-lg">
                  <h3 className="text-sm font-bold text-accent-600 mb-2">✓ Mejores Precios</h3>
                  <p className="text-xs text-industrial-600">Precios competitivos del mercado</p>
                </div>
                <div className="bg-accent-50 p-4 rounded-lg">
                  <h3 className="text-sm font-bold text-accent-600 mb-2">✓ Entrega Rápida</h3>
                  <p className="text-xs text-industrial-600">Logística eficiente y confiable</p>
                </div>
              </div>

              <p className="text-sm leading-relaxed">
                <strong>Nuestra misión</strong> es ser su socio estratégico en soluciones industriales, 
                brindando productos de calidad superior respaldados por un servicio excepcional.
              </p>
            </div>
          </div>
        </div>

        {/* Footer oscuro */}
        <div className="bg-industrial-900 px-6 py-3">
          <div className="flex justify-between items-center">
            <p className="text-[10px] text-white/70">📞 +54 9 2634 211816 | ✉ ventas@sangabriel.com</p>
            <p className="text-[10px] text-white/70">www.sangabriel.com</p>
          </div>
        </div>
      </div>
    );
  }

  if (page.type === 'index' && page.sections) {
    // Calcular el número de página para cada sección
    let currentPageNum = 3; // Portada (1), Sobre Nosotros (2), Índice (3)
    
    const sectionsWithPages = page.sections.map(section => {
      const startPage = currentPageNum + 1;
      const productPages = Math.ceil(section.products.length / 4);
      currentPageNum += productPages;
      const endPage = currentPageNum;
      
      return {
        ...section,
        startPage,
        endPage
      };
    });

    return (
      <div className="w-full h-full bg-white flex flex-col">
        {/* Header oscuro */}
        <div className="bg-industrial-900 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative">
                <Image src="/logo.png" alt="San Gabriel" fill className="object-contain brightness-0 invert" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wide">Índice del Catálogo</h3>
                <p className="text-[10px] text-white/60">San Gabriel - Soluciones Industriales</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/60">Página {pageNumber + 1}</p>
            </div>
          </div>
        </div>

        {/* Contenido del índice */}
        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-industrial-900 mb-2">Índice de Contenidos</h2>
              <div className="w-16 h-1 bg-accent-500 mx-auto mb-2" />
              <p className="text-sm text-industrial-600">Navegue por nuestras categorías de productos</p>
            </div>

            <div className="space-y-3">
              {sectionsWithPages.map((section, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-100 to-white border-l-4 border-gray-500 rounded-r-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-industrial-900">{section.name}</h3>
                      <p className="text-xs text-industrial-500">
                        {section.products.length} producto{section.products.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-sm text-industrial-500">Págs.</span>
                    <span className="text-base font-bold text-gray-600">
                      {section.startPage}
                      {section.endPage > section.startPage ? `-${section.endPage}` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-industrial-50 rounded-lg border border-industrial-200">
              <p className="text-xs text-industrial-600 text-center">
                <strong>Nota:</strong> Este catálogo contiene {totalPages} páginas en total con información detallada de nuestros productos.
              </p>
            </div>
          </div>
        </div>

        {/* Footer oscuro */}
        <div className="bg-industrial-900 px-6 py-3">
          <div className="flex justify-between items-center">
            <p className="text-[10px] text-white/70">📞 +54 9 2634 211816 | ✉ ventas@sangabriel.com</p>
            <p className="text-[10px] text-white/70">www.sangabriel.com</p>
          </div>
        </div>
      </div>
    );
  }

  if (page.type === 'category-intro' && page.category) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-industrial-800 to-industrial-900 flex flex-col justify-center p-12 relative overflow-hidden">
        {/* Background Pattern - Más sutil */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.05) 50%, transparent 52%)`,
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        {/* Decorative accent */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-32 bg-accent-500" />
        
        <div className="relative z-10 pl-8">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-16 h-16 relative">
              <Image 
                src="/logo.png" 
                alt="San Gabriel" 
                fill 
                className="object-contain opacity-80"
              />
            </div>
            <div>
              <p className="text-accent-400 text-sm font-semibold uppercase tracking-wider mb-1">Sección</p>
              <h2 className="text-3xl font-bold text-white">
                {page.category}
              </h2>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-6 right-6">
          <p className="text-white/30 text-xs">Página {pageNumber + 1}</p>
        </div>
      </div>
    );
  }

  if (page.type === 'products' && page.products) {
    return (
      <div className="w-full h-full bg-white flex flex-col">
        {/* Header - Oscuro */}
        <div className="bg-industrial-900 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative">
                <Image src="/logo.png" alt="San Gabriel" fill className="object-contain brightness-0 invert" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wide">
                  {page.category || 'Catálogo de Productos'}
                </h3>
                <p className="text-[10px] text-white/60">San Gabriel - Soluciones Industriales</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/60">Página {pageNumber + 1}</p>
            </div>
          </div>
        </div>
        
        {/* Products Grid - 2x2 con 4 productos */}
        <div className="flex-1 grid grid-cols-2 gap-4 p-6">
          {page.products.map((product, index) => (
            <div key={product.referencia || index} className="flex flex-col bg-white">
              {/* Product Image - Sin borde visible */}
              <div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-white rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                {product.imagen ? (
                  <Image 
                    src={product.imagen} 
                    alt={product.nombre}
                    width={220}
                    height={220}
                    className="object-contain w-full h-full p-4"
                  />
                ) : (
                  <span className="text-5xl font-bold text-gray-200">
                    {product.nombre?.charAt(0) || 'P'}
                  </span>
                )}
              </div>
              
              {/* Product Info - Siempre pegado a la imagen */}
              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-bold text-industrial-900 line-clamp-2 leading-tight">
                  {product.nombre}
                </h4>
                
                {product.referencia && (
                  <p className="text-[10px] text-industrial-500">
                    <span className="font-semibold">Ref:</span> <span className="font-mono">{product.referencia}</span>
                  </p>
                )}
                
                <p className="text-xl font-bold text-accent-500 mt-1">
                  {formatPrice(product.precio)}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer - Oscuro */}
        <div className="bg-industrial-900 px-6 py-3">
          <div className="flex justify-between items-center">
            <p className="text-[10px] text-white/70">📞 +54 9 2634 211816 | ✉ ventas@sangabriel.com</p>
            <p className="text-[10px] text-white/70">www.sangabriel.com</p>
          </div>
        </div>
      </div>
    );
  }

  if (page.type === 'contact') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-industrial-50 to-white p-8 md:p-12 flex flex-col">
        <div className="flex-1">
          <div className="w-32 h-24 mb-6 relative">
            <Image src="/logoblack.png" alt="San Gabriel" fill className="object-contain" />
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
