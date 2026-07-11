import { useRef, useState, useCallback, useEffect } from 'react';
import type { ImagenGaleria } from '../../types';

interface Props {
  imagenes: ImagenGaleria[];
}

export default function GaleriaCarousel({ imagenes }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const scrollDirection = useCallback((direction: 'left' | 'right') => {
    if (containerRef.current) {
      const amount = direction === 'left' ? -containerRef.current.clientWidth : containerRef.current.clientWidth;
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
  }, [checkScroll, imagenes]);

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

  if (imagenes.length === 0) return null;

  return (
    <div className="relative group/carousel">
      {/* Navigation Arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scrollDirection('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-text/5 text-text hover:text-primary hover:scale-105 transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
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
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-text/5 text-text hover:text-primary hover:scale-105 transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
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
        className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {imagenes.map((item, idx) => (
          <div
            key={`${item.titulo}-${idx}`}
            className="group relative aspect-[4/3] flex-shrink-0 w-[calc(100%-16px)] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] overflow-hidden rounded-2xl sm:rounded-3xl select-none snap-start"
          >
            <img
              src={item.imagen?.asset?.url || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600'}
              alt={item.imagen?.alt || item.titulo}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
              loading="lazy"
              draggable={false}
            />
            {/* Always visible gradient + title */}
            <div className="absolute inset-0 bg-gradient-to-t from-text/80 via-text/20 to-transparent" />
            <div className="absolute inset-0 flex items-end p-4 sm:p-6">
              <p className="text-lg sm:text-xl font-semibold text-white font-display">
                {item.titulo}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
