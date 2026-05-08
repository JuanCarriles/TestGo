import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemas';

export default defineConfig({
  name: 'default',
  title: 'GO Centro Médico',

  projectId: 'fshm3shk',
  dataset: 'production',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
});
