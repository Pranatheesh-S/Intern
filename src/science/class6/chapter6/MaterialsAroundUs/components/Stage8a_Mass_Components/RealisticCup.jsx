import React from 'react';
import { motion, useTransform } from 'framer-motion';

export const RealisticCup = ({ material, velocityX = null }) => {
  // If velocity is provided, we create a subtle reactive slosh.
  // Otherwise, fallback to 0.
  const smoothVelocity = velocityX || 0;
  
  // Subtle rotation for liquids/materials based on horizontal velocity
  const sloshRotate = velocityX ? useTransform(velocityX, [-1000, 1000], [-10, 10]) : 0;
  // Pebbles have very rigid settling, maybe a slight shift
  const pebbleShift = velocityX ? useTransform(velocityX, [-1000, 1000], [-2, 2]) : 0;

  return (
    <svg viewBox="0 0 100 120" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))', overflow: 'visible', pointerEvents: 'none' }}>
      <defs>
        <pattern id="sandPat" patternUnits="userSpaceOnUse" width="12" height="12">
          <rect width="12" height="12" fill="#cda876" />
          <circle cx="2" cy="2" r="0.8" fill="#8c5020" opacity="0.7"/>
          <circle cx="8" cy="4" r="1.2" fill="#e8d8b0" opacity="0.9"/>
          <circle cx="4" cy="9" r="1" fill="#7a3a10" opacity="0.6"/>
          <circle cx="10" cy="10" r="0.8" fill="#4d2f1a" opacity="0.5"/>
          <circle cx="6" cy="6" r="0.5" fill="#f4e4c1" opacity="0.8"/>
        </pattern>
        <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(56, 189, 248, 0.4)" />
          <stop offset="50%" stopColor="rgba(56, 189, 248, 0.7)" />
          <stop offset="100%" stopColor="rgba(14, 165, 233, 0.5)" />
        </linearGradient>
        <linearGradient id="glassGlare" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
          <stop offset="20%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="80%" stopColor="rgba(255,255,255,0.0)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
        </linearGradient>
        
        {/* Subtle drop shadow for pebbles */}
        <filter id="pebbleShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="0.8" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Back Wall of Cylinder Jar */}
      <path d="M 20 45 L 80 45 L 80 105 A 30 8 0 0 1 20 105 Z" fill="rgba(240, 245, 250, 0.4)" stroke="rgba(200, 210, 220, 0.5)" strokeWidth="1"/>
      <ellipse cx="50" cy="45" rx="30" ry="8" fill="rgba(240, 245, 250, 0.3)" stroke="rgba(200, 210, 220, 0.5)" strokeWidth="1.5" />

      {/* Materials */}
      {material === 'water' && (
        <motion.g style={{ originX: '50px', originY: '70px', rotate: sloshRotate }}>
          {/* Liquid Body */}
          <path d="M 20 70 L 80 70 L 80 105 A 30 8 0 0 1 20 105 Z" fill="url(#waterGrad)" />
          {/* Liquid Surface */}
          <motion.ellipse 
            cx="50" cy="70" rx="30" ry="8" 
            fill="rgba(125, 211, 252, 0.6)" stroke="rgba(56, 189, 248, 0.8)" strokeWidth="1"
            animate={{ cy: [70, 71, 70], ry: [8, 7.5, 8] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          <motion.ellipse 
            cx="50" cy="70" rx="28" ry="6.5" fill="rgba(255, 255, 255, 0.4)" 
            animate={{ cy: [70, 71, 70] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.2 }}
          />
        </motion.g>
      )}

      {material === 'sand' && (
        <motion.g style={{ originX: '50px', originY: '70px', rotate: sloshRotate }}>
          {/* Sand Body */}
          <path d="M 20 70 Q 35 67, 50 71 T 80 69 L 80 105 A 30 8 0 0 1 20 105 Z" fill="url(#sandPat)" />
          {/* Sand Surface Line */}
          <path d="M 20 70 Q 35 67, 50 71 T 80 69" fill="none" stroke="#a46b34" strokeWidth="1.5" opacity="0.8"/>
          {/* Inner shadow for volume */}
          <path d="M 20 70 L 25 75 L 25 102 A 25 6 0 0 0 75 102 L 75 75 L 80 70 L 80 105 A 30 8 0 0 1 20 105 Z" fill="rgba(0,0,0,0.2)" />
        </motion.g>
      )}

      {material === 'pebbles' && (
        <motion.g style={{ x: pebbleShift }}>
          {/* Very bottom filler */}
          <path d="M 25 100 L 75 100 L 80 105 A 30 8 0 0 1 20 105 Z" fill="#44403c" opacity="0.8"/>

          {/* Rendering individual pebbles. We keep the static rendering but wrap in motion if we wanted per-pebble anim. Group shift is enough. */}
          <g filter="url(#pebbleShadow)">
            {/* Layer 1 - Bottom */}
            <ellipse cx="26" cy="103" rx="5" ry="3.5" fill="#78716c" transform="rotate(-15 26 103)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="35" cy="104" rx="4" ry="3" fill="#a8a29e" transform="rotate(20 35 104)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="44" cy="103" rx="6" ry="4" fill="#57534e" transform="rotate(-5 44 103)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="54" cy="104" rx="5" ry="3.5" fill="#8b7355" transform="rotate(30 54 104)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="64" cy="102" rx="4.5" ry="3.5" fill="#d6d3d1" transform="rotate(-25 64 102)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="74" cy="103" rx="5" ry="3.5" fill="#a8a29e" transform="rotate(10 74 103)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>

            {/* Layer 2 */}
            <ellipse cx="24" cy="98" rx="4" ry="3" fill="#8b7355" transform="rotate(10 24 98)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="32" cy="97" rx="5" ry="4" fill="#6a635a" transform="rotate(-35 32 97)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="41" cy="99" rx="4.5" ry="3" fill="#a8a29e" transform="rotate(15 41 99)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="50" cy="96" rx="5.5" ry="4" fill="#9c9385" transform="rotate(-10 50 96)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="59" cy="98" rx="4" ry="3.5" fill="#57534e" transform="rotate(45 59 98)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="68" cy="96" rx="4.5" ry="3" fill="#78716c" transform="rotate(-20 68 96)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="76" cy="97" rx="4" ry="3.5" fill="#d6d3d1" transform="rotate(20 76 97)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>

            {/* Layer 3 */}
            <ellipse cx="27" cy="92" rx="5" ry="4" fill="#a8a29e" transform="rotate(-40 27 92)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="36" cy="91" rx="4" ry="3.5" fill="#78716c" transform="rotate(25 36 91)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="45" cy="93" rx="5.5" ry="3" fill="#d6d3d1" transform="rotate(-5 45 93)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="54" cy="90" rx="4.5" ry="4" fill="#6a635a" transform="rotate(15 54 90)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="63" cy="91" rx="5" ry="3.5" fill="#a8a29e" transform="rotate(-30 63 91)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="73" cy="92" rx="4.5" ry="3" fill="#57534e" transform="rotate(35 73 92)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>

            {/* Layer 4 */}
            <ellipse cx="24" cy="87" rx="4.5" ry="3" fill="#57534e" transform="rotate(35 24 87)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="33" cy="85" rx="5" ry="4" fill="#8b7355" transform="rotate(-15 33 85)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="42" cy="86" rx="4" ry="3.5" fill="#d6d3d1" transform="rotate(20 42 86)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="51" cy="84" rx="5.5" ry="3.5" fill="#78716c" transform="rotate(-10 51 84)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="60" cy="86" rx="4" ry="3" fill="#9c9385" transform="rotate(40 60 86)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="69" cy="84" rx="4.5" ry="3.5" fill="#6a635a" transform="rotate(-25 69 84)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="76" cy="86" rx="4" ry="3" fill="#a8a29e" transform="rotate(15 76 86)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>

            {/* Layer 5 */}
            <ellipse cx="28" cy="81" rx="5" ry="3.5" fill="#9c9385" transform="rotate(-5 28 81)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="37" cy="79" rx="4.5" ry="4" fill="#57534e" transform="rotate(30 37 79)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="47" cy="81" rx="5" ry="3" fill="#a8a29e" transform="rotate(-20 47 81)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="56" cy="78" rx="4" ry="3.5" fill="#78716c" transform="rotate(15 56 78)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="65" cy="80" rx="4.5" ry="3" fill="#8b7355" transform="rotate(-40 65 80)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="74" cy="79" rx="4" ry="3.5" fill="#57534e" transform="rotate(10 74 79)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>

            {/* Layer 6 (Surface) */}
            <ellipse cx="25" cy="75" rx="4" ry="3" fill="#d6d3d1" transform="rotate(25 25 75)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="33" cy="74" rx="4.5" ry="3.5" fill="#6a635a" transform="rotate(-15 33 74)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="42" cy="73" rx="5" ry="3" fill="#78716c" transform="rotate(10 42 73)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="52" cy="75" rx="4.5" ry="4" fill="#a8a29e" transform="rotate(-35 52 75)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="61" cy="73" rx="4" ry="3.5" fill="#57534e" transform="rotate(20 61 73)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="70" cy="75" rx="3.5" ry="2.5" fill="#9c9385" transform="rotate(-5 70 75)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="77" cy="74" rx="4" ry="3" fill="#a8a29e" transform="rotate(30 77 74)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>

            {/* Surface overlapping pebbles */}
            <ellipse cx="38" cy="70" rx="4" ry="3" fill="#8b7355" transform="rotate(-25 38 70)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="48" cy="69" rx="4.5" ry="3.5" fill="#d6d3d1" transform="rotate(15 48 69)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
            <ellipse cx="58" cy="71" rx="3.5" ry="2.5" fill="#6a635a" transform="rotate(-40 58 71)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
          </g>
        </motion.g>
      )}

      {/* Front of the Cylinder (Glass glare and reflection) */}
      <path d="M 20 45 L 80 45 L 80 105 A 30 8 0 0 1 20 105 Z" fill="url(#glassGlare)" />
      
      {/* Front rim */}
      <path d="M 20 45 A 30 8 0 0 0 80 45" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
      <path d="M 18 45 A 32 9 0 0 0 82 45" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      
      {/* Left Highlight */}
      <path d="M 23 55 L 23 95" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3.5" strokeLinecap="round" filter="blur(0.5px)" />
      {/* Right Edge Glow */}
      <path d="M 77 55 L 77 95" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" filter="blur(0.5px)" />
      
      {/* Bottom Curve Highlight */}
      <path d="M 28 103 A 22 6 0 0 0 72 103" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" filter="blur(0.5px)" />
    </svg>
  );
};
