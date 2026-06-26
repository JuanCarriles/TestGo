import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'profesional',
  title: 'Profesional',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre completo',
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
            `*[_type == "profesional" && slug.current == $slug && _id != $id && !(_id in path("drafts.**"))][0]`,
            { slug: slug.current, id }
          );
          return existing ? 'Este slug ya existe en otro profesional' : true;
        }),
    }),
    defineField({
      name: 'foto',
      title: 'Foto',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          initialValue: 'Foto del profesional médico',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'especialidades',
      title: 'Especialidades',
      type: 'array',
      description: 'Seleccioná una o más especialidades para este profesional.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'especialidad' }],
        },
      ],
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'enlaceAgenda',
      title: 'Enlace a agenda externa',
      type: 'url',
      description: 'URL del sistema de turnos para este profesional (opcional). Si no se completa y hay WhatsApp, el botón "Reservar Turno" abrirá el chat.',
    }),
    defineField({
      name: 'biografia',
      title: 'Biografía breve',
      type: 'text',
      rows: 4,
      description: 'Mínimo 80 caracteres para SEO. Máximo 300 caracteres recomendados para tarjetas.',
      validation: (Rule) => Rule.required().min(80).max(500),
    }),
    defineField({
      name: 'destacado',
      title: 'Destacado en Home',
      type: 'boolean',
      initialValue: false,
      description: 'Marcar para mostrar en la sección de equipo de la home',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook',
      type: 'url',
      description: 'Enlace al perfil de Facebook del profesional (opcional)',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
      description: 'Enlace al perfil de Instagram del profesional (opcional)',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp',
      type: 'string',
      description: 'Número de WhatsApp del profesional con código de país (ej: 5491122334455). Se generará un enlace directo al chat.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      description: 'Configuración SEO específica para la página de perfil de este profesional. Si se deja vacío, se usarán valores por defecto.',
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
          description: 'Si está activo, Google NO indexará la página de este profesional.',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'nombre',
      especialidadNombre: 'especialidad.nombre',
      especialidades: 'especialidades',
      media: 'foto',
    },
    prepare({ title, especialidadNombre, especialidades, media }) {
      const nombres = (especialidades || []).map((e: any) => e.nombre).filter(Boolean);
      const sub = nombres.length > 0 ? nombres.join(', ') : (especialidadNombre || 'Sin especialidad');
      return {
        title: title || 'Sin nombre',
        subtitle: sub,
        media,
      };
    },
  },
});
