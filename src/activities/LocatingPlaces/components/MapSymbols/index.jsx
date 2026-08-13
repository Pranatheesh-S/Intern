import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, CheckCircle2, ArrowRight, Award, Map } from 'lucide-react';
import { SVGSymbols } from './symbolData';

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

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

export default function MapSymbols({ onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [traySymbols, setTraySymbols] = useState([]);
  const [matched, setMatched] = useState({});
  const [errorHighlight, setErrorHighlight] = useState(null);

  useEffect(() => {
    const mappedSelected = [
      { id: 'railway', name: 'Railway Line', Icon: SVGSymbols.RailwayBroad },
      { id: 'road', name: 'Road', Icon: SVGSymbols.RoadMetalled },
      { id: 'river', name: 'River', Icon: SVGSymbols.River },
      { id: 'temple', name: 'Temple', Icon: SVGSymbols.Temple },
      { id: 'bridge', name: 'Bridge', Icon: SVGSymbols.Bridge },
      { id: 'police', name: 'Police Station', Icon: SVGSymbols.PoliceStation },
      { id: 'trees', name: 'Trees', Icon: SVGSymbols.Trees },
      { id: 'post', name: 'Post Office', Icon: SVGSymbols.PostOffice },
    ];

    setQuestions(mappedSelected);
    setTraySymbols(shuffleArray(mappedSelected));
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
      
      if (draggedSymbol.id === targetQuestion.id) {
        playSound('success');
        setMatched(prev => ({ ...prev, [targetQuestion.id]: true }));
        setTraySymbols(prev => prev.filter(s => s.id !== draggedSymbol.id));
      } else {
        playSound('error');
        setErrorHighlight(targetQuestion.id);
        setTimeout(() => setErrorHighlight(null), 500);
      }
    } catch (err) {
      console.error('Drop error', err);
    }
  };

  const correctCount = Object.keys(matched).length;
  const isComplete = questions.length > 0 && correctCount === questions.length;

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        
        {/* LEFT PANEL: Textbook Content */}
        <div style={{ flex: '1 1 50%', minWidth: '350px', background: 'linear-gradient(160deg, #F7F1E2, #EFE6D2)', borderRight: '1px solid var(--border)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '2rem 2.5rem' }}>
            
            {/* Page Header */}
            <div style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--amber)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              CHAPTER 1 • SYMBOLS
            </div>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--text-heading)', margin: '0 0 0.5rem 0', fontFamily: 'serif' }}>
              Understanding Map Symbols
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontStyle: 'italic', margin: '0 0 2rem 0' }}>
              Small pictures that represent real places and features.
            </p>

            {/* Section 1: What are Map Symbols? */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--text-heading)', margin: '0 0 1rem 0' }}>What are Symbols?</h2>
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.05, pointerEvents: 'none' }}>
                  <Map size={150} />
                </div>
                
                <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: 1.6, margin: 0, zIndex: 1 }}>
                  There is not enough space to draw real <strong style={{ color: '#0f172a' }}>buildings</strong>, <strong style={{ color: '#0f172a' }}>roads</strong>, and <strong style={{ color: '#0f172a' }}>rivers</strong> on every map.
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1, marginTop: '0.5rem' }}>
                  <div style={{ padding: '0.5rem', background: '#e0e7ff', borderRadius: '50%', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowRight size={20} strokeWidth={2.5} />
                  </div>
                  <p style={{ color: '#1e3a8a', fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                    Instead, we use small pictures called <strong style={{ color: '#0f172a', fontWeight: 800 }}>symbols</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Why Do We Use Symbols? */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--text-heading)', margin: '0 0 1rem 0' }}>Why Do We Use Symbols?</h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏫</div>
                  <h3 style={{ color: '#1e3a8a', fontSize: '1rem', margin: '0 0 0.5rem 0' }}>Buildings</h3>
                  <p style={{ color: '#1e40af', fontSize: '0.85rem', margin: 0 }}>Schools,<br/>Hospitals,<br/>Banks</p>
                </div>
                <div style={{ flex: 1, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛣️</div>
                  <h3 style={{ color: '#7f1d1d', fontSize: '1rem', margin: '0 0 0.5rem 0' }}>Roads</h3>
                  <p style={{ color: '#991b1b', fontSize: '0.85rem', margin: 0 }}>Roads,<br/>Railways,<br/>Bridges</p>
                </div>
                <div style={{ flex: 1, background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌳</div>
                  <h3 style={{ color: '#064e3b', fontSize: '1rem', margin: '0 0 0.5rem 0' }}>Nature</h3>
                  <p style={{ color: '#065f46', fontSize: '0.85rem', margin: 0 }}>Rivers,<br/>Trees,<br/>Lakes</p>
                </div>
              </div>
            </div>

            {/* Section 3: Examples of Symbols */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--text-heading)', margin: '0 0 1rem 0' }}>Examples of Symbols</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                {[
                  { name: 'Railway Line', Icon: SVGSymbols.RailwayBroad },
                  { name: 'Road', Icon: SVGSymbols.RoadMetalled },
                  { name: 'River', Icon: SVGSymbols.River },
                  { name: 'Bridge', Icon: SVGSymbols.Bridge },
                  { name: 'Temple', Icon: SVGSymbols.Temple },
                  { name: 'Post Office', Icon: SVGSymbols.PostOffice },
                  { name: 'Police Station', Icon: SVGSymbols.PoliceStation },
                  { name: 'Trees', Icon: SVGSymbols.Trees },
                  { name: 'Grass', Icon: SVGSymbols.Grass },
                  { name: 'Settlement', Icon: SVGSymbols.Settlement }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1.25rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ width: '80px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                      <item.Icon />
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', fontWeight: 'bold' }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Remember */}
            <div style={{ background: '#fffbeb', padding: '1.25rem', borderRadius: '12px', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '2rem' }}>
              <Lightbulb size={28} color="#d97706" flexShrink={0} />
              <p style={{ color: '#92400e', margin: 0, fontSize: '1.05rem', lineHeight: 1.5, fontWeight: 500 }}>
                <strong>Remember:</strong> Symbols help us show many places on a map without drawing everything.
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT PANEL: Interactive Activity */}
        <div style={{ flex: '1 1 50%', minWidth: '350px', padding: '2rem', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', position: 'relative', overflowY: 'auto' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Map size={28} color="#38bdf8" /> Let's Explore — Match the Symbols
              </h2>
              <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                Drag each symbol to the correct place.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <Award size={24} color={isComplete ? '#10b981' : 'var(--text-muted)'} />
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>
                Progress: {correctCount} / 8
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
                style={{ display: 'flex', gap: '2rem', flex: 1, minHeight: 0 }}
              >
                {/* Left Side: Question Panel */}
                <div style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', paddingRight: '1rem', scrollbarWidth: 'thin' }}>
                  {questions.map((q, idx) => {
                    const isMatched = matched[q.id];
                    const isError = errorHighlight === q.id;
                    
                    return (
                      <motion.div 
                        key={idx}
                        animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}}
                        transition={{ duration: 0.3 }}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          padding: '0.75rem 1.25rem', 
                          background: isMatched ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface)', 
                          borderRadius: '12px', 
                          border: `1px solid ${isMatched ? '#10b981' : isError ? '#ef4444' : 'var(--border)'}`,
                          transition: 'background-color 0.2s ease, border-color 0.2s ease',
                          boxShadow: isMatched ? '0 4px 10px rgba(16, 185, 129, 0.2)' : 'none'
                        }}
                      >
                        <span style={{ fontSize: '1rem', fontWeight: 'bold', color: isMatched ? '#10b981' : 'var(--text-primary)' }}>
                          {q.name}
                        </span>
                        
                        <div 
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, q)}
                          style={{ 
                            width: '100px', 
                            height: '50px', 
                            background: isMatched ? 'var(--bg-primary)' : 'rgba(0,0,0,0.05)', 
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
                              <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'white', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                <CheckCircle2 size={20} color="#10b981" />
                              </div>
                            </motion.div>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: isError ? '#ef4444' : 'var(--text-muted)' }}>
                              {isError ? 'Try again' : 'Drop Symbol'}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Right Side: Symbol Tray */}
                <div style={{ flex: '1 1 40%', background: 'var(--surface)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                  <AnimatePresence>
                    {traySymbols.map((symbol) => (
                      <motion.div
                        key={symbol.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, symbol)}
                        style={{
                          background: 'var(--card-bg)',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          cursor: 'grab',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '50px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          color: 'var(--text-primary)'
                        }}
                        whileHover={{ scale: 1.05, borderColor: 'var(--accent)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        whileTap={{ scale: 0.95, cursor: 'grabbing' }}
                      >
                        <symbol.Icon />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

              </motion.div>
            ) : (
              <motion.div 
                key="completion"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ 
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--surface)', 
                  padding: '3rem', 
                  borderRadius: '20px', 
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                  gap: '1.5rem'
                }}
              >
                <div style={{ width: '80px', height: '80px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem', boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' }}>
                  <Award size={40} color="white" />
                </div>
                
                <div>
                  <h3 style={{ fontSize: '2.5rem', color: '#10b981', margin: '0 0 0.5rem 0' }}>Excellent!</h3>
                  <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto', lineHeight: 1.5 }}>
                    You now know how maps use symbols to represent places.
                  </p>
                </div>

                <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px', fontWeight: 'bold', border: '2px solid rgba(16, 185, 129, 0.3)' }}>
                  🏆 Map Reader Badge
                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* Fixed Continue Button at bottom-right of the screen */}
          <AnimatePresence>
            {isComplete && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                style={{ position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 50 }}
              >
                <button 
                  onClick={onComplete} 
                  className="primary" 
                  style={{ 
                    padding: '1rem 2rem', 
                    fontSize: '1.1rem', 
                    fontWeight: 'bold', 
                    borderRadius: '99px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)', 
                    background: '#3b82f6', 
                    color: 'white', 
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
                >
                  Next Activity <ArrowRight size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
