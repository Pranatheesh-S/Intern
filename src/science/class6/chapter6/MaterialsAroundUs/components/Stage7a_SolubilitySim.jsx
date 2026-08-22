import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, Search, Droplets, Target, Camera } from 'lucide-react';

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
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Search size={24} color="var(--accent)" /> Phase 1: Solubility Simulator
          </h3>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Activity 6.7: Let us explore how different materials behave when we mix them in water.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 15px', position: 'relative' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '500' }}>Does everything dissolve?</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '500' }}>Add to water, then stir!</div>
            <div style={{ position: 'absolute', right: '-8px', top: '20px', width: '16px', height: '16px', background: 'var(--surface)', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', transform: 'rotate(-45deg)' }} />
          </div>
          <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        
        {/* Main Lab Area */}
        <div style={{ flex: 1.8, background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
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
                    <div style={{ position: 'relative' }}>
                      <div style={{ background: 'var(--surface)', borderRadius: '50%', padding: '5px', border: '1px solid var(--border)' }}>
                        <img src={sub.image} alt={sub.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '50%', mixBlendMode: 'multiply' }} />
                      </div>
                      {isObserved && (
                        <div style={{ position: 'absolute', top: -5, right: -5, background: '#16a34a', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>✓</div>
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
                background: stirState === 'resolved' && selectedSubstance?.waterColor !== 'var(--accent)' 
                  ? selectedSubstance.waterColor 
                  : 'linear-gradient(180deg, rgba(56,189,248,0.3) 0%, rgba(14,165,233,0.6) 100%)', 
                opacity: stirState === 'resolved' && selectedSubstance?.turbidity ? 0.9 : 1,
                borderRadius: '0 0 14px 14px',
                transition: 'all 1s ease-in-out',
                overflow: 'hidden'
              }}>
                {/* Floating solid */}
                {stirState === 'resolved' && selectedSubstance?.solidVisible && selectedSubstance?.float && (
                  <div style={{ position: 'absolute', top: 0, left: '50%', marginLeft: '-32px' }}>
                    <img src={selectedSubstance.image} alt="floating" style={{ width: '64px', height: '64px', mixBlendMode: 'multiply', opacity: 0.8 }} />
                  </div>
                )}
                {/* Settled solid */}
                {stirState === 'resolved' && selectedSubstance?.solidVisible && selectedSubstance?.settle && (
                  <div style={{ position: 'absolute', bottom: -10, left: '50%', marginLeft: '-40px' }}>
                    <img src={selectedSubstance.image} alt="settled" style={{ width: '80px', height: '80px', mixBlendMode: 'multiply', opacity: 0.9, transform: 'scaleY(0.5)' }} />
                  </div>
                )}
                {/* Turbid solid particles */}
                {stirState === 'resolved' && selectedSubstance?.solidVisible && !selectedSubstance?.float && !selectedSubstance?.settle && (
                  <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle, ${selectedSubstance.solidColor} 2px, transparent 2px)`, backgroundSize: '10px 10px', opacity: 0.5 }} />
                )}
                
                {/* Unstirred solid falling in */}
                <AnimatePresence>
                  {stirState === 'idle' && selectedSubstance && (
                    <motion.div
                      initial={{ y: -100, opacity: 0, rotate: -20 }}
                      animate={{ y: selectedSubstance.float ? 0 : 80, opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: 'spring', damping: 12 }}
                      style={{ position: 'absolute', left: '50%', marginLeft: '-32px' }}
                    >
                      <img src={selectedSubstance.image} alt="dropped" style={{ width: '64px', height: '64px', mixBlendMode: 'multiply', opacity: 0.9 }} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Whirlpool effect */}
                <AnimatePresence>
                  {stirState === 'stirring' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 0.6, scale: 1, rotate: 720 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 1.5 }}
                      style={{ position: 'absolute', top: '10px', bottom: '10px', left: '20px', right: '20px', borderRadius: '50%', border: '4px dashed rgba(255,255,255,0.7)', borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Spoon */}
              <AnimatePresence>
                {stirState === 'stirring' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1, 
                      rotate: [-10, 10, -10],
                      x: [-10, 10, -10]
                    }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    style={{ position: 'absolute', top: '10px', width: '8px', height: '200px', background: 'linear-gradient(to right, var(--border), var(--text-muted))', borderRadius: '4px', transformOrigin: 'top center' }}
                  >
                    <div style={{ position: 'absolute', bottom: 0, left: '-8px', width: '24px', height: '30px', background: 'var(--text-muted)', borderRadius: '50% 50% 12px 12px' }} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Front of glass reflection */}
              <div style={{ position: 'absolute', bottom: 0, width: '160px', height: '200px', borderLeft: '4px solid rgba(255,255,255,0.7)', borderRadius: '0 0 0 16px', pointerEvents: 'none' }} />
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
        <div style={{ flex: 1, background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', fontSize: '1.1rem' }}>
            <Camera size={20} color="var(--accent)" /> Observation Console
          </h4>
          
          <AnimatePresence mode="wait">
            {selectedSubstance && (stirState === 'resolved' || stirState === 'idle') ? (
              <motion.div
                key={selectedSubstance.id + stirState}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Material</div>
                  <div style={{ fontSize: '1.2rem', color: 'var(--text-heading)', fontWeight: 'bold' }}>{selectedSubstance.name}</div>
                </div>

                {stirState === 'idle' ? (
                  <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '1rem', border: '1px dashed var(--border)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Added to water. Click 'Stir Well' to observe what happens.</div>
                  </div>
                ) : (
                  <>
                    <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Observation</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: 'bold', color: selectedSubstance.type === 'Soluble' ? '#16a34a' : '#dc2626' }}>
                        {selectedSubstance.type === 'Soluble' ? 'Disappears in water' : 'Does not disappear'}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                        {selectedSubstance.desc}
                      </div>
                    </div>

                    <div style={{ background: selectedSubstance.type === 'Soluble' ? '#f0fdf4' : '#fef2f2', borderRadius: '12px', padding: '1rem', border: `1px solid ${selectedSubstance.type === 'Soluble' ? '#bbf7d0' : '#fecaca'}`, marginTop: 'auto' }}>
                      <div style={{ color: selectedSubstance.type === 'Soluble' ? '#0d9488' : '#b91c1c', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Conclusion</div>
                      <div style={{ color: selectedSubstance.type === 'Soluble' ? '#115e59' : '#991b1b', fontSize: '1rem', lineHeight: '1.5', fontWeight: 'bold' }}>
                        {selectedSubstance.conclusion}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ) : selectedSubstance && stirState === 'stirring' ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 'bold' }}>
                Stirring...
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text-muted)', textAlign: 'center', border: '2px dashed var(--border)', borderRadius: '12px', padding: '2rem' }}>
                <div style={{ background: 'var(--surface)', padding: '15px', borderRadius: '50%' }}>
                  <Droplets size={40} color="var(--border)" />
                </div>
                <span style={{ fontSize: '0.95rem' }}>Select a material and stir to observe its solubility.</span>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Footer Progress */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#d97706' }}>
          <div style={{ background: '#fefce8', padding: '8px', borderRadius: '50%' }}>
            <Target size={20} />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Test all 5 materials to see if they are soluble or insoluble.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface)', padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <img src="/images/chief_detective_blake.png" alt="Hat" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            Tested: <span style={{ color: isComplete ? '#16a34a' : 'var(--text-heading)', fontSize: '1.1rem' }}>{obsCount} / 5</span>
          </div>
        </div>
      </div>

    </div>
  );
}
