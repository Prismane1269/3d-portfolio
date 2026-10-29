'use client';

import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';

export interface FloatingGeometryProps {
  /** Optional scroll progress (0 to 1). If omitted, listens to window scroll. */
  scrollProgress?: number;
  /** Global scale factor */
  scale?: number;
  /** Parallax intensity factor */
  parallaxIntensity?: number;
  /** Enable interactive hover reactivity */
  interactive?: boolean;
}

interface ShapeItemProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  parallaxFactor: number;
  floatSpeed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
  floatingRange?: [number, number];
  interactive?: boolean;
  children: (hovered: boolean) => React.ReactNode;
}

const ParallaxFloatShape: React.FC<
  ShapeItemProps & { scrollProgressRef: React.MutableRefObject<number> }
> = ({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  parallaxFactor,
  floatSpeed = 1.5,
  rotationIntensity = 1,
  floatIntensity = 1,
  floatingRange = [-0.15, 0.15],
  interactive = true,
  scrollProgressRef,
  children,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const currentScale = useRef(scale);

  useFrame(() => {
    if (!groupRef.current) return;
    const scroll = scrollProgressRef.current;
    const targetY = position[1] - scroll * parallaxFactor * 10;
    const targetRotX = rotation[0] + scroll * parallaxFactor * Math.PI;
    const targetRotZ = rotation[2] + scroll * (parallaxFactor * 0.5) * Math.PI;

    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.06);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.06);

    const targetScale = hovered && interactive ? scale * 1.18 : scale;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.1);
    groupRef.current.scale.setScalar(currentScale.current);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        if (!interactive) return;
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => {
        if (!interactive) return;
        setHovered(false);
      }}
    >
      <Float
        speed={floatSpeed * (hovered && interactive ? 2.0 : 1.0)}
        rotationIntensity={rotationIntensity * (hovered && interactive ? 1.5 : 1.0)}
        floatIntensity={floatIntensity}
        floatingRange={floatingRange}
      >
        {children(hovered && interactive)}
      </Float>
    </group>
  );
};

export const FloatingGeometry: React.FC<FloatingGeometryProps> = ({
  scrollProgress,
  scale = 1,
  parallaxIntensity = 1.2,
  interactive = true,
}) => {
  const internalScroll = useRef(0);
  const smoothScroll = useRef(0);

  // Auto-listen to window scroll if scrollProgress is undefined
  useEffect(() => {
    if (typeof scrollProgress === 'number') return;
    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      internalScroll.current = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollProgress]);

  useFrame(() => {
    const target = typeof scrollProgress === 'number' ? scrollProgress : internalScroll.current;
    smoothScroll.current = THREE.MathUtils.lerp(smoothScroll.current, target, 0.08);
  });

  return (
    <group scale={scale}>
      {/* 1. Main Iridescent Torus Knot (Purple & Blue distorted metallic) */}
      <ParallaxFloatShape
        position={[4.2, 1.8, -2.5]}
        rotation={[0.4, 0.2, 0.1]}
        scale={0.9}
        parallaxFactor={0.9 * parallaxIntensity}
        floatSpeed={1.8}
        rotationIntensity={1.4}
        floatIntensity={1.2}
        interactive={interactive}
        scrollProgressRef={smoothScroll}
      >
        {(hovered) => (
          <mesh castShadow receiveShadow>
            <torusKnotGeometry args={[1, 0.32, 128, 32]} />
            <MeshDistortMaterial
              color="#8b5cf6"
              emissive="#3b0764"
              emissiveIntensity={hovered ? 0.8 : 0.3}
              roughness={0.15}
              metalness={0.88}
              distort={hovered ? 0.55 : 0.32}
              speed={hovered ? 3.5 : 1.8}
            />
          </mesh>
        )}
      </ParallaxFloatShape>

      {/* 2. Cyber Wireframe Icosahedron with Gold Core (Top-Left) */}
      <ParallaxFloatShape
        position={[-4.5, 2.5, -3.2]}
        rotation={[0.6, 0.8, 0.3]}
        scale={1.1}
        parallaxFactor={1.3 * parallaxIntensity}
        floatSpeed={2.2}
        rotationIntensity={1.6}
        floatIntensity={1.5}
        scrollProgressRef={smoothScroll}
      >
        {(hovered) => (
          <group>
            {/* Outer wireframe shell */}
            <mesh>
              <icosahedronGeometry args={[1.2, 1]} />
              <meshStandardMaterial
                color="#00f5ff"
                emissive="#00f5ff"
                emissiveIntensity={hovered ? 1.6 : 0.8}
                wireframe
                transparent
                opacity={0.85}
              />
            </mesh>
            {/* Inner distorted gold core */}
            <mesh>
              <octahedronGeometry args={[0.55, 0]} />
              <MeshDistortMaterial
                color="#fbbf24"
                emissive="#78350f"
                emissiveIntensity={0.6}
                roughness={0.1}
                metalness={0.9}
                distort={0.4}
                speed={2.5}
              />
            </mesh>
          </group>
        )}
      </ParallaxFloatShape>

      {/* 3. Golden Distorted Octahedron (Mid-Left foreground) */}
      <ParallaxFloatShape
        position={[-3.8, -2.0, -1.0]}
        rotation={[0.3, 0.5, 0.7]}
        scale={0.75}
        parallaxFactor={0.7 * parallaxIntensity}
        floatSpeed={1.6}
        rotationIntensity={1.2}
        floatIntensity={1.4}
        scrollProgressRef={smoothScroll}
      >
        {(hovered) => (
          <mesh castShadow receiveShadow>
            <octahedronGeometry args={[1.1, 2]} />
            <MeshDistortMaterial
              color="#fbbf24"
              emissive="#d97706"
              emissiveIntensity={hovered ? 0.9 : 0.35}
              roughness={0.2}
              metalness={0.85}
              distort={hovered ? 0.5 : 0.28}
              speed={2.2}
            />
          </mesh>
        )}
      </ParallaxFloatShape>

      {/* 4. Glowing Cyan Torus Ring (Bottom-Right) */}
      <ParallaxFloatShape
        position={[3.9, -2.4, -2.0]}
        rotation={[1.2, 0.4, 0.9]}
        scale={0.85}
        parallaxFactor={1.1 * parallaxIntensity}
        floatSpeed={2.0}
        rotationIntensity={1.8}
        floatIntensity={1.1}
        scrollProgressRef={smoothScroll}
      >
        {(hovered) => (
          <group>
            <mesh castShadow receiveShadow>
              <torusGeometry args={[1.1, 0.18, 32, 64]} />
              <meshStandardMaterial
                color="#00f5ff"
                emissive="#0891b2"
                emissiveIntensity={hovered ? 1.2 : 0.5}
                roughness={0.1}
                metalness={0.95}
              />
            </mesh>
            {/* Outer wireframe ring accent */}
            <mesh>
              <torusGeometry args={[1.4, 0.04, 16, 48]} />
              <meshBasicMaterial
                color="#f472b6"
                wireframe
                transparent
                opacity={0.65}
              />
            </mesh>
          </group>
        )}
      </ParallaxFloatShape>

      {/* 5. Pink Dodecahedron (Deep Background Right) */}
      <ParallaxFloatShape
        position={[2.5, 3.8, -5.5]}
        rotation={[0.2, 0.9, 0.4]}
        scale={0.7}
        parallaxFactor={1.5 * parallaxIntensity}
        floatSpeed={1.2}
        rotationIntensity={0.8}
        floatIntensity={0.9}
        scrollProgressRef={smoothScroll}
      >
        {(hovered) => (
          <mesh>
            <dodecahedronGeometry args={[1.0, 0]} />
            <MeshDistortMaterial
              color="#f472b6"
              emissive="#831843"
              emissiveIntensity={hovered ? 0.7 : 0.25}
              roughness={0.25}
              metalness={0.75}
              distort={0.25}
              speed={1.5}
            />
          </mesh>
        )}
      </ParallaxFloatShape>

      {/* 6. Wireframe Diamond / Crystal Satellite (Floating Center-Left) */}
      <ParallaxFloatShape
        position={[-1.8, 3.2, -4.0]}
        rotation={[0.8, 0.2, 0.5]}
        scale={0.45}
        parallaxFactor={1.4 * parallaxIntensity}
        floatSpeed={2.8}
        rotationIntensity={2.0}
        floatIntensity={1.8}
        scrollProgressRef={smoothScroll}
      >
        {() => (
          <mesh>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#00f5ff"
              emissive="#00f5ff"
              emissiveIntensity={1.2}
              wireframe
            />
          </mesh>
        )}
      </ParallaxFloatShape>

      {/* 7. Tiny Golden Micro-Shards scattered for depth */}
      <ParallaxFloatShape
        position={[1.5, -3.2, -3.0]}
        rotation={[0.3, 0.6, 0.2]}
        scale={0.3}
        parallaxFactor={0.8 * parallaxIntensity}
        floatSpeed={3.0}
        rotationIntensity={2.5}
        floatIntensity={2.0}
        scrollProgressRef={smoothScroll}
      >
        {() => (
          <mesh>
            <tetrahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={0.9}
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>
        )}
      </ParallaxFloatShape>
    </group>
  );
};

export default FloatingGeometry;
