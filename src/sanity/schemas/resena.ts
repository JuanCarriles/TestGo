import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'resena',
  title: 'Reseña de Paciente',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre del paciente',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'texto',
      title: 'Texto de la reseña',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(20).max(500),
    }),
    defineField({
      name: 'estrellas',
      title: 'Estrellas',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
      initialValue: 5,
    }),
    defineField({
      name: 'fecha',
      title: 'Fecha',
      type: 'date',
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'aprobada',
      title: 'Aprobada para mostrar',
      type: 'boolean',
      initialValue: false,
      description: 'Solo las reseñas aprobadas aparecerán en la web',
    }),
  ],
  preview: {
    select: {
      title: 'nombre',
      subtitle: 'texto',
    },
  },
});
