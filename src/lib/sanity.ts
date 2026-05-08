import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { SANITY_CONFIG } from './sanityConfig';

const { projectId, dataset, apiVersion } = SANITY_CONFIG;

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
