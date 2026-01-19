# 🚀 CONFIGURACIÓN DE MERCADO PAGO - GUÍA COMPLETA

## ✅ LO QUE ACABAS DE OBTENER

Ahora tu aplicación puede **abrir Mercado Pago automáticamente con el pago listo** para que el cliente pague con:
- 💳 Tarjeta de crédito/débito
- 💵 Dinero en cuenta de Mercado Pago
- 🏪 Efectivo (Rapipago, Pago Fácil, etc.)
- 🏦 Transferencia bancaria

El dinero **va directo a tu caja de ahorros** asociada a tu cuenta de Mercado Pago.

---

## 📋 PASOS PARA CONFIGURAR (OBLIGATORIO)

### PASO 1: Crear Cuenta en Mercado Pago Developers

1. Ve a: https://www.mercadopago.com.ar/developers
2. Inicia sesión con tu cuenta de Mercado Pago (la misma donde quieres recibir el dinero)
3. Si no tienes cuenta, créala en: https://www.mercadopago.com.ar

### PASO 2: Crear una Aplicación

1. En el panel de desarrolladores, ve a "Tus aplicaciones"
2. Click en "Crear aplicación"
3. Completa:
   - **Nombre**: San Gabriel Catálogo (o el que prefieras)
   - **Tipo**: Pagos en línea
   - **Modelo de integración**: Checkout Pro
4. Click en "Crear aplicación"

### PASO 3: Obtener tus Credenciales

Verás dos tipos de credenciales:

#### A) CREDENCIALES DE PRUEBA (para testing)
- **Public Key**: TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
- **Access Token**: TEST-xxxxxxxxxxxx...

#### B) CREDENCIALES DE PRODUCCIÓN (para usar en vivo)
- **Public Key**: APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
- **Access Token**: APP_USR-xxxxxxxxxxxx...

### PASO 4: Configurar el archivo .env.local

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza las credenciales:

```bash
# Para PRUEBAS (primero usa estas):
NEXT_PUBLIC_MP_PUBLIC_KEY=TEST-tu-public-key-aqui
MP_ACCESS_TOKEN=TEST-tu-access-token-aqui

# URL de tu app (cámbiala cuando subas a producción)
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

3. **IMPORTANTE**: Cuando vayas a producción, cambia a las credenciales reales:

```bash
# Para PRODUCCIÓN (cuando todo funcione):
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-tu-public-key-real
MP_ACCESS_TOKEN=APP_USR-tu-access-token-real
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

### PASO 5: Reiniciar el Servidor

Después de configurar .env.local:

```bash
# Detén el servidor (Ctrl+C)
# Reinícialo:
npm run dev
```

---

## 🧪 PROBAR LA INTEGRACIÓN

### Modo Prueba (Testing)

1. Usa las credenciales TEST
2. Completa el checkout
3. Click en "Pagar con Mercado Pago"
4. Te abrirá Mercado Pago en modo sandbox
5. Usa estas tarjetas de prueba:

**Tarjetas de Prueba para Argentina:**

✅ **APROBADA:**
- Número: 5031 7557 3453 0604
- CVV: 123
- Vencimiento: 11/25
- Nombre: APRO
- DNI: 12345678

❌ **RECHAZADA (fondos insuficientes):**
- Número: 5031 4332 1540 6351
- CVV: 123
- Vencimiento: 11/25
- Nombre: OTHE
- DNI: 12345678

⏳ **PENDIENTE:**
- Número: 5031 7557 3453 0604
- CVV: 123
- Vencimiento: 11/25
- Nombre: CONT
- DNI: 12345678

### Modo Producción

1. Cambia a credenciales APP_USR
2. Los pagos serán **REALES**
3. El dinero irá a tu cuenta de Mercado Pago
4. Puedes transferirlo a tu caja de ahorros

---

## 💰 CONFIGURAR TRANSFERENCIA AUTOMÁTICA A TU CUENTA

1. En Mercado Pago, ve a "Configuración" → "Tus negocios"
2. Selecciona tu aplicación
3. Configura "Transferencia automática"
4. Vincula tu CBU/CVU de la caja de ahorros
5. El dinero se transferirá automáticamente cada día

---

## 🔄 CÓMO FUNCIONA AHORA

1. Cliente completa el checkout
2. Click en **"Pagar con Mercado Pago"** (botón azul)
3. Se crea un "Link de Pago" único
4. Se abre Mercado Pago automáticamente
5. Cliente paga con el método que prefiera
6. Mercado Pago redirige a:
   - ✅ `/payment/success` si el pago fue aprobado
   - ❌ `/payment/failure` si fue rechazado
   - ⏳ `/payment/pending` si está pendiente
7. El dinero llega a tu cuenta de Mercado Pago
8. Se transfiere automáticamente a tu caja de ahorros

---

## 📱 MÉTODOS DE PAGO DISPONIBLES

El cliente puede elegir:

- **💳 Tarjetas**: Débito, Crédito, Prepagas
- **🏦 Mercado Pago**: Dinero en cuenta
- **💵 Efectivo**: Rapipago, Pago Fácil, etc.
- **🏪 Otros**: Depende de la configuración

---

## 🔐 SEGURIDAD

✅ **TODO el proceso es seguro:**
- Los datos de tarjeta NUNCA pasan por tu servidor
- Mercado Pago maneja toda la seguridad
- Certificación PCI-DSS
- Cumple con todas las normativas

---

## 💸 COMISIONES

Mercado Pago cobra una comisión por transacción:

- **Tarjetas de crédito**: ~4-6% + IVA
- **Tarjetas de débito**: ~2-3% + IVA
- **Dinero en cuenta MP**: ~3-4% + IVA
- **Efectivo**: Varía según el punto de pago

**Verifica las comisiones actuales en:**
https://www.mercadopago.com.ar/costs-section/

---

## 🎯 VENTAJAS DE ESTA INTEGRACIÓN

1. ✅ **Pago instantáneo** - El cliente paga y tú cobras al instante
2. ✅ **Múltiples métodos** - Tarjeta, efectivo, transferencia, etc.
3. ✅ **Seguro** - Mercado Pago maneja toda la seguridad
4. ✅ **Automático** - No necesitas confirmar pagos manualmente
5. ✅ **Profesional** - Experiencia de pago de clase mundial
6. ✅ **Sin sorpresas** - El cliente ve el total antes de pagar

---

## 🛠️ SOLUCIÓN DE PROBLEMAS

### Error: "Credenciales no configuradas"
- Verifica que el archivo `.env.local` existe
- Verifica que tiene las credenciales correctas
- Reinicia el servidor (`Ctrl+C` y `npm run dev`)

### Error: "Error al crear el pago"
- Verifica que el Access Token sea correcto
- Verifica que sea el token del entorno correcto (TEST o APP_USR)
- Revisa la consola del navegador y del servidor para más detalles

### No redirige a Mercado Pago
- Abre la consola del navegador (F12)
- Verifica si hay errores en la pestaña Network
- Verifica que la URL del NEXT_PUBLIC_APP_URL sea correcta

### El pago se aprueba pero no veo el dinero
- En modo TEST, el dinero NO es real
- En modo producción, revisa tu cuenta de Mercado Pago
- El dinero puede tardar minutos en aparecer
- Verifica la sección "Actividad" en Mercado Pago

---

## 📊 MONITOREAR PAGOS

Para ver los pagos en tiempo real:

1. Ve a: https://www.mercadopago.com.ar
2. Click en "Actividad"
3. Verás todos los pagos recibidos
4. Puedes filtrar por estado, fecha, etc.

---

## 🚀 PASAR A PRODUCCIÓN

Cuando todo funcione en modo prueba:

1. Obtén las credenciales de PRODUCCIÓN
2. Actualiza `.env.local` con las credenciales APP_USR
3. Actualiza NEXT_PUBLIC_APP_URL con tu dominio real
4. Reinicia el servidor
5. Prueba con un pago real pequeño
6. ¡Ya estás listo!

---

## 📞 SOPORTE

Si tienes problemas:

1. **Documentación de Mercado Pago:**
   https://www.mercadopago.com.ar/developers/es/docs

2. **Soporte de Mercado Pago:**
   https://www.mercadopago.com.ar/ayuda

3. **Revisa la consola del navegador (F12)**
   - Pestaña Console: errores de JavaScript
   - Pestaña Network: errores de API

---

## ✅ CHECKLIST FINAL

Antes de poner en producción, verifica:

- [ ] Credenciales de producción configuradas
- [ ] NEXT_PUBLIC_APP_URL apunta a tu dominio real
- [ ] Probado el flujo completo en modo test
- [ ] Probado con diferentes métodos de pago
- [ ] Configurada la transferencia automática a tu cuenta
- [ ] Probado con un pago real pequeño
- [ ] Verificado que el dinero llegue a tu cuenta

---

## 🎉 ¡LISTO!

Tu catálogo ahora acepta pagos automáticos con Mercado Pago.

**Configuración estimada**: 10-15 minutos
**Beneficio**: Pagos automáticos, seguros y profesionales

¡Buenas ventas! 🚀
