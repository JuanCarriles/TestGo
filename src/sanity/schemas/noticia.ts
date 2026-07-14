import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'noticia',
  title: 'Noticias',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'titulo',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fecha',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imagenPrincipal',
      title: 'Imagen Principal',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto Alternativo',
          description: 'Importante para SEO y accesibilidad.',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'resumen',
      title: 'Resumen',
      type: 'text',
      rows: 3,
      description: 'Un breve resumen que aparecerá en la tarjeta del carrusel (max 150 caracteres sugeridos).',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'contenido',
      title: 'Contenido completo',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texto Alternativo',
            }
          ]
        }
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'destacada',
      title: 'Noticia Destacada',
      type: 'boolean',
      description: 'Marcar para dar prioridad de visualización en el carrusel.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
      subtitle: 'fecha',
      media: 'imagenPrincipal',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString('es-AR') : '',
        media,
      };
    },
  },
});
