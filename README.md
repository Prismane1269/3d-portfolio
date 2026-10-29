# 🌌 Cinematic 3D Portfolio Website

A cinematic, interactive 3D portfolio web application built with **Next.js 16 (App Router)**, **Three.js**, **React Three Fiber (@react-three/fiber)**, **Drei (@react-three/drei)**, **GSAP ScrollTrigger**, and **Tailwind CSS**.

Inspired by the full workflow tutorial for building cinematic AI and 3D web experiences using Google Antigravity.

---

## ✨ Features

- 🌌 **Interactive 3D Galaxy & Particle Field (`ParticleField.tsx`)**
  - Over 2,800 instanced particles configured into a 3-arm logarithmic spiral galaxy.
  - Real-time cursor repulsion using Hooke's Law spring physics and scroll velocity acceleration.
- 💎 **Floating 3D Geometries (`FloatingGeometry.tsx`)**
  - Iridescent Torus Knot with `MeshDistortMaterial`, wireframe icosahedrons with glowing cores, and golden octahedrons.
- 🎧 **Ambient Generative Audio (`AmbientSoundToggle.tsx`)**
  - Real-time generative **Fmaj9 chord synthesizer & pink noise ocean swell** using the browser's native **Web Audio API**.
  - Animated audio waveform equalizer bars and glowing status pill. Zero external audio file dependencies.
- 🤖 **Interactive 3D Cyber Mascot (`CyberCharacter3D.tsx`)**
  - 3D character wearing DJ headphones with real-time cursor eye tracking, bass-pulsing earcups, and sinusoidal wave tentacles.
- 🌐 **Interactive 3D Skill Sphere (`SkillSphere.tsx`)**
  - Uniform Fibonacci golden spiral distribution with billboard typography, drag-to-rotate inertia, and dynamic 3D connector lines.
- 🎴 **Horizontal Scroll Project Carousel (`Projects.tsx`)**
  - GSAP ScrollTrigger-pinned track with 3D perspective card tilt, glassmorphism, and live status badges.
- 🔮 **Morphing Energy Core (`ContactScene.tsx`)**
  - Concentric 3-axis orbital gimbal rings and responsive morphing sphere.
- 📜 **Butter-Smooth Scrolling & Custom Cursor**
  - **Lenis** smooth scroll synchronized with `gsap.ticker` and `ScrollTrigger.update()`.
  - Dual-layer trailing cursor with interactive element detection and contextual tags.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **3D & Shaders**: [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei), [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing)
- **Animation**: [GSAP 3](https://greensock.com/gsap/) with `ScrollTrigger`
- **Smooth Scroll**: [@studio-freight/lenis](https://github.com/darkroomengineering/lenis)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: TypeScript

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Prismane1269/3d-portfolio.git
cd 3d-portfolio

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Type check and build
npm run build

# Start production server
npm run start
```

---

## 📂 Architecture

```
src/
├── app/
│   ├── globals.css          # Glassmorphism, glow effects, custom scrollbar
│   ├── layout.tsx           # Inter & Space Grotesk typography
│   └── page.tsx             # Master orchestrator mounting all 3D scenes & sections
├── components/
│   ├── 3d/
│   │   ├── ParticleField.tsx     # 2,800+ instanced galaxy particles
│   │   ├── FloatingGeometry.tsx  # Distorted floating meshes & wireframes
│   │   ├── HeroScene.tsx         # Full-screen cosmic canvas with Bloom
│   │   ├── CyberCharacter3D.tsx  # 3D mascot with DJ headphones & eye tracking
│   │   ├── SkillSphere.tsx       # Orbiting 3D skills globe
│   │   ├── ContactScene.tsx      # Morphing blob & orbital gimbal rings
│   │   ├── ProjectCard3D.tsx     # 3D glass transmission card
│   │   └── SceneLoader.tsx       # Hydration-safe client wrapper
│   ├── sections/
│   │   ├── Hero.tsx         # Staggered letter reveal & navigation
│   │   ├── About.tsx        # Story, counters & 3D cyber HUD avatar
│   │   ├── Projects.tsx     # Horizontal scroll project showcase
│   │   ├── Skills.tsx       # 3D SkillSphere & animated progress bars
│   │   ├── Contact.tsx      # Glassmorphic form & direct line
│   │   └── Footer.tsx       # Minimalist footer with smooth back-to-top
│   └── ui/
│       ├── AmbientSoundToggle.tsx # Web Audio API ambient soundtrack
│       ├── CustomCursor.tsx       # Dual-layer mouse follower
│       ├── LoadingScreen.tsx      # Cyber entrance sequence
│       └── SmoothScroll.tsx       # Lenis + GSAP synchronization
```

---

## 📜 License

MIT License. Crafted with precision.
