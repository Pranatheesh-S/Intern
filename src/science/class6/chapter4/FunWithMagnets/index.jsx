import React, { useState } from 'react';
import { ArrowLeft, Compass, CheckCircle2, XCircle, ArrowRight, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './FunWithMagnets.css';
import MazeGame from './MazeGame';
import CarGame from './CarGame';
import { useTheme } from '../../../../ThemeContext.jsx';

const STEPS_NAV = [
  { id: 0, label: "1. Predict" },
  { id: 1, label: "2. Magnetic Maze" },
  { id: 2, label: "3. Runaway Cars" },
  { id: 3, label: "4. Magnet Care & Quiz" }
];

export default function FunWithMagnets({ onBackToDashboard, onComplete }) {
  const { theme } = useTheme();
  
  const [step, setStep] = useState(0);
  const [xp, setXp] = useState(0);
  const [ext, setExt] = useState({});
  const [showMazeInstructionModal, setShowMazeInstructionModal] = useState(true);
  const [showMazeSolveModal, setShowMazeSolveModal] = useState(false);
  const [showFinalCompletionModal, setShowFinalCompletionModal] = useState(false);

  const addXP = (n) => {
    setXp(prev => prev + n);
  };

  const go = (i) => {
    setStep(i);
    if (i === 1) {
      setShowMazeInstructionModal(true);
    }
  };

  const [predictAns, setPredictAns] = useState(null);
  const [carPushing, setCarPushing] = useState(false);
  const [qHard, setQHard] = useState(null);

  const renderNav = (canProceed, label = "Continue") => (
    <div className="btnrow" style={{ marginTop: '0.85rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
      {step > 0 && (
        <button 
          className="btn ghost" 
          onClick={() => go(step - 1)}
          style={{
            padding: '0.55rem 1.35rem',
            borderRadius: '25px',
            border: '2px solid #cbd5e1',
            background: '#ffffff',
            color: '#1e3a8a',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          Back
        </button>
      )}
      {step < STEPS_NAV.length - 1 && (
        <button 
          className="btn" 
          disabled={!canProceed} 
          onClick={() => go(step + 1)}
          style={{
            padding: '0.55rem 1.85rem',
            borderRadius: '25px',
            border: 'none',
            background: canProceed ? 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)' : '#cbd5e1',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: canProceed ? 'pointer' : 'not-allowed',
            boxShadow: canProceed ? '0 4px 14px rgba(244, 63, 94, 0.4)' : 'none'
          }}
        >
          {label}
        </button>
      )}
    </div>
  );

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div style={{ width: '100%', maxWidth: '980px', maxHeight: '100%', overflowY: 'auto', background: 'rgba(24, 24, 27, 0.95)', backdropFilter: 'blur(10px)', border: '1.5px solid #3F3F46', borderRadius: '24px', padding: '1.25rem 1.75rem', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', boxSizing: 'border-box' }}>
            <div className="kicker" style={{ fontSize: '0.78rem', color: '#F59E0B', fontWeight: 800, letterSpacing: '2px', marginBottom: '0.35rem' }}>
              SECTION 4.5 · FUN WITH MAGNETS
            </div>
            <h1 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#FFFFFF', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
              Magnets can move things without touching them.
            </h1>
            <p className="lead" style={{ fontSize: 'clamp(0.88rem, 1.5vw, 1.02rem)', lineHeight: '1.45', color: '#A1A1AA', margin: '0 0 1rem 0', fontWeight: 600 }}>
              Now that you know magnetism passes through non-magnetic materials, you can build toys and tricks. Predict: in a "magnetic maze," you move a magnet <b>under</b> a cardboard tray to guide a steel ball on top. What makes the ball move?
            </p>
            
            {/* Options with Red/Green feedback standard */}
            <div className="choices" style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {[
                { label: "You tilt the tray", ok: false, xp: 0 },
                { label: "The magnet's pull reaches through the cardboard and drags the steel ball", ok: true, xp: 10 },
                { label: "You blow on the ball", ok: false, xp: 0 },
                { label: "The ball rolls on its own", ok: false, xp: 0 }
              ].map((c, idx) => {
                const isSelected = predictAns && predictAns.selectedIndex === idx;
                const isCorrect = c.ok;
                
                let bgColor = '#27272A';
                let borderColor = '#3F3F46';
                let textColor = '#FAFAFA';
                let icon = null;

                if (predictAns) {
                  if (isCorrect) {
                    bgColor = 'rgba(34, 197, 94, 0.2)';
                    borderColor = '#22C55E';
                    textColor = '#86EFAC';
                    icon = <CheckCircle2 size={18} color="#22C55E" />;
                  } else if (isSelected) {
                    bgColor = 'rgba(239, 68, 68, 0.2)';
                    borderColor = '#EF4444';
                    textColor = '#FCA5A5';
                    icon = <XCircle size={18} color="#EF4444" />;
                  }
                }

                return (
                  <button 
                    key={idx} 
                    onClick={() => {
                      if (predictAns) return;
                      setPredictAns({ correct: c.ok, selectedIndex: idx });
                      if (c.ok) addXP(c.xp);
                    }}
                    style={{
                      padding: '0.65rem 1rem',
                      borderRadius: '12px',
                      textAlign: 'left',
                      fontSize: 'clamp(0.85rem, 1.4vw, 0.95rem)',
                      fontWeight: 700,
                      background: bgColor,
                      border: `1.5px solid ${borderColor}`,
                      color: textColor,
                      cursor: predictAns ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="key" style={{ marginRight: '0.6rem', padding: '0.15rem 0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>{['A','B','C','D'][idx]}</span>
                      {c.label}
                    </div>
                    {icon}
                  </button>
                );
              })}
            </div>
            
            {predictAns && (
              <div className="reveal show" style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: predictAns.correct ? 'rgba(34, 197, 94, 0.15)' : '#27272A', borderLeft: `4px solid ${predictAns.correct ? '#22C55E' : '#F59E0B'}`, borderRadius: '10px', color: '#FAFAFA', fontWeight: 600, fontSize: '0.9rem' }}>
                <b>{predictAns.correct ? '✓ Correct!' : '✗ Not quite.'} Magnetism through the cardboard!</b> The steel ball is a magnetic material, and the magnet's pull passes through the non-magnetic tray - so wherever you move the magnet, the ball follows. Let's play the maze!
              </div>
            )}
            {renderNav(predictAns !== null, "Play the Maze")}
          </div>
        );
      case 1:
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {/* INITIAL INSTRUCTION POPUP MODAL matching Activity 4.3 standard */}
            <AnimatePresence>
              {showMazeInstructionModal && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(6px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000
                }}>
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '30px',
                      padding: '2.5rem 3rem',
                      textAlign: 'center',
                      boxShadow: '0 15px 40px rgba(0, 0, 0, 0.18)',
                      maxWidth: '520px',
                      width: '90%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1.25rem'
                    }}
                  >
                    <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.8rem', fontWeight: 800 }}>
                      The Magnetic Maze
                    </h2>

                    <p style={{ margin: 0, color: '#475569', fontSize: '1.2rem', lineHeight: '1.5', fontWeight: 600 }}>
                      Guide the ball to the exit. Drag the magnet (under the tray) to pull the steel ball 🔵 through the cardboard to the green ✅ exit, without crossing the pink walls.
                    </p>

                    <button
                      onClick={() => setShowMazeInstructionModal(false)}
                      style={{
                        padding: '1.1rem 3rem',
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        borderRadius: '40px',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                        transition: 'all 0.25s ease',
                        marginTop: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.03)';
                        e.currentTarget.style.backgroundColor = '#1d4ed8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.backgroundColor = '#2563eb';
                      }}
                    >
                      Continue <ArrowRight size={22} color="#ffffff" />
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Main Edge-to-Edge Canvas Area */}
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
              <MazeGame 
                isSolved={ext.maze} 
                onSolve={() => {
                  if (!ext.maze) {
                    setExt(prev => ({...prev, maze: true}));
                    addXP(16);
                    setTimeout(() => {
                      setShowMazeSolveModal(true);
                    }, 1500);
                  }
                }} 
              />
            </div>

            {/* Solved Pop-up Overlay using standard Activity 4.3 Quiz Completion style */}
            <AnimatePresence>
              {showMazeSolveModal && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)' }}>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '30px', 
                      padding: '2.5rem 3rem', 
                      maxWidth: '520px', 
                      width: '90%',
                      textAlign: 'center', 
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 15px 40px rgba(0, 0, 0, 0.18)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1.25rem'
                    }}
                  >
                    <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.8rem', fontWeight: 800 }}>Maze Solved! 🎉</h2>
                    <p style={{ margin: 0, color: '#475569', fontSize: '1.2rem', lineHeight: '1.5', fontWeight: 600 }}>
                      Excellent job! The magnet's pull reached through the cardboard to guide the ball to the exit!
                    </p>
                    <button 
                      onClick={() => {
                        setShowMazeSolveModal(false);
                        go(2);
                      }}
                      style={{
                        padding: '1.1rem 3rem',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '40px',
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                        transition: 'all 0.25s ease',
                        marginTop: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.03)';
                        e.currentTarget.style.backgroundColor = '#1d4ed8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.backgroundColor = '#2563eb';
                      }}
                    >
                      Next Trick <ArrowRight size={22} color="#ffffff" />
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      case 2:
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
            <div style={{ width: '100%', maxWidth: '980px', maxHeight: '100%', overflowY: 'auto', background: 'rgba(24, 24, 27, 0.95)', backdropFilter: 'blur(10px)', border: '1.5px solid #3F3F46', borderRadius: '24px', padding: '1.25rem 1.75rem', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', boxSizing: 'border-box' }}>
              <div className="kicker" style={{ fontSize: '0.78rem', color: '#F59E0B', fontWeight: 800, letterSpacing: '2px', marginBottom: '0.35rem' }}>
                TRICK 2 · RUNAWAY CARS
              </div>
              <h1 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#FFFFFF', fontWeight: 800, margin: '0 0 0.4rem 0' }}>
                Make a toy car flee without touching it.
              </h1>
              <p className="lead" style={{ fontSize: 'clamp(0.85rem, 1.4vw, 0.98rem)', lineHeight: '1.45', color: '#A1A1AA', margin: '0 0 0.75rem 0', fontWeight: 600 }}>
                Fix a bar magnet on a toy car, and hold another magnet in your hand. Point <b>like poles</b> at each other (N toward N). Tap "Push" and watch.
              </p>
              
              <div className="sim" style={{ width: '100%' }}>
                <CarGame isPushing={carPushing} onComplete={() => {
                  if (!ext.cars) {
                    setExt(prev => ({...prev, cars: true}));
                    addXP(14);
                  }
                }} />
                
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button 
                    disabled={carPushing} 
                    onClick={() => setCarPushing(true)}
                    style={{
                      padding: '0.75rem 1.75rem',
                      borderRadius: '30px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: '#000000',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: carPushing ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
                    }}
                  >
                    Bring N pole toward car's N pole
                  </button>
                  <button 
                    disabled={!carPushing} 
                    onClick={() => setCarPushing(false)}
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderRadius: '30px',
                      border: '1.5px solid #3F3F46',
                      background: '#27272A',
                      color: '#FAFAFA',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: !carPushing ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Reset Car
                  </button>
                </div>
              </div>
              
              {renderNav(true)}
            </div>
          </div>
        );
      case 3:
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
            <div style={{ width: '100%', maxWidth: '980px', maxHeight: '100%', overflowY: 'auto', background: 'rgba(24, 24, 27, 0.95)', backdropFilter: 'blur(10px)', border: '1.5px solid #3F3F46', borderRadius: '24px', padding: '1.25rem 1.75rem', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', boxSizing: 'border-box' }}>
              <div className="kicker" style={{ fontSize: '0.78rem', color: '#F59E0B', fontWeight: 800, letterSpacing: '2px', marginBottom: '0.35rem' }}>
                MAGNET CARE & ASSESSMENT
              </div>
              <h1 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#FFFFFF', fontWeight: 800, margin: '0 0 0.4rem 0' }}>
                How should magnets be stored safely?
              </h1>
              <p className="lead" style={{ fontSize: 'clamp(0.85rem, 1.4vw, 0.98rem)', lineHeight: '1.45', color: '#A1A1AA', margin: '0 0 0.85rem 0', fontWeight: 600 }}>
                Test your knowledge on caring for magnets to maintain their magnetic strength.
              </p>

              {/* Red/Green feedback option buttons */}
              <div className="choices" style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {[
                  { label: "Keep them near heating devices and hammer them periodically", ok: false },
                  { label: "Heat and knocking scrambled its magnetism; in future, store magnets in pairs with unlike poles together and avoid heat and drops", ok: true },
                  { label: "Magnets always fade in exactly six months; nothing can be done", ok: false },
                  { label: "The toolbox absorbed the pins; empty the toolbox", ok: false }
                ].map((c, idx) => {
                  const isSelected = qHard && qHard.selectedIndex === idx;
                  const isCorrect = c.ok;
                  
                  let bgColor = '#27272A';
                  let borderColor = '#3F3F46';
                  let textColor = '#FAFAFA';
                  let icon = null;

                  if (qHard) {
                    if (isCorrect) {
                      bgColor = 'rgba(34, 197, 94, 0.2)';
                      borderColor = '#22C55E';
                      textColor = '#86EFAC';
                      icon = <CheckCircle2 size={18} color="#22C55E" />;
                    } else if (isSelected) {
                      bgColor = 'rgba(239, 68, 68, 0.2)';
                      borderColor = '#EF4444';
                      textColor = '#FCA5A5';
                      icon = <XCircle size={18} color="#EF4444" />;
                    }
                  }

                  return (
                    <button 
                      key={idx} 
                      onClick={() => {
                        if (qHard) return;
                        setQHard({ correct: c.ok, selectedIndex: idx });
                        if (c.ok) addXP(20);
                      }}
                      style={{
                        padding: '0.65rem 1rem',
                        borderRadius: '12px',
                        textAlign: 'left',
                        fontSize: 'clamp(0.82rem, 1.3vw, 0.92rem)',
                        fontWeight: 700,
                        background: bgColor,
                        border: `1.5px solid ${borderColor}`,
                        color: textColor,
                        cursor: qHard ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="key" style={{ marginRight: '0.6rem', padding: '0.15rem 0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>{['A','B','C','D'][idx]}</span>
                        {c.label}
                      </div>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {qHard && (
                <div style={{ marginTop: '0.85rem' }}>
                  <div className="reveal show" style={{ padding: '0.75rem 1rem', background: qHard.correct ? 'rgba(34, 197, 94, 0.15)' : '#27272A', borderLeft: `4px solid ${qHard.correct ? '#22C55E' : '#F59E0B'}`, borderRadius: '10px', color: '#FAFAFA', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.85rem' }}>
                    <b>{qHard.correct ? '✓ Correct!' : '✗ Incorrect.'} Mistreatment weakened it - and careful storage prevents it.</b> Dropping, knocking and heat disturb the aligned tiny magnets inside. Store magnets in pairs with unlike poles together!
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'center' }}>
                    <button 
                      onClick={() => setShowFinalCompletionModal(true)}
                      style={{ padding: '0.75rem 2.2rem', borderRadius: '40px', border: 'none', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#000000', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 6px 20px rgba(245, 158, 11, 0.45)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      Finish Activity <Trophy size={18} color="#000000" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Standard Activity 4.3 Quiz Completion Modal Style */}
            <AnimatePresence>
              {showFinalCompletionModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)' }}>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '30px', 
                      padding: '2.5rem 3rem', 
                      maxWidth: '520px', 
                      width: '90%',
                      textAlign: 'center', 
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 15px 40px rgba(0, 0, 0, 0.18)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1.25rem'
                    }}
                  >
                    <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.8rem', fontWeight: 800 }}>Activity Completed! 🎉</h2>
                    <p style={{ margin: 0, color: '#475569', fontSize: '1.2rem', lineHeight: '1.5', fontWeight: 600 }}>
                      Outstanding job! You've mastered magnetism through materials, maze navigation, runaway cars, and magnet care!
                    </p>

                    <button
                      onClick={() => {
                        if (onComplete) onComplete();
                        else if (onBackToDashboard) onBackToDashboard();
                      }}
                      style={{
                        padding: '1.1rem 3rem',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '40px',
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                        transition: 'all 0.25s ease',
                        marginTop: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.03)';
                        e.currentTarget.style.backgroundColor = '#1d4ed8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.backgroundColor = '#2563eb';
                      }}
                    >
                      Return to Chapter Flow <ArrowRight size={22} color="#ffffff" />
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height: 'calc(100vh - 16px)', 
      maxHeight: '100vh', 
      margin: '0 auto', 
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden',
      boxSizing: 'border-box',
      padding: '0.5rem 0.75rem',
      backgroundColor: '#09090B',
      position: 'relative'
    }}>
      {/* High Quality Recognizeable Physics Lab Background with Controlled Blur */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('/MagneticPoles/vintage_lab_bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(3px) brightness(1.18) contrast(0.96)',
          transform: 'scale(1.02)',
          zIndex: 0
        }}
      />

      {/* Dark Vector Overlay */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(9, 9, 11, 0.45)',
          zIndex: 0
        }}
      />

      {/* Magnetic Field Vector Lines SVG */}
      <svg 
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }} 
        viewBox="0 0 1440 900" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M-100 450 C 200 100, 500 100, 720 450 C 940 800, 1240 800, 1540 450" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="3" fill="none" />
        <path d="M-100 450 C 200 180, 500 180, 720 450 C 940 720, 1240 720, 1540 450" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="3" fill="none" />
      </svg>

      {/* Top Header Bar with Midnight Carbon Contrast Theme */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr auto', 
        alignItems: 'center', 
        padding: '0.45rem 0.85rem',
        marginBottom: '0.4rem',
        background: 'rgba(9, 9, 11, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid #3F3F46',
        borderRadius: '16px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6), 0 0 15px rgba(245, 158, 11, 0.15)',
        flexShrink: 0,
        position: 'relative',
        zIndex: 100
      }}>
        {/* Left Column: Back Button */}
        <button 
          onClick={onBackToDashboard}
          style={{ 
            position: 'relative', zIndex: 100,
            padding: '0.45rem 0.95rem', 
            fontSize: '0.82rem', 
            gap: '0.4rem',
            background: '#18181B',
            color: '#FFFFFF',
            border: '1px solid #3F3F46',
            borderRadius: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={16} color="#FFFFFF" /> Back to Class 6 Chapter 4
        </button>

        {/* Center Column: Title */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            <Compass size={22} style={{ color: '#F59E0B', filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))' }} />
            Activity 4.8: Fun with Magnets
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#71717A', fontWeight: 600 }}>Class 6 Science: Chapter 4 — Maze & Runaway Cars Exploration</span>
        </div>

        {/* Right Column: Navigation Tabs */}
        <nav className="tabs-container" style={{ display: 'flex', gap: '0.35rem', margin: 0 }}>
          {STEPS_NAV.map(nav => {
            const isActive = step === nav.id;
            
            return (
              <button
                key={nav.id}
                onClick={() => go(nav.id)}
                style={{
                  padding: '0.45rem 0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  border: isActive ? 'none' : '1px solid #3F3F46',
                  background: isActive ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#18181B',
                  color: isActive ? '#000000' : '#71717A',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 14px rgba(245, 158, 11, 0.4)' : 'none'
                }}
              >
                {nav.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Full-Width Interactive Stage Area */}
      <main style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', width: '100%', position: 'relative', zIndex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {renderContent()}
      </main>
    </div>
  );
}
