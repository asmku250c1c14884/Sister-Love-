"use client";

class CinematicAudioEngine {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.initialized = false;
    
    this.masterGain = null;
    this.padGain = null;
    
    this.heartbeatInterval = null;
    this.padInterval = null;
    this.bpm = 60;
  }
  
  init() {
    if (this.initialized) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    try {
      this.ctx = new AudioContextClass();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      
      this.analyser.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
      
      this.padGain = this.ctx.createGain();
      this.padGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.padGain.connect(this.analyser);
      
      this.initialized = true;
    } catch (e) {
      console.error("Failed to initialize Web Audio context", e);
    }
  }
  
  startHeartbeat() {
    this.init();
    if (!this.initialized) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    
    const playPulse = () => {
      if (!this.ctx || this.ctx.state === 'suspended') return;
      const t = this.ctx.currentTime;
      this.synthHeartbeat(t);
      this.synthHeartbeat(t + 0.18); // double heartbeat: lub-dub
    };
    
    playPulse();
    this.heartbeatInterval = setInterval(playPulse, (60 / this.bpm) * 1000);
  }
  
  synthHeartbeat(time) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, time); // Deep bass pulse
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.3);
    
    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
    
    osc.connect(gain);
    gain.connect(this.analyser);
    
    osc.start(time);
    osc.stop(time + 0.35);
  }
  
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
  
  startAmbientPad() {
    this.init();
    if (!this.initialized) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    // Slow fade-in of background pad
    this.padGain.gain.setValueAtTime(this.padGain.gain.value, this.ctx.currentTime);
    this.padGain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 3.0);
    
    // Cinematic, emotional minor chord progression (e.g. A minor9 - F maj9 - C maj9 - E min/G)
    const chords = [
      [110.00, 146.83, 164.81, 220.00, 261.63], // Am9
      [87.31, 130.81, 174.61, 220.00, 261.63],  // Fmaj9
      [130.81, 164.81, 196.00, 246.94, 293.66], // Cmaj9
      [98.00, 146.83, 164.81, 196.00, 246.94]   // Em/G
    ];
    
    let chordIdx = 0;
    const playChord = () => {
      if (!this.ctx || this.ctx.state === 'suspended') return;
      const frequencies = chords[chordIdx];
      const now = this.ctx.currentTime;
      
      frequencies.forEach((freq) => {
        // Slow swelling pad notes (7.5 seconds)
        this.synthPadNote(freq, now, 7.5);
      });
      
      chordIdx = (chordIdx + 1) % chords.length;
    };
    
    playChord();
    if (this.padInterval) clearInterval(this.padInterval);
    this.padInterval = setInterval(playChord, 6800); // Swell overlapping
  }
  
  synthPadNote(freq, time, duration) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle'; // Rich but smooth spectrum
    osc.frequency.setValueAtTime(freq, time);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, time);
    filter.frequency.exponentialRampToValueAtTime(750, time + duration / 2);
    filter.frequency.exponentialRampToValueAtTime(250, time + duration);
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.08, time + 2.5); // Warm slow attack
    gain.gain.setValueAtTime(0.08, time + duration - 2.0);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.padGain);
    
    osc.start(time);
    osc.stop(time + duration);
  }
  
  stopAmbientPad() {
    if (this.padInterval) {
      clearInterval(this.padInterval);
      this.padInterval = null;
    }
    if (this.padGain && this.ctx) {
      this.padGain.gain.setValueAtTime(this.padGain.gain.value, this.ctx.currentTime);
      this.padGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2.0);
    }
  }
  
  playStarChime() {
    this.init();
    if (!this.initialized || !this.ctx || this.ctx.state === 'suspended') return;
    
    const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51]; // C5 to E6 Pentatonic Scale
    const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
    const time = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const delay = this.ctx.createDelay();
    const feedback = this.ctx.createGain();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    
    // Plucked string envelope
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 1.2);
    
    // Space Echo (Feedback Delay)
    delay.delayTime.setValueAtTime(0.28, time);
    feedback.gain.setValueAtTime(0.35, time);
    
    osc.connect(gain);
    gain.connect(this.analyser);
    
    // Delay routing
    gain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(this.analyser);
    
    osc.start(time);
    osc.stop(time + 1.5);
  }
  
  playExplosion() {
    this.init();
    if (!this.initialized || !this.ctx || this.ctx.state === 'suspended') return;
    
    const time = this.ctx.currentTime;
    
    // Sub impact frequency sweep
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(120, time);
    subOsc.frequency.exponentialRampToValueAtTime(10, time + 1.5);
    
    subGain.gain.setValueAtTime(0.9, time);
    subGain.gain.exponentialRampToValueAtTime(0.001, time + 1.6);
    
    subOsc.connect(subGain);
    subGain.connect(this.analyser);
    
    subOsc.start(time);
    subOsc.stop(time + 1.7);
    
    // Fireworks crackle noise burst
    try {
      const bufferSize = this.ctx.sampleRate * 1.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;
      
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(800, time);
      noiseFilter.frequency.exponentialRampToValueAtTime(150, time + 1.4);
      
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 1.4);
      
      noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.analyser);
      
      noiseNode.start(time);
      noiseNode.stop(time + 1.5);
    } catch (e) {
      console.warn("Could not synth noise buffer", e);
    }
  }
  
  fadeAllOut() {
    if (!this.initialized || !this.ctx) return;
    try {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 3.0);
      setTimeout(() => {
        this.stopHeartbeat();
        this.stopAmbientPad();
      }, 3200);
    } catch (e) {
      console.error(e);
    }
  }
  
  getAnalyserData() {
    if (!this.analyser) return null;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

// Export single audio engine instance
const AudioEngine = typeof window !== 'undefined' ? new CinematicAudioEngine() : null;
export default AudioEngine;
