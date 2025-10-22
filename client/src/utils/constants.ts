// Application constants
export const APP_NAME = 'WebRTC Playground';
export const APP_VERSION = '1.0.0';

// API endpoints (when you add a backend)
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.webrtcplayground.com' 
  : 'http://localhost:3001';

// WebRTC configuration
export const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

// Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  NOT_FOUND: '*'
} as const;
