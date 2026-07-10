import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Trophy, Sparkles, Award, ArrowLeft, ArrowRight, Home, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import AIMentor from './AIMentor';

const CHALLENGES = [
  {
    id: 'tumbler',
    title: 'Challenge 1: The Water Tumbler',
    objective: 'Design a container that can hold liquid without leaking or collapsing.',
    successMsg: 'Perfect! Glass is waterproof (impermeable) and rigid. It keeps water trapped inside without absorbing it or letting it escape.',
    options: [
      { 
        id: 'cloth', 
        name: 'Cotton Cloth', 
        status: 'fail', 
        animation: 'leak',
        reason: 'Cloth is made of woven fibers with tiny gaps. Liquid leaks right through it!',
        hint: 'Cloth is porous. Think of materials that are waterproof!'
      },
      { 
        id: 'paper', 
        name: 'Dry Paper', 
        status: 'fail', 
        animation: 'collapse',
        reason: 'Paper absorbs water, becomes soft and soggy, and quickly collapses under the weight!',
        hint: 'Paper absorbs water. We need something that does not absorb moisture.'
      },
      { 
        id: 'glass', 
        name: 'Glass', 
        status: 'success', 
        animation: 'fill',
        reason: 'Glass is waterproof, non-porous, and holds its shape perfectly.',
        hint: 'This is the perfect material!'
      }
    ]
  },
  {
    id: 'cooking_pot',
    title: 'Challenge 2: The Cooking Pot',
    objective: 'Design a pot to boil water over a gas stove flame.',
    successMsg: 'Spectacular! Steel conducts heat efficiently to cook the food and can withstand direct fire without melting or burning.',
    options: [
      { 
        id: 'wood', 
        name: 'Pine Wood', 
        status: 'fail', 
        animation: 'burn',
        reason: 'Wood has a low ignition point. If placed on a stove, it catches fire and burns up!',
        hint: 'Wood is combustible. We need a heat-resistant material.'
      },
      { 
        id: 'plastic', 
        name: 'Plastic', 
        status: 'fail', 
        animation: 'melt',
        reason: 'Plastics melt at low temperatures, which would ruin the stove and contaminate food!',
        hint: 'Plastic has a low melting point. We need something that remains solid under high heat.'
      },
      { 
        id: 'steel', 
        name: 'Stainless Steel', 
        status: 'success', 
        animation: 'cook',
        reason: 'Steel is a metal that conducts heat and has a very high melting point.',
        hint: 'This is the perfect material!'
      }
    ]
  },
  {
    id: 'raincoat',
    title: 'Challenge 3: The Raincoat',
    objective: 'Design a raincoat for a child walking to school in heavy rain.',
    successMsg: 'Brilliant! Plastic/Rubber is waterproof to keep the child dry, and flexible/lightweight so they can walk comfortably.',
    options: [
      { 
        id: 'canvas', 
        name: 'Canvas Fabric', 
        status: 'fail', 
        animation: 'soak',
        reason: 'Canvas is woven cotton; it absorbs water and gets heavy, letting rain soak through!',
        hint: 'Canvas fabric absorbs water. We need an impermeable coating.'
      },
      { 
        id: 'iron', 
        name: 'Iron Metal Suit', 
        status: 'fail', 
        animation: 'heavy',
        reason: 'An iron suit is waterproof, but it is extremely heavy and rigid. The child would not be able to walk!',
        hint: 'Iron is waterproof but too heavy and stiff. We need something flexible and light.'
      },
      { 
        id: 'plastic_raincoat', 
        name: 'Waterproof Plastic', 
        status: 'success', 
        animation: 'dry',
        reason: 'Plastic is lightweight, highly flexible, and completely waterproof.',
        hint: 'This is the perfect material!'
      }
    ]
  }
];

export default function Stage3_Design({ onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [solved, setSolved] = useState({});
  const [mentorState, setMentorState] = useState('idle');
  const [mentorText, setMentorText] = useState(
    "Welcome to the Material Studio! 🛠️ Here, we choose suitable materials based on their properties. Pick a design challenge below to begin testing."
  );
  const [isGameFinished, setIsGameFinished] = useState(false);

  const activeChallenge = CHALLENGES[currentIdx];

  const handleTestOption = (option) => {
    setSelectedOpt(option);
    
    if (option.status === 'success') {
      setMentorState('success');
      setMentorText(option.reason + " " + activeChallenge.successMsg);
      
      const nextSolved = { ...solved, [activeChallenge.id]: true };
      setSolved(nextSolved);

      // Trigger soft confetti on final challenge completion to celebrate correct answer
      if (Object.keys(nextSolved).length === CHALLENGES.length) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    } else {
      setMentorState('error');
      setMentorText(`Testing failed! ${option.reason}`);
    }
  };

  const handleNextChallenge = () => {
    setCurrentIdx(prev => Math.min(prev + 1, CHALLENGES.length - 1));
    setSelectedOpt(null);
    setMentorState('idle');
    setMentorText("Let's look at the next design challenge. What properties must this material have?");
  };

  // Rendering Custom Failure/Success SVG Mockup Animations
  const renderMockupCanvas = () => {
    if (!selectedOpt) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '3rem' }}>🧪</span>
          <p style={{ fontSize: '0.85rem', fontWeight: '500', marginTop: '0.5rem' }}>
            Select a material option to run the test simulation.
          </p>
        </div>
      );
    }

    const { animation } = selectedOpt;

    switch (animation) {
      case 'leak': // Cloth Tumbler
        return (
          <svg width="200" height="200" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            {/* Water pouring beaker group */}
            <g transform="translate(-15, -5)">
              <motion.g
                animate={{ rotate: [0, -35, -35, 0], x: [0, 5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.25, 0.75, 1], ease: "easeInOut" }}
                style={{ transformOrigin: "68px 18px" }}
              >
                <path d="M 68,10 L 84,10 L 80,25 L 68,25 Z" fill="rgba(255,255,255,0.8)" stroke="#475569" strokeWidth="1.5" />
                <path d="M 69,15 L 82,15 L 79,24 L 69,24 Z" fill="#3b82f6" opacity="0.8" />
              </motion.g>
            </g>

            {/* Pouring stream */}
            <motion.path
              d="M 51,13 L 51,32"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ 
                scaleY: [0, 1, 1, 0],
                originY: 0
              }}
              transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.2, 0.8, 1] }}
            />

            {/* Cotton Cloth Tumbler Shape with fabric crosshatch lines */}
            <path d="M 32,30 L 68,30 L 58,80 L 42,80 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
            <path d="M 32,30 L 68,30 L 58,80 L 42,80 Z" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="34" y1="40" x2="66" y2="40" stroke="#cbd5e1" strokeWidth="0.5" />
            <line x1="36" y1="50" x2="64" y2="50" stroke="#cbd5e1" strokeWidth="0.5" />
            <line x1="38" y1="60" x2="62" y2="60" stroke="#cbd5e1" strokeWidth="0.5" />
            <line x1="40" y1="70" x2="60" y2="70" stroke="#cbd5e1" strokeWidth="0.5" />
            <line x1="45" y1="30" x2="45" y2="80" stroke="#cbd5e1" strokeWidth="0.5" />
            <line x1="50" y1="30" x2="50" y2="80" stroke="#cbd5e1" strokeWidth="0.5" />
            <line x1="55" y1="30" x2="55" y2="80" stroke="#cbd5e1" strokeWidth="0.5" />

            {/* Attempted fill */}
            <motion.path
              d="M 42,80 L 58,80 L 59,74 L 41,74 Z"
              fill="#3b82f6"
              opacity="0.5"
              animate={{ opacity: [0, 0.6, 0.6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.25, 0.75, 1] }}
            />

            {/* Leaking streams from bottom of cloth cup */}
            <motion.g
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.25, 0.8, 1] }}
            >
              <motion.path 
                d="M 45,80 L 45,95" 
                stroke="#3b82f6" 
                strokeWidth="2" 
                strokeDasharray="3,3"
                animate={{ strokeDashoffset: [0, -10] }} 
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} 
              />
              <motion.path 
                d="M 50,80 L 50,95" 
                stroke="#3b82f6" 
                strokeWidth="2" 
                strokeDasharray="3,3"
                animate={{ strokeDashoffset: [0, -10] }} 
                transition={{ repeat: Infinity, duration: 0.6, ease: "linear", delay: 0.15 }} 
              />
              <motion.path 
                d="M 55,80 L 55,95" 
                stroke="#3b82f6" 
                strokeWidth="2" 
                strokeDasharray="3,3"
                animate={{ strokeDashoffset: [0, -10] }} 
                transition={{ repeat: Infinity, duration: 0.7, ease: "linear", delay: 0.3 }} 
              />
              
              {/* Leaking drops from sides */}
              <motion.circle cx="36" cy="50" r="1.2" fill="#3b82f6" animate={{ x: [-2, -8], y: [0, 15], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} />
              <motion.circle cx="64" cy="50" r="1.2" fill="#3b82f6" animate={{ x: [2, 8], y: [0, 15], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} />
              <motion.circle cx="38" cy="65" r="1.2" fill="#3b82f6" animate={{ x: [-1, -6], y: [0, 15], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.4 }} />
              <motion.circle cx="62" cy="65" r="1.2" fill="#3b82f6" animate={{ x: [1, 6], y: [0, 15], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.1 }} />
            </motion.g>

            {/* Puddle */}
            <motion.ellipse 
              cx="50" 
              cy="95" 
              rx="22" 
              ry="3" 
              fill="#3b82f6" 
              opacity="0.8" 
              animate={{ scale: [0, 1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.25, 0.8, 1] }}
            />
            
            <text x="50" y="91" fontSize="4.5" textAnchor="middle" fill="#dc2626" fontWeight="bold">COTTON CLOTH (LEAKS) ❌</text>
          </svg>
        );
      case 'collapse': // Paper Tumbler
        return (
          <svg width="200" height="200" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            {/* Water pouring beaker group */}
            <g transform="translate(-15, -5)">
              <motion.g
                animate={{ rotate: [0, -35, -35, 0], x: [0, 5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.25, 0.75, 1], ease: "easeInOut" }}
                style={{ transformOrigin: "68px 18px" }}
              >
                <path d="M 68,10 L 84,10 L 80,25 L 68,25 Z" fill="rgba(255,255,255,0.8)" stroke="#475569" strokeWidth="1.5" />
                <path d="M 69,15 L 82,15 L 79,24 L 69,24 Z" fill="#3b82f6" opacity="0.8" />
              </motion.g>
            </g>

            {/* Pouring stream */}
            <motion.path
              d="M 51,13 L 51,32"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ 
                scaleY: [0, 1, 1, 0],
                originY: 0,
                opacity: [1, 1, 0, 0]
              }}
              transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.2, 0.6, 1] }}
            />

            {/* Collapsed/Crinkled Paper Cup */}
            <motion.path 
              d="M 32,30 L 68,30 L 58,80 L 42,80 Z" 
              stroke="#b45309" 
              strokeWidth="2"
              animate={{ 
                d: [
                  "M 32,30 L 68,30 L 58,80 L 42,80 Z",
                  "M 32,30 L 68,30 L 58,80 L 42,80 Z",
                  "M 34,48 Q 50,58 66,48 L 56,80 Q 50,72 44,80 Z"
                ],
                fill: [
                  "#fdfbf7",
                  "#e5dcd3",
                  "#a78b71"
                ]
              }}
              transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.35, 0.75] }}
            />

            {/* Water inside paper cup before collapsing */}
            <motion.path
              d="M 42,80 L 58,80 L 60,65 L 40,65 Z"
              fill="#3b82f6"
              opacity="0.85"
              animate={{
                d: [
                  "M 42,80 L 58,80 L 58,80 L 42,80 Z",
                  "M 42,80 L 58,80 L 60,65 L 40,65 Z",
                  "M 44,80 Q 50,72 56,80 L 66,48 Q 50,58 34,48 Z"
                ],
                opacity: [0, 0.85, 0.85, 0]
              }}
              transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.35, 0.7, 1] }}
            />

            {/* Spilling/Splash */}
            <motion.g
              animate={{ opacity: [0, 0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.45, 0.65, 1] }}
            >
              <ellipse cx="50" cy="85" rx="20" ry="3" fill="#3b82f6" />
              <motion.circle cx="34" cy="48" r="1.5" fill="#3b82f6" animate={{ x: [-10, -25], y: [-5, 15] }} transition={{ repeat: Infinity, duration: 3.5 }} />
              <motion.circle cx="66" cy="48" r="1.5" fill="#3b82f6" animate={{ x: [10, 25], y: [-5, 15] }} transition={{ repeat: Infinity, duration: 3.5 }} />
            </motion.g>
            
            <text x="50" y="93" fontSize="4.5" textAnchor="middle" fill="#b45309" fontWeight="bold">PAPER (ABSORBS & SOGGIES) ❌</text>
          </svg>
        );
      case 'fill': // Glass Tumbler
        return (
          <svg width="200" height="200" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            {/* Water pouring beaker group */}
            <g transform="translate(-15, -5)">
              <motion.g
                animate={{ rotate: [0, -35, -35, 0], x: [0, 5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.25, 0.75, 1], ease: "easeInOut" }}
                style={{ transformOrigin: "68px 18px" }}
              >
                <path d="M 68,10 L 84,10 L 80,25 L 68,25 Z" fill="rgba(255,255,255,0.8)" stroke="#475569" strokeWidth="1.5" />
                <path d="M 69,15 L 82,15 L 79,24 L 69,24 Z" fill="#3b82f6" opacity="0.8" />
              </motion.g>
            </g>

            {/* Pouring stream */}
            <motion.path
              d="M 51,13 L 51,80"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ 
                scaleY: [0, 1, 1, 0],
                originY: 0,
                opacity: [1, 1, 1, 0]
              }}
              transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.15, 0.7, 1] }}
            />

            {/* Glass Tumbler Shape */}
            <path d="M 32,30 L 68,30 L 58,80 L 42,80 Z" fill="rgba(186, 230, 253, 0.2)" stroke="#0ea5e9" strokeWidth="2.5" />
            <path d="M 36,35 L 42,75" stroke="white" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />

            {/* Water rising animation */}
            <motion.path 
              d="M 42,80 L 58,80 L 58,80 L 42,80 Z" 
              fill="#3b82f6" 
              opacity="0.85"
              animate={{ 
                d: [
                  "M 42,80 L 58,80 L 58,80 L 42,80 Z",
                  "M 42,80 L 58,80 L 61,60 L 39,60 Z",
                  "M 42,80 L 58,80 L 66,35 L 34,35 Z",
                  "M 42,80 L 58,80 L 66,35 L 34,35 Z"
                ],
                opacity: [0, 0.85, 0.85, 0]
              }}
              transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.15, 0.75, 1] }}
            />
            
            <text x="50" y="93" fontSize="4.5" textAnchor="middle" fill="#0284c7" fontWeight="bold">GLASS (HELD PERFECTLY) ✓</text>
          </svg>
        );
      case 'burn': // Wood Cooking Pot
        return (
          <svg width="200" height="200" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            {/* Stove body & burner base */}
            <rect x="10" y="88" width="80" height="4" fill="#1e293b" rx="1" />
            <rect x="35" y="80" width="30" height="8" fill="#475569" rx="2" />
            <ellipse cx="50" cy="80" rx="12" ry="2.5" fill="#0f172a" />
            {/* Stove grates */}
            <path d="M 28,74 L 38,84 M 72,74 L 62,84" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

            {/* Flickering Gas stove blue fire */}
            <motion.g
              animate={{ opacity: [0.8, 1, 0.9, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 0.2 }}
            >
              <path d="M 38,80 Q 42,60 45,80 Q 47,58 50,80 Q 53,58 55,80 Q 58,60 62,80 Z" fill="#2563eb" opacity="0.6" />
              <path d="M 40,80 Q 42,65 44,80 Q 47,62 50,80 Q 53,62 56,80 Q 58,65 60,80 Z" fill="#67e8f9" opacity="0.9" />
            </motion.g>

            {/* Pine Wood Pot burning / disintegrating */}
            <g>
              <motion.path
                d="M 28,44 L 72,44 L 72,74 L 28,74 Z"
                strokeWidth="2"
                animate={{
                  d: [
                    "M 28,44 L 72,44 L 72,74 L 28,74 Z", // solid wood
                    "M 28,48 Q 50,45 72,48 L 70,74 L 30,74 Z", // charring & warping
                    "M 34,66 Q 50,56 66,66 L 60,78 Q 50,75 40,78 Z" // crumbled ashes
                  ],
                  fill: ["#b48a53", "#372615", "#1e293b"],
                  stroke: ["#78350f", "#271203", "#0f172a"]
                }}
                transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.4, 0.85] }}
              />
              {/* Wood texture grains that fade out as pot disintegrates */}
              <motion.path
                d="M 32,52 Q 50,55 68,52"
                stroke="#8c6239"
                strokeWidth="1"
                fill="none"
                animate={{ opacity: [0.6, 0.2, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.4, 0.85] }}
              />
              <motion.path
                d="M 30,62 Q 45,60 70,64"
                stroke="#8c6239"
                strokeWidth="1"
                fill="none"
                animate={{ opacity: [0.6, 0.2, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.4, 0.85] }}
              />
              <motion.path
                d="M 34,70 Q 50,68 66,72"
                stroke="#8c6239"
                strokeWidth="1"
                fill="none"
                animate={{ opacity: [0.6, 0.2, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.4, 0.85] }}
              />
              {/* Wood pot handle that catches fire, tilts, and drops */}
              <motion.path
                d="M 28,55 L 14,55"
                stroke="#78350f"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{
                  y: [0, 0, 15, 20],
                  rotate: [0, 0, -45, -90],
                  opacity: [1, 1, 0.8, 0]
                }}
                transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.4, 0.6, 0.8] }}
                style={{ transformOrigin: "28px 55px" }}
              />
            </g>

            <defs>
              <radialGradient id="woodFireGrad" cx="50%" cy="80%" r="50%" fx="50%" fy="80%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="35%" stopColor="#f97316" />
                <stop offset="70%" stopColor="#ef4444" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#b91c1c" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Fire engulfing the wood pot (scaled/shifted in sync with disintegration) */}
            <motion.g
              animate={{
                scaleY: [0.3, 1.2, 1.2, 0.2],
                scaleX: [0.5, 1.1, 1.1, 0.4],
                y: [18, 0, 0, 22]
              }}
              transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.35, 0.75, 1], ease: "easeInOut" }}
              style={{ transformOrigin: "50px 74px" }}
            >
              {/* Flickering outer flame */}
              <motion.path
                d="M 24,74 C 28,60 35,40 40,48 C 45,25 48,15 52,25 C 56,15 59,25 64,48 C 69,40 72,60 76,74 Z"
                fill="url(#woodFireGrad)"
                animate={{
                  d: [
                    "M 24,74 C 28,60 35,40 40,48 C 45,25 48,15 52,25 C 56,15 59,25 64,48 C 69,40 72,60 76,74 Z",
                    "M 24,74 C 29,58 33,43 38,50 C 43,28 47,18 51,28 C 55,18 58,28 63,50 C 68,43 71,58 76,74 Z",
                    "M 24,74 C 27,62 36,38 42,46 C 47,22 49,12 53,22 C 57,12 60,22 65,46 C 70,38 73,62 76,74 Z"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}
              />
              
              {/* Flickering inner flame */}
              <motion.path
                d="M 28,74 C 32,62 38,48 42,55 C 46,35 48,25 52,35 C 56,25 58,35 62,55 C 66,48 68,62 72,74 Z"
                fill="url(#woodFireGrad)"
                opacity="0.9"
                animate={{
                  d: [
                    "M 28,74 C 32,62 38,48 42,55 C 46,35 48,25 52,35 C 56,25 58,35 62,55 C 66,48 68,62 72,74 Z",
                    "M 28,74 C 31,64 36,50 40,57 C 44,37 47,27 51,37 C 55,27 57,37 61,57 C 65,50 69,64 72,74 Z"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 0.3, delay: 0.08, ease: "linear" }}
              />
            </motion.g>

            {/* Billowing Smoke */}
            <g>
              <motion.circle cx="40" cy="35" r="5" fill="#475569" opacity="0.6" animate={{ y: [-10, -42], x: [-5, -15], scale: [1, 2.2], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }} />
              <motion.circle cx="60" cy="35" r="6" fill="#475569" opacity="0.5" animate={{ y: [-15, -47], x: [5, 15], scale: [1, 2.5], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut", delay: 0.5 }} />
              <motion.circle cx="50" cy="30" r="4" fill="#1e293b" opacity="0.6" animate={{ y: [-5, -37], x: [0, 5], scale: [1, 2.0], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut", delay: 1.0 }} />
            </g>

            {/* Rising Sparks/Embers */}
            <g>
              <motion.circle cx="35" cy="65" r="1.5" fill="#f59e0b" animate={{ y: [-15, -45], x: [-5, -15], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }} />
              <motion.circle cx="65" cy="65" r="1.5" fill="#ea580c" animate={{ y: [-10, -50], x: [5, 12], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3, ease: "easeOut" }} />
              <motion.circle cx="50" cy="60" r="1" fill="#f59e0b" animate={{ y: [-20, -55], x: [0, -8], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.0, delay: 0.6, ease: "easeOut" }} />
            </g>
          </svg>
        );
      case 'melt': // Plastic Pot
        return (
          <svg width="200" height="200" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            {/* Stove body & burner base */}
            <rect x="10" y="88" width="80" height="4" fill="#1e293b" rx="1" />
            <rect x="35" y="80" width="30" height="8" fill="#475569" rx="2" />
            <ellipse cx="50" cy="80" rx="12" ry="2.5" fill="#0f172a" />
            {/* Stove grates */}
            <path d="M 28,74 L 38,84 M 72,74 L 62,84" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

            {/* Flickering Gas stove blue fire (multiple sharp jet flames) */}
            <motion.g
              animate={{ opacity: [0.85, 1, 0.9, 1, 0.85] }}
              transition={{ repeat: Infinity, duration: 0.15 }}
            >
              {/* Outer blue glow */}
              <path d="M 34,80 Q 42,55 45,80 Q 47,52 50,80 Q 53,52 55,80 Q 58,55 66,80 Z" fill="#3b82f6" opacity="0.4" />
              {/* Inner hot cyan jets */}
              <path d="M 37,80 Q 40,62 43,80 Q 45,58 48,80 Q 50,56 52,80 Q 55,58 57,80 Q 60,62 63,80 Z" fill="#67e8f9" opacity="0.9" />
              <path d="M 39,80 Q 42,66 45,80 Q 48,63 50,80 Q 52,63 55,80 Q 58,66 61,80 Z" fill="#ffffff" opacity="0.9" />
            </motion.g>

            {/* Plastic Pot melting */}
            <motion.path
              d="M 28,44 L 72,44 L 66,74 L 34,74 Z"
              stroke="#be123c"
              strokeWidth="2.5"
              animate={{
                d: [
                  "M 28,44 L 72,44 L 66,74 L 34,74 Z",
                  "M 28,44 L 72,44 Q 68,60 64,74 Q 50,77 36,74 Z",
                  "M 29,48 Q 50,42 71,48 Q 63,65 58,76 Q 50,86 42,76 Z"
                ],
                fill: ["#ec4899", "#d946ef", "#a21caf"]
              }}
              transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.4, 0.85] }}
            />
            {/* Plastic highlight line */}
            <path d="M 32,48 L 36,70" stroke="white" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
            {/* Plastic pot side handle */}
            <path d="M 28,52 L 18,52" stroke="#be123c" strokeWidth="3" strokeLinecap="round" />

            {/* Dripping melted plastic drops */}
            <motion.g
              animate={{ opacity: [0, 0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.4, 0.5, 0.95] }}
            >
              <motion.circle cx="50" cy="75" r="2.5" fill="#a21caf" animate={{ y: [0, 10] }} transition={{ repeat: Infinity, duration: 0.8 }} />
              <motion.circle cx="45" cy="75" r="2" fill="#a21caf" animate={{ y: [0, 8] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.3 }} />
              <motion.circle cx="55" cy="75" r="2" fill="#a21caf" animate={{ y: [0, 9] }} transition={{ repeat: Infinity, duration: 0.9, delay: 0.15 }} />
            </motion.g>
          </svg>
        );
      case 'cook': // Steel Cooking Pot
        return (
          <svg width="200" height="200" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="15%" stopColor="#94a3b8" />
                <stop offset="30%" stopColor="#e2e8f0" />
                <stop offset="45%" stopColor="#cbd5e1" />
                <stop offset="55%" stopColor="#94a3b8" />
                <stop offset="70%" stopColor="#f1f5f9" />
                <stop offset="85%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>

            {/* Stove body & burner base */}
            <rect x="10" y="88" width="80" height="4" fill="#1e293b" rx="1" />
            <rect x="35" y="80" width="30" height="8" fill="#475569" rx="2" />
            <ellipse cx="50" cy="80" rx="12" ry="2.5" fill="#0f172a" />
            {/* Stove grates */}
            <path d="M 28,74 L 38,84 M 72,74 L 62,84" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

            {/* Flickering Gas stove blue fire (multiple sharp jet flames) */}
            <motion.g
              animate={{ opacity: [0.85, 1, 0.9, 1, 0.85] }}
              transition={{ repeat: Infinity, duration: 0.15 }}
            >
              {/* Outer blue glow */}
              <path d="M 34,80 Q 42,55 45,80 Q 47,52 50,80 Q 53,52 55,80 Q 58,55 66,80 Z" fill="#3b82f6" opacity="0.4" />
              {/* Inner hot cyan jets */}
              <path d="M 37,80 Q 40,62 43,80 Q 45,58 48,80 Q 50,56 52,80 Q 55,58 57,80 Q 60,62 63,80 Z" fill="#67e8f9" opacity="0.9" />
              <path d="M 39,80 Q 42,66 45,80 Q 48,63 50,80 Q 52,63 55,80 Q 58,66 61,80 Z" fill="#ffffff" opacity="0.9" />
            </motion.g>

            {/* Steel Pot (cylinder gradient & loop handles) */}
            <g>
              {/* Left loop side handle */}
              <path d="M 28,52 C 23,52 23,62 28,62" stroke="#475569" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Right loop side handle */}
              <path d="M 72,52 C 77,52 77,62 72,62" stroke="#475569" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              
              <rect x="28" y="44" width="44" height="30" rx="3" fill="url(#metalGrad)" stroke="#475569" strokeWidth="2" />
            </g>

            {/* Rattling Lid with curved metal handle */}
            <motion.g
              animate={{ y: [0, -1, 0, -1.5, 0] }}
              transition={{ repeat: Infinity, duration: 0.15 }}
            >
              <ellipse cx="50" cy="44" rx="23" ry="2.5" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
              <path d="M 44,41 C 44,37 56,37 56,41" stroke="#475569" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </motion.g>

            {/* Steam bubbles (rising up inside/around) */}
            <motion.circle cx="42" cy="50" r="1" fill="#bae6fd" animate={{ y: [0, -6], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} />
            <motion.circle cx="58" cy="52" r="1.5" fill="#bae6fd" animate={{ y: [0, -8], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
            <motion.circle cx="50" cy="48" r="1" fill="#bae6fd" animate={{ y: [0, -5], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.4 }} />

            {/* Steam puffs from under the rattling lid */}
            <g>
              <motion.circle cx="34" cy="40" r="2" fill="#f1f5f9" opacity="0.6" animate={{ y: [-5, -25], x: [-5, -15], scale: [1, 2], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} />
              <motion.circle cx="66" cy="40" r="2" fill="#f1f5f9" opacity="0.6" animate={{ y: [-5, -25], x: [5, 15], scale: [1, 2], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} />
            </g>
          </svg>
        );
      case 'heavy': // Heavy Iron Suit Raincoat
        return (
          <svg width="200" height="200" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="armorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="25%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="75%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>

            {/* Stormy Rain Background */}
            <g>
              <motion.line x1="20" y1="5" x2="17" y2="25" stroke="#60a5fa" strokeWidth="1" animate={{ y: [-15, 85] }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
              <motion.line x1="45" y1="2" x2="42" y2="22" stroke="#60a5fa" strokeWidth="1" animate={{ y: [-15, 85] }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear", delay: 0.25 }} />
              <motion.line x1="75" y1="8" x2="72" y2="28" stroke="#60a5fa" strokeWidth="1" animate={{ y: [-15, 85] }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear", delay: 0.1 }} />
              <motion.line x1="10" y1="12" x2="7" y2="32" stroke="#60a5fa" strokeWidth="1" animate={{ y: [-15, 85] }} transition={{ repeat: Infinity, duration: 0.75, ease: "linear", delay: 0.4 }} />
              <motion.line x1="85" y1="15" x2="82" y2="35" stroke="#60a5fa" strokeWidth="1" animate={{ y: [-15, 85] }} transition={{ repeat: Infinity, duration: 0.82, ease: "linear", delay: 0.35 }} />
            </g>

            {/* Heavy Anvil weight showing it is heavy */}
            <motion.g
              animate={{ y: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <path d="M 36,4 L 64,4 L 60,14 L 40,14 Z" fill="#334155" />
              <rect x="30" y="14" width="40" height="10" fill="#334155" rx="1" />
              <text x="50" y="21" fontSize="6.5" textAnchor="middle" fill="#f8fafc" fontWeight="bold">50 kg</text>
            </motion.g>

            {/* Rigid struggling child in metallic plate raincoat */}
            <motion.g
              animate={{ x: [-0.4, 0.4, -0.4, 0.4] }}
              transition={{ repeat: Infinity, duration: 0.15 }}
            >
              {/* Hood made of iron plates */}
              <path d="M 36,32 C 32,20 40,10 50,10 C 60,10 68,20 64,32 Z" fill="url(#armorGrad)" stroke="#334155" strokeWidth="1.5" />
              {/* Inner dark helmet visor/face slit area */}
              <path d="M 44,32 C 42,24 45,18 50,18 C 55,18 58,24 56,32 Z" fill="#0f172a" />
              <rect x="46" y="24" width="8" height="2" fill="#f1f5f9" opacity="0.8" />

              {/* Left Sleeve (stiff plate) */}
              <path d="M 36,32 L 20,54 L 26,58 L 38,44 Z" fill="url(#armorGrad)" stroke="#334155" strokeWidth="1.5" />
              {/* Right Sleeve (stiff plate) */}
              <path d="M 64,32 L 80,54 L 74,58 L 62,44 Z" fill="url(#armorGrad)" stroke="#334155" strokeWidth="1.5" />

              {/* Body (stiff flared armor plate) */}
              <path d="M 36,32 L 64,32 L 72,76 L 28,76 Z" fill="url(#armorGrad)" stroke="#334155" strokeWidth="1.5" />

              {/* Panel rivets on plates */}
              <circle cx="30" cy="73" r="0.8" fill="white" opacity="0.8" />
              <circle cx="70" cy="73" r="0.8" fill="white" opacity="0.8" />
              <circle cx="37" cy="35" r="0.8" fill="white" opacity="0.8" />
              <circle cx="63" cy="35" r="0.8" fill="white" opacity="0.8" />

              {/* Heavy metal placket column & rivet buttons */}
              <rect x="48" y="34" width="4" height="42" fill="#334155" stroke="#1e293b" strokeWidth="0.8" />
              <circle cx="50" cy="41" r="1.2" fill="#94a3b8" stroke="#1e293b" strokeWidth="0.5" />
              <circle cx="50" cy="49" r="1.2" fill="#94a3b8" stroke="#1e293b" strokeWidth="0.5" />
              <circle cx="50" cy="57" r="1.2" fill="#94a3b8" stroke="#1e293b" strokeWidth="0.5" />
              <circle cx="50" cy="65" r="1.2" fill="#94a3b8" stroke="#1e293b" strokeWidth="0.5" />

              {/* Heavy iron pockets */}
              <rect x="32" y="55" width="9" height="7" fill="url(#armorGrad)" stroke="#334155" strokeWidth="1" />
              <circle cx="36.5" cy="58.5" r="0.5" fill="white" />
              <rect x="59" y="55" width="9" height="7" fill="url(#armorGrad)" stroke="#334155" strokeWidth="1" />
              <circle cx="63.5" cy="58.5" r="0.5" fill="white" />
            </motion.g>

            {/* Sweat drops flying off */}
            <motion.g
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <path d="M 39,26 Q 35,24 32,28" stroke="#0ea5e9" strokeWidth="1" fill="none" />
              <path d="M 61,26 Q 65,24 68,28" stroke="#0ea5e9" strokeWidth="1" fill="none" />
            </motion.g>

            <text x="50" y="93" fontSize="5" textAnchor="middle" fill="#dc2626" fontWeight="bold">HEAVY & RIGID ❌</text>
          </svg>
        );
      case 'soak': // Canvas Raincoat
        return (
          <svg width="200" height="200" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            {/* Stormy Rain Background */}
            <g>
              <motion.line x1="20" y1="5" x2="17" y2="25" stroke="#60a5fa" strokeWidth="1" animate={{ y: [-15, 85] }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
              <motion.line x1="45" y1="2" x2="42" y2="22" stroke="#60a5fa" strokeWidth="1" animate={{ y: [-15, 85] }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear", delay: 0.25 }} />
              <motion.line x1="75" y1="8" x2="72" y2="28" stroke="#60a5fa" strokeWidth="1" animate={{ y: [-15, 85] }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear", delay: 0.1 }} />
              <motion.line x1="10" y1="12" x2="7" y2="32" stroke="#60a5fa" strokeWidth="1" animate={{ y: [-15, 85] }} transition={{ repeat: Infinity, duration: 0.75, ease: "linear", delay: 0.4 }} />
              <motion.line x1="85" y1="15" x2="82" y2="35" stroke="#60a5fa" strokeWidth="1" animate={{ y: [-15, 85] }} transition={{ repeat: Infinity, duration: 0.82, ease: "linear", delay: 0.35 }} />
            </g>

            {/* Shivering sad child inside canvas coat */}
            <motion.g
              animate={{ x: [-0.6, 0.6, -0.6, 0.6] }}
              transition={{ repeat: Infinity, duration: 0.15 }}
            >
              {/* Head inside hood */}
              <circle cx="50" cy="25" r="5" fill="#fbcfe8" />
              <path d="M 48,26 Q 50,28 52,26" stroke="#e11d48" strokeWidth="0.8" fill="none" />

              {/* Dynamic color absorption for Canvas */}
              <motion.g
                animate={{
                  fill: ["#e4d3c5", "#bfa491", "#7c5a43"],
                  stroke: ["#c5a892", "#9a7d68", "#5c3d27"]
                }}
                transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.4, 0.85] }}
              >
                {/* Hood */}
                <path d="M 36,32 C 32,20 40,10 50,10 C 60,10 68,20 64,32 Z" />
                
                {/* Left Sleeve */}
                <path d="M 36,32 L 20,54 L 26,58 L 38,44 Z" />
                {/* Right Sleeve */}
                <path d="M 64,32 L 80,54 L 74,58 L 62,44 Z" />

                {/* Body */}
                <path d="M 36,32 L 64,32 L 72,76 L 28,76 Z" />
              </motion.g>

              {/* Inner Hood lining */}
              <path d="M 44,32 C 42,24 45,18 50,18 C 55,18 58,24 56,32 Z" fill="#7c5a43" opacity="0.6" />

              {/* Collar lapels */}
              <path d="M 36,32 L 50,42 L 64,32 L 50,34 Z" fill="none" stroke="#7c5a43" strokeWidth="1" />

              {/* Texture weave lines */}
              <path d="M 38,36 H 62 M 34,44 H 66 M 30,52 H 70 M 28,60 H 72 M 28,68 H 72" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
              <path d="M 40,32 V 76 M 50,32 V 76 M 60,32 V 76" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />

              {/* Placket column & buttons */}
              <rect x="48" y="34" width="4" height="42" fill="none" stroke="#5c3d27" strokeWidth="0.8" />
              <circle cx="50" cy="41" r="1.2" fill="#7c5a43" />
              <circle cx="50" cy="49" r="1.2" fill="#7c5a43" />
              <circle cx="50" cy="57" r="1.2" fill="#7c5a43" />
              <circle cx="50" cy="65" r="1.2" fill="#7c5a43" />

              {/* Pockets */}
              <rect x="32" y="55" width="9" height="7" fill="none" stroke="#5c3d27" strokeWidth="1" />
              <path d="M 31,55 H 42 L 41,57 H 32 Z" fill="#7c5a43" />
              <rect x="59" y="55" width="9" height="7" fill="none" stroke="#5c3d27" strokeWidth="1" />
              <path d="M 58,55 H 69 L 68,57 H 59 Z" fill="#7c5a43" />
            </motion.g>

            {/* Dripping soaked water inside coat */}
            <motion.g
              animate={{ opacity: [0, 0, 1] }}
              transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.3, 0.8] }}
            >
              <motion.circle cx="45" cy="76" r="1.5" fill="#3b82f6" animate={{ y: [0, 14] }} transition={{ repeat: Infinity, duration: 0.9 }} />
              <motion.circle cx="55" cy="76" r="1.5" fill="#3b82f6" animate={{ y: [0, 13] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.3 }} />
              <motion.circle cx="50" cy="50" r="1.2" fill="#3b82f6" animate={{ y: [0, 24] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }} />
            </motion.g>

            {/* Shivering cold air brackets */}
            <path d="M 20,20 Q 17,22 20,24 M 80,20 Q 83,22 80,24" stroke="#cbd5e1" strokeWidth="0.8" fill="none" />

            <text x="50" y="93" fontSize="5" textAnchor="middle" fill="#b45309" fontWeight="bold">ABSORBS & GETS SOAKED ❌</text>
          </svg>
        );
      case 'dry': // Plastic Raincoat
        return (
          <svg width="200" height="200" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            {/* Stormy Rain Background */}
            <g>
              <motion.line x1="20" y1="5" x2="17" y2="25" stroke="#60a5fa" strokeWidth="1" animate={{ y: [-15, 85] }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
              <motion.line x1="45" y1="2" x2="42" y2="22" stroke="#60a5fa" strokeWidth="1" animate={{ y: [-15, 85] }} transition={{ repeat: Infinity, duration: 0.7, ease: "linear", delay: 0.25 }} />
              <motion.line x1="75" y1="8" x2="72" y2="28" stroke="#60a5fa" strokeWidth="1" animate={{ y: [-15, 85] }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear", delay: 0.1 }} />
              <motion.line x1="10" y1="12" x2="7" y2="32" stroke="#60a5fa" strokeWidth="1" animate={{ y: [-15, 85] }} transition={{ repeat: Infinity, duration: 0.75, ease: "linear", delay: 0.4 }} />
              <motion.line x1="85" y1="15" x2="82" y2="35" stroke="#60a5fa" strokeWidth="1" animate={{ y: [-15, 85] }} transition={{ repeat: Infinity, duration: 0.82, ease: "linear", delay: 0.35 }} />
            </g>

            {/* Happy bouncing dry child inside yellow raincoat */}
            <motion.g
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            >
              {/* Head inside hood */}
              <circle cx="50" cy="25" r="5" fill="#fbcfe8" />
              <path d="M 48,25 Q 50,27 52,25" stroke="#e11d48" strokeWidth="1" fill="none" />

              {/* Raincoat Hood */}
              <path d="M 36,32 C 32,20 40,10 50,10 C 60,10 68,20 64,32 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
              {/* Hood interior shading */}
              <path d="M 44,32 C 42,24 45,18 50,18 C 55,18 58,24 56,32 Z" fill="#78350f" opacity="0.65" />

              {/* Left Sleeve */}
              <path d="M 36,32 L 20,54 L 26,58 L 38,44 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
              {/* Left sleeve cuff white line */}
              <path d="M 20.5,54 L 25.5,57.5" stroke="white" strokeWidth="1" opacity="0.7" />

              {/* Happily waving Right Sleeve */}
              <motion.g
                animate={{ rotate: [0, 20, -10, 20, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ transformOrigin: "64px 32px", transformBox: "view-box" }}
              >
                <path d="M 64,32 L 80,54 L 74,58 L 62,44 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
                {/* Right sleeve cuff white line */}
                <path d="M 79.5,54 L 74.5,57.5" stroke="white" strokeWidth="1" opacity="0.7" />
              </motion.g>

              {/* Body */}
              <path d="M 36,32 L 64,32 L 72,76 L 28,76 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />

              {/* Collar lapels */}
              <path d="M 36,32 L 50,42 L 64,32 L 50,34 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />

              {/* Glossy highlight shine lines */}
              <path d="M 39,35 L 43,55" stroke="white" strokeWidth="1.2" opacity="0.45" strokeLinecap="round" />
              <path d="M 61,35 L 57,55" stroke="white" strokeWidth="1.2" opacity="0.45" strokeLinecap="round" />
              {/* Bottom hem white trim */}
              <path d="M 29,74 L 71,74" stroke="white" strokeWidth="1" opacity="0.7" />

              {/* Placket column & buttons */}
              <rect x="48" y="34" width="4" height="42" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8" />
              <circle cx="50" cy="41" r="1.2" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />
              <circle cx="50" cy="49" r="1.2" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />
              <circle cx="50" cy="57" r="1.2" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />
              <circle cx="50" cy="65" r="1.2" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />

              {/* Pockets with flaps */}
              <rect x="32" y="55" width="9" height="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
              <path d="M 31,55 H 42 L 41,57 H 32 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8" />
              <rect x="59" y="55" width="9" height="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
              <path d="M 58,55 H 69 L 68,57 H 59 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8" />
            </motion.g>

            {/* Raindrops splashing off coat */}
            <motion.g
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <path d="M 33,38 Q 28,34 30,30" stroke="#3b82f6" strokeWidth="1.2" fill="none" animate={{ x: [-2, -8], y: [-2, -8] }} transition={{ repeat: Infinity, duration: 0.5 }} />
              <path d="M 67,38 Q 72,34 70,30" stroke="#3b82f6" strokeWidth="1.2" fill="none" animate={{ x: [2, 8], y: [-2, -8] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.25 }} />
            </motion.g>

            <text x="50" y="93" fontSize="5" textAnchor="middle" fill="#16a34a" fontWeight="bold">DRY & FLEXIBLE ✓</text>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
      {/* Design Workbench */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <AnimatePresence mode="wait">
          {!isGameFinished ? (
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-panel"
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              <div>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', fontWeight: 'bold' }}>
                  Product Design Lab
                </span>
                <h3 style={{ margin: '0.15rem 0 0.5rem 0', fontSize: '1.25rem', color: 'var(--text-heading)' }}>
                  {activeChallenge.title}
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong>Objective:</strong> {activeChallenge.objective}
                </p>
              </div>

              {/* Simulation split panel */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
                {/* Options panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                    Available Materials:
                  </span>
                  
                  {activeChallenge.options.map((opt) => {
                    const isTested = selectedOpt?.id === opt.id;
                    const isCorrect = opt.status === 'success';
                    const isCurrentSolved = solved[activeChallenge.id];

                    return (
                      <button
                        key={opt.id}
                        disabled={isCurrentSolved && !isCorrect}
                        onClick={() => handleTestOption(opt)}
                        className={`outline ${isTested ? 'active' : ''}`}
                        style={{
                          justifyContent: 'flex-start',
                          padding: '0.75rem 1rem',
                          textAlign: 'left',
                          fontSize: '0.85rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '0.15rem'
                        }}
                      >
                        <span style={{ fontWeight: 'bold' }}>{opt.name}</span>
                        {isTested && (
                          <span style={{ fontSize: '0.725rem', color: isCorrect ? 'var(--success)' : 'var(--danger)' }}>
                            {isCorrect ? '✓ Test Passed' : '✗ Test Failed'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Simulation Canvas view */}
                <div style={{
                  background: 'var(--canvas-bg)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '200px'
                }}>
                  {renderMockupCanvas()}
                </div>
              </div>

              {/* Next Challenge / Finish Lab Action */}
              {solved[activeChallenge.id] && (
                currentIdx < CHALLENGES.length - 1 ? (
                  <motion.button
                    onClick={handleNextChallenge}
                    className="primary"
                    whileHover={{ scale: 1.02 }}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      marginTop: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    Proceed to Next Challenge <ArrowRight size={14} />
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => {
                      setIsGameFinished(true);
                      confetti({
                        particleCount: 150,
                        spread: 80,
                        origin: { y: 0.6 }
                      });
                    }}
                    className="success"
                    whileHover={{ scale: 1.02 }}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      marginTop: '0.5rem',
                      fontSize: '0.875rem',
                      gap: '0.5rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    Finish Lab & Submit Findings <Trophy size={14} />
                  </motion.button>
                )
              )}
            </motion.div>
          ) : (
            // Final Case Completion screen
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-panel"
              style={{
                padding: '2.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.25rem'
              }}
            >
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--success)',
                border: '3px solid var(--success-border)'
              }}>
                <Award size={36} />
              </div>

              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-heading)' }}>
                  Case Solved: Material Master Detective!
                </h3>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  You have successfully completed all three investigation chapters for Chapter 6.
                </p>
              </div>

              <div style={{
                background: 'var(--surface)',
                borderRadius: '12px',
                padding: '1.25rem',
                width: '100%',
                maxWidth: '450px',
                textAlign: 'left',
                fontSize: '0.825rem',
                border: '1px solid var(--border)'
              }}>
                <h5 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>🕵️‍♂️ What you learned:</h5>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: '1.6' }}>
                  <li>Objects are made from different materials (Wood, Metal, Glass, Plastic).</li>
                  <li>We classify objects into categories based on properties like Hardness and Lustre.</li>
                  <li>Materials are chosen to manufacture objects based on physical attributes (like permeability or heat resistance) that suit their purpose.</li>
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '360px', marginTop: '0.5rem' }}>
                <button
                  onClick={onComplete}
                  className="primary"
                  style={{ flex: 1, fontSize: '0.875rem', gap: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  Take Final Quiz <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar Area with AI Mentor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Progress Tracker */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-heading)' }}>
            Case 3 Design Board
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
            {CHALLENGES.map((ch, idx) => (
              <div key={ch.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontWeight: currentIdx === idx ? 'bold' : 'normal', color: currentIdx === idx ? 'var(--accent-text)' : 'inherit' }}>
                  Challenge {idx + 1}
                </span>
                <span style={{ fontWeight: 'bold', color: solved[ch.id] ? 'var(--success)' : 'var(--text-muted)' }}>
                  {solved[ch.id] ? 'Passed ✓' : 'Untested'}
                </span>
              </div>
            ))}
          </div>

          {/* Reset button */}
          <button 
            onClick={() => {
              setSolved({});
              setCurrentIdx(0);
              setSelectedOpt(null);
              setMentorState('idle');
              setMentorText("Welcome to the Material Studio! 🛠️ Select a material option to run the test simulation.");
              setIsGameFinished(false);
            }}
            className="outline" 
            style={{ 
              width: '100%', 
              marginTop: '1.25rem', 
              fontSize: '0.8rem', 
              padding: '0.4rem',
              borderRadius: '8px',
              gap: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RefreshCw size={12} /> Reset Stage
          </button>
        </div>

        {/* AI Mentor */}
        <AIMentor 
          state={mentorState} 
          text={mentorText} 
        />
      </div>
    </div>
  );
}
