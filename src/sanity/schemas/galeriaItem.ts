import { defineField } from 'sanity';

/**
 * Schema auxiliar para imágenes de galería de instalaciones.
 * Se utiliza como array dentro de la página "Nosotros" o documentos.
 */
export default {
  name: 'galeriaItem',
  title: 'Imagen de Galería',
  type: 'image',
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: 'alt',
      title: 'Texto alternativo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titulo',
      title: 'Título de la imagen',
      type: 'string',
    }),
  ],
};
