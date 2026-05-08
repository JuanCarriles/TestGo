import type { SchemaTypeDefinition } from 'sanity';

import configuracion from './configuracion';
import especialidad from './especialidad';
import obraSocial from './obraSocial';
import profesional from './profesional';
import resena from './resena';

export const schemaTypes: SchemaTypeDefinition[] = [
  configuracion,
  especialidad,
  profesional,
  obraSocial,
  resena,
];
