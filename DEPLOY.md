# Guía de Despliegue en Render - Catálogo San Gabriel

## 📋 Requisitos Previos
- Cuenta en [Render.com](https://render.com)
- Código subido a GitHub/GitLab/Bitbucket
- Tu ERP ya desplegado en: `https://erp-v0.onrender.com`

## 🚀 Pasos para Desplegar en Render

### 1. Preparar el Repositorio
Asegúrate de que tu código esté en un repositorio Git (GitHub, GitLab, etc.)

```bash
# Si aún no tienes Git inicializado
git init
git add .
git commit -m "Preparar para despliegue en Render"

# Crear repositorio en GitHub y subir
git remote add origin https://github.com/TU_USUARIO/catalogo-san-gabriel.git
git push -u origin main
```

### 2. Crear Web Service en Render

1. **Ir a [Render Dashboard](https://dashboard.render.com/)**
2. Click en **"New +"** → **"Web Service"**
3. Conectar tu repositorio Git

### 3. Configurar el Web Service

**Configuración Básica:**
- **Name**: `catalogo-san-gabriel` (o el nombre que prefieras)
- **Region**: Elige la más cercana a tus usuarios
- **Branch**: `main` (o la rama principal que uses)
- **Root Directory**: (dejar vacío)
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: 
  ```
  npm install && npm run build
  ```
- **Start Command**: 
  ```
  npm run start
  ```

**Configuración Avanzada:**
- **Node Version**: Automático (o específica `18.x`)
- **Auto-Deploy**: ✅ Yes (para desplegar automáticamente cuando hagas push)

### 4. Variables de Entorno

En la sección **"Environment"**, agregar esta variable:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_ERP_BASE_URL` | `https://erp-v0.onrender.com` |
| `NODE_ENV` | `production` |

**Importante:** Si tu ERP está en otra URL, usa esa URL completa.

### 5. Desplegar

1. Click en **"Create Web Service"**
2. Render comenzará a construir y desplegar tu aplicación
3. El proceso toma ~3-5 minutos la primera vez

### 6. Verificar el Despliegue

Una vez completado:
- Render te dará una URL: `https://catalogo-san-gabriel.onrender.com` (o similar)
- Abre esa URL en tu navegador
- Verifica que los productos carguen desde el ERP

## 🔧 Solución de Problemas Comunes

### Error: "Build failed"
- Revisa los logs en Render
- Asegúrate que `package.json` tenga todas las dependencias
- Verifica que `npm run build` funcione localmente

### Error: "Application failed to start"
- Verifica que el Start Command sea: `npm run start`
- Revisa que `package.json` tenga el script "start"

### Las imágenes no cargan
- Asegúrate de agregar la variable `NEXT_PUBLIC_ERP_BASE_URL`
- Verifica que el ERP esté respondiendo en esa URL
- Confirma que el endpoint `/api/productos/imagen/<filename>` exista en el ERP

### CORS errors
- El ERP debe tener CORS configurado para aceptar requests desde tu dominio de Render
- En Flask: `CORS(app, resources={r"/api/*": {"origins": "*"}})`

## 📱 Dominio Personalizado (Opcional)

1. En Render Dashboard → Settings → Custom Domain
2. Agregar tu dominio (ej: `catalogo.tusitio.com`)
3. Configurar DNS según las instrucciones de Render

## 🔄 Actualizaciones Automáticas

Con Auto-Deploy activado, cada vez que hagas:
```bash
git push origin main
```
Render automáticamente reconstruirá y redesple gará tu aplicación.

## 📊 Monitoreo

- **Logs**: Render Dashboard → Logs (para ver errores en tiempo real)
- **Metrics**: Render Dashboard → Metrics (uso de CPU/RAM)
- **Events**: Historial de deploys

## ✅ Checklist Final

- [ ] Código subido a Git
- [ ] Web Service creado en Render
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm run start`
- [ ] Variable `NEXT_PUBLIC_ERP_BASE_URL` configurada
- [ ] Deploy completado exitosamente
- [ ] Aplicación accesible en la URL de Render
- [ ] Productos cargando correctamente del ERP
- [ ] Imágenes mostrándose (si el ERP las sirve)

## 🆘 Ayuda Adicional

Si tienes problemas:
1. Revisa los logs en Render
2. Verifica que el ERP esté online: `https://erp-v0.onrender.com/api/catalogo?lista=Retail`
3. Prueba localmente: `npm run build && npm run start`

---

**¡Listo!** Tu catálogo ahora está desplegado en Render 🎉
