import React, { useState, useEffect } from 'react';
import { Hand, Search, Box, CheckCircle, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

import cottonNormalImg from '../../../../../assets/hardness/cotton_normal.jpg';
import cottonPressedImg from '../../../../../assets/hardness/cotton_pressed.gif';
import spongeNormalImg from '../../../../../assets/hardness/sponge_normal.jpg';
import spongePressedImg from '../../../../../assets/hardness/sponge_pressed.gif';
import eraserNormalImg from '../../../../../assets/hardness/eraser_normal.jpg';
import eraserPressedImg from '../../../../../assets/hardness/eraser_pressed.gif';
import stoneNormalImg from '../../../../../assets/hardness/stone_normal.jpg';
import stonePressedImg from '../../../../../assets/hardness/stone_pressed.gif';
import ironNormalImg from '../../../../../assets/hardness/iron_normal.jpg';
import ironPressedImg from '../../../../../assets/hardness/iron_pressed.gif';

import iconCotton from '../../../../../assets/hardness/icon_cotton.jpg';
import iconSponge from '../../../../../assets/hardness/icon_sponge.jpg';
import iconRubber from '../../../../../assets/hardness/icon_rubber.jpg';
import iconStone from '../../../../../assets/hardness/icon_stone.jpg';
import iconIron from '../../../../../assets/hardness/icon_iron.jpg';

const materialsData = {
  'Cotton': iconCotton,
  'Sponge': iconSponge,
  'Rubber': iconRubber,
  'Stone': iconStone,
  'Iron': iconIron
};

const objectsData = [
  { 
    id: 1, 
    name: 'Cotton Ball', 
    image: cottonNormalImg, 
    pressedImage: cottonPressedImg,
    hardness: 'soft', 
    correctMaterial: 'Cotton',
    options: ['Cotton', 'Sponge', 'Stone'],
    clue: 'It is soft, fluffy, and comes from a plant. It easily changes shape.'
  },
  { 
    id: 2, 
    name: 'Washing Sponge', 
    image: spongeNormalImg, 
    pressedImage: spongePressedImg,
    hardness: 'soft', 
    correctMaterial: 'Sponge',
    options: ['Rubber', 'Sponge', 'Iron'],
    clue: 'It is very porous, absorbs water easily, and springs back when pressed.'
  },
  { 
    id: 3, 
    name: 'Eraser', 
    image: eraserNormalImg, 
    pressedImage: eraserPressedImg,
    hardness: 'soft', 
    correctMaterial: 'Rubber',
    options: ['Stone', 'Iron', 'Rubber'],
    clue: 'It can bend and deform slightly under pressure, and is used to rub out marks.'
  },
  { 
    id: 4, 
    name: 'Stone', 
    image: stoneNormalImg, 
    pressedImage: stonePressedImg,
    hardness: 'hard', 
    correctMaterial: 'Stone',
    options: ['Sponge', 'Cotton', 'Stone'],
    clue: 'It is a hard, natural material found in the ground or rivers that does not change shape.'
  },
  { 
    id: 5, 
    name: 'Iron Rod', 
    image: ironNormalImg, 
    pressedImage: ironPressedImg,
    hardness: 'hard', 
    correctMaterial: 'Iron',
    options: ['Iron', 'Rubber', 'Cotton'],
    clue: 'It is a strong, rigid metal used in construction that will not compress.'
  }
];

export default function Stage4c_Hardness_Observe({ onComplete, addXp }) {
  const [selectedId, setSelectedId] = useState(1);
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(
    objectsData.reduce((acc, obj) => {
      acc[obj.id] = { status: 'untouched', wrongAttempts: 0 };
      return acc;
    }, {})
  );

  const activeObj = objectsData.find(o => o.id === selectedId);
  const activeState = progress[selectedId];

  // Press & Hold Timer
  useEffect(() => {
    let timer;
    if (isHolding && activeState.status === 'untouched') {
      timer = setTimeout(() => {
        setProgress(prev => ({
          ...prev,
          [selectedId]: { ...prev[selectedId], status: 'observed' }
        }));
        setIsHolding(false);
        addXp(15);
      }, 6500); // 6.5 seconds hold for the animation/video to play
    }
    return () => clearTimeout(timer);
  }, [isHolding, selectedId, activeState.status, addXp]);

  // Completion check
  const completedCount = Object.values(progress).filter(p => p.status === 'completed').length;
  useEffect(() => {
    if (completedCount === objectsData.length) {
      onComplete();
    }
  }, [completedCount, onComplete]);

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsHolding(true);
  };

  const handlePointerUp = (e) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsHolding(false);
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
            if (nextId) setSelectedId(nextId);
         }, 1500);
      }
    } else {
      setProgress(prev => ({
        ...prev,
        [selectedId]: { ...prev[selectedId], wrongAttempts: prev[selectedId].wrongAttempts + 1 }
      }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem', width: '100%', overflow: 'hidden' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '0.25rem', border: '1px solid var(--accent-border)', padding: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🕵️ Material Detective – Press & Identify
        </h3>
        <p style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-secondary)' }}>
          Press each object, observe what happens and identify the material it is made of.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', width: '100%', flex: 1, minHeight: 0 }}>
        {/* Left Panel */}
        <div className="glass-panel" style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)', padding: '1rem', overflowY: 'auto' }}>
          <h4 style={{ margin: 0, fontSize: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
            Objects to Investigate ({completedCount} / 5)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {objectsData.map(obj => {
              const isCompleted = progress[obj.id].status === 'completed';
              const isSelected = selectedId === obj.id;
              return (
                <div 
                  key={obj.id}
                  onClick={() => { if (!isHolding) setSelectedId(obj.id); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem',
                    border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                    borderRadius: '8px', cursor: isHolding ? 'not-allowed' : 'pointer',
                    background: isSelected ? 'var(--accent-bg)' : isCompleted ? '#f0fdf4' : 'var(--surface)',
                    opacity: isHolding && !isSelected ? 0.6 : 1
                  }}
                >
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isCompleted ? 'var(--success)' : 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold', flexShrink: 0 }}>
                    {isCompleted ? '✓' : obj.id}
                  </div>
                  <img src={obj.image} alt={obj.name} style={{ width: '45px', height: '35px', objectFit: 'cover', borderRadius: '6px' }} />
                  <span style={{ fontWeight: 'bold', flex: 1, fontSize: '1.1rem' }}>{obj.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Panel */}
        <div className="glass-panel" style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid var(--border)', padding: '1.5rem', position: 'relative', overflowY: 'auto' }}>
          
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Search size={22} style={{ color: 'var(--text-muted)' }} /> 
            <span style={{ fontWeight: 'bold', fontSize: '1.3rem', color: 'var(--text-primary)' }}>Investigation {selectedId} of 5</span>
          </div>
          <div style={{ width: '100%', fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            Current Object: <span style={{ color: 'var(--accent)' }}>{activeObj.name}</span>
          </div>

          <div style={{ position: 'relative', width: '100%', height: '320px', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem', background: '#f8fafc', borderRadius: '12px', overflow: 'hidden' }}>
            <img 
              src={isHolding ? activeObj.pressedImage : activeObj.image} 
              alt={activeObj.name}
              style={{ 
                maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '8px',
                transition: 'transform 0.5s ease-in-out',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }} 
            />
            
            {/* Visual Timer Bar */}
            {isHolding && activeState.status === 'untouched' && (
              <div style={{ position: 'absolute', bottom: '20px', width: '60%', height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: '100%' }} 
                  transition={{ duration: 6.5, ease: 'linear' }}
                  style={{ height: '100%', background: 'var(--success)' }}
                />
              </div>
            )}
          </div>

          {activeState.status === 'untouched' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Press the object and observe carefully.</p>
              <button 
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                style={{ 
                  background: 'var(--success)', color: 'white', padding: '1rem 3rem', borderRadius: '12px', fontSize: '1.4rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)', transition: 'transform 0.1s', transform: isHolding ? 'scale(0.95)' : 'scale(1)'
                }}
              >
                <Hand size={26} fill="white" /> PRESS & HOLD
              </button>
            </div>
          )}

          {(activeState.status === 'observed' || activeState.status === 'completed') && (
            <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.5s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                <Box size={22} /> What material is this object made of?
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Choose the correct option.</p>
              
              <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center' }}>
                {activeObj.options.map((opt, i) => {
                  const isCorrect = opt === activeObj.correctMaterial;
                  const showCorrect = activeState.status === 'completed' && isCorrect;
                  
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt)}
                      disabled={activeState.status === 'completed'}
                      style={{
                        flex: 1, maxWidth: '200px', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                        border: showCorrect ? '2px solid var(--success)' : '1px solid var(--border)',
                        borderRadius: '12px', background: showCorrect ? 'var(--success-bg)' : 'var(--surface)',
                        cursor: activeState.status === 'completed' ? 'default' : 'pointer',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)', transition: 'all 0.2s'
                      }}
                      className={activeState.status === 'completed' ? '' : 'hover-lift'}
                    >
                      <img src={materialsData[opt]} alt={opt} style={{ width: '45px', height: '45px', objectFit: 'contain', borderRadius: '4px', background: 'white' }} />
                      <span style={{ fontWeight: 'bold', flex: 1, textAlign: 'left', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{opt}</span>
                      {showCorrect && <CheckCircle size={24} color="var(--success)" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel" style={{ borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--border)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem 0', fontSize: '1.25rem' }}>
              <Search size={22} /> Material Observation
            </h4>
            {(activeState.status === 'observed' || activeState.status === 'completed') ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: activeObj.hardness === 'soft' ? 'var(--success)' : 'var(--danger)', marginBottom: '0.5rem' }}>
                  Result: {activeObj.hardness.toUpperCase()}
                </div>
                <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)', fontSize: '1.15rem', lineHeight: 1.4 }}>
                  {activeObj.hardness === 'soft' ? 'It changed shape easily when pressed.' : 'It was difficult to change its shape when pressed.'}
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: activeObj.hardness === 'soft' ? '#dcfce7' : '#fee2e2', color: activeObj.hardness === 'soft' ? '#15803d' : '#b91c1c', padding: '0.5rem 2rem', borderRadius: '99px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {activeObj.hardness.toUpperCase()}
                </div>
              </motion.div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontStyle: 'italic' }}>Press the object to reveal the observation.</div>
            )}
          </div>

          <div className="glass-panel" style={{ borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--border)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem 0', color: '#b45309', fontSize: '1.25rem' }}>
              <Lightbulb size={22} /> Need a clue?
            </h4>
            {activeState.status !== 'untouched' && activeState.wrongAttempts > 0 ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.5, fontSize: '1.15rem', background: '#fef3c7', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                {activeObj.clue}
              </motion.p>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontStyle: 'italic' }}>Clues will appear here if you need help after attempting an answer.</div>
            )}
          </div>
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
