'use client';

import React, { useRef, useState, useSyncExternalStore, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export interface ContactSceneProps {
  className?: string;
  style?: React.CSSProperties;
  enableBloom?: boolean;
  interactive?: boolean;
}

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

// Pure deterministic pseudo-random generator
function createPRNG(seed = 9876) {
  let s = seed;
  return function next(): number {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Concentric orbital ring with orbiting satellite energy nodes
 */
const OrbitalRing: React.FC<{
  radius: number;
  tube: number;
  color: string;
  emissiveColor: string;
  speedX: number;
  speedY: number;
  speedZ: number;
  tilt: [number, number, number];
  nodeCount?: number;
}> = ({
  radius,
  tube,
  color,
  emissiveColor,
  speedX,
  speedY,
  speedZ,
  tilt,
  nodeCount = 2,
}) => {
  const ringRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.x += speedX * delta;
    ringRef.current.rotation.y += speedY * delta;
    ringRef.current.rotation.z += speedZ * delta;

    if (nodesRef.current) {
      nodesRef.current.rotation.z += (speedY * 1.5 + 0.5) * delta;
    }
  });

  return (
    <group rotation={tilt}>
      <group ref={ringRef}>
        {/* Torus Ring Mesh */}
        <mesh>
          <torusGeometry args={[radius, tube, 32, 100]} />
          <meshStandardMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={1.2}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>

        {/* Orbiting Satellite Nodes */}
        <group ref={nodesRef}>
          {Array.from({ length: nodeCount }).map((_, i) => {
            const angle = (i * 2 * Math.PI) / nodeCount;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return (
              <mesh key={i} position={[x, y, 0]}>
                <sphereGeometry args={[tube * 2.5, 16, 16]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={2.5}
                />
              </mesh>
            );
          })}
        </group>
      </group>
    </group>
  );
};

/**
 * Central morphing distorted sphere blob responding to cursor
 */
const MorphingBlob: React.FC<{ interactive?: boolean }> = ({ interactive = true }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<React.ElementRef<typeof MeshDistortMaterial>>(null);
  const [hovered, setHovered] = useState(false);
  const pointerTarget = useRef(new THREE.Vector2(0, 0));
  const smoothPointer = useRef(new THREE.Vector2(0, 0));

  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (interactive) {
      pointerTarget.current.set(
        (state.pointer.x * viewport.width) / 10,
        (state.pointer.y * viewport.height) / 10
      );
    }

    smoothPointer.current.lerp(pointerTarget.current, 0.08);

    // Gently rotate towards cursor
    meshRef.current.rotation.y += delta * (hovered ? 0.9 : 0.45);
    meshRef.current.rotation.x = smoothPointer.current.y * 0.45;
    meshRef.current.rotation.z = -smoothPointer.current.x * 0.45;

    // Distort adapts on hover
    if (materialRef.current) {
      const targetDistort = hovered ? 0.72 : 0.52;
      materialRef.current.distort = THREE.MathUtils.lerp(
        materialRef.current.distort,
        targetDistort,
        0.08
      );
    }

    // Breathing scale pulse
    const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 1.8) * 0.04;
    meshRef.current.scale.setScalar(hovered ? pulse * 1.12 : pulse);
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1.45, 64, 64]} />
        <MeshDistortMaterial
          ref={materialRef}
          color="#8b5cf6"
          emissive="#3b0764"
          emissiveIntensity={hovered ? 1.4 : 0.8}
          roughness={0.16}
          metalness={0.88}
          distort={0.52}
          speed={2.4}
        />
      </mesh>
    </Float>
  );
};

// Pure generator for sparkles
function generateSparkles(count: number) {
  const prng = createPRNG(54321);
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const palette = [
    new THREE.Color('#00f5ff'),
    new THREE.Color('#8b5cf6'),
    new THREE.Color('#fbbf24'),
  ];

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    pos[i3] = (prng() - 0.5) * 14;
    pos[i3 + 1] = (prng() - 0.5) * 14;
    pos[i3 + 2] = (prng() - 0.5) * 8 - 2;

    const c = palette[i % palette.length];
    col[i3] = c.r;
    col[i3 + 1] = c.g;
    col[i3 + 2] = c.b;
  }
  return { pos, col };
}

/**
 * Background floating sparkles
 */
const AmbientSparkles: React.FC<{ count?: number }> = ({ count = 40 }) => {
  const points = useRef<THREE.Points>(null);
  const sparkles = React.useMemo(() => generateSparkles(count), [count]);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.getElapsedTime() * 0.04;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[sparkles.pos, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[sparkles.col, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const ContactScene: React.FC<ContactSceneProps> = ({
  className = 'w-full h-full min-h-[460px]',
  style,
  enableBloom = true,
  interactive = true,
}) => {
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  if (!mounted) {
    return (
      <div
        className={`relative w-full h-full overflow-hidden ${className}`}
        style={style}
      />
    );
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={style}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        camera={{ position: [0, 0, 7.8], fov: 45 }}
      >
        <ambientLight intensity={0.5} color="#1e1b4b" />
        <pointLight position={[6, 6, 6]} intensity={2.5} color="#00f5ff" />
        <pointLight position={[-6, -6, -4]} intensity={2.2} color="#8b5cf6" />
        <pointLight position={[0, -4, 4]} intensity={1.5} color="#fbbf24" />

        <Suspense fallback={null}>
          <AmbientSparkles count={50} />

          {/* Central Distorted Blob */}
          <MorphingBlob interactive={interactive} />

          {/* Concentric Floating Rings */}
          {/* Inner Cyan Ring */}
          <OrbitalRing
            radius={2.3}
            tube={0.035}
            color="#00f5ff"
            emissiveColor="#0891b2"
            speedX={0.25}
            speedY={0.4}
            speedZ={0.15}
            tilt={[0.4, 0.2, 0.1]}
            nodeCount={3}
          />

          {/* Middle Gold Ring */}
          <OrbitalRing
            radius={3.1}
            tube={0.03}
            color="#fbbf24"
            emissiveColor="#b45309"
            speedX={-0.3}
            speedY={0.25}
            speedZ={0.35}
            tilt={[-0.5, 0.6, -0.3]}
            nodeCount={2}
          />

          {/* Outer Pink/Purple Ring */}
          <OrbitalRing
            radius={3.9}
            tube={0.025}
            color="#f472b6"
            emissiveColor="#9d174d"
            speedX={0.15}
            speedY={-0.35}
            speedZ={-0.2}
            tilt={[0.8, -0.4, 0.5]}
            nodeCount={4}
          />

          {/* Subtle Bloom Effect */}
          {enableBloom && (
            <EffectComposer multisampling={4}>
              <Bloom
                luminanceThreshold={0.3}
                luminanceSmoothing={0.85}
                intensity={1.3}
                mipmapBlur
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ContactScene;
