export const queries = {
  // ── Configuración Global ──
  configuracion: `*[_type == "configuracion"][0]{
    _id,
    logo{
      asset->{_id,url},
      alt
    },
    whatsapp,
    enlaceTurnos,
    enlaceReservarTurno,
    email,
    telefono,
    direccion,
    mapaUrl,
    horarios,
    metaTitle,
    metaDescription,
    ogImage{
      asset->{_id,url},
      alt
    },
    linkSugerencias{
      texto,
      url
    },
    localBusiness{
      latitud,
      longitud,
      mapaUrlPublica,
      horarios[]{
        dias,
        abre,
        cierra
      }
    },
    redesSociales[]{
      nombre,
      url
    }
  }`,

  // ── Especialidades ──
  todasEspecialidades: `*[_type == "especialidad" && activo != false] | order(nombre asc){
    _id,
    nombre,
    "slug": slug.current,
    descripcion,
    activo,
    icono{
      asset->{
        _id,
        url
      },
      alt
    },
    seo{
      seoTitle,
      seoDescription,
      seoImage{
        asset->{_id,url},
        alt
      },
      noIndex
    }
  }`,

  especialidadBySlug: `*[_type == "especialidad" && slug.current == $slug][0]{
    _id,
    nombre,
    "slug": slug.current,
    descripcion,
    activo,
    icono{
      asset->{
        _id,
        url
      },
      alt
    },
    especialidadesRelacionadas[]->{
      _id,
      nombre,
      "slug": slug.current,
      icono{
        asset->{_id,url},
        alt
      }
    },
    seo{
      seoTitle,
      seoDescription,
      seoImage{
        asset->{_id,url},
        alt
      },
      noIndex
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
    especialidades[]->{
      _id,
      nombre,
      "slug": slug.current
    },
    enlaceAgenda,
    biografia,
    destacado,
    whatsapp,
    seo{
      seoTitle,
      seoDescription,
      seoImage{
        asset->{_id,url},
        alt
      },
      noIndex
    }
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
    especialidades[]->{
      _id,
      nombre,
      "slug": slug.current
    },
    enlaceAgenda,
    biografia,
    whatsapp,
    seo{
      seoTitle,
      seoDescription,
      seoImage{
        asset->{_id,url},
        alt
      },
      noIndex
    }
  }`,

  profesionalesByEspecialidad: `*[_type == "profesional" && $slug in especialidades[]->slug.current] | order(nombre asc){
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
    especialidades[]->{
      _id,
      nombre,
      "slug": slug.current
    },
    enlaceAgenda,
    biografia,
    whatsapp,
    seo{
      seoTitle,
      seoDescription,
      seoImage{
        asset->{_id,url},
        alt
      },
      noIndex
    }
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
    especialidades[]->{
      _id,
      nombre,
      "slug": slug.current
    },
    enlaceAgenda,
    biografia,
    facebook,
    instagram,
    whatsapp,
    seo{
      seoTitle,
      seoDescription,
      seoImage{
        asset->{_id,url},
        alt
      },
      noIndex
    }
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
      imagenesTarjeta[]{
        asset->{_id,url},
        alt
      },
      estadisticas[]{
        numero,
        etiqueta
      }
    },
    especialidadesGrid{
      badge,
      titulo,
      tituloDestacado,
      descripcion
    },
    porQueElegirnos{
      imagenes[]{
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
    obrasSociales[]|order(orden asc){
      nombre,
      orden,
      logo{
        asset->{_id,url},
        alt
      }
    },
    obrasSocialesBadge,
    obrasSocialesTitulo,
    obrasSocialesTituloDestacado,
    obrasSocialesDescripcion,
    obrasSocialesBotonTexto,
    obrasSocialesBotonEnlace,
    contacto{
      badge,
      titulo,
      tituloDestacado,
      descripcion,
      mapaUrl,
      botonTexto,
      botonEnlace,
      items[]{
        icono,
        label,
        valor,
        enlace
      },
      redesSociales[]{
        nombre,
        url
      }
    },
    seo{
      seoTitle,
      seoDescription,
      seoImage{
        asset->{_id,url},
        alt
      },
      noIndex
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
      video{
        asset->{_id,url}
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
        icono{
          asset->{_id,url},
          alt
        },
        titulo,
        descripcion
      },
      vision{
        icono{
          asset->{_id,url},
          alt
        },
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
    },
    seo{
      seoTitle,
      seoDescription,
      seoImage{
        asset->{_id,url},
        alt
      },
      noIndex
    }
  }`,

  // ── Página de Equipo ──
  equipoPage: `*[_type == "equipoPage"][0]{
    _id,
    hero{
      badge,
      titulo,
      tituloDestacado,
      descripcion,
      imagenFondo{
        asset->{_id,url},
        alt
      }
    },
    seo{
      seoTitle,
      seoDescription,
      seoImage{
        asset->{_id,url},
        alt
      },
      noIndex
    }
  }`,

  // ── Página de Especialidades ──
  especialidadesPage: `*[_type == "especialidadesPage"][0]{
    _id,
    hero{
      badge,
      titulo,
      tituloDestacado,
      descripcion,
      imagenFondo{
        asset->{_id,url},
        alt
      }
    },
    seo{
      seoTitle,
      seoDescription,
      seoImage{
        asset->{_id,url},
        alt
      },
      noIndex
    }
  }`,

  // ── Página Trabajá con Nosotros ──
  trabajaConNosotrosPage: `*[_type == "trabajaConNosotrosPage"][0]{
    _id,
    hero{
      badge,
      titulo,
      tituloDestacado,
      descripcion,
      imagenFondo{
        asset->{_id,url},
        alt
      }
    },
    stats[]{
      numero,
      etiqueta
    },
    formulario{
      titulo,
      descripcion
    },
    seo{
      seoTitle,
      seoDescription,
      seoImage{
        asset->{_id,url},
        alt
      },
      noIndex
    }
  }`,

  // ── Instagram Reels ──
  instagramReels: `*[_type == "instagramReel"] | order(orden desc, _createdAt desc){
    _id,
    titulo,
    url,
    thumbnail{
      asset->{_id,url},
      alt
    },
    orden
  }`,

};
