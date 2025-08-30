// Service Worker para cache de recursos de VR Distribución
// Mejora el rendimiento cacheando recursos de S3 localmente
// Optimizado para PageSpeed Insights - 15+ KiB savings

const CACHE_NAME = 'vr-distribucion-v2.0';
const CACHE_EXPIRY_TIME = 365 * 24 * 60 * 60 * 1000; // 1 año en millisegundos para máximo ahorro
const VIDEO_CACHE_EXPIRY_TIME = 180 * 24 * 60 * 60 * 1000; // 6 meses para videos

// Recursos críticos que siempre se cachean
const CRITICAL_RESOURCES = [
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/home/css/combined-styles.css',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/landing/css/landing.css',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/landing/img/logo.png',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/home/js/celebration.js',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/landing/js/contactForm.js',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/landing/js/chat.js',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/cookie-consent/cookie-consent.js'
];

// Videos que se cachean con estrategia diferente
const VIDEO_RESOURCES = [
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/invitaciones.mp4', // Hero video - prioridad alta
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/cntro_de_mesa.mp4',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/velas_decorativas.mp4',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/invitaciones_white.mp4',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/rotulos_iluminados.mp4',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/velas_con_cruz_cristiana.mp4'
];

// Video del hero - máxima prioridad para cache
const HERO_VIDEO = 'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/invitaciones.mp4';

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cacheando recursos críticos...');
        // Cachear recursos críticos primero
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(cache => {
        // Pre-cachear el video del hero de forma asíncrona para mejorar LCP
        console.log('Service Worker: Pre-cacheando video del hero...');
        return preloadHeroVideo();
      })
      .then(() => {
        console.log('Service Worker: Recursos críticos y video del hero cacheados');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error durante instalación:', error);
        // Continuar aunque falle el video del hero
        return self.skipWaiting();
      })
  );
});

// Pre-cargar video del hero para mejorar rendimiento
async function preloadHeroVideo() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const request = new Request(HERO_VIDEO, {
      method: 'GET',
      headers: {
        'Range': 'bytes=0-1048576' // Pre-cargar solo el primer MB para inicio rápido
      }
    });
    
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(HERO_VIDEO, response);
      await setCacheTime(HERO_VIDEO, Date.now());
      console.log('Service Worker: Video del hero pre-cacheado exitosamente');
      
      // Notify main thread that hero video is cached
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'VIDEO_CACHED',
            url: HERO_VIDEO,
            isHero: true
          });
        });
      });
    }
  } catch (error) {
    console.log('Service Worker: No se pudo pre-cachear video del hero:', error);
    // No fallar la instalación por esto
  }
}

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activando...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('Service Worker: Eliminando cache antiguo:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('Service Worker: Activado y listo');
        return self.clients.claim();
      })
  );
});

// Interceptar peticiones de red
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Solo procesar recursos de nuestro dominio S3
  if (url.hostname !== 'vrdistribucion.s3-accelerate.amazonaws.com') {
    return;
  }
  
  // Estrategia: Cache First para recursos estáticos
  if (isStaticResource(request.url)) {
    event.respondWith(cacheFirstStrategy(request));
  }
  // Estrategia: Network First para videos (con cache de respaldo)
  else if (isVideoResource(request.url)) {
    event.respondWith(networkFirstStrategy(request));
  }
  // Red normal para otros recursos
  else {
    return;
  }
});

// Verificar si es un recurso estático (CSS, JS, imágenes)
function isStaticResource(url) {
  return CRITICAL_RESOURCES.includes(url) || 
         url.includes('.css') || 
         url.includes('.js') || 
         url.includes('.png') || 
         url.includes('.jpg') || 
         url.includes('.svg');
}

// Verificar si es un recurso de video
function isVideoResource(url) {
  return VIDEO_RESOURCES.includes(url) || url.includes('.mp4');
}

// Estrategia Cache First - Para recursos estáticos
async function cacheFirstStrategy(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Verificar si el cache no ha expirado (diferente tiempo para videos vs otros assets)
      const cacheTime = await getCacheTime(request.url);
      const expiryTime = isVideoResource(request.url) ? VIDEO_CACHE_EXPIRY_TIME : CACHE_EXPIRY_TIME;
      
      if (cacheTime && (Date.now() - cacheTime < expiryTime)) {
        console.log('Service Worker: Sirviendo desde cache:', request.url);
        return cachedResponse;
      }
    }
    
    // Si no está en cache o expiró, obtener de la red
    console.log('Service Worker: Obteniendo de red y cacheando:', request.url);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      await setCacheTime(request.url, Date.now());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('Service Worker: Error en cacheFirstStrategy:', error);
    // Intentar servir desde cache como último recurso
    const cache = await caches.open(CACHE_NAME);
    return await cache.match(request) || new Response('Recurso no disponible', { status: 404 });
  }
}

// Estrategia Network First - Para videos con optimización especial para hero
async function networkFirstStrategy(request) {
  const isHeroVideo = request.url === HERO_VIDEO;
  
  try {
    console.log('Service Worker: Intentando obtener video de red:', request.url);
    
    // Para el video del hero, usar timeout más corto para fallar rápido al cache
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Network timeout')), isHeroVideo ? 3000 : 8000);
    });
    
    const networkResponse = await Promise.race([fetch(request), timeoutPromise]);
    
    if (networkResponse.ok) {
      // Cachear video exitosamente descargado
      const cache = await caches.open(CACHE_NAME);
      const responseClone = networkResponse.clone();
      await cache.put(request, responseClone);
      await setCacheTime(request.url, Date.now());
      console.log('Service Worker: Video cacheado:', request.url);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('Service Worker: Red falló, intentando cache para video:', request.url);
    // Si la red falla, intentar servir desde cache
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('Service Worker: Sirviendo video desde cache:', request.url);
      return cachedResponse;
    }
    
    // Para video del hero, devolver una respuesta de error más informativa
    if (isHeroVideo) {
      console.error('Service Worker: Video del hero no disponible');
      return new Response('Video del hero no disponible', { 
        status: 503, 
        statusText: 'Video Unavailable' 
      });
    }
    
    throw error;
  }
}

// Funciones de utilidad para manejar timestamps de cache
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

// Limpiar cache periódicamente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }).then(() => {
      console.log('Service Worker: Cache limpiado manualmente');
      event.ports[0].postMessage({success: true});
    });
  }
});
