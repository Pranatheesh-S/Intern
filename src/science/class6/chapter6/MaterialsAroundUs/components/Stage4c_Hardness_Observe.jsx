import React, { useState, useEffect, useRef } from 'react';
import { Search, Box, CheckCircle, Lightbulb, Hand, ChevronsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import cottonVideo from '../../../../../assets/1.cottonball.mp4';
import spongeVideo from '../../../../../assets/1.sponge.mp4';
import eraserVideo from '../../../../../assets/1.eraser.mp4';
import stoneVideo from '../../../../../assets/1.stone.mp4';
import ironVideo from '../../../../../assets/1.ironrod.mp4';

const objectsData = [
  { 
    id: 1, 
    name: 'Cotton Ball', 
    video: cottonVideo, 
    hardness: 'soft', 
    correctMaterial: 'Cotton',
    options: ['Wool', 'Silk', 'Cotton', 'Jute'],
    clue: 'It is a fluffy plant fibre commonly used in clothes and medical swabs.',
    reason: 'Cotton is a natural, soft plant fibre.'
  },
  { 
    id: 2, 
    name: 'Washing Sponge', 
    video: spongeVideo, 
    hardness: 'soft', 
    correctMaterial: 'Foam',
    options: ['Foam', 'Rubber', 'Fabric', 'Plastic'],
    clue: 'It has many tiny air holes that make it highly compressible and absorbent.',
    reason: 'Foam has a porous structure with trapped air, allowing it to easily compress.'
  },
  { 
    id: 3, 
    name: 'Eraser', 
    video: eraserVideo, 
    hardness: 'soft', 
    correctMaterial: 'Rubber',
    options: ['Rubber', 'Silicone', 'Wax', 'Plastic'],
    clue: 'It is flexible, grips paper well, and deforms when pressed hard.',
    reason: 'Rubber is a flexible and slightly soft material used to rub out marks.'
  },
  { 
    id: 4, 
    name: 'Stone', 
    video: stoneVideo, 
    hardness: 'hard', 
    correctMaterial: 'Natural Rock',
    options: ['Concrete', 'Brick', 'Natural Rock', 'Ceramic'],
    clue: 'It is a naturally occurring solid material found in the earth.',
    reason: 'Natural rock is rigid, durable, and naturally hard.'
  },
  { 
    id: 5, 
    name: 'Iron Rod', 
    video: ironVideo, 
    hardness: 'hard', 
    correctMaterial: 'Iron',
    options: ['Steel', 'Copper', 'Aluminium', 'Iron'],
    clue: 'It is a heavy, magnetic metal commonly used in construction.',
    reason: 'Iron is a hard, rigid metal that does not compress.'
  }
];

export default function Stage4c_Hardness_Observe({ onComplete, addXp }) {
  // Local state
  const items = [
    { id: 'cotton', name: 'Cotton Ball', type: 'soft', resultText: 'It got compressed easily.', icon: <div style={{ width: '50px', height: '50px', background: 'radial-gradient(circle at 30% 30%, var(--lesson-surface), var(--lesson-border))', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />, color: '#A64B27', bg: 'var(--lesson-success-bg)', blockBg: 'var(--lesson-success-border)', blockRadius: '20px' },
    { id: 'sponge', name: 'Washing Sponge', type: 'soft', resultText: 'It was pressed down. It is soft.', icon: '🧽', color: '#A64B27', bg: 'var(--lesson-success-bg)', blockBg: 'var(--lesson-success-border)', blockRadius: '8px' },
    { id: 'eraser', name: 'Eraser', type: 'soft', resultText: 'It changed shape slightly.', icon: (
      <svg width="50" height="50" viewBox="0 0 50 50">
        <g transform="rotate(-15 25 25)">
          <rect x="6" y="16" width="38" height="18" rx="4" fill="#fda4af" />
          <rect x="6" y="16" width="38" height="12" rx="4" fill="#fecdd3" />
          <rect x="16" y="16" width="18" height="18" fill="#A64B27" />
          <rect x="16" y="16" width="18" height="12" fill="var(--lesson-border)" />
        </g>
      </svg>
    ), color: '#A64B27', bg: 'var(--lesson-success-bg)', blockBg: 'var(--lesson-border)', blockRadius: '4px' },
    { id: 'stone', name: 'River Stone', type: 'hard', resultText: 'It did not change shape.', icon: '🪨', color: 'var(--lesson-danger)', bg: 'var(--lesson-danger-bg)', blockBg: 'var(--lesson-muted)', blockRadius: '12px' },
    { id: 'iron', name: 'Iron Rod', type: 'hard', resultText: 'It did not change shape at all.', icon: <div style={{ width: '55px', height: '18px', background: 'linear-gradient(180deg, var(--lesson-border), var(--lesson-surface), var(--lesson-muted))', borderRadius: '4px', transform: 'rotate(20deg)', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }} />, color: 'var(--lesson-danger)', bg: 'var(--lesson-danger-bg)', blockBg: 'var(--lesson-muted)', blockRadius: '0px' }
  ];

  const [testedItems, setTestedItems] = useState({});
  const [activeAnim, setActiveAnim] = useState(null);
  const [placedItems, setPlacedItems] = useState({ soft: [], hard: [] });

  // Remote state
  const [selectedId, setSelectedId] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const videoRef = useRef(null);
  
  const [progress, setProgress] = useState(
    objectsData.reduce((acc, obj) => {
      acc[obj.id] = { status: 'untouched', wrongAttempts: 0 };
      return acc;
    }, {})
  );

  const activeObj = objectsData.find(o => o.id === selectedId);
  const activeState = progress[selectedId];

  // Local handlers
  const handlePressLocal = (id) => {
    if (activeAnim) return;
    setActiveAnim(id);
    setTimeout(() => {
      setTestedItems(prev => {
        if (!prev[id]) addXp(10);
        return { ...prev, [id]: true };
      });
      // Automatically place the item
      const item = items.find(i => i.id === id);
      setPlacedItems(prev => {
        if (prev[item.type].includes(id)) return prev;
        return { ...prev, [item.type]: [...prev[item.type], id] };
      });
      setActiveAnim(null);
    }, 1000);
  };

  const allTested = Object.keys(testedItems).length === items.length;
  const allPlaced = placedItems.soft.length === 3 && placedItems.hard.length === 2;

  // Remote handlers
  useEffect(() => {
    setIsPlaying(false);
    setIsVideoFinished(progress[selectedId].status !== 'untouched');
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [selectedId, progress]);

  const completedCount = Object.values(progress).filter(p => p.status === 'completed').length;
  useEffect(() => {
    if (completedCount === objectsData.length && allPlaced) {
      setTimeout(() => onComplete(), 2000);
    }
  }, [completedCount, allPlaced, onComplete]);

  const handlePress = () => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
      setIsVideoFinished(false);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setIsVideoFinished(true);
    if (activeState.status === 'untouched') {
      setProgress(prev => ({
        ...prev,
        [selectedId]: { ...prev[selectedId], status: 'observed' }
      }));
      addXp(15);
    }
  };

  const handleAnswer = (selectedMat) => {
    if (selectedMat === activeObj.correctMaterial) {
      setProgress(prev => ({
        ...prev,
        [selectedId]: { ...prev[selectedId], status: 'completed' }
      }));
      addXp(20);
      
      // Auto-advance if not all completed
      if (completedCount + 1 < objectsData.length) {
         setTimeout(() => {
            const nextId = objectsData.find(o => progress[o.id].status !== 'completed' && o.id !== selectedId)?.id;
            if (nextId) {
               setSelectedId(nextId);
            }
         }, 2500); 
      }
    } else {
      setProgress(prev => ({
        ...prev,
        [selectedId]: { ...prev[selectedId], wrongAttempts: prev[selectedId].wrongAttempts + 1 }
      }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.75rem', width: '100%', overflow: 'hidden' }}>
      
      {/* Remote Header */}
      <div className="glass-panel" style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '0.15rem', border: '1px solid var(--accent-border)', padding: '0.75rem 1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🕵️ Material Detective – Press & Identify
        </h3>
        <p style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-secondary)' }}>
          Press each object, observe what happens and identify the material it is made of.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', width: '100%', flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {/* Remote Left Panel */}
        <div className="glass-panel" style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid var(--border)', padding: '1rem', overflowY: 'hidden' }}>
          <h4 style={{ margin: 0, fontSize: '1.35rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
            Objects to Investigate ({completedCount} / 5)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto' }}>
            {objectsData.map(obj => {
              const isCompleted = progress[obj.id].status === 'completed';
              const isSelected = selectedId === obj.id;
              return (
                <div 
                  key={obj.id}
                  onClick={() => { if (!isPlaying) setSelectedId(obj.id); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1rem',
                    border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                    borderRadius: '12px', cursor: isPlaying ? 'not-allowed' : 'pointer',
                    background: isSelected ? 'var(--accent-bg)' : isCompleted ? '#f0fdf4' : 'var(--surface)',
                    opacity: isPlaying && !isSelected ? 0.6 : 1,
                    minHeight: '4.5rem'
                  }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isCompleted ? 'var(--success)' : 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 'bold', flexShrink: 0 }}>
                    {isCompleted ? '✓' : obj.id}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.15rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}>{obj.name}</span>
                    {(progress[obj.id].status !== 'untouched' || (isSelected && isVideoFinished)) && (
                       <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>It is a {obj.hardness} material.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Remote Center Panel */}
        <div className="glass-panel" style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid var(--border)', padding: '1rem', position: 'relative', overflowY: 'hidden' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Search size={22} style={{ color: 'var(--text-muted)' }} /> 
            <span style={{ fontWeight: 'bold', fontSize: '1.35rem', color: 'var(--text-primary)' }}>Investigation {selectedId} of 5</span>
          </div>
          <div style={{ width: '100%', fontSize: '1.35rem', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            Current Object: <span style={{ color: 'var(--accent)' }}>{activeObj.name}</span>
          </div>

          <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: '250px', maxHeight: '55vh', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.75rem', background: 'transparent', borderRadius: '12px', overflow: 'hidden' }}>
            <video 
              ref={videoRef}
              src={activeObj.video} 
              onEnded={handleVideoEnded}
              preload="auto"
              playsInline
              muted
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              style={{ 
                width: '100%', height: '100%', objectFit: 'cover'
              }} 
            />
          </div>

          {!isVideoFinished && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button 
                onClick={handlePress}
                disabled={isPlaying}
                style={{ 
                  background: isPlaying ? 'var(--text-muted)' : 'var(--success)', 
                  color: 'white', padding: '0.75rem 2.5rem', borderRadius: '10px', fontSize: '1.5rem', 
                  fontWeight: 'bold', border: 'none', cursor: isPlaying ? 'not-allowed' : 'pointer', 
                  boxShadow: isPlaying ? 'none' : '0 4px 14px rgba(34, 197, 94, 0.4)', 
                  transition: 'all 0.2s'
                }}
              >
                PRESS
              </button>
            </div>
          )}

          {isVideoFinished && (
            <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                <Box size={22} /> What material is it made of?
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: '0.5rem' }}>
                {activeState.status !== 'completed' && activeState.wrongAttempts > 0 && (
                   <div style={{ color: 'var(--danger)', fontWeight: 'bold', fontSize: '1.25rem', marginTop: '0.25rem', textAlign: 'center' }}>
                      Not quite. Try again.
                      <div style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginTop: '0.15rem', fontWeight: 'normal' }}>
                         Clue: {activeObj.clue}
                      </div>
                   </div>
                )}
                {activeState.status === 'completed' && (
                   <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.25rem', marginTop: '0.25rem', textAlign: 'center' }}>
                      Correct!
                      <div style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginTop: '0.15rem', fontWeight: 'normal' }}>
                         {activeObj.reason}
                      </div>
                   </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                {activeObj.options.map((opt, i) => {
                  const isCorrect = opt === activeObj.correctMaterial;
                  const showCorrect = activeState.status === 'completed' && isCorrect;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt)}
                      disabled={activeState.status === 'completed'}
                      style={{
                        flex: '1 1 180px', maxWidth: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem',
                        border: showCorrect ? '2px solid var(--success)' : '1px solid var(--border)',
                        borderRadius: '10px', background: showCorrect ? 'var(--success-bg)' : 'var(--surface)',
                        cursor: activeState.status === 'completed' ? 'default' : 'pointer',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)', transition: 'all 0.2s'
                      }}
                      className={activeState.status === 'completed' ? '' : 'hover-lift'}
                    >
                      <span style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.3rem', color: 'var(--text-primary)' }}>{opt}</span>
                      {showCorrect && <CheckCircle size={22} color="var(--success)" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Local Auto-Sorting Observation Section */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--lesson-border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0 }}>
        
        {/* Local Materials Row */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
          {items.map(item => {
            const isTesting = activeAnim === item.id;
            const isTested = testedItems[item.id];
            const isPlaced = placedItems.soft.includes(item.id) || placedItems.hard.includes(item.id);

            return (
              <div key={item.id} style={{ 
                flex: 1, 
                border: `1px solid ${isTested ? item.color : 'var(--lesson-border)'}`, 
                borderRadius: '12px', 
                padding: '1rem 0.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '1rem',
                background: 'white',
                position: 'relative',
                opacity: isPlaced ? 0.5 : 1
              }}>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: isTested ? item.color : 'var(--lesson-text)' }}>
                  {item.name}
                </div>
                <div style={{ 
                  width: '100%', height: '140px', 
                  border: `1px solid ${isTested ? item.color : 'var(--lesson-border)'}`,
                  borderRadius: '8px',
                  background: isTested ? item.bg : 'var(--lesson-surface)',
                  position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                  paddingBottom: '1rem', overflow: 'hidden', cursor: 'default'
                }}>
                  <div style={{ position: 'absolute', top: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <AnimatePresence>
                      {isTesting && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 5 }}
                          exit={{ opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 0.5 }}
                        >
                          <ChevronsDown size={24} color={item.color} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <motion.div animate={{ y: isTesting ? 45 : 0 }} transition={{ duration: 0.3, yoyo: Infinity }} style={{ position: 'absolute', top: '10px', zIndex: 10 }}>
                    <Hand size={48} color="var(--lesson-warning)" fill="var(--lesson-warning-border)" style={{ transform: 'rotate(-15deg)' }} />
                  </motion.div>
                  <motion.div
                    animate={isTesting ? (item.type === 'soft' ? { scaleY: 0.5, scaleX: 1.2, y: 15 } : { y: [0, 2, 0, 2, 0] }) : { scaleY: 1, scaleX: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ fontSize: '4rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))', transformOrigin: 'bottom', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}
                  >
                    {item.icon}
                  </motion.div>
                </div>
                <div style={{ height: '95px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', width: '100%', padding: '0 0.5rem' }}>
                  {isTested ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ background: item.color, color: 'white', padding: '2px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '2px' }}>
                        {item.type === 'soft' ? 'Soft' : 'Hard'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--lesson-secondary)', textAlign: 'center', lineHeight: '1.2' }}>{item.resultText}</div>
                    </div>
                  ) : <div style={{ flex: 1 }}></div>}
                  <button 
                    onClick={() => handlePressLocal(item.id)}
                    disabled={activeAnim !== null}
                    style={{
                      background: '#A64B27', color: 'white', border: 'none',
                      padding: '0.4rem 1.5rem', borderRadius: '20px',
                      fontWeight: 'bold', cursor: activeAnim ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem', width: '100%',
                      boxShadow: '0 2px 4px rgba(59,130,246,0.3)', marginTop: '0.25rem'
                    }}
                  >
                    Press
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--lesson-primary)', fontWeight: 'bold' }}>
          <span style={{ fontSize: '1.2rem' }}>🔍</span> My Observation
        </div>
        <div style={{ fontSize: '0.95rem', color: 'var(--lesson-secondary)' }}>
          As you test the materials, they will be automatically sorted into the correct boxes based on their properties.
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
          {/* Soft Drop Zone */}
          <div style={{ flex: 1, border: '2px dashed #A64B27', borderRadius: '12px', background: 'var(--lesson-success-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', minHeight: '120px' }}>
            <div style={{ color: '#A64B27', fontWeight: 'bold', marginBottom: '1rem' }}>Soft (Easily Compressed)</div>
            {placedItems.soft.length === 0 ? (
              <div style={{ color: 'var(--lesson-success-border)', margin: 'auto' }}>Awaiting soft materials...</div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {placedItems.soft.map(id => {
                  const item = items.find(i => i.id === id);
                  return <div key={id} style={{ fontSize: '2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{item.icon}</div>;
                })}
              </div>
            )}
          </div>

          {/* Hard Drop Zone */}
          <div style={{ flex: 1, border: '2px dashed var(--lesson-danger)', borderRadius: '12px', background: 'var(--lesson-danger-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', minHeight: '120px' }}>
            <div style={{ color: 'var(--lesson-danger)', fontWeight: 'bold', marginBottom: '1rem' }}>Hard (Difficult to Compress)</div>
            {placedItems.hard.length === 0 ? (
              <div style={{ color: 'var(--lesson-danger-border)', margin: 'auto' }}>Awaiting hard materials...</div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {placedItems.hard.map(id => {
                  const item = items.find(i => i.id === id);
                  return <div key={id} style={{ fontSize: '2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{item.icon}</div>;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Completion Toast */}
      {(completedCount === objectsData.length && allPlaced) && (
         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--lesson-success-bg)', border: '1px solid var(--lesson-success-border)', padding: '1rem', borderRadius: '8px', color: '#A64B27', textAlign: 'center', fontWeight: 'bold', marginTop: '1rem' }}>
           <CheckCircle size={20} style={{ display: 'inline', marginBottom: '-4px', marginRight: '5px' }} />
           Excellent classification! We are ready for the advanced scratch test.
         </motion.div>
      )}
      
      <style>{`
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
