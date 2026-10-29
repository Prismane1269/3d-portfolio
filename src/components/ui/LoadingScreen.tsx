'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  isLoaded?: boolean;
  onLoaded?: () => void;
  minDuration?: number; // minimum time in ms, defaults to 2000
}

export default function LoadingScreen({
  isLoaded,
  onLoaded,
  minDuration = 2000,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef({ val: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // If isLoaded is explicitly provided and false, count up smoothly to 88%
      // If isLoaded is undefined, count smoothly to 100% over minDuration
      const targetVal = isLoaded === undefined ? 100 : isLoaded ? 100 : 88;
      const durationSeconds = minDuration / 1000;

      const runExit = () => {
        const exitTl = gsap.timeline({
          onComplete: () => {
            setIsDone(true);
            if (onLoaded) onLoaded();
          },
        });

        exitTl
          .to([logoRef.current, percentRef.current, statusRef.current], {
            y: -30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power3.in',
          })
          .to(
            containerRef.current,
            {
              yPercent: -100,
              duration: 0.9,
              ease: 'power4.inOut',
            },
            '-=0.2'
          );
      };

      gsap.to(counterRef.current, {
        val: targetVal,
        duration: isLoaded ? 0.4 : durationSeconds,
        ease: isLoaded ? 'power1.out' : 'power2.inOut',
        onUpdate: () => {
          const currentVal = Math.round(counterRef.current.val);
          setProgress(currentVal);
          if (percentRef.current) {
            percentRef.current.innerText = `${currentVal}%`;
          }
        },
        onComplete: () => {
          if (targetVal === 100) {
            runExit();
          }
        },
      });

      if (barRef.current) {
        gsap.to(barRef.current, {
          width: `${targetVal}%`,
          duration: isLoaded ? 0.4 : durationSeconds,
          ease: isLoaded ? 'power1.out' : 'power2.inOut',
        });
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [isLoaded, minDuration, onLoaded]);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0a0a0a] text-white overflow-hidden select-none"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/15 via-purple-600/15 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        {/* Animated Brand Logo */}
        <div ref={logoRef} className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-400 mb-4 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            Initializing System
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            NEXUS
          </h1>
          <p className="text-xs uppercase font-mono tracking-[0.25em] text-neutral-400 mt-2">
            Creative 3D Studio
          </p>
        </div>

        {/* Progress bar container */}
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden relative backdrop-blur-sm p-[1px] border border-white/10">
          <div
            ref={barRef}
            className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.7)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading details */}
        <div className="w-full flex justify-between items-center mt-3 text-xs font-mono text-neutral-400">
          <p ref={statusRef} className="flex items-center gap-1.5 text-neutral-400">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Loading WebGL Shaders
          </p>
          <span ref={percentRef} className="font-bold text-white tabular-nums">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
