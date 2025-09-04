#!/bin/bash

# Test de Performance para VR Distribución
# Verifica las optimizaciones implementadas para resolver recursos bloqueantes

echo "🚀 Iniciando test de performance para VR Distribución..."
echo "======================================================"

# Función para verificar recursos críticos inline
check_inline_css() {
    echo "📦 Verificando CSS crítico inline..."
    
    if grep -q "Critical CSS.*Above-the-fold optimized for LCP" index.html; then
        echo "✅ CSS crítico inline detectado en index.html"
        inline_size=$(grep -A 50 "Critical CSS" index.html | wc -c)
        echo "   Tamaño CSS inline: ${inline_size} caracteres"
    else
        echo "❌ CSS crítico inline NO encontrado en index.html"
    fi
    
    if grep -q "Critical CSS.*Gallery Optimized for LCP" gallery/index.html; then
        echo "✅ CSS crítico inline detectado en gallery/index.html"
        gallery_inline_size=$(grep -A 50 "Critical CSS" gallery/index.html | wc -c)
        echo "   Tamaño CSS inline galería: ${gallery_inline_size} caracteres"
    else
        echo "❌ CSS crítico inline NO encontrado en gallery/index.html"
    fi
}

# Función para verificar carga asíncrona de fuentes
check_async_fonts() {
    echo ""
    echo "🔤 Verificando carga asíncrona de fuentes..."
    
    if grep -q "Load Google Fonts Asynchronously" index.html; then
        echo "✅ Fuentes Google cargando de forma asíncrona en index.html"
    else
        echo "❌ Fuentes Google NO están cargando asíncronamente en index.html"
    fi
    
    if grep -q "Load Material Icons Asynchronously" index.html; then
        echo "✅ Material Icons cargando de forma asíncrona en index.html"
    else
        echo "❌ Material Icons NO están cargando asíncronamente en index.html"
    fi
    
    if grep -q "Load Google Fonts Asynchronously" gallery/index.html; then
        echo "✅ Fuentes Google cargando de forma asíncrona en gallery/index.html"
    else
        echo "❌ Fuentes Google NO están cargando asíncronamente en gallery/index.html"
    fi
}

# Función para verificar preload de fuentes críticas
check_font_preload() {
    echo ""
    echo "⚡ Verificando preload de fuentes críticas..."
    
    if grep -q "preload.*roboto.*woff2" index.html; then
        echo "✅ Preload de fuentes críticas configurado en index.html"
        preload_count=$(grep -c "preload.*font" index.html)
        echo "   Fuentes preload: ${preload_count}"
    else
        echo "❌ Preload de fuentes críticas NO configurado en index.html"
    fi
    
    if grep -q "preload.*roboto.*woff2" gallery/index.html; then
        echo "✅ Preload de fuentes críticas configurado en gallery/index.html"
        gallery_preload_count=$(grep -c "preload.*font" gallery/index.html)
        echo "   Fuentes preload galería: ${gallery_preload_count}"
    else
        echo "❌ Preload de fuentes críticas NO configurado en gallery/index.html"
    fi
}

# Función para verificar carga asíncrona de CSS
check_async_css() {
    echo ""
    echo "🎨 Verificando carga asíncrona de CSS..."
    
    if grep -q "Load Non-Critical CSS Asynchronously" index.html; then
        echo "✅ CSS no crítico cargando de forma asíncrona en index.html"
        css_async_count=$(grep -c "loadCSS.*amazonaws" index.html)
        echo "   Archivos CSS asíncronos: ${css_async_count}"
    else
        echo "❌ CSS no crítico NO está cargando asíncronamente en index.html"
    fi
    
    if grep -q "Load Non-Critical CSS Asynchronously" gallery/index.html; then
        echo "✅ CSS no crítico cargando de forma asíncrona en gallery/index.html"
        gallery_css_async_count=$(grep -c "loadCSS.*amazonaws" gallery/index.html)
        echo "   Archivos CSS asíncronos galería: ${gallery_css_async_count}"
    else
        echo "❌ CSS no crítico NO está cargando asíncronamente en gallery/index.html"
    fi
}

# Función para verificar Resource Hints
check_resource_hints() {
    echo ""
    echo "🔗 Verificando Resource Hints..."
    
    if grep -q "preconnect.*fonts.googleapis.com" index.html; then
        echo "✅ Preconnect a Google Fonts configurado en index.html"
    else
        echo "❌ Preconnect a Google Fonts NO configurado en index.html"
    fi
    
    if grep -q "preconnect.*amazonaws.com" index.html; then
        echo "✅ Preconnect a AWS S3 configurado en index.html"
    else
        echo "❌ Preconnect a AWS S3 NO configurado en index.html"
    fi
    
    preconnect_count=$(grep -c "preconnect" index.html)
    echo "   Total preconnects: ${preconnect_count}"
}

# Función para verificar Service Worker optimizado
check_service_worker() {
    echo ""
    echo "⚙️ Verificando Service Worker optimizado..."
    
    if grep -q "Service Worker.*v3.0.*Performance Optimizations" service-worker.js; then
        echo "✅ Service Worker v3.0 con optimizaciones de performance"
    else
        echo "❌ Service Worker NO está optimizado para v3.0"
    fi
    
    if grep -q "fontCacheStrategy" service-worker.js; then
        echo "✅ Estrategia de cache para fuentes implementada"
    else
        echo "❌ Estrategia de cache para fuentes NO implementada"
    fi
    
    if grep -q "aggressiveCacheStrategy" service-worker.js; then
        echo "✅ Estrategia de cache agresivo implementada"
    else
        echo "❌ Estrategia de cache agresivo NO implementada"
    fi
}

# Función para verificar fallbacks
check_fallbacks() {
    echo ""
    echo "🔄 Verificando fallbacks para navegadores sin JavaScript..."
    
    if grep -q "<noscript>" index.html; then
        echo "✅ Fallbacks noscript configurados en index.html"
        noscript_links=$(grep -A 10 "<noscript>" index.html | grep -c "stylesheet")
        echo "   Enlaces CSS en noscript: ${noscript_links}"
    else
        echo "❌ Fallbacks noscript NO configurados en index.html"
    fi
    
    if grep -q "<noscript>" gallery/index.html; then
        echo "✅ Fallbacks noscript configurados en gallery/index.html"
        gallery_noscript_links=$(grep -A 10 "<noscript>" gallery/index.html | grep -c "stylesheet")
        echo "   Enlaces CSS en noscript galería: ${gallery_noscript_links}"
    else
        echo "❌ Fallbacks noscript NO configurados en gallery/index.html"
    fi
}

# Función para verificar filtros mobile optimizados
check_mobile_filters() {
    echo ""
    echo "📱 Verificando optimizaciones mobile para filtros de galería..."
    
    if grep -q "grid-template-columns: 1fr 1fr" gallery/index.html || 
       grep -q "grid-template-columns: 1fr 1fr" static/gallery/css/enhanced-gallery-visual.css 2>/dev/null; then
        echo "✅ Filtros de galería optimizados para mobile (2 columnas)"
    else
        echo "❌ Filtros de galería NO optimizados para mobile"
    fi
}

# Función para generar reporte de tamaños
generate_size_report() {
    echo ""
    echo "📊 Reporte de Tamaños de Archivos:"
    echo "=================================="
    
    if [ -f "index.html" ]; then
        index_size=$(wc -c < index.html)
        echo "📄 index.html: ${index_size} bytes"
    fi
    
    if [ -f "gallery/index.html" ]; then
        gallery_size=$(wc -c < gallery/index.html)
        echo "📄 gallery/index.html: ${gallery_size} bytes"
    fi
    
    if [ -f "service-worker.js" ]; then
        sw_size=$(wc -c < service-worker.js)
        echo "📄 service-worker.js: ${sw_size} bytes"
    fi
}

# Función para verificar optimizaciones de performance
check_performance_optimizations() {
    echo ""
    echo "🏎️ Verificando optimizaciones específicas de performance..."
    
    # Verificar will-change properties
    if grep -q "will-change" index.html; then
        echo "✅ Propiedades will-change para optimización GPU"
    else
        echo "❌ Propiedades will-change NO configuradas"
    fi
    
    # Verificar font-display
    if grep -q "display=swap" index.html; then
        echo "✅ font-display: swap configurado"
    else
        echo "❌ font-display: swap NO configurado"
    fi
    
    # Verificar resource hints críticos
    if grep -q "dns-prefetch" index.html; then
        echo "✅ DNS prefetch configurado"
    else
        echo "❌ DNS prefetch NO configurado"
    fi
}

# Ejecutar todas las verificaciones
main() {
    check_inline_css
    check_async_fonts
    check_font_preload
    check_async_css
    check_resource_hints
    check_service_worker
    check_fallbacks
    check_mobile_filters
    check_performance_optimizations
    generate_size_report
    
    echo ""
    echo "======================================================"
    echo "🎯 Test de performance completado"
    echo ""
    echo "📈 Beneficios esperados:"
    echo "   • Eliminación de recursos bloqueantes CSS"
    echo "   • Eliminación de recursos bloqueantes de fuentes"
    echo "   • Reducción del LCP (Largest Contentful Paint)"
    echo "   • Mejora en Core Web Vitals"
    echo "   • Cache agresivo de recursos estáticos"
    echo "   • Filtros de galería optimizados para mobile"
    echo ""
    echo "🔍 Para mejores resultados:"
    echo "   • Ejecuta Lighthouse para verificar métricas"
    echo "   • Prueba en PageSpeed Insights"
    echo "   • Verifica Core Web Vitals en producción"
    echo ""
}

# Ejecutar el script
main
