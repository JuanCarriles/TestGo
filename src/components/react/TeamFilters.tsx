import { useState, useMemo, useEffect } from 'react';
import type { Profesional, Especialidad } from '../../types';
import { getImageUrl } from '../../lib/images';
import { trackEvent } from '../../lib/analytics';

const STORAGE_KEY = 'team-filters';

/**
 * Normaliza un texto para búsquedas sin acentos ni diferencias de casing.
 * Convierte a minúsculas y elimina diacríticos (tildes, etc.).
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

interface SavedFilters {
  search: string;
  especialidad: string;
}

interface Props {
  profesionales: Profesional[];
  especialidades: Especialidad[];
}

function getSavedFilters(): SavedFilters {
  if (typeof window === 'undefined') return { search: '', especialidad: '' };
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SavedFilters;
  } catch { /* ignore */ }
  return { search: '', especialidad: '' };
}

export default function TeamFilters({ profesionales, especialidades }: Props) {
  const saved = getSavedFilters();
  const [search, setSearch] = useState(saved.search);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState(saved.especialidad);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload: SavedFilters = { search, especialidad: selectedEspecialidad };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [search, selectedEspecialidad]);

  const filtered = useMemo(() => {
    return profesionales.filter((prof) => {
      const searchNormalized = normalizeText(search).trim();

      const hasMulti = Array.isArray(prof.especialidades) && prof.especialidades.length > 0;

      const espSlugs = hasMulti
        ? (prof.especialidades || []).map((e) => e?.slug).filter(Boolean) as string[]
        : prof.especialidad?.slug
          ? [prof.especialidad.slug]
          : [];

      const espNombres = hasMulti
        ? (prof.especialidades || []).map((e) => normalizeText(e?.nombre || '')).filter(Boolean) as string[]
        : prof.especialidad?.nombre
          ? [normalizeText(prof.especialidad.nombre)]
          : [];

      const matchesSearch =
        !searchNormalized ||
        normalizeText(prof.nombre).includes(searchNormalized) ||
        espNombres.some((n) => n.includes(searchNormalized));

      const matchesEspecialidad =
        !selectedEspecialidad ||
        espSlugs.includes(selectedEspecialidad);

      return matchesSearch && matchesEspecialidad;
    });
  }, [profesionales, search, selectedEspecialidad]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 md:mb-12 rounded-3xl bg-white border border-text/10 p-5 md:p-6 shadow-lg shadow-text/5">
        <div className="flex flex-col gap-3 md:gap-4 sm:flex-row">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 md:pl-5">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border-2 border-text/10 bg-surface/5 py-3.5 pl-12 md:pl-14 pr-5 text-base text-text placeholder:text-text/40 transition-all duration-300 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 font-body"
            />
          </div>
          <select
            value={selectedEspecialidad}
            onChange={(e) => setSelectedEspecialidad(e.target.value)}
            className="rounded-2xl border-2 border-text/10 bg-surface/5 py-3.5 px-5 md:px-6 text-base text-text transition-all duration-300 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 w-full sm:w-80 font-body appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%23CB6767%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27M6%208l4%204%204-4%27%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10"
          >
            <option value="">Todas las especialidades</option>
            {especialidades.map((esp) => (
              <option key={esp._id} value={esp.slug}>
                {esp.nombre}
              </option>
            ))}
          </select>
        </div>
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
              className="group relative flex flex-col rounded-3xl border border-text/5 bg-white overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-primary/10 cursor-pointer"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest('a') || target.closest('button')) return;
                if (typeof window !== 'undefined') {
                  window.sessionStorage.setItem('equipo-scroll', String(window.scrollY));
                }
                window.location.href = `/equipo/${prof.slug}`;
              }}
            >
              {/* Photo */}
              <div className="relative h-72 overflow-hidden">
                {prof.foto?.asset?.url ? (
                  <img
                    src={getImageUrl(prof.foto.asset.url)}
                    alt={prof.foto.alt || prof.nombre}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface/20 to-primary/5">
                    <svg className="h-20 w-20 text-surface/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-text/60 via-transparent to-transparent"></div>
                <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                  {(prof.especialidades && prof.especialidades.length > 0
                    ? prof.especialidades
                    : prof.especialidad ? [prof.especialidad] : []
                  ).map((esp) => (
                    <span
                      key={esp._id}
                      className="rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-primary shadow-lg font-body"
                    >
                      {esp.nombre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-8">
                <h2 className="text-2xl font-semibold text-text group-hover:text-primary transition-colors duration-500 font-display">
                  {prof.nombre}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-text/50 line-clamp-3 flex-1 font-body font-light whitespace-pre-line">
                  {prof.biografia}
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={`/equipo/${prof.slug}`}
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.sessionStorage.setItem('equipo-scroll', String(window.scrollY));
                      }
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition-all duration-500 hover:bg-primary hover:text-white hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-body"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver Perfil
                  </a>
                  <a
                    href={prof.enlaceAgenda && prof.enlaceAgenda !== '#' ? prof.enlaceAgenda : prof.whatsapp ? `https://wa.me/${prof.whatsapp}?text=${encodeURIComponent(`Hola, quiero reservar un turno con el Dr/a. ${prof.nombre}.\n\nPara asignar y cotizar el turno, completá los siguientes datos:\n\nNombre completo:\nDNI:\nObra social:\n\nAdjuntar foto del pedido médico.\n\nGracias!`)}` : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('reservar_turno', { event_category: 'conversion', event_label: 'grid_equipo', doctor_name: prof.nombre })}
                    className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-500 hover:bg-primary/90 hover:shadow-glow hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-body"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Agendar Turno
                  </a>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-surface/5 py-20 text-center border border-text/5">
          <svg className="mx-auto h-16 w-16 text-text/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-6 text-text/30 font-body">No se encontraron profesionales con los filtros seleccionados.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedEspecialidad('');
              if (typeof window !== 'undefined') {
                window.sessionStorage.removeItem(STORAGE_KEY);
              }
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
