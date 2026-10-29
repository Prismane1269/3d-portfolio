'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * AmbientSoundToggle Component
 * Provides a cinematic, interactive sound toggle in the bottom-right corner.
 * Uses Web Audio API to synthesize an ethereal, oceanic ambient soundtrack
 * without needing external MP3 dependencies, preventing any 404 or network stalls.
 */
export default function AmbientSoundToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume] = useState(0.5);
  const [showTooltip, setShowTooltip] = useState(false);

  // Web Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize and play ambient audio
  const startAmbientSound = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      // Smooth fade-in
      masterGain.gain.exponentialRampToValueAtTime(volume * 0.4, ctx.currentTime + 2.5);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // 1. Lush Chord Frequencies (Fmaj9 / Ocean feel: F2, C3, A3, E4, G4)
      const chordNotes = [87.31, 130.81, 220.0, 329.63, 392.0];
      const newOscs: OscillatorNode[] = [];

      chordNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Subtle slow detune modulation (chorus/shimmer effect)
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.15 + idx * 0.05, ctx.currentTime);
        lfoGain.gain.setValueAtTime(2.5, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.detune);
        lfo.start();

        // Individual gains
        oscGain.gain.setValueAtTime(0.15 / (idx + 1), ctx.currentTime);

        if (panner) {
          panner.pan.setValueAtTime((idx / (chordNotes.length - 1)) * 1.6 - 0.8, ctx.currentTime);
          osc.connect(oscGain);
          oscGain.connect(panner);
          panner.connect(masterGain);
        } else {
          osc.connect(oscGain);
          oscGain.connect(masterGain);
        }

        osc.start();
        newOscs.push(osc);
      });

      // 2. Soft Ocean Wave Pink Noise Texture
      const bufferSize = ctx.sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Low pass filter for sea swell
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      // Swell filter modulation
      const swellLfo = ctx.createOscillator();
      const swellGain = ctx.createGain();
      swellLfo.frequency.setValueAtTime(0.08, ctx.currentTime); // ~12 sec swell
      swellGain.gain.setValueAtTime(220, ctx.currentTime);
      swellLfo.connect(swellGain);
      swellGain.connect(filter.frequency);
      swellLfo.start();

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);
      whiteNoise.start();

      noiseSourceRef.current = whiteNoise;
      oscillatorsRef.current = newOscs;
    } catch {
      // AudioContext policy or unsupported
    }
  }, [volume]);

  // Stop ambient audio with fade out
  const stopAmbientSound = useCallback(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;

    try {
      masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      setTimeout(() => {
        try {
          oscillatorsRef.current.forEach((osc) => {
            try {
              osc.stop();
              osc.disconnect();
            } catch {}
          });
          oscillatorsRef.current = [];

          if (noiseSourceRef.current) {
            try {
              noiseSourceRef.current.stop();
              noiseSourceRef.current.disconnect();
            } catch {}
            noiseSourceRef.current = null;
          }

          if (ctx.state !== 'closed') {
            ctx.close();
          }
          audioCtxRef.current = null;
        } catch {}
      }, 1300);
    } catch {}
  }, []);

  const toggleSound = () => {
    if (isPlaying) {
      stopAmbientSound();
      setIsPlaying(false);
    } else {
      startAmbientSound();
      setIsPlaying(true);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, [stopAmbientSound]);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 select-none"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      <div
        className={`px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-neutral-300 transition-all duration-300 shadow-xl pointer-events-none ${
          showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isPlaying ? 'bg-cyan-400 animate-ping' : 'bg-neutral-500'
            }`}
          />
          <span>{isPlaying ? 'Soundtrack: Active (Fmaj9)' : 'Click to Play Ambient Sound'}</span>
        </div>
      </div>

      {/* Main Sound Button */}
      <button
        id="sound-control-button"
        onClick={toggleSound}
        type="button"
        aria-label={isPlaying ? 'Mute ambient sound' : 'Play ambient sound'}
        aria-pressed={isPlaying}
        data-cursor="pointer"
        data-cursor-text={isPlaying ? 'Mute' : 'Play'}
        className={`relative group p-3.5 rounded-full backdrop-blur-2xl border transition-all duration-500 flex items-center justify-center shadow-2xl ${
          isPlaying
            ? 'bg-cyan-500/15 border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.35)] scale-105'
            : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
        }`}
      >
        {/* Pulsing glow ring when active */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping opacity-60 pointer-events-none" />
        )}

        {/* Animated Equalizer Waveform Bars */}
        <div className="w-5 h-5 flex items-center justify-center gap-[3px]">
          {/* Bar 1 */}
          <span
            className={`w-[2.5px] rounded-full transition-all duration-300 ${
              isPlaying
                ? 'bg-cyan-400 animate-[pulse_0.8s_ease-in-out_infinite] h-4'
                : 'bg-neutral-400 group-hover:bg-cyan-300 h-2'
            }`}
          />
          {/* Bar 2 */}
          <span
            className={`w-[2.5px] rounded-full transition-all duration-300 ${
              isPlaying
                ? 'bg-purple-400 animate-[pulse_1.2s_ease-in-out_infinite_0.2s] h-5'
                : 'bg-neutral-400 group-hover:bg-cyan-300 h-3.5'
            }`}
          />
          {/* Bar 3 */}
          <span
            className={`w-[2.5px] rounded-full transition-all duration-300 ${
              isPlaying
                ? 'bg-cyan-400 animate-[pulse_0.9s_ease-in-out_infinite_0.4s] h-3'
                : 'bg-neutral-400 group-hover:bg-cyan-300 h-1.5'
            }`}
          />
          {/* Bar 4 */}
          <span
            className={`w-[2.5px] rounded-full transition-all duration-300 ${
              isPlaying
                ? 'bg-amber-300 animate-[pulse_1.1s_ease-in-out_infinite_0.1s] h-4.5'
                : 'bg-neutral-400 group-hover:bg-cyan-300 h-2.5'
            }`}
          />
        </div>
      </button>
    </div>
  );
}
