import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Phase 0: Ancient (0-3s)
// Phase 1: Evolution (3-8s)
// Phase 2: Modern (8-12s)
// Phase 3: Connection (12-15s)

const VillageHut = ({ x, y, opacity }) => (
  <motion.g animate={{ opacity }} transition={{ duration: 1.5 }}>
    <rect x={x-10} y={y} width="20" height="15" fill="#d4d4d8" rx="2" />
    <polygon points={`${x-14},${y} ${x},${y-10} ${x+14},${y}`} fill="#a1a1aa" />
  </motion.g>
);

const ModernOffice = ({ x, y, opacity }) => (
  <motion.g animate={{ opacity }} transition={{ duration: 1.5 }}>
    <rect x={x-15} y={y-5} width="30" height="20" fill="#f8fafc" rx="2" />
    <rect x={x-20} y={y-10} width="40" height="5" fill="#94a3b8" rx="1" />
    <rect x={x-5} y={y+5} width="10" height="10" fill="#64748b" />
    <circle cx={x} cy={y-7} r="2" fill="#38bdf8" />
  </motion.g>
);

export default function AncientRootsAnimation() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let timers = [];
    const runSequence = () => {
      setPhase(0);
      timers.push(setTimeout(() => setPhase(1), 3000));
      timers.push(setTimeout(() => setPhase(2), 5500)); // Reduced gap from 5s to 2.5s
      timers.push(setTimeout(() => setPhase(3), 9500));
      timers.push(setTimeout(() => runSequence(), 13500)); // Adjusted loop buffer
    };
    runSequence();
    return () => timers.forEach(clearTimeout);
  }, []);

  const isAncient = phase === 0;
  const isEvolution = phase === 1;
  const isModern = phase >= 2;
  const isConnection = phase === 3;

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      maxWidth: '650px', 
      aspectRatio: '1/1', 
      background: 'transparent',
      borderRadius: '24px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      
      {/* Background Layers */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <motion.div animate={{ opacity: phase < 2 ? 0.05 : 0 }} style={{ position: 'absolute', inset: 0, background: '#b45309', mixBlendMode: 'overlay' }} />

      {/* SVG Canvas */}
      <svg width="100%" height="100%" viewBox="0 0 650 650" style={{ position: 'absolute', inset: 0 }}>
        
        {/* Timeline (Top) */}
        <motion.line x1="100" y1="50" x2="550" y2="50" stroke="var(--border)" strokeWidth="2" />
        <motion.text x="50" y="55" fill="var(--text-primary)" fontSize="16" fontWeight="bold" opacity={phase >= 0 ? 1 : 0}>300 BCE</motion.text>
        <motion.text x="570" y="55" fill="var(--text-primary)" fontSize="16" fontWeight="bold" opacity={phase >= 2 ? 1 : 0.4}>Today</motion.text>
        
        {/* Glowing Orb moving on timeline */}
        <motion.circle 
          cy="50" r="6" fill="#38bdf8"
          initial={{ cx: 100 }}
          animate={{ cx: phase === 0 ? 100 : 550 }}
          transition={{ duration: phase === 1 ? 2.5 : 0, ease: "linear" }}
        />

        {/* Tree Roots (Ancient) */}
        <motion.path 
          d="M325,450 C325,500 250,550 200,600 M325,450 C325,520 400,560 450,580 M325,450 C325,550 325,600 325,650"
          fill="none" 
          stroke={phase < 2 ? "rgba(180, 83, 9, 0.6)" : "rgba(180, 83, 9, 0.3)"}
          strokeWidth="6" 
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        {/* Energy Pulse through roots */}
        {isConnection && (
          <motion.path 
            d="M325,650 C325,600 325,500 325,450"
            fill="none" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        )}

        {/* Villages & Transformation */}
        {/* Sangrahana Area */}
        <g transform="translate(200, 580)">
           <VillageHut x={0} y={0} opacity={phase < 2 ? 1 : 0} />
           <ModernOffice x={0} y={0} opacity={phase >= 2 ? 1 : 0} />
        </g>
        {/* Karvatika Area */}
        <g transform="translate(450, 560)">
           <VillageHut x={0} y={0} opacity={phase < 2 ? 1 : 0} />
           <ModernOffice x={0} y={0} opacity={phase >= 2 ? 1 : 0} />
        </g>

        {/* Modern Trunk & Branches */}
        <motion.path 
          d="M325,450 L325,350 C325,250 200,200 150,150 M325,350 L325,200 M325,350 C325,250 450,200 500,150"
          fill="none" 
          stroke="rgba(56, 189, 248, 0.5)"
          strokeWidth="8" 
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: phase >= 2 ? 1 : 0, opacity: phase >= 2 ? 1 : 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Energy Pulse through branches */}
        {isConnection && (
          <motion.path 
            d="M325,450 L325,350 C325,250 200,200 150,150 M325,350 L325,200 M325,350 C325,250 450,200 500,150"
            fill="none" stroke="#a855f7" strokeWidth="12" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut", delay: 1 }}
          />
        )}
      </svg>

      {/* Floating Labels (HTML overlay for layoutId morphing) */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        
        {/* Manuscript Icon */}
        <AnimatePresence>
          {phase < 2 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{ position: 'absolute', top: '150px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(180, 83, 9, 0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(180,83,9,0.5)' }}
            >
              📖 Arthaśāstra
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Labels (Sangrahana -> Gram Panchayat) */}
        <AnimatePresence mode="wait">
          {phase < 2 ? (
            <motion.div 
              key="sangrahana"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1 }}
              style={{ position: 'absolute', top: '600px', left: '100px', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(180,83,9,0.5)', color: '#fcd34d' }}
            >
              Sangrahana (10)
            </motion.div>
          ) : (
            <motion.div 
              key="gram-panchayat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1 }}
              style={{ position: 'absolute', top: '600px', left: '100px', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.5)', color: '#38bdf8' }}
            >
              Gram Panchayat
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Labels (Karvatika -> Panchayat Samiti) */}
        <AnimatePresence mode="wait">
          {phase < 2 ? (
            <motion.div 
              key="karvatika"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1 }}
              style={{ position: 'absolute', top: '600px', right: '100px', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(180,83,9,0.5)', color: '#fcd34d' }}
            >
              Karvatika (100)
            </motion.div>
          ) : (
            <motion.div 
              key="panchayat-samiti"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1 }}
              style={{ position: 'absolute', top: '600px', right: '100px', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.5)', color: '#38bdf8' }}
            >
              Panchayat Samiti
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modern Top Labels (Branches) */}
        <AnimatePresence>
          {phase >= 2 && (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }}
                style={{ position: 'absolute', top: '100px', left: '50px', background: 'rgba(15,23,42,0.8)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(168,85,247,0.5)', color: '#a855f7', boxShadow: isConnection ? '0 0 20px rgba(168,85,247,0.5)' : 'none' }}
              >
                Village Level
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.5 }}
                style={{ position: 'absolute', top: '150px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(15,23,42,0.8)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(168,85,247,0.5)', color: '#a855f7', boxShadow: isConnection ? '0 0 20px rgba(168,85,247,0.5)' : 'none' }}
              >
                Block Level
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 2 }}
                style={{ position: 'absolute', top: '100px', right: '50px', background: 'rgba(15,23,42,0.8)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(168,85,247,0.5)', color: '#a855f7', boxShadow: isConnection ? '0 0 20px rgba(168,85,247,0.5)' : 'none' }}
              >
                District Level
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 3 }}
                style={{ position: 'absolute', bottom: '150px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 'bold' }}
              >
                Modern Panchayati Raj<br/>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>Rooted in Ancient Wisdom</span>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
