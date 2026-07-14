/**
 * Devuelve la URL de una imagen de Sanity, optimizada usando los parámetros de la CDN.
 */
export function getImageUrl(
  url: string | undefined,
  options?: { w?: number; h?: number; fit?: string; auto?: string }
): string | undefined {
  if (!url) return undefined;
  
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('auto', options?.auto || 'format'); // WebP/AVIF automático por defecto
    
    if (options?.w) urlObj.searchParams.set('w', options.w.toString());
    if (options?.h) urlObj.searchParams.set('h', options.h.toString());
    if (options?.fit) urlObj.searchParams.set('fit', options.fit);
    else if (options?.w && options?.h) urlObj.searchParams.set('fit', 'crop');
    
    return urlObj.toString();
  } catch (e) {
    // Fallback si la URL no es válida
    return url;
  }
}
