"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, ChevronRight, Moon } from "lucide-react";
import AudioEngine from "./AudioEngine";

const STORY_SECTIONS = [
  {
    id: 1,
    num: "01",
    title: "The Day Everything Became Better",
    body: "The moment you came into existence, the universe quietly rearranged itself. Colors became brighter. Laughter found a new home. Life — with you in it — became something worth cherishing every single second.",
    align: "left",
    glowColor: "rgba(244,114,182,0.3)" // Pink
  },
  {
    id: 2,
    num: "02",
    title: "The Beautiful Memories",
    body: "Every memory with you is a constellation I carry in my chest. The silly moments, the quiet ones, the ones where we laughed until we cried — they are all sacred. They are all mine to keep forever.",
    align: "right",
    glowColor: "rgba(167,139,250,0.3)" // Purple
  },
  {
    id: 3,
    num: "03",
    title: "The Person Who Brings Happiness",
    body: "You walk into a room and something shifts. The air becomes lighter. Smiles come easier. It is not a coincidence — it is simply you, and the rare gift of your presence that so few people in this world possess.",
    align: "left",
    glowColor: "rgba(96,165,250,0.3)" // Blue
  },
  {
    id: 4,
    num: "04",
    title: "You Deserve The Entire Universe",
    body: "Not just the pretty parts of it. Not just the easy parts. Every nebula, every black hole, every supernova, every quiet midnight sky — all of it belongs to you. You were made from the same stardust that built galaxies.",
    align: "right",
    glowColor: "rgba(251,191,36,0.3)" // Gold
  },
  {
    id: 5,
    num: "05",
    title: "I'll Always Be There For You",
    body: "Through every storm, every dark night, every moment you feel small or lost — look up. I am the constant star that never moves from your sky. No distance, no silence, no time will ever change that.",
    align: "left",
    glowColor: "rgba(52,211,153,0.3)" // Green
  }
];

const POEMS = [
  [
    "You are the light that guides me home,",
    "A star I'll follow through any storm.",
    "In every quiet, in every loud,",
    "You make me endlessly proud.",
    "No matter where the cosmos bend,",
    "You'll always be my precious friend. ❤️"
  ],
  [
    "From stardust born, a glowing spark,",
    "You light the corners of the dark.",
    "With laughter sweet and spirit bold,",
    "More precious than the galaxy's gold.",
    "I hold your hand across the night,",
    "My sister, my eternal light. ✦"
  ],
  [
    "In all the galaxies that spin and shine,",
    "I am so grateful that your heart is mine.",
    "To guard, to cherish, and to guide,",
    "Forever walking by your side.",
    "A sister's love, a sacred flame,",
    "The universe whispers your name. 🌙"
  ]
];

export default function StoryScroll({ onNextPhase }) {
  const [poemIndex, setPoemIndex] = useState(0);
  const [revealedPoem, setRevealedPoem] = useState([]);
  const [writingPoem, setWritingPoem] = useState(false);
  const [poemVisible, setPoemVisible] = useState(false);

  const startWritingPoem = () => {
    if (writingPoem) return;
    setWritingPoem(true);
    setRevealedPoem([]);
    setPoemVisible(true);

    if (AudioEngine) {
      AudioEngine.playStarChime();
    }

    const selectedPoem = POEMS[poemIndex];
    let currentLine = 0;
    
    const interval = setInterval(() => {
      if (currentLine < selectedPoem.length) {
        setRevealedPoem(prev => [...prev, selectedPoem[currentLine]]);
        if (AudioEngine) {
          AudioEngine.playStarChime();
        }
        currentLine++;
      } else {
        clearInterval(interval);
        setWritingPoem(false);
        // Cycle to next poem for next time
        setPoemIndex((prev) => (prev + 1) % POEMS.length);
      }
    }, 1800); // Reveal a line every 1.8s
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-24 select-none">
      
      {/* Introduction Header */}
      <div className="text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0 }}
        >
          <span className="font-cinzel text-xs tracking-[0.5em] text-purple-400 uppercase block mb-4">
            ✦ Cinematic Story Mode ✦
          </span>
          <h2 className="font-cinzel text-4xl md:text-6xl font-bold bg-gradient-to-r from-violet-300 via-pink-300 to-amber-300 bg-clip-text text-transparent filter drop-shadow-[0_0_8px_rgba(244,114,182,0.3)]">
            Our Chapters
          </h2>
          <div className="w-16 h-[1px] bg-purple-500/40 mx-auto mt-6" />
        </motion.div>
      </div>

      {/* Vertical story scrolling */}
      <div className="flex flex-col gap-24 relative mb-32">
        {/* Central connecting glowing timeline line */}
        <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-[1px] bg-gradient-to-b from-pink-500/40 via-purple-500/20 to-yellow-500/40 pointer-events-none transform md:-translate-x-1/2" />

        {STORY_SECTIONS.map((sec, idx) => (
          <motion.div
            key={sec.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, cubicBezier: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col md:flex-row items-start relative w-full ${
              sec.align === "right" ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Timeline node */}
            <div className="absolute left-[9px] md:left-1/2 w-4 h-4 rounded-full bg-black border-2 border-pink-400 transform md:-translate-x-1/2 top-4 shadow-[0_0_10px_#f472b6] z-10" />

            {/* Empty space for spacing grid on larger screens */}
            <div className="hidden md:block w-1/2" />

            {/* Story Card */}
            <div className="w-full md:w-[45%] pl-12 md:pl-0">
              <motion.div
                whileHover={{ scale: 1.01 }}
                style={{ boxShadow: `0 10px 40px -10px ${sec.glowColor}` }}
                className="glass-strong p-8 rounded-[28px] border border-white/5 hover:border-pink-500/20 duration-500 relative overflow-hidden"
              >
                {/* Background soft lighting glow */}
                <div 
                  style={{ background: `radial-gradient(circle, ${sec.glowColor} 0%, transparent 70%)` }}
                  className="absolute -top-24 -left-24 w-60 h-60 rounded-full pointer-events-none" 
                />

                <span className="font-cinzel text-5xl font-extrabold text-white/5 absolute right-6 top-4 select-none">
                  {sec.num}
                </span>

                <span className="font-cinzel text-xs tracking-[0.25em] text-yellow-400/80 uppercase block mb-3">
                  Chapter {sec.num}
                </span>

                <h3 className="font-cinzel text-xl md:text-2xl font-bold text-white mb-6 tracking-wide leading-snug">
                  {sec.title}
                </h3>

                <p className="font-cormorant text-gray-200/90 text-lg md:text-xl italic leading-loose">
                  {sec.body}
                </p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Starry Poem Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="glass-strong p-8 md:p-12 rounded-[32px] border border-yellow-500/20 text-center relative overflow-hidden shadow-[0_15px_40px_rgba(251,191,36,0.05)] mb-16"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent pointer-events-none" />

        <span className="font-cinzel text-xs tracking-[0.4em] text-yellow-300/80 uppercase block mb-3">
          ✦ Sibling Tribute ✦
        </span>
        <h3 className="font-cinzel text-2xl md:text-4xl font-bold text-[#fde68a] mb-8 tracking-[0.05em] glow-text-gold">
          Written By The Stars
        </h3>

        <div className="min-h-[220px] flex items-center justify-center flex-col">
          <AnimatePresence mode="wait">
            {!poemVisible ? (
              <motion.div 
                key="trigger"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="font-cormorant text-gray-400 text-lg md:text-xl italic mb-8 max-w-md mx-auto">
                  Ask the constellations to compose a unique, heartfelt poem for you.
                </p>
                <button
                  onClick={startWritingPoem}
                  className="glass px-8 py-3.5 rounded-full border border-yellow-500/40 text-yellow-300 text-xs tracking-[0.2em] uppercase font-space hover:bg-yellow-950/20 hover:border-yellow-400/80 transition-all duration-300 shadow-[0_0_15px_rgba(251,191,36,0.1)] cursor-none"
                >
                  ✦ Consult The Stars ✦
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="writing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full"
              >
                <div className="flex flex-col gap-4 font-cormorant text-xl md:text-2xl italic leading-relaxed text-gray-100/90">
                  {revealedPoem.map((line, idx) => (
                    <motion.p
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.0 }}
                      className="glow-text-white"
                    >
                      {line}
                    </motion.p>
                  ))}
                  
                  {writingPoem && (
                    <motion.div 
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="flex items-center justify-center gap-1.5 mt-2"
                    >
                      <Moon className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
                      <span className="text-sm font-space tracking-[0.2em] uppercase text-yellow-300/60">
                        Synthesizing stardust stanzas...
                      </span>
                    </motion.div>
                  )}
                </div>

                {!writingPoem && revealedPoem.length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    onClick={startWritingPoem}
                    className="mt-8 text-xs font-space tracking-[0.18em] uppercase text-yellow-300/70 hover:text-white cursor-none"
                  >
                    ✦ Request Another Poem
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Button to proceed to the gift box */}
      <div className="text-center mt-12">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="inline-block"
        >
          <button
            onClick={onNextPhase}
            className="glass px-10 py-4.5 rounded-full border border-pink-500/40 bg-pink-950/10 text-pink-300 text-sm uppercase tracking-[0.22em] font-space hover:bg-pink-950/30 hover:border-pink-300 transition-all duration-300 shadow-[0_0_20px_rgba(244,114,182,0.2)] hover:shadow-[0_0_40px_rgba(244,114,182,0.45)] cursor-none"
          >
            ✦ Open Your Gift ✦
          </button>
        </motion.div>
      </div>

    </div>
  );
}
