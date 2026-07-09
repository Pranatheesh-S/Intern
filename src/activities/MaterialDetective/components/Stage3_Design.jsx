import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Trophy, Sparkles, Award, ArrowLeft, Home, RefreshCw } from 'lucide-react';
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

      // Trigger confetti on final challenge completion
      if (Object.keys(nextSolved).length === CHALLENGES.length) {
        setIsGameFinished(true);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
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
            {/* Cloth Tumbler Outline */}
            <path d="M 30,20 L 70,20 L 60,80 L 40,80 Z" fill="none" stroke="#d1d5db" strokeWidth="2" strokeDasharray="2,2" />
            <path d="M 32,22 L 68,22 L 58,78 L 42,78 Z" fill="#b91c1c" opacity="0.15" />
            <text x="50" y="55" fontSize="6" textAnchor="middle" fill="#b91c1c" fontWeight="bold">CLOTH CUP</text>
            
            {/* Water Leaking Animation drops */}
            <motion.circle cx="45" cy="40" r="2.5" fill="#3b82f6" animate={{ y: [0, 50], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: 'easeIn' }} />
            <motion.circle cx="55" cy="50" r="2" fill="#3b82f6" animate={{ y: [0, 40], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.9, ease: 'easeIn', delay: 0.2 }} />
            <motion.circle cx="38" cy="60" r="2" fill="#3b82f6" animate={{ y: [0, 30], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.0, ease: 'easeIn', delay: 0.4 }} />
            <motion.circle cx="62" cy="55" r="2.5" fill="#3b82f6" animate={{ y: [0, 35], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.1, ease: 'easeIn', delay: 0.1 }} />
            
            {/* Puddle */}
            <ellipse cx="50" cy="90" rx="20" ry="3" fill="#3b82f6" opacity="0.7" />
          </svg>
        );
      case 'collapse': // Paper Tumbler
        return (
          <svg width="200" height="200" viewBox="0 0 100 100">
            {/* Collapsed/Crinkled Paper Cup */}
            <motion.path 
              d="M 30,20 L 70,20 L 60,80 L 40,80 Z" 
              fill="#f1f5f9" 
              stroke="#cbd5e1" 
              strokeWidth="2"
              animate={{ 
                d: [
                  "M 30,20 L 70,20 L 60,80 L 40,80 Z",
                  "M 32,35 Q 50,45 68,35 L 55,75 Q 50,70 45,75 Z"
                ],
                scaleY: [1, 0.65],
                y: [0, 20]
              }}
              transition={{ duration: 1.5, fillMode: 'forwards', ease: 'easeInOut' }}
            />
            <text x="50" y="65" fontSize="5" textAnchor="middle" fill="#475569" fontWeight="bold">SOGGY PAPER</text>
            
            {/* Splash */}
            <motion.ellipse 
              cx="50" 
              cy="85" 
              rx="15" 
              ry="3" 
              fill="#3b82f6" 
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.8, duration: 0.5 }}
            />
          </svg>
        );
      case 'fill': // Glass Tumbler
        return (
          <svg width="200" height="200" viewBox="0 0 100 100">
            {/* Glass Tumbler outline */}
            <path d="M 30,20 L 70,20 L 60,80 L 40,80 Z" fill="none" stroke="#bae6fd" strokeWidth="3" />
            
            {/* Water rising animation */}
            <motion.path 
              d="M 40,80 L 60,80 L 59,75 L 41,75 Z" 
              fill="#3b82f6" 
              opacity="0.85"
              animate={{ 
                d: [
                  "M 40,80 L 60,80 L 59,78 L 41,78 Z",
                  "M 40,80 L 60,80 L 67,30 L 33,30 Z"
                ]
              }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
            />
            <text x="50" y="55" fontSize="7" textAnchor="middle" fill="#0369a1" fontWeight="bold">GLASS</text>
          </svg>
        );
      case 'burn': // Wood Frying Pot
        return (
          <svg width="200" height="200" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            {/* Wooden Pot */}
            <rect x="25" y="40" width="50" height="30" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="2" />
            <rect x="15" y="50" width="10" height="6" rx="1" fill="#78350f" />
            
            {/* Fire flame animation */}
            <motion.path 
              d="M 30,85 Q 40,65 50,85 Q 60,65 70,85 Z" 
              fill="#f97316"
              animate={{ 
                d: [
                  "M 30,85 Q 40,65 50,85 Q 60,65 70,85 Z",
                  "M 30,85 Q 45,55 50,85 Q 55,55 70,85 Z",
                  "M 30,85 Q 35,60 50,85 Q 65,60 70,85 Z"
                ],
                fill: ["#f97316", "#ef4444", "#f59e0b"]
              }}
              transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
            />

            {/* Smoke */}
            <motion.circle cx="45" cy="30" r="3" fill="#cbd5e1" opacity="0.5" animate={{ y: [-10, -40], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} />
            <motion.circle cx="55" cy="25" r="4" fill="#cbd5e1" opacity="0.4" animate={{ y: [-5, -35], opacity: [0.4, 0] }} transition={{ repeat: Infinity, duration: 1.0, delay: 0.3 }} />
          </svg>
        );
      case 'melt': // Plastic Pot
        return (
          <svg width="200" height="200" viewBox="0 0 100 100">
            {/* Plastic Pot melting */}
            <motion.path
              d="M 25,40 L 75,40 L 70,70 L 30,70 Z"
              fill="#f43f5e"
              stroke="#be123c"
              strokeWidth="2"
              animate={{
                d: [
                  "M 25,40 L 75,40 L 70,70 L 30,70 Z",
                  "M 28,50 Q 50,55 72,50 L 68,75 Q 50,85 32,75 Z"
                ]
              }}
              transition={{ duration: 1.6, fillMode: 'forwards' }}
            />
            
            {/* Small fire under it */}
            <path d="M 35,85 L 65,85 L 50,75 Z" fill="#ef4444" opacity="0.8" />
          </svg>
        );
      case 'cook': // Steel Cooking Pot
        return (
          <svg width="200" height="200" viewBox="0 0 100 100">
            {/* Steel Pot */}
            <rect x="25" y="40" width="50" height="30" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
            <path d="M 10,48 L 25,48" stroke="#475569" strokeWidth="3" />
            
            {/* Water boiling steam bubbles */}
            <motion.circle cx="45" cy="45" r="1.5" fill="#bae6fd" animate={{ y: [0, -10], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} />
            <motion.circle cx="55" cy="46" r="1" fill="#bae6fd" animate={{ y: [0, -8], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
            
            {/* Flame */}
            <path d="M 35,82 Q 50,72 65,82 Q 50,78 35,82 Z" fill="#3b82f6" />
          </svg>
        );
      case 'heavy': // Heavy Iron Suit Raincoat
        return (
          <svg width="200" height="200" viewBox="0 0 100 100">
            {/* Stiff metal suit outline */}
            <rect x="35" y="30" width="30" height="40" rx="2" fill="#64748b" stroke="#475569" strokeWidth="2" />
            <line x1="25" y1="40" x2="35" y2="40" stroke="#475569" strokeWidth="3" />
            <line x1="65" y1="40" x2="75" y2="40" stroke="#475569" strokeWidth="3" />
            
            {/* Stiff/Heavy weight icon */}
            <text x="50" y="55" fontSize="5" textAnchor="middle" fill="#f8fafc" fontWeight="bold">HEAVY & STIFF</text>
            <text x="50" y="85" fontSize="6" textAnchor="middle" fill="#ef4444" fontWeight="bold">CAN'T WALK! ❌</text>
          </svg>
        );
      case 'soak': // Canvas Raincoat
        return (
          <svg width="200" height="200" viewBox="0 0 100 100">
            {/* Canvas fabric getting soggy */}
            <path d="M 35,30 L 65,30 L 75,55 L 60,55 L 58,75 L 42,75 L 40,55 L 25,55 Z" fill="#d97706" opacity="0.6" stroke="#b45309" strokeWidth="2" />
            
            {/* Raindrops falling on it */}
            <line x1="45" y1="10" x2="43" y2="20" stroke="#3b82f6" strokeWidth="1" />
            <line x1="55" y1="12" x2="53" y2="22" stroke="#3b82f6" strokeWidth="1" />
            
            {/* Water dropping through shirt */}
            <motion.circle cx="50" cy="65" r="1.5" fill="#3b82f6" animate={{ y: [0, 20] }} transition={{ repeat: Infinity, duration: 1 }} />
            <text x="50" y="45" fontSize="6" textAnchor="middle" fill="#78350f" fontWeight="bold">SOAKED! 🌧️</text>
          </svg>
        );
      case 'dry': // Plastic Raincoat
        return (
          <svg width="200" height="200" viewBox="0 0 100 100">
            {/* Bright yellow plastic raincoat */}
            <path d="M 35,30 L 65,30 L 75,55 L 60,55 L 58,75 L 42,75 L 40,55 L 25,55 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
            
            {/* Rain drops bouncing off */}
            <motion.circle cx="30" cy="40" r="1" fill="#3b82f6" animate={{ x: [-5, -15], y: [0, 10], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} />
            <motion.circle cx="70" cy="40" r="1" fill="#3b82f6" animate={{ x: [5, 15], y: [0, 10], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} />
            
            <text x="50" y="48" fontSize="6" textAnchor="middle" fill="#854d0e" fontWeight="bold">DRY & FLEXIBLE</text>
            <text x="50" y="85" fontSize="7" textAnchor="middle" fill="#22c55e" fontWeight="bold">SUCCESS! ✓</text>
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

              {/* Next Challenge Action */}
              {solved[activeChallenge.id] && currentIdx < CHALLENGES.length - 1 && (
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
                  className="success"
                  style={{ flex: 1, fontSize: '0.875rem' }}
                >
                  <Trophy size={16} /> Complete Activity
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
