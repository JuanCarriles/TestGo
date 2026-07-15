import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { SanityImage } from '../../types';

interface Props {
  images: SanityImage[];
  children?: ReactNode;
}

export default function HeroImageCarousel({ images, children }: Props) {
  const [active, setActive] = useState(0);

  const slides = images.length > 0 ? images : [];

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
      {/* Slides */}
      <div className="relative h-[400px] xl:h-[500px] w-full">
        {/* Renderizado SSR de la primera imagen */}
        {children && (
          <div
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: active === 0 ? 1 : 0 }}
          >
            {children}
          </div>
        )}

        {/* Renderizado dinámico del resto */}
        {slides.map((img, idx) => {
          if (children && idx === 0) return null;
          return (
            <div
              key={idx}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none"
              style={{ opacity: idx === active ? 1 : 0 }}
            >
              <img
                src={`${img.asset?.url}?w=800&h=625&fit=crop&auto=format`}
                alt={img.alt || 'Imagen del centro médico'}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-t from-text/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Floating badge */}
      <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6">
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4 md:p-5">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/80 text-white">
              <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold font-body text-sm md:text-base">Turnos Online</p>
              <p className="text-white/60 text-xs md:text-sm font-body">Atención inmediata garantizada</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === active ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Ver imagen ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
