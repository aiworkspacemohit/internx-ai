/**
 * InternX AI - Centralized Frontend Environment Configuration
 * Provides sanitized, validated environment settings with safe fallbacks.
 */

const getEnv = (key, defaultValue = '') => {
  return import.meta.env[key] !== undefined && import.meta.env[key] !== ''
    ? import.meta.env[key]
    : defaultValue;
};

export const ENV = {
  // API Endpoints & Base URLs
  API_BASE_URL: (getEnv('VITE_API_BASE_URL') || '/api/v1').replace(/\/+$/, ''),
  BACKEND_URL: (getEnv('VITE_BACKEND_URL') || 'http://127.0.0.1:8000').replace(/\/+$/, ''),
  FRONTEND_URL: (getEnv('VITE_FRONTEND_URL') || 'http://localhost:5173').replace(/\/+$/, ''),

  // App Metadata
  APP_TITLE: getEnv('VITE_APP_TITLE', 'InternX AI - Placement & Internship Portal'),
  ENVIRONMENT: getEnv('VITE_ENVIRONMENT', 'development'),

  // Cloud Services & Limits
  CLOUDINARY_CLOUD_NAME: getEnv('VITE_CLOUDINARY_CLOUD_NAME', 'ddpcxdd1a'),
  MAX_UPLOAD_SIZE_MB: Number(getEnv('VITE_MAX_UPLOAD_SIZE_MB', '10')),

  // Feature Flags
  ENABLE_EMAIL_ALERTS: getEnv('VITE_ENABLE_EMAIL_ALERTS', 'true') === 'true',
  ENABLE_OTP_VERIFICATION: getEnv('VITE_ENABLE_OTP_VERIFICATION', 'true') === 'true',
  ENABLE_AI_FEATURES: getEnv('VITE_ENABLE_AI_FEATURES', 'true') === 'true',
};

export default ENV;
