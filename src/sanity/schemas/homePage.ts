import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homePage',
  title: 'Página de Inicio',
  type: 'document',
  description: 'Contenido editable de la página principal (Hero, Por qué elegirnos, etc.)',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'porQueElegirnos', title: '¿Por qué elegirnos?' },
    { name: 'testimonios', title: 'Testimonios' },
    { name: 'obrasSociales', title: 'Obras Sociales' },
    { name: 'contacto', title: 'Contacto' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── HERO ──
    defineField({
      name: 'hero',
      title: 'Contenido del Hero',
      type: 'object',
      group: 'hero',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
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
          description: 'Imagen de fondo del Hero. Recomendado: 2000x1200px mínimo.',
        }),
        defineField({
          name: 'badge',
          title: 'Etiqueta superior (Badge)',
          type: 'string',
          description: 'Texto pequeño que aparece arriba del título principal. Ej: "Atención médica 24/7"',
          validation: (Rule) => Rule.required().max(50),
          initialValue: 'Atención médica 24/7',
        }),
        defineField({
          name: 'titulo',
          title: 'Título principal',
          type: 'string',
          description: 'Título del Hero. Usá \\n para forzar un salto de línea. Ej: "Tu salud,\\nnuestra prioridad"',
          validation: (Rule) => Rule.required().max(100),
          initialValue: 'Tu salud,\nnuestra prioridad',
        }),
        defineField({
          name: 'tituloDestacado',
          title: 'Parte destacada del título',
          type: 'string',
          description: 'Palabra(s) del título que se mostrarán con color gradiente. Deben coincidir exactamente con el texto del título. Ej: "nuestra prioridad"',
          validation: (Rule) => Rule.required(),
          initialValue: 'nuestra prioridad',
        }),
        defineField({
          name: 'descripcion',
          title: 'Descripción / Subtítulo',
          type: 'text',
          rows: 3,
          description: 'Texto descriptivo debajo del título.',
          validation: (Rule) => Rule.required().max(300),
          initialValue: 'Atención médica de alta gama con los mejores profesionales y tecnología de vanguardia. Agenda tu consulta de forma rápida y segura.',
        }),
        defineField({
          name: 'ctaPrimario',
          title: 'Botón primario (CTA)',
          type: 'object',
          description: 'Botón principal del Hero (generalmente para reservar turnos)',
          fields: [
            defineField({
              name: 'texto',
              title: 'Texto del botón',
              type: 'string',
              validation: (Rule) => Rule.required(),
              initialValue: 'Reservar Turno',
            }),
            defineField({
              name: 'usarEnlaceTurnos',
              title: 'Usar enlace de turnos global',
              type: 'boolean',
              description: 'Si está activo, usa el enlace de turnos configurado en Configuración Global. Si no, usa el enlace personalizado abajo.',
              initialValue: true,
            }),
            defineField({
              name: 'enlacePersonalizado',
              title: 'Enlace personalizado',
              type: 'url',
              description: 'Solo se usa si "Usar enlace de turnos global" está desactivado.',
            }),
          ],
        }),
        defineField({
          name: 'ctaSecundario',
          title: 'Botón secundario',
          type: 'object',
          description: 'Botón secundario del Hero',
          fields: [
            defineField({
              name: 'texto',
              title: 'Texto del botón',
              type: 'string',
              validation: (Rule) => Rule.required(),
              initialValue: 'Ver Especialidades',
            }),
            defineField({
              name: 'enlace',
              title: 'Enlace',
              type: 'string',
              description: 'Puede ser una ruta interna (ej: /especialidades) o URL externa.',
              validation: (Rule) => Rule.required(),
              initialValue: '/especialidades',
            }),
          ],
        }),
        defineField({
          name: 'imagenesTarjeta',
          title: 'Imágenes del carrusel lateral',
          type: 'array',
          description: 'Imágenes para la tarjeta lateral del Hero. Si cargás 1 imagen, aparece estática. Si cargás 2 o más, se activa el carrusel automático. Recomendado: 800x1000px (ratio 4:5 vertical).',
          of: [
            {
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
            },
          ],
          validation: (Rule) => Rule.max(6),
        }),
        defineField({
          name: 'estadisticas',
          title: 'Estadísticas / Métricas',
          type: 'array',
          description: 'Cuatro métricas que aparecen debajo del Hero.',
          of: [
            {
              type: 'object',
              name: 'estadistica',
              fields: [
                defineField({
                  name: 'numero',
                  title: 'Número / Valor',
                  type: 'string',
                  description: 'Ej: +50, 24/7, +10k',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'etiqueta',
                  title: 'Etiqueta',
                  type: 'string',
                  description: 'Ej: Especialistas, Especialidades, Atención, Pacientes',
                  validation: (Rule) => Rule.required(),
                }),
              ],
              preview: {
                select: {
                  title: 'numero',
                  subtitle: 'etiqueta',
                },
              },
            },
          ],
          validation: (Rule) => Rule.required().min(1).max(6),
        }),
      ],
    }),

    // ── POR QUÉ ELEGIRNOS ──
    defineField({
      name: 'porQueElegirnos',
      title: 'Contenido de la sección',
      type: 'object',
      group: 'porQueElegirnos',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'imagenes',
          title: 'Imágenes del carrusel lateral',
          type: 'array',
          description: 'Varias imágenes para el carrusel de la sección "Por qué elegirnos". Si cargás 1 imagen, aparece estática. Si cargás 2 o más, se activa el carrusel automático. Recomendado: 800x1000px (ratio 4:5 vertical).',
          of: [
            {
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
            },
          ],
          validation: (Rule) => Rule.max(6),
        }),
        defineField({
          name: 'badge',
          title: 'Etiqueta superior',
          type: 'string',
          description: 'Texto pequeño arriba del título. Ej: "Ventajas"',
          validation: (Rule) => Rule.required().max(30),
          initialValue: 'Ventajas',
        }),
        defineField({
          name: 'titulo',
          title: 'Título',
          type: 'string',
          description: 'Título de la sección. Usá \\n para saltos de línea.',
          validation: (Rule) => Rule.required().max(80),
          initialValue: '¿Por qué elegirnos?',
        }),
        defineField({
          name: 'tituloDestacado',
          title: 'Parte destacada del título',
          type: 'string',
          description: 'Palabra(s) que se mostrarán con color gradiente. Debe coincidir exactamente.',
          validation: (Rule) => Rule.required(),
          initialValue: 'elegirnos',
        }),
        defineField({
          name: 'descripcion',
          title: 'Descripción',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required().max(300),
          initialValue: 'Nos diferenciamos por nuestra dedicación, tecnología y compromiso con la salud de cada paciente.',
        }),
        defineField({
          name: 'features',
          title: 'Características / Ventajas',
          type: 'array',
          description: 'Tarjetas de características (máximo 6).',
          of: [
            {
              type: 'object',
              name: 'feature',
              fields: [
                defineField({
                  name: 'icono',
                  title: 'Icono',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Reloj (Atención 24/7)', value: 'clock' },
                      { title: 'Monitor (Tecnología)', value: 'monitor' },
                      { title: 'Usuario (Profesionales)', value: 'user' },
                      { title: 'Calendario (Turnos)', value: 'calendar' },
                      { title: 'Edificio (Instalaciones)', value: 'building' },
                      { title: 'Escudo (Obras Sociales)', value: 'shield' },
                      { title: 'Corazón (Salud)', value: 'heart' },
                      { title: 'Estrella (Calidad)', value: 'star' },
                      { title: 'Teléfono (Contacto)', value: 'phone' },
                      { title: 'Ubicación (Ubicación)', value: 'location' },
                    ],
                  },
                  validation: (Rule) => Rule.required(),
                }),
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
                  validation: (Rule) => Rule.required().max(200),
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
          validation: (Rule) => Rule.required().min(1).max(6),
        }),
        defineField({
          name: 'tarjetaFlotante',
          title: 'Tarjeta flotante',
          type: 'object',
          description: 'Tarjeta pequeña que aparece flotando sobre la imagen.',
          fields: [
            defineField({
              name: 'numero',
              title: 'Número / Valor',
              type: 'string',
              validation: (Rule) => Rule.required(),
              initialValue: '+15 años',
            }),
            defineField({
              name: 'etiqueta',
              title: 'Etiqueta',
              type: 'string',
              validation: (Rule) => Rule.required(),
              initialValue: 'de trayectoria médica',
            }),
          ],
        }),
      ],
    }),

    // ── TESTIMONIOS ──
    defineField({
      name: 'testimonios',
      title: 'Testimonios de pacientes',
      type: 'array',
      group: 'testimonios',
      description: 'Reseñas que aparecen en la sección de testimonios de la página de inicio.',
      of: [
        {
          type: 'object',
          name: 'testimonio',
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
              rows: 3,
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
          ],
          preview: {
            select: {
              title: 'nombre',
              subtitle: 'texto',
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),

    // ── OBRAS SOCIALES ──
    defineField({
      name: 'obrasSociales',
      title: 'Obras Sociales Aceptadas',
      type: 'array',
      group: 'obrasSociales',
      description: 'Logos de obras sociales y prepagas que aparecen en la página de inicio.',
      of: [
        {
          type: 'object',
          name: 'obraSocial',
          fields: [
            defineField({
              name: 'nombre',
              title: 'Nombre',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Texto alternativo',
                  type: 'string',
                  initialValue: 'Logo de obra social',
                  validation: (Rule) => Rule.required(),
                }),
              ],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'nombre',
              media: 'logo',
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(12),
    }),
    defineField({
      name: 'contacto',
      title: 'Sección de Contacto',
      type: 'object',
      group: 'contacto',
      fields: [
        defineField({
          name: 'badge',
          title: 'Etiqueta superior',
          type: 'string',
          validation: (Rule) => Rule.required().max(30),
          initialValue: 'Contacto',
        }),
        defineField({
          name: 'titulo',
          title: 'Título',
          type: 'string',
          validation: (Rule) => Rule.required().max(80),
          initialValue: 'Estamos aquí para vos',
        }),
        defineField({
          name: 'tituloDestacado',
          title: 'Parte destacada del título',
          type: 'string',
          validation: (Rule) => Rule.required(),
          initialValue: 'para vos',
        }),
        defineField({
          name: 'descripcion',
          title: 'Descripción',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required().max(300),
          initialValue: 'Visitá nuestras instalaciones o contactanos por cualquiera de nuestros canales. Tu salud es nuestra prioridad.',
        }),
        defineField({
          name: 'mapaUrl',
          title: 'URL del mapa (Google Maps Embed)',
          type: 'url',
          description: 'Copiar la URL de embed desde Google Maps: Compartir → Incorporar un mapa → Copiar HTML → pegar solo la URL del src',
        }),
        defineField({
          name: 'botonTexto',
          title: 'Texto del botón',
          type: 'string',
          validation: (Rule) => Rule.required().max(30),
          initialValue: 'Reservar Turno',
        }),
        defineField({
          name: 'botonEnlace',
          title: 'Enlace del botón',
          type: 'string',
          description: 'Seleccioná a qué página del sitio lleva el botón.',
          options: {
            list: [
              { title: 'Inicio', value: '/' },
              { title: 'Equipo médico', value: '/equipo' },
              { title: 'Especialidades', value: '/especialidades' },
              { title: 'Nosotros', value: '/nosotros' },
              { title: 'Trabajá en Go', value: '/trabaja-con-nosotros' },
            ],
            layout: 'dropdown',
          },
          initialValue: '/equipo',
        }),
        defineField({
          name: 'items',
          title: 'Datos de contacto',
          type: 'array',
          description: 'Agregá todos los datos de contacto que quieras mostrar (teléfono, email, dirección, horarios, WhatsApp, etc.). El cliente puede agregar, quitar o reordenar items.',
          of: [
            {
              type: 'object',
              name: 'itemContacto',
              fields: [
                defineField({
                  name: 'icono',
                  title: 'Icono',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Ubicación / Mapa', value: 'location' },
                      { title: 'Teléfono', value: 'phone' },
                      { title: 'Email / Correo', value: 'mail' },
                      { title: 'Reloj / Horarios', value: 'clock' },
                      { title: 'WhatsApp', value: 'whatsapp' },
                      { title: 'Edificio / Instalaciones', value: 'building' },
                      { title: 'Escudo / Seguros', value: 'shield' },
                      { title: 'Corazón / Salud', value: 'heart' },
                    ],
                  },
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'label',
                  title: 'Título del dato',
                  type: 'string',
                  description: 'Ej: Dirección, Teléfono, Email, Horarios, WhatsApp',
                  validation: (Rule) => Rule.required().max(50),
                }),
                defineField({
                  name: 'valor',
                  title: 'Valor / Texto a mostrar',
                  type: 'string',
                  description: 'Ej: Av. Siempre Viva 123, +54 9 381 1234567, info@ejemplo.com',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'enlace',
                  title: 'Enlace (opcional)',
                  type: 'string',
                  description: 'Si el item es clickeable, agregá el enlace. Ejemplos: tel:+543811234567, mailto:info@ejemplo.com, https://wa.me/...',
                }),
              ],
              preview: {
                select: {
                  title: 'label',
                  subtitle: 'valor',
                },
              },
            },
          ],
        }),
        defineField({
          name: 'redesSociales',
          title: 'Redes sociales',
          type: 'array',
          description: 'Links a redes sociales que aparecen en la sección de contacto.',
          of: [
            {
              type: 'object',
              name: 'redSocialContacto',
              fields: [
                defineField({
                  name: 'nombre',
                  title: 'Red social',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Instagram', value: 'instagram' },
                      { title: 'Facebook', value: 'facebook' },
                      { title: 'LinkedIn', value: 'linkedin' },
                      { title: 'YouTube', value: 'youtube' },
                      { title: 'Twitter / X', value: 'twitter' },
                      { title: 'TikTok', value: 'tiktok' },
                    ],
                    layout: 'dropdown',
                  },
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'url',
                  title: 'URL del perfil',
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
        title: 'Página de Inicio',
        subtitle: 'Contenido editable de la home',
      };
    },
  },
});
