import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, CheckCircle2, ArrowRight, Award, Map } from 'lucide-react';
import { ALL_SYMBOLS, SYMBOL_GROUPS, SymbolDisplay } from './symbolData';
import ChapterBackFooter from '../ChapterBackFooter';
import { ScrollableWithNav } from '../ContentScrollNav';

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

export default function MapSymbols({ onComplete, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [traySymbols, setTraySymbols] = useState([]);
  const [matched, setMatched] = useState({});
  const [errorHighlight, setErrorHighlight] = useState(null);
  const [leftPage, setLeftPage] = useState(1);
  const [selectedTraySymbol, setSelectedTraySymbol] = useState(null);

  useEffect(() => {
    const selectedIds = ['railway', 'road', 'river', 'lake', 'forest', 'hospital'];
    const selectedSymbols = ALL_SYMBOLS.filter(s => selectedIds.includes(s.id));
    setQuestions(selectedSymbols);
    setTraySymbols(shuffleArray(selectedSymbols));
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

  const executeMatch = (draggedSymbol, targetQuestion) => {
    if (draggedSymbol.id === targetQuestion.id) {
      playSound('success');
      setMatched(prev => ({ ...prev, [targetQuestion.id]: true }));
      setTraySymbols(prev => prev.filter(s => s.id !== draggedSymbol.id));
      setSelectedTraySymbol(null);
    } else {
      playSound('error');
      setErrorHighlight(targetQuestion.id);
      setTimeout(() => setErrorHighlight(null), 500);
    }
  };

  const handleDrop = (e, targetQuestion) => {
    e.preventDefault();
    try {
      const draggedStr = e.dataTransfer.getData('application/json');
      if (!draggedStr) return;
      const draggedSymbol = JSON.parse(draggedStr);
      executeMatch(draggedSymbol, targetQuestion);
    } catch (err) {
      console.error('Drop error', err);
    }
  };

  const handleTargetClick = (targetQuestion) => {
    if (matched[targetQuestion.id]) return;
    if (selectedTraySymbol) {
      executeMatch(selectedTraySymbol, targetQuestion);
    }
  };

  const correctCount = Object.keys(matched).length;
  const isComplete = questions.length > 0 && correctCount === questions.length;

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', background: '#ffffff', overflow: 'hidden', borderRadius: '24px', border: '1px solid #d6e0ec', boxShadow: '0 8px 30px rgba(14,42,69,0.08)' }}>
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        
        {/* LEFT PANEL: Textbook Content — Zero Scroll */}
        <div style={{ flex: '1 1 48%', minWidth: 0, minHeight: 0, background: 'linear-gradient(160deg, #F7F1E2, #EFE6D2)', borderRight: '1px solid #d6e0ec', display: 'flex', flexDirection: 'column', padding: 'clamp(1rem, 2vw, 1.5rem)', boxSizing: 'border-box', justifyContent: 'space-between', overflow: 'hidden' }}>
          
          {/* Header */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ display: 'inline-block', fontSize: '13px', fontWeight: 'bold', color: '#F5A623', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              CHAPTER 1 • SYMBOLS
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2rem)', color: '#0E3556', margin: '0 0 4px 0', fontFamily: 'serif', lineHeight: 1.15, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Map size={28} color="#F5A623" style={{ flexShrink: 0 }} />
              Understanding Map Symbols
            </h1>
            <p style={{ color: '#47586b', fontSize: '14px', fontStyle: 'italic', margin: '0 0 10px 0' }}>
              Small pictures that represent real places and features.
            </p>
          </div>

          {/* Left Sub-Page Viewport */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
            {leftPage === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'space-between' }}>
                {/* What are Symbols? */}
                <div style={{ background: '#ffffff', padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <h2 style={{ fontSize: '1.25rem', color: '#0E3556', margin: '0 0 6px 0', fontFamily: 'serif' }}>What are Symbols?</h2>
                  <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>
                    Real places are too large to draw exactly on a map. Instead of full buildings, roads, and rivers, we use standardized symbols.
                  </p>
                </div>

                {/* Real Place -> Map Symbol Table */}
                <div style={{ background: '#fff', border: '1px solid #d6e0ec', borderRadius: '14px', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', background: '#f1f5f9', padding: '10px 14px', fontWeight: 'bold', color: '#334155', borderBottom: '1px solid #d6e0ec', fontSize: '13px' }}>
                    <div style={{ flex: 1 }}>Real Feature</div>
                    <div style={{ width: '30px', textAlign: 'center' }}>→</div>
                    <div style={{ flex: 1 }}>Standard Map Symbol</div>
                  </div>
                  <div style={{ display: 'flex', padding: '10px 14px', borderBottom: '1px solid #e2e8f0', alignItems: 'center' }}>
                    <div style={{ flex: 1, color: '#475569', fontSize: '13px', fontWeight: 500 }}>Curved river line</div>
                    <div style={{ width: '30px', textAlign: 'center', color: '#94a3b8' }}>→</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <SymbolDisplay Icon={ALL_SYMBOLS.find(s => s.id === 'river')?.Icon} width={48} height={32} />
                      <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>River</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', padding: '10px 14px', borderBottom: '1px solid #e2e8f0', alignItems: 'center' }}>
                    <div style={{ flex: 1, color: '#475569', fontSize: '13px', fontWeight: 500 }}>Hospital building</div>
                    <div style={{ width: '30px', textAlign: 'center', color: '#94a3b8' }}>→</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <SymbolDisplay Icon={ALL_SYMBOLS.find(s => s.id === 'hospital')?.Icon} width={48} height={32} />
                      <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>Hospital</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', padding: '10px 14px', alignItems: 'center' }}>
                    <div style={{ flex: 1, color: '#475569', fontSize: '13px', fontWeight: 500 }}>Thick forest trees</div>
                    <div style={{ width: '30px', textAlign: 'center', color: '#94a3b8' }}>→</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <SymbolDisplay Icon={ALL_SYMBOLS.find(s => s.id === 'forest')?.Icon} width={48} height={32} />
                      <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>Forest</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {leftPage === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'space-between' }}>
                {/* Common Map Symbols */}
                <div style={{ background: '#ffffff', padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#0E3556', margin: '0 0 10px 0', fontFamily: 'serif' }}>Common Symbol Groups</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {SYMBOL_GROUPS[0].items.slice(0, 4).map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <SymbolDisplay Icon={item.Icon} width={42} height={28} />
                        <span style={{ fontSize: '13px', color: '#20303f', fontWeight: 700 }}>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remember */}
                <div style={{ background: '#fffbeb', padding: '14px 16px', borderRadius: '14px', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Lightbulb size={24} color="#d97706" style={{ flexShrink: 0 }} />
                  <p style={{ color: '#92400e', margin: 0, fontSize: '13px', lineHeight: 1.4, fontWeight: 500 }}>
                    <strong>Remember:</strong> Map symbols are standard drawings that make reading maps easy and clear across the world.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sub-Page Navigation Bar */}
          <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #d6e0ec', paddingTop: '10px', marginTop: '10px' }}>
            <button
              onClick={() => setLeftPage(1)}
              disabled={leftPage === 1}
              style={{
                fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: '13px',
                background: '#0E3556', color: '#fff', border: 'none', borderRadius: '999px',
                padding: '6px 14px', cursor: leftPage === 1 ? 'not-allowed' : 'pointer',
                opacity: leftPage === 1 ? 0.35 : 1
              }}
            >
              ◀ Back
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#5c6b7a' }}>
              <span>Page {leftPage} of 2</span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: leftPage === 1 ? '#0E3556' : '#cbd5e1' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: leftPage === 2 ? '#0E3556' : '#cbd5e1' }} />
            </div>

            <button
              onClick={() => setLeftPage(2)}
              disabled={leftPage === 2}
              style={{
                fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: '13px',
                background: '#0E3556', color: '#fff', border: 'none', borderRadius: '999px',
                padding: '6px 14px', cursor: leftPage === 2 ? 'not-allowed' : 'pointer',
                opacity: leftPage === 2 ? 0.35 : 1
              }}
            >
              Next ▶
            </button>
          </div>

        </div>

        {/* RIGHT PANEL: Interactive Match Activity — Structured 3x2 Grid & Horizontal Tray (Zero Scroll) */}
        <div style={{ flex: '1 1 52%', minWidth: 0, minHeight: 0, background: '#ffffff', display: 'flex', flexDirection: 'column', padding: 'clamp(1rem, 2vw, 1.5rem)', boxSizing: 'border-box', justifyContent: 'space-between', overflow: 'hidden' }}>
          
          {/* Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', gap: '12px', flexShrink: 0 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 'clamp(1.2rem, 1.8vw, 1.5rem)', color: '#0E3556', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Map size={22} color="#38bdf8" /> Match the Symbols
              </h2>
              <p style={{ margin: '2px 0 0 0', color: '#5c6b7a', fontSize: '13px' }}>
                Drag or click a symbol to place it in the matching box.
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#f8fafc', borderRadius: '999px', border: '1px solid #d6e0ec', flexShrink: 0 }}>
              <Award size={18} color={isComplete ? '#10b981' : '#5c6b7a'} />
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0E3556' }}>
                {correctCount} / {questions.length}
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isComplete ? (
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                
                {/* 3x2 Structured Grid for the 6 Question Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gridTemplateRows: 'repeat(2, 1fr)', gap: '10px', flex: 1, minHeight: 0 }}>
                  {questions.map((q) => {
                    const isMatched = matched[q.id];
                    const isError = errorHighlight === q.id;

                    return (
                      <motion.div
                        key={q.id}
                        animate={isError ? { x: [-4, 4, -4, 4, 0] } : {}}
                        transition={{ duration: 0.3 }}
                        onClick={() => handleTargetClick(q)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, q)}
                        style={{
                          background: isMatched ? '#f0fdf4' : isError ? '#fef2f2' : '#f8fafc',
                          border: `2px ${isMatched ? 'solid #16a34a' : isError ? 'solid #ef4444' : 'dashed #cbd5e1'}`,
                          borderRadius: '12px',
                          padding: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: selectedTraySymbol && !isMatched ? 'pointer' : 'default',
                          transition: 'all 0.2s',
                          boxShadow: isMatched ? '0 4px 12px rgba(22,163,74,0.12)' : 'none'
                        }}
                      >
                        <div style={{ fontSize: '13px', fontWeight: 800, color: isMatched ? '#15803d' : '#0E3556', textAlign: 'center' }}>
                          {q.name}
                        </div>

                        {isMatched ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a' }}>
                            <SymbolDisplay Icon={q.Icon} width={72} height={36} />
                            <CheckCircle2 size={18} color="#16a34a" />
                          </div>
                        ) : (
                          <div style={{ fontSize: '12px', color: isError ? '#ef4444' : '#64748b', fontWeight: 500 }}>
                            {isError ? 'Wrong symbol' : selectedTraySymbol ? 'Tap to place' : 'Drop symbol'}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Horizontal Tray across the bottom */}
                <div style={{ background: '#F3F7FC', border: '1px solid #e4ebf3', borderRadius: '14px', padding: '10px 14px', flexShrink: 0 }}>
                  <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0E3556', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
                    Available Symbols (Drag or Tap to Select)
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                    <AnimatePresence>
                      {traySymbols.map((symbol) => {
                        const isSelected = selectedTraySymbol?.id === symbol.id;

                        return (
                          <motion.div
                            key={symbol.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            draggable
                            onDragStart={(e) => handleDragStart(e, symbol)}
                            onClick={() => setSelectedTraySymbol(isSelected ? null : symbol)}
                            style={{
                              background: '#ffffff',
                              padding: '6px 10px',
                              borderRadius: '10px',
                              border: `2px solid ${isSelected ? '#3b82f6' : '#d6e0ec'}`,
                              cursor: 'grab',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              boxShadow: isSelected ? '0 0 0 3px rgba(59,130,246,0.25)' : '0 2px 6px rgba(0,0,0,0.05)',
                              transition: 'all 0.15s'
                            }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <SymbolDisplay Icon={symbol.Icon} width={64} height={32} />
                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#47586b', marginTop: '2px' }}>{symbol.name}</span>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>

              </div>
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
                  background: '#f0fdf4',
                  padding: '2rem',
                  borderRadius: '18px',
                  border: '1px solid #bbf7d0',
                  textAlign: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ width: '64px', height: '64px', background: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(22, 163, 74, 0.4)' }}>
                  <Award size={36} color="white" />
                </div>
                
                <div>
                  <h3 style={{ fontSize: '2rem', color: '#15803d', margin: '0 0 4px 0', fontFamily: 'serif' }}>All Symbols Matched!</h3>
                  <p style={{ fontSize: '14px', color: '#166534', maxWidth: '360px', margin: '0 auto', lineHeight: 1.5 }}>
                    You now understand standard map symbols and how they represent real geographical features.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
      <ChapterBackFooter
        onBack={onBack}
        nextLabel="Next Activity"
        onNext={onComplete}
        nextDisabled={!isComplete}
        nextVariant="green"
      />
    </div>
  );
}
