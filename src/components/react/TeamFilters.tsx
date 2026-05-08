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
      <div className="mb-10 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-text/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-text/10 bg-background py-3 pl-10 pr-4 text-sm text-text placeholder:text-text/40 transition-colors duration-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={selectedEspecialidad}
          onChange={(e) => setSelectedEspecialidad(e.target.value)}
          className="rounded-xl border border-text/10 bg-background py-3 px-4 text-sm text-text transition-colors duration-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-64"
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
      <p className="mb-6 text-sm text-text/50">
        Mostrando {filtered.length} {filtered.length === 1 ? 'profesional' : 'profesionales'}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((prof) => (
            <div
              key={prof._id}
              className="group flex flex-col rounded-2xl border border-text/5 bg-surface/5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/10"
            >
              {/* Photo */}
              <div className="relative aspect-[4/3] overflow-hidden bg-surface/10">
                {prof.foto?.asset?.url ? (
                  <img
                    src={prof.foto.asset.url}
                    alt={prof.foto.alt || prof.nombre}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface/20 to-primary/5">
                    <svg className="h-16 w-16 text-surface/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                {prof.especialidad && (
                  <span className="absolute left-4 top-4 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {prof.especialidad.nombre}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors duration-300">
                  {prof.nombre}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text/60 line-clamp-3 flex-1">
                  {prof.biografia}
                </p>
                <a
                  href={prof.enlaceAgenda}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Agendar Turno
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-surface/5 py-16 text-center border border-text/5">
          <svg className="mx-auto h-12 w-12 text-text/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-text/40">No se encontraron profesionales con los filtros seleccionados.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedEspecialidad('');
            }}
            className="mt-4 text-sm font-medium text-primary hover:underline focus:outline-none"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
