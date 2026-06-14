import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'especialidadesPage',
  title: 'Página de Especialidades',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({
          name: 'badge',
          title: 'Badge',
          type: 'string',
          initialValue: 'Servicios',
        }),
        defineField({
          name: 'titulo',
          title: 'Título',
          type: 'string',
          initialValue: 'Nuestras',
        }),
        defineField({
          name: 'tituloDestacado',
          title: 'Título Destacado',
          type: 'string',
          initialValue: 'Especialidades',
        }),
        defineField({
          name: 'descripcion',
          title: 'Descripción',
          type: 'text',
          rows: 3,
          initialValue: 'Atención médica integral con los mejores especialistas en cada área de la salud.',
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
              initialValue: 'Especialidades médicas',
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'hero.titulo',
      subtitle: 'hero.tituloDestacado',
    },
    prepare({ title, subtitle }) {
      return {
        title: `${title || ''} ${subtitle || ''}`.trim() || 'Página de Especialidades',
      };
    },
  },
});
