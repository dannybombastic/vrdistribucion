// Service Worker para cache de recursos de VR Distribución
// Optimizado para eliminar recursos bloqueantes y mejorar LCP
// Versión 3.0 - Performance Optimizations

const CACHE_NAME = 'vr-distribucion-v3.0-performance';
const CACHE_EXPIRY_TIME = 365 * 24 * 60 * 60 * 1000; // 1 año para recursos estáticos
const VIDEO_CACHE_EXPIRY_TIME = 180 * 24 * 60 * 60 * 1000; // 6 meses para videos
const FONT_CACHE_EXPIRY_TIME = 365 * 24 * 60 * 60 * 1000; // 1 año para fuentes

// Resources críticos para caché agresivo
const CRITICAL_RESOURCES = [
  // Critical CSS files - Now loaded asynchronously
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/home/css/material-design-3-theme.css',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/home/css/material-design-3-components.css',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/home/css/material-design-3-enhancements.css',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/home/css/material-design-3-landing.css',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/home/css/chat-widget.css',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/home/css/combined-styles.css',
  
  // JavaScript resources
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/vendor/showdown.min.js',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/home/js/chat.js',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/landing/js/contactForm.js',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/home/js/material-design-3-landing.js',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/home/js/utilities.js',
  
  // Cookie consent resources
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/cookie-consent/cookie-consent.css',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/cookie-consent/cookie-consent.js',
];

// Fuentes críticas que se precargan
const FONT_RESOURCES = [
  'https://fonts.gstatic.com/s/roboto/v32/KFOmCnqEu92Fr1Mu4mxK.woff2',
  'https://fonts.gstatic.com/s/robotoflex/v9/NaNnepOXO_NexZs0b5QrzlOHb8wCikXpYqmZsWI-__OGfttPZktqc2VdZ80KvCLZaPcSBZtOx2MdKjFrREmMKNeE.woff2',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Roboto+Flex:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/icon?family=Material+Icons&display=swap'
];

// Videos que se cachean con estrategia diferente
const VIDEO_RESOURCES = [
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/invitaciones.mp4',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/cntro_de_mesa.mp4',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/velas_decorativas.mp4',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/invitaciones_white.mp4',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/rotulos_iluminados.mp4',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/velas_con_cruz_cristiana.mp4'
];

// Instalación del Service Worker - Optimizada para performance
self.addEventListener('install', event => {
  console.log('🚀 Service Worker v3.0: Instalando con optimizaciones de performance...');
  
  event.waitUntil(
    Promise.all([
      // Cache crítico de CSS/JS
      caches.open(CACHE_NAME).then(cache => {
        console.log('📦 Service Worker: Cacheando recursos críticos CSS/JS...');
        return Promise.allSettled(
          CRITICAL_RESOURCES.map(async (resource) => {
            try {
              const response = await fetch(resource, { 
                mode: 'cors',
                cache: 'force-cache' // Usar cache agresivo
              });
              if (response.ok) {
                await cache.put(resource, response);
                console.log(`✅ Cacheado: ${resource.split('/').pop()}`);
              }
            } catch (error) {
              console.warn(`⚠️ No se pudo cachear: ${resource} - ${error.message}`);
            }
          })
        );
      }),
      
      // Cache de fuentes con estrategia separada
      caches.open(CACHE_NAME + '-fonts').then(cache => {
        console.log('🔤 Service Worker: Cacheando fuentes...');
        return Promise.allSettled(
          FONT_RESOURCES.map(async (font) => {
            try {
              const response = await fetch(font, { 
                mode: 'cors',
                cache: 'force-cache'
              });
              if (response.ok) {
                await cache.put(font, response);
                console.log(`✅ Fuente cacheada: ${font.split('/').pop()}`);
              }
            } catch (error) {
              console.warn(`⚠️ No se pudo cachear fuente: ${font} - ${error.message}`);
            }
          })
        );
      })
    ]).then(() => {
      console.log('🎯 Service Worker: Instalación completada - Performance optimizada');
      return self.skipWaiting();
    })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('⚡ Service Worker v3.0: Activando...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              !cacheName.startsWith('vr-distribucion-v3.0') && 
              cacheName.includes('vr-distribucion')
            )
            .map(cacheName => {
              console.log('🗑️ Service Worker: Eliminando cache antiguo:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('✅ Service Worker v3.0: Activado y optimizado para performance');
        return self.clients.claim();
      })
  );
});

// Interceptar peticiones de red - Optimizado para LCP
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Estrategias optimizadas según el tipo de recurso
  if (isGoogleFont(request.url)) {
    event.respondWith(fontCacheStrategy(request));
  }
  else if (isS3StaticResource(request.url)) {
    event.respondWith(aggressiveCacheStrategy(request));
  }
  else if (isVideoResource(request.url)) {
    event.respondWith(videoOptimizedStrategy(request));
  }
  else {
    // Dejar pasar otros recursos sin interceptar
    return;
  }
});

// Verificar si es fuente de Google
function isGoogleFont(url) {
  return url.includes('fonts.googleapis.com') || 
         url.includes('fonts.gstatic.com') ||
         FONT_RESOURCES.includes(url);
}

// Verificar si es un recurso estático de S3
function isS3StaticResource(url) {
  return url.includes('vrdistribucion.s3-accelerate.amazonaws.com') && 
         (url.includes('.css') || url.includes('.js') || 
          url.includes('.png') || url.includes('.jpg') || 
          url.includes('.svg') || url.includes('.webp'));
}

// Verificar si es un recurso de video
function isVideoResource(url) {
  return VIDEO_RESOURCES.includes(url) || url.includes('.mp4');
}

// Estrategia de cache agresivo para fuentes
async function fontCacheStrategy(request) {
  try {
    const cache = await caches.open(CACHE_NAME + '-fonts');
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('🔤 Fuente servida desde cache:', request.url.split('/').pop());
      return cachedResponse;
    }
    
    console.log('🔤 Descargando fuente:', request.url.split('/').pop());
    const networkResponse = await fetch(request, { 
      mode: 'cors',
      cache: 'force-cache'
    });
    
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('❌ Error en fontCacheStrategy:', error);
    const cache = await caches.open(CACHE_NAME + '-fonts');
    return await cache.match(request) || new Response('Fuente no disponible', { status: 404 });
  }
}

// Estrategia de cache agresivo para recursos estáticos
async function aggressiveCacheStrategy(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('📦 Recurso servido desde cache:', request.url.split('/').pop());
      
      // Verificar expiración en background sin bloquear
      setTimeout(async () => {
        const cacheTime = await getCacheTime(request.url);
        if (cacheTime && (Date.now() - cacheTime > CACHE_EXPIRY_TIME)) {
          try {
            const networkResponse = await fetch(request);
            if (networkResponse.ok) {
              await cache.put(request, networkResponse.clone());
              await setCacheTime(request.url, Date.now());
              console.log('🔄 Recurso actualizado en background:', request.url.split('/').pop());
            }
          } catch (error) {
            console.log('⚠️ Error actualizando en background:', error.message);
          }
        }
      }, 100);
      
      return cachedResponse;
    }
    
    console.log('📦 Descargando y cacheando:', request.url.split('/').pop());
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      await setCacheTime(request.url, Date.now());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('❌ Error en aggressiveCacheStrategy:', error);
    const cache = await caches.open(CACHE_NAME);
    return await cache.match(request) || new Response('Recurso no disponible', { status: 404 });
  }
}

// Estrategia optimizada para videos
async function videoOptimizedStrategy(request) {
  try {
    const cache = await caches.open(CACHE_NAME + '-videos');
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('🎥 Video servido desde cache:', request.url.split('/').pop());
      return cachedResponse;
    }
    
    // Para videos, priorizar red pero con cache de respaldo
    console.log('🎥 Descargando video:', request.url.split('/').pop());
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Solo cachear videos pequeños o en WiFi
      if (navigator.connection && 
          (navigator.connection.effectiveType === '4g' || 
           navigator.connection.type === 'wifi')) {
        const responseClone = networkResponse.clone();
        cache.put(request, responseClone);
        setCacheTime(request.url, Date.now());
        console.log('🎥 Video cacheado:', request.url.split('/').pop());
      }
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('🎥 Red falló, intentando cache para video:', error.message);
    const cache = await caches.open(CACHE_NAME + '-videos');
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('🎥 Video de respaldo servido desde cache:', request.url.split('/').pop());
      return cachedResponse;
    }
    
    throw error;
  }
}

// Funciones de utilidad optimizadas
async function setCacheTime(url, timestamp) {
  try {
    const cache = await caches.open(CACHE_NAME + '-timestamps');
    await cache.put(url, new Response(timestamp.toString()));
  } catch (error) {
    console.error('Error guardando timestamp:', error);
  }
}

async function getCacheTime(url) {
  try {
    const cache = await caches.open(CACHE_NAME + '-timestamps');
    const response = await cache.match(url);
    if (response) {
      const timestamp = await response.text();
      return parseInt(timestamp);
    }
  } catch (error) {
    console.error('Error obteniendo timestamp:', error);
  }
  return null;
}

// Limpiar cache mejorado
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.includes('vr-distribucion'))
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => {
      console.log('🧹 Service Worker: Cache limpiado completamente');
      event.ports[0].postMessage({success: true});
    });
  }
  
  if (event.data && event.data.type === 'FORCE_UPDATE') {
    // Forzar actualización de todos los recursos
    Promise.all([
      updateCacheResources(CRITICAL_RESOURCES, CACHE_NAME),
      updateCacheResources(FONT_RESOURCES, CACHE_NAME + '-fonts'),
      updateCacheResources(VIDEO_RESOURCES, CACHE_NAME + '-videos')
    ]).then(() => {
      console.log('🔄 Cache forzadamente actualizado');
      event.ports[0].postMessage({success: true});
    });
  }
});

async function updateCacheResources(resources, cacheName) {
  const cache = await caches.open(cacheName);
  return Promise.allSettled(
    resources.map(async (resource) => {
      try {
        const response = await fetch(resource, { cache: 'reload' });
        if (response.ok) {
          await cache.put(resource, response);
        }
      } catch (error) {
        console.error(`Error actualizando ${resource}:`, error);
      }
    })
  );
}
