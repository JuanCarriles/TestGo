import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'configuracion',
  title: 'Configuración Global',
  type: 'document',
  groups: [
    { name: 'general', title: 'General' },
    { name: 'contacto', title: 'Contacto' },
    { name: 'turnos', title: 'Turnos y Estudios' },
    { name: 'mapa', title: 'Mapa' },
    { name: 'redes', title: 'Redes Sociales' },
    { name: 'seo', title: 'SEO' },
    { name: 'google', title: 'Google (LocalBusiness)' },
  ],
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo de la empresa',
      type: 'image',
      group: 'general',
      description: 'Se usará en el navbar, footer y favicon. Recomendado: formato cuadrado (SVG o PNG con fondo transparente)',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          initialValue: 'Logo GO Centro Médico',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'email',
      title: 'Email de contacto',
      type: 'string',
      group: 'contacto',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'telefono',
      title: 'Teléfono fijo',
      type: 'string',
      group: 'contacto',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp para urgencias',
      type: 'string',
      group: 'contacto',
      description: 'Número completo con código de país (sin + ni espacios). Ej: 5491123456789',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'direccion',
      title: 'Dirección',
      type: 'string',
      group: 'contacto',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'horarios',
      title: 'Horarios de atención (texto)',
      type: 'text',
      group: 'contacto',
      rows: 3,
      description: 'Texto libre que se muestra en el sitio. Ej: Lunes a Viernes de 8:00 a 20:00 hs',
    }),
    defineField({
      name: 'enlaceTurnos',
      title: 'Enlace a Resultados de Estudios',
      type: 'url',
      group: 'turnos',
      description: 'URL del portal de resultados de estudios (ej: MedExis)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'enlaceReservarTurno',
      title: 'Enlace para Reservar Turno',
      type: 'url',
      group: 'turnos',
      description: 'URL a la que lleva el botón "Reservar Turno". Por defecto: /equipo',
      initialValue: '/equipo',
    }),
    defineField({
      name: 'mapaUrl',
      title: 'URL del mapa (Google Maps Embed)',
      type: 'url',
      group: 'mapa',
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
      group: 'redes',
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
      name: 'metaTitle',
      title: 'Meta Title (SEO)',
      type: 'string',
      group: 'seo',
      description: 'Título por defecto del sitio. Aparece en Google y en el schema del negocio.',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      group: 'seo',
      rows: 2,
      description: 'Descripción por defecto del sitio. Aparece en Google y en el schema del negocio.',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagen Open Graph por defecto',
      type: 'image',
      group: 'seo',
      description: 'Imagen que aparece al compartir el sitio en redes sociales (Facebook, WhatsApp, etc.). Recomendado: 1200×630px.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          initialValue: 'GO Centro Médico',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'linkSugerencias',
      title: 'Link de sugerencias / consultas',
      type: 'object',
      group: 'general',
      description: 'Si se completa, aparecerá un botón en el footer de la página para que los usuarios dejen sugerencias o consultas.',
      fields: [
        defineField({
          name: 'texto',
          title: 'Texto del botón',
          type: 'string',
          description: 'Ej: Déjanos tu sugerencia, Envianos tu consulta, Contactanos',
          initialValue: 'Déjanos tu sugerencia',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'url',
          title: 'URL del formulario',
          type: 'url',
          description: 'Link externo al formulario de consultas/sugerencias.',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'localBusiness',
      title: 'Datos para Google (LocalBusiness schema)',
      type: 'object',
      group: 'google',
      description: 'Coordenadas GPS, horarios y link del mapa para el schema de Google.',
      fields: [
        defineField({
          name: 'latitud',
          title: 'Latitud',
          type: 'number',
          description: 'Coordenada de latitud. Ej: -26.8241',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'longitud',
          title: 'Longitud',
          type: 'number',
          description: 'Coordenada de longitud. Ej: -65.2226',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'mapaUrlPublica',
          title: 'URL pública de Google Maps',
          type: 'url',
          description: 'Link público de la ubicación en Google Maps (no el embed). Ej: https://maps.app.goo.gl/xxxxx',
        }),
        defineField({
          name: 'horarios',
          title: 'Horarios de atención',
          type: 'array',
          description: 'Horarios estructurados para el schema de Google. Agregá una fila por rango de días.',
          of: [
            {
              type: 'object',
              name: 'horario',
              fields: [
                defineField({
                  name: 'dias',
                  title: 'Días',
                  type: 'string',
                  description: 'Ej: Monday, Tuesday, Wednesday, Thursday, Friday',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'abre',
                  title: 'Abre',
                  type: 'string',
                  description: 'Formato 24hs. Ej: 08:00',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'cierra',
                  title: 'Cierra',
                  type: 'string',
                  description: 'Formato 24hs. Ej: 20:00',
                  validation: (Rule) => Rule.required(),
                }),
              ],
              preview: {
                select: {
                  title: 'dias',
                  subtitle: 'abre',
                },
                prepare({ title, subtitle }) {
                  return {
                    title,
                    subtitle: `Abre: ${subtitle}`,
                  };
                },
              },
            },
          ],
        }),
      ],
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
