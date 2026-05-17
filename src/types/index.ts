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
  facebook?: string;
  instagram?: string;
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
 * Feature de "Por qué elegirnos"
 */
export interface Feature {
  icono: string;
  titulo: string;
  descripcion: string;
}

/**
 * Testimonio de paciente dentro de homePage
 */
export interface Testimonio {
  nombre: string;
  texto: string;
  estrellas: number;
  fecha?: string;
}

/**
 * Obra Social dentro de homePage
 */
export interface ObraSocial {
  nombre: string;
  logo?: SanityImage;
}

/**
 * Contenido editable de la Página de Inicio
 */
export interface HomePage {
  _id: string;
  hero: {
    imagenFondo?: SanityImage;
    badge: string;
    titulo: string;
    tituloDestacado: string;
    descripcion: string;
    ctaPrimario: {
      texto: string;
      usarEnlaceTurnos: boolean;
      enlacePersonalizado?: string;
    };
    ctaSecundario: {
      texto: string;
      enlace: string;
    };
    imagenTarjeta?: SanityImage;
    estadisticas: {
      numero: string;
      etiqueta: string;
    }[];
  };
  porQueElegirnos: {
    imagen?: SanityImage;
    badge: string;
    titulo: string;
    tituloDestacado: string;
    descripcion: string;
    features: Feature[];
    tarjetaFlotante: {
      numero: string;
      etiqueta: string;
    };
  };
  testimonios?: Testimonio[];
  obrasSociales?: ObraSocial[];
}

/**
 * Valor de la página Nosotros
 */
export interface Valor {
  titulo: string;
  descripcion: string;
}

/**
 * Imagen de galería
 */
export interface ImagenGaleria {
  imagen?: SanityImage;
  titulo: string;
}

/**
 * Contenido editable de la Página Nosotros
 */
export interface NosotrosPage {
  _id: string;
  hero: {
    badge: string;
    titulo: string;
    tituloDestacado: string;
    imagenFondo?: SanityImage;
  };
  historia: {
    imagen?: SanityImage;
    badge: string;
    titulo: string;
    tituloDestacado: string;
    parrafos: string[];
    tarjetaFlotante: {
      numero: string;
      etiqueta: string;
    };
  };
  misionVision: {
    mision: {
      titulo: string;
      descripcion: string;
    };
    vision: {
      titulo: string;
      descripcion: string;
    };
  };
  valores: {
    badge: string;
    titulo: string;
    tituloDestacado: string;
    descripcion: string;
    items: Valor[];
  };
  galeria: {
    badge: string;
    titulo: string;
    tituloDestacado: string;
    imagenes: ImagenGaleria[];
  };
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
