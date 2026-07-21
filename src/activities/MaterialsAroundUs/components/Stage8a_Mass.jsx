import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, CheckCircle2, AlertCircle, Info, Target, GripHorizontal } from 'lucide-react';

export default function Stage8a_Mass({ onComplete, addXp }) {
  const [weighedItems, setWeighedItems] = useState({});
  const [currentOnScale, setCurrentOnScale] = useState(null);

  const cups = [
    { id: 'water', label: 'Cup A', material: 'Water', mass: 44.92, color: '#38bdf8', icon: '💧' },
    { id: 'sand', label: 'Cup B', material: 'Sand', mass: 85.30, color: '#b45309', icon: '🏜️' },
    { id: 'pebbles', label: 'Cup C', material: 'Pebbles', mass: 142.15, color: '#64748b', icon: '🪨' }
  ];

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('cup_id', id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('cup_id');
    if (id) {
      const cup = cups.find(c => c.id === id);
      setCurrentOnScale(cup);
      if (!weighedItems[id]) {
        setWeighedItems(prev => ({ ...prev, [id]: true }));
        addXp(15);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveFromScale = () => {
    setCurrentOnScale(null);
  };

  const progressCount = Object.keys(weighedItems).length;
  const isComplete = progressCount === 3;

  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: '100%', color: '#1e293b' }}>
      
      {/* Header */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Scale size={24} color="#4f46e5" /> Phase 1: How heavy or light?
          </h3>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569' }}>
            Activity 6.8: Let us measure. Drag each cup to the digital balance to record its mass.
          </p>
        </div>
        <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        
        {/* Lab Area */}
        <div style={{ flex: 1.5, background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            {cups.map(cup => {
              const isOnScale = currentOnScale?.id === cup.id;
              const hasBeenWeighed = weighedItems[cup.id];
              
              return (
                <div 
                  key={cup.id}
                  draggable={!isOnScale}
                  onDragStart={(e) => handleDragStart(e, cup.id)}
                  style={{ 
                    width: '100px', 
                    opacity: isOnScale ? 0.2 : 1,
                    cursor: isOnScale ? 'default' : 'grab',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                  }}
                >
                  <div style={{ 
                    position: 'relative', width: '80px', height: '100px', 
                    background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '4px 4px 20px 20px',
                    display: 'flex', justifyContent: 'center', alignItems: 'flex-end', overflow: 'hidden'
                  }}>
                    <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '50%', background: cup.color, opacity: 0.8 }} />
                    <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.5rem' }}>{cup.icon}</div>
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <GripHorizontal size={14} color="#94a3b8" /> {cup.label}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{cup.material}</div>
                  {hasBeenWeighed && <CheckCircle2 size={16} color="#16a34a" />}
                </div>
              );
            })}
          </div>

          {/* Scale Area */}
          <div 
            style={{ 
              marginTop: '3rem', 
              background: '#f8fafc', 
              border: currentOnScale ? '2px solid #e2e8f0' : '2px dashed #cbd5e1', 
              borderRadius: '16px', 
              height: '280px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
              paddingBottom: '30px',
              position: 'relative'
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {/* Help Arrow & Text (only when empty) */}
            {!currentOnScale && (
              <div style={{ position: 'absolute', left: '20px', top: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 30 C 15 10, 45 10, 50 15" stroke="#475569" strokeWidth="2" fill="transparent" strokeLinecap="round" />
                  <path d="M45 10 L 52 16 L 47 20" stroke="#475569" strokeWidth="2" fill="transparent" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div style={{ color: '#475569', fontSize: '0.85rem', width: '80px', textAlign: 'center', lineHeight: '1.3' }}>
                  Drag a cup here to weigh it
                </div>
              </div>
            )}

            {/* Object on scale (Positioned correctly ON the pan) */}
            <AnimatePresence>
              {currentOnScale && (
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  onClick={handleRemoveFromScale}
                  style={{ 
                    position: 'absolute', bottom: '155px', zIndex: 10, cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center'
                  }}
                  title="Click to remove"
                >
                  <div style={{ 
                    position: 'relative', width: '80px', height: '100px', 
                    background: '#ffffff', border: '2px solid #cbd5e1', borderRadius: '4px 4px 20px 20px',
                    display: 'flex', justifyContent: 'center', alignItems: 'flex-end', overflow: 'hidden',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '50%', background: currentOnScale.color, opacity: 0.8 }} />
                    <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.5rem' }}>{currentOnScale.icon}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* The Digital Scale (Reference Image Match) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2, marginBottom: '20px' }}>
              {/* Silver Pan */}
              <div style={{ 
                width: '240px', height: '25px', 
                background: 'linear-gradient(to bottom, #f1f5f9, #94a3b8)', 
                borderRadius: '8px 8px 4px 4px', 
                border: '1px solid #64748b', 
                borderBottom: 'none',
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.9), 0 4px 6px -1px rgba(0,0,0,0.2)',
                position: 'relative', zIndex: 3
              }} />
              
              {/* Main Body */}
              <div style={{ 
                width: '260px', height: '100px', 
                background: 'linear-gradient(to bottom, #e2e8f0, #cbd5e1)', 
                borderRadius: '8px 8px 24px 24px', 
                border: '1px solid #94a3b8', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), inset 0 -4px 6px rgba(255,255,255,0.4)',
                display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px 20px',
                position: 'relative', top: '-2px', zIndex: 2
              }}>
                {/* Black Front Panel */}
                <div style={{
                  width: '100%', height: '100%',
                  background: '#1e293b',
                  borderRadius: '16px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
                }}>
                  {/* Screen */}
                  <div style={{ 
                    width: '140px', height: '36px',
                    background: '#dcfce7', border: '2px inset #4ade80', borderRadius: '4px', 
                    display: 'flex', justifyContent: 'flex-end', alignItems: 'center', 
                    padding: '0 10px', fontFamily: 'monospace', fontSize: '1.4rem', color: '#064e3b',
                    boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)'
                  }}>
                    {currentOnScale ? `${currentOnScale.mass.toFixed(2)} g` : '0.00 g'}
                  </div>
                  {/* Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '180px', marginTop: 'auto' }}>
                    <button style={{ background: '#3b82f6', border: 'none', borderRadius: '16px', padding: '4px 16px', color: 'white', fontSize: '0.65rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>ON/TARE</button>
                    <button style={{ background: '#3b82f6', border: 'none', borderRadius: '16px', padding: '4px 16px', color: 'white', fontSize: '0.65rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>UNIT</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction Banner */}
            <div style={{ position: 'absolute', bottom: '15px', width: '90%', background: '#eff6ff', borderRadius: '8px', padding: '8px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #bfdbfe' }}>
              <Info size={16} color="#3b82f6" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.8rem', color: '#1e40af' }}>
                Click ON/TARE to reset the balance to 0.00 g before weighing a new cup.
              </span>
            </div>
          </div>
        </div>

        {/* Observation Console */}
        <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', border: '1px solid #c7d2fe', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
            <Info size={20} /> Observation Log
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
            {cups.map(cup => {
              const isWeighed = weighedItems[cup.id];
              return (
                <div key={cup.id} style={{ 
                  background: 'white', padding: '12px', borderRadius: '8px', border: `1px solid ${isWeighed ? '#bbf7d0' : '#e2e8f0'}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '1.2rem' }}>{cup.icon}</div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{cup.label}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{cup.material}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 'bold', color: isWeighed ? '#15803d' : '#94a3b8' }}>
                    {isWeighed ? `${cup.mass} g` : '?.?? g'}
                  </div>
                </div>
              );
            })}
          </div>

          {isComplete && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#e0e7ff', padding: '1rem', borderRadius: '12px', border: '1px solid #a5b4fc', marginTop: '1rem' }}>
              <div style={{ color: '#4338ca', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={16} /> Inference
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#312e81', lineHeight: '1.5' }}>
                Even though all cups are the same size and half-filled, they have different weights! 
                The property that makes them heavy or light is called <strong>mass</strong>. Pebbles have the most mass.
              </p>
            </motion.div>
          )}

        </div>
      </div>

      {/* Footer Progress */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#d97706' }}>
          <Target size={20} />
          <span style={{ color: '#475569', fontSize: '0.95rem' }}>Weigh all 3 cups to uncover their mass.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', background: isComplete ? '#dcfce7' : '#f8fafc', padding: '8px 16px', borderRadius: '20px', border: `1px solid ${isComplete ? '#bbf7d0' : '#e2e8f0'}`, transition: 'all 0.3s' }}>
            {isComplete ? (
              <><span style={{ color: '#16a34a' }}>Completed!</span> <CheckCircle2 size={18} color="#16a34a" /></>
            ) : (
              <>{progressCount} / 3 Weighed</>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
