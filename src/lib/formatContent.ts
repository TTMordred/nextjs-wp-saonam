import DOMPurify from 'isomorphic-dompurify';

/**
 * Clean up and format WordPress content
 */
export function formatContent(content: string): string {
  if (!content) return '';

  // Sanitize content
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'title']
  });
}

/**
 * Extract a plain text excerpt from HTML content
 */
export function extractExcerpt(content: string, maxLength = 150): string {
  if (!content) return '';

  // Remove HTML tags
  const plainText = content
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Trim to maxLength
  if (plainText.length <= maxLength) return plainText;

  // Try to cut at the last complete word
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0 ? `${truncated.substring(0, lastSpace)}...` : `${truncated}...`;
}

/**
 * Format date to Vietnamese locale with relative time for recent dates
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Show relative time for recent dates
  if (diffDays < 1) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return diffMinutes <= 0 ? 'Vừa xong' : `${diffMinutes} phút trước`;
    }
    return `${diffHours} giờ trước`;
  }

  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;

  // For older dates, use the full date format
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format currency to Vietnamese format
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format phone number to Vietnamese format
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1.$2.$3');
  }
  
  return cleaned;
}

/**
 * Convert WordPress URLs to relative paths
 */
export function wpUrlToPath(url: string): string {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return url;
  }
}

/**
 * Get image dimensions from WordPress image URL
 */
export function getImageDimensions(url: string): { width: number; height: number } | null {
  if (!url) return null;

  const regex = /-(\d+)x(\d+)\.(jpe?g|png|gif|webp)$/i;
  const match = regex.exec(url);
  if (match) {
    return {
      width: parseInt(match[1], 10),
      height: parseInt(match[2], 10)
    };
  }

  return null;
}

/**
 * Get WordPress image size URL
 */
export function getImageSizeUrl(url: string, size: 'thumbnail' | 'medium' | 'large' | 'full' = 'full'): string {
  if (!url || size === 'full') return url;

  const parts = url.split('.');
  if (parts.length < 2) return url;

  const ext = parts.pop();
  const base = parts.join('.');

  switch (size) {
    case 'thumbnail':
      return `${base}-150x150.${ext}`;
    case 'medium':
      return `${base}-300x300.${ext}`;
    case 'large':
      return `${base}-1024x1024.${ext}`;
    default:
      return url;
  }
}
