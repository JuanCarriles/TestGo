/**
 * Devuelve la URL de una imagen de Sanity.
 * TODO: implementar WebP con @sanity/image-url cuando se verifique compatibilidad.
 */
export function getImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  // Por ahora devolvemos la URL sin modificar para evitar problemas con el CDN de Sanity
  return url;
}
