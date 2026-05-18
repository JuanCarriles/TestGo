import { useState, useRef, useEffect } from 'react';
import type { InstagramReel } from '../../types';

interface Props {
  reels: InstagramReel[];
  instagramUrl?: string;
}

export default function InstagramReelsCarousel({ reels, instagramUrl }: Props) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [reels.length]);

  const scrollBy = (direction: number) => {
    const el = containerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth || 300;
    const gap = 24;
    el.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' });
  };

  if (reels.length === 0) return null;

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 bg-surface/5 overflow-hidden" data-reveal="up">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3 sm:mb-4 font-body">
              Seguinos
            </span>
            <div className="flex items-center gap-3 sm:gap-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text font-display leading-tight">
                Últimos <span className="text-gradient">reels</span>
              </h2>
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-white shadow-md border border-text/5 text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-glow hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Ver perfil de Instagram"
                >
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Arrows */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => scrollBy(-1)}
              disabled={!canScrollLeft}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-text/10 bg-white text-text transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Anterior"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollBy(1)}
              disabled={!canScrollRight}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-text/10 bg-white text-text transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Siguiente"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reels.map((reel, idx) => (
            <a
              key={reel._id}
              href={reel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-shrink-0 w-[260px] sm:w-[280px] lg:w-[300px] snap-start"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Card */}
              <div className="relative rounded-2xl overflow-hidden border border-text/5 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-primary/10">
                {/* Image */}
                <div className="relative h-[340px] sm:h-[380px] overflow-hidden">
                  {reel.thumbnail?.asset?.url ? (
                    <img
                      src={reel.thumbnail.asset.url}
                      alt={reel.thumbnail.alt || reel.titulo}
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface/20 to-primary/5">
                      <svg className="h-16 w-16 text-surface/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  {/* Overlay + Play icon */}
                  <div className="absolute inset-0 bg-gradient-to-t from-text/70 via-text/10 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-500">
                      <svg className="h-7 w-7 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {/* Instagram badge */}
                  <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                    <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <p className="text-sm font-medium text-text/70 line-clamp-2 font-body leading-relaxed">
                    {reel.titulo}
                  </p>
                  <div className="mt-3 flex items-center text-xs font-semibold text-primary font-body">
                    <span>Ver en Instagram</span>
                    <svg className="ml-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            </a>
          ))}
        </div>

        {/* Mobile arrows */}
        <div className="flex sm:hidden items-center justify-center gap-3 mt-6">
          <button
            onClick={() => scrollBy(-1)}
            disabled={!canScrollLeft}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-text/10 bg-white text-text transition-all duration-300 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Anterior"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scrollBy(1)}
            disabled={!canScrollRight}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-text/10 bg-white text-text transition-all duration-300 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Siguiente"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
