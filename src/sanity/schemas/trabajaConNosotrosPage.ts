import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'trabajaConNosotrosPage',
  title: 'Página Trabaja con Nosotros',
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
          initialValue: 'Carreras',
        }),
        defineField({
          name: 'titulo',
          title: 'Título',
          type: 'string',
          initialValue: 'Trabajá con',
        }),
        defineField({
          name: 'tituloDestacado',
          title: 'Título Destacado',
          type: 'string',
          initialValue: 'Nosotros',
        }),
        defineField({
          name: 'descripcion',
          title: 'Descripción',
          type: 'text',
          rows: 3,
          initialValue: 'Formá parte de nuestro equipo de excelencia. Buscamos profesionales apasionados por la salud.',
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
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'stats',
      title: 'Estadísticas',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'numero',
              title: 'Número',
              type: 'string',
            }),
            defineField({
              name: 'etiqueta',
              title: 'Etiqueta',
              type: 'string',
            }),
          ],
        },
      ],
      description: 'Estadísticas que se muestran en la sección de stats.',
    }),
    defineField({
      name: 'formulario',
      title: 'Formulario',
      type: 'object',
      fields: [
        defineField({
          name: 'titulo',
          title: 'Título',
          type: 'string',
          initialValue: 'Postulate',
        }),
        defineField({
          name: 'descripcion',
          title: 'Descripción',
          type: 'text',
          rows: 3,
          initialValue: 'Completá el formulario y nos pondremos en contacto con vos.',
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
        title: `${title || ''} ${subtitle || ''}`.trim() || 'Página Trabaja con Nosotros',
      };
    },
  },
});
