import { useState, useMemo } from 'react';
import type { Profesional, Especialidad } from '../../types';

interface Props {
  profesionales: Profesional[];
  especialidades: Especialidad[];
}

export default function TeamFilters({ profesionales, especialidades }: Props) {
  const [search, setSearch] = useState('');
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('');

  const filtered = useMemo(() => {
    return profesionales.filter((prof) => {
      const matchesSearch = prof.nombre.toLowerCase().includes(search.toLowerCase());
      const matchesEspecialidad =
        !selectedEspecialidad || prof.especialidad?.slug === selectedEspecialidad;
      return matchesSearch && matchesEspecialidad;
    });
  }, [profesionales, search, selectedEspecialidad]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-12 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg className="h-5 w-5 text-text/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-text/10 bg-white py-3.5 pl-12 pr-4 text-sm text-text placeholder:text-text/30 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-body"
          />
        </div>
        <select
          value={selectedEspecialidad}
          onChange={(e) => setSelectedEspecialidad(e.target.value)}
          className="rounded-2xl border border-text/10 bg-white py-3.5 px-5 text-sm text-text transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-72 font-body"
        >
          <option value="">Todas las especialidades</option>
          {especialidades.map((esp) => (
            <option key={esp._id} value={esp.slug}>
              {esp.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="mb-8 text-sm text-text/40 font-body">
        Mostrando {filtered.length} {filtered.length === 1 ? 'profesional' : 'profesionales'}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((prof) => (
            <div
              key={prof._id}
              className="group relative flex flex-col rounded-3xl border border-dark/5 bg-white overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-primary/10"
            >
              {/* Photo */}
              <div className="relative h-72 overflow-hidden">
                {prof.foto?.asset?.url ? (
                  <img
                    src={prof.foto.asset.url}
                    alt={prof.foto.alt || prof.nombre}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface/20 to-primary/5">
                    <svg className="h-20 w-20 text-surface/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent"></div>
                {prof.especialidad && (
                  <span className="absolute left-5 top-5 rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-primary shadow-lg font-body">
                    {prof.especialidad.nombre}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-8">
                <h3 className="text-2xl font-semibold text-text group-hover:text-primary transition-colors duration-500 font-display">
                  {prof.nombre}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text/50 line-clamp-3 flex-1 font-body font-light">
                  {prof.biografia}
                </p>
                <a
                  href={prof.enlaceAgenda}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-500 hover:bg-primary/90 hover:shadow-glow hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-body"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Agendar Turno
                </a>
              </div>

              {/* Bottom accent line */}
              <div className="h-1 bg-gradient-to-r from-primary to-primary/60 transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-surface/5 py-20 text-center border border-dark/5">
          <svg className="mx-auto h-16 w-16 text-text/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-6 text-text/30 font-body">No se encontraron profesionales con los filtros seleccionados.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedEspecialidad('');
            }}
            className="mt-4 text-sm font-semibold text-primary hover:underline focus:outline-none font-body"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
