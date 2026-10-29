'use client';

import React from 'react';
import { useLenis } from '../ui/SmoothScroll';

const footerLinks = [
  { name: 'About', href: '#about' },
  { name: 'Work', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' },
];

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
  },
  {
    name: 'X (Twitter)',
    url: 'https://twitter.com',
  },
  {
    name: 'Discord',
    url: 'https://discord.com',
  },
];

export default function Footer() {
  const { scrollTo } = useLenis();

  const handleScrollToTop = () => {
    scrollTo(0, { duration: 1.5 });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollTo(href, { duration: 1.5 });
  };

  return (
    <footer className="relative w-full bg-black text-white border-t border-white/10 pt-16 pb-12 overflow-hidden select-none">
      {/* Top ambient glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/5">
          {/* Brand info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xl font-black tracking-widest text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                NEXUS
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-sm">
              Engineering cinematic 3D web experiences and next-generation interactive applications.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-wider text-neutral-400">
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="hover:text-cyan-400 transition-colors duration-200"
                data-cursor="pointer"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Back to top button */}
          <button
            onClick={handleScrollToTop}
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 text-xs font-mono text-neutral-300 hover:text-white transition-all duration-300 shadow-lg"
            data-cursor="pointer"
            data-cursor-text="Top"
          >
            <span>Back to top</span>
            <div className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:-translate-y-0.5 transition-transform">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
          </button>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div>
            © 2026 Creative 3D Studio. All rights reserved.
          </div>

          {/* Socials */}
          <div className="flex items-center gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors"
                data-cursor="pointer"
              >
                {social.name}
              </a>
            ))}
          </div>

          {/* WebGL Status */}
          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>WebGL 2.0 / 60 FPS Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
