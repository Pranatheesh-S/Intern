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
      icon: <EyeOff size={24} color="#ef4444" />,
      desc: 'The suspect is completely hidden behind the solid brick wall. No light passes through.',
      conclusion: 'Materials through which you cannot see at all are Opaque.',
      renderScene: () => (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#1e293b' }}>
          {/* Brick Wall foreground blocking everything */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'linear-gradient(335deg, #7f1d1d 23px, transparent 23px), linear-gradient(155deg, #991b1b 23px, transparent 23px), linear-gradient(335deg, #7f1d1d 23px, transparent 23px), linear-gradient(155deg, #991b1b 23px, transparent 23px)',
            backgroundSize: '58px 58px',
            backgroundColor: '#450a0a',
            backgroundPosition: '0px 2px, 4px 35px, 29px 31px, 34px 6px',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
          }} />
        </div>
      )
    },
    {
      id: 'frosted',
      name: 'Frosted Glass Door',
      type: 'Translucent',
      view: 'Blurry View',
      icon: <ShieldAlert size={24} color="#eab308" />,
      desc: 'You can see a blurry silhouette of the suspect. Some light passes through, but not enough for a clear image.',
      conclusion: 'Materials through which objects can be seen, but not clearly, are Translucent.',
      renderScene: () => (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Room Background */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #fef3c7 0%, #d97706 100%)' }} />
          {/* Suspect Silhouette */}
          <User size={120} color="#1c1917" style={{ zIndex: 1 }} />
          {/* Frosted Glass overlay */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            backdropFilter: 'blur(12px)',
            background: 'rgba(255, 255, 255, 0.4)',
            border: '8px solid #94a3b8',
            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.5)'
          }} />
          <div style={{ position: 'absolute', right: '15px', top: '50%', width: '10px', height: '40px', background: '#cbd5e1', borderRadius: '4px', zIndex: 11 }} />
        </div>
      )
    },
    {
      id: 'tree',
      name: 'Big Tree',
      type: 'Opaque',
      view: 'No View',
      icon: <EyeOff size={24} color="#ef4444" />,
      desc: 'The suspect is hiding behind a thick wooden tree trunk. Wood blocks all light from passing through.',
      conclusion: 'Wood is an Opaque material.',
      renderScene: () => (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#020617', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
          {/* Night Outdoor Background */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #0f172a, #064e3b)' }} />
          {/* Suspect Silhouette */}
          <User size={120} color="#000000" style={{ zIndex: 1, marginBottom: '20px' }} />
          {/* Tree Trunk overlay */}
          <div style={{
            position: 'absolute', bottom: 0, width: '140px', height: '100%', zIndex: 10,
            background: 'linear-gradient(to right, #451a03, #78350f, #451a03)',
            borderTopLeftRadius: '20px', borderTopRightRadius: '20px',
            boxShadow: '0 0 30px rgba(0,0,0,0.8)'
          }} />
          {/* Leaves */}
          <div style={{ position: 'absolute', top: '-20px', width: '200px', height: '100px', background: '#064e3b', borderRadius: '50%', zIndex: 11, filter: 'blur(5px)' }} />
        </div>
      )
    },
    {
      id: 'window',
      name: 'Clear Glass Window',
      type: 'Transparent',
      view: 'Clear View',
      icon: <Eye size={24} color="#22c55e" />,
      desc: 'You have a perfect view of the suspect through the window. Light passes through completely.',
      conclusion: 'Materials through which things can be seen clearly are Transparent.',
      renderScene: () => (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Room Background */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #fef08a 0%, #ca8a04 100%)' }} />
          {/* Suspect Silhouette */}
          <User size={120} color="#1c1917" style={{ zIndex: 1 }} />
          {/* Clear Glass overlay (Frame only) */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'rgba(255, 255, 255, 0.1)',
            border: '12px solid #334155',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
          }} />
          {/* Window mullions */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '8px', background: '#334155', zIndex: 11 }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '8px', background: '#334155', zIndex: 11 }} />
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

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: '100%', color: '#1e293b' }}>
      
      {/* Header */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Search size={24} color="#3b82f6" /> Phase 1: Surveillance Simulator
          </h3>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569' }}>
            Chief Blake is running a surveillance simulation! Click on each location to see if the suspect is visible through the material.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Observe carefully, detective!</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Not all materials reveal the truth.</div>
          </div>
          <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: 0 }}>
        
        {/* Main Surveillance Scene (2x2 Grid) */}
        <div style={{ flex: 2, background: '#e2e8f0', borderRadius: '16px', border: '4px solid #cbd5e1', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', position: 'relative' }}>
          
          {spots.map((spot, index) => (
            <motion.div
              key={spot.id}
              layoutId={`spot-${spot.id}`}
              onClick={() => handleSpotClick(spot)}
              style={{
                position: 'relative',
                borderRight: index % 2 === 0 ? '4px solid #cbd5e1' : 'none',
                borderBottom: index < 2 ? '4px solid #cbd5e1' : 'none',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
              whileHover={{ scale: 1.02, zIndex: 5, boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
            >
              {spot.renderScene()}
              
              {/* Overlay Label & Magnifying Glass */}
              <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #3b82f6', color: '#1e293b', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 20 }}>
                <div style={{ background: '#3b82f6', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>{index + 1}</div>
                {spot.name}
              </div>

              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(4px)', border: '2px solid #3b82f6', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, pointerEvents: 'none', boxShadow: '0 0 15px rgba(59,130,246,0.3)' }}>
                <Search size={30} color="#3b82f6" />
              </div>

              {observations[spot.id] && (
                <div style={{ position: 'absolute', bottom: '15px', right: '15px', background: '#22c55e', color: 'white', padding: '4px 8px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', zIndex: 20 }}>
                  Observed
                </div>
              )}
            </motion.div>
          ))}
          
        </div>

        {/* Observation Console */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <Camera size={20} color="#64748b" /> Observation Console
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
                  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Target Location</div>
                    <div style={{ fontSize: '1.2rem', color: '#2563eb', fontWeight: 'bold' }}>{selectedSpot.name}</div>
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Visibility</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>
                      {selectedSpot.icon} {selectedSpot.view}
                    </div>
                    <div style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      {selectedSpot.desc}
                    </div>
                  </div>

                  <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '1rem', border: '1px solid #bfdbfe', marginTop: 'auto' }}>
                    <div style={{ color: '#2563eb', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Conclusion</div>
                    <div style={{ color: '#1e3a8a', fontSize: '1rem', lineHeight: '1.5', fontWeight: 'bold' }}>
                      {selectedSpot.conclusion}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: '#94a3b8', textAlign: 'center' }}>
                  <Camera size={48} opacity={0.3} />
                  <span>Select a location on the left to begin observation.</span>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
            <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>What does this mean?</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Eye size={18} color="#16a34a" />
                <span style={{ color: '#334155', fontSize: '0.9rem' }}><strong>Clear View:</strong> Suspect is visible clearly.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={18} color="#d97706" />
                <span style={{ color: '#334155', fontSize: '0.9rem' }}><strong>Blurry View:</strong> Suspect is visible but not clearly.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <EyeOff size={18} color="#dc2626" />
                <span style={{ color: '#334155', fontSize: '0.9rem' }}><strong>No View:</strong> Suspect is not visible at all.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Progress */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#d97706' }}>
          <Target size={20} />
          <span style={{ color: '#475569', fontSize: '0.95rem' }}>Click on each location (1-4) to check if the suspect is visible through the material.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontWeight: 'bold', color: '#1e293b' }}>
            Observations: <span style={{ color: isComplete ? '#16a34a' : '#2563eb' }}>{obsCount} / 4</span>
          </div>
          {isComplete && (
            <button onClick={onComplete} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Proceed to Phase 2
            </button>
          )}
        </div>
      </div>

      {/* Zoomed Overlay */}
      <AnimatePresence>
        {selectedSpot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(2, 6, 23, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
            onClick={() => setSelectedSpot(null)}
          >
            <motion.div
              layoutId={`spot-${selectedSpot.id}`}
              style={{ width: '80%', height: '80%', borderRadius: '24px', overflow: 'hidden', position: 'relative', border: '4px solid #3b82f6', boxShadow: '0 0 50px rgba(59, 130, 246, 0.5)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedSpot.renderScene()}
              
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', padding: '40px 20px 20px', zIndex: 50, color: 'white', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {selectedSpot.icon} {selectedSpot.view}
                </div>
                <div style={{ fontSize: '1.1rem', color: '#cbd5e1' }}>{selectedSpot.desc}</div>
                <button 
                  onClick={() => setSelectedSpot(null)}
                  style={{ alignSelf: 'flex-start', background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}
                >
                  Close Observation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
