# VR Distribución - CSP Implementation Guide

## ✅ Content Security Policy (CSP) Implementado

### 🛡️ **Directivas de Seguridad Configuradas**

#### **1. Script Sources (`script-src`)**
- `'self'` - Scripts del mismo dominio
- `'unsafe-inline'` - Scripts inline necesarios (Google Analytics)
- `'unsafe-eval'` - Evaluación de código (para frameworks)
- `https://www.googletagmanager.com` - Google Tag Manager
- `https://www.google-analytics.com` - Google Analytics
- `https://vrdistribucion.s3-accelerate.amazonaws.com` - CDN propio
- `https://wa.me` - WhatsApp Widget
- `data:` - Data URIs para scripts

#### **2. Style Sources (`style-src`)**
- `'self'` - CSS del mismo dominio
- `'unsafe-inline'` - Estilos inline necesarios
- `https://fonts.googleapis.com` - Google Fonts CSS
- `https://vrdistribucion.s3-accelerate.amazonaws.com` - CDN propio

#### **3. Font Sources (`font-src`)**
- `'self'` - Fuentes del mismo dominio
- `https://fonts.gstatic.com` - Google Fonts files
- `https://vrdistribucion.s3-accelerate.amazonaws.com` - CDN propio
- `data:` - Data URIs para fuentes

#### **4. Image Sources (`img-src`)**
- `'self'` - Imágenes del mismo dominio
- `https://vrdistribucion.s3-accelerate.amazonaws.com` - CDN propio
- `https://www.google-analytics.com` - Analytics pixels
- `https://www.googletagmanager.com` - GTM pixels
- `data:` - Data URIs para imágenes
- `blob:` - Blob URLs

#### **5. Media Sources (`media-src`)**
- `'self'` - Videos del mismo dominio
- `https://vrdistribucion.s3-accelerate.amazonaws.com` - CDN propio
- `blob:` - Blob URLs para videos

#### **6. Connect Sources (`connect-src`)**
- `'self'` - AJAX al mismo dominio
- `https://www.google-analytics.com` - Analytics requests
- `https://www.googletagmanager.com` - GTM requests
- `https://region1.google-analytics.com` - GA4 requests
- `https://analytics.google.com` - Analytics API
- `https://vrdistribucion.s3-accelerate.amazonaws.com` - CDN API
- `https://api.whatsapp.com` - WhatsApp API
- `https://wa.me` - WhatsApp redirects
- `wss://wa.me` - WhatsApp WebSocket

#### **7. Frame Sources (`frame-src`)**
- `'self'` - Iframes del mismo dominio
- `https://www.google.com` - Google widgets
- `https://www.youtube.com` - YouTube embeds
- `https://player.vimeo.com` - Vimeo embeds

### 🔒 **Directivas de Seguridad Estrictas**

#### **1. Object Sources (`object-src`)**
- `'none'` - Bloquea todos los plugins (Flash, Java, etc.)

#### **2. Base URI (`base-uri`)**
- `'self'` - Solo permite base URIs del mismo dominio

#### **3. Form Action (`form-action`)**
- `'self'` - Formularios solo al mismo dominio
- `https://vrdistribucion.s3-accelerate.amazonaws.com` - Envío a CDN
- `https://wa.me` - Formularios de WhatsApp

#### **4. Upgrade Insecure Requests**
- `upgrade-insecure-requests` - Fuerza HTTPS

#### **5. Block Mixed Content**
- `block-all-mixed-content` - Bloquea contenido mixto HTTP/HTTPS

### 📊 **Headers de Seguridad Adicionales**

#### **1. Permissions Policy**
```
camera=(), microphone=(), geolocation=(self), payment=(), 
usb=(), accelerometer=(), gyroscope=(), magnetometer=(), 
fullscreen=(self), autoplay=(self)
```

#### **2. Strict Transport Security (HSTS)**
```
max-age=31536000; includeSubDomains; preload
```

#### **3. X-Frame-Options**
```
SAMEORIGIN
```

#### **4. X-Content-Type-Options**
```
nosniff
```

#### **5. X-XSS-Protection**
```
1; mode=block
```

#### **6. Referrer Policy**
```
strict-origin-when-cross-origin
```

### 🧪 **Validación y Testing**

#### **1. Herramientas de Validación CSP**
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Observatory by Mozilla](https://observatory.mozilla.org/)
- [Security Headers](https://securityheaders.com/)

#### **2. Browser DevTools Testing**
- Abrir DevTools → Console
- Buscar errores CSP
- Verificar que no hay violaciones

#### **3. Online CSP Validators**
- [CSP Validator](https://cspvalidator.org/)
- [Report URI CSP Validator](https://report-uri.com/home/tools)

### 🚨 **Monitoreo y Reportes**

#### **1. CSP Reporting (Opcional)**
Para habilitar reportes de violaciones CSP, agregar:
```
Content-Security-Policy-Report-Only: [misma política]; 
report-uri https://tu-dominio.com/csp-report
```

#### **2. Logs de Violaciones**
- Monitorear logs del servidor
- Configurar alertas automáticas
- Revisar reportes de navegador

### ⚠️ **Consideraciones Importantes**

#### **1. Scripts Inline**
- Se permite `'unsafe-inline'` para compatibilidad con Google Analytics
- En producción considerar usar nonces para scripts críticos

#### **2. Eval**
- Se permite `'unsafe-eval'` para frameworks JavaScript
- Considerar eliminar si no es necesario

#### **3. WhatsApp Integration**
- Se permite `wa.me` para el widget de WhatsApp
- Incluye WebSocket para chat en tiempo real

#### **4. CDN Configuration**
- Todos los recursos de S3 están permitidos
- Configurado para el dominio accelerate de AWS

### 🔄 **Mantenimiento CSP**

#### **1. Revisión Regular**
- Revisar CSP cada 3 meses
- Actualizar cuando se agreguen nuevos servicios
- Remover dominios no utilizados

#### **2. Actualizaciones**
- Cuando se agreguen nuevos CDNs
- Al cambiar servicios de analytics
- Al integrar nuevas herramientas

#### **3. Testing**
- Probar en diferentes navegadores
- Verificar funcionalidad completa
- Monitorear performance impact

### 📈 **Beneficios de Seguridad Obtenidos**

✅ **Protección contra XSS** - Cross-Site Scripting  
✅ **Protección contra Clickjacking** - X-Frame-Options  
✅ **Prevención de MIME sniffing** - X-Content-Type-Options  
✅ **Forzado de HTTPS** - HSTS + upgrade-insecure-requests  
✅ **Control de permisos** - Permissions Policy  
✅ **Protección de datos** - Referrer Policy  
✅ **Bloqueo de contenido mixto** - Mixed content protection  

### 🎯 **Score de Seguridad Esperado**

- **Mozilla Observatory**: A+ (90-100)
- **Security Headers**: A+ (90-100)
- **CSP Evaluator**: Secure (Green)

### 📝 **Próximos Pasos**

1. **Validar** la implementación con herramientas online
2. **Monitorear** logs por violaciones CSP
3. **Optimizar** removiendo directivas no necesarias
4. **Implementar** CSP reporting en producción
5. **Considerar** migrar de `unsafe-inline` a nonces
