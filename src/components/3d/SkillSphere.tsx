'use client';

import React, { useRef, useState, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Billboard, MeshDistortMaterial, Line } from '@react-three/drei';

export interface SkillItem {
  id?: string;
  name: string;
  category?: 'frontend' | 'backend' | '3d' | 'tools' | string;
  level?: number; // 1-100
  color?: string;
}

export interface SkillSphereProps {
  skills?: (string | SkillItem)[];
  radius?: number;
  autoRotateSpeed?: number;
  activeSkillName?: string;
  onSelectSkill?: (skill: SkillItem) => void;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_SKILLS: SkillItem[] = [
  { name: 'React Three Fiber', category: '3d', color: '#00f5ff' },
  { name: 'Three.js', category: '3d', color: '#00f5ff' },
  { name: 'WebGL & GLSL', category: '3d', color: '#00f5ff' },
  { name: 'Next.js 16', category: 'frontend', color: '#8b5cf6' },
  { name: 'React 19', category: 'frontend', color: '#8b5cf6' },
  { name: 'TypeScript', category: 'frontend', color: '#00f5ff' },
  { name: 'GSAP Animations', category: 'frontend', color: '#fbbf24' },
  { name: 'Tailwind CSS', category: 'frontend', color: '#00f5ff' },
  { name: 'Node.js', category: 'backend', color: '#8b5cf6' },
  { name: 'PostgreSQL', category: 'backend', color: '#8b5cf6' },
  { name: 'GraphQL', category: 'backend', color: '#f472b6' },
  { name: 'Docker', category: 'tools', color: '#00f5ff' },
  { name: 'Git & GitHub', category: 'tools', color: '#fbbf24' },
  { name: 'UI / UX Design', category: 'frontend', color: '#f472b6' },
  { name: 'Post-processing', category: '3d', color: '#fbbf24' },
  { name: 'Performance Optimization', category: 'tools', color: '#fbbf24' },
  { name: 'Web Audio API', category: '3d', color: '#f472b6' },
  { name: 'Python', category: 'backend', color: '#8b5cf6' },
];

/**
 * Individual billboarded skill text item positioned on the sphere surface
 */
const SkillLabel: React.FC<{
  skill: SkillItem;
  position: [number, number, number];
  isActive: boolean;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
}> = ({ skill, position, isActive, isHovered, onHover, onClick }) => {
  const textRef = useRef<THREE.Mesh>(null);
  const targetScale = isActive ? 1.45 : isHovered ? 1.25 : 1.0;
  const currentScale = useRef(1);

  useFrame(() => {
    if (!textRef.current) return;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.15);
    textRef.current.scale.setScalar(currentScale.current);
  });

  // Color logic
  let labelColor = '#94a3b8';
  if (isActive) {
    labelColor = '#fbbf24'; // Gold highlight
  } else if (isHovered) {
    labelColor = '#00f5ff'; // Cyan hover
  } else if (skill.color) {
    labelColor = skill.color;
  }

  return (
    <Billboard position={position}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
        }}
        onPointerOut={() => onHover(false)}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <Text
          ref={textRef}
          fontSize={0.28}
          color={labelColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={isActive || isHovered ? 0.02 : 0.01}
          outlineColor="#0a0a0a"
        >
          {skill.name}
        </Text>
      </group>
    </Billboard>
  );
};

/**
 * Glowing line connecting central core to the currently selected skill
 */
const ActiveSkillConnector: React.FC<{
  targetPosition: [number, number, number] | null;
}> = ({ targetPosition }) => {
  if (!targetPosition) return null;

  return (
    <Line
      points={[
        [0, 0, 0],
        targetPosition,
      ]}
      color="#fbbf24"
      lineWidth={2}
      transparent
      opacity={0.8}
    />
  );
};

/**
 * Inner 3D Sphere & Skill Points Content
 */
export const SkillSphereContent: React.FC<{
  skills: SkillItem[];
  radius: number;
  autoRotateSpeed: number;
  activeSkill: SkillItem | null;
  onSelectSkill: (skill: SkillItem) => void;
}> = ({ skills, radius, autoRotateSpeed, activeSkill, onSelectSkill }) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);

  // Drag-to-rotate interaction state
  const isDragging = useRef(false);
  const previousPointer = useRef({ x: 0, y: 0 });
  const rotationVelocity = useRef({ x: 0, y: 0 });

  // Calculate Fibonacci sphere points for uniform distribution
  const skillNodes = useMemo(() => {
    const count = skills.length;
    return skills.map((skill, i) => {
      // Golden spiral distribution
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      return {
        skill,
        position: [x, y, z] as [number, number, number],
      };
    });
  }, [skills, radius]);

  // Find active node coordinates for line connection
  const activePosition = useMemo(() => {
    if (!activeSkill) return null;
    const found = skillNodes.find((n) => n.skill.name === activeSkill.name);
    return found ? found.position : null;
  }, [activeSkill, skillNodes]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Apply rotation velocity decay
    if (!isDragging.current) {
      // Slow down auto-rotation if user is hovering or selecting
      const currentSpeed = (hoveredSkillId || activeSkill) ? autoRotateSpeed * 0.25 : autoRotateSpeed;
      groupRef.current.rotation.y += currentSpeed * delta;
      groupRef.current.rotation.x += currentSpeed * 0.3 * delta;

      // Inertia decay
      groupRef.current.rotation.y += rotationVelocity.current.x * delta;
      groupRef.current.rotation.x += rotationVelocity.current.y * delta;
      rotationVelocity.current.x *= 0.92;
      rotationVelocity.current.y *= 0.92;
    }

    // Pulse core
    if (coreRef.current) {
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
      coreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => {
        isDragging.current = true;
        previousPointer.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerMove={(e) => {
        if (!isDragging.current || !groupRef.current) return;
        const dx = e.clientX - previousPointer.current.x;
        const dy = e.clientY - previousPointer.current.y;
        groupRef.current.rotation.y += dx * 0.006;
        groupRef.current.rotation.x += dy * 0.006;
        rotationVelocity.current = { x: dx * 0.1, y: dy * 0.1 };
        previousPointer.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => {
        isDragging.current = false;
      }}
      onPointerLeave={() => {
        isDragging.current = false;
      }}
    >
      {/* Central Glowing Core Sphere with MeshDistortMaterial */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[radius * 0.32, 32, 32]} />
        <MeshDistortMaterial
          color="#8b5cf6"
          emissive="#6d28d9"
          emissiveIntensity={1.2}
          roughness={0.15}
          metalness={0.85}
          distort={0.35}
          speed={2.2}
        />
      </mesh>

      {/* Cyber Geodesic Wireframe Shell around Core */}
      <mesh>
        <icosahedronGeometry args={[radius * 0.42, 2]} />
        <meshBasicMaterial
          color="#00f5ff"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Outer subtle orbital ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[radius * 0.98, radius * 1.01, 64]} />
        <meshBasicMaterial
          color="#8b5cf6"
          side={THREE.DoubleSide}
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Dynamic line connecting core to selected skill */}
      <ActiveSkillConnector targetPosition={activePosition} />

      {/* Skill Text Labels distributed across sphere */}
      {skillNodes.map(({ skill, position }) => {
        const isHovered = hoveredSkillId === skill.name;
        const isActive = activeSkill?.name === skill.name;

        return (
          <SkillLabel
            key={skill.name}
            skill={skill}
            position={position}
            isActive={isActive}
            isHovered={isHovered}
            onHover={(h) => setHoveredSkillId(h ? skill.name : null)}
            onClick={() => onSelectSkill(skill)}
          />
        );
      })}
    </group>
  );
};

export const SkillSphere: React.FC<SkillSphereProps> = ({
  skills = DEFAULT_SKILLS,
  radius = 3.6,
  autoRotateSpeed = 0.35,
  activeSkillName,
  onSelectSkill,
  className = 'w-full h-[520px]',
  style,
}) => {
  const parsedSkills = useMemo(() => {
    return skills.map((s) => (typeof s === 'string' ? { name: s } : s));
  }, [skills]);

  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(() => {
    if (activeSkillName) {
      return parsedSkills.find((s) => s.name === activeSkillName) || null;
    }
    return parsedSkills[0] || null;
  });

  const handleSelect = (skill: SkillItem) => {
    setActiveSkill(skill);
    if (onSelectSkill) onSelectSkill(skill);
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`} style={style}>
      {/* 3D Canvas */}
      <div className="w-full h-full">
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0, 8.8], fov: 45 }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.8} color="#00f5ff" />
          <pointLight position={[-10, -10, -10]} intensity={1.5} color="#8b5cf6" />
          <pointLight position={[0, 0, 5]} intensity={1.2} color="#fbbf24" />

          <Suspense fallback={null}>
            <SkillSphereContent
              skills={parsedSkills}
              radius={radius}
              autoRotateSpeed={autoRotateSpeed}
              activeSkill={activeSkill}
              onSelectSkill={handleSelect}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Floating Active Skill Badge */}
      {activeSkill && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/70 border border-white/15 backdrop-blur-md shadow-2xl pointer-events-none transition-all">
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: activeSkill.color || '#00f5ff' }}
          />
          <span className="text-sm font-semibold text-white tracking-wide">
            {activeSkill.name}
          </span>
          {activeSkill.category && (
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-zinc-300">
              {activeSkill.category}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillSphere;
