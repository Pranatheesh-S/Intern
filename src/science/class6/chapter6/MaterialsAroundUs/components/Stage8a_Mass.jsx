import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, CheckCircle2, AlertCircle, Info, Target, GripHorizontal } from 'lucide-react';
import { RealisticCup } from './Stage8a_Mass_Components/RealisticCup';
import { DraggableCup } from './Stage8a_Mass_Components/DraggableCup';
import { WeighingScale } from './Stage8a_Mass_Components/WeighingScale';

export default function Stage8a_Mass({ onComplete, addXp }) {
  // HMR Trigger
  const [weighedItems, setWeighedItems] = useState({});
  const [currentOnScale, setCurrentOnScale] = useState(null);

  const cups = [
    { id: 'water', label: 'Cup A', material: 'Water', mass: 44.92 },
    { id: 'sand', label: 'Cup B', material: 'Sand', mass: 85.30 },
    { id: 'pebbles', label: 'Cup C', material: 'Pebbles', mass: 142.15 }
  ];

  const handleDrop = (id) => {
    if (id) {
      const cup = cups.find(c => c.id === id);
      setCurrentOnScale(cup);
      if (!weighedItems[id]) {
        setWeighedItems(prev => ({ ...prev, [id]: true }));
        addXp(15);
      }
    }
  };

  const progressCount = Object.keys(weighedItems).length;
  const isComplete = progressCount === 3;

  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', height: '100%', color: 'var(--text-primary)' }}>
      
      {/* Header */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Scale size={24} color="var(--accent)" /> Phase 1: How heavy or light?
          </h3>
          <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
            Activity 6.8: Let us measure. Drag each cup to the digital balance to record its mass.
          </p>
        </div>
      </div>

      {/* Main Content - 3 Column Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'minmax(280px, 0.9fr) minmax(500px, 1.25fr) minmax(300px, 0.9fr)', 
        gap: '1rem', 
        flex: 1, 
        minHeight: 0,
        alignItems: 'start'
      }}>
        
        {/* Left Side: Material Evidence */}
        <div style={{ background: '#fcfaf6', borderRadius: '16px', border: '1px solid #d6c6b4', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem', fontWeight: '800', color: '#574133', borderBottom: '1px solid #d6c6b4', paddingBottom: '0.5rem' }}>MATERIAL EVIDENCE</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {cups.map(cup => {
              const isOnScale = currentOnScale?.id === cup.id;
              const hasBeenWeighed = weighedItems[cup.id];
              
              return (
                <div 
                  key={cup.id}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    background: '#fcf6ea', padding: '0.5rem', borderRadius: '12px', border: '1px solid #c8b6a6',
                    boxShadow: '0 4px 6px rgba(87, 65, 51, 0.08)',
                    position: 'relative',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ flexShrink: 0, width: '80px', height: '100px', zIndex: 10 }}>
                    <DraggableCup cup={cup} isWeighed={isOnScale} onDrop={handleDrop} disabled={false} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#574133', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <GripHorizontal size={16} color="#a89f91" /> {cup.label}
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#8a7b6e' }}>{cup.material}</div>
                  </div>
                  {hasBeenWeighed && <CheckCircle2 size={24} color="#d97706" style={{ marginLeft: 'auto', marginRight: '0.5rem' }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle: Weighing Station */}
        <div style={{ background: '#fcfaf6', borderRadius: '16px', border: '1px solid #d6c6b4', padding: '1rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem', fontWeight: '800', color: '#574133', borderBottom: '1px solid #d6c6b4', paddingBottom: '0.5rem' }}>DIGITAL WEIGHING STATION</h4>
          
          <div style={{ 
              flex: 1,
              background: 'rgba(255,255,255,0.6)', 
              border: currentOnScale ? '2px solid #d97706' : '2px dashed #d6c6b4', 
              borderRadius: '16px', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
              overflow: 'visible'
            }}
          >
            {/* Help Arrow & Text (only when empty) */}
            {!currentOnScale && (
              <div style={{ position: 'absolute', top: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', pointerEvents: 'none' }}>
                <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
                  <path d="M20 10 L 20 50" stroke="#a89f91" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
                  <path d="M12 42 L 20 50 L 28 42" stroke="#a89f91" strokeWidth="2" fill="transparent" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div style={{ color: '#8a7b6e', fontSize: '1.2rem', fontWeight: '700', textAlign: 'center', maxWidth: '140px', lineHeight: '1.4' }}>
                  Drag a jar here to weigh it
                </div>
              </div>
            )}

            {/* Weighing Scale Component */}
            <WeighingScale currentCupOnScale={currentOnScale?.id} mass={currentOnScale?.mass} />

          </div>
        </div>

        {/* Right Side: Observation Console */}
        <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            <Info size={20} /> Observation Log
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {cups.map(cup => {
              const isWeighed = weighedItems[cup.id];
              const isPebbles = cup.id === 'pebbles';
              const highlight = isComplete && isPebbles;
              return (
                <div key={cup.id} style={{ 
                  background: highlight ? '#fef3c7' : 'white', 
                  padding: highlight ? '12px 10px' : '8px 10px', 
                  borderRadius: '8px', 
                  border: highlight ? '2px solid #f59e0b' : `1px solid ${isWeighed ? '#bbf7d0' : 'var(--border)'}`,
                  boxShadow: highlight ? '0 4px 6px -1px rgba(245, 158, 11, 0.2)' : 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'all 0.3s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '35px', height: '45px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RealisticCup material={cup.id} />
                    </div>
                    <div>
                      <div style={{ fontWeight: highlight ? '900' : '800', fontSize: '1.1rem', color: highlight ? '#92400e' : 'inherit' }}>{cup.label}</div>
                      <div style={{ fontSize: '1rem', fontWeight: '600', color: highlight ? '#b45309' : 'var(--text-muted)' }}>{cup.material}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: highlight ? '1.5rem' : '1.3rem', fontWeight: '900', color: highlight ? '#d97706' : (isWeighed ? '#15803d' : 'var(--text-muted)') }}>
                      {isWeighed ? `${cup.mass} g` : '?.?? g'}
                    </div>
                    {highlight && <CheckCircle2 size={24} color="#d97706" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: Progress & Inference */}
      <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
        {/* Footer Progress */}
        <div style={{ flex: isComplete ? '0.35' : '1', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s' }}>
          {!isComplete && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#d97706' }}>
              <Target size={20} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: '700' }}>Weigh all 3 cups to uncover their mass.</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: isComplete ? '100%' : 'auto', justifyContent: isComplete ? 'center' : 'flex-end' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', background: isComplete ? '#dcfce7' : 'var(--surface)', padding: '8px 16px', borderRadius: '20px', border: `1px solid ${isComplete ? '#bbf7d0' : 'var(--border)'}`, transition: 'all 0.3s', width: isComplete ? '100%' : 'auto', justifyContent: 'center' }}>
              {isComplete ? (
                <><span style={{ color: '#16a34a' }}>Completed!</span> <CheckCircle2 size={20} color="#16a34a" /></>
              ) : (
                <>{progressCount} / 3 Weighed</>
              )}
            </div>
          </div>
        </div>
        
        {isComplete && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ flex: '0.65', background: '#fcf6ea', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #c8b6a6', boxShadow: '0 4px 6px rgba(87, 65, 51, 0.08)' }}>
            <div style={{ color: '#574133', fontSize: '1.2rem', fontWeight: '900', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={20} /> INFERENCE
            </div>
            <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: '#574133', lineHeight: '1.5' }}>
              Even though all cups are the same size and half-filled, they have different weights! 
              The property that makes them heavy or light is called <strong style={{ color: '#d97706', fontWeight: '900', fontSize: '1.25rem' }}>MASS</strong>.
            </p>
            <div style={{ marginTop: '0.75rem', background: '#fef3c7', padding: '0.75rem 1rem', borderRadius: '8px', borderLeft: '4px solid #f59e0b', display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 Pebbles — 142.15 g <CheckCircle2 size={18} color="#d97706" />
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#b45309' }}>
                 Pebbles have the most mass.
              </div>
            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
}
