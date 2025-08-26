// Advanced Service Worker for ΛRΛMΛC E-commerce Store
// Provides intelligent caching, background sync, and performance optimizations

const CACHE_VERSION = 'aramac-v2.1.0'
const STATIC_CACHE = `static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`
const API_CACHE = `api-${CACHE_VERSION}`
const IMAGE_CACHE = `images-${CACHE_VERSION}`

// Cache configurations
const CACHE_STRATEGIES = {
  static: {
    name: STATIC_CACHE,
    maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
    maxEntries: 100
  },
  dynamic: {
    name: DYNAMIC_CACHE,
    maxAgeSeconds: 24 * 60 * 60, // 24 hours
    maxEntries: 50
  },
  api: {
    name: API_CACHE,
    maxAgeSeconds: 5 * 60, // 5 minutes
    maxEntries: 200
  },
  images: {
    name: IMAGE_CACHE,
    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    maxEntries: 500
  }
}

// Static assets to precache
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
  // Add more critical static assets here
]

// Install event - precache static assets
self.addEventListener('install', event => {
  console.log('SW: Installing advanced service worker')
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })))
      }),
      self.skipWaiting()
    ])
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('SW: Activating advanced service worker')
  
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => !Object.values(CACHE_STRATEGIES).some(strategy => strategy.name === cacheName))
            .map(cacheName => caches.delete(cacheName))
        )
      }),
      self.clients.claim()
    ])
  )
})

// Fetch event - intelligent request handling
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return
  }
  
  // Handle different types of requests with appropriate strategies
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, CACHE_STRATEGIES.static))
  } else if (isAPIRequest(url)) {
    event.respondWith(networkFirst(request, CACHE_STRATEGIES.api))
  } else if (isImageRequest(url)) {
    event.respondWith(cacheFirst(request, CACHE_STRATEGIES.images))
  } else if (isPageRequest(url)) {
    event.respondWith(staleWhileRevalidate(request, CACHE_STRATEGIES.dynamic))
  } else {
    event.respondWith(networkFirst(request, CACHE_STRATEGIES.dynamic))
  }
})

// Background sync for cart and user data
self.addEventListener('sync', event => {
  console.log('SW: Background sync triggered', event.tag)
  
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCart())
  } else if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics())
  } else if (event.tag === 'wishlist-sync') {
    event.waitUntil(syncWishlist())
  }
})

// Push notification handling
self.addEventListener('push', event => {
  console.log('SW: Push message received')
  
  if (!event.data) return
  
  try {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: data.icon || '/favicon.ico',
      badge: data.badge || '/favicon.ico',
      image: data.image,
      data: data.data,
      actions: data.actions || [],
      requireInteraction: data.requireInteraction || false,
      silent: data.silent || false,
      tag: data.tag || 'default',
      renotify: data.renotify || false,
      vibrate: data.vibrate || [200, 100, 200]
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  } catch (error) {
    console.error('SW: Error handling push message', error)
  }
})

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('SW: Notification clicked', event)
  
  event.notification.close()
  
  const data = event.notification.data
  let url = '/'
  
  if (data && data.url) {
    url = data.url
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      
      // Open a new window
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})

// Cache strategies implementation

async function cacheFirst(request, strategy) {
  try {
    const cache = await caches.open(strategy.name)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      // Check if cached response is still valid
      const cachedDate = new Date(cachedResponse.headers.get('date') || 0)
      const now = new Date()
      const age = (now - cachedDate) / 1000
      
      if (age < strategy.maxAgeSeconds) {
        console.log('SW: Serving from cache', request.url)
        return cachedResponse
      }
    }
    
    console.log('SW: Fetching from network', request.url)
    const networkResponse = await fetch(request)
    
    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
      const responseToCache = networkResponse.clone()
      await cache.put(request, responseToCache)
      await cleanupCache(strategy)
    }
    
    return networkResponse
  } catch (error) {
    console.error('SW: Cache first strategy failed', error)
    
    // Try to serve from cache as fallback
    const cache = await caches.open(strategy.name)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline')
    }
    
    throw error
  }
}

async function networkFirst(request, strategy) {
  try {
    console.log('SW: Network first - fetching', request.url)
    const networkResponse = await fetch(request)
    
    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
      const cache = await caches.open(strategy.name)
      const responseToCache = networkResponse.clone()
      await cache.put(request, responseToCache)
      await cleanupCache(strategy)
    }
    
    return networkResponse
  } catch (error) {
    console.log('SW: Network failed, trying cache', request.url)
    const cache = await caches.open(strategy.name)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline')
    }
    
    throw error
  }
}

async function staleWhileRevalidate(request, strategy) {
  const cache = await caches.open(strategy.name)
  const cachedResponse = await cache.match(request)
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
      cache.put(request, networkResponse.clone())
      cleanupCache(strategy)
    }
    return networkResponse
  }).catch(error => {
    console.error('SW: Stale while revalidate fetch failed', error)
    return null
  })
  
  if (cachedResponse) {
    console.log('SW: Serving stale content', request.url)
    return cachedResponse
  }
  
  console.log('SW: Waiting for network', request.url)
  const networkResponse = await fetchPromise
  
  if (networkResponse) {
    return networkResponse
  }
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    return caches.match('/offline')
  }
  
  throw new Error('Network and cache both failed')
}

// Cache cleanup
async function cleanupCache(strategy) {
  const cache = await caches.open(strategy.name)
  const keys = await cache.keys()
  
  if (keys.length > strategy.maxEntries) {
    console.log(`SW: Cleaning up cache ${strategy.name}`)
    const keysToDelete = keys.slice(0, keys.length - strategy.maxEntries)
    await Promise.all(keysToDelete.map(key => cache.delete(key)))
  }
}

// Request type detection
function isStaticAsset(url) {
  return url.pathname.match(/\.(js|css|woff|woff2|ttf|eot|ico)$/)
}

function isAPIRequest(url) {
  return url.pathname.startsWith('/api/') || url.hostname !== self.location.hostname
}

function isImageRequest(url) {
  return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/)
}

function isPageRequest(url) {
  return url.pathname.match(/^\/[^.]*$/) || url.pathname.endsWith('.html')
}

// Background sync functions
async function syncCart() {
  try {
    console.log('SW: Syncing cart data')
    const cartData = await getStoredData('pendingCartSync')
    
    if (cartData) {
      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartData)
      })
      
      if (response.ok) {
        await removeStoredData('pendingCartSync')
        console.log('SW: Cart sync completed')
      }
    }
  } catch (error) {
    console.error('SW: Cart sync failed', error)
  }
}

async function syncAnalytics() {
  try {
    console.log('SW: Syncing analytics data')
    const analyticsData = await getStoredData('pendingAnalytics')
    
    if (analyticsData && analyticsData.length > 0) {
      const response = await fetch('/api/analytics/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: analyticsData })
      })
      
      if (response.ok) {
        await removeStoredData('pendingAnalytics')
        console.log('SW: Analytics sync completed')
      }
    }
  } catch (error) {
    console.error('SW: Analytics sync failed', error)
  }
}

async function syncWishlist() {
  try {
    console.log('SW: Syncing wishlist data')
    const wishlistData = await getStoredData('pendingWishlistSync')
    
    if (wishlistData) {
      const response = await fetch('/api/wishlist/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wishlistData)
      })
      
      if (response.ok) {
        await removeStoredData('pendingWishlistSync')
        console.log('SW: Wishlist sync completed')
      }
    }
  } catch (error) {
    console.error('SW: Wishlist sync failed', error)
  }
}

// IndexedDB helper functions
async function getStoredData(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('aramac-offline-db', 1)
    
    request.onerror = () => reject(request.error)
    
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['offline-data'], 'readonly')
      const store = transaction.objectStore('offline-data')
      const getRequest = store.get(key)
      
      getRequest.onsuccess = () => resolve(getRequest.result?.data)
      getRequest.onerror = () => reject(getRequest.error)
    }
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('offline-data')) {
        db.createObjectStore('offline-data', { keyPath: 'key' })
      }
    }
  })
}

async function removeStoredData(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('aramac-offline-db', 1)
    
    request.onerror = () => reject(request.error)
    
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['offline-data'], 'readwrite')
      const store = transaction.objectStore('offline-data')
      const deleteRequest = store.delete(key)
      
      deleteRequest.onsuccess = () => resolve()
      deleteRequest.onerror = () => reject(deleteRequest.error)
    }
  })
}

console.log('SW: Advanced service worker loaded successfully')