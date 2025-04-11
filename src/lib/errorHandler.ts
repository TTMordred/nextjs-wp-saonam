'use client';

/**
 * Client-side error handling utility
 */

// Re-export the ErrorFallback component
export { ErrorFallback } from '@/components/ErrorFallback';

// Log error to the server
export async function logErrorToServer(error: Error, url?: string) {
  try {
    await fetch('/api/error-logger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        url: url ?? window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (logError) {
    // If we can't log to the server, log to the console
    console.error('Failed to log error to server:', logError);
    console.error('Original error:', error);
  }
}

// Global error handler for unhandled errors
export function setupGlobalErrorHandler() {
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      logErrorToServer(event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      logErrorToServer(event.reason);
    });
  }
}
