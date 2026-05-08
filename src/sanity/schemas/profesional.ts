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
      title: 'Especialidad',
      type: 'reference',
      to: [{ type: 'especialidad' }],
      validation: (Rule) => Rule.required(),
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
  ],
  preview: {
    select: {
      title: 'nombre',
      subtitle: 'especialidad.nombre',
      media: 'foto',
    },
  },
});
