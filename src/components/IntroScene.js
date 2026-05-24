"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AudioEngine from "./AudioEngine";
import { Heart, Sparkles } from "lucide-react";

export default function IntroScene({ onEnter }) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);

  // Play heartbeat once interactive
  const handleStart = () => {
    setStarted(true);
    if (AudioEngine) {
      AudioEngine.startHeartbeat();
    }
    setStep(1);
  };

  useEffect(() => {
    if (!started) return;

    // Timeline steps for the intro experience
    const timer1 = setTimeout(() => setStep(2), 2200); // Heartbeat pulse 
    const timer2 = setTimeout(() => setStep(3), 4500); // Write name
    const timer3 = setTimeout(() => setStep(4), 8500); // "In this huge universe..."
    const timer4 = setTimeout(() => setStep(5), 11500); // "There are millions of people..."
    const timer5 = setTimeout(() => setStep(6), 14500); // "But no one could replace YOU."
    const timer6 = setTimeout(() => setStep(7), 17500); // Reveal button

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, [started]);

  const handleEnterUniverse = () => {
    if (AudioEngine) {
      AudioEngine.stopHeartbeat();
      AudioEngine.startAmbientPad();
    }
    onEnter();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020005] select-none text-white px-6">
      
      {/* INITIAL INTERACTIVE TRIGGER */}
      {!started && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="text-center z-10"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border border-dashed border-purple-500/40 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
          </motion.div>
          
          <h1 className="font-cinzel text-xl md:text-2xl letter tracking-[0.25em] text-pink-300/80 mb-6 uppercase">
            A Cosmic Surprise
          </h1>
          
          <button
            onClick={handleStart}
            className="glass px-8 py-3.5 rounded-full border border-purple-500/35 text-sm uppercase tracking-[0.2em] font-space text-purple-200 hover:bg-purple-950/20 hover:border-pink-500/60 transition-all duration-500 shadow-[0_0_15px_rgba(167,139,250,0.15)] hover:shadow-[0_0_25px_rgba(244,114,182,0.3)]"
          >
            ✦ Wake The Stars ✦
          </button>
        </motion.div>
      )}

      {/* HEARTBEAT PULSE */}
      {step === 1 || step === 2 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.4, 1, 0] }}
          transition={{ duration: 4.0, ease: "easeInOut" }}
          className="absolute flex items-center justify-center flex-col text-center"
        >
          <motion.div 
            animate={{ scale: [1, 1.25, 1, 1.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-pink-500 filter drop-shadow-[0_0_15px_rgba(244,114,182,0.7)]"
          >
            <Heart className="w-16 h-16 fill-pink-500" />
          </motion.div>
          <span className="font-space text-xs tracking-[0.3em] uppercase text-pink-300/60 mt-6 animate-pulse">
            Connecting Space Signals...
          </span>
        </motion.div>
      ) : null}

      {/* NAME DRAWING IN THE SKY */}
      {step >= 3 && step < 7 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute top-[28%] text-center z-10 w-full flex flex-col items-center"
        >
          <svg width="100%" height="80" viewBox="0 0 800 80" className="max-w-[320px] md:max-w-[600px]">
            {/* Glowing neon stroke drawing of SUBHAA */}
            <motion.text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              className="font-cinzel text-5xl md:text-7xl font-bold tracking-[0.25em]"
              fill="rgba(249, 168, 212, 0.0)"
              stroke="#f9a8d4"
              strokeWidth="1.2"
              filter="drop-shadow(0 0 10px rgba(244, 114, 182, 0.8))"
              initial={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
              animate={{ strokeDashoffset: 0, fill: "rgba(249, 168, 212, 0.25)" }}
              transition={{ 
                strokeDashoffset: { duration: 3.5, ease: "easeInOut" },
                fill: { delay: 3.0, duration: 1.5, ease: "linear" }
              }}
            >
              SUBHAA
            </motion.text>
          </svg>
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.5 }}
            transition={{ delay: 1.5, duration: 2.0 }}
            className="w-24 md:w-36 h-[1px] bg-gradient-to-r from-transparent via-pink-400 to-transparent mt-3"
          />
        </motion.div>
      )}

      {/* STORYTELLING LINES */}
      <div className="text-center absolute bottom-[25%] max-w-[85%] z-10 leading-loose">
        <AnimatePresence>
          {step === 4 && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 1.2 }}
              className="font-cormorant text-xl md:text-3xl italic tracking-wide text-gray-200/90 glow-text-white"
            >
              “In this vast, infinite universe…”
            </motion.p>
          )}

          {step === 5 && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 1.2 }}
              className="font-cormorant text-xl md:text-3xl italic tracking-wide text-gray-200/80 glow-text-white"
            >
              “There are billions of souls drifting through the dark…”
            </motion.p>
          )}

          {step === 6 && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 1.5 }}
              className="font-cormorant text-2xl md:text-4xl tracking-wide italic font-medium bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent filter drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]"
            >
              “But no one could ever replace YOU.”
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ENTER BUTTON */}
      {step >= 7 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="text-center z-10 mt-16"
        >
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold gradient-pink-purple mb-8 filter drop-shadow-[0_0_15px_rgba(167,139,250,0.6)]">
            You Are Truly Special
          </h2>
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3.0, repeat: Infinity }}
            className="inline-block"
          >
            <button
              onClick={handleEnterUniverse}
              className="glass px-10 py-4 rounded-full border border-pink-400/40 text-sm uppercase tracking-[0.25em] text-pink-300 hover:bg-pink-900/20 hover:border-pink-300/80 transition-all duration-500 shadow-[0_0_20px_rgba(244,114,182,0.2)] hover:shadow-[0_0_40px_rgba(244,114,182,0.4)]"
            >
              ✦ Enter Your Universe ✦
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Background Particle Stars Decorator */}
      {started && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * typeof window !== 'undefined' ? window.innerWidth : 500, 
                y: Math.random() * typeof window !== 'undefined' ? window.innerHeight : 500,
                opacity: 0 
              }}
              animate={{ 
                opacity: [0, Math.random() * 0.7 + 0.3, 0],
                y: ["0px", "-40px"]
              }}
              transition={{ 
                duration: Math.random() * 4 + 4,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              className="absolute w-[2px] h-[2px] bg-white rounded-full"
            />
          ))}
        </div>
      )}

    </div>
  );
}
