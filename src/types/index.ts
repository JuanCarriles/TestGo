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
  seo?: Seo;
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
  especialidades?: Pick<Especialidad, '_id' | 'nombre' | 'slug'>[];
  enlaceAgenda: string;
  biografia: string;
  destacado?: boolean;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  seo?: Seo;
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
  logo?: SanityImage;
  whatsapp: string;
  enlaceTurnos: string;
  enlaceReservarTurno?: string;
  email: string;
  telefono?: string;
  direccion: string;
  mapaUrl: string;
  horarios?: string;
  metaTitle: string;
  metaDescription: string;
  ogImage?: SanityImage;
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
  orden?: number;
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
    imagenesTarjeta?: SanityImage[];
    estadisticas: {
      numero: string;
      etiqueta: string;
    }[];
  };
  especialidadesGrid?: {
    badge: string;
    titulo: string;
    tituloDestacado: string;
    descripcion: string;
  };
  porQueElegirnos: {
    imagenes?: SanityImage[];
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
  obrasSocialesBadge?: string;
  obrasSocialesTitulo?: string;
  obrasSocialesTituloDestacado?: string;
  obrasSocialesDescripcion?: string;
  obrasSocialesBotonTexto?: string;
  obrasSocialesBotonEnlace?: string;
  contacto?: {
    badge: string;
    titulo: string;
    tituloDestacado: string;
    descripcion: string;
    mapaUrl?: string;
    botonTexto: string;
    botonEnlace?: string;
    items: {
      icono: string;
      label: string;
      valor: string;
      enlace?: string;
    }[];
    redesSociales?: {
      nombre: string;
      url: string;
    }[];
  };
  seo?: Seo;
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
    video?: {
      asset: {
        _id: string;
        url: string;
      };
    };
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
      icono?: SanityImage;
      titulo: string;
      descripcion: string;
    };
    vision: {
      icono?: SanityImage;
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
  seo?: Seo;
}

/**
 * Configuración SEO reutilizable
 */
export interface Seo {
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: SanityImage;
  noIndex?: boolean;
}

/**
 * Hero genérico para páginas editables
 */
export interface PageHero {
  badge?: string;
  titulo?: string;
  tituloDestacado?: string;
  descripcion?: string;
  imagenFondo?: SanityImage;
}

/**
 * Contenido editable de la Página de Equipo
 */
export interface EquipoPage {
  _id: string;
  hero: PageHero;
  seo?: Seo;
}

/**
 * Contenido editable de la Página de Especialidades
 */
export interface EspecialidadesPage {
  _id: string;
  hero: PageHero;
  seo?: Seo;
}

/**
 * Contenido editable de la Página Trabajá con Nosotros
 */
export interface TrabajaConNosotrosPage {
  _id: string;
  hero: PageHero;
  stats?: {
    numero?: string;
    etiqueta?: string;
  }[];
  formulario?: {
    titulo?: string;
    descripcion?: string;
  };
  seo?: Seo;
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

/**
 * Reel de Instagram para el carrusel
 */
export interface InstagramReel {
  _id: string;
  titulo: string;
  url: string;
  thumbnail?: SanityImage;
  orden?: number;
}
