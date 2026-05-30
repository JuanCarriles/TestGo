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
      validation: (Rule) => Rule.required(),
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
      name: 'especialidad',
      title: 'Especialidad (Legacy)',
      type: 'reference',
      to: [{ type: 'especialidad' }],
      hidden: ({ parent }) => Array.isArray(parent?.especialidades) && parent.especialidades.length > 0,
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
      description: 'URL del sistema de turnos para este profesional',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'biografia',
      title: 'Biografía breve',
      type: 'text',
      rows: 4,
      description: 'Máximo 300 caracteres recomendados para tarjetas',
      validation: (Rule) => Rule.required().max(500),
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
