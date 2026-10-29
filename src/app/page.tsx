"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// UI Components
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import LoadingScreen from "@/components/ui/LoadingScreen";
import AmbientSoundToggle from "@/components/ui/AmbientSoundToggle";

// Section Components
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

// Dynamically import 3D scenes to prevent SSR issues
const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Simulate loading time for assets
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      // Small delay after loading screen starts to exit
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  return (
    <>
      <CustomCursor />
      <LoadingScreen isLoaded={isLoaded} />
      <AmbientSoundToggle />

      {/* 3D Background Canvas - Fixed behind everything */}
      <div className="canvas-container">
        <HeroScene />
      </div>

      <SmoothScroll>
        <main
          className={`relative z-10 transition-opacity duration-1000 ${
            showContent ? "opacity-100" : "opacity-0"
          }`}
        >
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Contact />
          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
