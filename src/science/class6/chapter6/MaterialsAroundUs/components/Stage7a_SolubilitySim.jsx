import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, Search, Droplets, Target, Camera } from 'lucide-react';

const StirringProgress = () => {
  const [percent, setPercent] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#431407', letterSpacing: '0.05em' }}>STIRRING</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#d97706', lineHeight: 1 }}>{percent}%</div>
      </div>
      <div style={{ width: '100%', height: '24px', background: '#fff', border: '1px solid #d6d3d1', borderRadius: '12px', overflow: 'hidden', padding: '2px' }}>
        <div style={{ height: '100%', background: '#d97706', width: `${percent}%`, transition: 'width 0.1s linear', borderRadius: '8px' }} />
      </div>
      <div style={{ fontSize: '1.1rem', color: '#78716c', fontWeight: '600', textTransform: 'uppercase' }}>Mixing...</div>
    </div>
  );
};


export default function Stage7a_SolubilitySim({ onComplete, addXp }) {
  const [selectedSubstance, setSelectedSubstance] = useState(null);
  const [stirState, setStirState] = useState('idle'); // idle, stirring, resolved
  const [observations, setObservations] = useState({});

  const substances = [
    { 
      id: 'sugar', name: 'Sugar', type: 'Soluble', image: '/images/solubility_sugar.png',
      desc: 'Sugar completely disappears when stirred into water.',
      conclusion: 'Materials that dissolve in water are called Soluble.',
      waterColor: 'var(--accent)', turbidity: 0, solidVisible: false
    },
    { 
      id: 'salt', name: 'Salt', type: 'Soluble', image: '/images/solubility_salt.png',
      desc: 'Salt completely disappears when stirred into water.',
      conclusion: 'Materials that dissolve in water are called Soluble.',
      waterColor: 'var(--accent)', turbidity: 0, solidVisible: false
    },
    { 
      id: 'chalk', name: 'Chalk Powder', type: 'Insoluble', image: '/images/solubility_chalk.png',
      desc: 'The water turns cloudy and chalk powder does not disappear.',
      conclusion: 'Materials that do not dissolve in water are Insoluble.',
      waterColor: 'var(--border)', turbidity: 0.8, solidVisible: true, solidColor: 'var(--surface)', settle: false
    },
    { 
      id: 'sand', name: 'Sand', type: 'Insoluble', image: '/images/solubility_sand.png',
      desc: 'Sand settles down at the bottom of the beaker.',
      conclusion: 'Sand is Insoluble in water.',
      waterColor: 'var(--accent)', turbidity: 0.2, solidVisible: true, solidColor: '#b45309', settle: true
    },
    { 
      id: 'sawdust', name: 'Sawdust', type: 'Insoluble', image: '/images/solubility_sawdust.png',
      desc: 'Sawdust floats on the surface of the water.',
      conclusion: 'Sawdust is Insoluble in water.',
      waterColor: 'var(--accent)', turbidity: 0.1, solidVisible: true, solidColor: '#d97706', float: true
    }
  ];

  const handleSelect = (sub) => {
    setSelectedSubstance(sub);
    setStirState('idle');
  };

  const handleStir = () => {
    if (!selectedSubstance) return;
    setStirState('stirring');

    setTimeout(() => {
      setStirState('resolved');
      if (!observations[selectedSubstance.id]) {
        setObservations(prev => ({ ...prev, [selectedSubstance.id]: true }));
        addXp(15);
      }
    }, 1500);
  };

  const obsCount = Object.keys(observations).length;
  const isComplete = obsCount === substances.length;

  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: '100%', color: 'var(--text-primary)' }}>
      
      {/* Header */}
      <div style={{ background: '#fdfbf7', border: '1px solid #e7e5e4', borderRadius: '16px', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '2rem', color: '#431407', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold' }}>
            <Search size={32} color="#d97706" /> Phase 1: Solubility Simulator
          </h3>
          <p style={{ margin: 0, fontSize: '1.15rem', color: '#57534e', fontWeight: '500' }}>
            Activity 6.7: Let us explore how different materials behave when we mix them in water.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#fff', border: '1px solid #d6d3d1', borderRadius: '12px', padding: '12px 18px', position: 'relative', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '1rem', color: '#431407', fontWeight: '600' }}>Does everything dissolve?</div>
            <div style={{ fontSize: '1rem', color: '#431407', fontWeight: '600' }}>Add to water, then stir!</div>
            <div style={{ position: 'absolute', right: '-8px', top: '24px', width: '16px', height: '16px', background: '#fff', borderRight: '1px solid #d6d3d1', borderBottom: '1px solid #d6d3d1', transform: 'rotate(-45deg)' }} />
          </div>
          <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: '90px', height: '90px', objectFit: 'contain' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0, background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
        
        {/* Main Lab Area */}
        <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-heading)' }}>Materials to Test</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
              {substances.map((sub) => {
                const isSelected = selectedSubstance?.id === sub.id;
                const isObserved = observations[sub.id];
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSelect(sub)}
                    style={{
                      background: isSelected ? 'var(--surface)' : 'white',
                      border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                      color: isSelected ? 'var(--text-heading)' : 'var(--text-primary)',
                      padding: '1rem 0.5rem',
                      borderRadius: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 4px 15px rgba(59, 130, 246, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                    }}
                  >
                    <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                      <div style={{ width: '100%', height: '100%', background: 'var(--surface)', borderRadius: '50%', padding: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={sub.image} alt={sub.name} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '50%', mixBlendMode: 'multiply' }} />
                      </div>
                      {isObserved && (
                        <div style={{ position: 'absolute', top: -2, right: -2, background: '#16a34a', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>✓</div>
                      )}
                    </div>
                    <span style={{ fontSize: '0.95rem', textAlign: 'center', lineHeight: '1.2' }}>{sub.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {/* The Beaker */}
            <div style={{ position: 'relative', width: '200px', height: '240px', display: 'flex', justifyContent: 'center' }}>
              
              {/* Back of glass */}
              <div style={{ position: 'absolute', bottom: 0, width: '160px', height: '200px', background: 'rgba(255,255,255,0.8)', border: '2px solid var(--border)', borderTop: 'none', borderRadius: '0 0 16px 16px' }} />
              
              {/* Liquid inside */}
              <div style={{ 
                position: 'absolute', bottom: '2px', width: '156px', height: '140px', 
                background: 'linear-gradient(180deg, rgba(56,189,248,0.3) 0%, rgba(14,165,233,0.6) 100%)', 
                borderRadius: '0 0 14px 14px',
                transition: 'all 1s ease-in-out',
                overflow: 'hidden'
              }}>
                {/* Splash Ripples */}
                <AnimatePresence>
                  {stirState === 'idle' && selectedSubstance && (
                    <motion.div
                      key={`ripple-${selectedSubstance.id}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 0.4, 0], scale: [0.5, 2.5, 3] }}
                      transition={{ duration: 1.5, repeat: 1, delay: 0.3 }}
                      style={{
                        position: 'absolute',
                        top: 15,
                        left: '50%',
                        marginLeft: '-25px',
                        width: '50px',
                        height: '15px',
                        border: '1.5px solid rgba(255,255,255,0.7)',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Stirring Center Ripple */}
                <AnimatePresence>
                  {stirState === 'stirring' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: [0, 0.2, 0], scale: [0.8, 1.5, 2] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                      style={{
                        position: 'absolute',
                        top: 60,
                        left: '50%',
                        marginLeft: '-30px',
                        width: '60px',
                        height: '20px',
                        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0) 40%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0) 80%)',
                        borderRadius: '50%',
                        pointerEvents: 'none',
                        zIndex: 4
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Realistic Particles System */}
                <AnimatePresence>
                  {selectedSubstance && (
                    <motion.div
                      key={selectedSubstance.id}
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
                    >
                      {(() => {
                        const getParticleConfig = (id) => {
                          switch (id) {
                            case 'sugar': return { count: 40, color: '#ffffff', minSize: 1.5, maxSize: 3, opacity: 0.85, type: 'crystal' };
                            case 'salt': return { count: 40, color: '#f8fafc', minSize: 1.2, maxSize: 2.5, opacity: 0.9, type: 'crystal' };
                            case 'chalk': return { count: 50, color: '#fdfdfd', minSize: 1.5, maxSize: 4, opacity: 0.95, type: 'powder' };
                            case 'sand': return { count: 45, color: '#a16207', minSize: 1.5, maxSize: 3.5, opacity: 1, type: 'grain' };
                            case 'sawdust': return { count: 35, color: '#78350f', minSize: 2.5, maxSize: 7, opacity: 0.95, type: 'flake' };
                            default: return { count: 30, color: '#ccc', minSize: 2, maxSize: 4, opacity: 0.8, type: 'grain' };
                          }
                        };
                        const config = getParticleConfig(selectedSubstance.id);
                        
                        return Array.from({ length: config.count }).map((_, i) => {
                          const size = config.minSize + Math.random() * (config.maxSize - config.minSize);
                          
                          // Group assignment for dynamic mixing
                          const rand = Math.random();
                          let group = 'center';
                          if (rand < 0.3) group = 'outer';
                          else if (rand < 0.6) group = 'bottom';
                          else if (rand < 0.8) group = 'top';

                          // Start slightly off-center for pouring
                          const startX = (Math.random() - 0.5) * 40; 
                          const startY = -100 - Math.random() * 50; 
                          const fallDelay = Math.random() * 0.5;
                          
                          // Final horizontal scatter
                          const xSpread = (Math.random() - 0.5) * 50;
                          
                          let idleY = selectedSubstance.float ? 10 + Math.random() * 5 : 120 + Math.random() * 15;
                          let resolvedY = idleY;
                          
                          if (!selectedSubstance.float && !selectedSubstance.settle && selectedSubstance.type === 'Insoluble') {
                             idleY = 30 + Math.random() * 90;
                             resolvedY = idleY;
                          }
                          
                          let borderRadius = '50%';
                          if (config.type === 'crystal') borderRadius = Math.random() > 0.5 ? '2px' : '1px';
                          else if (config.type === 'flake') borderRadius = '40% 60% 70% 30% / 40% 50% 60% 50%';
                          else if (config.type === 'grain') borderRadius = '30% 70% 70% 30% / 30% 30% 70% 70%';

                          const swirlX = [];
                          const swirlY = [];
                          const swirlScale = [];
                          const steps = 12;
                          // Full seamless loop 0 to 2PI
                          const baseAngle = Math.random() * Math.PI * 2;
                          
                          for(let step=0; step<=steps; step++) {
                            const progress = step / steps;
                            const angle = baseAngle + (progress * Math.PI * 2); 
                            
                            let radius = 15;
                            let yCenter = 70;

                            if (group === 'outer') {
                              radius = 30 + Math.random() * 5;
                              yCenter = 70;
                            } else if (group === 'bottom') {
                              radius = 20;
                              yCenter = 100 - Math.sin(angle) * 10;
                            } else if (group === 'top') {
                              radius = 25;
                              yCenter = 35 + Math.sin(angle) * 10;
                            } else {
                              radius = 10 + Math.random() * 5;
                              yCenter = 70;
                            }

                            // 3D elliptical depth mapping
                            const xPos = Math.cos(angle) * radius;
                            const yPos = yCenter + Math.sin(angle) * (radius * 0.3); // squashed circle
                            const depthScale = 1 + (Math.sin(angle) * 0.2); // larger in front, smaller in back

                            swirlX.push(xPos);
                            swirlY.push(yPos);
                            swirlScale.push(depthScale);
                          }

                          let currentAnimate = {};
                          let currentTransition = {};

                          if (stirState === 'idle') {
                            currentAnimate = { 
                              y: idleY, 
                              x: xSpread,
                              opacity: config.opacity,
                              scale: 1,
                              rotate: Math.random() * 360
                            };
                            currentTransition = { 
                              y: { type: 'spring', damping: 14 + Math.random()*4, stiffness: 40, delay: fallDelay },
                              x: { type: 'spring', damping: 10 + Math.random()*5, stiffness: 35, delay: fallDelay },
                              opacity: { duration: 0.1, delay: fallDelay },
                              rotate: { duration: 2, delay: fallDelay }
                            };
                          } else if (stirState === 'stirring') {
                            currentAnimate = {
                              y: swirlY,
                              x: swirlX,
                              opacity: config.opacity,
                              scale: swirlScale,
                              rotate: Math.random() * 720
                            };
                            currentTransition = {
                              duration: 1.5 + Math.random() * 0.5,
                              ease: "linear",
                              repeat: Infinity,
                              times: Array.from({length: steps+1}).map((_, idx) => idx/steps)
                            };
                          } else if (stirState === 'resolved') {
                            const isSoluble = selectedSubstance.type === 'Soluble';
                            currentAnimate = {
                              y: resolvedY,
                              x: xSpread * (isSoluble ? 1.5 : 1),
                              opacity: isSoluble ? 0 : config.opacity,
                              scale: isSoluble ? 0.2 : 1,
                              rotate: Math.random() * 360
                            };
                            currentTransition = {
                              duration: isSoluble ? 2.0 + Math.random() * 1.0 : 1.5,
                              ease: "easeOut"
                            };
                          }

                          return (
                            <motion.div
                              key={`${selectedSubstance.id}-${i}`}
                              initial={{ y: startY, x: startX, opacity: 0, scale: 0.5 }}
                              animate={currentAnimate}
                              transition={currentTransition}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                width: config.type === 'flake' ? size * 1.8 : size,
                                height: size,
                                backgroundColor: config.color,
                                borderRadius: borderRadius,
                                boxShadow: config.type === 'crystal' ? '0 0 2px rgba(255,255,255,0.6)' : 
                                           config.type === 'powder' ? '0 0 3px rgba(255,255,255,0.7)' : 'none',
                                marginLeft: -size / 2,
                                zIndex: 5
                              }}
                            />
                          );
                        });
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Realistic Glass Stirring Rod */}
              <AnimatePresence>
                {stirState === 'stirring' && (
                  <motion.div
                    initial={{ opacity: 0, y: -80, x: -30, rotate: 30 }}
                    animate={{ 
                      opacity: 1, 
                      x: [-15, 0, 15, 0, -15],
                      y: [0, 15, 0, -5, 0],
                      rotate: [5, 12, 18, 12, 5],
                      scale: [1, 1.05, 1, 0.95, 1] // Creates 3D depth projection cone
                    }}
                    exit={{ opacity: 0, y: -80, x: -30, rotate: 30 }}
                    transition={{ 
                      opacity: { duration: 0.3 },
                      x: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
                      y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
                      rotate: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
                      scale: { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
                    }}
                    style={{ 
                      position: 'absolute', 
                      top: '-30px', 
                      left: '50%',
                      width: '8px', 
                      height: '240px', 
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0.1) 100%)', 
                      borderRadius: '10px', 
                      transformOrigin: 'top center',
                      boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.15), 0 0 6px rgba(255,255,255,0.4)',
                      zIndex: 10
                    }}
                  >
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '14px', background: 'rgba(255,255,255,0.9)', borderRadius: '0 0 10px 10px', boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.2)' }} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Front of glass reflection */}
              <div style={{ position: 'absolute', bottom: 0, width: '160px', height: '200px', borderLeft: '4px solid rgba(255,255,255,0.7)', borderRadius: '0 0 0 16px', pointerEvents: 'none', zIndex: 20 }} />
            </div>

            {selectedSubstance && stirState === 'idle' && (
              <button 
                onClick={handleStir}
                style={{ marginTop: '20px', background: 'var(--accent)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)' }}
              >
                Stir Well
              </button>
            )}

            {!selectedSubstance && (
              <div style={{ marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Select a material to add to the water.
              </div>
            )}
          </div>
        </div>

        {/* Observation Console */}
        <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#431407', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', fontSize: '1.75rem' }}>
            <Camera size={28} color="#d97706" /> Observation Console
          </h4>
          
          <AnimatePresence mode="wait">
            {selectedSubstance && (stirState === 'resolved' || stirState === 'idle') ? (
              <motion.div
                key={selectedSubstance.id + stirState}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#fdfbf7', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e7e5e4', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ color: '#d97706', fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Material</div>
                  <div style={{ fontSize: '1.5rem', color: '#431407', fontWeight: 'bold' }}>{selectedSubstance.name}</div>
                </div>

                {stirState === 'idle' ? (
                  <div style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', border: '1px dashed #d6d3d1' }}>
                    <div style={{ color: '#57534e', fontSize: '1.1rem' }}>Added to water. Click 'Stir Well' to observe what happens.</div>
                  </div>
                ) : (
                  <>
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #d6d3d1', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ color: '#d97706', fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Observation</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 'bold', color: selectedSubstance.type === 'Soluble' ? '#16a34a' : '#ea580c' }}>
                        {selectedSubstance.type === 'Soluble' ? 'Disappears in water' : 'Does not disappear'}
                      </div>
                      <div style={{ color: '#44403c', fontSize: '1.1rem', lineHeight: '1.5' }}>
                        {selectedSubstance.desc}
                      </div>
                    </div>

                    <div style={{ background: selectedSubstance.type === 'Soluble' ? '#f0fdf4' : '#fdfbf7', borderRadius: '12px', padding: '1.5rem', border: `1px solid ${selectedSubstance.type === 'Soluble' ? '#bbf7d0' : '#e7e5e4'}`, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ color: selectedSubstance.type === 'Soluble' ? '#16a34a' : '#d97706', fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Conclusion</div>
                      <div style={{ color: selectedSubstance.type === 'Soluble' ? '#14532d' : '#431407', fontSize: '1.25rem', lineHeight: '1.5', fontWeight: 'bold' }}>
                        {selectedSubstance.conclusion}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ) : selectedSubstance && stirState === 'stirring' ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fdfbf7', borderRadius: '12px', padding: '3rem', border: '1px solid #e7e5e4' }}>
                <StirringProgress />
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: '#78716c', textAlign: 'center', border: '2px dashed #d6d3d1', borderRadius: '12px', padding: '2rem', background: '#fafaf9' }}>
                <div style={{ background: '#fff', padding: '15px', borderRadius: '50%', border: '1px solid #e7e5e4' }}>
                  <Droplets size={40} color="#a8a29e" />
                </div>
                <span style={{ fontSize: '1.1rem' }}>Select a material and stir to observe its solubility.</span>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Footer Progress */}
      <div style={{ background: '#fdfbf7', border: '1px solid #e7e5e4', borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#d97706' }}>
          <div style={{ background: '#fefce8', padding: '8px', borderRadius: '50%' }}>
            <Target size={24} />
          </div>
          <span style={{ color: '#431407', fontSize: '1.15rem', fontWeight: 'bold' }}>Test all 5 materials to see if they are soluble or insoluble.</span>
        </div>
      </div>

    </div>
  );
}
