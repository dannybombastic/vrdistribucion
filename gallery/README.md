# Galería VR Distribución

## Descripción

La galería de VR Distribución es una página interactiva que muestra tres estilos distintos de presentación de proyectos:

1. **Galería Masonry** - Diseño de mosaico con producto destacado
2. **Galería Hexagonal** - Vista geométrica con disposición hexagonal
3. **Galería Polaroid** - Estilo vintage con efecto de fotos polaroid

## Características

### 🎨 Tres Estilos de Galería
- **Masonry Gallery**: Con producto héroe prominente y disposición de mosaico responsiva
- **Hexagon Gallery**: Vista geométrica única con animaciones flotantes
- **Polaroid Gallery**: Estilo nostálgico con efectos de foto vintage

### ✨ Funcionalidades Interactivas
- **Lightbox avanzado** con zoom y navegación fluida
- **Navegación por teclado**: Flechas, Escape, Home, End
- **Gestos táctiles**: Deslizar para navegar en móviles
- **Animaciones de entrada** con efectos escalonados

### ♿ Accesibilidad
- **Navegación por teclado** completa
- **Screen reader** compatible con ARIA labels
- **Focus management** adecuado
- **Contraste alto** y soporte para modo oscuro
- **Movimiento reducido** para usuarios sensibles

### 📱 Responsive Design
- **Mobile-first** approach
- **Touch targets** optimizados (44px mínimo)
- **Gestos táctiles** para navegación
- **Performance** optimizada para móviles

### 🚀 Performance
- **Lazy loading** de imágenes
- **Progressive loading** con placeholders
- **Core Web Vitals** optimizados
- **Intersection Observer** para animaciones eficientes

## Estructura de Archivos

```
/gallery/
├── index.html          # Página principal de la galería
├── gallery.css         # Estilos completos para los tres tipos
├── gallery.js          # Funcionalidad JavaScript
└── README.md           # Esta documentación
```

## Tecnologías Utilizadas

- **HTML5** semántico con roles ARIA
- **CSS3** con Grid, Flexbox y animaciones
- **JavaScript ES6+** con clases y módulos
- **Intersection Observer API** para animaciones
- **Performance Observer** para métricas
- **Service Worker** ready para PWA futuro

## SEO y Meta Tags

- **Open Graph** completo para redes sociales
- **Twitter Cards** optimizadas
- **JSON-LD** structured data para galería
- **Meta tags** específicos para galería
- **Canonical URLs** correctas

## Navegadores Compatibles

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ iOS Safari 12+
- ✅ Android Chrome 60+

## Optimizaciones Implementadas

### Performance
- Preload de CSS crítico
- Lazy loading de imágenes
- Optimización de animaciones con `will-change`
- Debounce en eventos de scroll y resize

### Accesibilidad
- Navegación completa por teclado
- Focus trap en lightbox
- Anuncios para screen readers
- Contraste y visibilidad optimizados

### Mobile
- Touch targets de 44px mínimo
- Gestos de swipe para navegación
- Optimización de imágenes para pantallas
- Viewport meta tag correcto

## Uso

### Navegación entre Galerías
```html
<!-- Los tabs cambian automáticamente el contenido -->
<button data-gallery="masonry">Proyectos Destacados</button>
<button data-gallery="hexagon">Vista Hexagonal</button>
<button data-gallery="polaroid">Estilo Polaroid</button>
```

### Lightbox
```javascript
// Abrir lightbox programáticamente
galleryManager.openLightbox(event, imageIndex);

// Navegar entre imágenes
galleryManager.navigateImage(1);  // Siguiente
galleryManager.navigateImage(-1); // Anterior

// Cerrar lightbox
galleryManager.closeLightbox();
```

### Agregar Nuevas Imágenes
```html
<img 
  src="imagen.jpg"
  alt="Descripción accesible"
  class="gl-item"
  loading="lazy"
  decoding="async"
  width="400"
  height="300"
  data-title="Título del proyecto"
  data-category="Categoría"
/>
```

## Personalización

### Colores
```css
:root {
  --primary-color: #2c3e50;
  --accent-color: #f39c12;
  --gallery-bg: #f8f9fa;
  /* Personalizar según marca */
}
```

### Animaciones
```css
/* Deshabilitar animaciones */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Métricas y Analytics

La galería incluye monitoreo de:
- Tiempo de carga de imágenes
- Core Web Vitals (LCP, CLS)
- Interacciones de usuario
- Errores de carga

## Futuras Mejoras

- [ ] **Filtros por categoría** de proyectos
- [ ] **Búsqueda** en tiempo real
- [ ] **Infinite scroll** para más proyectos
- [ ] **PWA** con cache offline
- [ ] **Share API** para compartir proyectos
- [ ] **Integración con CMS** para gestión de contenido

## Soporte

Para problemas o sugerencias sobre la galería:
- 📧 Email: vr.distribucion@gmail.com
- 📱 WhatsApp: +52 998 236 1177
- 🌐 Web: https://vrdistribucion.com

---

**VR Distribución** - 25 años creando momentos únicos en Cancún 🎨✨
