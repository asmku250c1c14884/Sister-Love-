"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, MeshTransmissionMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// Procedural Nebula Background Shader
const NebulaShader = {
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2() },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec2 uResolution;
    varying vec2 vUv;

    // Fractional Brownian Motion noise helper
    float hash(vec2 p) { 
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); 
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), 
        u.y
      );
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < 4; ++i) {
        v += a * noise(p);
        p = rot * p * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = vUv;
      vec2 p = (uv - 0.5) * 2.2;
      
      // Swirling gas coordinates
      vec2 q = vec2(0.0);
      q.x = fbm(p + 0.06 * uTime);
      q.y = fbm(p + vec2(1.0));
      
      vec2 r = vec2(0.0);
      r.x = fbm(p + q + vec2(1.7, 9.2) + 0.05 * uTime);
      r.y = fbm(p + q + vec2(8.3, 2.8) + 0.03 * uTime);
      
      float f = fbm(p + r);
      
      // Deep space colors
      vec3 colorObsidian = vec3(0.01, 0.0, 0.04);
      vec3 colorPurple = vec3(0.2, 0.08, 0.35);
      vec3 colorBlue = vec3(0.05, 0.15, 0.4);
      vec3 colorPink = vec3(0.4, 0.08, 0.28);
      vec3 colorGold = vec3(0.35, 0.28, 0.08);
      
      // Color mixing based on fbm noise
      vec3 color = mix(colorObsidian, colorPurple, f);
      color = mix(color, colorBlue, dot(q, r) * 1.2);
      color = mix(color, colorPink, fbm(p * 1.5 + vec2(uTime * 0.02)) * 0.6);
      color = mix(color, colorGold, r.x * r.x * 0.45);
      
      // Vignette effect
      float dist = length(uv - 0.5);
      color *= smoothstep(1.0, 0.45, dist);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
};

// Nebula Background Component
function SpaceBackground() {
  const meshRef = useRef();
  const { size } = useThree();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
  }), [size.width, size.height]);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial
        args={[NebulaShader]}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

// Sparkle Starfield Particles
function SparkleStarfield() {
  const count = 1200;
  const meshRef = useRef();
  const [positions, speeds, twinkling] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const tw = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22; // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2; // Z
      spd[i] = Math.random() * 0.02 + 0.005;
      tw[i] = Math.random() * Math.PI * 2;
    }
    return [pos, spd, tw];
  }, []);

  useFrame((state) => {
    const points = meshRef.current;
    if (!points) return;
    const time = state.clock.getElapsedTime();
    
    const posArray = points.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      // Slow rotation / drift
      posArray[i * 3 + 1] -= speeds[i] * 0.12; // drift down
      if (posArray[i * 3 + 1] < -7) posArray[i * 3 + 1] = 7;
      
      // Slowly rotate around Z axis
      const x = posArray[i * 3];
      const y = posArray[i * 3 + 1];
      const angle = 0.0003;
      posArray[i * 3] = x * Math.cos(angle) - y * Math.sin(angle);
      posArray[i * 3 + 1] = x * Math.sin(angle) + y * Math.cos(angle);
    }
    points.geometry.attributes.position.needsUpdate = true;
    
    // Twinkling scale effect
    points.rotation.y = time * 0.015;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#ffffff"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 3D Glassmorphic Crystal Gift Box
function CrystalGiftBox({ active, onBoxClick, giftOpened }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Realistic slow floating using sine waves
    groupRef.current.position.y = Math.sin(time * 1.2) * 0.15;
    // Rotation
    groupRef.current.rotation.y = time * 0.25;
    groupRef.current.rotation.x = Math.cos(time * 0.5) * 0.08;
  });

  if (!active) return null;

  return (
    <group ref={groupRef} position={[0, 0, 4]}>
      {/* 3D Glass Box Outer */}
      <mesh onClick={onBoxClick}>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          thickness={0.2}
          chromaticAberration={0.05}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.2}
          temporalDistortion={0.0}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.9}
          opacity={1.0}
          roughness={0.15}
          metalness={0.1}
          color="#fde68a" // warm golden crystal tone
        />
      </mesh>

      {/* Gold Ribbon Mesh */}
      <mesh>
        <boxGeometry args={[1.64, 0.15, 1.64]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.95}
          roughness={0.15}
          emissive="#fbbf24"
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh>
        <boxGeometry args={[1.64, 1.64, 0.15]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.95}
          roughness={0.15}
          emissive="#fbbf24"
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh>
        <boxGeometry args={[0.15, 1.64, 1.64]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.95}
          roughness={0.15}
          emissive="#fbbf24"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Floating Inner Sparkle Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[giftOpened ? 0.01 : 0.35, 16, 16]} />
        <meshBasicMaterial 
          color={giftOpened ? "#f472b6" : "#fbbf24"} 
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// Camera controller to zoom based on state changes
function CameraController({ phase }) {
  const { camera } = useThree();
  
  useEffect(() => {
    // Zoom and position animations matching phases
    if (phase === "intro") {
      gsap.to(camera.position, { x: 0, y: 0, z: 12, duration: 3, ease: "power2.out" });
    } else if (phase === "reveal") {
      gsap.to(camera.position, { x: 0, y: 0, z: 9, duration: 4, ease: "power2.out" });
    } else if (phase === "galaxy") {
      gsap.to(camera.position, { x: 0, y: 1.5, z: 11, duration: 3, ease: "power3.inOut" });
    } else if (phase === "story") {
      gsap.to(camera.position, { x: -0.5, y: -0.5, z: 10, duration: 4, ease: "power2.inOut" });
    } else if (phase === "gift") {
      gsap.to(camera.position, { x: 0, y: 0, z: 7.2, duration: 2.5, ease: "power3.out" });
    } else if (phase === "ending") {
      gsap.to(camera.position, { x: 0, y: 0, z: 15, duration: 5, ease: "power1.inOut" });
    }
  }, [phase, camera]);

  return null;
}

export default function SpaceCanvas({ phase, giftOpened, onBoxClick }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: phase === "gift" && !giftOpened ? "auto" : "none" }}>
      <Canvas
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 0, 12], fov: 60 }}
      >
        <color attach="background" args={["#03000a"]} />
        
        {/* Lights */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#fbbf24" />
        <pointLight position={[-10, -10, -10]} intensity={1.0} color="#a78bfa" />
        <directionalLight position={[0, 5, 5]} intensity={1.2} color="#f472b6" />
        
        {/* Nebula and Particles */}
        <SpaceBackground />
        <SparkleStarfield />
        
        {/* 3D Interactive Items */}
        <CrystalGiftBox 
          active={phase === "gift"} 
          onBoxClick={onBoxClick} 
          giftOpened={giftOpened}
        />
        
        {/* Camera Flow Control */}
        <CameraController phase={phase} />
      </Canvas>
    </div>
  );
}
