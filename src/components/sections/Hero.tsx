'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '../ui/SmoothScroll';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollTo } = useLenis();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    scrollTo(target, { offset: 0, duration: 1.5 });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial entrance animation
      const letters = titleRef.current?.querySelectorAll('.hero-letter');
      const introTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // Nav bar slide down
      introTl.fromTo(
        navRef.current,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }
      );

      // Status badge
      introTl.fromTo(
        '.hero-badge',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.6'
      );

      // Letter reveal with stagger
      if (letters && letters.length > 0) {
        introTl.fromTo(
          letters,
          {
            y: 110,
            opacity: 0,
            rotateZ: 4,
          },
          {
            y: 0,
            opacity: 1,
            rotateZ: 0,
            stagger: 0.035,
            duration: 1,
          },
          '-=0.5'
        );
      }

      // Subtitle fade in
      if (subtitleRef.current) {
        introTl.fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0, filter: 'blur(8px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1 },
          '-=0.6'
        );
      }

      // CTA buttons
      if (ctaRef.current) {
        introTl.fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.6'
        );
      }

      // Scroll indicator fade in
      if (scrollIndicatorRef.current) {
        introTl.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.4'
        );
      }

      // 2. ScrollTrigger Pinning and scroll-out animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=80%',
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      scrollTl.to(heroContentRef.current, {
        y: -120,
        opacity: 0,
        scale: 0.92,
        ease: 'power2.in',
      });

      scrollTl.to(
        scrollIndicatorRef.current,
        {
          opacity: 0,
          y: 20,
          ease: 'power2.in',
        },
        0
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const word1 = 'Creative';
  const word2 = 'Developer';

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen min-h-[680px] overflow-hidden flex flex-col justify-between bg-black text-white select-none"
    >
      {/* 3D Scene placeholder */}
      <div
        id="hero-canvas"
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        {/* Subtle atmospheric ambient glow behind 3D space */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-600/15 via-purple-700/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* Glassmorphic Navigation Bar */}
      <nav
        ref={navRef}
        className="relative z-40 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5"
      >
        <div className="flex items-center justify-between px-6 py-3.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-2 text-lg sm:text-xl font-black tracking-widest text-white group"
            data-cursor="pointer"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] group-hover:scale-125 transition-transform" />
            <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-purple-400 transition-colors">
              TASEEN
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, '#about')}
              className="hover:text-cyan-400 transition-colors duration-200"
              data-cursor="pointer"
            >
              About
            </a>
            <a
              href="#projects"
              onClick={(e) => handleNavClick(e, '#projects')}
              className="hover:text-cyan-400 transition-colors duration-200"
              data-cursor="pointer"
            >
              Work
            </a>
            <a
              href="#skills"
              onClick={(e) => handleNavClick(e, '#skills')}
              className="hover:text-cyan-400 transition-colors duration-200"
              data-cursor="pointer"
            >
              Skills
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="hover:text-cyan-400 transition-colors duration-200"
              data-cursor="pointer"
            >
              Contact
            </a>
          </div>

          {/* Right Action */}
          <div className="hidden md:flex items-center">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="relative px-5 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-white rounded-full hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all duration-300"
              data-cursor="pointer"
            >
              Let&apos;s Talk
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-neutral-300 hover:text-white p-1 focus:outline-none"
            aria-label="Toggle navigation menu"
            data-cursor="pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 rounded-2xl bg-black/90 backdrop-blur-2xl border border-white/10 flex flex-col gap-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, '#about')}
              className="px-3 py-2 text-sm text-neutral-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg"
            >
              About
            </a>
            <a
              href="#projects"
              onClick={(e) => handleNavClick(e, '#projects')}
              className="px-3 py-2 text-sm text-neutral-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg"
            >
              Work
            </a>
            <a
              href="#skills"
              onClick={(e) => handleNavClick(e, '#skills')}
              className="px-3 py-2 text-sm text-neutral-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg"
            >
              Skills
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="px-3 py-2 text-sm text-neutral-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg"
            >
              Contact
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="mt-2 w-full text-center py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-cyan-400 rounded-xl"
            >
              Let&apos;s Talk
            </a>
          </div>
        )}
      </nav>

      {/* Main Center Content */}
      <div
        ref={heroContentRef}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center my-auto py-12"
      >
        {/* Availability Badge */}
        <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-mono text-cyan-400 mb-6 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          AVAILABLE FOR FREELANCE & CREATIVE ROLES
        </div>

        {/* Animated Stagger Headline */}
        <h1
          ref={titleRef}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.95] flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2 mb-6"
        >
          {/* Word 1: Creative */}
          <span className="inline-flex overflow-hidden">
            {word1.split('').map((char, index) => (
              <span
                key={`w1-${index}`}
                className="hero-letter inline-block text-white"
              >
                {char}
              </span>
            ))}
          </span>

          {/* Word 2: Developer with Gradient */}
          <span className="inline-flex overflow-hidden bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 bg-clip-text text-transparent">
            {word2.split('').map((char, index) => (
              <span
                key={`w2-${index}`}
                className="hero-letter inline-block"
              >
                {char}
              </span>
            ))}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl md:text-2xl font-light text-neutral-300 max-w-2xl mx-auto leading-relaxed mb-8"
        >
          Crafting Digital Experiences in 3D. Bridging the gap between cutting-edge WebGL engineering and interactive narrative.
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <a
            href="#projects"
            onClick={(e) => handleNavClick(e, '#projects')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium text-sm tracking-wide shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
            data-cursor="pointer"
          >
            <span>Explore Projects</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 hover:bg-white/10 text-neutral-200 font-medium text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2"
            data-cursor="pointer"
          >
            Get In Touch
          </a>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="relative z-20 pb-8 flex flex-col items-center justify-center"
      >
        <a
          href="#about"
          onClick={(e) => handleNavClick(e, '#about')}
          className="group flex flex-col items-center gap-2 text-xs font-mono text-neutral-400 hover:text-cyan-400 transition-colors"
          data-cursor="pointer"
          data-cursor-text="Scroll"
        >
          <span className="tracking-widest uppercase text-[10px]">Scroll Down</span>
          <div className="w-5 h-9 rounded-full border border-white/20 flex items-start justify-center p-1 group-hover:border-cyan-400 transition-colors">
            <span className="w-1 h-2 rounded-full bg-cyan-400 animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
}
