const CACHE_NAME = 'aramac-store-v1';
const STATIC_CACHE_NAME = 'aramac-static-v1';
const DYNAMIC_CACHE_NAME = 'aramac-dynamic-v1';
const IMAGE_CACHE_NAME = 'aramac-images-v1';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API endpoints to cache
const API_CACHE_URLS = [
  '/api/products',
  '/api/categories',
  '/api/collections'
];

// Maximum cache sizes
const MAX_DYNAMIC_CACHE_SIZE = 100;
const MAX_IMAGE_CACHE_SIZE = 200;

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      self.skipWaiting()
    ])
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== IMAGE_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome extensions
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isImage(request)) {
    event.respondWith(handleImage(request));
  } else if (isAPI(request)) {
    event.respondWith(handleAPI(request));
  } else if (isNavigation(request)) {
    event.respondWith(handleNavigation(request));
  } else {
    event.respondWith(handleOther(request));
  }
});

// Handle static assets (CSS, JS, fonts)
function handleStaticAsset(request) {
  return caches.open(STATIC_CACHE_NAME).then((cache) => {
    return cache.match(request).then((response) => {
      if (response) {
        return response;
      }
      
      return fetch(request).then((fetchResponse) => {
        cache.put(request, fetchResponse.clone());
        return fetchResponse;
      }).catch(() => {
        // Return cached version if network fails
        return cache.match(request);
      });
    });
  });
}

// Handle images with cache-first strategy
function handleImage(request) {
  return caches.open(IMAGE_CACHE_NAME).then((cache) => {
    return cache.match(request).then((response) => {
      if (response) {
        return response;
      }
      
      return fetch(request).then((fetchResponse) => {
        // Only cache successful responses
        if (fetchResponse.status === 200) {
          cache.put(request, fetchResponse.clone());
          limitCacheSize(IMAGE_CACHE_NAME, MAX_IMAGE_CACHE_SIZE);
        }
        return fetchResponse;
      }).catch(() => {
        // Return placeholder image if available
        return cache.match('/images/placeholder.jpg');
      });
    });
  });
}

// Handle API requests with network-first strategy
function handleAPI(request) {
  return fetch(request).then((response) => {
    if (response.status === 200) {
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        cache.put(request, response.clone());
        limitCacheSize(DYNAMIC_CACHE_NAME, MAX_DYNAMIC_CACHE_SIZE);
      });
    }
    return response;
  }).catch(() => {
    // Fallback to cache
    return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
      return cache.match(request);
    });
  });
}

// Handle navigation requests
function handleNavigation(request) {
  return fetch(request).then((response) => {
    // Cache successful page loads
    if (response.status === 200) {
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        cache.put(request, response.clone());
      });
    }
    return response;
  }).catch(() => {
    // Fallback to cached page or offline page
    return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
      return cache.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        // Return offline page
        return cache.match('/offline');
      });
    });
  });
}

// Handle other requests
function handleOther(request) {
  return fetch(request).catch(() => {
    return caches.match(request);
  });
}

// Helper functions
function isStaticAsset(request) {
  return request.destination === 'script' ||
         request.destination === 'style' ||
         request.destination === 'font' ||
         request.url.includes('.js') ||
         request.url.includes('.css');
}

function isImage(request) {
  return request.destination === 'image' ||
         request.url.includes('.jpg') ||
         request.url.includes('.jpeg') ||
         request.url.includes('.png') ||
         request.url.includes('.gif') ||
         request.url.includes('.webp') ||
         request.url.includes('.svg');
}

function isAPI(request) {
  return request.url.includes('/api/') ||
         request.url.includes('convex') ||
         API_CACHE_URLS.some(url => request.url.includes(url));
}

function isNavigation(request) {
  return request.mode === 'navigate';
}

// Limit cache size
function limitCacheSize(cacheName, maxSize) {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > maxSize) {
        // Remove oldest entries
        const entriesToDelete = keys.length - maxSize;
        for (let i = 0; i < entriesToDelete; i++) {
          cache.delete(keys[i]);
        }
      }
    });
  });
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCart());
  } else if (event.tag === 'order-sync') {
    event.waitUntil(syncOrder());
  } else if (event.tag === 'wishlist-sync') {
    event.waitUntil(syncWishlist());
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Nueva notificación', body: event.data.text() };
    }
  }
  
  const options = {
    title: data.title || 'Tienda ΛRΛMΛC',
    body: data.body || 'Tienes una nueva notificación',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    image: data.image,
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'Ver',
        icon: '/icons/view-action.png'
      },
      {
        action: 'dismiss',
        title: 'Descartar',
        icon: '/icons/dismiss-action.png'
      }
    ],
    tag: data.tag || 'general',
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
    timestamp: Date.now(),
    vibrate: [200, 100, 200],
    dir: 'ltr',
    lang: 'es-CL'
  };
  
  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  const data = event.notification.data;
  let url = '/';
  
  // Determine URL based on notification type
  if (data.type === 'order_update' && data.orderId) {
    url = `/orders/${data.orderId}`;
  } else if (data.type === 'promotion' && data.promotionId) {
    url = `/promotions/${data.promotionId}`;
  } else if (data.type === 'product_available' && data.productId) {
    url = `/products/${data.productId}`;
  } else if (data.type === 'price_drop' && data.productId) {
    url = `/products/${data.productId}`;
  } else if (data.url) {
    url = data.url;
  }
  
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if there's already a window/tab open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.navigate(url);
            return;
          }
        }
        // Open new window/tab
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
  
  // Track notification interaction
  trackNotificationInteraction(event.notification, event.action);
});

// Message handling (communication with main thread)
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  } else if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearAllCaches());
  }
});

// Sync functions
async function syncCart() {
  try {
    // Get pending cart items from IndexedDB
    const pendingItems = await getPendingCartItems();
    
    for (const item of pendingItems) {
      try {
        await fetch('/api/cart/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        // Remove from pending queue
        await removePendingCartItem(item.id);
      } catch (error) {
        console.error('Cart sync failed for item:', item.id, error);
      }
    }
  } catch (error) {
    console.error('Cart sync failed:', error);
  }
}

async function syncOrder() {
  try {
    // Sync pending order data
    const pendingOrders = await getPendingOrders();
    
    for (const order of pendingOrders) {
      try {
        await fetch('/api/orders/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        });
        await removePendingOrder(order.id);
      } catch (error) {
        console.error('Order sync failed for:', order.id, error);
      }
    }
  } catch (error) {
    console.error('Order sync failed:', error);
  }
}

async function syncWishlist() {
  try {
    // Sync wishlist changes
    const pendingWishlistItems = await getPendingWishlistItems();
    
    for (const item of pendingWishlistItems) {
      try {
        await fetch('/api/wishlist/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        await removePendingWishlistItem(item.id);
      } catch (error) {
        console.error('Wishlist sync failed for:', item.id, error);
      }
    }
  } catch (error) {
    console.error('Wishlist sync failed:', error);
  }
}

// Notification tracking
function trackNotificationInteraction(notification, action) {
  fetch('/api/notifications/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      notificationId: notification.data.id,
      action: action || 'click',
      timestamp: Date.now()
    })
  }).catch((error) => {
    console.error('Failed to track notification interaction:', error);
  });
}

// Cache management
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

// IndexedDB helpers (placeholder implementations)
async function getPendingCartItems() {
  // Implementation would use IndexedDB to get pending cart items
  return [];
}

async function removePendingCartItem(id) {
  // Implementation would remove item from IndexedDB
}

async function getPendingOrders() {
  return [];
}

async function removePendingOrder(id) {
  // Implementation would remove order from IndexedDB
}

async function getPendingWishlistItems() {
  return [];
}

async function removePendingWishlistItem(id) {
  // Implementation would remove wishlist item from IndexedDB
}