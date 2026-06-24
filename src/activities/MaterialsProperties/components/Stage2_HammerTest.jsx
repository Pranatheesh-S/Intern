import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hammer, CheckCircle, ArrowRight, Play, RefreshCw, Box } from 'lucide-react';

const ITEMS = [
  { id: 'copper', name: 'Piece of copper', color: '#b87333', result: 'flattens' },
  { id: 'aluminium', name: 'Piece of aluminium', color: '#a6a9b6', result: 'flattens' },
  { id: 'iron_nail', name: 'Iron nail', color: '#5b5b5b', result: 'flattens' },
  { id: 'coal', name: 'Piece of coal', color: '#2d2d2d', result: 'breaks' },
  { id: 'sulfur', name: 'Lump of sulfur', color: '#e8d82a', result: 'breaks' },
  { id: 'wood', name: 'Block of wood', color: '#8b5a2b', result: 'breaks' }
];

export default function Stage2_HammerTest({ onComplete }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [hammerStatus, setHammerStatus] = useState('idle'); // idle, hammering, finished
  const [observations, setObservations] = useState({});

  const handleSelect = (id) => {
    setSelectedItem(id);
    setHammerStatus('idle');
  };

  const handleHammer = () => {
    setHammerStatus('hammering');
    setTimeout(() => {
      setHammerStatus('finished');
    }, 1500); // 1.5s animation
  };

  const handleRecord = (id, result) => {
    setObservations(prev => ({ ...prev, [id]: result }));
    setSelectedItem(null);
    setHammerStatus('idle');
  };

  const isItemComplete = (id) => !!observations[id];
  const allComplete = ITEMS.every(item => isItemComplete(item.id));

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
          <Hammer style={{ color: '#ef4444' }} />
          Hammer Test
        </h3>
        <p style={{ color: '#94a3b8', margin: 0 }}>
          Place each item on the surface and beat it with a hammer. Does it flatten into a sheet or break into pieces?
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Left: Item Queue */}
        <div style={{ flex: '1 1 250px' }}>
          <h4 style={{ color: '#e2e8f0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Box size={18} /> Select Material
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`glass-panel ${selectedItem === item.id ? 'active' : ''}`}
                style={{
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: selectedItem === item.id ? '2px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                  background: isItemComplete(item.id) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '4px', background: item.color,
                    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {['copper', 'aluminium', 'iron_nail'].includes(item.id) && (
                      <motion.div
                        animate={{ x: ['-150%', '250%'] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 1 }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '40%',
                          height: '100%',
                          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)',
                          transform: 'skewX(-20deg)'
                        }}
                      />
                    )}
                  </div>
                  <span style={{ color: '#f8fafc', fontSize: '0.9rem' }}>{item.name}</span>
                </div>
                {isItemComplete(item.id) && <CheckCircle size={16} style={{ color: '#10b981' }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Hammering Arena */}
        <div className="glass-panel" style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', background: 'rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
          {!selectedItem ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
              <Hammer size={48} style={{ color: '#64748b', marginBottom: '1rem' }} />
              <p style={{ color: '#f8fafc', margin: 0 }}>Select a material from the list to test it.</p>
            </div>
          ) : (() => {
            const item = ITEMS.find(i => i.id === selectedItem);
            
            return (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ height: '200px', width: '100%', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '2rem' }}>
                  
                  {/* Hard Surface Line */}
                  <div style={{ position: 'absolute', bottom: 0, width: '80%', height: '8px', background: '#334155', borderRadius: '4px' }} />
                  
                  {/* The Item */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${item.id}-${hammerStatus}`}
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ 
                        y: 0, 
                        opacity: 1,
                        scaleY: hammerStatus === 'finished' && item.result === 'flattens' ? 0.3 : 1,
                        scaleX: hammerStatus === 'finished' && item.result === 'flattens' ? 1.8 : 1,
                        rotate: hammerStatus === 'finished' && item.result === 'breaks' ? [0, 15, -15, 0] : 0
                      }}
                      transition={{ duration: 0.5 }}
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        width: '60px',
                        height: '60px',
                        background: item.color,
                        borderRadius: item.result === 'breaks' && hammerStatus === 'finished' ? '0' : '8px',
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                        clipPath: hammerStatus === 'finished' && item.result === 'breaks' 
                          ? 'polygon(0 0, 40% 10%, 60% 0, 100% 20%, 80% 50%, 100% 80%, 70% 100%, 30% 90%, 0 100%, 10% 50%)'
                          : 'none',
                        overflow: 'hidden'
                      }}
                    >
                      {['copper', 'aluminium', 'iron_nail'].includes(item.id) && (
                        <motion.div
                          animate={{ x: ['-150%', '250%'] }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 1 }}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '40%',
                            height: '100%',
                            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)',
                            transform: 'skewX(-20deg)'
                          }}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Broken pieces (if breaks) */}
                  {hammerStatus === 'finished' && item.result === 'breaks' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ position: 'absolute', bottom: '8px', width: '120px', display: 'flex', justifyContent: 'space-between' }}
                    >
                      <div style={{ width: '20px', height: '15px', background: item.color, transform: 'rotate(45deg)' }} />
                      <div style={{ width: '15px', height: '20px', background: item.color, transform: 'rotate(-30deg)', marginTop: '20px' }} />
                    </motion.div>
                  )}

                  {/* Hammer Animation */}
                  <AnimatePresence>
                    {hammerStatus === 'hammering' && (
                      <motion.div
                        initial={{ rotate: -45, x: 50, y: -100 }}
                        animate={{ rotate: [0, -60, 10, -60, 10, -60], x: 20, y: -20 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
                        style={{ position: 'absolute', bottom: '60px', right: '50%', transformOrigin: 'bottom right' }}
                      >
                        <Hammer size={64} style={{ color: '#cbd5e1' }} fill="#94a3b8" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Controls & Recording */}
                {hammerStatus === 'idle' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0, textAlign: 'center' }}>
                      Drag the hammer onto the material to test it
                    </p>
                    <motion.div
                      drag
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      dragElastic={0.7}
                      onDragEnd={(e, info) => {
                        if (Math.abs(info.offset.y) > 30 || Math.abs(info.offset.x) > 30) {
                          handleHammer();
                        }
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9, rotate: -20, cursor: 'grabbing' }}
                      style={{ 
                        cursor: 'grab', 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        padding: '1rem', 
                        borderRadius: '50%', 
                        border: '2px dashed #ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                      }}
                    >
                      <Hammer size={32} style={{ color: '#ef4444' }} fill="rgba(239, 68, 68, 0.5)" />
                    </motion.div>
                  </div>
                ) : hammerStatus === 'finished' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
                    <p style={{ color: '#f8fafc', fontSize: '1.1rem', margin: 0 }}>What happened?</p>
                    <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                      <button 
                        onClick={() => handleRecord(item.id, 'flattens')}
                        className="tab-btn"
                        style={{ flex: 1, padding: '0.75rem', border: '1px solid #6366f1', background: 'rgba(99, 102, 241, 0.1)' }}
                      >
                        Flattens into a sheet
                      </button>
                      <button 
                        onClick={() => handleRecord(item.id, 'breaks')}
                        className="tab-btn"
                        style={{ flex: 1, padding: '0.75rem', border: '1px solid #6366f1', background: 'rgba(99, 102, 241, 0.1)' }}
                      >
                        Breaks into pieces
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#ef4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <RefreshCw size={18} className="spin" /> Hammering in progress...
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
        <button
          onClick={() => onComplete(observations)}
          disabled={!allComplete}
          className="primary"
          style={{ padding: '0.75rem 2rem', fontSize: '1rem', opacity: allComplete ? 1 : 0.5, cursor: allComplete ? 'pointer' : 'not-allowed' }}
        >
          {allComplete ? 'Complete Test & Go to Quiz' : 'Test all materials to continue'} <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
        </button>
      </div>
    </div>
  );
}
