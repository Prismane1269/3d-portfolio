'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  gradient: string;
  accentColor: string;
  liveUrl: string;
  githubUrl: string;
  year: string;
  stats: string;
}

const projects: Project[] = [
  {
    id: 'cyber-2099',
    title: 'CYBERSPACE 2099',
    category: 'Real-Time WebGL Cityscape',
    description:
      'A dense, volumetric cyberpunk metropolis rendered in real-time inside the browser. Features raymarched fog, neon Bloom post-processing, and interactive procedural traffic paths.',
    tags: ['Three.js', 'GLSL Shaders', 'Web Audio API', 'React 19'],
    gradient: 'from-cyan-950 via-slate-900 to-indigo-950',
    accentColor: '#22d3ee',
    liveUrl: '#',
    githubUrl: '#',
    year: '2026',
    stats: '60 FPS • Raymarching',
  },
  {
    id: 'nebula-protocol',
    title: 'NEBULA PROTOCOL',
    category: 'Spatial DeFi Visualization',
    description:
      'Next-generation blockchain analytics platform mapping multi-chain liquidity flows into an interactive 3D solar system. Users can orbit liquidity nodes and simulate yield topologies.',
    tags: ['Next.js', 'Three.js', 'Tailwind CSS', 'TypeScript'],
    gradient: 'from-purple-950 via-zinc-900 to-neutral-950',
    accentColor: '#c084fc',
    liveUrl: '#',
    githubUrl: '#',
    year: '2025',
    stats: '150k Nodes • Real-Time',
  },
  {
    id: 'aura-spatial',
    title: 'AURA SPATIAL',
    category: 'Spatial Audio & WebXR',
    description:
      'Immersive WebXR audio installation reacting dynamically to user head position and acoustic frequencies. Custom audio-reactive shaders ripple across organic geometry.',
    tags: ['WebXR', 'React Three Fiber', 'GSAP', 'GLSL'],
    gradient: 'from-amber-950 via-stone-900 to-zinc-950',
    accentColor: '#fbbf24',
    liveUrl: '#',
    githubUrl: '#',
    year: '2025',
    stats: 'Spatial Audio • WebXR',
  },
  {
    id: 'chronos-engine',
    title: 'CHRONOS ENGINE',
    category: 'Generative 3D Sculptures',
    description:
      'A mathematical procedural art generator converting chaotic attractors (Lorenz, Rossler) into exportable 3D wireframes and physical digital artifacts.',
    tags: ['WebGPU', 'TypeScript', 'Math Shaders', 'Three.js'],
    gradient: 'from-emerald-950 via-teal-950 to-neutral-950',
    accentColor: '#34d399',
    liveUrl: '#',
    githubUrl: '#',
    year: '2024',
    stats: 'WebGPU • 1M Particles',
  },
  {
    id: 'kinesis-atelier',
    title: 'KINESIS ATELIER',
    category: 'Interactive 3D E-Commerce',
    description:
      'Luxury interactive product visualizer with real-time cloth physics simulation, customizable studio lighting, and zero-latency material switching.',
    tags: ['Three.js', 'Cannon.js', 'Next.js', 'Lenis'],
    gradient: 'from-rose-950 via-zinc-900 to-stone-950',
    accentColor: '#fb7185',
    liveUrl: '#',
    githubUrl: '#',
    year: '2024',
    stats: 'Cloth Physics • 4K PBR',
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Underline scale animation on scroll
      if (underlineRef.current) {
        gsap.fromTo(
          underlineRef.current,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: underlineRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // 2. Horizontal Scroll with ScrollTrigger Pinning
      const track = trackRef.current;
      const trigger = triggerRef.current;

      if (track && trigger) {
        const getScrollDistance = () => {
          return track.scrollWidth - window.innerWidth + 120;
        };

        const horizontalTween = gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: trigger,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.width = `${self.progress * 100}%`;
              }
            },
          },
        });

        return () => {
          horizontalTween.kill();
        };
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // 3D Tilt handlers (disabled on touch devices for fluid scrolling)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative w-full bg-black text-white overflow-hidden"
    >
      {/* Pinned Container for Horizontal Scroll */}
      <div
        ref={triggerRef}
        className="relative w-full h-[100dvh] min-h-[580px] flex flex-col justify-between py-6 sm:py-14 overflow-hidden"
      >
        {/* Section Header */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-400 mb-3 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                02. Selected Works
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Featured 3D Projects
              </h2>
              {/* Animated Underline */}
              <div
                ref={underlineRef}
                className="h-[3px] w-48 sm:w-64 mt-3 bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 rounded-full"
              />
            </div>

            {/* Scroll instruction indicator */}
            <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>SCROLL DOWN TO EXPLORE HORIZONTALLY</span>
              <svg className="w-4 h-4 animate-bounce text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Horizontal Track */}
        <div className="relative z-10 w-full overflow-visible my-auto">
          <div
            ref={trackRef}
            className="flex items-center gap-6 sm:gap-8 px-4 sm:px-12 w-max"
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="group relative w-[320px] sm:w-[420px] md:w-[480px] lg:w-[520px] h-[480px] sm:h-[520px] rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 ease-out will-change-transform shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
                data-cursor="pointer"
                data-cursor-text="View"
              >
                {/* 3D Mockup Visual Area */}
                <div
                  className={`relative w-full h-56 rounded-xl overflow-hidden bg-gradient-to-br ${project.gradient} border border-white/10 flex flex-col justify-between p-4`}
                >
                  {/* Decorative glowing gradient orb */}
                  <div
                    className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-40 pointer-events-none"
                    style={{ backgroundColor: project.accentColor }}
                  />

                  {/* Top Bar of Mockup */}
                  <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-white/70">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-cyan-300">
                      {project.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-md border border-white/10 text-white/60">
                      {project.year}
                    </span>
                  </div>

                  {/* Mockup Center Cyber Graphics */}
                  <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                    <div className="w-16 h-16 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                      <svg
                        className="w-8 h-8 text-white transition-colors duration-300"
                        style={{ color: project.accentColor }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Mockup Bottom Details */}
                  <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-ping"
                        style={{ backgroundColor: project.accentColor }}
                      />
                      {project.stats}
                    </span>
                    <span>INDEX: 0{index + 1}</span>
                  </div>
                </div>

                {/* Project Details */}
                <div className="flex flex-col mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed line-clamp-3 mb-4">
                    {project.description}
                  </p>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.map((tag, tIndex) => (
                      <span
                        key={tIndex}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/5 border border-white/10 text-neutral-300 group-hover:border-cyan-400/30 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Links */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-medium">
                  <a
                    href={project.liveUrl}
                    className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold group/link"
                  >
                    <span>View Interactive Demo</span>
                    <svg
                      className="w-3.5 h-3.5 group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>

                  <a
                    href={project.githubUrl}
                    className="text-neutral-400 hover:text-white transition-colors"
                    title="Source Code"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Horizontal Progress Bar */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
            <span>PROJECT NAVIGATION</span>
            <span>01 / 0{projects.length}</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full w-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 rounded-full transition-all duration-75"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
