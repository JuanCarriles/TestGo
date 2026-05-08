// @ts-check
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import { defineConfig } from 'astro/config';
import { SANITY_CONFIG } from './src/lib/sanityConfig';

// https://astro.build/config
export default defineConfig({
  site: 'https://gocentromedico.com',
  output: 'static',
  integrations: [
    react(),
    sanity({
      projectId: SANITY_CONFIG.projectId,
      dataset: SANITY_CONFIG.dataset,
      apiVersion: SANITY_CONFIG.apiVersion,
      useCdn: false,
      studioBasePath: '/studio',
    }),
  ],
});
