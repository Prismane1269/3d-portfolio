'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneLoadingIndicator } from '@/components/3d/SceneLoader';

const CyberCharacter3D = dynamic(() => import('@/components/3d/CyberCharacter3D'), {
  ssr: false,
  loading: () => <SceneLoadingIndicator label="INITIALIZING AVATAR" />,
});

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Counter refs
  const stat1Ref = useRef<HTMLSpanElement>(null);
  const stat2Ref = useRef<HTMLSpanElement>(null);
  const stat3Ref = useRef<HTMLSpanElement>(null);
  const stat4Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Headline & Text reveal on scroll
      const textLines = textContainerRef.current?.querySelectorAll('.reveal-line');
      if (textLines && textLines.length > 0) {
        gsap.fromTo(
          textLines,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: textContainerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 2. Numerical counter animation for stats
      const count1 = { val: 0 };
      const count2 = { val: 0 };
      const count3 = { val: 0 };
      const count4 = { val: 0 };

      const statsTrigger = {
        trigger: statsContainerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      };

      gsap.to(count1, {
        val: 5,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: statsTrigger,
        onUpdate: () => {
          if (stat1Ref.current) stat1Ref.current.innerText = `${Math.floor(count1.val)}+`;
        },
      });

      gsap.to(count2, {
        val: 50,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: statsTrigger,
        onUpdate: () => {
          if (stat2Ref.current) stat2Ref.current.innerText = `${Math.floor(count2.val)}+`;
        },
      });

      gsap.to(count3, {
        val: 100,
        duration: 2.4,
        ease: 'power2.out',
        scrollTrigger: statsTrigger,
        onUpdate: () => {
          if (stat3Ref.current) stat3Ref.current.innerText = `${Math.floor(count3.val)}%`;
        },
      });

      gsap.to(count4, {
        val: 99,
        duration: 2.3,
        ease: 'power2.out',
        scrollTrigger: statsTrigger,
        onUpdate: () => {
          if (stat4Ref.current) stat4Ref.current.innerText = `${Math.floor(count4.val)}%`;
        },
      });

      // 3. Staggered reveal for key quality cards
      const cards = cardsContainerRef.current?.querySelectorAll('.quality-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.12,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 4. Parallax background floating shapes
      gsap.to('.about-parallax-1', {
        y: -100,
        rotate: 45,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      gsap.to('.about-parallax-2', {
        y: 80,
        rotate: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const qualities = [
    {
      title: 'Creative Engineering',
      desc: 'Merging procedural shaders, GLSL, and WebGL with responsive user interfaces.',
      tag: 'WebGL / Shaders',
      accent: 'from-cyan-500/20 to-blue-500/5',
      borderAccent: 'group-hover:border-cyan-400/50',
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Performance Obsessed',
      desc: 'Consistent 60+ FPS experiences with draw call batching, LODs, and zero lag.',
      tag: '60+ FPS Always',
      accent: 'from-purple-500/20 to-pink-500/5',
      borderAccent: 'group-hover:border-purple-400/50',
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Modern Architecture',
      desc: 'Built on Next.js App Router, React 19, TypeScript, and clean modular codebases.',
      tag: 'Scalable Systems',
      accent: 'from-amber-500/20 to-orange-500/5',
      borderAccent: 'group-hover:border-amber-400/50',
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'Sensory Storytelling',
      desc: 'Captivating users through micro-interactions, spatial audio, and cinematic choreography.',
      tag: 'Immersive Motion',
      accent: 'from-emerald-500/20 to-cyan-500/5',
      borderAccent: 'group-hover:border-emerald-400/50',
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full min-h-screen py-24 sm:py-32 bg-[#0a0a0a] text-white overflow-hidden"
    >
      {/* Parallax background ambient orbs */}
      <div className="about-parallax-1 absolute top-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="about-parallax-2 absolute bottom-20 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Cyber grid lines in background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-400 mb-6 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          01. About Me
        </div>

        {/* Split Layout: Left Text / Right 3D Element */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Story & Philosophy */}
          <div ref={textContainerRef} className="lg:col-span-7 flex flex-col space-y-6">
            <h2
              ref={headlineRef}
              className="reveal-line text-3xl sm:text-5xl font-black tracking-tight leading-tight"
            >
              Transforming imagination into{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-300 bg-clip-text text-transparent">
                tactile digital reality.
              </span>
            </h2>

            <p className="reveal-line text-base sm:text-lg text-neutral-300 font-light leading-relaxed">
              I am a specialized creative developer crafting real-time 3D web experiences, WebGL graphics, and high-performance digital products. My work sits at the intersection of mathematical graphics programming and emotional interface design.
            </p>

            <p className="reveal-line text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
              Every project is an opportunity to challenge the conventional constraints of the web browser. By combining WebGL shaders, Three.js, and modern React architectures, I bring depth, physics, and cinematic dynamism to projects worldwide.
            </p>

            {/* Stats Counter Section */}
            <div
              ref={statsContainerRef}
              className="reveal-line pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col">
                <span
                  ref={stat1Ref}
                  className="text-2xl sm:text-3xl font-black text-cyan-400 tabular-nums"
                >
                  0+
                </span>
                <span className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-wider">
                  Years Experience
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col">
                <span
                  ref={stat2Ref}
                  className="text-2xl sm:text-3xl font-black text-purple-400 tabular-nums"
                >
                  0+
                </span>
                <span className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-wider">
                  Projects Shipped
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col">
                <span
                  ref={stat3Ref}
                  className="text-2xl sm:text-3xl font-black text-amber-400 tabular-nums"
                >
                  0%
                </span>
                <span className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-wider">
                  Passion & Focus
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col">
                <span
                  ref={stat4Ref}
                  className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums"
                >
                  0%
                </span>
                <span className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-wider">
                  Client Satisfaction
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Scene / Avatar Placeholder */}
          <div className="lg:col-span-5 relative w-full aspect-square max-w-md mx-auto lg:max-w-none">
            {/* Cybernetic HUD Frame */}
            <div className="relative w-full h-full rounded-2xl p-1 bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-transparent border border-white/10 backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-2xl">
              {/* Corner HUD Markers */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

              {/* Status Header */}
              <div className="relative z-10 flex items-center justify-between p-4 text-[10px] font-mono text-neutral-400 border-b border-white/10">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                  AVATAR_SYS.ACTIVE
                </span>
                <span className="tabular-nums">POS: [37.7749, -122.4194]</span>
              </div>

              {/* 3D Scene Container */}
              <div
                id="about-canvas"
                className="relative flex-1 w-full min-h-[320px] flex items-center justify-center p-2"
              >
                <CyberCharacter3D className="w-full h-full min-h-[300px]" />

                {/* Subtext info */}
                <div className="absolute bottom-2 inset-x-4 text-center pointer-events-none">
                  <p className="text-[10px] font-mono text-cyan-400/80 bg-black/60 px-3 py-1 rounded-full inline-block backdrop-blur-sm border border-white/5">
                    ✦ Interactive 3D Mascot • Tracks Cursor & Audio
                  </p>
                </div>
              </div>

              {/* Bottom Telemetry Bar */}
              <div className="relative z-10 flex items-center justify-between p-3 text-[9px] font-mono text-neutral-500 border-t border-white/5 bg-black/40">
                <span>BUFFER: 1024K</span>
                <span>FPS: 60.0</span>
                <span>GL_RENDERER: R3F</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Qualities - Glassmorphic Cards Grid */}
        <div className="mt-20">
          <div className="mb-8">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              Core Competencies & Principles
            </h3>
          </div>

          <div
            ref={cardsContainerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {qualities.map((item, index) => (
              <div
                key={index}
                className={`quality-card group relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 ${item.borderAccent} transition-all duration-500 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}
              >
                {/* Background glow on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10 flex flex-col">
                  {/* Icon & Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/5">
                      {item.tag}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>

                <div className="relative z-10 pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-500 group-hover:text-neutral-300 transition-colors">
                  <span>CAPABILITY</span>
                  <span>0{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
