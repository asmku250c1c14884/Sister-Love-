"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AudioEngine from "./AudioEngine";
import { RotateCcw } from "lucide-react";

export default function EndingScene({ onReset }) {
  const [shootingStarActive, setShootingStarActive] = useState(false);

  useEffect(() => {
    // Fade out synthesizer music
    if (AudioEngine) {
      AudioEngine.fadeAllOut();
    }

    // Trigger final shooting star after 1.5 seconds
    const timer = setTimeout(() => {
      setShootingStarActive(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleRestart = () => {
    if (AudioEngine) {
      // Re-initialize and trigger pads
      AudioEngine.startAmbientPad();
    }
    onReset();
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center select-none px-6 py-24 relative overflow-hidden bg-black text-center">
      
      {/* Cinematic CSS Shooting Star */}
      {shootingStarActive && (
        <div 
          className="fixed pointer-events-none z-50 h-[2px] bg-gradient-to-r from-transparent via-white to-purple-400/80 rounded-full"
          style={{
            top: "20%",
            left: "-10%",
            width: "250px",
            animation: "shootingStar 3.2s cubic-bezier(0.25, 1, 0.50, 1) both",
          }}
        />
      )}

      {/* Styled animation keyframes locally to prevent globals pollution */}
      <style>{`
        @keyframes shootingStar {
          0% {
            transform: translate3d(0, 0, 0) rotate(15deg);
            opacity: 0;
            width: 0px;
          }
          10% {
            opacity: 1;
            width: 150px;
          }
          100% {
            transform: translate3d(120vw, 35vh, 0) rotate(15deg);
            opacity: 0;
            width: 300px;
          }
        }
      `}</style>

      {/* Main Text Content */}
      <div className="max-w-2xl relative z-10">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2.0 }}
          className="font-cinzel text-xs tracking-[0.5em] text-yellow-300 block mb-12 uppercase"
        >
          ✦ A Final Promise ✦
        </motion.span>

        <div className="font-cormorant text-2xl md:text-4xl italic text-gray-200/90 leading-loose mb-12">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 0.5 }}
            className="mb-4"
          >
            “No matter where life takes you…”
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 1.8 }}
          >
            “No matter how many chapters change…”
          </motion.p>
        </div>

        {/* Final glowing neon heart-touching message */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.0, delay: 3.5, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="font-cinzel text-3xl md:text-5xl font-bold text-pink-300 tracking-wide leading-relaxed mb-12 glow-text-pink"
        >
          You will always be<br />someone truly precious ❤️
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.4 }}
          transition={{ duration: 2.0, delay: 4.2 }}
          className="w-36 h-[1px] bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto mb-12"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.8, delay: 5.2 }}
          className="font-cormorant text-gray-400 text-base md:text-xl italic leading-relaxed max-w-lg mx-auto"
        >
          This universe was created just for you. Every star, every memory, and every word belongs to you. Because you deserve nothing less than everything.
        </motion.p>

        {/* Ethereal persistent symbols */}
        <div className="flex justify-center gap-6 mt-16 text-gray-400/40">
          {["❤️", "✦", "🌙", "✦", "💫"].map((sym, idx) => (
            <motion.span
              key={idx}
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                duration: 3 + idx * 0.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: idx * 0.2 
              }}
              className="text-lg block"
            >
              {sym}
            </motion.span>
          ))}
        </div>

        {/* Go back trigger */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 7.0 }}
          className="mt-16"
        >
          <button
            onClick={handleRestart}
            className="glass px-8 py-3 rounded-full border border-white/10 text-white/40 text-xs font-space tracking-[0.2em] uppercase hover:text-white/80 hover:border-white/25 hover:bg-white/5 transition-all duration-300 flex items-center gap-2 mx-auto cursor-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart Journey ✦
          </button>
        </motion.div>
      </div>

    </div>
  );
}
