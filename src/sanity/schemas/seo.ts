import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  description: 'Configuración de SEO para esta página.',
  fields: [
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Título para motores de búsqueda. Máx. 60 caracteres. Si está vacío, se usará el título por defecto.',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      description: 'Descripción para motores de búsqueda. Máx. 160 caracteres.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'seoImage',
      title: 'Imagen OG (Open Graph)',
      type: 'image',
      description: 'Imagen que aparece al compartir en redes sociales. Recomendado: 1200×630px.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'noIndex',
      title: 'No indexar esta página',
      type: 'boolean',
      initialValue: false,
      description: 'Si está activo, Google NO indexará esta página.',
    }),
  ],
});
