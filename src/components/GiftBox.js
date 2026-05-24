"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AudioEngine from "./AudioEngine";
import confetti from "canvas-confetti";
import { Gift, Heart } from "lucide-react";

export default function GiftBox({ giftOpened, setGiftOpened, onNextPhase }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const heartsRef = useRef([]);

  const handleOpenGift = () => {
    if (giftOpened) return;
    
    setGiftOpened(true);
    
    // Play synthesized explosion sound (sub-bass + white noise crackle)
    if (AudioEngine) {
      AudioEngine.playExplosion();
    }
    
    // Launch massive canvas-confetti bursts
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Initialize custom canvas fireworks
    initFireworks();
  };

  const initFireworks = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    particlesRef.current = [];
    heartsRef.current = [];

    // Create 180 firework explosion sparks flying from the center
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const colors = ["#f472b6", "#a78bfa", "#60a5fa", "#fbbf24", "#34d399", "#f87171"];

    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: Math.random() * 4 + 2,
        color: colors[i % colors.length],
        alpha: 1.0,
        decay: Math.random() * 0.015 + 0.01
      });
    }

    // Create 30 floating hearts rising up
    for (let i = 0; i < 35; i++) {
      heartsRef.current.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: -(Math.random() * 3 + 2),
        size: Math.random() * 20 + 10,
        alpha: 1.0,
        color: colors[i % colors.length]
      });
    }

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw sparks
      let activeSparks = false;
      particlesRef.current.forEach((p) => {
        if (p.alpha <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.alpha -= p.decay;
        
        if (p.alpha > 0) activeSparks = true;
      });

      // Draw hearts
      let activeHearts = false;
      heartsRef.current.forEach((h) => {
        if (h.alpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = h.alpha;
        ctx.fillStyle = h.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = h.color;
        
        // Draw SVG style heart path on canvas
        ctx.beginPath();
        const topY = h.y - h.size / 2;
        ctx.moveTo(h.x, h.y);
        ctx.bezierCurveTo(h.x - h.size / 2, topY, h.x - h.size, topY, h.x - h.size, h.y - h.size / 4);
        ctx.bezierCurveTo(h.x - h.size, h.y + h.size / 3, h.x - h.size / 3, h.y + h.size * 0.8, h.x, h.y + h.size);
        ctx.bezierCurveTo(h.x + h.size / 3, h.y + h.size * 0.8, h.x + h.size, h.y + h.size / 3, h.x + h.size, h.y - h.size / 4);
        ctx.bezierCurveTo(h.x + h.size, topY, h.x + h.size / 2, topY, h.x, h.y);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        h.x += h.vx;
        h.y += h.vy;
        h.alpha -= 0.005; // slow dissolve

        if (h.alpha > 0) activeHearts = true;
      });

      if (activeSparks || activeHearts) {
        animFrameRef.current = requestAnimationFrame(draw);
      }
    };

    draw();
  };

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center select-none px-6 py-24 relative">
      
      {/* 2D Canvas for custom firework animations */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-40" />

      {/* BEFORE OPENING */}
      {!giftOpened && (
        <div className="text-center relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
          >
            <span className="font-cinzel text-xs tracking-[0.5em] text-yellow-300 block mb-4">
              ✦ A Gift From The Heart ✦
            </span>
            <h2 className="font-cinzel text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-300 via-pink-300 to-purple-300 bg-clip-text text-transparent filter drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
              Your Magical Gift
            </h2>
          </motion.div>

          {/* Prompt to click the 3D box (since 3D box is rendered behind this overlay in 3D canvas) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1.0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="mt-[320px] md:mt-[380px] bg-purple-950/20 px-8 py-3.5 rounded-full border border-purple-500/20 text-sm tracking-[0.18em] uppercase font-space text-purple-200"
          >
            Tap the floating crystal box in space ✦
          </motion.div>

          {/* Invisible Overlay Button to capture clicks if R3F click is obstructed on mobile */}
          <button 
            onClick={handleOpenGift}
            className="absolute top-[180px] w-56 h-56 rounded-full opacity-0 cursor-none z-30"
          />
        </div>
      )}

      {/* AFTER OPENING - THE LETTER REVEAL */}
      <AnimatePresence>
        {giftOpened && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, cubicBezier: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl w-full z-10 bg-gradient-to-b from-purple-950/15 via-[#080214]/80 to-[#04000a]/90 glass-strong p-8 md:p-12 rounded-[36px] border border-pink-500/25 relative overflow-hidden"
          >
            {/* Ambient lighting inside the card */}
            <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-72 h-72 rounded-full bg-pink-500/10 blur-[60px] pointer-events-none" />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
              className="text-pink-500 mb-6 flex justify-center filter drop-shadow-[0_0_15px_rgba(244,114,182,0.6)]"
            >
              <Heart className="w-12 h-12 fill-pink-500 animate-pulse" />
            </motion.div>

            <h3 className="font-cinzel text-2xl md:text-4xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent mb-6 tracking-wide leading-snug">
              You Mean So Much To Me
            </h3>

            <div className="h-[1px] bg-gradient-to-r from-transparent via-pink-400/50 to-transparent mb-8" />

            <p className="font-cormorant text-gray-200 text-xl md:text-2xl italic leading-loose px-2 mb-10 text-justify md:text-center">
              “There are no words grand enough, no galaxy wide enough, no star bright enough to express how much you mean to me. You are my constant source of pride and joy, the most beautiful soul in this huge universe. No matter how much time passes, or where life takes us, you will always be protected, loved, and deeply precious to me.”
            </p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 1.0 }}
            >
              <button
                onClick={onNextPhase}
                className="glass px-8 py-3.5 rounded-full border border-pink-400/40 text-pink-300 text-xs font-space tracking-[0.2em] uppercase hover:bg-pink-900/20 hover:border-pink-300 transition-all duration-300 cursor-none"
              >
                ✦ Proceed to Final Message
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
