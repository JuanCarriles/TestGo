import { defineMiddleware } from 'astro:middleware';

/**
 * Redirecciones 301 globales para SEO y consistencia de URLs.
 *
 * Reglas:
 * 1. Forzar minúsculas en la ruta (ej: /Especialidades → /especialidades)
 * 2. Ignorar archivos estáticos, API routes y Sanity Studio
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname, search } = context.url;

  // Ignorar archivos estáticos, API y Studio
  const isStaticFile = pathname.match(/\.(?:js|css|png|jpg|jpeg|gif|svg|webp|ico|json|xml|txt|pdf|doc|docx|xls|xlsx)$/i);
  const isApiRoute = pathname.startsWith('/api/');
  const isStudio = pathname.startsWith('/studio');

  if (isStaticFile || isApiRoute || isStudio) {
    return next();
  }

  // Regla 1: forzar minúsculas
  const lowerPath = pathname.toLowerCase();
  if (pathname !== lowerPath) {
    return context.redirect(lowerPath + search, 301);
  }

  return next();
});
