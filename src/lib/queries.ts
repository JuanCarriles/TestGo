export const queries = {
  // ── Configuración Global ──
  configuracion: `*[_type == "configuracion"][0]{
    _id,
    whatsapp,
    enlaceTurnos,
    email,
    telefono,
    direccion,
    mapaUrl,
    horarios,
    metaTitle,
    metaDescription,
    redesSociales[]{
      nombre,
      url
    }
  }`,

  // ── Especialidades ──
  todasEspecialidades: `*[_type == "especialidad"] | order(nombre asc){
    _id,
    nombre,
    "slug": slug.current,
    descripcion,
    icono{
      asset->{
        _id,
        url
      },
      alt
    }
  }`,

  especialidadBySlug: `*[_type == "especialidad" && slug.current == $slug][0]{
    _id,
    nombre,
    "slug": slug.current,
    descripcion,
    icono{
      asset->{
        _id,
        url
      },
      alt
    }
  }`,

  // ── Profesionales ──
  todosProfesionales: `*[_type == "profesional"] | order(nombre asc){
    _id,
    nombre,
    "slug": slug.current,
    foto{
      asset->{
        _id,
        url
      },
      alt
    },
    especialidad->{
      _id,
      nombre,
      "slug": slug.current
    },
    enlaceAgenda,
    biografia,
    destacado
  }`,

  profesionalesDestacados: `*[_type == "profesional" && destacado == true] | order(nombre asc){
    _id,
    nombre,
    "slug": slug.current,
    foto{
      asset->{
        _id,
        url
      },
      alt
    },
    especialidad->{
      _id,
      nombre,
      "slug": slug.current
    },
    enlaceAgenda,
    biografia
  }`,

  profesionalesByEspecialidad: `*[_type == "profesional" && especialidad->slug.current == $slug] | order(nombre asc){
    _id,
    nombre,
    "slug": slug.current,
    foto{
      asset->{
        _id,
        url
      },
      alt
    },
    especialidad->{
      _id,
      nombre,
      "slug": slug.current
    },
    enlaceAgenda,
    biografia
  }`,

  profesionalBySlug: `*[_type == "profesional" && slug.current == $slug][0]{
    _id,
    nombre,
    "slug": slug.current,
    foto{
      asset->{
        _id,
        url
      },
      alt
    },
    especialidad->{
      _id,
      nombre,
      "slug": slug.current
    },
    enlaceAgenda,
    biografia,
    facebook,
    instagram
  }`,

  // ── Página de Inicio ──
  homePage: `*[_type == "homePage"][0]{
    _id,
    hero{
      imagenFondo{
        asset->{_id,url},
        alt
      },
      badge,
      titulo,
      tituloDestacado,
      descripcion,
      ctaPrimario{
        texto,
        usarEnlaceTurnos,
        enlacePersonalizado
      },
      ctaSecundario{
        texto,
        enlace
      },
      imagenTarjeta{
        asset->{_id,url},
        alt
      },
      estadisticas[]{
        numero,
        etiqueta
      }
    },
    porQueElegirnos{
      imagen{
        asset->{_id,url},
        alt
      },
      badge,
      titulo,
      tituloDestacado,
      descripcion,
      features[]{
        icono,
        titulo,
        descripcion
      },
      tarjetaFlotante{
        numero,
        etiqueta
      }
    },
    testimonios[]{
      nombre,
      texto,
      estrellas,
      fecha
    },
    obrasSociales[]{
      nombre,
      logo{
        asset->{_id,url},
        alt
      }
    }
  }`,

  // ── Página Nosotros ──
  nosotrosPage: `*[_type == "nosotrosPage"][0]{
    _id,
    hero{
      badge,
      titulo,
      tituloDestacado,
      imagenFondo{
        asset->{_id,url},
        alt
      }
    },
    historia{
      imagen{
        asset->{_id,url},
        alt
      },
      badge,
      titulo,
      tituloDestacado,
      parrafos,
      tarjetaFlotante{
        numero,
        etiqueta
      }
    },
    misionVision{
      mision{
        titulo,
        descripcion
      },
      vision{
        titulo,
        descripcion
      }
    },
    valores{
      badge,
      titulo,
      tituloDestacado,
      descripcion,
      items[]{
        titulo,
        descripcion
      }
    },
    galeria{
      badge,
      titulo,
      tituloDestacado,
      imagenes[]{
        imagen{
          asset->{_id,url},
          alt
        },
        titulo
      }
    }
  }`,

} as const;
