// @ts-check
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import { defineConfig } from 'astro/config';

// En Node.js (build-time) usamos process.env
const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id';
const dataset = process.env.PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';

// https://astro.build/config
export default defineConfig({
  site: 'https://gocentromedico.com',
  output: 'static',
  integrations: [
    react(),
    sanity({
      projectId,
      dataset,
      apiVersion: '2024-05-07',
      useCdn: false,
      studioBasePath: '/studio',
    }),
  ],
});
