// Centralized API URL configuration utility
export const getApiUrl = () => {
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV || 
                       (typeof window !== 'undefined' && window.location.hostname === 'localhost');
  
  // For mobile apps (Cordova/Capacitor), always use production URL
  const isMobileApp = typeof navigator !== 'undefined' && 
                     (navigator.userAgent.includes('Cordova') || 
                      navigator.userAgent.includes('Capacitor') ||
                      (typeof window !== 'undefined' && window.location.protocol === 'file:'));
  
  if (isMobileApp) {
    return 'https://havennproduction.up.railway.app/api';
  }
  
  if (isDevelopment) {
    // Use relative path so Vite dev proxy forwards to backend and cookies remain same-site
    return '/api';
  }

  // In browser production builds, prefer same-origin API so cookie-based sessions work reliably
  // when the frontend is served from the same domain as the backend (e.g., Render).
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }

  return 'https://havennproduction.up.railway.app/api';
};

export const API_BASE_URL = getApiUrl();

// Helper function for making authenticated fetch requests
export const authFetch = (endpoint: string, options: RequestInit = {}) => {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};
