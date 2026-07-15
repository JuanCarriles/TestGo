import { useRef, useState, useCallback, useEffect } from 'react';
import { urlFor } from '../../lib/sanity';
import type { ObraSocial } from '../../types';

interface Props {
  obras: ObraSocial[];
}

export default function ObrasSocialesCarousel({ obras }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const ticking = useRef(false);

  // Fixed 8 items per block (4 columns x 2 rows)
  const ITEMS_PER_BLOCK = 8;

  // Split obras into blocks
  const blocks: ObraSocial[][] = [];
  for (let i = 0; i < obras.length; i += ITEMS_PER_BLOCK) {
    blocks.push(obras.slice(i, i + ITEMS_PER_BLOCK));
  }

  const scrollDirection = useCallback((direction: 'left' | 'right') => {
    if (containerRef.current) {
      const amount = direction === 'left' ? -containerRef.current.clientWidth : containerRef.current.clientWidth;
      containerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setStartX(e.touches[0].pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const x = e.touches[0].pageX - (containerRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  }, [startX, scrollLeft]);

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
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll, obras]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, [isDragging]);

  // Render a single card
  const renderCard = (obra: ObraSocial) => (
    <div
      key={obra.nombre + (obra.orden ?? 0)}
      className="group relative flex flex-col items-center justify-center rounded-2xl bg-surface/5 border border-text/5 p-4 sm:p-6 w-full h-[140px] sm:h-[150px] md:h-[170px] transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:border-primary/10 hover:bg-white select-none"
      onClick={handleClick}
    >
      {obra.logo?.asset ? (
        <img
          src={urlFor(obra.logo.asset, { w: 300, h: 100 })}
          alt={obra.logo.alt || obra.nombre}
          className="h-full w-full object-contain grayscale opacity-60 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 pointer-events-none"
          loading="lazy"
          draggable={false}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:shadow-glow">
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-text/40 group-hover:text-primary transition-colors duration-500 font-body text-center">{obra.nombre}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scrollDirection('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white shadow-lg border border-text/5 text-text hover:text-primary hover:shadow-xl transition-all duration-300 -translate-x-1/2 md:-translate-x-4"
          aria-label="Ver obras anteriores"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scrollDirection('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white shadow-lg border border-text/5 text-text hover:text-primary hover:shadow-xl transition-all duration-300 translate-x-1/2 md:translate-x-4"
          aria-label="Ver más obras"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className="flex gap-3 md:gap-4 px-1">
          {blocks.map((block, blockIndex) => (
            <div key={blockIndex} className="grid grid-cols-4 gap-3 md:gap-4 w-full min-w-[700px] lg:min-w-full shrink-0 snap-start">
              {block.map(renderCard)}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint dots */}
      {canScrollRight && (
        <div className="flex justify-center gap-1.5 mt-4 md:hidden">
          <div className="h-1.5 w-8 rounded-full bg-primary/20" />
          <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
          <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
        </div>
      )}
    </div>
  );
}
