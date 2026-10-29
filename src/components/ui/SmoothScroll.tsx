'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface LenisContextValue {
  getLenis: () => Lenis | null;
  scrollTo: (
    target: string | number | HTMLElement,
    options?: { offset?: number; duration?: number; immediate?: boolean }
  ) => void;
}

const LenisContext = createContext<LenisContextValue>({
  getLenis: () => null,
  scrollTo: () => {},
});

export const useLenis = () => useContext(LenisContext);

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with optimized mobile and desktop settings
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.0,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll with GSAP ScrollTrigger
    const handleScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on('scroll', handleScroll);

    // Sync GSAP ticker with Lenis requestAnimationFrame
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    // Smooth over frame lag on low-end/mobile devices without sudden jumps
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      lenis.off('scroll', handleScroll);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback(
    (
      target: string | number | HTMLElement,
      options?: { offset?: number; duration?: number; immediate?: boolean }
    ) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, options);
      } else if (typeof window !== 'undefined') {
        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'smooth' });
        } else if (typeof target === 'string') {
          const el = document.querySelector(target);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        } else if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      getLenis: () => lenisRef.current,
      scrollTo,
    }),
    [scrollTo]
  );

  return (
    <LenisContext.Provider value={contextValue}>
      {children}
    </LenisContext.Provider>
  );
}
