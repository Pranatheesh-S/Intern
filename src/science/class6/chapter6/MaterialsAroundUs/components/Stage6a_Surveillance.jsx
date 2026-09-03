import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, ShieldAlert, EyeOff, User, Target, Camera } from 'lucide-react';

export default function Stage6a_Surveillance({ onComplete, addXp }) {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [observations, setObservations] = useState({});

  const spots = [
    {
      id: 'wall',
      name: 'Behind a Wall',
      type: 'Opaque',
      view: 'No View',
      icon: <EyeOff size={24} color="var(--lesson-danger)" />,
      desc: 'The suspect is completely hidden behind the solid brick wall. No light passes through.',
      conclusion: 'Materials through which you cannot see at all are Opaque.',
      image: '/images/surveillance_wall.png'
    },
    {
      id: 'frosted',
      name: 'Frosted Glass Door',
      type: 'Translucent',
      view: 'Blurry View',
      icon: <ShieldAlert size={24} color="#ca8a04" />,
      desc: 'You can see a blurry silhouette of the suspect. Some light passes through, but not enough for a clear image.',
      conclusion: 'Materials through which objects can be seen, but not clearly, are Translucent.',
      image: '/images/surveillance_frosted.png'
    },
    {
      id: 'tree',
      name: 'Big Tree',
      type: 'Opaque',
      view: 'No View',
      icon: <EyeOff size={24} color="var(--lesson-danger)" />,
      desc: 'The suspect is hiding behind a thick wooden tree trunk. Wood blocks all light from passing through.',
      conclusion: 'Wood is an Opaque material.',
      image: '/images/surveillance_tree.png'
    },
    {
      id: 'window',
      name: 'Clear Glass Window',
      type: 'Transparent',
      view: 'Clear View',
      icon: <Eye size={24} color="var(--lesson-success)" />,
      desc: 'You have a perfect view of the suspect through the window. Light passes through completely.',
      conclusion: 'Materials through which things can be seen clearly are Transparent.',
      image: '/images/surveillance_window.png'
    }
  ];

  const handleSpotClick = (spot) => {
    setSelectedSpot(spot);
    if (!observations[spot.id]) {
      setObservations(prev => ({ ...prev, [spot.id]: true }));
      addXp(15);
    }
  };

  const obsCount = Object.keys(observations).length;
  const isComplete = obsCount === spots.length;

  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: '100%', color: 'var(--lesson-text)' }}>
      
      {/* Header */}
      <div style={{ background: 'var(--lesson-surface)', border: '1px solid var(--lesson-border)', borderRadius: '16px', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Search size={24} color="var(--accent)" /> Phase 1: Surveillance Simulator
          </h3>
          <p style={{ margin: 0, fontSize: '1.15rem', color: 'var(--heading-sub)' }}>
            Chief Blake is running a surveillance simulation! Click on each location to see if the suspect is visible through the material.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        
        {/* Main Surveillance Scene (2x2 Grid of CSS Cards) */}
        <div style={{ flex: 1.8, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '12px' }}>
          
          {spots.map((spot, index) => {
            const isSelected = selectedSpot?.id === spot.id;
            
            return (
              <motion.div
                key={spot.id}
                onClick={() => handleSpotClick(spot)}
                style={{
                  position: 'relative',
                  borderRadius: '16px',
                  border: isSelected ? '4px solid var(--lesson-accent)' : '2px solid var(--lesson-border)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  background: 'white',
                  boxShadow: isSelected ? '0 0 20px rgba(79, 70, 229, 0.3)' : '0 4px 6px rgba(0,0,0,0.05)',
                  transition: 'border 0.2s, box-shadow 0.2s'
                }}
                whileHover={{ scale: 1.02, zIndex: 5, boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)' }}
              >
                {/* Scene Content */}
                <AnimatePresence mode="wait">
                  {!observations[spot.id] ? (
                    <motion.div 
                      key="unobserved"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ width: '100%', height: '100%', backgroundColor: 'var(--lesson-text)', backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <svg width="80" height="80" viewBox="0 0 100 100">
                        <defs>
                          <radialGradient id="glassGrad" cx="30%" cy="30%" r="70%">
                            <stop offset="0%" stopColor="var(--lesson-surface)" />
                            <stop offset="100%" stopColor="var(--lesson-surface)" />
                          </radialGradient>
                        </defs>
                        <circle cx="60" cy="40" r="30" fill="url(#glassGrad)" stroke="var(--lesson-border)" strokeWidth="6" filter="drop-shadow(0 0 10px rgba(56,189,248,0.3))" />
                        <line x1="38" y1="62" x2="15" y2="85" stroke="var(--lesson-text)" strokeWidth="12" strokeLinecap="round" />
                        <line x1="38" y1="62" x2="25" y2="75" stroke="var(--lesson-muted)" strokeWidth="12" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="observed"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <img src={spot.image} alt={spot.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Overlay Label */}
                <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--text-heading)', color: 'white', padding: '8px 16px', borderRadius: '24px', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  <div style={{ background: 'var(--accent)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.9rem' }}>{index + 1}</div>
                  {!observations[spot.id] ? 'Unknown Target' : spot.name}
                </div>



                {observations[spot.id] && (
                  <div style={{ position: 'absolute', bottom: '15px', right: '15px', background: '#16a34a', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', zIndex: 20 }}>
                    Observed
                  </div>
                )}
              </motion.div>
            );
          })}
          
        </div>

        {/* Observation Console */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', fontSize: '1.3rem' }}>
              <Camera size={22} color="var(--accent)" /> Observation Console
            </h4>
            
            <AnimatePresence mode="wait">
              {selectedSpot ? (
                <motion.div
                  key={selectedSpot.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Target Location</div>
                    <div style={{ fontSize: '1.5rem', color: 'var(--text-heading)', fontWeight: 'bold' }}>{selectedSpot.name}</div>
                  </div>

                  <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '1.25rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Visibility</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.35rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                      {selectedSpot.icon} {selectedSpot.view}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: '1.5' }}>
                      {selectedSpot.desc}
                    </div>
                  </div>

                  <div style={{ background: '#f0fdfa', borderRadius: '12px', padding: '1.25rem', border: '1px solid #ccfbf1', marginTop: 'auto' }}>
                    <div style={{ color: '#0d9488', fontSize: '1.05rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Conclusion</div>
                    <div style={{ color: '#115e59', fontSize: '1.25rem', lineHeight: '1.5', fontWeight: 'bold' }}>
                      {selectedSpot.conclusion}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--lesson-muted)', textAlign: 'center', border: '2px dashed var(--lesson-border)', borderRadius: '12px', padding: '2rem' }}>
                  <div style={{ background: 'var(--lesson-surface)', padding: '15px', borderRadius: '50%' }}>
                    <Camera size={40} color="var(--lesson-border)" />
                  </div>
                  <span style={{ fontSize: '1.15rem' }}>Select a location on the left to begin observation.</span>
                </div>
              )}
            </AnimatePresence>
          </div>



        </div>

      </div>

      {/* Footer Progress */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#d97706' }}>
          <div style={{ background: '#fefce8', padding: '8px', borderRadius: '50%' }}>
            <Target size={22} />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>Click on each location (1-4) to check if the suspect is visible through the material.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface)', padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)', fontSize: '1.1rem' }}>
            <img src="/images/chief_detective_blake.png" alt="Hat" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
            Observations: <span style={{ color: isComplete ? '#16a34a' : 'var(--text-heading)', fontSize: '1.25rem' }}>{obsCount} / 4</span>
          </div>
        </div>
      </div>

    </div>
  );
}
