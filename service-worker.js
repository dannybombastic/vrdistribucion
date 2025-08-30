// Service Worker para cache de recursos de VR Distribución
// Mejora el rendimiento cacheando recursos de S3 localmente

const CACHE_NAME = 'vr-distribucion-v1.2';
const CACHE_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000; // 7 días en millisegundos

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
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/invitaciones.mp4',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/cntro_de_mesa.mp4',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/velas_decorativas.mp4',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/invitaciones_white.mp4',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/rotulos_iluminados.mp4',
  'https://vrdistribucion.s3-accelerate.amazonaws.com/vrdistribucion/video_marketing/velas_con_cruz_cristiana.mp4'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cacheando recursos críticos...');
        // Solo cachear recursos críticos durante la instalación
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => {
        console.log('Service Worker: Recursos críticos cacheados');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error durante instalación:', error);
      })
  );
});

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
      // Verificar si el cache no ha expirado
      const cacheTime = await getCacheTime(request.url);
      if (cacheTime && (Date.now() - cacheTime < CACHE_EXPIRY_TIME)) {
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

// Estrategia Network First - Para videos
async function networkFirstStrategy(request) {
  try {
    console.log('Service Worker: Intentando obtener video de red:', request.url);
    const networkResponse = await fetch(request);
    
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
