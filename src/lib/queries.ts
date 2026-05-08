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
    biografia
  }`,

  // ── Obras Sociales ──
  todasObrasSociales: `*[_type == "obraSocial" && activa == true] | order(nombre asc){
    _id,
    nombre,
    logo{
      asset->{
        _id,
        url
      },
      alt
    }
  }`,

  // ── Reseñas ──
  todasResenasAprobadas: `*[_type == "resena" && aprobada == true] | order(fecha desc){
    _id,
    nombre,
    texto,
    estrellas,
    fecha
  }`,
} as const;
