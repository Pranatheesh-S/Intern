import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ChevronRight, ArrowRight, MousePointer2 } from 'lucide-react';

const TIMELINE_STAGES = [
  { mya: 120, label: '120 MYA', title: 'Island of India', desc: 'India was a large island located far to the south, separated from Asia by the vast Tethys Ocean.' },
  { mya: 80, label: '80 MYA', title: 'Rapid Movement', desc: 'The Indian Plate broke away and began moving north at an unusually fast speed of 15 cm per year.' },
  { mya: 50, label: '50 MYA', title: 'The Great Collision', desc: 'The Indian Plate finally collided with the massive Eurasian Plate. The ocean between them disappeared.' },
  { mya: 0, label: 'Today', title: 'The Himalayas Form', desc: 'The massive pressure of the collision caused the Earth\'s crust to fold and buckle upward, forming the highest mountains on Earth.' },
  { mya: -1, label: 'Future', title: 'Still Growing', desc: 'The Indian Plate is still pushing north! Because of this, the Himalayas grow about 5 millimeters taller every single year.' }
];

export default function GeologicalTimeMachine({ onComplete }) {
  const [stageIndex, setStageIndex] = useState(0);
  
  // Motion value for the Indian plate's Y position (from 300 to 0)
  // 300 = 120 MYA, 0 = Collision (50 MYA and beyond)
  const plateY = useMotionValue(300);
  
  // Transform the plate Y position into the timeline index (just for visual sync)
  const progressIndex = useTransform(plateY, [300, 200, 0, -20, -50], [0, 1, 2, 3, 4]);

  useEffect(() => {
    // When stageIndex changes via buttons, animate the plateY
    let targetY = 300;
    if (stageIndex === 1) targetY = 200;
    if (stageIndex === 2) targetY = 0;
    if (stageIndex === 3) targetY = -20;
    if (stageIndex === 4) targetY = -50;
    
    animate(plateY, targetY, { type: 'spring', stiffness: 50, damping: 15 });
  }, [stageIndex]);

  // Derived values for the animation based on plateY
  // When plateY reaches 0, the collision starts.
  // We use clamping to ensure mountains only grow when plateY <= 0
  const mountainHeight = useTransform(plateY, [0, -20, -50], [0, 80, 100]);
  const rockFoldRadius = useTransform(plateY, [0, -20, -50], [0, 40, 50]);
  const oceanOpacity = useTransform(plateY, [300, 0], [1, 0]);

  const currentInfo = TIMELINE_STAGES[stageIndex];

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', flexWrap: 'wrap' }}>
      
      {/* LEFT SIDE: Animation (45%) */}
      <div style={{ flex: '1 1 45%', minWidth: '300px', position: 'relative', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--border)', overflow: 'hidden' }}>
        
        {/* Background Grid & Stars for time-machine feel */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', display: 'flex', gap: '0.5rem', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
          <MousePointer2 size={16} /> Drag the Indian Plate!
        </div>

        {/* Tectonic Plate SVG Canvas */}
        <svg viewBox="0 0 400 600" style={{ width: '100%', height: '100%', maxWidth: '400px', overflow: 'visible' }}>
          
          {/* Tethys Ocean (Fades out as India moves up) */}
          <motion.rect x="0" y="150" width="400" height="450" fill="#0284c7" style={{ opacity: oceanOpacity }} />

          {/* Eurasian Plate (Fixed at top) */}
          <g transform="translate(0, 0)">
            <rect x="0" y="0" width="400" height="150" fill="#44403c" />
            <text x="200" y="75" fill="#a8a29e" fontSize="24" fontWeight="bold" textAnchor="middle" opacity="0.5">EURASIAN PLATE</text>
            
            {/* The Folding Mountains - these grow out of the boundary when collision happens */}
            <motion.path 
              d="M 50 150 Q 100 150 150 150 T 250 150 T 350 150" 
              fill="none" 
              stroke="#e2e8f0" 
              strokeWidth="2" 
            />
            {/* Mountain SVG Shapes dynamically growing */}
            <motion.path
              style={{ d: useTransform(mountainHeight, h => `M 0 150 L 50 ${150-h*0.5} L 100 ${150-h*0.8} L 150 ${150-h*0.4} L 200 ${150-h} L 250 ${150-h*0.7} L 300 ${150-h*0.9} L 350 ${150-h*0.3} L 400 150 Z`) }}
              fill="#94a3b8"
            />
            <motion.path
              style={{ d: useTransform(mountainHeight, h => `M 50 150 L 100 ${150-h*0.8} L 150 150 Z`) }}
              fill="#cbd5e1"
            />
             <motion.path
              style={{ d: useTransform(mountainHeight, h => `M 150 150 L 200 ${150-h} L 250 150 Z`) }}
              fill="#f8fafc"
            />
             <motion.path
              style={{ d: useTransform(mountainHeight, h => `M 250 150 L 300 ${150-h*0.9} L 350 150 Z`) }}
              fill="#f1f5f9"
            />
          </g>

          {/* Indian Plate (Draggable) */}
          <motion.g 
            style={{ y: plateY }}
            drag="y"
            dragConstraints={{ top: -50, bottom: 300 }}
            dragElastic={0}
            onDrag={(e, info) => {
              // Update stageIndex based on dragged position
              const y = plateY.get();
              if (y > 250) setStageIndex(0);
              else if (y > 100) setStageIndex(1);
              else if (y > -10) setStageIndex(2);
              else if (y > -40) setStageIndex(3);
              else setStageIndex(4);
            }}
          >
            {/* Rock layers that "fold" during collision */}
            <motion.rect 
              x="50" y="150" width="300" height="300" 
              fill="#78716c" 
              style={{ 
                borderTopLeftRadius: rockFoldRadius, 
                borderTopRightRadius: rockFoldRadius 
              }} 
            />
            {/* Layer lines */}
            <path d="M 50 200 L 350 200" stroke="#57534e" strokeWidth="4" />
            <path d="M 50 250 L 350 250" stroke="#57534e" strokeWidth="4" />
            <path d="M 50 300 L 350 300" stroke="#57534e" strokeWidth="4" />
            
            <text x="200" y="350" fill="#d6d3d1" fontSize="24" fontWeight="bold" textAnchor="middle" opacity="0.8">INDIAN PLATE</text>
            
            {/* Movement arrows (only visible when moving fast) */}
            <motion.g style={{ opacity: useTransform(plateY, [300, 200, 50], [0, 1, 0]) }}>
              <path d="M 200 100 L 200 130 M 190 110 L 200 100 L 210 110" fill="none" stroke="#facc15" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </motion.g>
          </motion.g>
          
          {/* Growth Counter Overlay */}
          <motion.g style={{ opacity: useTransform(plateY, [-20, -50], [0, 1]) }}>
            <rect x="250" y="30" width="120" height="40" rx="8" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" />
            <text x="310" y="55" fill="#10b981" fontSize="14" fontWeight="bold" textAnchor="middle">+5mm / year</text>
          </motion.g>

        </svg>
      </div>

      {/* RIGHT SIDE: Info & Controls */}
      <div style={{ flex: '1 1 55%', minWidth: '350px', padding: '3rem', display: 'flex', flexDirection: 'column' }}>
        
        <h5 style={{ margin: '0 0 1rem 0', color: 'var(--accent)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Geological Time Machine
        </h5>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={stageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h2 style={{ fontSize: '3rem', color: 'var(--text-heading)', margin: '0 0 0.5rem 0', lineHeight: 1.1 }}>
                {currentInfo.mya > 0 ? `${currentInfo.mya} Million Years Ago` : currentInfo.label}
              </h2>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--accent)', margin: '0 0 1.5rem 0' }}>
                {currentInfo.title}
              </h3>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0' }}>
                {currentInfo.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Custom Timeline Slider */}
        <div style={{ marginBottom: '3rem', position: 'relative' }}>
          <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', position: 'relative', width: '100%' }}>
            <motion.div 
              style={{ 
                height: '100%', 
                background: 'var(--accent)', 
                borderRadius: '2px',
                width: useTransform(plateY, [300, -50], ['0%', '100%'])
              }} 
            />
            {TIMELINE_STAGES.map((stage, idx) => (
              <div 
                key={idx}
                onClick={() => setStageIndex(idx)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${(idx / (TIMELINE_STAGES.length - 1)) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: stageIndex >= idx ? 'var(--accent)' : 'var(--border)',
                  border: '4px solid var(--surface)',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
              >
                <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: '0.75rem', color: stageIndex >= idx ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {stage.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            Drag the slider or the tectonic plate to advance time.
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (stageIndex < TIMELINE_STAGES.length - 1) {
                setStageIndex(prev => prev + 1);
              } else {
                onComplete();
              }
            }}
            style={{
              background: stageIndex === TIMELINE_STAGES.length - 1 ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'var(--surface)',
              border: stageIndex === TIMELINE_STAGES.length - 1 ? 'none' : '1px solid var(--border)',
              color: stageIndex === TIMELINE_STAGES.length - 1 ? '#fff' : 'var(--text-primary)',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: stageIndex === TIMELINE_STAGES.length - 1 ? '0 10px 25px rgba(16, 185, 129, 0.4)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            {stageIndex === TIMELINE_STAGES.length - 1 ? 'Complete Discovery' : 'Next Era'} <ArrowRight size={20} />
          </motion.button>
        </div>

      </div>
    </div>
  );
}
