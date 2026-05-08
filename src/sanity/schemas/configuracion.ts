import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'configuracion',
  title: 'Configuración Global',
  type: 'document',
  fields: [
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp para urgencias',
      type: 'string',
      description: 'Número completo con código de país (sin + ni espacios). Ej: 5491123456789',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'enlaceTurnos',
      title: 'Enlace a sistema de turnos',
      type: 'url',
      description: 'URL general del sistema de turnos',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email de contacto',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'telefono',
      title: 'Teléfono fijo',
      type: 'string',
    }),
    defineField({
      name: 'direccion',
      title: 'Dirección',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mapaUrl',
      title: 'URL del mapa (Google Maps Embed)',
      type: 'url',
      description: 'Copiar la URL de embed desde Google Maps: Compartir → Incorporar un mapa → Copiar HTML → pegar solo la URL del src',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return 'La URL del mapa es requerida';
          if (!value.includes('google.com/maps/embed')) {
            return 'Debe ser una URL de embed de Google Maps (contiene google.com/maps/embed)';
          }
          return true;
        }),
    }),
    defineField({
      name: 'redesSociales',
      title: 'Redes Sociales',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'redSocial',
          fields: [
            defineField({
              name: 'nombre',
              title: 'Nombre',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'Twitter / X', value: 'twitter' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'nombre',
              subtitle: 'url',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'horarios',
      title: 'Horarios de atención',
      type: 'text',
      rows: 3,
      description: 'Ej: Lunes a Viernes de 8:00 a 20:00 hs',
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title (SEO)',
      type: 'string',
      description: 'Título por defecto del sitio',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      rows: 2,
      description: 'Descripción por defecto del sitio',
      validation: (Rule) => Rule.required().max(160),
    }),
  ],
  preview: {
    select: {
      title: 'direccion',
    },
    prepare() {
      return {
        title: 'Configuración Global',
      };
    },
  },
});
