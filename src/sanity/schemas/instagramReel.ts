import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'instagramReel',
  title: 'Reel de Instagram',
  type: 'document',
  description: 'Reel o post de Instagram para mostrar en el carrusel de la home',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título / Descripción',
      type: 'string',
      description: 'Breve descripción del reel. Ej: "Guardia general las 24 horas"',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'url',
      title: 'URL del Reel / Post',
      type: 'url',
      description: 'Link completo del reel o post de Instagram. Ej: https://www.instagram.com/reel/ABC123/',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Imagen thumbnail',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      description: 'Captura de pantalla o imagen representativa del reel. Recomendado: 600x750px (ratio 4:5).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'orden',
      title: 'Orden de aparición',
      type: 'number',
      initialValue: 0,
      description: 'Número para ordenar los reels en el carrusel. Menor número = primero.',
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
      media: 'thumbnail',
    },
  },
});
