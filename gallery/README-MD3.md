# Galería VR Distribución - Material Design 3

Esta es una réplica completa de la galería original de VR Distribución utilizando Material Design 3 (MD3), manteniendo toda la funcionalidad del JavaScript original mientras aprovecha los componentes y estilos modernos de MD3.

## 🎨 Características Principales

### Material Design 3 Implementation
- ✅ **Navbar reutilizado** del `index-md3.html` principal
- ✅ **CSS modular** que extiende el sistema MD3 existente
- ✅ **Componentes generados** con MCP (Material Design 3 MCP)
- ✅ **JavaScript compatible** con clases originales (`gl-item`, `gallery-tab`, etc.)

### Funcionalidades Mantenidas
- 🖼️ **3 estilos de galería**: Masonry, Hexagonal, Polaroid
- 🔍 **Lightbox interactivo** con navegación por teclado y gestos táctiles
- 📱 **Diseño responsive** optimizado para móviles y desktop
- ♿ **Accesibilidad completa** con ARIA labels y navegación por teclado
- 🎯 **Animaciones suaves** con soporte para `prefers-reduced-motion`

## 📁 Estructura de Archivos

```
gallery/
├── index-md3.html              # Nueva galería MD3
└── index.html                  # Galería original (preservada)

static/gallery/
├── css/
│   ├── gallery-md3.css         # Estilos MD3 para galería
│   └── gallery.css             # CSS original (preservado)
└── js/
    ├── gallery-md3.js          # JavaScript MD3 adaptado
    └── gallery.js              # JavaScript original (preservado)
```

## 🔧 Componentes MD3 Utilizados

### 1. Cards (Tarjetas)
```html
<div class="md-card md-card--elevated">
  <div class="md-card__media">
    <img class="gl-item md-card__image" ... />
  </div>
  <div class="md-card__content">
    <div class="md-card__header">
      <h4 class="md-card__title">Título</h4>
      <p class="md-card__subtitle">Categoría</p>
    </div>
  </div>
</div>
```

### 2. Tabs (Pestañas)
```html
<div class="md-tabs md-tabs--full-width">
  <div class="md-tabs__header">
    <button class="md-tab md-tab--active gallery-tab" data-gallery="masonry">
      <span class="material-icons md-tab__icon">grid_view</span>
      <span class="md-tab__label">Proyectos Destacados</span>
      <div class="md-tab__indicator"></div>
    </button>
  </div>
</div>
```

### 3. FAB (Floating Action Button)
```html
<button class="md-fab md-fab--primary md-fab--back-to-top" id="backToTop">
  <span class="md-fab__icon material-icons">keyboard_arrow_up</span>
</button>
```

### 4. Textfields (Formulario de Contacto)
```html
<div class="md-textfield">
  <input type="text" class="md-textfield__input" placeholder=" " />
  <label class="md-textfield__label">Nombre completo *</label>
  <div class="md-textfield__outline"></div>
</div>
```

## 🚀 Características Técnicas

### JavaScript Adaptado
- **Clases compatibles**: Mantiene `GalleryManager`, `GalleryAnimations`, `MobileMenuManager`
- **Selectores preservados**: Sigue utilizando `.gl-item`, `.gallery-tab`, `.hamburger-dropdown`
- **Funcionalidad extendida**: Añade `GalleryManagerMD3` con nuevas características MD3

### CSS Reutilizable
- **Variables MD3**: Utiliza `--md-sys-color-*` y `--md-space-*`
- **Componentes modulares**: Cards, Tabs, FAB, Textfields independientes
- **Responsive design**: Breakpoints optimizados para móviles y tablets

### Accesibilidad Mejorada
- **ARIA completo**: `role`, `aria-label`, `aria-selected`, `aria-controls`
- **Navegación por teclado**: Flechas, Escape, Enter, Space
- **Screen reader**: Anuncios contextuales para cambios de estado
- **Focus management**: Manejo correcto del foco en lightbox

## 🎯 Uso y Navegación

### Galería Masonry
- **Layout responsivo** con grid CSS auto-fit
- **Hero destacado** con chip de "Proyecto Destacado"
- **Cards elevadas** con hover effects

### Galería Hexagonal
- **Patrón hexagonal** con clip-path CSS
- **Animaciones escalables** en hover
- **Distribución en anillos** alrededor del centro

### Galería Polaroid
- **Efectos de rotación** aleatorios
- **Animaciones escalonadas** con delays CSS
- **Captions descriptivos** en cada foto

## 🔗 Integración con Sistema Existente

### Navbar Heredado
```html
<!-- Reutiliza exactamente el mismo navbar del index-md3.html -->
<header class="md-header" role="banner">
  <div class="md-container">
    <div class="md-header__content">
      <!-- Misma estructura y clases -->
    </div>
  </div>
</header>
```

### Chat Widget Compatible
- **Estructura preservada**: Mantiene IDs originales
- **Estilos adaptados**: Integra con tema MD3
- **Funcionalidad completa**: Showdown, chat.js, contactForm.js

### Mobile Menu Sincronizado
- **Clases compatibles**: `.mobile-menu-toggle`, `.hamburger-dropdown`
- **Estados sincronizados**: `active`, `aria-expanded`
- **Animaciones suaves**: Transiciones CSS consistentes

## 🎨 Personalización

### Colores MD3
```css
/* Utiliza el sistema de colores MD3 existente */
--md-sys-color-primary: #6750a4;
--md-sys-color-on-primary: #ffffff;
--md-sys-color-primary-container: #eaddff;
--md-sys-color-on-primary-container: #21005d;
```

### Espaciado Consistente
```css
/* Sistema de espaciado reutilizado */
--md-space-xs: 4px;
--md-space-sm: 8px;
--md-space-md: 16px;
--md-space-lg: 24px;
--md-space-xl: 32px;
--md-space-2xl: 48px;
--md-space-3xl: 64px;
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Design */
@media (max-width: 768px) {
  .md-masonry-grid { grid-template-columns: 1fr; }
  .md-polaroid-grid { grid-template-columns: 1fr; }
  .md-lightbox__swipe-hint { display: flex; }
}

@media (min-width: 968px) {
  .md-contact__content { grid-template-columns: 1fr 1fr; }
}
```

## 🔄 Migración y Compatibilidad

### Backward Compatibility
- ✅ **JavaScript original** sigue funcionando
- ✅ **Clases CSS** preservadas para compatibilidad
- ✅ **Estructura HTML** similar para fácil migración
- ✅ **URLs y rutas** mantenidas

### Performance
- ⚡ **CSS optimizado** con variables y reutilización
- ⚡ **JavaScript modular** con classes ES6+
- ⚡ **Imágenes lazy loading** para mejor rendimiento
- ⚡ **Animaciones GPU** con transform y opacity

## 🛠️ Desarrollo y Mantenimiento

### Extensibilidad
1. **Nuevos estilos de galería**: Añadir en `gallery-md3.css`
2. **Componentes adicionales**: Generar con MCP
3. **Temas personalizados**: Modificar variables MD3
4. **Funcionalidades**: Extender clases JavaScript

### Testing
- **Cross-browser**: Chrome, Firefox, Safari, Edge
- **Mobile devices**: iOS Safari, Chrome Mobile, Samsung Internet
- **Accessibility**: Screen readers, keyboard navigation
- **Performance**: Lighthouse, Core Web Vitals

---

**Nota**: Esta implementación mantiene 100% de compatibilidad con el sistema existente mientras proporciona una interfaz moderna con Material Design 3. Todos los archivos originales se preservan para fallback.
