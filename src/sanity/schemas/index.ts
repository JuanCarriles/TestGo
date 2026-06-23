import type { SchemaTypeDefinition } from 'sanity';

import configuracion from './configuracion';
import especialidad from './especialidad';
import equipoPage from './equipoPage';
import especialidadesPage from './especialidadesPage';
import homePage from './homePage';
import instagramReel from './instagramReel';
import nosotrosPage from './nosotrosPage';
import profesional from './profesional';
import resena from './resena';
import seo from './seo';
import trabajaConNosotrosPage from './trabajaConNosotrosPage';

export const schemaTypes: SchemaTypeDefinition[] = [
  configuracion,
  homePage,
  equipoPage,
  especialidadesPage,
  especialidad,
  profesional,
  nosotrosPage,
  trabajaConNosotrosPage,
  instagramReel,
  resena,
  seo,
];
