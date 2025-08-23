'use client';

import { useState, useEffect } from 'react';

export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  isUpdateAvailable: boolean;
  installPrompt: PWAInstallPrompt | null;
}

interface PWAActions {
  install: () => Promise<boolean>;
  updateApp: () => Promise<void>;
  showInstallPromotion: () => void;
  dismissInstallPromotion: () => void;
}

interface UsePWAReturn extends PWAState, PWAActions {
  // Notification methods
  requestNotificationPermission: () => Promise<NotificationPermission>;
  subscribeToNotifications: () => Promise<PushSubscription | null>;
  unsubscribeFromNotifications: () => Promise<void>;
  
  // Offline methods  
  syncWhenOnline: (data: any, endpoint: string) => Promise<void>;
  getCachedData: (key: string) => Promise<any>;
  setCachedData: (key: string, data: any) => Promise<void>;
}

export function usePWA(): UsePWAReturn {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check if running as PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  (window.navigator as any).standalone ||
                  document.referrer.includes('android-app://');
    setIsInstalled(isPWA);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('Service Worker registered:', reg);
          setRegistration(reg);
          
          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setIsUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as any);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
    });

    // Listen for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial offline state
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => {});
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!installPrompt) {
      return false;
    }

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
        setInstallPrompt(null);
        
        // Track installation
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'pwa_install', {
            method: 'prompt_accepted'
          });
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('PWA installation failed:', error);
      return false;
    }
  };

  const updateApp = async (): Promise<void> => {
    if (!registration || !registration.waiting) {
      return;
    }

    try {
      // Tell the waiting service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Wait for the new service worker to take control
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
      
      setIsUpdateAvailable(false);
    } catch (error) {
      console.error('App update failed:', error);
    }
  };

  const showInstallPromotion = () => {
    // Show custom install promotion UI
    // This would typically trigger a modal or banner
    const event = new CustomEvent('pwa-show-install-prompt');
    window.dispatchEvent(event);
  };

  const dismissInstallPromotion = () => {
    // Hide install promotion and remember user choice
    localStorage.setItem('pwa-install-dismissed', 'true');
    const event = new CustomEvent('pwa-hide-install-prompt');
    window.dispatchEvent(event);
  };

  const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    
    // Track permission result
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'notification_permission', {
        result: permission
      });
    }

    return permission;
  };

  const subscribeToNotifications = async (): Promise<PushSubscription | null> => {
    if (!registration || !registration.pushManager) {
      console.warn('Push notifications not supported');
      return null;
    }

    try {
      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Create new subscription
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
          console.warn('VAPID public key not configured');
          return null;
        }

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });
      }

      // Send subscription to server
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      });

      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  };

  const unsubscribeFromNotifications = async (): Promise<void> => {
    if (!registration || !registration.pushManager) {
      return;
    }

    try {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        
        // Notify server
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        });
      }
    } catch (error) {
      console.error('Push unsubscribe failed:', error);
    }
  };

  const syncWhenOnline = async (data: any, endpoint: string): Promise<void> => {
    if (navigator.onLine) {
      // Send immediately if online
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (error) {
        // Store for later sync if request fails
        await storeForBackgroundSync(data, endpoint);
      }
    } else {
      // Store for background sync when online
      await storeForBackgroundSync(data, endpoint);
    }
  };

  const getCachedData = async (key: string): Promise<any> => {
    try {
      const cache = await caches.open('aramac-dynamic-v1');
      const response = await cache.match(`/cache/${key}`);
      if (response) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return null;
    }
  };

  const setCachedData = async (key: string, data: any): Promise<void> => {
    try {
      const cache = await caches.open('aramac-dynamic-v1');
      const response = new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
      await cache.put(`/cache/${key}`, response);
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  };

  return {
    // State
    isInstallable,
    isInstalled,
    isOffline,
    isUpdateAvailable,
    installPrompt,
    
    // Actions
    install,
    updateApp,
    showInstallPromotion,
    dismissInstallPromotion,
    
    // Notifications
    requestNotificationPermission,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    
    // Offline/Sync
    syncWhenOnline,
    getCachedData,
    setCachedData
  };
}

// Helper functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function storeForBackgroundSync(data: any, endpoint: string): Promise<void> {
  try {
    // In a real implementation, this would store in IndexedDB
    // and register a background sync event
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      
      // Store data in IndexedDB (implementation needed)
      await storeInIndexedDB('pending-requests', { data, endpoint, timestamp: Date.now() });
      
      // Register background sync
      await registration.sync.register('data-sync');
    }
  } catch (error) {
    console.error('Background sync registration failed:', error);
  }
}

async function storeInIndexedDB(storeName: string, data: any): Promise<void> {
  // IndexedDB implementation needed
  console.log('Storing in IndexedDB:', storeName, data);
}