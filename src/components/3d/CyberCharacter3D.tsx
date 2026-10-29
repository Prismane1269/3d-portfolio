'use client';

import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';

/**
 * 3D Cyber Mascot Character wearing DJ Headphones
 * Recreated as an interactive procedural Three.js component inspired by
 * the 3D character in the tutorial finale.
 */
function CharacterModel({ interactive = true }: { interactive?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftEyePupilRef = useRef<THREE.Mesh>(null);
  const rightEyePupilRef = useRef<THREE.Mesh>(null);
  const leftEarcupRef = useRef<THREE.Mesh>(null);
  const rightEarcupRef = useRef<THREE.Mesh>(null);
  const tentaclesGroupRef = useRef<THREE.Group>(null);

  const [hovered, setHovered] = useState(false);
  const pointerSmooth = useRef(new THREE.Vector2(0, 0));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Smooth pointer tracking
    if (interactive) {
      pointerSmooth.current.lerp(state.pointer, 0.08);
    }

    if (groupRef.current) {
      // Gentle head bobbing to imaginary beat
      groupRef.current.position.y = Math.sin(t * 3) * 0.12;
      // Head tilt tracking cursor
      groupRef.current.rotation.y = pointerSmooth.current.x * 0.45;
      groupRef.current.rotation.x = -pointerSmooth.current.y * 0.35 + Math.sin(t * 1.5) * 0.05;
      groupRef.current.rotation.z = Math.sin(t * 2) * 0.04;
    }

    // Eye pupils track cursor directly
    const pupilOffset = 0.08;
    if (leftEyePupilRef.current && rightEyePupilRef.current) {
      leftEyePupilRef.current.position.x = -0.45 + pointerSmooth.current.x * pupilOffset;
      leftEyePupilRef.current.position.y = 0.15 + pointerSmooth.current.y * pupilOffset;

      rightEyePupilRef.current.position.x = 0.45 + pointerSmooth.current.x * pupilOffset;
      rightEyePupilRef.current.position.y = 0.15 + pointerSmooth.current.y * pupilOffset;
    }

    // Headphone earcups pulse like audio bass
    const bassPulse = 1 + Math.sin(t * 6) * 0.06;
    if (leftEarcupRef.current) leftEarcupRef.current.scale.setScalar(bassPulse);
    if (rightEarcupRef.current) rightEarcupRef.current.scale.setScalar(bassPulse);

    // Tentacles wave with sinusoidal delay
    if (tentaclesGroupRef.current) {
      tentaclesGroupRef.current.children.forEach((tentacle, i) => {
        const angleOffset = i * 0.785; // 8 tentacles
        const wave = Math.sin(t * 2.5 + angleOffset) * 0.25;
        tentacle.rotation.z = wave;
        tentacle.rotation.x = Math.cos(t * 2 + angleOffset) * 0.18;
      });
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.08 : 1}
      position={[0, 0, 0]}
    >
      {/* 1. Main Bulbous Head */}
      <mesh ref={headRef} position={[0, 0.1, 0]} castShadow>
        <sphereGeometry args={[1.2, 48, 48]} />
        <MeshDistortMaterial
          color="#9333ea"
          emissive="#4c1d95"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.6}
          distort={0.18}
          speed={1.5}
        />
      </mesh>

      {/* 2. Cyber Eyes */}
      {/* Left Eyeball */}
      <mesh position={[-0.45, 0.15, 0.95]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
      </mesh>
      {/* Left Pupil */}
      <mesh ref={leftEyePupilRef} position={[-0.45, 0.15, 1.22]}>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={2}
          roughness={0.2}
        />
      </mesh>

      {/* Right Eyeball */}
      <mesh position={[0.45, 0.15, 0.95]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
      </mesh>
      {/* Right Pupil */}
      <mesh ref={rightEyePupilRef} position={[0.45, 0.15, 1.22]}>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={2}
          roughness={0.2}
        />
      </mesh>

      {/* 3. DJ Headphones Over Head */}
      {/* Headband Arc */}
      <mesh position={[0, 0.7, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.35, 0.1, 24, 48, Math.PI]} />
        <meshStandardMaterial color="#171717" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Headband Padding Top */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[1.1, 0.18, 0.28]} />
        <meshStandardMaterial color="#262626" roughness={0.8} />
      </mesh>

      {/* Left Earcup */}
      <group position={[-1.38, 0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh ref={leftEarcupRef}>
          <cylinderGeometry args={[0.45, 0.45, 0.35, 32]} />
          <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Glowing LED Ring on Left Earcup */}
        <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.22, 0.38, 32]} />
          <meshBasicMaterial color="#00f5ff" />
        </mesh>
      </group>

      {/* Right Earcup */}
      <group position={[1.38, 0.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh ref={rightEarcupRef}>
          <cylinderGeometry args={[0.45, 0.45, 0.35, 32]} />
          <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Glowing LED Ring on Right Earcup */}
        <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.22, 0.38, 32]} />
          <meshBasicMaterial color="#00f5ff" />
        </mesh>
      </group>

      {/* 4. Eight Floating Tentacles */}
      <group ref={tentaclesGroupRef} position={[0, -0.6, 0]}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 2 * Math.PI) / 8;
          const radius = 0.75;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;

          return (
            <group key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
              <mesh position={[0, -0.45, 0.2]}>
                <capsuleGeometry args={[0.15, 0.8, 12, 16]} />
                <meshStandardMaterial
                  color="#a855f7"
                  emissive="#581c87"
                  emissiveIntensity={0.4}
                  roughness={0.3}
                  metalness={0.4}
                />
              </mesh>
              {/* Glowing suction pod */}
              <mesh position={[0, -0.7, 0.35]}>
                <sphereGeometry args={[0.08, 12, 12]} />
                <meshBasicMaterial color="#00f5ff" />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

export default function CyberCharacter3D({
  className = 'w-full h-full min-h-[350px]',
  interactive = true,
}: {
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 5, 4]} intensity={2.2} color="#00f5ff" />
        <directionalLight position={[-4, -3, -2]} intensity={1.8} color="#f472b6" />
        <pointLight position={[0, 2, 3]} intensity={1.5} color="#fbbf24" />

        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
          <CharacterModel interactive={interactive} />
        </Float>
      </Canvas>
    </div>
  );
}
