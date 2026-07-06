import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'especialidad',
  title: 'Especialidad',
  type: 'document',
  fields: [
    defineField({
      name: 'activo',
      title: 'Activa / Publicada',
      type: 'boolean',
      initialValue: true,
      description: 'Si se desactiva, la especialidad desaparecerá de los listados y su página devolverá error 404.',
    }),
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'nombre',
        maxLength: 96,
      },
      validation: (Rule) =>
        Rule.required().custom(async (slug, context) => {
          if (!slug?.current) return 'El slug es obligatorio';
          const client = context.getClient({ apiVersion: '2024-05-07' });
          const id = context.document?._id?.replace('drafts.', '') || '';
          const existing = await client.fetch(
            `*[_type == "especialidad" && slug.current == $slug && _id != $id && !(_id in path("drafts.**"))][0]`,
            { slug: slug.current, id }
          );
          return existing ? 'Este slug ya existe en otra especialidad' : true;
        }),
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icono',
      title: 'Icono / Imagen',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
      validation: (Rule) => Rule.required().min(100).max(1000),
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      description: 'Configuración SEO específica para la página de esta especialidad. Si se deja vacío, se usarán valores por defecto.',
      fields: [
        defineField({
          name: 'seoTitle',
          title: 'SEO Title',
          type: 'string',
          description: 'Título para motores de búsqueda. Máx. 60 caracteres.',
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
        }),
        defineField({
          name: 'noIndex',
          title: 'No indexar esta página',
          type: 'boolean',
          initialValue: false,
          description: 'Si está activo, Google NO indexará la página de esta especialidad.',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'nombre',
      media: 'icono',
    },
  },
});
