# Catálogo San Gabriel

Catálogo web B2B para productos industriales: papel higiénico, stretch film, tubos de cartón y empaques.

## 🏭 Características

- **Catálogo de productos** con precios dinámicos desde lista de precios activa
- **Filtros por categoría** y búsqueda por nombre/referencia
- **Modal de detalle** con opciones de contacto (WhatsApp, Email, Teléfono)
- **Diseño responsive** optimizado para móvil y desktop
- **Animaciones fluidas** con Framer Motion

## 🔧 Tecnologías

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React** (iconos)

## 📊 Lógica de Base de Datos

### Estructura de Tablas

```
producto (id, referencia, nombre, categoria, volumen, imagen, activo, fecha_creacion, costos)
lista_precio (id, nombre, activa, fecha_creacion)
lista_precio_item (id, lista_precio_id, producto_id, precio)
```

### Regla de Negocio

Los precios **NUNCA** se almacenan en la tabla de productos. El catálogo realiza un **INNER JOIN** entre:

1. `producto` (WHERE activo = true)
2. `lista_precio_item` (WHERE lista_precio.activa = true)

Solo se muestran productos que:
- Tienen `activo = true`
- Tienen un precio en la lista de precios activa

Si un producto está activo pero no tiene precio → **NO aparece**.

### Consulta SQL Equivalente

```sql
SELECT 
  p.id, p.referencia, p.nombre, p.categoria, p.volumen, p.imagen,
  lpi.precio
FROM producto p
INNER JOIN lista_precio_item lpi ON p.id = lpi.producto_id
INNER JOIN lista_precio lp ON lpi.lista_precio_id = lp.id
WHERE p.activo = true AND lp.activa = true
```

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar build de producción
npm start
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   └── catalog/
│   │       └── route.ts      # Endpoint API con lógica de JOIN
│   ├── globals.css           # Estilos globales
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Página del catálogo
├── components/
│   ├── CategoryFilter.tsx    # Filtro por categorías
│   ├── EmptyState.tsx        # Estado vacío
│   ├── Footer.tsx            # Pie de página
│   ├── Header.tsx            # Encabezado
│   ├── LoadingSpinner.tsx    # Indicador de carga
│   ├── ProductCard.tsx       # Tarjeta de producto
│   ├── ProductModal.tsx      # Modal de detalle
│   ├── SearchBar.tsx         # Barra de búsqueda
│   ├── SortSelect.tsx        # Selector de ordenamiento
│   └── index.ts              # Exportaciones
├── services/
│   └── api.ts                # Capa de servicios API
└── types/
    └── index.ts              # Definiciones TypeScript
```

## 🔌 API Endpoint

### GET /api/catalog

Retorna el catálogo de productos con precios de la lista activa.

**Respuesta:**

```json
{
  "products": [
    {
      "id": 1,
      "referencia": "PH-400",
      "nombre": "Papel Higiénico Industrial 400m",
      "categoria": "Papel",
      "precio": 1540.50,
      "volumen": 3.2,
      "imagen": "/img/ph400.png"
    }
  ],
  "categories": ["Papel", "Stretch Film", "Tubos de Cartón", "Empaques"],
  "priceListName": "Lista de Precios 2024 - Mayorista",
  "lastUpdated": "2024-01-15T10:00:00Z"
}
```

## 🎨 Personalización

### Colores

Los colores se pueden modificar en `tailwind.config.ts`:

- `industrial`: Grises industriales
- `accent`: Naranja para acentos
- `steel`: Azules grises

### Contacto

Modifique los datos de contacto en:
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/services/api.ts` (funciones `generateWhatsAppLink` y `generateEmailLink`)

## 📱 Diseño Responsive

- **Mobile First**: Diseño optimizado para móvil
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid adaptativo**: 1 columna en móvil, 2 en tablet, 3-4 en desktop

## 🔄 Integración con Backend

Para conectar con un backend real, modifique:

1. **`src/app/api/catalog/route.ts`**: Reemplace los datos mock con consultas a su base de datos
2. **Variables de entorno**: Configure `NEXT_PUBLIC_API_URL` si usa un backend externo

### Ejemplo con Base de Datos Real

```typescript
// En route.ts, reemplace getCatalogItems() con:

async function getCatalogItems() {
  const pool = await getDbPool(); // Su conexión a BD
  
  const result = await pool.query(`
    SELECT 
      p.id, p.referencia, p.nombre, p.categoria, p.volumen, p.imagen,
      lpi.precio
    FROM producto p
    INNER JOIN lista_precio_item lpi ON p.id = lpi.producto_id
    INNER JOIN lista_precio lp ON lpi.lista_precio_id = lp.id
    WHERE p.activo = true AND lp.activa = true
  `);
  
  return result.rows;
}
```

## 📄 Licencia

Privado - San Gabriel Soluciones Industriales
