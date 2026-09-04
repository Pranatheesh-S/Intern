import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Scale, CheckCircle2, AlertCircle, Info, Target, GripHorizontal } from 'lucide-react';
import { RealisticCup } from './Stage8a_Mass_Components/RealisticCup';
import { DraggableCup } from './Stage8a_Mass_Components/DraggableCup';
import { WeighingScale } from './Stage8a_Mass_Components/WeighingScale';

export default function Stage8a_Mass({ onComplete, addXp }) {
  const [weighedItems, setWeighedItems] = useState({});
  const [currentOnScale, setCurrentOnScale] = useState(null);
  const [isDragHoveringScale, setIsDragHoveringScale] = useState(false);

  const cups = [
    { id: 'water', label: 'Cup A', material: 'Water', mass: 44.92 },
    { id: 'sand', label: 'Cup B', material: 'Sand', mass: 85.30 },
    { id: 'pebbles', label: 'Cup C', material: 'Pebbles', mass: 142.15 }
  ];

  // When any cup starts dragging, immediately remove the previous cup from the physical scale
  const handleDragStart = () => {
    setCurrentOnScale(null);
  };

  const handleDrop = (id) => {
    if (id) {
      const cup = cups.find(c => c.id === id);
      setCurrentOnScale(cup);
      setIsDragHoveringScale(false);
      if (!weighedItems[id]) {
        setWeighedItems(prev => ({ ...prev, [id]: true }));
        if (typeof addXp === 'function') addXp(15);
      }
    }
  };

  const handleDragPosition = (isOver) => {
    setIsDragHoveringScale(isOver);
  };

  const progressCount = Object.keys(weighedItems).length;
  const isComplete = progressCount === 3;

  useEffect(() => {
    if (isComplete && typeof onComplete === 'function') {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', height: '100%', color: 'var(--lesson-text)' }}>
      
      {/* Header */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--lesson-border)', borderRadius: '16px', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: 'var(--heading-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Scale size={24} color="var(--lesson-primary)" /> Phase 1: How heavy or light?
          </h3>
          <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: 'var(--heading-sub)' }}>
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
        alignItems: 'stretch'
      }}>
        
        {/* Left Side: Material Evidence */}
        <div style={{ background: 'var(--lesson-card)', borderRadius: '16px', border: '1px solid var(--lesson-border)', padding: '1rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem', fontWeight: '800', color: 'var(--lesson-primary)', borderBottom: '1px solid var(--lesson-border)', paddingBottom: '0.5rem' }}>MATERIAL EVIDENCE</h4>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-evenly', gap: '0.75rem' }}>
            {cups.map(cup => {
              const hasBeenWeighed = weighedItems[cup.id];
              const isCurrentlyOnScale = currentOnScale?.id === cup.id;
              
              return (
                <motion.div 
                  key={cup.id}
                  whileHover={{ y: -2, boxShadow: '0 8px 16px rgba(87, 65, 51, 0.12)' }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.2 }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '1.25rem',
                    background: hasBeenWeighed ? 'var(--lesson-surface)' : 'var(--lesson-background)',
                    padding: '1.25rem 1rem', borderRadius: '12px', border: hasBeenWeighed ? '1px solid var(--lesson-border)' : '1px solid var(--lesson-border)',
                    boxShadow: '0 4px 6px rgba(87, 65, 51, 0.08)',
                    position: 'relative',
                    userSelect: 'none',
                    minHeight: '135px',
                    cursor: hasBeenWeighed ? 'default' : 'grab'
                  }}
                >
                  <div style={{ flexShrink: 0, width: '80px', height: '100px', zIndex: 10 }}>
                    <DraggableCup 
                      cup={cup} 
                      isWeighed={hasBeenWeighed} 
                      isCurrentlyOnScale={isCurrentlyOnScale}
                      onDragStart={handleDragStart}
                      onDrop={handleDrop} 
                      onDragPosition={handleDragPosition}
                      disabled={hasBeenWeighed} 
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '1.3rem', color: 'var(--lesson-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <GripHorizontal size={18} color="var(--lesson-muted)" /> {cup.label}
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--lesson-text)' }}>{cup.material}</div>
                  </div>
                  {hasBeenWeighed && <CheckCircle2 size={28} color="#A64B27" style={{ marginLeft: 'auto', marginRight: '0.5rem' }} />}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Middle: Weighing Station */}
        <div style={{ background: 'var(--lesson-card)', borderRadius: '16px', border: '1px solid var(--lesson-border)', padding: '1rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem', fontWeight: '800', color: 'var(--lesson-primary)', borderBottom: '1px solid var(--lesson-border)', paddingBottom: '0.5rem' }}>DIGITAL WEIGHING STATION</h4>
          
          <div style={{ 
              flex: 1,
              background: '#FFFFFF',
              border: isDragHoveringScale ? '2px solid #A64B27' : (currentOnScale ? '2px solid var(--lesson-border)' : '2px dashed var(--lesson-border)'), 
              borderRadius: '16px', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
              overflow: 'visible',
              transition: 'border-color 0.2s ease, background 0.2s ease'
            }}
          >
            {/* Guidance prompt when empty */}
            {!currentOnScale && (
              <div style={{ position: 'absolute', top: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', pointerEvents: 'none' }}>
                <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
                  <path d="M20 10 L 20 50" stroke={isDragHoveringScale ? '#A64B27' : 'var(--lesson-muted)'} strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
                  <path d="M12 42 L 20 50 L 28 42" stroke={isDragHoveringScale ? '#A64B27' : 'var(--lesson-muted)'} strokeWidth="2" fill="transparent" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div style={{ color: isDragHoveringScale ? '#A64B27' : '#8a7b6e', fontSize: '1.2rem', fontWeight: '700', textAlign: 'center', maxWidth: '160px', lineHeight: '1.4' }}>
                  {isDragHoveringScale ? 'Release to place on scale' : 'Drag a cup here to weigh it'}
                </div>
              </div>
            )}

            {/* Weighing Scale Component */}
            <WeighingScale 
              currentCupOnScale={currentOnScale?.id || null} 
              mass={currentOnScale?.mass || 0} 
              isHovered={isDragHoveringScale}
            />

          </div>
        </div>

        {/* Right Side: Observation Console & Inference */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 0 }}>
          {/* Observation Log: Compact, natural content height with small bottom padding */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--lesson-border)', padding: '1rem 1rem 1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800', color: '#A64B27', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--lesson-border)', paddingBottom: '0.75rem' }}>
              <Info size={20} /> Observation Log
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {cups.map(cup => {
                const isWeighed = weighedItems[cup.id];
                const isPebbles = cup.id === 'pebbles';
                const highlight = isComplete && isPebbles;
                return (
                  <motion.div 
                    key={cup.id}
                    layout
                    style={{ 
                      background: highlight ? 'var(--lesson-warning-bg)' : 'white', 
                      padding: highlight ? '12px 10px' : '8px 10px', 
                      borderRadius: '8px', 
                      border: highlight ? '2px solid var(--lesson-warning)' : `1px solid ${isWeighed ? 'var(--lesson-success-border)' : 'var(--lesson-border)'}`,
                      boxShadow: highlight ? '0 4px 6px -1px rgba(245, 158, 11, 0.2)' : 'none',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      transition: 'all 0.3s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '35px', height: '45px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <RealisticCup material={cup.id} />
                      </div>
                      <div>
                        <div style={{ fontWeight: highlight ? '900' : '800', fontSize: '1.1rem', color: highlight ? 'var(--lesson-primary)' : 'inherit' }}>{cup.label}</div>
                        <div style={{ fontSize: '1rem', fontWeight: '600', color: highlight ? '#A64B27' : 'var(--lesson-muted)' }}>{cup.material}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <motion.div 
                        key={isWeighed ? 'measured' : 'empty'}
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        style={{ fontSize: highlight ? '1.5rem' : '1.3rem', fontWeight: '900', color: highlight ? '#A64B27' : (isWeighed ? '#A64B27' : 'var(--lesson-muted)') }}
                      >
                        {isWeighed ? `${cup.mass.toFixed(2)} g` : '?.?? g'}
                      </motion.div>
                      {highlight && <CheckCircle2 size={24} color="#A64B27" />}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Inference Panel (Sits directly underneath Observation Log) */}
          {isComplete && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4 }} 
              style={{ 
                background: 'var(--lesson-background)', 
                padding: '1.5rem 1.5rem 2.25rem 1.5rem', 
                borderRadius: '16px', 
                border: '1px solid var(--lesson-border)', 
                boxShadow: '0 4px 6px rgba(87, 65, 51, 0.08)',
                minHeight: '260px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ color: 'var(--lesson-primary)', fontSize: '1.2rem', fontWeight: '900', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={20} /> INFERENCE
              </div>
              <p style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: 'var(--lesson-primary)', lineHeight: '1.55' }}>
                Even though all cups are the same size and half-filled, they have different weights! 
                The property that makes them heavy or light is called <strong style={{ color: '#A64B27', fontWeight: '900', fontSize: '1.25rem' }}>MASS</strong>.
              </p>
              <div style={{ marginTop: '1.25rem', background: 'var(--lesson-warning-bg)', padding: '0.9rem 1.2rem', borderRadius: '10px', borderLeft: '4px solid var(--lesson-warning)', display: 'inline-flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--lesson-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   Pebbles — 142.15 g <CheckCircle2 size={18} color="#A64B27" />
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#A64B27' }}>
                   Pebbles have the most mass.
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Section: Progress */}
      <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
        {/* Footer Progress */}
        <div style={{ flex: '1', background: '#FFFFFF', border: '1px solid var(--lesson-border)', borderRadius: '16px', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#A64B27' }}>
            <Target size={20} />
            <span style={{ color: 'var(--lesson-secondary)', fontSize: '1.1rem', fontWeight: '700' }}>Weigh all 3 cups to uncover their mass.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--lesson-text)', display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--lesson-border)' }}>
              {progressCount} / 3 Weighed
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

Stage8a_Mass.propTypes = {
  onComplete: PropTypes.func,
  addXp: PropTypes.func
};
