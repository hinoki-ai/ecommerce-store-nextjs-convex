"use client"

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  hits: number
  size: number
}

interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum cache size in MB
  maxEntries?: number // Maximum number of entries
  enableMetrics?: boolean
}

interface CacheMetrics {
  hits: number
  misses: number
  size: number
  entries: number
  hitRate: number
  evictions: number
}

class PerformanceCache {
  private cache = new Map<string, CacheEntry<any>>()
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    size: 0,
    entries: 0,
    hitRate: 0,
    evictions: 0
  }
  
  private readonly defaultTTL = 5 * 60 * 1000 // 5 minutes
  private readonly maxSize: number
  private readonly maxEntries: number
  private readonly enableMetrics: boolean

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 10 // 10MB default
    this.maxEntries = options.maxEntries || 1000
    this.enableMetrics = options.enableMetrics !== false

    // Cleanup expired entries periodically
    if (typeof window !== 'undefined') {
      setInterval(() => this.cleanup(), 60000) // Cleanup every minute
    }
  }

  private calculateSize(data: any): number {
    // Rough estimate of memory usage in KB
    const str = JSON.stringify(data)
    return new Blob([str]).size / 1024
  }

  private evictLRU(): void {
    let oldestKey = ''
    let oldestTime = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.delete(oldestKey)
      this.metrics.evictions++
    }
  }

  private cleanup(): void {
    const now = Date.now()
    const expiredKeys: string[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key)
      }
    }

    expiredKeys.forEach(key => this.delete(key))
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const size = this.calculateSize(data)
    const actualTTL = ttl || this.defaultTTL

    // Check size constraints
    if (size > this.maxSize * 1024) {
      console.warn(`Cache entry ${key} too large (${size}KB), skipping`)
      return
    }

    // Evict if necessary
    while (
      this.cache.size >= this.maxEntries || 
      this.metrics.size + size > this.maxSize * 1024
    ) {
      this.evictLRU()
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: actualTTL,
      hits: 0,
      size
    })

    this.metrics.entries = this.cache.size
    this.metrics.size += size
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      if (this.enableMetrics) {
        this.metrics.misses++
        this.updateHitRate()
      }
      return null
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key)
      if (this.enableMetrics) {
        this.metrics.misses++
        this.updateHitRate()
      }
      return null
    }

    // Update hit count and timestamp for LRU
    entry.hits++
    entry.timestamp = Date.now()

    if (this.enableMetrics) {
      this.metrics.hits++
      this.updateHitRate()
    }

    return entry.data as T
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key)
    if (entry) {
      this.metrics.size -= entry.size
      this.metrics.entries = this.cache.size - 1
      return this.cache.delete(key)
    }
    return false
  }

  clear(): void {
    this.cache.clear()
    this.metrics = {
      hits: 0,
      misses: 0,
      size: 0,
      entries: 0,
      hitRate: 0,
      evictions: 0
    }
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key)
      return false
    }

    return true
  }

  private updateHitRate(): void {
    const total = this.metrics.hits + this.metrics.misses
    this.metrics.hitRate = total > 0 ? this.metrics.hits / total : 0
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics }
  }

  // Specialized cache methods for common use cases
  
  async getOrSet<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const data = await fetcher()
    this.set(key, data, ttl)
    return data
  }

  setJSON<T>(key: string, data: T, ttl?: number): void {
    try {
      this.set(key, data, ttl)
    } catch (error) {
      console.error(`Failed to cache JSON data for key ${key}:`, error)
    }
  }

  getJSON<T>(key: string): T | null {
    try {
      return this.get<T>(key)
    } catch (error) {
      console.error(`Failed to retrieve JSON data for key ${key}:`, error)
      this.delete(key)
      return null
    }
  }

  // Batch operations
  setMany<T>(entries: Array<{ key: string; data: T; ttl?: number }>): void {
    entries.forEach(({ key, data, ttl }) => {
      this.set(key, data, ttl)
    })
  }

  getMany<T>(keys: string[]): Array<{ key: string; data: T | null }> {
    return keys.map(key => ({
      key,
      data: this.get<T>(key)
    }))
  }

  deleteMany(keys: string[]): void {
    keys.forEach(key => this.delete(key))
  }

  // Pattern-based operations
  deleteByPattern(pattern: string): number {
    const regex = new RegExp(pattern)
    const keysToDelete: string[] = []

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach(key => this.delete(key))
    return keysToDelete.length
  }

  getByPattern<T>(pattern: string): Array<{ key: string; data: T }> {
    const regex = new RegExp(pattern)
    const results: Array<{ key: string; data: T }> = []

    for (const [key, entry] of this.cache.entries()) {
      if (regex.test(key)) {
        // Check if expired
        if (Date.now() - entry.timestamp <= entry.ttl) {
          results.push({ key, data: entry.data as T })
        }
      }
    }

    return results
  }

  // Memory optimization
  optimize(): void {
    // Remove least frequently used items if cache is getting full
    if (this.metrics.size > this.maxSize * 1024 * 0.8) {
      const entries = Array.from(this.cache.entries())
      entries.sort(([, a], [, b]) => a.hits - b.hits)
      
      // Remove bottom 25% of entries
      const toRemove = Math.floor(entries.length * 0.25)
      for (let i = 0; i < toRemove; i++) {
        this.delete(entries[i][0])
      }
    }
  }

  // Export cache state for persistence
  export(): string {
    const exportData = {
      entries: Array.from(this.cache.entries()),
      timestamp: Date.now()
    }
    return JSON.stringify(exportData)
  }

  // Import cache state from persistence
  import(data: string): boolean {
    try {
      const importData = JSON.parse(data)
      const now = Date.now()

      this.cache.clear()
      this.metrics = {
        hits: 0,
        misses: 0,
        size: 0,
        entries: 0,
        hitRate: 0,
        evictions: 0
      }

      for (const [key, entry] of importData.entries) {
        // Only import non-expired entries
        if (now - entry.timestamp <= entry.ttl) {
          this.cache.set(key, entry)
          this.metrics.size += entry.size
        }
      }

      this.metrics.entries = this.cache.size
      return true
    } catch (error) {
      console.error('Failed to import cache data:', error)
      return false
    }
  }
}

// Global cache instance
const globalCache = new PerformanceCache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 10, // 10MB
  maxEntries: 1000,
  enableMetrics: true
})

// Specific cache instances for different data types
export const productCache = new PerformanceCache({
  ttl: 10 * 60 * 1000, // 10 minutes for products
  maxSize: 5,
  maxEntries: 500
})

export const userCache = new PerformanceCache({
  ttl: 60 * 1000, // 1 minute for user data
  maxSize: 2,
  maxEntries: 100
})

export const searchCache = new PerformanceCache({
  ttl: 2 * 60 * 1000, // 2 minutes for searches
  maxSize: 3,
  maxEntries: 200
})

// Cache key generators
export const CacheKeys = {
  product: (id: string) => `product:${id}`,
  products: (query?: string) => `products:${query || 'all'}`,
  user: (id: string) => `user:${id}`,
  cart: (id: string) => `cart:${id}`,
  search: (query: string, filters?: string) => `search:${query}:${filters || 'none'}`,
  category: (id: string) => `category:${id}`,
  inventory: (productId: string) => `inventory:${productId}`,
  recommendations: (userId: string, type: string) => `recs:${userId}:${type}`,
  analytics: (metric: string, period: string) => `analytics:${metric}:${period}`
} as const

// Cache wrapper for API calls
export function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: { ttl?: number; cache?: PerformanceCache } = {}
): Promise<T> {
  const cache = options.cache || globalCache
  return cache.getOrSet(key, fetcher, options.ttl)
}

export { PerformanceCache }
export default globalCache