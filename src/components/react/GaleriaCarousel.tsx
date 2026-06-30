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
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate images for seamless infinite loop
  const duplicatedImages = [...imagenes, ...imagenes, ...imagenes];
  const shouldAutoScroll = imagenes.length > 3;

  // Auto-scroll with requestAnimationFrame for smoothness
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !shouldAutoScroll) return;

    let rafId: number;
    let lastTime: number;
    const speed = 0.5; // pixels per frame

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;

      if (!isPaused && el) {
        el.scrollLeft += speed * (delta / 16);

        // Calculate the width of one original set
        const singleSetWidth = el.scrollWidth / 3;

        // When we've scrolled past the second set, reset to the first set position
        if (el.scrollLeft >= singleSetWidth * 2) {
          el.scrollLeft = el.scrollLeft - singleSetWidth;
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    // Initial offset: start at the beginning of the second set so we can scroll both ways
    const singleSetWidth = () => el.scrollWidth / 3;
    el.scrollLeft = singleSetWidth();

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [imagenes, shouldAutoScroll, isPaused]);

  // Pause on hover/touch
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const pause = () => setIsPaused(true);
    const resume = () => setIsPaused(false);
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume);
    return () => {
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
    };
  }, []);

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
    <div className="relative">
      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {duplicatedImages.map((item, idx) => (
          <div
            key={`${item.titulo}-${idx}`}
            className="group relative aspect-[4/3] flex-shrink-0 w-[calc(100%-16px)] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] overflow-hidden rounded-2xl sm:rounded-3xl select-none"
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
