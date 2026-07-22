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
      icon: <EyeOff size={24} color="#dc2626" />,
      desc: 'The suspect is completely hidden behind the solid brick wall. No light passes through.',
      conclusion: 'Materials through which you cannot see at all are Opaque.',
      renderScene: () => (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#64748b', overflow: 'hidden' }}>
          {/* Brick Wall foreground */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'linear-gradient(335deg, #b91c1c 23px, transparent 23px), linear-gradient(155deg, #dc2626 23px, transparent 23px), linear-gradient(335deg, #b91c1c 23px, transparent 23px), linear-gradient(155deg, #dc2626 23px, transparent 23px)',
            backgroundSize: '58px 58px',
            backgroundColor: '#991b1b',
            backgroundPosition: '0px 2px, 4px 35px, 29px 31px, 34px 6px',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)'
          }} />
          {/* Grass at bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30px', background: '#22c55e', zIndex: 11, borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }} />
        </div>
      )
    },
    {
      id: 'frosted',
      name: 'Frosted Glass Door',
      type: 'Translucent',
      view: 'Blurry View',
      icon: <ShieldAlert size={24} color="#ca8a04" />,
      desc: 'You can see a blurry silhouette of the suspect. Some light passes through, but not enough for a clear image.',
      conclusion: 'Materials through which objects can be seen, but not clearly, are Translucent.',
      renderScene: () => (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Room Background */}
          <div style={{ position: 'absolute', inset: 0, background: '#e2e8f0' }} />
          {/* Suspect Silhouette */}
          <User size={140} color="#64748b" style={{ zIndex: 1 }} />
          {/* Frosted Glass overlay */}
          <div style={{
            position: 'absolute', inset: 15, zIndex: 10,
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.7)',
            border: '12px solid #94a3b8',
            borderRadius: '4px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }} />
          <div style={{ position: 'absolute', right: '35px', top: '50%', width: '8px', height: '50px', background: '#cbd5e1', borderRadius: '4px', zIndex: 11 }} />
        </div>
      )
    },
    {
      id: 'tree',
      name: 'Big Tree',
      type: 'Opaque',
      view: 'No View',
      icon: <EyeOff size={24} color="#dc2626" />,
      desc: 'The suspect is hiding behind a thick wooden tree trunk. Wood blocks all light from passing through.',
      conclusion: 'Wood is an Opaque material.',
      renderScene: () => (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#e0f2fe', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
          {/* Sky and clouds */}
          <div style={{ position: 'absolute', top: '10%', left: '20%', width: '60px', height: '20px', background: 'white', borderRadius: '20px', filter: 'opacity(0.8)' }} />
          <div style={{ position: 'absolute', top: '15%', right: '15%', width: '80px', height: '25px', background: 'white', borderRadius: '20px', filter: 'opacity(0.8)' }} />
          {/* Hills */}
          <div style={{ position: 'absolute', bottom: '20px', left: '-10%', right: '-10%', height: '100px', background: '#86efac', borderRadius: '50% 50% 0 0' }} />
          <div style={{ position: 'absolute', bottom: '0', left: 0, right: 0, height: '40px', background: '#4ade80' }} />
          
          {/* Suspect Silhouette */}
          <User size={120} color="#1e293b" style={{ zIndex: 2, marginBottom: '30px' }} />
          
          {/* Tree Trunk */}
          <div style={{
            position: 'absolute', bottom: 0, width: '120px', height: '80%', zIndex: 10,
            background: 'linear-gradient(to right, #78350f, #b45309, #78350f)'
          }} />
          {/* Leaves */}
          <div style={{ position: 'absolute', top: '-10px', width: '220px', height: '140px', background: '#15803d', borderRadius: '50%', zIndex: 11, boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.2)' }} />
          <div style={{ position: 'absolute', top: '30px', left: '10%', width: '120px', height: '100px', background: '#16a34a', borderRadius: '50%', zIndex: 11 }} />
        </div>
      )
    },
    {
      id: 'window',
      name: 'Clear Glass Window',
      type: 'Transparent',
      view: 'Clear View',
      icon: <Eye size={24} color="#16a34a" />,
      desc: 'You have a perfect view of the suspect through the window. Light passes through completely.',
      conclusion: 'Materials through which things can be seen clearly are Transparent.',
      renderScene: () => (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#fffbeb', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
          {/* Room Background */}
          <div style={{ position: 'absolute', inset: 0, background: '#fef3c7' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: '#fde68a' }} /> {/* Floor */}
          {/* Suspect */}
          <User size={130} color="#0f172a" style={{ zIndex: 1, marginBottom: '20px' }} />
          {/* Clear Glass overlay (Frame only) */}
          <div style={{
            position: 'absolute', inset: 15, zIndex: 10,
            background: 'rgba(255, 255, 255, 0.1)',
            border: '14px solid #ffffff',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }} />
          {/* Window mullions */}
          <div style={{ position: 'absolute', top: 15, bottom: 15, left: '50%', width: '12px', background: '#ffffff', zIndex: 11 }} />
          <div style={{ position: 'absolute', left: 15, right: 15, top: '50%', height: '12px', background: '#ffffff', zIndex: 11 }} />
        </div>
      )
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
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: '100%', color: '#1e293b' }}>
      
      {/* Header */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Search size={24} color="#4f46e5" /> Phase 1: Surveillance Simulator
          </h3>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569' }}>
            Chief Blake is running a surveillance simulation! Click on each location to see if the suspect is visible through the material.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 15px', position: 'relative' }}>
            <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: '500' }}>Observe carefully, detective!</div>
            <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: '500' }}>Not all materials reveal the truth.</div>
            {/* Speech bubble arrow */}
            <div style={{ position: 'absolute', right: '-8px', top: '20px', width: '16px', height: '16px', background: '#f8fafc', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', transform: 'rotate(-45deg)' }} />
          </div>
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
                  border: isSelected ? '4px solid #4f46e5' : '2px solid #cbd5e1',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  background: 'white',
                  boxShadow: isSelected ? '0 0 20px rgba(79, 70, 229, 0.3)' : '0 4px 6px rgba(0,0,0,0.05)',
                  transition: 'border 0.2s, box-shadow 0.2s'
                }}
                whileHover={{ scale: 1.02, zIndex: 5, boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)' }}
              >
                {spot.renderScene()}
                
                {/* Overlay Label */}
                <div style={{ position: 'absolute', top: '15px', left: '15px', background: '#1e3a8a', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 20, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  <div style={{ background: '#3b82f6', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 'var(--text-xs)' }}>{index + 1}</div>
                  {spot.name}
                </div>

                {/* Glowing Magnifying Glass (hidden when selected so they can see the view clearly) */}
                {!isSelected && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(6px)', border: '2px solid rgba(255,255,255,0.8)', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, pointerEvents: 'none', boxShadow: '0 0 20px rgba(255,255,255,0.6)' }}>
                    <Search size={28} color="#ffffff" style={{ filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.3))' }} />
                  </div>
                )}

                {observations[spot.id] && (
                  <div style={{ position: 'absolute', bottom: '15px', right: '15px', background: '#16a34a', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', zIndex: 20 }}>
                    Observed
                  </div>
                )}
              </motion.div>
            );
          })}
          
        </div>

        {/* Observation Console */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', fontSize: '1.1rem' }}>
              <Camera size={20} color="#4f46e5" /> Observation Console
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
                    <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Target Location</div>
                    <div style={{ fontSize: '1.2rem', color: '#1e3a8a', fontWeight: 'bold' }}>{selectedSpot.name}</div>
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Visibility</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a' }}>
                      {selectedSpot.icon} {selectedSpot.view}
                    </div>
                    <div style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      {selectedSpot.desc}
                    </div>
                  </div>

                  <div style={{ background: '#f0fdfa', borderRadius: '12px', padding: '1rem', border: '1px solid #ccfbf1', marginTop: 'auto' }}>
                    <div style={{ color: '#0d9488', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Conclusion</div>
                    <div style={{ color: '#115e59', fontSize: '1rem', lineHeight: '1.5', fontWeight: 'bold' }}>
                      {selectedSpot.conclusion}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: '#94a3b8', textAlign: 'center', border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '2rem' }}>
                  <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '50%' }}>
                    <Camera size={40} color="#cbd5e1" />
                  </div>
                  <span style={{ fontSize: '0.95rem' }}>Select a location on the left to begin observation.</span>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <div style={{ color: '#1e3a8a', fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>What does this mean?</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#f0fdf4', padding: '6px', borderRadius: '50%', color: '#16a34a' }}><Eye size={18} /></div>
                <span style={{ color: '#334155', fontSize: '0.95rem' }}><strong style={{ color: '#16a34a' }}>Clear View:</strong> Suspect is visible clearly.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#fefce8', padding: '6px', borderRadius: '50%', color: '#ca8a04' }}><ShieldAlert size={18} /></div>
                <span style={{ color: '#334155', fontSize: '0.95rem' }}><strong style={{ color: '#ca8a04' }}>Blurry View:</strong> Suspect is visible but not clearly.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#fef2f2', padding: '6px', borderRadius: '50%', color: '#dc2626' }}><EyeOff size={18} /></div>
                <span style={{ color: '#334155', fontSize: '0.95rem' }}><strong style={{ color: '#dc2626' }}>No View:</strong> Suspect is not visible at all.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Progress */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#d97706' }}>
          <div style={{ background: '#fefce8', padding: '8px', borderRadius: '50%' }}>
            <Target size={20} />
          </div>
          <span style={{ color: '#475569', fontSize: '1rem' }}>Click on each location (1-4) to check if the suspect is visible through the material.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '8px 16px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <img src="/images/chief_detective_blake.png" alt="Hat" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            Observations: <span style={{ color: isComplete ? '#16a34a' : '#1e3a8a', fontSize: '1.1rem' }}>{obsCount} / 4</span>
          </div>
        </div>
      </div>

    </div>
  );
}
