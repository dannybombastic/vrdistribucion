# Configuración del Proyecto VR Distribución

## Estructura del Proyecto

```
vrdistribucion/
├── index.html              # Página principal
├── gallery/                # Nueva galería implementada
│   ├── index.html
│   ├── gallery.css
│   ├── gallery.js
│   └── README.md
├── static/                 # Recursos estáticos
│   ├── home/              # Recursos de la página principal
│   ├── aparador/          # Recursos del aparador
│   └── cotizaciones/      # Recursos de cotizaciones
├── server/                # Servidor Python
│   ├── app.py
│   ├── requirements.txt
│   └── start_server.sh
└── php/                   # Scripts PHP
    └── contact.php
```

## Configuración del Servidor

### Servidor Python (Desarrollo)
```bash
cd server
python3 app.py
# Servidor en http://localhost:8080
```

### Servidor de Producción
- Apache/Nginx con PHP habilitado
- Python 3.x para funcionalidades especiales
- SSL/TLS configurado

## Variables de Entorno Recomendadas

```bash
# .env (crear en la raíz del proyecto)
CONTACT_EMAIL="vr.distribucion@gmail.com"
WHATSAPP_NUMBER="+5299823661177"
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
RECAPTCHA_SITE_KEY="tu_site_key"
RECAPTCHA_SECRET_KEY="tu_secret_key"
```

## SEO y Meta Tags

### Meta Tags Globales
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="VR Distribución - 25 años creando momentos únicos en Cancún">
<meta name="keywords" content="eventos, decoración, Cancún, fiestas, corporativo">
<meta name="author" content="VR Distribución">
<link rel="canonical" href="https://vrdistribucion.com/">
```

### Open Graph
```html
<meta property="og:title" content="VR Distribución - Eventos únicos en Cancún">
<meta property="og:description" content="25 años de experiencia creando momentos únicos">
<meta property="og:image" content="https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/home/img/vr_logo-removebg-preview.png">
<meta property="og:url" content="https://vrdistribucion.com/">
<meta property="og:type" content="website">
```

## Optimizaciones de Performance

### Imágenes
- **WebP** preferido con fallback a JPEG
- **Lazy loading** implementado
- **Responsive images** con srcset
- **Compresión** optimizada (80% calidad)

### CSS
- **Critical CSS** inlineado
- **Non-critical CSS** cargado asíncronamente
- **CSS Grid** y **Flexbox** para layouts
- **Custom Properties** para temas

### JavaScript
- **ES6+ modules** cuando sea posible
- **Event delegation** para mejor performance
- **Intersection Observer** para animaciones
- **Debounce/Throttle** en eventos

## Accesibilidad (WCAG 2.1 AA)

### Navegación por Teclado
```javascript
// Implementado en gallery.js
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowLeft': navigateImage(-1); break;
    case 'ArrowRight': navigateImage(1); break;
    case 'Escape': closeLightbox(); break;
  }
});
```

### Screen Readers
```html
<!-- ARIA labels implementados -->
<button aria-label="Cerrar galería" aria-describedby="lightbox-help">×</button>
<div id="lightbox-help" class="sr-only">
  Usa las flechas para navegar, Escape para cerrar
</div>
```

### Contraste y Colores
```css
:root {
  --text-primary: #2c3e50;     /* 4.5:1 ratio mínimo */
  --text-secondary: #34495e;   /* 3:1 ratio mínimo */
  --bg-primary: #ffffff;
  --accent: #f39c12;
}
```

## Responsive Breakpoints

```css
/* Mobile First Approach */
:root {
  --mobile: 320px;
  --tablet: 768px;
  --desktop: 1024px;
  --large: 1440px;
}

@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large screens */ }
```

## Integración de Terceros

### Google Analytics
```javascript
// gtag implementado en todas las páginas
gtag('config', 'G-XXXXXXXXXX', {
  page_title: 'Galería - VR Distribución',
  page_location: window.location.href
});
```

### WhatsApp Integration
```javascript
const whatsappNumber = '+5299823661177';
const message = encodeURIComponent('Hola, me interesa conocer más sobre sus servicios');
const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
```

### Chat Widget
```html
<!-- Widget implementado en todas las páginas -->
<div id="chat-widget" class="chat-widget">
  <!-- Configuración del chat -->
</div>
```

## Testing y QA

### Lighthouse Audit
- **Performance**: 90+ score
- **Accessibility**: 100 score
- **Best Practices**: 100 score
- **SEO**: 100 score

### Cross-Browser Testing
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers

### Accessibility Testing
- **Screen readers**: NVDA, JAWS, VoiceOver
- **Keyboard navigation** completa
- **Color contrast** verificado
- **Focus management** optimizado

## Deployment

### Pre-deployment Checklist
- [ ] **Minificar** CSS y JavaScript
- [ ] **Optimizar** imágenes (WebP + fallbacks)
- [ ] **Configurar** headers de cache
- [ ] **Verificar** SSL/TLS
- [ ] **Configurar** redirects 301 si es necesario
- [ ] **Sitemap.xml** actualizado
- [ ] **robots.txt** configurado

### Comandos de Build
```bash
# Optimizar imágenes
./resizeImage.sh

# Minificar CSS (si se usa build tool)
npm run build:css

# Verificar links rotos
# (herramienta externa recomendada)
```

## Monitoreo y Analytics

### Core Web Vitals
```javascript
// Implementado en gallery.js
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      // console.log('LCP:', entry.startTime);
    }
  }
}).observe({entryTypes: ['largest-contentful-paint']});
```

### Error Tracking
```javascript
window.addEventListener('error', (e) => {
  // Log errors para debugging
  console.error('Error:', e.error);
});
```

## Contacto y Soporte

- **Email**: vr.distribucion@gmail.com
- **WhatsApp**: +52 998 236 1177
- **Sitio Web**: https://vrdistribucion.com
- **Ubicación**: Cancún, Quintana Roo, México

---

**Última actualización**: $(date)
**Versión**: 1.0.0
