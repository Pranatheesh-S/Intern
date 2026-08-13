import React from "react";
import { motion } from "framer-motion";

export const TripodSVG = ({ className, style, ...props }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} {...props}>
    {/* Legs */}
    <path d="M 30,10 L 15,90 M 70,10 L 85,90" stroke="#444" strokeWidth="6" strokeLinecap="round" />
    <path d="M 50,10 L 50,90" stroke="#222" strokeWidth="6" strokeLinecap="round" />
    {/* Top ring */}
    <ellipse cx="50" cy="10" rx="35" ry="6" fill="#333" />
  </svg>
);

export const SpiritLampSVG = ({ className, style, isLit = false, ...props }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} {...props}>
    <rect x="25" y="40" width="50" height="50" rx="10" fill="rgba(60, 60, 150, 0.8)" />
    <rect x="35" y="25" width="30" height="15" fill="#aaa" />
    <path d="M 45,25 L 45,15 C 45,10 55,10 55,15 L 55,25 Z" fill="#777" />
    {isLit && (
      <motion.path 
        d="M 50,15 Q 40,5 50,-10 Q 60,5 50,15" 
        fill="orange"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 0.3 }}
      />
    )}
  </svg>
);

export const WireGauzeSVG = ({ className, style, ...props }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} {...props}>
    <rect x="10" y="45" width="80" height="10" fill="#ddd" />
    {/* Mesh pattern */}
    <path d="M 15,45 L 15,55 M 25,45 L 25,55 M 35,45 L 35,55 M 45,45 L 45,55 M 55,45 L 55,55 M 65,45 L 65,55 M 75,45 L 75,55 M 85,45 L 85,55" stroke="#aaa" strokeWidth="1" />
    <path d="M 10,48 L 90,48 M 10,52 L 90,52" stroke="#aaa" strokeWidth="1" />
    <circle cx="50" cy="50" r="15" fill="#ccc" /> {/* Asbestos center */}
  </svg>
);

export const BeakerEmptySVG = ({ className, style, ...props }) => (
  <svg viewBox="0 0 100 120" className={className} style={style} {...props}>
    {/* Back rim */}
    <ellipse cx="50" cy="15" rx="40" ry="8" fill="rgba(255,255,255,0.2)" stroke="#ccc" strokeWidth="3" />
    {/* Body */}
    <path d="M 10,15 L 10,105 Q 10,115 20,115 L 80,115 Q 90,115 90,105 L 90,15" fill="rgba(255,255,255,0.1)" stroke="#ccc" strokeWidth="3" />
    {/* Spout */}
    <path d="M 8,15 Q 0,10 12,15" stroke="#ccc" strokeWidth="3" fill="none" />
  </svg>
);

export const BeakerFullSVG = ({ className, style, hasSoda = false, ...props }) => (
  <svg viewBox="0 0 100 120" className={className} style={style} {...props}>
    {/* Back rim */}
    <ellipse cx="50" cy="15" rx="40" ry="8" fill="rgba(255,255,255,0.2)" stroke="#ccc" strokeWidth="3" />
    
    {/* Water Fill */}
    <path d="M 12,65 Q 50,60 88,65 L 88,105 Q 88,113 80,113 L 20,113 Q 12,113 12,105 Z" fill="rgba(59, 130, 246, 0.4)" />
    
    {/* Baking soda particles */}
    {hasSoda && (
      <g>
        {Array.from({length: 15}).map((_, i) => (
          <circle key={i} cx={20 + Math.random() * 60} cy={95 + Math.random() * 15} r="2" fill="white" opacity="0.8" />
        ))}
      </g>
    )}

    {/* Body */}
    <path d="M 10,15 L 10,105 Q 10,115 20,115 L 80,115 Q 90,115 90,105 L 90,15" fill="none" stroke="#ccc" strokeWidth="3" />
    <path d="M 8,15 Q 0,10 12,15" stroke="#ccc" strokeWidth="3" fill="none" />
  </svg>
);

export const WaterBottleSVG = ({ className, style, ...props }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} {...props}>
    <path d="M 30,30 L 30,90 Q 30,100 40,100 L 60,100 Q 70,100 70,90 L 70,30 L 60,10 L 40,10 Z" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="2" />
    <rect x="40" y="5" width="20" height="5" fill="#2563eb" />
    <text x="50" y="60" fontSize="14" fill="#1d4ed8" textAnchor="middle" fontWeight="bold">H₂O</text>
  </svg>
);

export const BakingSodaBoxSVG = ({ className, style, ...props }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} {...props}>
    <rect x="20" y="20" width="60" height="70" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
    <rect x="25" y="30" width="50" height="20" fill="white" />
    <text x="50" y="45" fontSize="12" fill="#ca8a04" textAnchor="middle" fontWeight="bold">SODA</text>
  </svg>
);

export const GlassRodSVG = ({ className, style, ...props }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} {...props}>
    <line x1="80" y1="10" x2="20" y2="90" stroke="rgba(255,255,255,0.7)" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const LabStandSVG = ({ className, style, hasClamp = false, ...props }) => (
  <svg viewBox="0 0 100 200" className={className} style={style} {...props}>
    {/* Base */}
    <rect x="10" y="180" width="80" height="15" rx="2" fill="#333" />
    {/* Pole */}
    <rect x="20" y="10" width="10" height="170" fill="#666" />
    
    {/* Clamp */}
    {hasClamp && (
      <g>
        <rect x="30" y="40" width="30" height="8" fill="#444" />
        <path d="M 60,35 L 75,35 L 75,55 L 60,55" fill="none" stroke="#444" strokeWidth="4" />
        <circle cx="25" cy="44" r="5" fill="#888" />
      </g>
    )}
  </svg>
);

export const ThermometerSVG = ({ className, style, ...props }) => (
  <svg viewBox="0 0 100 200" className={className} style={style} {...props}>
    {/* Outer glass */}
    <rect x="45" y="10" width="10" height="160" rx="5" fill="rgba(200,200,200,0.5)" />
    {/* Bulb */}
    <circle cx="50" cy="175" r="12" fill="red" />
    {/* Mercury */}
    <rect x="48" y="90" width="4" height="85" fill="red" />
    {/* Markings */}
    <line x1="55" y1="30" x2="65" y2="30" stroke="#333" strokeWidth="1" />
    <line x1="55" y1="50" x2="60" y2="50" stroke="#333" strokeWidth="1" />
    <line x1="55" y1="70" x2="65" y2="70" stroke="#333" strokeWidth="1" />
    <line x1="55" y1="90" x2="60" y2="90" stroke="#333" strokeWidth="1" />
  </svg>
);
