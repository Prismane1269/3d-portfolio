'use client';

import React, { useRef, useEffect, useSyncExternalStore, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from '@react-three/postprocessing';
import ParticleField from './ParticleField';
import FloatingGeometry from './FloatingGeometry';

export interface HeroSceneProps {
  className?: string;
  style?: React.CSSProperties;
  enablePostProcessing?: boolean;
  interactive?: boolean;
}

/**
 * Camera controller handling initial dramatic zoom animation,
 * interactive cursor parallax, and smooth scroll response.
 */
const HeroCameraController: React.FC<{ interactive?: boolean }> = ({ interactive = true }) => {
  const startTime = useRef<number | null>(null);
  const scrollRef = useRef(0);
  const smoothScroll = useRef(0);
  const mouseTarget = useRef(new THREE.Vector2(0, 0));
  const smoothMouse = useRef(new THREE.Vector2(0, 0));

  // Initial camera position (zoomed far back) -> Target hero position
  const startPos = useRef(new THREE.Vector3(0, 3.5, 24));
  const targetPos = useRef(new THREE.Vector3(0, 0.2, 8.5));
  const isInitialComplete = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollRef.current = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouseTarget.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseTarget.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive]);

  useFrame((state) => {
    if (startTime.current === null) {
      startTime.current = state.clock.getElapsedTime();
    }

    const elapsed = state.clock.getElapsedTime() - startTime.current;
    const duration = 2.4; // seconds for initial dramatic zoom
    const rawProgress = Math.min(1, elapsed / duration);
    // Cubic ease-out
    const easeProgress = 1 - Math.pow(1 - rawProgress, 3);

    if (rawProgress >= 1) {
      isInitialComplete.current = true;
    }

    // Smooth scroll interpolation
    smoothScroll.current = THREE.MathUtils.lerp(smoothScroll.current, scrollRef.current, 0.06);

    // Smooth mouse parallax interpolation
    smoothMouse.current.x = THREE.MathUtils.lerp(smoothMouse.current.x, mouseTarget.current.x, 0.05);
    smoothMouse.current.y = THREE.MathUtils.lerp(smoothMouse.current.y, mouseTarget.current.y, 0.05);

    // Compute base position from initial zoom
    const currentBase = new THREE.Vector3().lerpVectors(
      startPos.current,
      targetPos.current,
      easeProgress
    );

    // Add scroll tracking (moves down and slightly tilts)
    const scrollOffsetY = -smoothScroll.current * 7.5;
    const scrollOffsetZ = smoothScroll.current * 3.2;

    // Add mouse parallax displacement
    const mouseOffsetX = smoothMouse.current.x * 0.8;
    const mouseOffsetY = smoothMouse.current.y * 0.5;

    state.camera.position.x = currentBase.x + mouseOffsetX;
    state.camera.position.y = currentBase.y + scrollOffsetY + mouseOffsetY;
    state.camera.position.z = currentBase.z + scrollOffsetZ;

    // Camera look-at target adjusts with scroll and mouse
    const lookTarget = new THREE.Vector3(
      mouseOffsetX * 0.35,
      scrollOffsetY * 0.6 + mouseOffsetY * 0.25,
      0
    );
    state.camera.lookAt(lookTarget);
  });

  return null;
};

/**
 * Lighting rig tailored for dark aesthetic with cyan, purple, and gold accents
 */
const HeroLighting: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.4} color="#1e1b4b" />
      {/* Cyan primary key light */}
      <directionalLight
        position={[6, 8, 5]}
        intensity={2.2}
        color="#00f5ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Deep Purple backlight for rim highlights */}
      <pointLight position={[-8, -4, -4]} intensity={3.0} color="#8b5cf6" distance={25} />
      {/* Warm Gold fill light from bottom */}
      <pointLight position={[0, -6, 4]} intensity={2.0} color="#fbbf24" distance={20} />
      {/* Pink accent highlight */}
      <pointLight position={[5, 4, -2]} intensity={1.8} color="#f472b6" distance={18} />
    </>
  );
};

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const HeroScene: React.FC<HeroSceneProps> = ({
  className = 'w-full h-full',
  style,
  enablePostProcessing = true,
  interactive = true,
}) => {
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  if (!mounted) {
    return (
      <div
        className={`relative w-full h-full bg-[#0a0a0a] overflow-hidden ${className}`}
        style={style}
      />
    );
  }

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const particleCount = isMobile ? 900 : 2200;
  const starCount = isMobile ? 1200 : 3000;
  const targetDpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, isMobile ? 1.25 : 1.5);

  return (
    <div
      className={`relative w-full h-full bg-[#0a0a0a] overflow-hidden ${className}`}
      style={style}
    >
      <Canvas
        dpr={targetDpr}
        gl={{
          antialias: !isMobile,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        camera={{ position: [0, 3.5, 24], fov: 45, near: 0.1, far: 1000 }}
      >
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 15, 38]} />

        <HeroCameraController interactive={interactive} />
        <HeroLighting />

        <Suspense fallback={null}>
          {/* Cosmic background stars */}
          <Stars
            radius={60}
            depth={50}
            count={starCount}
            factor={3.5}
            saturation={0.4}
            fade
            speed={1.0}
          />

          {/* Central Animated Galaxy Particle Field */}
          <ParticleField
            count={particleCount}
            radius={13}
            arms={3}
            speed={0.35}
            mouseRadius={2.8}
            repelStrength={1.8}
            interactive={interactive}
          />

          {/* Floating Geometric Elements with Distort and Wireframe variants */}
          <FloatingGeometry scale={isMobile ? 0.8 : 1} parallaxIntensity={isMobile ? 0.7 : 1.3} interactive={interactive} />

          {/* Post Processing Effects - Adaptive for 60-120fps Mobile & Desktop */}
          {enablePostProcessing && (
            <EffectComposer multisampling={isMobile ? 0 : 2}>
              <Bloom
                luminanceThreshold={0.3}
                luminanceSmoothing={0.85}
                intensity={isMobile ? 0.8 : 1.1}
                mipmapBlur={!isMobile}
              />
              {!isMobile && (
                <ChromaticAberration
                  offset={new THREE.Vector2(0.001, 0.001)}
                  radialModulation={false}
                  modulationOffset={0.15}
                />
              )}
              <Vignette eskil={false} offset={0.15} darkness={0.95} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
