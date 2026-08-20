import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, CheckCircle2, ArrowRight, Award, Map } from 'lucide-react';
import { ALL_SYMBOLS, SYMBOL_GROUPS, SymbolDisplay } from './symbolData';
import ChapterBackFooter from '../ChapterBackFooter';

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
    <div style={{ width: '100%', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', background: 'linear-gradient(160deg, #F7F1E2 0%, #EFE6D2 100%)', overflow: 'hidden', borderRadius: '20px', border: '2px solid #F2DFBC', boxShadow: '0 8px 30px rgba(60,40,20,0.06)', fontFamily: '"Space Grotesk", sans-serif' }}>
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        
        {/* LEFT PANEL: Textbook Content — Light Orange Parchment Card (Zero Scroll) */}
        <div style={{ flex: '1 1 48%', minWidth: 0, minHeight: 0, background: 'linear-gradient(160deg, #FFF9F0 0%, #FBF3E3 100%)', borderRight: '2px solid #F2DFBC', display: 'flex', flexDirection: 'column', padding: 'clamp(1rem, 2vw, 1.5rem)', boxSizing: 'border-box', justifyContent: 'space-between', overflow: 'hidden' }}>
          
          {/* Header */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ display: 'inline-block', fontSize: '13px', fontWeight: 800, color: '#92400E', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px', background: '#FEF3C7', border: '1px solid #FDE68A', padding: '3px 10px', borderRadius: '6px' }}>
              CHAPTER 1 • SYMBOLS
            </div>
            <h1 style={{ fontSize: 'clamp(1.65rem, 2.4vw, 2.1rem)', color: '#78350F', margin: '2px 0 4px 0', fontFamily: '"Fraunces", serif', fontWeight: 900, lineHeight: 1.15, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Map size={28} color="#D97706" style={{ flexShrink: 0 }} />
              Understanding Map Symbols
            </h1>
            <p style={{ color: '#3D2E24', fontSize: '15px', fontStyle: 'italic', margin: '0 0 10px 0', fontWeight: 600 }}>
              Small drawings and shapes that represent real places on Earth.
            </p>
          </div>

          {/* Left Sub-Page Viewport */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
            {leftPage === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'space-between' }}>
                {/* What are Symbols? */}
                <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: '14px', border: '1.5px solid #F2DFBC', boxShadow: '0 2px 8px rgba(60,40,20,0.03)' }}>
                  <h2 style={{ fontSize: '1.3rem', color: '#92400E', margin: '0 0 6px 0', fontFamily: '"Fraunces", serif', fontWeight: 900 }}>What are Symbols?</h2>
                  <p style={{ color: '#3D2E24', fontSize: '15.5px', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                    Real places are too huge to draw exactly on a map. Instead of full buildings, roads, and rivers, we use standardized symbols.
                  </p>
                </div>

                {/* Real Place -> Map Symbol Table */}
                <div style={{ background: '#FFFFFF', border: '1.5px solid #F2DFBC', borderRadius: '14px', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', background: '#FEF3C7', padding: '10px 16px', fontWeight: 900, color: '#78350F', borderBottom: '1.5px solid #F2DFBC', fontSize: '14.5px' }}>
                    <div style={{ flex: 1 }}>Real Geographical Feature</div>
                    <div style={{ width: '36px', textAlign: 'center' }}>→</div>
                    <div style={{ flex: 1 }}>Standard Map Symbol</div>
                  </div>
                  <div style={{ display: 'flex', padding: '10px 16px', borderBottom: '1px solid #F2DFBC', alignItems: 'center' }}>
                    <div style={{ flex: 1, color: '#3D2E24', fontSize: '15.5px', fontWeight: 700 }}>Curved river line</div>
                    <div style={{ width: '36px', textAlign: 'center', color: '#B45309', fontWeight: 900, fontSize: '16px' }}>→</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <SymbolDisplay Icon={ALL_SYMBOLS.find(s => s.id === 'river')?.Icon} width={52} height={32} />
                      <span style={{ fontSize: '16px', color: '#1E40AF', fontWeight: 900 }}>River</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', padding: '10px 16px', borderBottom: '1px solid #F2DFBC', alignItems: 'center' }}>
                    <div style={{ flex: 1, color: '#3D2E24', fontSize: '15.5px', fontWeight: 700 }}>Hospital building</div>
                    <div style={{ width: '36px', textAlign: 'center', color: '#B45309', fontWeight: 900, fontSize: '16px' }}>→</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <SymbolDisplay Icon={ALL_SYMBOLS.find(s => s.id === 'hospital')?.Icon} width={52} height={32} />
                      <span style={{ fontSize: '16px', color: '#991B1B', fontWeight: 900 }}>Hospital</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', padding: '10px 16px', alignItems: 'center' }}>
                    <div style={{ flex: 1, color: '#3D2E24', fontSize: '15.5px', fontWeight: 700 }}>Thick forest trees</div>
                    <div style={{ width: '36px', textAlign: 'center', color: '#B45309', fontWeight: 900, fontSize: '16px' }}>→</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <SymbolDisplay Icon={ALL_SYMBOLS.find(s => s.id === 'forest')?.Icon} width={52} height={32} />
                      <span style={{ fontSize: '16px', color: '#166534', fontWeight: 900 }}>Forest</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {leftPage === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'space-between' }}>
                {/* Common Map Symbols */}
                <div style={{ background: '#FFFFFF', padding: '16px 18px', borderRadius: '14px', border: '1.5px solid #F2DFBC', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#92400E', margin: '0 0 12px 0', fontFamily: '"Fraunces", serif', fontWeight: 900 }}>Common Symbol Groups</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {SYMBOL_GROUPS[0].items.slice(0, 4).map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#FFF9F0', borderRadius: '10px', border: '1px solid #F2DFBC' }}>
                        <SymbolDisplay Icon={item.Icon} width={48} height={30} />
                        <span style={{ fontSize: '15.5px', color: '#3D2E24', fontWeight: 900 }}>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remember */}
                <div style={{ background: '#FEF3C7', padding: '14px 18px', borderRadius: '14px', border: '1.5px solid #FDE68A', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Lightbulb size={26} color="#D97706" style={{ flexShrink: 0 }} />
                  <p style={{ color: '#78350F', margin: 0, fontSize: '15px', lineHeight: 1.5, fontWeight: 700 }}>
                    <strong style={{ fontSize: '15.5px', fontWeight: 900 }}>Remember:</strong> Map symbols are standard drawings that make reading maps easy and clear across the world.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sub-Page Navigation Bar */}
          <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px solid #F2DFBC', paddingTop: '10px', marginTop: '10px' }}>
            <button
              onClick={() => setLeftPage(1)}
              disabled={leftPage === 1}
              style={{
                fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, fontSize: '13.5px',
                background: '#92400E', color: '#fff', border: 'none', borderRadius: '999px',
                padding: '6px 16px', cursor: leftPage === 1 ? 'not-allowed' : 'pointer',
                opacity: leftPage === 1 ? 0.35 : 1,
                boxShadow: leftPage === 1 ? 'none' : '0 2px 6px rgba(146,64,14,0.25)'
              }}
            >
              ◀ Back
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 800, color: '#78350F' }}>
              <span>Page {leftPage} of 2</span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: leftPage === 1 ? '#92400E' : '#E2D2B8' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: leftPage === 2 ? '#92400E' : '#E2D2B8' }} />
            </div>

            <button
              onClick={() => setLeftPage(2)}
              disabled={leftPage === 2}
              style={{
                fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, fontSize: '13.5px',
                background: '#F59E0B', color: '#fff', border: 'none', borderRadius: '999px',
                padding: '6px 16px', cursor: leftPage === 2 ? 'not-allowed' : 'pointer',
                opacity: leftPage === 2 ? 0.35 : 1,
                boxShadow: leftPage === 2 ? 'none' : '0 2px 6px rgba(245,158,11,0.3)'
              }}
            >
              Next ▶
            </button>
          </div>

        </div>

        {/* RIGHT PANEL: Interactive Match Activity — Structured 3x2 Grid & Horizontal Tray (Zero Scroll) */}
        <div style={{ flex: '1 1 52%', minWidth: 0, minHeight: 0, background: 'linear-gradient(160deg, #F7F1E2 0%, #EFE6D2 100%)', display: 'flex', flexDirection: 'column', padding: 'clamp(1rem, 2vw, 1.5rem)', boxSizing: 'border-box', justifyContent: 'space-between', overflow: 'hidden' }}>
          
          {/* Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', gap: '10px', flexShrink: 0 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 'clamp(1.2rem, 1.8vw, 1.45rem)', color: '#78350F', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: '"Fraunces", serif', fontWeight: 900 }}>
                <Map size={20} color="#D97706" /> Match the Symbols
              </h2>
              <p style={{ margin: '2px 0 0 0', color: '#3D2E24', fontSize: '12.5px', fontWeight: 600 }}>
                Drag or click a symbol to place it in the matching box.
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', background: '#FFF9F0', borderRadius: '999px', border: '1.5px solid #F2DFBC', flexShrink: 0 }}>
              <Award size={16} color={isComplete ? '#16A34A' : '#D97706'} />
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#78350F' }}>
                {correctCount} / {questions.length}
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isComplete ? (
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
                
                {/* 3x2 Structured Grid for the 6 Question Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gridTemplateRows: 'repeat(2, 1fr)', gap: '8px', flex: 1, minHeight: 0 }}>
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
                          background: isMatched ? '#DCFCE7' : isError ? '#FEE2E2' : '#FFFFFF',
                          border: `2px ${isMatched ? 'solid #16A34A' : isError ? 'solid #EF4444' : 'dashed #F2DFBC'}`,
                          borderRadius: '12px',
                          padding: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          cursor: selectedTraySymbol && !isMatched ? 'pointer' : 'default',
                          transition: 'all 0.2s',
                          boxShadow: isMatched ? '0 4px 12px rgba(22,163,74,0.12)' : '0 2px 6px rgba(60,40,20,0.03)'
                        }}
                      >
                        <div style={{ fontSize: '13px', fontWeight: 900, color: isMatched ? '#166534' : '#78350F', textAlign: 'center' }}>
                          {q.name}
                        </div>

                        {isMatched ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534' }}>
                            <SymbolDisplay Icon={q.Icon} width={68} height={34} />
                            <CheckCircle2 size={16} color="#16A34A" />
                          </div>
                        ) : (
                          <div style={{ fontSize: '11.5px', color: isError ? '#991B1B' : '#B45309', fontWeight: 700 }}>
                            {isError ? 'Wrong symbol' : selectedTraySymbol ? 'Tap to place' : 'Drop symbol'}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Horizontal Tray across the bottom */}
                <div style={{ background: '#FFF9F0', border: '1.5px solid #F2DFBC', borderRadius: '14px', padding: '8px 12px', flexShrink: 0 }}>
                  <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '11.5px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#92400E', fontWeight: 800, marginBottom: '6px', textAlign: 'center' }}>
                    Available Symbols (Drag or Tap to Select)
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
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
                              background: '#FFFFFF',
                              padding: '5px 8px',
                              borderRadius: '9px',
                              border: `2px solid ${isSelected ? '#D97706' : '#F2DFBC'}`,
                              cursor: 'grab',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              boxShadow: isSelected ? '0 0 0 3px rgba(217,119,6,0.25)' : '0 2px 6px rgba(60,40,20,0.04)',
                              transition: 'all 0.15s'
                            }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <SymbolDisplay Icon={symbol.Icon} width={58} height={28} />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#3D2E24', marginTop: '2px' }}>{symbol.name}</span>
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
                  background: 'linear-gradient(160deg, #FFF9F0 0%, #FBF3E3 100%)',
                  padding: '1.75rem',
                  borderRadius: '18px',
                  border: '2px solid #86EFAC',
                  textAlign: 'center',
                  gap: '10px'
                }}
              >
                <div style={{ width: '58px', height: '58px', background: '#16A34A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(22, 163, 74, 0.4)' }}>
                  <Award size={32} color="white" />
                </div>
                
                <div>
                  <h3 style={{ fontSize: '1.8rem', color: '#166534', margin: '0 0 4px 0', fontFamily: '"Fraunces", serif', fontWeight: 900 }}>All Symbols Matched!</h3>
                  <p style={{ fontSize: '13.5px', color: '#3D2E24', maxWidth: '340px', margin: '0 auto', lineHeight: 1.45, fontWeight: 700 }}>
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
