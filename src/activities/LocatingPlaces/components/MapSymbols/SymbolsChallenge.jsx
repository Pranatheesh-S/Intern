import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, Award } from 'lucide-react';
import { SYMBOL_GROUPS } from './symbolData';

// Flatten the symbols to pick random ones
const allSymbols = SYMBOL_GROUPS.flatMap(group => group.items);

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Simple audio context for sound effects
const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (e) {
    // Ignore audio errors
  }
};

export default function SymbolsChallenge({ onComplete, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [traySymbols, setTraySymbols] = useState([]);
  const [matched, setMatched] = useState({});
  const [errorHighlight, setErrorHighlight] = useState(null); // id of question that had an error
  
  // Initialize game
  useEffect(() => {
    const shuffled = shuffleArray(allSymbols);
    const selected = shuffled.slice(0, 6);
    
    setQuestions(selected);
    setTraySymbols(shuffleArray(selected));
    setMatched({});
  }, []);

  const handleDragStart = (e, symbol) => {
    e.dataTransfer.setData('application/json', JSON.stringify(symbol));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetQuestion) => {
    e.preventDefault();
    try {
      const draggedStr = e.dataTransfer.getData('application/json');
      if (!draggedStr) return;
      
      const draggedSymbol = JSON.parse(draggedStr);
      
      if (draggedSymbol.name === targetQuestion.name) {
        // Success
        playSound('success');
        setMatched(prev => ({ ...prev, [targetQuestion.name]: true }));
        setTraySymbols(prev => prev.filter(s => s.name !== draggedSymbol.name));
      } else {
        // Error
        playSound('error');
        setErrorHighlight(targetQuestion.name);
        setTimeout(() => setErrorHighlight(null), 1000);
      }
    } catch (err) {
      console.error('Drop error', err);
    }
  };

  const correctCount = Object.keys(matched).length;
  const isComplete = correctCount === 6;

  return (
    <div style={{ padding: '2rem', background: 'var(--surface)', borderTop: '1px solid var(--border)', borderRadius: '12px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          {onBack && (
            <button 
              onClick={onBack}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', transition: 'color 0.2s', marginBottom: '0.5rem' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              ← Back to Symbols
            </button>
          )}
          <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-heading)' }}>Map Symbol Explorer</h2>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)' }}>Drag the correct symbols to match their names.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.25rem', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <Award size={24} color={isComplete ? '#f59e0b' : '#94a3b8'} />
          <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>
            {correctCount} / {questions.length}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div 
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}
          >
            {/* Left Side: Question Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {questions.map((q, idx) => {
                const isMatched = matched[q.name];
                const isError = errorHighlight === q.name;
                
                return (
                  <div 
                    key={idx}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '1rem 1.5rem', 
                      background: 'var(--bg-primary)', 
                      borderRadius: '12px', 
                      border: `0.5px solid ${isMatched ? '#10b981' : isError ? '#ef4444' : 'var(--border)'}`,
                      transition: 'border-color 0.2s ease',
                      boxShadow: isMatched ? '0 4px 10px rgba(16, 185, 129, 0.1)' : 'none'
                    }}
                  >
                    <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>
                      {q.name}
                    </span>
                    
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, q)}
                      style={{ 
                        width: '120px', 
                        height: '60px', 
                        background: isMatched ? 'var(--surface)' : 'rgba(0,0,0,0.02)', 
                        border: isMatched ? 'none' : '1px dashed var(--border)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                    >
                      {isMatched ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: 'var(--text-primary)' }}>
                          <q.Icon />
                          <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'white', borderRadius: '50%' }}>
                            <CheckCircle2 size={24} color="#10b981" />
                          </div>
                        </motion.div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: isError ? '#ef4444' : 'var(--text-muted)' }}>
                          {isError ? 'Try again' : 'Drop Symbol Here'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Side: Symbol Tray */}
            <div style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-heading)' }}>Symbol Tray</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <AnimatePresence>
                  {traySymbols.map((symbol) => (
                    <motion.div
                      key={symbol.name}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, symbol)}
                      style={{
                        background: 'var(--surface)',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        cursor: 'grab',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '60px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        color: 'var(--text-primary)'
                      }}
                      whileHover={{ scale: 1.05, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                      whileTap={{ scale: 0.95, cursor: 'grabbing' }}
                    >
                      <symbol.Icon />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {traySymbols.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    All symbols matched!
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div 
            key="completion"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              background: 'var(--bg-primary)', 
              padding: '3rem', 
              borderRadius: '20px', 
              border: '1px solid var(--border)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem'
            }}
          >
            <div style={{ width: '80px', height: '80px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <Award size={40} color="white" />
            </div>
            
            <div>
              <h3 style={{ fontSize: '2rem', color: '#10b981', margin: '0 0 0.5rem 0' }}>Excellent!</h3>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
                You identified the map symbols correctly. Maps use these standard symbols so everyone can read them easily.
              </p>
            </div>

            <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px', fontWeight: 'bold', border: '2px solid rgba(16, 185, 129, 0.2)' }}>
              🏆 Map Symbol Explorer
            </div>

            <button onClick={onComplete} className="primary" style={{ marginTop: '1rem', padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)', background: '#10b981', color: 'white', border: 'none' }}>
              Continue <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
