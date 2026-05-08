/**
 * Configuración centralizada de Sanity.
 * Lee las variables de entorno de forma compatible con Node.js y Vite.
 */

// Para entornos Node.js / build time
const nodeEnv = typeof process !== 'undefined' ? process.env : {};

// Para entornos Vite / navegador (Astro usa import.meta.env)
const viteEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

export const SANITY_CONFIG = {
  projectId: String(
    viteEnv.PUBLIC_SANITY_PROJECT_ID ||
    nodeEnv.PUBLIC_SANITY_PROJECT_ID ||
    viteEnv.SANITY_STUDIO_PROJECT_ID ||
    nodeEnv.SANITY_STUDIO_PROJECT_ID ||
    'your-project-id'
  ),
  dataset: String(
    viteEnv.PUBLIC_SANITY_DATASET ||
    nodeEnv.PUBLIC_SANITY_DATASET ||
    viteEnv.SANITY_STUDIO_DATASET ||
    nodeEnv.SANITY_STUDIO_DATASET ||
    'production'
  ),
  apiVersion: '2024-05-07',
} as const;
