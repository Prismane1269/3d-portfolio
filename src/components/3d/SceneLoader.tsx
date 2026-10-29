'use client';

import React, { useSyncExternalStore, Suspense, ComponentType } from 'react';

export interface SceneLoaderProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  minHeight?: string | number;
  label?: string;
}

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Premium cyber-futuristic loading indicator with concentric neon rings,
 * pulsing core, and glowing typography.
 */
export const SceneLoadingIndicator: React.FC<{ label?: string }> = ({
  label = 'INITIALIZING 3D CANVAS',
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full min-h-[380px] bg-[#0a0a0a] overflow-hidden select-none">
      {/* Background radial ambient glow */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#8b5cf6]/20 via-[#00f5ff]/15 to-transparent blur-3xl pointer-events-none animate-pulse" />

      {/* Cyber animated concentric rings */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Outer Ring - Cyan fast clockwise */}
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00f5ff] border-r-[#00f5ff]/30 animate-spin"
          style={{ animationDuration: '2.5s' }}
        />

        {/* Middle Ring - Purple counter-clockwise */}
        <div
          className="absolute inset-2.5 rounded-full border-2 border-transparent border-b-[#8b5cf6] border-l-[#8b5cf6]/40 animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '3.2s' }}
        />

        {/* Inner Ring - Gold dotted rotation */}
        <div
          className="absolute inset-5 rounded-full border border-dashed border-[#fbbf24]/70 animate-spin"
          style={{ animationDuration: '6s' }}
        />

        {/* Center Glowing Core */}
        <div className="w-4 h-4 rounded-full bg-[#00f5ff] shadow-[0_0_20px_#00f5ff] animate-ping" />
        <div className="absolute w-3 h-3 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
      </div>

      {/* Typography with glowing shimmer */}
      <div className="mt-8 flex flex-col items-center gap-1.5 z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse" />
          <span className="text-xs font-mono tracking-[0.25em] text-zinc-400 uppercase">
            {label}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-pulse" />
        </div>
        <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-[#00f5ff]/50 to-transparent mt-1" />
      </div>
    </div>
  );
};

/**
 * SceneLoader ensures Canvas scenes are client-only, avoiding SSR mismatches,
 * and renders a polished CSS animation while loading.
 */
export const SceneLoader: React.FC<SceneLoaderProps> = ({
  children,
  fallback,
  className = 'w-full h-full relative',
  minHeight,
  label,
}) => {
  const hasMounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  const defaultFallback = fallback ?? <SceneLoadingIndicator label={label} />;

  if (!hasMounted) {
    return (
      <div
        className={className}
        style={{ minHeight: minHeight ?? '100%' }}
      >
        {defaultFallback}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ minHeight: minHeight ?? '100%' }}
    >
      <Suspense fallback={defaultFallback}>{children}</Suspense>
    </div>
  );
};

/**
 * Higher-Order Component to wrap any 3D Canvas scene with SceneLoader
 */
export function withSceneLoader<P extends object>(
  Component: ComponentType<P>,
  fallbackLabel?: string
) {
  return function WithSceneLoaderWrapper(props: P) {
    return (
      <SceneLoader label={fallbackLabel}>
        <Component {...props} />
      </SceneLoader>
    );
  };
}

export default SceneLoader;
