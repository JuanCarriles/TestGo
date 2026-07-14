import { useRef, useState, useCallback, useEffect } from 'react';
import type { Noticia } from '../../types';

interface Props {
  noticias: Noticia[];
}

export default function NoticiasCarousel({ noticias }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const scrollDirection = useCallback((direction: 'left' | 'right') => {
    if (containerRef.current) {
      // Avanzar el equivalente a una tarjeta visible aproximadamente
      const amount = direction === 'left' ? -containerRef.current.clientWidth * 0.8 : containerRef.current.clientWidth * 0.8;
      containerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  }, []);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [checkScroll, noticias]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollStart(containerRef.current?.scrollLeft || 0);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollStart - walk;
  }, [isDragging, startX, scrollStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setStartX(e.touches[0].pageX - (containerRef.current?.offsetLeft || 0));
    setScrollStart(containerRef.current?.scrollLeft || 0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const x = e.touches[0].pageX - (containerRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollStart - walk;
  }, [startX, scrollStart]);

  if (noticias.length === 0) return null;

  return (
    <div className="relative group/carousel">
      {/* Navigation Arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scrollDirection('left')}
          className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg border border-text/5 text-text hover:text-primary hover:scale-105 transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
          aria-label="Anterior"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scrollDirection('right')}
          className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg border border-text/5 text-text hover:text-primary hover:scale-105 transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
          aria-label="Siguiente"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto pb-8 pt-4 px-2 -mx-2 scrollbar-hide cursor-grab active:cursor-grabbing snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {noticias.map((noticia) => {
          const dateStr = new Date(noticia.fecha).toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });

          return (
            <a
              key={noticia._id}
              href={`/noticias/${noticia.slug}`}
              className="group flex flex-col flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-text/5 select-none snap-start"
              draggable={false}
              onClick={(e) => {
                // Prevenir click si el usuario estaba arrastrando el carrusel
                if (isDragging) {
                  e.preventDefault();
                }
              }}
            >
              {/* Imagen de la noticia */}
              <div className="relative aspect-video w-full overflow-hidden bg-surface/5">
                <img
                  src={noticia.imagenPrincipal?.asset?.url || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600'}
                  alt={noticia.imagenPrincipal?.alt || noticia.titulo}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                  loading="lazy"
                  draggable={false}
                />
                {noticia.destacada && (
                  <span className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full font-body shadow-sm">
                    Destacada
                  </span>
                )}
              </div>
              
              {/* Contenido de la tarjeta */}
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <time className="text-xs font-semibold text-primary/80 uppercase tracking-widest font-body mb-3 block">
                  {dateStr}
                </time>
                <h3 className="text-xl md:text-2xl font-bold text-text font-display leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {noticia.titulo}
                </h3>
                <p className="text-sm md:text-base text-text/60 font-body font-light line-clamp-3 mb-6 flex-grow">
                  {noticia.resumen}
                </p>
                <div className="mt-auto flex items-center text-sm font-semibold text-primary font-body">
                  Leer más
                  <svg className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
