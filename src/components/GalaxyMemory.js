"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AudioEngine from "./AudioEngine";
import { Sparkles, X } from "lucide-react";
import Image from "next/image";

const MEMORIES = [
  {
    id: 1,
    title: "Your Kindness",
    quote: "Every small act of love you give leaves a permanent mark on the world.",
    img: "/images/memory1.png",
    color: "from-pink-400 to-rose-500",
    glow: "#f472b6",
  },
  {
    id: 2,
    title: "Your Dreams",
    quote: "Your dreams are not too big — the universe is just catching up to you.",
    img: "/images/memory2.png",
    color: "from-purple-400 to-indigo-500",
    glow: "#a78bfa",
  },
  {
    id: 3,
    title: "Your Strength",
    quote: "You carry the weight of stars and still manage to shine.",
    img: "/images/memory3.png",
    color: "from-amber-400 to-yellow-500",
    glow: "#fbbf24",
  },
  {
    id: 4,
    title: "Your Laughter",
    quote: "The sound of your laughter is the most beautiful music in the universe.",
    img: "/images/memory4.png",
    color: "from-blue-400 to-cyan-500",
    glow: "#60a5fa",
  },
  {
    id: 5,
    title: "Our Bond",
    quote: "No matter how far the stars are apart, they always light the same sky.",
    img: "/images/memory5.png",
    color: "from-violet-400 to-fuchsia-500",
    glow: "#c084fc",
  },
  {
    id: 6,
    title: "Your Smile",
    quote: "Your smile can make the darkest days feel like sunrise.",
    img: "/images/memory6.png",
    color: "from-emerald-400 to-teal-500",
    glow: "#34d399",
  },
];

export default function GalaxyMemory() {
  const [selected, setSelected] = useState(null);

  const handleCardClick = (mem) => {
    setSelected(mem);
    if (AudioEngine) {
      AudioEngine.playStarChime();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 select-none">
      
      {/* Header text */}
      <div className="text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0 }}
        >
          <span className="font-cinzel text-xs tracking-[0.5em] text-yellow-300/80 uppercase block mb-4">
            ✦ Click On A Star ✦
          </span>
          <h2 className="font-cinzel text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent filter drop-shadow-[0_0_10px_rgba(167,139,250,0.3)]">
            Your Memory Galaxy
          </h2>
          <p className="font-cormorant text-gray-400/80 text-lg md:text-2xl italic mt-4 max-w-xl mx-auto leading-relaxed">
            Every star in this sky represents a beautiful piece of you that makes our lives infinitely brighter.
          </p>
        </motion.div>
      </div>

      {/* Grid of memory stars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {MEMORIES.map((mem, idx) => (
          <motion.div
            key={mem.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: idx * 0.15 }}
            onClick={() => handleCardClick(mem)}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group glass-strong p-8 rounded-[24px] border border-white/5 hover:border-pink-500/30 cursor-none relative overflow-hidden transition-all duration-500 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(167,139,250,0.15)] flex flex-col justify-between"
          >
            {/* Background Glow Orb */}
            <div 
              style={{ background: `radial-gradient(circle, ${mem.glow}15, transparent 70%)` }}
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-700" 
            />

            <div>
              {/* Star Core */}
              <div 
                style={{ textShadow: `0 0 15px ${mem.glow}` }}
                className="font-space text-3xl mb-6 text-white group-hover:rotate-180 transition-transform duration-1000 ease-in-out inline-block"
              >
                ✦
              </div>

              <h3 className="font-cinzel text-xl md:text-2xl font-bold text-white mb-4 tracking-[0.05em] group-hover:text-pink-300 transition-colors duration-300">
                {mem.title}
              </h3>
              
              <p className="font-cormorant text-gray-300/70 text-base md:text-lg italic leading-relaxed group-hover:text-gray-100 transition-colors duration-300">
                “{mem.quote.substring(0, 50)}...”
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="font-space text-xs uppercase tracking-[0.18em] text-pink-400/80 group-hover:text-pink-300">
                Reveal Memory ✦
              </span>
              <Sparkles className="w-4 h-4 text-yellow-300/60 group-hover:animate-spin" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal dialog for active memory */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010003]/90 backdrop-blur-xl"
            onClick={() => setSelected(null)}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 40, rotate: -2 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.8, y: 40, rotate: 2 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="glass-strong rounded-[32px] max-w-lg w-full p-8 border border-purple-500/25 relative overflow-hidden flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Star background decoration */}
              <div 
                style={{ background: `radial-gradient(circle, ${selected.glow}20, transparent 65%)` }}
                className="absolute -top-32 -left-32 w-80 h-80 rounded-full pointer-events-none" 
              />
              <div 
                style={{ background: `radial-gradient(circle, ${selected.glow}15, transparent 65%)` }}
                className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full pointer-events-none" 
              />

              {/* Close button */}
              <button 
                onClick={() => setSelected(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full cursor-none transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Frame */}
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 relative shadow-[0_15px_40px_rgba(0,0,0,0.8)] mb-6">
                <Image 
                  src={selected.img} 
                  alt={selected.title} 
                  fill
                  priority
                  sizes="(max-w-700px) 100vw"
                  className="object-cover scale-100 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04010a]/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Memory content */}
              <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                  <span className="font-space text-xs uppercase tracking-[0.2em] text-pink-400/90 font-medium">
                    Cosmic Memory {selected.id}
                  </span>
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                </div>

                <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-white mb-4 tracking-[0.05em] glow-text-purple">
                  {selected.title}
                </h3>
                
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mb-6" />

                <p className="font-cormorant text-gray-100 text-xl md:text-2xl italic leading-relaxed px-2 mb-8">
                  “{selected.quote}”
                </p>

                <button 
                  onClick={() => setSelected(null)}
                  className="glass px-8 py-3 rounded-full border border-purple-500/40 text-xs font-space tracking-[0.2em] text-purple-300 hover:bg-purple-900/20 transition-all duration-300 uppercase cursor-none"
                >
                  Close Star ✦
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
