import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// En Astro/Vite (runtime del sitio) usamos import.meta.env
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'your-project-id';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-05-07';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource): string {
  return builder.image(source).auto('format').fit('max').url();
}
