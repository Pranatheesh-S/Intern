import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simplified SVG Village for LOD (Level of Detail) far away
const SimplifiedVillage = ({ x, y, delay }) => (
  <motion.g
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.8, ease: "easeOut" }}
    style={{ transformOrigin: `${x}px ${y}px` }}
  >
    {/* Tiny house */}
    <rect x={x - 2} y={y - 2} width="4" height="4" fill="#cbd5e1" />
    <polygon points={`${x-3},${y-2} ${x},${y-5} ${x+3},${y-2}`} fill="#94a3b8" />
    {/* Tiny tree */}
    <circle cx={x + 4} cy={y - 1} r="2.5" fill="#15803d" />
  </motion.g>
);

// Detailed SVG Village for close up (Sangrahana cluster)
const DetailedVillage = ({ x, y, isHighlighted }) => (
  <motion.g
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1, type: "spring" }}
    style={{ transformOrigin: `${x + 10}px ${y + 10}px` }}
  >
    {/* Highlight glow */}
    <motion.circle 
      cx={x + 10} cy={y + 10} r="24" 
      fill={isHighlighted ? 'rgba(56, 189, 248, 0.2)' : 'transparent'} 
      animate={{ r: isHighlighted ? 28 : 24 }}
      transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
    />
    
    {/* Field */}
    <rect x={x - 5} y={y + 15} width="20" height="10" rx="2" fill="#854d0e" opacity="0.4" />
    <line x1={x - 3} y1={y + 18} x2={x + 13} y2={y + 18} stroke="#a16207" strokeWidth="1" opacity="0.6" />
    <line x1={x - 3} y1={y + 22} x2={x + 13} y2={y + 22} stroke="#a16207" strokeWidth="1" opacity="0.6" />

    {/* House Body */}
    <rect x={x} y={y + 5} width="14" height="10" rx="1" fill="#e2e8f0" />
    {/* Door */}
    <rect x={x + 5} y={y + 9} width="4" height="6" rx="0.5" fill="#64748b" />
    {/* Roof */}
    <polygon points={`${x-2},${y+5} ${x+7},${y-2} ${x+16},${y+5}`} fill="#94a3b8" />
    
    {/* Tree 1 */}
    <line x1={x + 22} y1={y + 15} x2={x + 22} y2={y + 8} stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
    <motion.circle cx={x + 22} cy={y + 5} r="6" fill="#166534" 
      animate={{ x: [0, 1, 0, -1, 0] }} 
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    />
    <motion.circle cx={x + 19} cy={y + 8} r="4" fill="#15803d" 
      animate={{ x: [0, 0.5, 0, -0.5, 0] }} 
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
    />
    <motion.circle cx={x + 25} cy={y + 8} r="4" fill="#16a34a" />
    
    {/* Smoke animation */}
    <motion.circle cx={x + 12} cy={y - 4} r="1.5" fill="#e2e8f0"
      initial={{ opacity: 0.6, y: 0, scale: 1 }}
      animate={{ opacity: 0, y: -10, scale: 2 }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
    />
  </motion.g>
);

export default function AncientVillageScene() {
  const [phase, setPhase] = useState(0); 
  const [count, setCount] = useState(0);

  useEffect(() => {
    let timers = [];
    
    const runSequence = () => {
      setPhase(0); setCount(0);
      timers.push(setTimeout(() => setPhase(1), 1000)); // Start counting to 10
      timers.push(setTimeout(() => setPhase(2), 2500)); // Sangrahana label appears
      timers.push(setTimeout(() => setPhase(3), 5500)); // Zoom out begins
      timers.push(setTimeout(() => setPhase(4), 7000)); // 100 count begins
      timers.push(setTimeout(() => setPhase(5), 9000)); // Karvatika label
      timers.push(setTimeout(() => runSequence(), 14000)); // Loop
    };

    runSequence();
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase === 1) {
       let val = 0;
       const interval = setInterval(() => {
          val += 1;
          setCount(val);
          if (val >= 10) clearInterval(interval);
       }, 100);
       return () => clearInterval(interval);
    } else if (phase === 4) {
       let val = 10;
       const interval = setInterval(() => {
          val += 3;
          setCount(Math.min(100, val));
          if (val >= 100) clearInterval(interval);
       }, 50); 
       return () => clearInterval(interval);
    } else if (phase === 0) {
       setCount(0);
    }
  }, [phase]);

  // Generate static positions for the 10 central villages (Sangrahana)
  const centerVillages = useMemo(() => {
    return [
      { x: 300, y: 300 }, { x: 340, y: 280 }, { x: 260, y: 320 }, 
      { x: 290, y: 350 }, { x: 350, y: 330 }, { x: 310, y: 250 }, 
      { x: 250, y: 270 }, { x: 380, y: 300 }, { x: 270, y: 370 }, { x: 330, y: 370 }
    ];
  }, []);

  // Generate static positions for the 90 outer villages (Karvatika)
  const outerVillages = useMemo(() => {
    const villages = [];
    for (let i = 0; i < 90; i++) {
      // Random position outside the center radius (approx 100px) but within the 650x650 bounds
      let r = 120 + Math.random() * 220; 
      let theta = Math.random() * 2 * Math.PI;
      let x = 325 + r * Math.cos(theta);
      let y = 325 + r * Math.sin(theta);
      // add some clustering effect
      if (i % 5 === 0) {
         r += 20; theta += 0.1;
      }
      villages.push({ x, y, delay: Math.random() * 1.5 });
    }
    return villages;
  }, []);

  // The cinematic zoom is achieved by scaling a container holding the SVG map.
  // Phase 0,1,2 = zoomed in (scale: 2.2, center on 325,325)
  // Phase 3,4,5 = zoomed out (scale: 1, center on 325,325)
  const zoomScale = phase >= 3 ? 1 : 2.2;
  const zoomY = phase >= 3 ? 0 : 50; // slight Y shift when zoomed in

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      maxWidth: '650px', 
      aspectRatio: '1/1', 
      background: 'transparent',
      overflow: 'hidden',
      borderRadius: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      
      <motion.div 
        animate={{ scale: zoomScale, y: zoomY }}
        transition={{ duration: 2.5, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      >
        <svg width="100%" height="100%" viewBox="0 0 650 650" style={{ position: 'absolute', inset: 0 }}>
          
          {/* Subtle River */}
          <motion.path 
            d="M 100 -50 Q 200 150 150 300 T 300 500 T 250 700" 
            fill="none" 
            stroke="rgba(14, 165, 233, 0.2)" 
            strokeWidth="15" 
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, ease: "easeOut" }}
          />

          {/* Connectors for Sangrahana (Phase 2+) */}
          <AnimatePresence>
            {phase >= 2 && (
               <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
                 {centerVillages.map((v, i) => (
                    <line key={i} x1={325} y1={325} x2={v.x+10} y2={v.y+10} stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" strokeDasharray="4 4" />
                 ))}
                 <circle cx="325" cy="325" r="90" fill="rgba(56, 189, 248, 0.05)" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" strokeDasharray="8 4" />
               </motion.g>
            )}
          </AnimatePresence>

          {/* Connectors for Karvatika (Phase 5+) */}
          <AnimatePresence>
            {phase >= 5 && (
               <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
                 <circle cx="325" cy="325" r="280" fill="rgba(168, 85, 247, 0.05)" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="2" strokeDasharray="12 6" />
               </motion.g>
            )}
          </AnimatePresence>

          {/* 10 Central Villages */}
          {centerVillages.map((v, i) => (
             <AnimatePresence key={`center-${i}`}>
               {phase >= 1 && (
                 <DetailedVillage x={v.x} y={v.y} isHighlighted={phase >= 2} />
               )}
             </AnimatePresence>
          ))}

          {/* 90 Outer Villages (Appears in Phase 3) */}
          <AnimatePresence>
            {phase >= 3 && outerVillages.map((v, i) => (
               <SimplifiedVillage key={`outer-${i}`} x={v.x} y={v.y} delay={v.delay} />
            ))}
          </AnimatePresence>
        </svg>
      </motion.div>

      {/* Floating UI Elements */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Sangrahana Label */}
        <AnimatePresence>
          {phase >= 2 && phase < 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                padding: '1rem 2rem',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                marginTop: '180px' // push below the cluster
              }}
            >
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                Group of {count} Villages
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', letterSpacing: '0.05em' }}>
                SANGRAHANA
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Karvatika Label */}
        <AnimatePresence>
          {phase >= 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                padding: '1rem 2rem',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                marginTop: '220px' 
              }}
            >
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                Group of {count} Villages
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', letterSpacing: '0.05em' }}>
                KĀRVATIKA
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Floating Counter Overlay (Subtle) */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'var(--card-bg)',
                backdropFilter: 'blur(8px)',
                padding: '0.5rem 1rem',
                borderRadius: '99px',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: phase >= 5 ? '#a855f7' : '#38bdf8', boxShadow: `0 0 10px ${phase >= 5 ? '#a855f7' : '#38bdf8'}` }} />
               <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontVariantNumeric: 'tabular-nums' }}>
                 Villages: {count}
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
