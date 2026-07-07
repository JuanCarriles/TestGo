import { defineMiddleware } from 'astro:middleware';

/**
 * Redirecciones 301 globales para SEO y consistencia de URLs.
 *
 * Reglas:
 * 1. Forzar minúsculas en la ruta (ej: /Especialidades → /especialidades)
 * 2. Quitar trailing slash excepto en la raíz (ej: /equipo/ → /equipo)
 * 3. Ignorar archivos estáticos, API routes y Sanity Studio
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

  let redirectUrl: string | null = null;

  // Regla 1: forzar minúsculas
  const lowerPath = pathname.toLowerCase();
  if (pathname !== lowerPath) {
    redirectUrl = lowerPath + search;
  }

  // Regla 2: quitar trailing slash (excepto raíz)
  const targetPath = redirectUrl ? redirectUrl.split('?')[0] : pathname;
  if (targetPath.length > 1 && targetPath.endsWith('/')) {
    const cleanPath = targetPath.slice(0, -1);
    redirectUrl = cleanPath + search;
  }

  if (redirectUrl) {
    return context.redirect(redirectUrl, 301);
  }

  return next();
});
