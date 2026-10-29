'use client';

import React, { useRef, useState, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, MeshDistortMaterial } from '@react-three/drei';

export interface ProjectCard3DProps {
  title: string;
  description: string;
  tags?: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  accentColor?: string; // e.g. '#00f5ff' | '#8b5cf6' | '#fbbf24' | '#f472b6'
  category?: string;
  index?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * 3D Glass Card Mesh with interactive mouse tilt, specular highlights, and internal holographic floating gem
 */
export const ProjectCard3DMesh: React.FC<{
  accentColor: string;
  isHovered: boolean;
  mousePos: { x: number; y: number };
}> = ({ accentColor, isHovered, mousePos }) => {
  const cardGroupRef = useRef<THREE.Group>(null);
  const gemRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Smooth rotation and position targets
  const rotTargetX = useRef(0);
  const rotTargetY = useRef(0);
  const zPosTarget = useRef(0);

  useFrame((state, delta) => {
    if (!cardGroupRef.current) return;

    if (isHovered) {
      // Tilt responds to normalized mouse position [-1, 1]
      rotTargetX.current = -mousePos.y * 0.35;
      rotTargetY.current = mousePos.x * 0.45;
      zPosTarget.current = 0.4;
    } else {
      // Idle gentle floating sway
      const t = state.clock.getElapsedTime();
      rotTargetX.current = Math.sin(t * 1.2) * 0.05;
      rotTargetY.current = Math.cos(t * 0.9) * 0.06;
      zPosTarget.current = 0;
    }

    cardGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      cardGroupRef.current.rotation.x,
      rotTargetX.current,
      0.1
    );
    cardGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      cardGroupRef.current.rotation.y,
      rotTargetY.current,
      0.1
    );
    cardGroupRef.current.position.z = THREE.MathUtils.lerp(
      cardGroupRef.current.position.z,
      zPosTarget.current,
      0.1
    );

    // Dynamic reflection point light follows cursor across the card
    if (lightRef.current) {
      const lx = THREE.MathUtils.lerp(lightRef.current.position.x, mousePos.x * 2.5, 0.15);
      const ly = THREE.MathUtils.lerp(lightRef.current.position.y, mousePos.y * 3.5, 0.15);
      lightRef.current.position.set(lx, ly, 1.8);
      lightRef.current.intensity = isHovered ? 4.5 : 1.2;
    }

    // Spin internal holographic gem
    if (gemRef.current) {
      gemRef.current.rotation.x += delta * 0.8;
      gemRef.current.rotation.y += delta * 1.2;
    }
  });

  return (
    <group ref={cardGroupRef}>
      {/* Dynamic specular light following cursor */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 1.5]}
        color={accentColor}
        intensity={2.0}
        distance={8}
      />

      {/* Main Glassmorphic Card Slab */}
      <RoundedBox
        args={[3.8, 5.2, 0.22]}
        radius={0.2}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.12}
          metalness={0.1}
          transmission={0.88}
          ior={1.48}
          thickness={0.8}
          specularIntensity={1.0}
          specularColor={accentColor}
          transparent
          opacity={0.88}
          reflectivity={0.9}
        />
      </RoundedBox>

      {/* Glowing Outer Rim Border */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[3.84, 5.24]} />
        <meshBasicMaterial
          color={accentColor}
          wireframe
          transparent
          opacity={isHovered ? 0.65 : 0.25}
        />
      </mesh>

      {/* Internal Floating Holographic Icon / Gem */}
      <group position={[0, 1.1, 0.1]}>
        <mesh ref={gemRef} scale={isHovered ? 0.48 : 0.4}>
          <octahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={isHovered ? 1.5 : 0.8}
            roughness={0.1}
            metalness={0.9}
            distort={0.35}
            speed={2.2}
            wireframe
          />
        </mesh>
      </group>
    </group>
  );
};

export const ProjectCard3D: React.FC<ProjectCard3DProps> = ({
  title,
  description,
  tags = [],
  image,
  githubUrl,
  liveUrl,
  accentColor = '#00f5ff',
  category,
  index = 0,
  className = '',
  style,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={style}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${className}`}
    >
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Canvas
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          camera={{ position: [0, 0, 6.2], fov: 45 }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 5, 4]} intensity={1.5} color="#ffffff" />
          <Suspense fallback={null}>
            <ProjectCard3DMesh
              accentColor={accentColor}
              isHovered={isHovered}
              mousePos={mousePos}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Glassmorphic HTML Overlay Content */}
      <div
        className="relative z-10 flex flex-col justify-between p-6 h-full min-h-[420px] rounded-2xl border border-white/10 backdrop-blur-md bg-black/40 transition-colors duration-300"
        style={{
          boxShadow: isHovered
            ? `0 20px 40px -15px ${accentColor}33, inset 0 0 20px -5px ${accentColor}22`
            : '0 10px 30px -10px rgba(0,0,0,0.5)',
          borderColor: isHovered ? `${accentColor}88` : 'rgba(255,255,255,0.08)',
        }}
      >
        {/* Top Header: Category and Index */}
        <div className="flex items-center justify-between">
          {category ? (
            <span
              className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border"
              style={{
                color: accentColor,
                borderColor: `${accentColor}44`,
                backgroundColor: `${accentColor}11`,
              }}
            >
              {category}
            </span>
          ) : (
            <div />
          )}
          <span className="text-xs font-mono text-zinc-500">
            #{String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Center Space Reserved for 3D Holographic Gem / Optional Thumbnail */}
        <div className="h-28 flex items-center justify-center pointer-events-none relative overflow-hidden rounded-xl">
          {image && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-35 transition-opacity duration-300"
            />
          )}
        </div>

        {/* Bottom Content: Title, Description, Tags, Links */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-white transition-colors">
              {title}
            </h3>
            <p className="mt-2 text-sm text-zinc-300 line-clamp-3 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/[0.06] text-zinc-300 border border-white/[0.08]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Links */}
          {(liveUrl || githubUrl) && (
            <div className="flex items-center gap-3 pt-2">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-black transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: accentColor }}
                >
                  Live Demo
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 transition-colors"
                >
                  Code
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard3D;
