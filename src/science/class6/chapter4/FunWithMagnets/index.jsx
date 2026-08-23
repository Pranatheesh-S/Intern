import React, { useState } from 'react';
import { ArrowLeft, Compass, CheckCircle2, XCircle, ArrowRight, Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './FunWithMagnets.css';
import MazeGame from './MazeGame';
import CarGame from './CarGame';
import { useTheme } from '../../../../ThemeContext.jsx';
import DidYouKnow from '../SuspendedMagnet/DidYouKnow';

const STEPS_NAV = [
  { id: 0, label: "1. Predict" },
  { id: 1, label: "2. Steel Ball Maze" },
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
            padding: '0.6rem 1.4rem',
            borderRadius: '25px',
            border: '1.5px solid #CBD5E1',
            background: '#FFFFFF',
            color: '#1E293B',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
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
            padding: '0.6rem 1.95rem',
            borderRadius: '25px',
            border: 'none',
            background: canProceed ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#CBD5E1',
            color: canProceed ? '#FFFFFF' : '#64748B',
            fontWeight: 900,
            fontSize: '0.9rem',
            cursor: canProceed ? 'pointer' : 'not-allowed',
            boxShadow: canProceed ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none'
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
          <div style={{ width: '100%', maxWidth: '980px', maxHeight: '100%', overflowY: 'auto', background: '#FFFFFF', border: '1.5px solid #A7F3D0', borderRadius: '24px', padding: '1.25rem 1.75rem', boxShadow: '0 8px 25px rgba(6, 78, 59, 0.08)', boxSizing: 'border-box' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#D1FAE5', color: '#065F46', padding: '0.35rem 0.85rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1.2px', marginBottom: '0.65rem' }}>
              <Sparkles size={14} color="#065F46" /> SECTION 4.5 · FUN WITH MAGNETS
            </div>

            <h1 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#064E3B', fontWeight: 900, margin: '0 0 0.5rem 0' }}>
              Magnets can exert force and guide objects through materials.
            </h1>
            <p className="lead" style={{ fontSize: 'clamp(0.88rem, 1.5vw, 1.02rem)', lineHeight: '1.45', color: '#334155', margin: '0 0 1rem 0', fontWeight: 600 }}>
              You can guide a steel ball through a <strong>3D Illustrated Town Map Maze</strong> using a magnet underneath the board! Predict: how can a magnet guide and control a steel ball without touching it directly?
            </p>
            
            <div className="choices" style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {[
                { label: "The board is covered with sticky adhesive", ok: false, xp: 0 },
                { label: "Magnetic force acts through non-magnetic materials like the board to attract the steel ball", ok: true, xp: 10 },
                { label: "Gravity pulls the ball sideways", ok: false, xp: 0 },
                { label: "Static electricity controls the ball", ok: false, xp: 0 }
              ].map((c, idx) => {
                const isSelected = predictAns && predictAns.selectedIndex === idx;
                const isCorrect = c.ok;
                
                let bgColor = '#F8FAFC';
                let borderColor = '#CBD5E1';
                let textColor = '#1E293B';
                let icon = null;

                if (predictAns) {
                  if (isCorrect) {
                    bgColor = '#DCFCE7';
                    borderColor = '#16A34A';
                    textColor = '#065F46';
                    icon = <CheckCircle2 size={18} color="#16A34A" />;
                  } else if (isSelected) {
                    bgColor = '#FEE2E2';
                    borderColor = '#EF4444';
                    textColor = '#991B1B';
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
                      padding: '0.75rem 1.15rem',
                      borderRadius: '14px',
                      textAlign: 'left',
                      fontSize: 'clamp(0.88rem, 1.4vw, 0.98rem)',
                      fontWeight: 700,
                      background: bgColor,
                      border: `1.5px solid ${borderColor}`,
                      color: textColor,
                      cursor: predictAns ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="key" style={{ marginRight: '0.6rem', padding: '0.15rem 0.5rem', borderRadius: '6px', background: '#E2E8F0', fontSize: '0.8rem', color: '#0F172A', fontWeight: 800 }}>{['A','B','C','D'][idx]}</span>
                      {c.label}
                    </div>
                    {icon}
                  </button>
                );
              })}
            </div>
            
            {predictAns && (
              <div className="reveal show" style={{ marginTop: '0.85rem', padding: '0.85rem 1.15rem', background: '#F0FDF4', borderLeft: `5px solid ${predictAns.correct ? '#16A34A' : '#D97706'}`, border: '1.5px solid #A7F3D0', borderRadius: '16px', color: '#334155', fontWeight: 600, fontSize: '0.92rem' }}>
                <b style={{ color: predictAns.correct ? '#16A34A' : '#D97706' }}>{predictAns.correct ? '✓ Correct!' : '✗ Not quite.'} Magnetic Force Through Materials!</b> A magnet's invisible magnetic field passes through non-magnetic surfaces, pulling and guiding magnetic objects smoothly across the board!
              </div>
            )}
            {renderNav(predictAns !== null, "Play Steel Ball Maze")}
          </div>
        );
      case 1:
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {/* INITIAL INSTRUCTION POPUP MODAL */}
            <AnimatePresence>
              {showMazeInstructionModal && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(6, 78, 59, 0.45)',
                  backdropFilter: 'blur(8px)',
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
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #A7F3D0',
                      borderRadius: '24px',
                      padding: '2.5rem 3rem',
                      textAlign: 'center',
                      boxShadow: '0 20px 50px rgba(6, 78, 59, 0.2)',
                      maxWidth: '520px',
                      width: '90%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1.25rem'
                    }}
                  >
                    <h2 style={{ margin: 0, color: '#064E3B', fontSize: '1.8rem', fontWeight: 900 }}>
                      3D Town Map Steel Ball Maze 🏙️🔮
                    </h2>

                    <p style={{ margin: 0, color: '#334155', fontSize: '1.15rem', lineHeight: '1.5', fontWeight: 600 }}>
                      Slide the magnet underneath the board or use the <strong>Direction Controls</strong> to guide the 3D chrome steel ball along the asphalt roads from <strong>Railway Station 🚉</strong> to the <strong>Bank 🏛️</strong>!
                    </p>

                    <button
                      onClick={() => setShowMazeInstructionModal(false)}
                      style={{
                        padding: '1.1rem 3rem',
                        fontSize: '1.15rem',
                        fontWeight: 900,
                        borderRadius: '40px',
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        boxShadow: '0 6px 20px rgba(217, 119, 6, 0.45)',
                        transition: 'all 0.25s ease',
                        marginTop: '0.5rem'
                      }}
                    >
                      Start Map Maze <ArrowRight size={22} color="#FFFFFF" />
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

            {/* Solved Pop-up Overlay */}
            <AnimatePresence>
              {showMazeSolveModal && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(6, 78, 59, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    style={{ 
                      backgroundColor: '#FFFFFF', 
                      borderRadius: '24px', 
                      padding: '2.5rem 3rem', 
                      maxWidth: '520px', 
                      width: '90%',
                      textAlign: 'center', 
                      border: '1.5px solid #A7F3D0',
                      boxShadow: '0 20px 50px rgba(6, 78, 59, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1.25rem'
                    }}
                  >
                    <h2 style={{ margin: 0, color: '#064E3B', fontSize: '1.8rem', fontWeight: 900 }}>Bank Reached! 🏛️🎉</h2>
                    <p style={{ margin: 0, color: '#334155', fontSize: '1.15rem', lineHeight: '1.5', fontWeight: 600 }}>
                      Master Navigation! The magnet's pull reached through the board and safely guided the steel ball through the 3D Illustrated Town Map!
                    </p>
                    <button 
                      onClick={() => {
                        setShowMazeSolveModal(false);
                        go(2);
                      }}
                      style={{
                        padding: '1.1rem 3rem',
                        fontSize: '1.15rem',
                        fontWeight: 900,
                        borderRadius: '40px',
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        boxShadow: '0 6px 20px rgba(217, 119, 6, 0.45)',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      Next Activity <ArrowRight size={22} color="#FFFFFF" />
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
            <div style={{ width: '100%', maxWidth: '980px', maxHeight: '100%', overflowY: 'auto', background: '#FFFFFF', border: '1.5px solid #A7F3D0', borderRadius: '24px', padding: '1.25rem 1.75rem', boxShadow: '0 8px 25px rgba(6, 78, 59, 0.08)', boxSizing: 'border-box' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#D1FAE5', color: '#065F46', padding: '0.35rem 0.85rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1.2px', marginBottom: '0.65rem' }}>
                <Sparkles size={14} color="#065F46" /> ACTIVITY 2 · RUNAWAY CARS
              </div>
              <h1 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#064E3B', fontWeight: 900, margin: '0 0 0.4rem 0' }}>
                Make a toy car flee without touching it.
              </h1>
              <p className="lead" style={{ fontSize: 'clamp(0.85rem, 1.4vw, 0.98rem)', lineHeight: '1.45', color: '#334155', margin: '0 0 0.75rem 0', fontWeight: 600 }}>
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
                      color: '#FFFFFF',
                      fontWeight: 900,
                      fontSize: '0.95rem',
                      cursor: carPushing ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)'
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
                      border: '1.5px solid #CBD5E1',
                      background: '#FFFFFF',
                      color: '#1E293B',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: !carPushing ? 'not-allowed' : 'pointer',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
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
            <div style={{ width: '100%', maxWidth: '980px', maxHeight: '100%', overflowY: 'auto', background: '#FFFFFF', border: '1.5px solid #A7F3D0', borderRadius: '24px', padding: '1.25rem 1.75rem', boxShadow: '0 8px 25px rgba(6, 78, 59, 0.08)', boxSizing: 'border-box' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#D1FAE5', color: '#065F46', padding: '0.35rem 0.85rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1.2px', marginBottom: '0.65rem' }}>
                <Sparkles size={14} color="#065F46" /> MAGNET CARE & ASSESSMENT
              </div>
              <h1 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#064E3B', fontWeight: 900, margin: '0 0 0.4rem 0' }}>
                How should magnets be stored safely?
              </h1>
              <p className="lead" style={{ fontSize: 'clamp(0.85rem, 1.4vw, 0.98rem)', lineHeight: '1.45', color: '#334155', margin: '0 0 0.85rem 0', fontWeight: 600 }}>
                Test your knowledge on caring for magnets to maintain their magnetic strength.
              </p>

              <div className="choices" style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {[
                  { label: "Keep them near heating devices and hammer them periodically", ok: false },
                  { label: "Heat and knocking scrambled its magnetism; in future, store magnets in pairs with unlike poles together and avoid heat and drops", ok: true },
                  { label: "Magnets always fade in exactly six months; nothing can be done", ok: false },
                  { label: "The toolbox absorbed the pins; empty the toolbox", ok: false }
                ].map((c, idx) => {
                  const isSelected = qHard && qHard.selectedIndex === idx;
                  const isCorrect = c.ok;
                  
                  let bgColor = '#F8FAFC';
                  let borderColor = '#CBD5E1';
                  let textColor = '#1E293B';
                  let icon = null;

                  if (qHard) {
                    if (isCorrect) {
                      bgColor = '#DCFCE7';
                      borderColor = '#16A34A';
                      textColor = '#065F46';
                      icon = <CheckCircle2 size={18} color="#16A34A" />;
                    } else if (isSelected) {
                      bgColor = '#FEE2E2';
                      borderColor = '#EF4444';
                      textColor = '#991B1B';
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
                        padding: '0.75rem 1.15rem',
                        borderRadius: '14px',
                        textAlign: 'left',
                        fontSize: 'clamp(0.85rem, 1.3vw, 0.95rem)',
                        fontWeight: 700,
                        background: bgColor,
                        border: `1.5px solid ${borderColor}`,
                        color: textColor,
                        cursor: qHard ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.25s ease',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="key" style={{ marginRight: '0.6rem', padding: '0.15rem 0.5rem', borderRadius: '6px', background: '#E2E8F0', fontSize: '0.8rem', color: '#0F172A', fontWeight: 800 }}>{['A','B','C','D'][idx]}</span>
                        {c.label}
                      </div>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {qHard && (
                <div style={{ marginTop: '0.85rem' }}>
                  <div className="reveal show" style={{ padding: '0.85rem 1.15rem', background: '#F0FDF4', borderLeft: `5px solid ${qHard.correct ? '#16A34A' : '#D97706'}`, border: '1.5px solid #A7F3D0', borderRadius: '16px', color: '#334155', fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.85rem' }}>
                    <b style={{ color: qHard.correct ? '#16A34A' : '#D97706' }}>{qHard.correct ? '✓ Correct!' : '✗ Incorrect.'} Mistreatment weakened it - and careful storage prevents it.</b> Dropping, knocking and heat disturb the aligned tiny magnets inside. Store magnets in pairs with unlike poles together!
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'center' }}>
                    <button 
                      onClick={() => setShowFinalCompletionModal(true)}
                      style={{ padding: '0.85rem 2.5rem', borderRadius: '40px', border: 'none', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#FFFFFF', fontWeight: 900, fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 6px 20px rgba(217, 119, 6, 0.45)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      Finish Activity <Trophy size={18} color="#FFFFFF" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence>
              {showFinalCompletionModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 78, 59, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)' }}>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    style={{ 
                      backgroundColor: '#FFFFFF', 
                      borderRadius: '24px', 
                      padding: '2.5rem 3rem', 
                      maxWidth: '520px', 
                      width: '90%',
                      textAlign: 'center', 
                      border: '1.5px solid #A7F3D0',
                      boxShadow: '0 20px 50px rgba(6, 78, 59, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1.25rem'
                    }}
                  >
                    <h2 style={{ margin: 0, color: '#064E3B', fontSize: '1.8rem', fontWeight: 900 }}>Activity Completed! 🎉</h2>
                    <p style={{ margin: 0, color: '#334155', fontSize: '1.2rem', lineHeight: '1.5', fontWeight: 600 }}>
                      Outstanding job! You've mastered 3D town map navigation, runaway cars, and magnet care!
                    </p>

                    <button
                      onClick={() => {
                        if (onComplete) onComplete();
                        else if (onBackToDashboard) onBackToDashboard();
                      }}
                      style={{
                        padding: '1.1rem 3rem',
                        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '40px',
                        fontSize: '1.15rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        boxShadow: '0 6px 20px rgba(217, 119, 6, 0.4)',
                        transition: 'all 0.25s ease',
                        marginTop: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >
                      Return to Chapter Flow <ArrowRight size={22} color="#FFFFFF" />
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
      height: '100vh', 
      maxHeight: '100vh', 
      margin: '0 auto',
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden',
      boxSizing: 'border-box',
      padding: '0.4rem 0.75rem',
      backgroundColor: '#ECFDF5',
      position: 'relative',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div 
        style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(167, 243, 208, 0.45) 0%, rgba(236, 253, 245, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(253, 230, 138, 0.35) 0%, rgba(236, 253, 245, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr auto', 
        alignItems: 'center', 
        padding: '0.5rem 1rem',
        marginBottom: '0.5rem',
        background: '#FFFFFF',
        border: '1.5px solid #A7F3D0',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(6, 78, 59, 0.06)',
        flexShrink: 0,
        position: 'relative',
        zIndex: 100
      }}>
        <button 
          onClick={onBackToDashboard}
          style={{ 
            position: 'relative', zIndex: 100,
            padding: '0.5rem 1rem', 
            fontSize: '0.85rem', 
            gap: '0.45rem',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={16} color="#FFFFFF" /> Back to Chapter 4
        </button>

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem', color: '#064E3B', letterSpacing: '-0.01em' }}>
            <Compass size={24} style={{ color: '#D97706' }} />
            Activity 4.8: Fun with Magnets
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700 }}>Class 6 Science — 3D Town Map Maze & Runaway Cars Exploration</span>
        </div>

        <nav style={{ display: 'flex', gap: '0.4rem', margin: 0 }}>
          {STEPS_NAV.map(nav => {
            const isActive = step === nav.id;
            
            return (
              <button
                key={nav.id}
                onClick={() => go(nav.id)}
                style={{
                  padding: '0.5rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  border: isActive ? 'none' : '1.5px solid #CBD5E1',
                  background: isActive ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#F8FAFC',
                  color: isActive ? '#FFFFFF' : '#334155',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none'
                }}
              >
                {nav.label}
              </button>
            );
          })}
        </nav>
      </div>

      <main style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', width: '100%', position: 'relative', zIndex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {renderContent()}
      </main>

      <footer style={{ marginTop: '0.4rem', width: '100%', flexShrink: 0, position: 'relative', zIndex: 99999 }}>
        <DidYouKnow />
      </footer>
    </div>
  );
}
