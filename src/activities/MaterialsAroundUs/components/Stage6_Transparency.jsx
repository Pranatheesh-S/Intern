import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ShieldAlert, Check, RefreshCw } from 'lucide-react';

export default function Stage6_Transparency({ onComplete, addXp }) {
  // Hide & Seek game state
  const [selectedHidingSpot, setSelectedHidingSpot] = useState(null);
  
  // Classification Table state
  const [classifications, setClassifications] = useState({}); // { eraser: 'opaque', etc }

  const hidingSpots = [
    { 
      id: 'wall', 
      name: 'Brick Wall', 
      type: 'Opaque', 
      seekerDialog: 'Where are you? I cannot see you at all! A brick wall does not allow any light to pass through.',
      description: 'Materials through which we cannot see are called Opaque.' 
    },
    { 
      id: 'frosted', 
      name: 'Frosted Glass Door', 
      type: 'Translucent', 
      seekerDialog: 'Ah, I see a blurry outline of your classmate! I can see through, but not clearly. Frosted glass lets some light pass.',
      description: 'Materials through which objects can be seen, but not clearly, are called Translucent.' 
    },
    { 
      id: 'window', 
      name: 'Clear Glass Window', 
      type: 'Transparent', 
      seekerDialog: 'Aha! I see you smiling clearly! Glass allows light to pass through completely, making it perfectly clear.',
      description: 'Materials through which things can be seen clearly are called Transparent.' 
    }
  ];

  const objectsToClassify = [
    { id: 'tumbler', name: 'Glass Tumbler', correct: 'Transparent' },
    { id: 'butter', name: 'Butter Paper', correct: 'Translucent' },
    { id: 'eraser', name: 'Eraser', correct: 'Opaque' },
    { id: 'frosted_glass', name: 'Frosted Glass', correct: 'Translucent' },
    { id: 'wood', name: 'Wooden Board', correct: 'Opaque' },
    { id: 'window_glass', name: 'Window Glass', correct: 'Transparent' }
  ];

  const handleClassify = (id, category) => {
    setClassifications(prev => ({ ...prev, [id]: category }));
    const obj = objectsToClassify.find(o => o.id === id);
    if (obj.correct === category) {
      addXp(5);
    }
  };

  const handleSpotClick = (spot) => {
    setSelectedHidingSpot(spot);
    addXp(10);
  };

  const resetStage = () => {
    setSelectedHidingSpot(null);
    setClassifications({});
  };

  const correctClassificationsCount = objectsToClassify.filter(o => classifications[o.id] === o.correct).length;
  const classificationComplete = correctClassificationsCount === objectsToClassify.length;

  const isComplete = selectedHidingSpot !== null && classificationComplete;

  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Intro */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Eye size={22} style={{ color: 'var(--accent)' }} /> 6.3.3 & Activity 6.6: Hide & Seek Transparency Yard
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          How much light can pass through a substance? 
          We group materials into <strong>Transparent</strong>, <strong>Translucent</strong>, and <strong>Opaque</strong> depending on their visibility.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.5rem' }}>
        {/* Interactive Yard */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>1. Hide & Seek Yard (Click to reveal visibility)</span>
            <button onClick={resetStage} className="outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', gap: '0.4rem' }}>
              <RefreshCw size={14} /> Reset Lab
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flex: 1, minHeight: '180px' }}>
            {hidingSpots.map((spot) => (
              <button
                key={spot.id}
                onClick={() => handleSpotClick(spot)}
                className="outline"
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  padding: '1rem',
                  background: 'var(--surface)',
                  borderRadius: '12px',
                  border: selectedHidingSpot?.id === spot.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '140px'
                }}
              >
                {spot.id === 'wall' ? (
                  <EyeOff size={40} style={{ color: 'var(--danger)' }} />
                ) : spot.id === 'frosted' ? (
                  <ShieldAlert size={40} style={{ color: 'var(--warning)' }} />
                ) : (
                  <Eye size={40} style={{ color: 'var(--success)' }} />
                )}
                <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{spot.name}</span>
                <span style={{ fontSize: '0.9rem', background: 'var(--card-bg)', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
                  {spot.type}
                </span>
              </button>
            ))}
          </div>

          {/* Dialogue display */}
          <div style={{ minHeight: '80px', background: 'var(--surface)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {selectedHidingSpot ? (
              <>
                <strong style={{ fontSize: '1rem', color: 'var(--text-heading)' }}>
                  Spot Type: {selectedHidingSpot.type}
                </strong>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  {selectedHidingSpot.seekerDialog} <br/><br/>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{selectedHidingSpot.description}</span>
                </p>
              </>
            ) : (
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)', display: 'block', textAlign: 'center', marginTop: '1.5rem' }}>
                Click a hiding spot to check the seeker's visibility through the material!
              </span>
            )}
          </div>
        </div>

        {/* Classification Table */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>2. Activity 6.6 Classifier</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto' }}>
            {objectsToClassify.map((obj) => {
              const isSelected = classifications[obj.id] !== undefined;
              const isCorrect = classifications[obj.id] === obj.correct;
              return (
                <div 
                  key={obj.id} 
                  style={{ 
                    padding: '0.5rem', 
                    borderRadius: '8px', 
                    background: isCorrect ? 'var(--success-bg)' : isSelected ? 'var(--danger-bg)' : 'var(--surface)', 
                    border: '1px solid var(--border)',
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.25rem' 
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>{obj.name}</span>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {['Transparent', 'Translucent', 'Opaque'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleClassify(obj.id, cat)}
                        style={{
                          flex: 1,
                          padding: '0.4rem',
                          fontSize: '0.85rem',
                          background: classifications[obj.id] === cat ? (cat === obj.correct ? 'var(--success)' : 'var(--danger)') : 'transparent',
                          color: classifications[obj.id] === cat ? '#fff' : 'var(--text-secondary)',
                          border: '1px solid var(--border)',
                          borderRadius: '4px'
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {classificationComplete && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontSize: '1rem', fontWeight: 'bold', justifyContent: 'center' }}>
              <Check size={20} /> Table 6.4 Completed!
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', minHeight: '60px' }}>
        {isComplete && (
          <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '1rem 2rem', borderRadius: '8px', color: 'var(--success)', fontWeight: 'bold', fontSize: '1rem' }}>
            Activity Complete! Click "Proceed to next" in the top right.
          </div>
        )}
      </div>
    </div>
  );
}
