import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Particles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate 30 random particles
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: `${p.x}vw`, y: `${p.y}vh` }}
          animate={{
            opacity: [0, 0.4, 0.4, 0],
            x: [`${p.x}vw`, `${p.x + (Math.random() * 10 - 5)}vw`],
            y: [`${p.y}vh`, `${p.y - 15}vh`]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: '#a5b4fc', // Subtle blue/violet
            boxShadow: '0 0 8px rgba(165, 180, 252, 0.5)'
          }}
        />
      ))}
    </div>
  );
};

export default function BackgroundEffects() {
  return (
    <div style={{ 
      position: 'absolute', 
      inset: 0, 
      zIndex: 0, 
      pointerEvents: 'none',
      opacity: 0.08,
      overflow: 'hidden'
    }}>
      {/* Subtle Glowing Grid */}
      <div style={{
        position: 'absolute',
        inset: '-50%',
        backgroundImage: `
          linear-gradient(to right, currentColor 1px, transparent 1px),
          linear-gradient(to bottom, currentColor 1px, transparent 1px)
        `,
        opacity: 0.1,
        backgroundSize: '40px 40px',
        transform: 'perspective(500px) rotateX(45deg)',
        transformOrigin: 'top',
        maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
      }} />

      {/* Abstract Contour Lines using SVG patterns */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <pattern id="contours" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
          <path d="M 0 50 Q 50 100 100 50 T 200 50" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
          <path d="M 0 100 Q 50 150 100 100 T 200 100" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
          <path d="M 0 150 Q 50 200 100 150 T 200 150" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#contours)" />
      </svg>

      {/* Cloud Shadows & Ambient Lighting */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
          repeatType: "mirror"
        }}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at center, rgba(165, 180, 252, 0.4) 0%, transparent 60%)',
          backgroundSize: '200% 200%',
          opacity: 0.5
        }}
      />

      <Particles />
    </div>
  );
}
