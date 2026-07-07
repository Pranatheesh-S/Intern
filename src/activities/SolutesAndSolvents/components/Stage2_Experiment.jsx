import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DndContext, useDraggable, useDroppable, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors, pointerWithin } from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';

// Draggable spoon component
const DraggableSpoon = ({ id, disabled }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        opacity: isDragging ? 0 : (disabled ? 0.5 : 1),
        cursor: disabled ? 'not-allowed' : 'grab',
        touchAction: 'none'
      }}
    >
      <SaltSpoonSVG />
    </div>
  );
};

// Droppable tumbler wrapper
const DroppableTumbler = ({ children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'tumbler-dropzone',
  });
  
  return (
    <div ref={setNodeRef} style={{ padding: '10px', borderRadius: '20px', transition: 'background 0.3s', background: isOver ? 'rgba(56, 189, 248, 0.1)' : 'transparent', display: 'flex', justifyContent: 'center' }}>
      {children}
    </div>
  );
};

const SaltSpoonSVG = () => (
  <svg viewBox="0 0 80 40" width="80" height="40" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
    <path d="M 30,20 L 75,20" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
    <ellipse cx="20" cy="20" rx="15" ry="10" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
    <ellipse cx="20" cy="18" rx="10" ry="6" fill="#ffffff" />
  </svg>
);


const SATURATION_POINT = 3;
const MAX_SPOONS = 4;

export default function Stage2_Experiment({ onComplete }) {
  const [spoonsAdded, setSpoonsAdded] = useState(0);
  const [isStirring, setIsStirring] = useState(false);
  const [stirCount, setStirCount] = useState(0); // Tracks how many times it has been stirred successfully
  const [isAnimatingSpoon, setIsAnimatingSpoon] = useState(false);
  const [activeDragId, setActiveDragId] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  // Array of observation objects: { id: 1, amount: 'One', dissolved: true/false }
  const [observations, setObservations] = useState([]);

  const spoonAmounts = ['One', 'Two', 'Three', 'Four'];

  const handleAddSalt = () => {
    if (spoonsAdded >= MAX_SPOONS || spoonsAdded > stirCount || isStirring || isAnimatingSpoon) return;
    
    setIsAnimatingSpoon(true);
    // Simulate spoon animation
    setTimeout(() => {
      setSpoonsAdded(prev => prev + 1);
      setIsAnimatingSpoon(false);
    }, 1500);
  };

  const handleStir = () => {
    if (spoonsAdded === 0 || spoonsAdded === stirCount || isStirring || isAnimatingSpoon) return;
    
    setIsStirring(true);
    
    // Simulate stirring for 2 seconds
    setTimeout(() => {
      setIsStirring(false);
      setStirCount(spoonsAdded);
      
      const newObs = {
        id: spoonsAdded,
        amount: spoonAmounts[spoonsAdded - 1],
        dissolves: spoonsAdded <= SATURATION_POINT
      };
      
      setObservations(prev => {
        // Prevent duplicate entries for the same spoon
        if (prev.find(o => o.id === newObs.id)) return prev;
        return [...prev, newObs];
      });
    }, 2000);
  };

  const handleReset = () => {
    setSpoonsAdded(0);
    setStirCount(0);
    setIsStirring(false);
    setIsAnimatingSpoon(false);
    setObservations([]);
    setActiveDragId(null);
  };

  const handleDragStart = (event) => {
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveDragId(null);
    if (event.over && event.over.id === 'tumbler-dropzone') {
      handleAddSalt();
    }
  };

  // Determine what particles to show
  // Before stirring: show all recently added salt at the bottom as a mound.
  // After stirring: if <= SATURATION_POINT, it dissolves (disappears).
  // If > SATURATION_POINT, the excess remains at the bottom.
  const dissolvedAmount = Math.min(stirCount, SATURATION_POINT);
  const undissolvedAmount = spoonsAdded - dissolvedAmount;
  
  // Calculate water opacity based on concentration
  // The more dissolved salt, the slightly more cloudy/opaque the water might look (subtle effect)
  const waterOpacity = 0.5 + (dissolvedAmount * 0.1);
  const isSaturated = stirCount > SATURATION_POINT;
  const waterColor = isSaturated ? `rgba(186, 230, 253, ${waterOpacity + 0.1})` : `rgba(56, 189, 248, ${waterOpacity})`;
  
  const isActivityComplete = observations.length >= MAX_SPOONS;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem' }}>
      
      {/* Left Panel: Lab Area */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '1.5rem', 
          display: 'flex', 
          flexDirection: 'column',
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-heading)' }}>
              <Beaker size={20} style={{ color: '#0ea5e9' }} /> Virtual Lab Bench
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-faint)' }}>
              1. Add a spoon of salt to the water.<br/>
              2. Stir well and observe if it dissolves.<br/>
              3. Repeat until salt stops dissolving.
            </p>
          </div>
          <button 
            onClick={handleReset}
            className="outline"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', gap: '0.35rem' }}
          >
            <RotateCcw size={14} /> Reset Activity
          </button>
        </div>

        {/* Experiment Visualizer */}
        <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative',
            background: 'var(--surface)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            minHeight: '300px'
          }}>
            
            {/* Salt Bowl area */}
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ marginBottom: '-10px', zIndex: 2 }}>
                <DraggableSpoon id="spoon-drag" disabled={spoonsAdded >= MAX_SPOONS || spoonsAdded > stirCount || isStirring || isAnimatingSpoon} />
              </div>
              <div style={{ width: '80px', height: '40px', background: '#cbd5e1', borderRadius: '0 0 40px 40px', border: '3px solid #94a3b8', borderTop: 'none', position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', top: '-5px', width: '70px', height: '15px', background: 'white', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-25px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Salt</div>
              </div>
            </div>

            {/* Tumbler Area */}
            <DroppableTumbler>
              <div style={{
                position: 'relative',
                width: '140px',
                height: '200px',
                border: '4px solid rgba(148, 163, 184, 1)',
                borderTop: 'none',
                borderBottomLeftRadius: '20px',
                borderBottomRightRadius: '20px',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1), inset 0 -10px 20px rgba(255,255,255,0.1)',
                background: 'rgba(241, 248, 255, 0.5)',
                overflow: 'hidden'
              }}>
            {/* Water */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: '60%',
              background: waterColor,
              borderTop: '2px solid rgba(255,255,255,0.5)',
              transition: 'background 0.5s ease',
            }}>
              {/* High-Quality Stirring Animation Effect */}
              <AnimatePresence>
                {isStirring && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                    }}
                  >
                    {/* Vortex Gradient */}
                    <div style={{
                      position: 'absolute',
                      top: '10%',
                      left: '10%',
                      width: '80%',
                      height: '80%',
                      borderRadius: '50%',
                      background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.4) 25%, transparent 50%, rgba(255,255,255,0.2) 75%, transparent 100%)',
                      animation: 'spin 0.6s linear infinite',
                      filter: 'blur(3px)',
                      transformOrigin: 'center center'
                    }} />

                    {/* Ripples */}
                    <div style={{
                      position: 'absolute',
                      top: '10%',
                      left: '10%',
                      width: '80%',
                      height: '80%',
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.5)',
                      animation: 'ripple 1.2s ease-out infinite'
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: '10%',
                      left: '10%',
                      width: '80%',
                      height: '80%',
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.3)',
                      animation: 'ripple 1.2s ease-out infinite 0.6s'
                    }} />

                    {/* Rotating Silver Spoon */}
                    <div style={{
                      position: 'absolute',
                      top: '15%',
                      left: '50%',
                      width: '20px',
                      height: '110px',
                      marginTop: '-55px',
                      marginLeft: '-10px',
                      animation: 'orbit-spoon 0.6s linear infinite'
                    }}>
                      <svg viewBox="0 0 20 100" width="100%" height="100%" style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.4))' }}>
                        {/* Spoon Handle */}
                        <rect x="8" y="0" width="4" height="70" fill="url(#silver-grad)" rx="2" />
                        {/* Spoon Bowl */}
                        <ellipse cx="10" cy="85" rx="8" ry="15" fill="url(#silver-grad)" />
                        
                        <defs>
                          <linearGradient id="silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f8fafc" />
                            <stop offset="50%" stopColor="#94a3b8" />
                            <stop offset="100%" stopColor="#64748b" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Undissolved Salt Mound */}
              <AnimatePresence>
                {undissolvedAmount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      position: 'absolute',
                      bottom: '-10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: `${40 + (undissolvedAmount * 10)}%`,
                      height: `${20 + (undissolvedAmount * 10)}px`,
                      background: 'rgba(255,255,255,0.9)',
                      borderRadius: '50% 50% 0 0',
                      boxShadow: '0 -2px 10px rgba(255,255,255,0.5)'
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Saturated solution floating salt particles */}
              <AnimatePresence>
                {isSaturated && (
                  <>
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: [0, 1, 0],
                          y: [0, -50, -20],
                          x: [0, (i % 2 === 0 ? 25 : -25), (i % 2 === 0 ? -15 : 15)]
                        }}
                        transition={{
                          duration: 3 + (i % 3),
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.3
                        }}
                        style={{
                          position: 'absolute',
                          bottom: `${15 + (i % 5) * 10}%`,
                          left: `${15 + (i % 8) * 10}%`,
                          width: '4.5px',
                          height: '4.5px',
                          background: '#ffffff',
                          borderRadius: '50%',
                          boxShadow: '0 0 3px rgba(0,0,0,0.3)',
                          filter: 'blur(0.2px)'
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </div>
            </div>
            </DroppableTumbler>

            {/* Animated Spoon pouring salt */}
            <AnimatePresence>
            {isAnimatingSpoon && (
              <motion.div
                initial={{ opacity: 0, x: 100, y: -100, rotate: 45 }}
                animate={{ opacity: 1, x: 0, y: -50, rotate: 0 }}
                exit={{ opacity: 0, y: 50, transition: { duration: 0.3 } }}
                transition={{ duration: 0.8 }}
                style={{
                  position: 'absolute',
                  top: '30%',
                  right: '25%',
                  zIndex: 10
                }}
              >
                <div style={{
                  width: '60px',
                  height: '15px',
                  background: '#9ca3af',
                  borderRadius: '10px 0 0 10px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '-20px',
                    top: '-5px',
                    width: '30px',
                    height: '25px',
                    background: '#d1d5db',
                    borderRadius: '50%',
                    boxShadow: 'inset -2px -2px 5px rgba(0,0,0,0.2)'
                  }}>
                    {/* Salt on spoon */}
                    <motion.div
                      animate={{ y: [0, 50], opacity: [1, 0] }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '5px',
                        width: '20px',
                        height: '15px',
                        background: 'white',
                        borderRadius: '50%'
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes ripple {
              0% { transform: scale(0.2); opacity: 1; border-width: 4px; }
              100% { transform: scale(1); opacity: 0; border-width: 1px; }
            }
            @keyframes orbit-spoon {
              0% { transform: rotate(0deg) translateX(25px) rotate(0deg); }
              100% { transform: rotate(360deg) translateX(25px) rotate(-360deg); }
            }
            @keyframes pulse-glow {
              0% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.7); }
              70% { box-shadow: 0 0 0 10px rgba(14, 165, 233, 0); }
              100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
            }
          `}</style>

          <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
            {activeDragId ? (
              <div style={{ pointerEvents: 'none', opacity: 0.8, transform: 'scale(1.2)' }}>
                <SaltSpoonSVG />
              </div>
            ) : null}
          </DragOverlay>

          </div>
        </DndContext>

        {/* Toolbar Controls */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '1.5rem',
          marginTop: '1.5rem'
        }}>

          <button 
            onClick={handleStir}
            disabled={spoonsAdded === 0 || spoonsAdded === stirCount || isStirring || isAnimatingSpoon}
            style={{ 
              padding: '0.8rem 1.5rem',
              background: 'var(--accent)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              cursor: (spoonsAdded === 0 || spoonsAdded === stirCount || isStirring || isAnimatingSpoon) ? 'not-allowed' : 'pointer',
              opacity: (spoonsAdded === 0 || spoonsAdded === stirCount || isStirring || isAnimatingSpoon) ? 0.5 : 1,
              animation: (spoonsAdded > stirCount && !isAnimatingSpoon && !isStirring) ? 'pulse-glow 1s infinite' : 'none'
            }}
          >
            {isStirring ? 'Stirring...' : 'Stir Well'}
          </button>
        </div>

      </div>

      {/* Right Panel: Observation Table */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-heading)' }}>Table 9.1: Dissolution of salt</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {/* Table Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '0.5rem', borderBottom: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-faint)', fontWeight: 'bold' }}>
            <span>Amount of salt (teaspoon)</span>
            <span>Observation</span>
          </div>

          {/* Table Rows */}
          {spoonAmounts.map((amount, index) => {
            const spoonNum = index + 1;
            const obs = observations.find(o => o.id === spoonNum);
            const isCurrent = spoonNum === spoonsAdded && spoonNum > stirCount;

            return (
              <div 
                key={amount} 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  padding: '0.75rem 0.5rem', 
                  background: 'var(--surface)',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  alignItems: 'center',
                  borderLeft: isCurrent ? '3px solid var(--accent)' : '3px solid transparent',
                  opacity: (obs || isCurrent) ? 1 : 0.4
                }}
              >
                <span style={{ color: 'var(--text-heading)' }}>{amount}</span>
                <span style={{ 
                  color: obs ? (obs.dissolves ? 'var(--success)' : '#ef4444') : 'var(--text-muted)',
                  fontWeight: obs ? 'bold' : 'normal'
                }}>
                  {obs ? (obs.dissolves ? 'Dissolves' : 'Does not dissolve') : (isCurrent ? 'Waiting to stir...' : '-')}
                </span>
              </div>
            );
          })}
        </div>

        {/* Conclusion block after completing experiment */}
        <AnimatePresence>
          {isActivityComplete && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '8px', border: '1px solid rgba(14, 165, 233, 0.2)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <CheckCircle2 size={16} style={{ color: '#0ea5e9' }} />
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#0ea5e9' }}>Conclusion</h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Initially, the salt completely dissolves, forming an <strong>unsaturated solution</strong>. After adding {SATURATION_POINT} spoons, the added salt does not dissolve completely and settles at the bottom. This indicates the water has reached its limit and formed a <strong>saturated solution</strong>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {isActivityComplete && (
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="primary" 
              onClick={onComplete} 
              style={{ width: '100%', fontSize: '1rem', padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              Next Stage <ArrowRight size={18} />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
