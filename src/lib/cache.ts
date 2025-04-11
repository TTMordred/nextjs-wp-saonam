/**
 * Simple in-memory cache implementation with TTL (Time To Live)
 */

interface CacheItem<T> {
  value: T;
  expiry: number;
}

class Cache {
  private cache: Map<string, CacheItem<unknown>>;
  
  constructor() {
    this.cache = new Map();
  }
  
  /**
   * Set a value in the cache with an optional TTL
   * @param key Cache key
   * @param value Value to store
   * @param ttl Time to live in seconds (default: 5 minutes)
   */
  set<T>(key: string, value: T, ttl = 300): void {
    const expiry = Date.now() + ttl * 1000;
    this.cache.set(key, { value, expiry });
  }
  
  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns The cached value or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key) as CacheItem<T> | undefined;
    
    // Return undefined if item doesn't exist or has expired
    if (!item || Date.now() > item.expiry) {
      if (item) {
        this.delete(key); // Clean up expired item
      }
      return undefined;
    }
    
    return item.value;
  }
  
  /**
   * Check if a key exists in the cache and is not expired
   * @param key Cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item || Date.now() > item.expiry) {
      if (item) {
        this.delete(key); // Clean up expired item
      }
      return false;
    }
    
    return true;
  }
  
  /**
   * Delete a key from the cache
   * @param key Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get the number of items in the cache
   */
  size(): number {
    return this.cache.size;
  }
  
  /**
   * Clean up expired items from the cache
   * @returns Number of items removed
   */
  cleanup(): number {
    const now = Date.now();
    let count = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
        count++;
      }
    }
    
    return count;
  }
}

// Create a singleton instance
const cache = new Cache();

export default cache;
