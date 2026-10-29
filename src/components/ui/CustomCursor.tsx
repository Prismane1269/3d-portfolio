'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);

  // Position refs for smooth lerp
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Only run on devices with fine pointer (mouse), not touch
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasPointer) return;

    const onMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Interactive element detection
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, input, textarea, select, [data-cursor="pointer"], [data-cursor="view"]');
      if (interactive) {
        setIsHovered(true);
        const customText = interactive.getAttribute('data-cursor-text');
        setCursorText(customText || null);
      } else {
        setIsHovered(false);
        setCursorText(null);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', handleElementHover, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth lerp loop for the outer ring
    const render = () => {
      const lerp = 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerp;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerp;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    // Hide native cursor for desktop
    document.documentElement.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleElementHover);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <style jsx global>{`
        @media (pointer: fine) {
          .custom-cursor-active,
          .custom-cursor-active a,
          .custom-cursor-active button,
          .custom-cursor-active input,
          .custom-cursor-active textarea {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Main instantaneous dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-[9999] rounded-full transition-transform duration-75 ease-out ${
          isHovered
            ? 'h-2 w-2 bg-cyan-400 opacity-80'
            : isClicked
            ? 'h-1.5 w-1.5 bg-amber-400'
            : 'h-2.5 w-2.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
        }`}
      />

      {/* Outer trailing ring with lerp delay */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-[9998] flex items-center justify-center rounded-full transition-all duration-300 ease-out ${
          isHovered
            ? 'h-16 w-16 border-2 border-cyan-400/80 bg-cyan-500/10 backdrop-blur-[2px] shadow-[0_0_20px_rgba(34,211,238,0.3)] scale-110'
            : isClicked
            ? 'h-8 w-8 border border-purple-400/90 bg-purple-500/20 scale-90'
            : 'h-10 w-10 border border-white/40 bg-white/[0.03] backdrop-blur-[1px]'
        }`}
      >
        {cursorText && (
          <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-300 font-semibold select-none animate-pulse">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
}
