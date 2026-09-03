import React, { useState, useEffect, useRef } from 'react';
import { Search, Box, CheckCircle, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

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

  // Reset video state when switching objects
  useEffect(() => {
    setIsPlaying(false);
    setIsVideoFinished(progress[selectedId].status !== 'untouched');
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [selectedId, progress]);

  // Completion check
  const completedCount = Object.values(progress).filter(p => p.status === 'completed').length;
  useEffect(() => {
    if (completedCount === objectsData.length) {
      onComplete();
    }
  }, [completedCount, onComplete]);

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
         }, 2500); // slightly longer to let them read the explanation
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
      
      {/* Header */}
      <div className="glass-panel" style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '0.15rem', border: '1px solid var(--accent-border)', padding: '0.75rem 1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🕵️ Material Detective – Press & Identify
        </h3>
        <p style={{ margin: 0, fontSize: '1.35rem', color: 'var(--heading-sub)' }}>
          Press each object, observe what happens and identify the material it is made of.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', width: '100%', flex: 1, minHeight: 0 }}>
        {/* Left Panel */}
        <div className="glass-panel" style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid var(--border)', padding: '1rem', overflowY: 'hidden' }}>
          <h4 style={{ margin: 0, fontSize: '1.35rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
            Objects to Investigate ({completedCount} / 5)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
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
               {/* Center Panel */}
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
              
              {/* Question */}
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
