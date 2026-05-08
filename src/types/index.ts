/**
 * Tipos de imagen reutilizables de Sanity
 */
export interface SanityImage {
  asset: {
    _id: string;
    url: string;
  };
  alt: string;
}

/**
 * Especialidad médica
 */
export interface Especialidad {
  _id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  icono?: SanityImage;
}

/**
 * Profesional médico
 */
export interface Profesional {
  _id: string;
  nombre: string;
  slug: string;
  foto?: SanityImage;
  especialidad?: Pick<Especialidad, '_id' | 'nombre' | 'slug'>;
  enlaceAgenda: string;
  biografia: string;
  destacado?: boolean;
}

/**
 * Obra Social
 */
export interface ObraSocial {
  _id: string;
  nombre: string;
  logo?: SanityImage;
}

/**
 * Reseña de paciente
 */
export interface Resena {
  _id: string;
  nombre: string;
  texto: string;
  estrellas: number;
  fecha?: string;
}

/**
 * Red social en configuración global
 */
export interface RedSocial {
  nombre: 'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'twitter';
  url: string;
}

/**
 * Configuración Global del sitio
 */
export interface Configuracion {
  _id: string;
  whatsapp: string;
  enlaceTurnos: string;
  email: string;
  telefono?: string;
  direccion: string;
  mapaUrl: string;
  horarios?: string;
  metaTitle: string;
  metaDescription: string;
  redesSociales?: RedSocial[];
}

/**
 * Props de SEO reutilizables para Layout
 */
export interface SeoProps {
  title: string;
  description: string;
  image?: string;
  pathname?: string;
}
