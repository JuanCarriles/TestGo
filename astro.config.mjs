// @ts-check
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sanity from '@sanity/astro';
import { defineConfig } from 'astro/config';

// Astro inyecta PUBLIC_* en import.meta.env (disponible en config)
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || import.meta.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || import.meta.env.SANITY_STUDIO_DATASET || 'production';

// https://astro.build/config
export default defineConfig({
  site: 'https://gocentromedico.com',
  output: 'server',
  adapter: vercel(),
  vite: {
    optimizeDeps: {
      include: ['sanity', 'react', 'react-dom'],
    },
  },
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
