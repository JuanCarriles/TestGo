import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemas';
import { SANITY_CONFIG } from './src/lib/sanityConfig';

export default defineConfig({
  name: 'default',
  title: 'GO Centro Médico',

  projectId: SANITY_CONFIG.projectId,
  dataset: SANITY_CONFIG.dataset,

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
});
