/**
 * Utility functions for handling image URLs
 */

/**
 * Ensures an image URL is absolute
 * @param url The image URL to process
 * @param defaultUrl Optional default URL to use if the input is empty or invalid
 * @returns A properly formatted absolute URL
 */
export function ensureAbsoluteImageUrl(url?: string, defaultUrl = '/placeholder.jpg'): string {
  if (!url) return defaultUrl;
  
  // If it's already an absolute URL, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative URL but doesn't start with /, add the /
  if (!url.startsWith('/')) {
    url = `/${url}`;
  }
  
  // If it's a WordPress URL that's missing the domain
  if (url.includes('/wp-content/uploads/')) {
    return `https://saonamtg.com${url}`;
  }
  
  // Otherwise, it's a local URL
  return url;
}

/**
 * Determines if an image should be unoptimized based on its URL
 * @param url The image URL to check
 * @returns True if the image should be unoptimized
 */
export function shouldUnoptimizeImage(url?: string): boolean {
  if (!url) return true;
  
  // Local images should be unoptimized
  if (!url.startsWith('http')) return true;
  
  // WordPress uploads should be unoptimized
  if (url.includes('/wp-content/uploads/')) return true;
  
  return false;
}
