"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Sparkles, Navigation } from "lucide-react";
import AudioEngine from "@/components/AudioEngine";
import SpaceCanvas from "@/components/SpaceCanvas";
import IntroScene from "@/components/IntroScene";
import GalaxyMemory from "@/components/GalaxyMemory";
import StoryScroll from "@/components/StoryScroll";
import GiftBox from "@/components/GiftBox";
import EndingScene from "@/components/EndingScene";

export default function Home() {
  const [phase, setPhase] = useState("intro"); // intro, reveal, galaxy, story, gift, ending
  const [giftOpened, setGiftOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  
  // Custom cursor refs for lag-free cursor tracking
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const visualizerCanvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Mouse cursor and trail movement handler
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      
      // Update cursor positions directly via ref styles for 120fps smoothness
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${x}px`;
        cursorDotRef.current.style.top = `${y}px`;
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.left = `${x}px`;
        cursorRingRef.current.style.top = `${y}px`;
      }

      // Spawn mouse trail star sparkles (throttled spawn rate)
      if (Math.random() < 0.28) {
        const id = Math.random();
        const colors = ["#f472b6", "#a78bfa", "#60a5fa", "#fbbf24", "#34d399"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        setSparkles((prev) => [
          ...prev.slice(-30), // keep only last 30 sparkles
          { id, x: x + (Math.random() - 0.5) * 15, y: y + (Math.random() - 0.5) * 15, color }
        ]);

        // Trigger star chime on hover over something interactive if active
        if (phase !== "intro" && Math.random() < 0.05) {
          AudioEngine?.playStarChime();
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [phase]);

  // Clean up old sparkles periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setSparkles((prev) => prev.slice(1));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Music Visualizer Canvas rendering loop
  useEffect(() => {
    if (phase === "intro") return;

    const canvas = visualizerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    canvas.width = 120;
    canvas.height = 36;

    const drawVisualizer = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const freqData = AudioEngine?.getAnalyserData();
      const barCount = 14;
      const barWidth = 5;
      const gap = 3;
      
      for (let i = 0; i < barCount; i++) {
        let val = 0;
        if (freqData && !isMuted) {
          // Map frequency indexes to visualizer height
          const freqIndex = Math.floor((i / barCount) * 20);
          val = freqData[freqIndex] || 0;
        }

        // Calculate height (normalized to canvas height)
        const percent = val / 255;
        const height = Math.max(3, percent * canvas.height);
        const y = canvas.height - height;
        const x = i * (barWidth + gap);

        // Gradient for visualizer bars
        const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
        grad.addColorStop(0, "#f472b6"); // Neon pink
        grad.addColorStop(0.5, "#a78bfa"); // Neon purple
        grad.addColorStop(1, "#60a5fa"); // Neon blue

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 1.5);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(drawVisualizer);
    };

    drawVisualizer();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [phase, isMuted]);

  // Audio mute toggler
  const toggleMute = () => {
    if (!AudioEngine) return;
    if (isMuted) {
      AudioEngine.masterGain.gain.setValueAtTime(0.6, AudioEngine.ctx.currentTime);
      setIsMuted(false);
    } else {
      AudioEngine.masterGain.gain.setValueAtTime(0, AudioEngine.ctx.currentTime);
      setIsMuted(true);
    }
  };

  const handleBoxClick = () => {
    // Triggers opening sequence
    if (giftOpened) return;
    setGiftOpened(true);
    AudioEngine?.playExplosion();
  };

  const handleReset = () => {
    setPhase("reveal");
    setGiftOpened(false);
  };

  return (
    <main className="relative min-h-screen bg-[#03000a] text-white overflow-hidden select-none">
      
      {/* 120fps Cursor trails */}
      <div ref={cursorDotRef} className="interactive-cursor" />
      <div ref={cursorRingRef} className="interactive-cursor-ring" />

      {/* Glittering Sparkles Mouse Trail */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {sparkles.map((sp) => (
          <motion.div
            key={sp.id}
            initial={{ opacity: 0.9, scale: 1.2 }}
            animate={{ opacity: 0, scale: 0.2, y: -20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: sp.x,
              top: sp.y,
              backgroundColor: sp.color,
              boxShadow: `0 0 10px ${sp.color}, 0 0 20px ${sp.color}`,
            }}
            className="w-1.5 h-1.5 rounded-full"
          />
        ))}
      </div>

      {/* Global 3D WebGL Scene */}
      <SpaceCanvas 
        phase={phase} 
        giftOpened={giftOpened} 
        onBoxClick={handleOpenGiftOutside => setGiftOpened(true)} 
      />

      {/* INTRO SCREEN PHASE */}
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <IntroScene key="intro" onEnter={() => setPhase("reveal")} />
        )}
      </AnimatePresence>

      {/* HOLOGRAPHIC TOP NAVIGATION BAR */}
      {phase !== "intro" && (
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="fixed top-0 left-0 right-0 z-40 bg-[#060212]/75 backdrop-blur-md border-b border-purple-500/10 flex items-center justify-between px-8 py-5 md:py-6"
        >
          {/* Logo / Universe Identifier */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400 animate-spin" style={{ animationDuration: "8s" }} />
            <span className="font-cinzel text-xs tracking-[0.25em] text-pink-300 font-bold">
              Subhaa's Cosmos
            </span>
          </div>

          {/* Menu Items */}
          <div className="flex items-center gap-5 md:gap-8">
            {[
              { label: "Home", val: "reveal" },
              { label: "Memory Galaxy", val: "galaxy" },
              { label: "Our Story", val: "story" },
              { label: "Surprise Gift", val: "gift" }
            ].map((menu) => (
              <button
                key={menu.val}
                onClick={() => {
                  setPhase(menu.val);
                  if (menu.val !== "gift") setGiftOpened(false);
                }}
                className={`font-space text-[10px] md:text-xs uppercase tracking-[0.18em] transition-all duration-300 cursor-none relative py-1 ${
                  phase === menu.val ? "text-pink-300 font-medium" : "text-gray-400/80 hover:text-white"
                }`}
              >
                {menu.label}
                {phase === menu.val && (
                  <motion.div 
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-pink-400 to-purple-400 shadow-[0_0_10px_#f472b6]" 
                  />
                )}
              </button>
            ))}
          </div>
        </motion.nav>
      )}

      {/* CORE EXPERIENCE OVERLAYS */}
      {phase !== "intro" && (
        <div className="relative z-10 w-full min-h-screen pt-20">
          
          {/* REVEAL / HERO STATE */}
          {phase === "reveal" && (
            <div className="w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-12 relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, cubicBezier: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl"
              >
                <span className="font-cinzel text-xs tracking-[0.5em] text-yellow-300/80 uppercase block mb-6 animate-pulse">
                  ✦ A Message From The Universe ✦
                </span>
                
                <h1 className="font-cinzel text-5xl md:text-8xl font-black leading-tight mb-8 gradient-rainbow filter drop-shadow-[0_0_20px_rgba(244,114,182,0.4)]">
                  You Are<br />Truly Special
                </h1>

                <p className="font-cormorant text-gray-300/90 text-xl md:text-3xl italic leading-relaxed max-w-xl mx-auto mb-12">
                  “Not just special in the ordinary sense — but cosmically, impossibly, irreplaceably special. The kind of special that stars are made from.”
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <button
                    onClick={() => setPhase("galaxy")}
                    className="glass px-8 py-4 rounded-full border border-purple-500/40 text-purple-200 text-xs tracking-[0.2em] font-space uppercase hover:bg-purple-950/20 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(244,114,182,0.25)] transition-all duration-300 w-64 sm:w-auto cursor-none"
                  >
                    ✦ Explore Memory Galaxy
                  </button>
                  <button
                    onClick={() => setPhase("story")}
                    className="glass px-8 py-4 rounded-full border border-pink-400/40 text-pink-300 text-xs tracking-[0.2em] font-space uppercase hover:bg-pink-950/20 hover:border-pink-300 hover:shadow-[0_0_20px_rgba(244,114,182,0.25)] transition-all duration-300 w-64 sm:w-auto cursor-none"
                  >
                    ✦ Read Your Story
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* GALAXY MEMORY STATE */}
          {phase === "galaxy" && <GalaxyMemory />}

          {/* STORY STATE */}
          {phase === "story" && (
            <StoryScroll onNextPhase={() => setPhase("gift")} />
          )}

          {/* SURPRISE GIFT STATE */}
          {phase === "gift" && (
            <GiftBox 
              giftOpened={giftOpened} 
              setGiftOpened={setGiftOpened} 
              onNextPhase={() => setPhase("ending")} 
            />
          )}

          {/* ENDING STATE */}
          {phase === "ending" && (
            <EndingScene onReset={handleReset} />
          )}

        </div>
      )}

      {/* FLOATING MUSIC WIDGET (visualizer + control) */}
      {phase !== "intro" && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="fixed bottom-6 left-6 z-40 bg-[#060212]/80 backdrop-blur-md px-5 py-3 rounded-full border border-purple-500/15 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex items-center gap-4"
        >
          {/* Mute toggle button */}
          <button
            onClick={toggleMute}
            className="text-pink-400 hover:text-pink-300 transition-colors cursor-none focus:outline-none"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
          </button>

          {/* Interactive visualizer bars */}
          <canvas ref={visualizerCanvasRef} className="w-[100px] h-[30px] opacity-80" />
        </motion.div>
      )}

    </main>
  );
}
