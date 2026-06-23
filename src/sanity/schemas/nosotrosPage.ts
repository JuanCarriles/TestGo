import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'nosotrosPage',
  title: 'Página Nosotros',
  type: 'document',
  description: 'Contenido editable de la página Nosotros',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'historia', title: 'Historia' },
    { name: 'misionVision', title: 'Misión y Visión' },
    { name: 'valores', title: 'Valores' },
    { name: 'galeria', title: 'Galería' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── HERO ──
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({
          name: 'badge',
          title: 'Etiqueta superior',
          type: 'string',
          validation: (Rule) => Rule.required().max(50),
          initialValue: 'Sobre Nosotros',
        }),
        defineField({
          name: 'titulo',
          title: 'Título',
          type: 'string',
          validation: (Rule) => Rule.required().max(100),
          initialValue: 'Una historia de excelencia médica',
        }),
        defineField({
          name: 'tituloDestacado',
          title: 'Parte destacada del título',
          type: 'string',
          validation: (Rule) => Rule.required(),
          initialValue: 'excelencia médica',
        }),
        defineField({
          name: 'imagenFondo',
          title: 'Imagen de fondo',
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
        }),
      ],
    }),

    // ── HISTORIA ──
    defineField({
      name: 'historia',
      title: 'Historia',
      type: 'object',
      group: 'historia',
      fields: [
        defineField({
          name: 'imagen',
          title: 'Imagen principal',
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
        }),
        defineField({
          name: 'badge',
          title: 'Etiqueta superior',
          type: 'string',
          validation: (Rule) => Rule.required().max(50),
          initialValue: 'Nuestra Historia',
        }),
        defineField({
          name: 'titulo',
          title: 'Título',
          type: 'string',
          validation: (Rule) => Rule.required().max(100),
          initialValue: 'Más de una década cuidando de la comunidad',
        }),
        defineField({
          name: 'tituloDestacado',
          title: 'Parte destacada del título',
          type: 'string',
          validation: (Rule) => Rule.required(),
          initialValue: 'cuidando',
        }),
        defineField({
          name: 'parrafos',
          title: 'Párrafos',
          type: 'array',
          of: [{ type: 'text', rows: 3 }],
          validation: (Rule) => Rule.required().min(1).max(5),
        }),
        defineField({
          name: 'tarjetaFlotante',
          title: 'Tarjeta flotante',
          type: 'object',
          fields: [
            defineField({
              name: 'numero',
              title: 'Número / Valor',
              type: 'string',
              validation: (Rule) => Rule.required(),
              initialValue: '15+',
            }),
            defineField({
              name: 'etiqueta',
              title: 'Etiqueta',
              type: 'string',
              validation: (Rule) => Rule.required(),
              initialValue: 'Años de trayectoria',
            }),
          ],
        }),
      ],
    }),

    // ── MISIÓN Y VISIÓN ──
    defineField({
      name: 'misionVision',
      title: 'Misión y Visión',
      type: 'object',
      group: 'misionVision',
      fields: [
        defineField({
          name: 'mision',
          title: 'Misión',
          type: 'object',
          fields: [
            defineField({
              name: 'titulo',
              title: 'Título',
              type: 'string',
              validation: (Rule) => Rule.required(),
              initialValue: 'Misión',
            }),
            defineField({
              name: 'descripcion',
              title: 'Descripción',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
        defineField({
          name: 'vision',
          title: 'Visión',
          type: 'object',
          fields: [
            defineField({
              name: 'titulo',
              title: 'Título',
              type: 'string',
              validation: (Rule) => Rule.required(),
              initialValue: 'Visión',
            }),
            defineField({
              name: 'descripcion',
              title: 'Descripción',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),

    // ── VALORES ──
    defineField({
      name: 'valores',
      title: 'Valores',
      type: 'object',
      group: 'valores',
      fields: [
        defineField({
          name: 'badge',
          title: 'Etiqueta superior',
          type: 'string',
          validation: (Rule) => Rule.required().max(50),
          initialValue: 'Principios',
        }),
        defineField({
          name: 'titulo',
          title: 'Título',
          type: 'string',
          validation: (Rule) => Rule.required().max(100),
          initialValue: 'Nuestros Valores',
        }),
        defineField({
          name: 'tituloDestacado',
          title: 'Parte destacada del título',
          type: 'string',
          validation: (Rule) => Rule.required(),
          initialValue: 'Valores',
        }),
        defineField({
          name: 'descripcion',
          title: 'Descripción',
          type: 'text',
          rows: 2,
          validation: (Rule) => Rule.required().max(300),
          initialValue: 'Los pilares que guían cada decisión y acción en GO Centro Médico.',
        }),
        defineField({
          name: 'items',
          title: 'Valores',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'valor',
              fields: [
                defineField({
                  name: 'titulo',
                  title: 'Título',
                  type: 'string',
                  validation: (Rule) => Rule.required().max(50),
                }),
                defineField({
                  name: 'descripcion',
                  title: 'Descripción',
                  type: 'text',
                  rows: 2,
                  validation: (Rule) => Rule.required().max(300),
                }),
              ],
              preview: {
                select: {
                  title: 'titulo',
                  subtitle: 'descripcion',
                },
              },
            },
          ],
          validation: (Rule) => Rule.required().min(1).max(8),
        }),
      ],
    }),

    // ── GALERÍA ──
    defineField({
      name: 'galeria',
      title: 'Galería',
      type: 'object',
      group: 'galeria',
      fields: [
        defineField({
          name: 'badge',
          title: 'Etiqueta superior',
          type: 'string',
          validation: (Rule) => Rule.required().max(50),
          initialValue: 'Instalaciones',
        }),
        defineField({
          name: 'titulo',
          title: 'Título',
          type: 'string',
          validation: (Rule) => Rule.required().max(100),
          initialValue: 'Conocé nuestras instalaciones',
        }),
        defineField({
          name: 'tituloDestacado',
          title: 'Parte destacada del título',
          type: 'string',
          validation: (Rule) => Rule.required(),
          initialValue: 'instalaciones',
        }),
        defineField({
          name: 'imagenes',
          title: 'Imágenes',
          type: 'array',
          description: 'Imágenes de la galería (recomendado: 600x450px, ratio 4:3)',
          of: [
            {
              type: 'object',
              name: 'imagenGaleria',
              fields: [
                defineField({
                  name: 'imagen',
                  title: 'Imagen',
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
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'titulo',
                  title: 'Título',
                  type: 'string',
                  validation: (Rule) => Rule.required().max(50),
                }),
              ],
              preview: {
                select: {
                  title: 'titulo',
                  media: 'imagen',
                },
              },
            },
          ],
          validation: (Rule) => Rule.required().min(1).max(9),
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Página Nosotros',
        subtitle: 'Contenido de la página Nosotros',
      };
    },
  },
});
