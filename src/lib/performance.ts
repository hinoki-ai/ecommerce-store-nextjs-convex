/**
 * @fileoverview Production-ready performance optimization utilities
 * @description Comprehensive performance utilities based on proven patterns
 * @author AI Agent Generated
 * @version 1.0.0
 * @security-level HIGH
 */

// Image optimization utilities
export const imageOptimization = {
  // Preload critical images above the fold
  preloadCriticalImages: (imageSrcs: string[]) => {
    if (typeof window !== 'undefined') {
      imageSrcs.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    }
  },

  // Lazy load images with intersection observer
  setupLazyLoading: () => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
              }
            }
          });
        },
        {
          // Start loading when image is 50px away from viewport
          rootMargin: '50px 0px',
          threshold: 0.01
        }
      );

      // Observe all lazy images
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });

      return imageObserver;
    }
  },

  // Generate responsive image sizes
  generateSrcSet: (baseSrc: string, sizes: number[]) => {
    return sizes
      .map(size => `${baseSrc}?w=${size}&q=75 ${size}w`)
      .join(', ');
  }
};

// Bundle size optimization
export const bundleOptimization = {
  // Dynamic import with error handling
  lazyImport: async <T>(importFn: () => Promise<T>): Promise<T> => {
    try {
      return await importFn();
    } catch (error) {
      console.error('Dynamic import failed:', error);
      throw error;
    }
  },

  // Preload critical chunks
  preloadRoute: (route: string) => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = `/_next/static/chunks/${route}`;
      document.head.appendChild(link);
    }
  },

  // Code splitting utilities
  createAsyncComponent: <T extends React.ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    fallback?: React.ComponentType
  ) => {
    return React.lazy(async () => {
      try {
        const component = await importFn();
        return component;
      } catch (error) {
        console.error('Component loading failed:', error);
        if (fallback) {
          return { default: fallback };
        }
        throw error;
      }
    });
  }
};

// Memory management
export const memoryOptimization = {
  // Debounce function for expensive operations
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate?: boolean
  ): T => {
    let timeout: NodeJS.Timeout | null = null;
    
    return ((...args: any[]) => {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(null, args);
      };
      
      const callNow = immediate && !timeout;
      
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      
      if (callNow) func.apply(null, args);
    }) as T;
  },

  // Throttle function for scroll/resize events
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): T => {
    let inThrottle: boolean = false;
    
    return ((...args: any[]) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  },

  // Clean up event listeners and intervals
  createCleanupManager: () => {
    const cleanupFunctions: (() => void)[] = [];
    
    return {
      add: (cleanup: () => void) => {
        cleanupFunctions.push(cleanup);
      },
      
      cleanup: () => {
        cleanupFunctions.forEach(fn => {
          try {
            fn();
          } catch (error) {
            console.error('Cleanup function failed:', error);
          }
        });
        cleanupFunctions.length = 0;
      }
    };
  },

  // Memory leak prevention for large lists
  virtualizeList: <T>(
    items: T[],
    containerHeight: number,
    itemHeight: number,
    overscan: number = 5
  ) => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const totalCount = items.length;
    
    return {
      visibleCount,
      totalCount,
      getVisibleItems: (scrollTop: number) => {
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(
          startIndex + visibleCount + overscan,
          totalCount
        );
        
        return {
          startIndex: Math.max(0, startIndex - overscan),
          endIndex,
          items: items.slice(
            Math.max(0, startIndex - overscan),
            endIndex
          )
        };
      }
    };
  }
};

// Network optimization
export const networkOptimization = {
  // Retry mechanism with exponential backoff
  retryWithBackoff: async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries - 1) {
          throw error;
        }
        
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('All retry attempts failed');
  },

  // Request deduplication
  createRequestDeduplicator: <T>() => {
    const cache = new Map<string, Promise<T>>();
    
    return {
      get: (key: string, fetcher: () => Promise<T>): Promise<T> => {
        if (cache.has(key)) {
          return cache.get(key)!;
        }
        
        const promise = fetcher().finally(() => {
          // Remove from cache after completion
          cache.delete(key);
        });
        
        cache.set(key, promise);
        return promise;
      },
      
      clear: () => {
        cache.clear();
      }
    };
  },

  // Prefetch data for next page
  prefetchData: async (url: string, options?: RequestInit) => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      return new Promise<void>((resolve) => {
        window.requestIdleCallback(() => {
          fetch(url, { 
            ...options,
            method: 'GET',
            // Use prefetch cache
            cache: 'force-cache'
          }).then(() => resolve()).catch(() => resolve());
        });
      });
    }
  }
};

// Performance monitoring
export const performanceMonitoring = {
  // Core Web Vitals measurement
  measureWebVitals: () => {
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      }).catch(() => {
        // Fallback if web-vitals not available
        console.log('Web vitals monitoring not available');
      });
    }
  },

  // Custom performance metrics
  measureCustomMetric: (name: string, fn: () => any) => {
    if (typeof window !== 'undefined' && window.performance) {
      const start = performance.now();
      const result = fn();
      const end = performance.now();
      
      console.log(`${name}: ${end - start}ms`);
      
      // Send to analytics if available
      if (window.gtag) {
        window.gtag('event', 'timing_complete', {
          name,
          value: Math.round(end - start)
        });
      }
      
      return result;
    }
    
    return fn();
  },

  // Long task detection
  observeLongTasks: () => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.warn('Long task detected:', entry.duration);
            
            // Send to monitoring service
            if (window.gtag) {
              window.gtag('event', 'long_task', {
                duration: entry.duration,
                start_time: entry.startTime
              });
            }
          }
        });
        
        observer.observe({ entryTypes: ['longtask'] });
        return observer;
      } catch (error) {
        console.log('Long task observation not supported');
      }
    }
  },

  // Resource loading optimization
  observeResourceLoading: () => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const resourceEntry = entry as PerformanceResourceTiming;
            
            // Log slow resources
            if (resourceEntry.duration > 1000) {
              console.warn(`Slow resource: ${resourceEntry.name} (${resourceEntry.duration}ms)`);
            }
            
            // Monitor specific resource types
            if (resourceEntry.initiatorType === 'img' && resourceEntry.duration > 500) {
              console.warn(`Slow image: ${resourceEntry.name}`);
            }
          }
        });
        
        observer.observe({ entryTypes: ['resource'] });
        return observer;
      } catch (error) {
        console.log('Resource observation not supported');
      }
    }
  }
};

// Cache optimization
export const cacheOptimization = {
  // Service worker cache strategies
  setupCacheStrategies: () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('Service Worker registered:', registration);
      }).catch(error => {
        console.log('Service Worker registration failed:', error);
      });
    }
  },

  // Browser cache utilities
  createMemoryCache: <T>(maxSize: number = 100) => {
    const cache = new Map<string, { value: T; timestamp: number }>();
    
    return {
      get: (key: string, maxAge: number = 300000): T | null => {
        const item = cache.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > maxAge) {
          cache.delete(key);
          return null;
        }
        
        return item.value;
      },
      
      set: (key: string, value: T): void => {
        if (cache.size >= maxSize) {
          // Remove oldest item
          const firstKey = cache.keys().next().value;
          cache.delete(firstKey);
        }
        
        cache.set(key, {
          value,
          timestamp: Date.now()
        });
      },
      
      clear: () => {
        cache.clear();
      },
      
      size: () => cache.size
    };
  },

  // Local storage with expiration
  createPersistentCache: () => {
    const isSupported = typeof window !== 'undefined' && 'localStorage' in window;
    
    return {
      get: <T>(key: string): T | null => {
        if (!isSupported) return null;
        
        try {
          const item = localStorage.getItem(key);
          if (!item) return null;
          
          const { value, expiry } = JSON.parse(item);
          
          if (expiry && Date.now() > expiry) {
            localStorage.removeItem(key);
            return null;
          }
          
          return value;
        } catch {
          return null;
        }
      },
      
      set: <T>(key: string, value: T, ttl?: number): void => {
        if (!isSupported) return;
        
        try {
          const item = {
            value,
            expiry: ttl ? Date.now() + ttl : null
          };
          
          localStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
          console.warn('Cache storage failed:', error);
        }
      },
      
      remove: (key: string): void => {
        if (!isSupported) return;
        localStorage.removeItem(key);
      },
      
      clear: (): void => {
        if (!isSupported) return;
        localStorage.clear();
      }
    };
  }
};

// Export performance optimization hooks for React components
export const usePerformanceOptimization = () => {
  React.useEffect(() => {
    // Setup performance monitoring
    performanceMonitoring.measureWebVitals();
    const longTaskObserver = performanceMonitoring.observeLongTasks();
    const resourceObserver = performanceMonitoring.observeResourceLoading();
    
    // Setup image lazy loading
    const imageObserver = imageOptimization.setupLazyLoading();
    
    // Cleanup function
    return () => {
      longTaskObserver?.disconnect();
      resourceObserver?.disconnect();
      imageObserver?.disconnect();
    };
  }, []);
};

// Global performance configuration
export const initializePerformanceOptimizations = () => {
  // Preload critical resources
  if (typeof window !== 'undefined') {
    // Preload critical fonts
    const criticalFonts = [
      '/fonts/geist-sans-latin.woff2',
      '/fonts/geist-mono-latin.woff2'
    ];
    
    criticalFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = font;
      document.head.appendChild(link);
    });

    // Setup cache strategies
    cacheOptimization.setupCacheStrategies();

    // Initialize performance monitoring
    performanceMonitoring.measureWebVitals();
  }
};

export default {
  imageOptimization,
  bundleOptimization,
  memoryOptimization,
  networkOptimization,
  performanceMonitoring,
  cacheOptimization,
  usePerformanceOptimization,
  initializePerformanceOptimizations
};