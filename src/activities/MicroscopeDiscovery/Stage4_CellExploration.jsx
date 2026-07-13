import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Info, CheckCircle } from 'lucide-react';
import useSound from 'use-sound';

export default function Stage4_CellExploration({ onComplete, addXp }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', { volume: 0.5 });
  
  const [activePart, setActivePart] = useState(null);
  const [discoveredParts, setDiscoveredParts] = useState([]);
  const [hasCompleted, setHasCompleted] = useState(false);

  const parts = [
    {
      id: 'cell_wall',
      name: 'Cell Wall',
      desc: 'An outer, rigid layer found only in plant cells.',
      func: 'Provides shape, support, and protection to the plant cell.',
      color: '#4ade80' // green
    },
    {
      id: 'cell_membrane',
      name: 'Cell Membrane',
      desc: 'A thin, flexible layer just inside the cell wall.',
      func: 'Controls what enters and exits the cell. It acts like a security guard.',
      color: '#fbbf24' // yellow
    },
    {
      id: 'nucleus',
      name: 'Nucleus',
      desc: 'The dense, round structure inside the cell.',
      func: 'Acts as the control center or "brain" of the cell. It directs all activities.',
      color: '#c084fc' // purple
    },
    {
      id: 'cytoplasm',
      name: 'Cytoplasm',
      desc: 'The jelly-like substance filling the cell.',
      func: 'Holds the cell components and is where most chemical reactions take place.',
      color: '#60a5fa' // blue
    }
  ];

  const handlePartClick = (partId) => {
    playClick();
    const part = parts.find(p => p.id === partId);
    setActivePart(part);
    
    if (!discoveredParts.includes(partId)) {
      setDiscoveredParts(prev => {
        const next = [...prev, partId];
        addXp(4); // roughly 16 total
        if (next.length === parts.length && !hasCompleted) {
          setTimeout(() => {
            playSuccess();
            setHasCompleted(true);
          }, 1000);
        }
        return next;
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem' }}>
      
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-heading)', margin: '0 0 0.5rem 0' }}>Explore the Plant Cell</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto' }}>
          Click on the different parts of the onion cell to learn what they are and why they are important.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flex: 1 }}>
        
        {/* Interactive Diagram Area */}
        <div style={{ 
          flex: 1, background: '#f8fafc', borderRadius: '16px', border: '1px solid var(--border)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'
        }}>
          
          {/* CSS Illustrated Cell */}
          <div style={{
            position: 'relative', width: '500px', height: '300px',
            background: '#e0f2fe', // cytoplasm color
            border: `12px solid ${activePart?.id === 'cell_wall' ? '#4ade80' : '#86efac'}`, // cell wall
            borderRadius: '24px',
            boxShadow: activePart?.id === 'cell_wall' ? '0 0 30px #4ade80' : 'none',
            transition: 'all 0.3s'
          }}>
            {/* Cell Membrane */}
            <div style={{
              position: 'absolute', inset: '4px',
              border: `4px dashed ${activePart?.id === 'cell_membrane' ? '#fbbf24' : '#fcd34d'}`,
              borderRadius: '12px',
              boxShadow: activePart?.id === 'cell_membrane' ? 'inset 0 0 20px #fbbf24, 0 0 20px #fbbf24' : 'none',
              transition: 'all 0.3s'
            }} />

            {/* Nucleus */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              onClick={() => handlePartClick('nucleus')}
              style={{
                position: 'absolute', top: '40%', left: '20%',
                width: '60px', height: '60px', borderRadius: '50%',
                background: activePart?.id === 'nucleus' ? '#c084fc' : '#d8b4fe',
                boxShadow: activePart?.id === 'nucleus' ? '0 0 30px #c084fc' : '0 4px 6px rgba(0,0,0,0.1)',
                cursor: 'pointer', zIndex: 10,
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}
            >
              {discoveredParts.includes('nucleus') && <CheckCircle size={20} color="white" />}
            </motion.div>

            {/* Cytoplasm Hotspot */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              onClick={() => handlePartClick('cytoplasm')}
              style={{
                position: 'absolute', top: '50%', right: '30%',
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.5)',
                border: '2px solid #93c5fd',
                cursor: 'pointer', zIndex: 10,
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}
            >
              {discoveredParts.includes('cytoplasm') && <CheckCircle size={16} color="#3b82f6" />}
            </motion.div>

            {/* Cell Membrane Hotspot */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              onClick={() => handlePartClick('cell_membrane')}
              style={{
                position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
                background: '#fef3c7', padding: '0.2rem 0.5rem', borderRadius: '8px', border: '1px solid #f59e0b',
                cursor: 'pointer', zIndex: 10, fontSize: '0.8rem', fontWeight: 'bold', color: '#b45309'
              }}
            >
              Membrane {discoveredParts.includes('cell_membrane') && '✓'}
            </motion.div>

            {/* Cell Wall Hotspot */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              onClick={() => handlePartClick('cell_wall')}
              style={{
                position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)',
                background: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '8px', border: '1px solid #22c55e',
                cursor: 'pointer', zIndex: 10, fontSize: '0.8rem', fontWeight: 'bold', color: '#166534'
              }}
            >
              Wall {discoveredParts.includes('cell_wall') && '✓'}
            </motion.div>
          </div>

        </div>

        {/* Information Panel */}
        <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', flex: 1, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <AnimatePresence mode="wait">
              {activePart ? (
                <motion.div
                  key={activePart.id}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: `2px solid ${activePart.color}`, paddingBottom: '0.5rem' }}>
                    <Info color={activePart.color} />
                    <h2 style={{ margin: 0, color: 'var(--text-heading)' }}>{activePart.name}</h2>
                  </div>
                  
                  <div>
                    <strong style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>What is it?</strong>
                    <p style={{ margin: '0.25rem 0 1rem 0', lineHeight: '1.5' }}>{activePart.desc}</p>
                  </div>

                  <div style={{ background: `${activePart.color}11`, padding: '1rem', borderRadius: '8px', border: `1px solid ${activePart.color}33` }}>
                    <strong style={{ color: activePart.color, fontSize: '0.9rem', textTransform: 'uppercase' }}>Function</strong>
                    <p style={{ margin: '0.25rem 0 0 0', lineHeight: '1.5', color: 'var(--text-heading)' }}>{activePart.func}</p>
                  </div>
                </motion.div>
              ) : (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)', textAlign: 'center', gap: '1rem' }}>
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    👆
                  </motion.div>
                  <p>Click any part of the cell to reveal its details.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: hasCompleted ? 1 : 0, height: hasCompleted ? 'auto' : 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--success)', textAlign: 'center', marginBottom: '1rem' }}>
              <CheckCircle size={24} style={{ marginBottom: '0.5rem' }} />
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>All parts explored!</p>
            </div>
            <button className="primary" onClick={onComplete} style={{ width: '100%', padding: '1rem', borderRadius: '30px' }}>
              Compare with Brick Wall <ArrowRight size={18} />
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
