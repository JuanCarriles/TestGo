import type { SchemaTypeDefinition } from 'sanity';

import configuracion from './configuracion';
import especialidad from './especialidad';
import homePage from './homePage';
import instagramReel from './instagramReel';
import nosotrosPage from './nosotrosPage';
import profesional from './profesional';

export const schemaTypes: SchemaTypeDefinition[] = [
  configuracion,
  homePage,
  especialidad,
  profesional,
  nosotrosPage,
  instagramReel,
];
