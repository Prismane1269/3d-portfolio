'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneLoadingIndicator } from '@/components/3d/SceneLoader';

const SkillSphere = dynamic(() => import('@/components/3d/SkillSphere'), {
  ssr: false,
  loading: () => <SceneLoadingIndicator label="CALIBRATING SKILL SPHERE" />,
});

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SkillItem {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  description: string;
  accent: string;
  borderAccent: string;
  iconBg: string;
  icon: React.ReactNode;
  skills: SkillItem[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend Engineering',
    description: 'Developing high-performance, accessible, and reactive user interfaces.',
    accent: 'from-cyan-500/20 to-blue-500/5',
    borderAccent: 'group-hover:border-cyan-400/50',
    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    skills: [
      { name: 'React 19 & Next.js App Router', level: 98 },
      { name: 'TypeScript', level: 95 },
      { name: 'Tailwind CSS & CSS Architecture', level: 96 },
      { name: 'Canvas API & SVG Animation', level: 90 },
      { name: 'HTML5 Semantic Web', level: 98 },
    ],
  },
  {
    title: '3D & Creative Coding',
    description: 'Immersive spatial rendering, procedural physics, and GLSL shading.',
    accent: 'from-purple-500/20 to-pink-500/5',
    borderAccent: 'group-hover:border-purple-400/50',
    iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    skills: [
      { name: 'Three.js & React Three Fiber', level: 95 },
      { name: 'GLSL Custom Shaders', level: 90 },
      { name: 'GSAP & ScrollTrigger Choreography', level: 96 },
      { name: 'Blender 3D Modeling & UVs', level: 85 },
      { name: 'Post-Processing & Bloom FX', level: 92 },
    ],
  },
  {
    title: 'Backend & Cloud',
    description: 'Reliable microservices, database schemas, and streaming architectures.',
    accent: 'from-amber-500/20 to-orange-500/5',
    borderAccent: 'group-hover:border-amber-400/50',
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    skills: [
      { name: 'Node.js & Express / NestJS', level: 92 },
      { name: 'Python & FastAPI', level: 88 },
      { name: 'PostgreSQL, Supabase & Prisma', level: 90 },
      { name: 'GraphQL & REST APIs', level: 94 },
      { name: 'Redis Cache & Pub/Sub', level: 84 },
    ],
  },
  {
    title: 'Architecture & DevOps',
    description: 'Container orchestration, CI/CD, and real-time performance profiling.',
    accent: 'from-emerald-500/20 to-teal-500/5',
    borderAccent: 'group-hover:border-emerald-400/50',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    skills: [
      { name: 'Git & Automated GitHub Actions', level: 95 },
      { name: 'Docker & Microservices', level: 86 },
      { name: 'Vite & Turbopack Toolchains', level: 92 },
      { name: 'Lighthouse Performance & Core Vitals', level: 96 },
      { name: 'Figma Design System Translation', level: 94 },
    ],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const sphereContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Skill bars animation
      const barElements = sectionRef.current?.querySelectorAll('.skill-bar-fill');
      if (barElements && barElements.length > 0) {
        barElements.forEach((bar) => {
          const targetWidth = bar.getAttribute('data-level') || '0';
          gsap.fromTo(
            bar,
            { width: '0%' },
            {
              width: `${targetWidth}%`,
              duration: 1.4,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: bar,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }

      // 2. Staggered reveal for skill category cards
      const categoryCards = gridRef.current?.querySelectorAll('.skill-category-card');
      if (categoryCards && categoryCards.length > 0) {
        gsap.fromTo(
          categoryCards,
          { y: 50, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.15,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 3. 3D Sphere placeholder rotation & pulse
      if (sphereContainerRef.current) {
        gsap.to('.sphere-orbit-1', {
          rotateZ: 360,
          repeat: -1,
          duration: 25,
          ease: 'none',
        });
        gsap.to('.sphere-orbit-2', {
          rotateZ: -360,
          repeat: -1,
          duration: 35,
          ease: 'none',
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full min-h-screen py-24 sm:py-32 bg-[#0a0a0a] text-white overflow-hidden"
    >
      {/* Background radial gradient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-600/10 via-purple-600/10 to-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-400 mb-4 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            03. Skills & Capabilities
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Mastery Across the Full Creative Spectrum
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            Bridging interactive WebGL graphics with enterprise-scale frontend architecture, high-throughput APIs, and polished user journeys.
          </p>
        </div>

        {/* 3D SkillSphere Interactive Placeholder */}
        <div
          ref={sphereContainerRef}
          className="relative max-w-xl mx-auto mb-20 p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Subtle cyber background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Interactive 3D SkillSphere */}
          <div
            id="skills-sphere-canvas"
            className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center"
          >
            <SkillSphere className="w-full h-full" />
          </div>

          <div className="mt-2 text-center">
            <span className="text-xs font-mono text-neutral-400 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Click or drag skills to explore 3D cluster
            </span>
          </div>
        </div>

        {/* Skill Categories Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {skillCategories.map((category, idx) => (
            <div
              key={idx}
              className={`skill-category-card group relative p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 ${category.borderAccent} transition-all duration-500 shadow-xl`}
            >
              {/* Category Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-3 rounded-xl border ${category.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Skills List with Animated Progress Bars */}
              <div className="space-y-4">
                {category.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-neutral-300 font-medium">{skill.name}</span>
                      <span className="text-neutral-400 font-semibold tabular-nums">
                        {skill.level}%
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-white/10 p-[1px] overflow-hidden">
                      <div
                        className="skill-bar-fill h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                        data-level={skill.level}
                        style={{ width: '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Category Footer */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>SECTOR 0{idx + 1}</span>
                <span className="text-cyan-400 font-semibold">OPTIMIZED</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
