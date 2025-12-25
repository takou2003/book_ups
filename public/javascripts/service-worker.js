// ============================================
// SERVICE WORKER SIMPLE ET FONCTIONNEL
// ============================================

console.log('Service Worker: Script chargé');

const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  '/stylesheets/style.css',
  '/manifest.json',
  '/icons/48x48.png',
  '/icons/192x192.png'
];

// ========== ÉVÉNEMENT D'INSTALLATION ==========
self.addEventListener('install', event => {
  console.log('Service Worker: Installation démarrée');
  
  // IMPORTANT: Force l'activation immédiate
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Mise en cache des fichiers essentiels');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Installation terminée');
      })
      .catch(error => {
        console.error('Service Worker: Erreur installation:', error);
      })
  );
});

// ========== ÉVÉNEMENT D'ACTIVATION ==========
self.addEventListener('activate', event => {
  console.log('Service Worker: Activation démarrée');
  
  event.waitUntil(
    // Nettoyer les anciens caches
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('Service Worker: Prise de contrôle des clients');
      // FORCER la prise de contrôle de toutes les pages ouvertes
      return self.clients.claim();
    })
    .then(() => {
      console.log('Service Worker: Activation terminée');
      
      // Informer tous les clients
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            message: 'Service Worker activé et contrôlant la page'
          });
        });
      });
    })
  );
});

// ========== ÉVÉNEMENT DE FETCH ==========
self.addEventListener('fetch', event => {
  // Ne pas intercepter les requêtes vers l'API ou autres domaines
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Pour les requêtes de navigation, stratégie: réseau d'abord
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/');
        })
    );
    return;
  }
  
  // Pour les autres ressources: cache d'abord
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(networkResponse => {
            // Mettre en cache pour la prochaine fois
            return caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
          })
          .catch(error => {
            console.log('Service Worker: Fetch échoué:', error);
            // Vous pouvez retourner une page de fallback ici
          });
      })
  );
});

// ========== GESTION DES MESSAGES ==========
self.addEventListener('message', event => {
  console.log('Service Worker: Message reçu:', event.data);
  
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data === 'claimClients') {
    self.clients.claim();
  }
});

console.log('Service Worker: Script entièrement chargé');
