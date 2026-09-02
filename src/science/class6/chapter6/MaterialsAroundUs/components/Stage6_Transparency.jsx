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
      name: 'Behind a Wall', 
      character: 'Suspect',
      type: 'Opaque', 
      seekerDialog: 'Where is the suspect? I cannot see them at all! A brick wall does not allow any light to pass through.',
      description: 'Materials through which you are not able to see at all are called Opaque.',
      icon: '🧱',
      color: 'var(--lesson-danger)',
      bg: 'var(--lesson-danger-bg)'
    },
    { 
      id: 'frosted', 
      name: 'Frosted Glass Door',
      character: 'Suspect',
      type: 'Translucent', 
      seekerDialog: 'Ah, I see a blurry outline of the suspect! I can see through, but not clearly. Frosted glass lets some light pass.',
      description: 'Materials through which objects can be seen, but not clearly, are called Translucent.',
      icon: '🌫️',
      color: 'var(--lesson-accent)',
      bg: 'var(--lesson-warning-bg)'
    },
    { 
      id: 'tree', 
      name: 'Big Tree',
      character: 'Suspect',
      type: 'Opaque', 
      seekerDialog: 'The suspect is hiding behind the tree trunk! Wood is opaque, so I can only see them peeking out.',
      description: 'Wood is an opaque material.',
      icon: '🌳',
      color: 'var(--lesson-danger)',
      bg: 'var(--lesson-danger-bg)'
    },
    { 
      id: 'window', 
      name: 'Clear Glass Window',
      character: "Suspect",
      type: 'Transparent', 
      seekerDialog: 'Aha! I see the suspect clearly through the window! Glass allows light to pass through completely, making it perfectly clear.',
      description: 'Materials through which things can be seen clearly are called Transparent.',
      icon: '🪟',
      color: 'var(--lesson-success)',
      bg: 'var(--lesson-success-bg)'
    }
  ];

  const objectsToClassify = [
    { id: 'tumbler', name: 'Glass tumbler', correct: 'Transparent', icon: '🥛' },
    { id: 'butter', name: 'Butter paper', correct: 'Translucent', icon: '📃' },
    { id: 'eraser', name: 'Eraser', correct: 'Opaque', icon: '🧽' },
    { id: 'frosted_glass', name: 'Frosted glass', correct: 'Translucent', icon: '🌫️' },
    { id: 'wood', name: 'Wooden board', correct: 'Opaque', icon: '🪵' },
    { id: 'window_glass', name: 'Window glass', correct: 'Transparent', icon: '🪟' }
  ];

  const handleClassify = (id, category) => {
    setClassifications(prev => ({ ...prev, [id]: category }));
    const obj = objectsToClassify.find(o => o.id === id);
    if (obj.correct === category) {
      addXp(10);
    }
  };

  const handleSpotClick = (spot) => {
    setSelectedHidingSpot(spot);
    addXp(10);
  };

  const correctClassificationsCount = objectsToClassify.filter(o => classifications[o.id] === o.correct).length;
  const classificationComplete = correctClassificationsCount === objectsToClassify.length;

  const isComplete = selectedHidingSpot !== null && classificationComplete;

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => onComplete(), 1500);
    }
  }, [isComplete, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '1000px', margin: '0 auto', paddingBottom: '2rem' }}>
      
      {/* Intro Header */}
      <div style={{ background: 'var(--lesson-surface)', border: '1px solid var(--lesson-border)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--lesson-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Eye size={26} color="var(--lesson-accent)" /> Explore materials through which one can see or cannot see
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--lesson-text)', lineHeight: '1.5' }}>
          Chief Blake is running a surveillance simulation! Click on the locations to see if the suspect is visible through the material. Then complete Activity 6.6 below.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Interactive Yard */}
        <div style={{ background: 'var(--lesson-surface)', borderRadius: '16px', border: '1px solid var(--lesson-border)', padding: '1.5rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--lesson-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'var(--lesson-accent)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>1</div>
            Surveillance Simulator
          </h4>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', flex: 1 }}>
              {hidingSpots.map((spot) => (
                <motion.div
                  key={spot.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSpotClick(spot)}
                  style={{
                    background: spot.bg,
                    border: `2px solid ${selectedHidingSpot?.id === spot.id ? spot.color : 'var(--lesson-border)'}`,
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    cursor: 'pointer',
                    boxShadow: selectedHidingSpot?.id === spot.id ? `0 0 0 3px ${spot.color}33` : 'none',
                  }}
                >
                  <div style={{ fontSize: '2.5rem' }}>{spot.icon}</div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'var(--lesson-text)' }}>{spot.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--lesson-muted)' }}>{spot.character}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Dialogue display */}
            <div style={{ flex: 1, background: 'var(--lesson-surface)', borderRadius: '12px', border: '1px solid var(--lesson-border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {selectedHidingSpot ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ background: selectedHidingSpot.color, color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {selectedHidingSpot.type.toUpperCase()}
                    </div>
                  </div>
                  <p style={{ fontSize: '1.1rem', color: 'var(--lesson-text)', margin: 0, lineHeight: '1.6', fontStyle: 'italic' }}>
                    "{selectedHidingSpot.seekerDialog}"
                  </p>
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--lesson-border)', color: selectedHidingSpot.color, fontWeight: 'bold' }}>
                    {selectedHidingSpot.description}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--lesson-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <Eye size={48} opacity={0.5} />
                  <span>Click a location to check your visibility of the suspect through the material!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Classification Table */}
        <div style={{ background: 'var(--lesson-surface)', borderRadius: '16px', border: '1px solid var(--lesson-border)', padding: '1.5rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--lesson-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'var(--lesson-success)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>2</div>
            Activity 6.6: Let us classify
          </h4>
          <p style={{ margin: '0 0 1rem 0', color: 'var(--lesson-muted)' }}>
            Classify the following objects into Table 6.4. Select the correct column for each item!
          </p>

          <div style={{ display: 'flex', gap: '2rem' }}>
            {/* Items Pool */}
            <div style={{ flex: '0 0 250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--lesson-text)', borderBottom: '2px solid var(--lesson-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Objects to Classify</div>
              {objectsToClassify.map((obj) => {
                const isSelected = classifications[obj.id] !== undefined;
                if (isSelected) return null; // Hide if placed
                return (
                  <div key={obj.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--lesson-surface)', border: '1px solid var(--lesson-border)', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold', color: 'var(--lesson-text)' }}>
                    <span style={{ fontSize: '1.2rem' }}>{obj.icon}</span> {obj.name}
                  </div>
                );
              })}
              {classificationComplete && (
                <div style={{ color: 'var(--lesson-success)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1rem' }}>
                  <Check size={20} /> All classified!
                </div>
              )}
            </div>

            {/* Table 6.4 */}
            <div style={{ flex: 1 }}>
              <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--lesson-text)', marginBottom: '10px' }}>Table 6.4: Classification of objects</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                
                {['Transparent', 'Translucent', 'Opaque'].map(category => (
                  <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ background: 'var(--lesson-success-bg)', color: 'var(--lesson-success)', fontWeight: 'bold', textAlign: 'center', padding: '10px', borderRadius: '8px 8px 0 0', border: '1px solid var(--lesson-success-border)' }}>
                      {category}
                    </div>
                    
                    {/* Items placed in this category */}
                    <div style={{ background: 'var(--lesson-surface)', border: '1px solid var(--lesson-border)', borderRadius: '0 0 8px 8px', padding: '10px', minHeight: '150px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {objectsToClassify.filter(o => classifications[o.id] === category).map(obj => (
                        <div key={obj.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: obj.correct === category ? 'var(--lesson-success-bg)' : 'var(--lesson-danger-bg)', border: `1px solid ${obj.correct === category ? 'var(--lesson-success-border)' : 'var(--lesson-danger-border)'}`, padding: '6px 10px', borderRadius: '6px', fontSize: '0.9rem' }}>
                          <span style={{ fontSize: '1.1rem' }}>{obj.icon}</span> {obj.name}
                        </div>
                      ))}

                      {/* Selectors for unclassified items */}
                      {objectsToClassify.filter(o => classifications[o.id] === undefined).map(obj => (
                        <button
                          key={`btn-${obj.id}`}
                          onClick={() => handleClassify(obj.id, category)}
                          style={{
                            background: 'white', border: '1px dashed var(--lesson-border)', padding: '6px', borderRadius: '6px', color: 'var(--lesson-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--lesson-accent)'; e.currentTarget.style.color = 'var(--lesson-accent)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--lesson-border)'; e.currentTarget.style.color = 'var(--lesson-muted)'; }}
                        >
                          Place <strong>{obj.name}</strong> here
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
