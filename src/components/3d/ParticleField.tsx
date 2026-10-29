'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

export interface ParticleFieldProps {
  /** Total number of particles in the field */
  count?: number;
  /** Radius of the galaxy/nebula formation */
  radius?: number;
  /** Number of spiral arms */
  arms?: number;
  /** Speed of continuous idle rotation */
  speed?: number;
  /** Radius of cursor repulsion influence in 3D units */
  mouseRadius?: number;
  /** Strength of cursor repulsion */
  repelStrength?: number;
  /** Optional manual scroll progress (0 to 1). If not provided, listens to window scroll. */
  scrollProgress?: number;
  /** Optional interactive mouse repel toggle */
  interactive?: boolean;
  /** Size multiplier for particles */
  particleSize?: number;
}

interface ParticleData {
  basePositions: Float32Array;
  currentPositions: Float32Array;
  velocities: Float32Array;
  scales: Float32Array;
  phases: Float32Array;
  colors: Float32Array;
}

// Pure deterministic pseudo-random generator
function createPRNG(initialSeed = 1337) {
  let s = initialSeed;
  return function next(): number {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Pure function to generate particle geometry and color data
function generateGalaxyData(count: number, radius: number, arms: number): ParticleData {
  const prng = createPRNG(4242);
  const basePositions = new Float32Array(count * 3);
  const currentPositions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const phases = new Float32Array(count);
  const colors = new Float32Array(count * 3);

  const purple = new THREE.Color('#8b5cf6');
  const deepPurple = new THREE.Color('#4c1d95');
  const cyan = new THREE.Color('#00f5ff');
  const gold = new THREE.Color('#fbbf24');
  const pink = new THREE.Color('#f472b6');
  const tempColor = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const armIndex = i % arms;

    // Distribute radially: dense near center, thinning toward arm tips
    const r = Math.pow(prng(), 1.5) * radius;
    const baseAngle = (armIndex * 2 * Math.PI) / arms;
    const spiralAngle = baseAngle + r * 0.42;

    // Dispersal increases with distance from center
    const spread = 0.25 + (r / radius) * 1.1;
    const randDirX = prng() < 0.5 ? 1 : -1;
    const randDirZ = prng() < 0.5 ? 1 : -1;
    const randomOffsetX = Math.pow(prng(), 2) * randDirX * spread;
    const randomOffsetZ = Math.pow(prng(), 2) * randDirZ * spread;

    // Vertical thickness is higher at the core bulge and flatter along arms
    const coreBulge = Math.max(0.3, (1 - r / radius) * 2.2);
    const randomOffsetY = (prng() - 0.5) * coreBulge;

    const x = Math.cos(spiralAngle) * r + randomOffsetX;
    const z = Math.sin(spiralAngle) * r + randomOffsetZ;
    const y = randomOffsetY;

    basePositions[i3] = x;
    basePositions[i3 + 1] = y;
    basePositions[i3 + 2] = z;

    currentPositions[i3] = x;
    currentPositions[i3 + 1] = y;
    currentPositions[i3 + 2] = z;

    velocities[i3] = 0;
    velocities[i3 + 1] = 0;
    velocities[i3 + 2] = 0;

    // Pulse phase & scale
    phases[i] = prng() * Math.PI * 2;
    scales[i] = 0.5 + prng() * 1.1;

    // Color gradient: Core (Purple/Deep Purple) -> Spiral Arms (Cyan) -> Outer & Sparkles (Gold/Pink)
    const normR = r / radius;
    const randVal = prng();

    if (normR < 0.25) {
      if (randVal < 0.25) {
        tempColor.copy(gold);
      } else {
        tempColor.lerpColors(deepPurple, purple, normR / 0.25);
      }
    } else if (normR < 0.65) {
      const t = (normR - 0.25) / 0.4;
      tempColor.lerpColors(purple, cyan, t);
      if (randVal < 0.15) {
        tempColor.lerp(pink, 0.45);
      }
    } else {
      const t = (normR - 0.65) / 0.35;
      tempColor.lerpColors(cyan, gold, t * 0.85);
      if (randVal < 0.2) {
        tempColor.lerp(pink, 0.6);
      }
    }

    colors[i3] = tempColor.r;
    colors[i3 + 1] = tempColor.g;
    colors[i3 + 2] = tempColor.b;
  }

  return {
    basePositions,
    currentPositions,
    velocities,
    scales,
    phases,
    colors,
  };
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 2800,
  radius = 12,
  arms = 3,
  speed = 0.35,
  mouseRadius = 2.8,
  repelStrength = 1.8,
  scrollProgress,
  interactive = true,
  particleSize = 0.038,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Scratch objects for zero-allocation per frame
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mouse3D = useRef(new THREE.Vector3(9999, 9999, 9999));
  const internalScroll = useRef(0);
  const smoothScroll = useRef(0);

  // Mutable particle physics data stored safely in a ref
  const particlesRef = useRef<ParticleData | null>(null);
  if (particlesRef.current == null) {
    particlesRef.current = generateGalaxyData(count, radius, arms);
  }

  // Track window scroll when scrollProgress is not explicitly passed
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

  // Initialize instance matrices and colors once on mount or when count/size changes
  useEffect(() => {
    if (!meshRef.current || !particlesRef.current) return;
    const mesh = meshRef.current;
    const { currentPositions, scales, colors } = particlesRef.current;

    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      dummy.position.set(
        currentPositions[i3],
        currentPositions[i3 + 1],
        currentPositions[i3 + 2]
      );
      dummy.scale.setScalar(scales[i] * particleSize);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      color.setRGB(colors[i3], colors[i3 + 1], colors[i3 + 2]);
      mesh.setColorAt(i, color);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [count, dummy, particleSize]);

  // Per-frame animation loop
  useFrame((state, delta) => {
    if (!meshRef.current || !particlesRef.current) return;
    const mesh = meshRef.current;

    // Smooth scroll interpolation
    const targetScroll = typeof scrollProgress === 'number' ? scrollProgress : internalScroll.current;
    smoothScroll.current = THREE.MathUtils.lerp(smoothScroll.current, targetScroll, 0.08);

    // Track mouse in 3D on the galaxy plane
    if (interactive) {
      const mx = (state.pointer.x * viewport.width) / 2;
      const my = (state.pointer.y * viewport.height) / 2;
      mouse3D.current.set(mx, my, 0);
    } else {
      mouse3D.current.set(9999, 9999, 9999);
    }

    // Global rotation affected by time and scroll speed
    const scrollSpin = smoothScroll.current * Math.PI * 1.5;
    const baseRotation = state.clock.getElapsedTime() * speed * 0.15;
    const currentRotY = baseRotation + scrollSpin;

    if (groupRef.current) {
      groupRef.current.rotation.y = currentRotY;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1 + smoothScroll.current * 0.35;
      groupRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.15) * 0.08;
    }

    // Inverse transform mouse into local group space for precise repulsion
    const invMatrix = groupRef.current ? groupRef.current.matrixWorld.clone().invert() : new THREE.Matrix4();
    const localMouse = mouse3D.current.clone().applyMatrix4(invMatrix);

    const { basePositions, currentPositions, velocities, scales, phases } = particlesRef.current;
    const time = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.1);

    // Spring and damping physics
    const spring = 4.5;
    const damping = 0.88;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let px = currentPositions[i3];
      let py = currentPositions[i3 + 1];
      let pz = currentPositions[i3 + 2];

      const bx = basePositions[i3];
      const by = basePositions[i3 + 1];
      const bz = basePositions[i3 + 2];

      // Subtle dynamic breathing pulse
      const breathe = 1 + Math.sin(time * 1.5 + phases[i]) * 0.04;
      const targetX = bx * breathe;
      const targetY = by + Math.sin(time * 0.8 + phases[i]) * 0.15;
      const targetZ = bz * breathe;

      // Mouse repulsion in local space
      if (interactive) {
        const dx = px - localMouse.x;
        const dy = py - localMouse.y;
        const dz = pz - localMouse.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        const radiusSq = mouseRadius * mouseRadius;

        if (distSq < radiusSq && distSq > 0.001) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / mouseRadius) * repelStrength * 12;
          const nx = dx / dist;
          const ny = dy / dist;
          const nz = dz / dist;

          velocities[i3] += nx * force * dt;
          velocities[i3 + 1] += ny * force * dt;
          velocities[i3 + 2] += nz * force * dt;
        }
      }

      // Hooke's Law spring back to target position
      const fx = (targetX - px) * spring;
      const fy = (targetY - py) * spring;
      const fz = (targetZ - pz) * spring;

      velocities[i3] = (velocities[i3] + fx * dt) * damping;
      velocities[i3 + 1] = (velocities[i3 + 1] + fy * dt) * damping;
      velocities[i3 + 2] = (velocities[i3 + 2] + fz * dt) * damping;

      px += velocities[i3] * dt;
      py += velocities[i3 + 1] * dt;
      pz += velocities[i3 + 2] * dt;

      currentPositions[i3] = px;
      currentPositions[i3 + 1] = py;
      currentPositions[i3 + 2] = pz;

      // Dynamic scale with pulsing
      const pulseScale = scales[i] * particleSize * (1 + 0.25 * Math.sin(time * 2 + phases[i]));

      dummy.position.set(px, py, pz);
      dummy.scale.setScalar(pulseScale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          roughness={0.2}
          metalness={0.8}
          toneMapped={false}
          emissiveIntensity={0.6}
        />
      </instancedMesh>
    </group>
  );
};

export default ParticleField;
