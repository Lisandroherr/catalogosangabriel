# ⚡ INICIO RÁPIDO - MERCADO PAGO

## 🎯 LO QUE TIENES AHORA

Tu aplicación está lista para **abrir Mercado Pago automáticamente con el pago listo**.

El cliente solo presiona un botón y Mercado Pago se abre con todo configurado.

---

## ⚙️ CONFIGURACIÓN RÁPIDA (5 minutos)

### 1️⃣ Obtén tus Credenciales de Mercado Pago

Ve a: **https://www.mercadopago.com.ar/developers**

1. Inicia sesión
2. Crea una aplicación (tipo "Checkout Pro")
3. Copia tus credenciales TEST:
   - Public Key (empieza con `TEST-`)
   - Access Token (empieza con `TEST-`)

### 2️⃣ Configura el archivo .env.local

Abre el archivo `.env.local` y pega tus credenciales:

```bash
NEXT_PUBLIC_MP_PUBLIC_KEY=TEST-tu-public-key-aqui
MP_ACCESS_TOKEN=TEST-tu-access-token-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 3️⃣ Reinicia el Servidor

```bash
# Detén el servidor (Ctrl+C en la terminal)
# Reinícialo:
npm run dev
```

### 4️⃣ ¡Pruébalo!

1. Agrega productos al carrito
2. Ve al checkout
3. Completa el formulario
4. Click en **"Pagar con Mercado Pago"** (botón azul)
5. Se abrirá Mercado Pago con el pago listo

---

## 🧪 TARJETAS DE PRUEBA

Para probar en modo TEST, usa estas tarjetas:

**✅ APROBADA:**
```
Número: 5031 7557 3453 0604
CVV: 123
Vencimiento: 11/25
Nombre: APRO
```

**❌ RECHAZADA:**
```
Número: 5031 4332 1540 6351
CVV: 123
Vencimiento: 11/25
Nombre: OTHE
```

---

## 🚀 PARA USAR EN PRODUCCIÓN

Cuando todo funcione:

1. Obtén las credenciales de PRODUCCIÓN (empiezan con `APP_USR-`)
2. Actualiza `.env.local` con esas credenciales
3. Cambia `NEXT_PUBLIC_APP_URL` a tu dominio real
4. Reinicia el servidor
5. ¡Listo para recibir pagos reales!

---

## 💰 ¿Dónde llega el dinero?

El dinero va a tu cuenta de Mercado Pago.

Para transferirlo automáticamente a tu caja de ahorros:
1. Ve a Mercado Pago → Configuración
2. Configura "Transferencia automática"
3. Vincula tu CBU/CVU
4. El dinero se transfiere automáticamente cada día

---

## 📖 GUÍA COMPLETA

Lee el archivo **SETUP_MERCADOPAGO.md** para:
- Configuración detallada
- Solución de problemas
- Comisiones y costos
- Monitoreo de pagos
- Pasar a producción

---

## ✅ CHECKLIST

- [ ] Obtuve las credenciales de Mercado Pago
- [ ] Configuré `.env.local`
- [ ] Reinicié el servidor
- [ ] Probé un pago de prueba
- [ ] El pago se aprobó correctamente
- [ ] Fui redirigido a la página de éxito

---

## 🆘 AYUDA RÁPIDA

**Error: "Credenciales no configuradas"**
→ Verifica que `.env.local` tenga las credenciales y reinicia el servidor

**No se abre Mercado Pago**
→ Abre la consola del navegador (F12) y busca errores en rojo

**El pago no se aprueba**
→ Usa las tarjetas de prueba correctas (ver arriba)

---

## 📞 SOPORTE

- Documentación MP: https://www.mercadopago.com.ar/developers/es/docs
- Soporte MP: https://www.mercadopago.com.ar/ayuda

---

¡Listo! Ahora tu catálogo acepta pagos automáticos 🎉
