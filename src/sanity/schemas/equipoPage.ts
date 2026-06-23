import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'equipoPage',
  title: 'Página de Equipo',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      group: 'hero',
      type: 'object',
      fields: [
        defineField({
          name: 'badge',
          title: 'Badge',
          type: 'string',
          initialValue: 'Profesionales',
        }),
        defineField({
          name: 'titulo',
          title: 'Título',
          type: 'string',
          initialValue: 'Nuestro',
        }),
        defineField({
          name: 'tituloDestacado',
          title: 'Título Destacado',
          type: 'string',
          initialValue: 'Equipo Médico',
        }),
        defineField({
          name: 'descripcion',
          title: 'Descripción',
          type: 'text',
          rows: 3,
          initialValue: 'Un equipo multidisciplinario de excelencia, comprometido con tu salud y bienestar.',
        }),
        defineField({
          name: 'imagenFondo',
          title: 'Imagen de fondo',
          type: 'image',
          description: 'Recomendado: 1920×1080px (horizontal 16:9). Imagen de fondo del hero.',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
              initialValue: 'Equipo médico',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'hero.titulo',
      subtitle: 'hero.tituloDestacado',
    },
    prepare({ title, subtitle }) {
      return {
        title: `${title || ''} ${subtitle || ''}`.trim() || 'Página de Equipo',
      };
    },
  },
});
