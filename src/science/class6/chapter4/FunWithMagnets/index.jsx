import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Compass, CheckCircle2, XCircle, ArrowRight, Trophy, Sparkles, AlertCircle, MapPin, Milestone, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './FunWithMagnets.css';
import MazeGame, { getAvailableDirections, NODES_MAP, playRealisticTrainSound } from './MazeGame';
import { useTheme } from '../../../../ThemeContext.jsx';
import DidYouKnow from '../MagneticPoles/DidYouKnow';

const STEPS_NAV = [
  { id: 0, label: "1. Predict" },
  { id: 1, label: "2. Magnetic Town Expedition" },
  { id: 2, label: "3. Magnet Care & Quiz" }
];

export default function FunWithMagnets({ onBackToDashboard, onComplete }) {
  const { theme } = useTheme();
  
  const [step, setStep] = useState(0);
  const [xp, setXp] = useState(0);
  const [ext, setExt] = useState({});
  const [showMazeSolveModal, setShowMazeSolveModal] = useState(false);
  const [showFinalCompletionModal, setShowFinalCompletionModal] = useState(false);

  const [mazeVisitedCount, setMazeVisitedCount] = useState({ count: 1, total: 14 });
  const [currentNodeId, setCurrentNodeId] = useState('node_start');
  const [isMoving, setIsMoving] = useState(false);
  const [hintDir, setHintDir] = useState(null);

  const mazeResetRef = useRef(null);
  const mazeDirectionMoveRef = useRef(null);
  const mazeHintRef = useRef(null);

  const addXP = (n) => {
    setXp(prev => prev + n);
  };

  const go = (i) => {
    setStep(i);
  };

  const [predictAns, setPredictAns] = useState(null);
  const [qHard, setQHard] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
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
      {/* Soft Ambient Background Glows */}
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

      {/* Top Header Bar */}
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
        {/* Left: Back to Chapter 4 Button */}
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

        {/* Center: Title & Subtitle */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem', color: '#064E3B', letterSpacing: '-0.01em' }}>
            <Compass size={24} style={{ color: '#D97706' }} />
            Activity 4.5: Fun with Magnets
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700 }}>Class 6 Science — 3D Magnetic Town Expedition & Magnet Care</span>
        </div>

        {/* Right: Tabbed Step Navigation Pills */}
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

      {/* Main Active Stage Panel */}
      <main style={{ 
        width: '100%', 
        flex: 1, 
        minHeight: 0, 
        display: 'flex', 
        flexDirection: 'row', 
        overflow: 'hidden', 
        position: 'relative', 
        zIndex: 1,
        gap: '0.85rem'
      }}>
        {/* STEP 0: PREDICT (Centered Layout) */}
        {step === 0 && (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '820px', maxHeight: '100%', overflowY: 'auto', background: '#FFFFFF', border: '1.5px solid #A7F3D0', borderRadius: '24px', padding: '1.5rem 2rem', boxShadow: '0 10px 30px rgba(6, 78, 59, 0.08)', boxSizing: 'border-box', margin: '0 auto' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#D1FAE5', color: '#065F46', padding: '0.35rem 0.85rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1.2px', marginBottom: '0.65rem' }}>
                <Sparkles size={14} color="#065F46" /> SECTION 4.5 · FUN WITH MAGNETS
              </div>

              <h1 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#064E3B', fontWeight: 900, margin: '0 0 0.5rem 0' }}>
                Magnets can exert force and guide objects through materials.
              </h1>
              <p className="lead" style={{ fontSize: 'clamp(0.88rem, 1.5vw, 1.02rem)', lineHeight: '1.45', color: '#334155', margin: '0 0 1rem 0', fontWeight: 600 }}>
                You can guide a walking <strong>City Explorer</strong> across a <strong>3D Town Map</strong> using a leading magnet! Predict: how can a magnet guide and pull a walking explorer without touching directly?
              </p>
              
              <div className="choices" style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {[
                  { label: "The board is covered with sticky adhesive", ok: false, xp: 0 },
                  { label: "Magnetic force acts through non-magnetic materials to attract the magnetic badge", ok: true, xp: 10 },
                  { label: "Gravity pulls the walker sideways", ok: false, xp: 0 },
                  { label: "Static electricity controls the explorer", ok: false, xp: 0 }
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

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                <button 
                  disabled={!predictAns} 
                  onClick={() => go(1)}
                  style={{
                    padding: '0.75rem 2.2rem',
                    borderRadius: '25px',
                    border: 'none',
                    background: predictAns ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#CBD5E1',
                    color: predictAns ? '#FFFFFF' : '#64748B',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    cursor: predictAns ? 'pointer' : 'not-allowed',
                    boxShadow: predictAns ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                >
                  Start Town Expedition <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: MAGNETIC TOWN EXPEDITION */}
        {step === 1 && (
          <>
            {/* Left: Simulation Canvas Frame */}
            <div style={{ flex: '1.8', display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%', boxSizing: 'border-box' }}>
              <div
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  flex: 1, 
                  minHeight: '380px', 
                  borderRadius: '24px', 
                  overflow: 'hidden', 
                  border: '1.5px solid #A7F3D0', 
                  boxShadow: '0 12px 30px rgba(6, 78, 59, 0.12)',
                  background: '#0F2537',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MazeGame 
                  onSolve={() => {
                    setExt({ ...ext, maze: true });
                    addXP(200);
                    setShowMazeSolveModal(true);
                  }}
                  isSolved={ext.maze}
                  onVisitedCountChange={(count, total) => setMazeVisitedCount({ count, total })}
                  onNodeChange={(nodeId, moving) => {
                    setCurrentNodeId(nodeId);
                    setIsMoving(moving);
                  }}
                  hintDir={hintDir}
                  registerReset={(fn) => { mazeResetRef.current = fn; }}
                  registerDirectionMove={(fn) => { mazeDirectionMoveRef.current = fn; }}
                  registerHint={(fn) => { mazeHintRef.current = fn; }}
                />

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    zIndex: 40,
                    background: 'rgba(255, 255, 255, 0.92)',
                    border: '1.5px solid rgba(255, 255, 255, 0.85)',
                    borderRadius: '12px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    color: '#0F172A',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isFullscreen ? <Minimize2 size={14} color="#0F172A" /> : <Maximize2 size={14} color="#0F172A" />}
                  <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                </button>

                {/* Solved Overlay */}
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
                        <h2 style={{ margin: 0, color: '#064E3B', fontSize: '1.8rem', fontWeight: 900 }}>Destination Reached! 🎯🎉</h2>
                        <p style={{ margin: 0, color: '#334155', fontSize: '1.15rem', lineHeight: '1.5', fontWeight: 600 }}>
                          Outstanding navigation! The magnet smoothly guided the magnetic train (1 Engine + 1 Compartment) across the 3D railway grid to the destination beacon!
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
                          Next: Magnet Care <ArrowRight size={22} color="#FFFFFF" />
                        </button>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Control & Observation Panel */}
            <div style={{ 
              flex: '0.9', 
              background: '#FFFFFF', 
              border: '1.5px solid #A7F3D0', 
              borderRadius: '20px', 
              padding: '1.1rem 1.25rem', 
              boxShadow: '0 6px 20px rgba(6, 78, 59, 0.08)', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between', 
              gap: '0.75rem', 
              minWidth: 0,
              overflowY: 'auto' 
            }}>
              {/* Magnetic Principles Explanation Box */}
              <div style={{
                background: '#F8FAFC',
                border: '1.5px solid #CBD5E1',
                borderRadius: '16px',
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#064E3B', fontWeight: 900, fontSize: '0.9rem' }}>
                  <Sparkles size={18} color="#D97706" />
                  <span>How Magnetic Control Works:</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', color: '#334155', fontSize: '0.8rem', lineHeight: 1.45, fontWeight: 600 }}>
                  <p style={{ margin: 0 }}>
                    • Magnets have an invisible force field around them that works from a distance.
                  </p>
                  <p style={{ margin: 0 }}>
                    • Every magnet has two ends: a North (N) pole and a South (S) pole.
                  </p>
                  <p style={{ margin: 0 }}>
                    • Matching poles push away from each other (repel), while opposite poles pull toward each other (attract).
                  </p>
                  <p style={{ margin: 0 }}>
                    • By aiming the opposite pole at the train engine's magnetic nose sensor, an invisible magnetic pull is created.
                  </p>
                  <p style={{ margin: 0 }}>
                    • Moving your magnet ahead pulls the train smoothly along the track path without physical contact.
                  </p>
                </div>
              </div>

              {/* Fixed D-Pad HUD Control Box */}
              {(() => {
                const availableDirs = getAvailableDirections(currentNodeId);
                const currentStationName = NODES_MAP[currentNodeId]?.shortName || 'Grand';

                return (
                  <div style={{ 
                    background: '#0F172A', 
                    border: '2px solid #38BDF8', 
                    borderRadius: '18px', 
                    padding: '0.9rem 1rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.65rem',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)'
                  }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '0.45rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#BAE6FD', fontWeight: 900, fontSize: '0.82rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        <Compass size={15} color="#38BDF8" />
                        <span>D-PAD HUD CONTROLS</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 800, background: 'rgba(56, 189, 248, 0.15)', padding: '2px 8px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                        Station: {currentStationName}
                      </div>
                    </div>

                    {/* 3x3 D-Pad Buttons Matrix */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 48px)',
                      gridTemplateRows: 'repeat(3, 48px)',
                      gap: '6px',
                      margin: '0.1rem auto',
                      justifyContent: 'center',
                      opacity: isMoving ? 0.6 : 1
                    }}>
                      {/* NORTH */}
                      <button
                        type="button"
                        disabled={isMoving || !availableDirs['N']}
                        onClick={() => {
                          playRealisticTrainSound();
                          if (mazeDirectionMoveRef.current) mazeDirectionMoveRef.current('up');
                        }}
                        style={{
                          gridColumn: 2,
                          background: availableDirs['N'] ? '#1E293B' : '#0B1120',
                          color: availableDirs['N'] ? '#FFFFFF' : '#475569',
                          border: `2px solid ${hintDir === 'N' ? '#F59E0B' : (availableDirs['N'] ? '#38BDF8' : '#334155')}`,
                          borderRadius: '14px',
                          fontSize: '13px',
                          fontWeight: 900,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: (isMoving || !availableDirs['N']) ? 'not-allowed' : 'pointer',
                          boxShadow: hintDir === 'N' ? '0 0 14px #F59E0B' : (availableDirs['N'] ? '0 4px 10px rgba(56,189,248,0.25)' : 'none'),
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span style={{ fontSize: '11px', lineHeight: 1 }}>▲</span>
                        <span style={{ fontSize: '12px', lineHeight: 1, marginTop: '2px' }}>N</span>
                      </button>

                      {/* WEST */}
                      <button
                        type="button"
                        disabled={isMoving || !availableDirs['W']}
                        onClick={() => {
                          playRealisticTrainSound();
                          if (mazeDirectionMoveRef.current) mazeDirectionMoveRef.current('left');
                        }}
                        style={{
                          gridColumn: 1,
                          gridRow: 2,
                          background: availableDirs['W'] ? '#1E293B' : '#0B1120',
                          color: availableDirs['W'] ? '#FFFFFF' : '#475569',
                          border: `2px solid ${hintDir === 'W' ? '#F59E0B' : (availableDirs['W'] ? '#38BDF8' : '#334155')}`,
                          borderRadius: '14px',
                          fontSize: '13px',
                          fontWeight: 900,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: (isMoving || !availableDirs['W']) ? 'not-allowed' : 'pointer',
                          boxShadow: hintDir === 'W' ? '0 0 14px #F59E0B' : (availableDirs['W'] ? '0 4px 10px rgba(56,189,248,0.25)' : 'none'),
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span style={{ fontSize: '11px', lineHeight: 1 }}>◀</span>
                        <span style={{ fontSize: '12px', lineHeight: 1, marginTop: '2px' }}>W</span>
                      </button>

                      {/* CENTER STATION BADGE */}
                      <div style={{
                        gridColumn: 2,
                        gridRow: 2,
                        background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                        borderRadius: '14px',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '10.5px',
                        fontWeight: 900,
                        color: '#FFFFFF',
                        textAlign: 'center',
                        padding: '2px',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2), 0 4px 10px rgba(2,132,199,0.3)'
                      }}>
                        {currentStationName}
                      </div>

                      {/* EAST */}
                      <button
                        type="button"
                        disabled={isMoving || !availableDirs['E']}
                        onClick={() => {
                          playRealisticTrainSound();
                          if (mazeDirectionMoveRef.current) mazeDirectionMoveRef.current('right');
                        }}
                        style={{
                          gridColumn: 3,
                          gridRow: 2,
                          background: availableDirs['E'] ? '#1E293B' : '#0B1120',
                          color: availableDirs['E'] ? '#FFFFFF' : '#475569',
                          border: `2px solid ${hintDir === 'E' ? '#F59E0B' : (availableDirs['E'] ? '#38BDF8' : '#334155')}`,
                          borderRadius: '14px',
                          fontSize: '13px',
                          fontWeight: 900,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: (isMoving || !availableDirs['E']) ? 'not-allowed' : 'pointer',
                          boxShadow: hintDir === 'E' ? '0 0 14px #F59E0B' : (availableDirs['E'] ? '0 4px 10px rgba(56,189,248,0.25)' : 'none'),
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span style={{ fontSize: '11px', lineHeight: 1 }}>▶</span>
                        <span style={{ fontSize: '12px', lineHeight: 1, marginTop: '2px' }}>E</span>
                      </button>

                      {/* SOUTH */}
                      <button
                        type="button"
                        disabled={isMoving || !availableDirs['S']}
                        onClick={() => {
                          playRealisticTrainSound();
                          if (mazeDirectionMoveRef.current) mazeDirectionMoveRef.current('down');
                        }}
                        style={{
                          gridColumn: 2,
                          gridRow: 3,
                          background: availableDirs['S'] ? '#1E293B' : '#0B1120',
                          color: availableDirs['S'] ? '#FFFFFF' : '#475569',
                          border: `2px solid ${hintDir === 'S' ? '#F59E0B' : (availableDirs['S'] ? '#38BDF8' : '#334155')}`,
                          borderRadius: '14px',
                          fontSize: '13px',
                          fontWeight: 900,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: (isMoving || !availableDirs['S']) ? 'not-allowed' : 'pointer',
                          boxShadow: hintDir === 'S' ? '0 0 14px #F59E0B' : (availableDirs['S'] ? '0 4px 10px rgba(56,189,248,0.25)' : 'none'),
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span style={{ fontSize: '11px', lineHeight: 1 }}>▼</span>
                        <span style={{ fontSize: '12px', lineHeight: 1, marginTop: '2px' }}>S</span>
                      </button>
                    </div>

                    {/* Action Buttons: Hint & Reset */}
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (mazeHintRef.current) {
                            const nextDir = mazeHintRef.current();
                            setHintDir(nextDir);
                            setTimeout(() => setHintDir(null), 2500);
                          }
                        }}
                        disabled={isMoving}
                        style={{
                          flex: 1,
                          background: '#38BDF8',
                          border: 'none',
                          padding: '6px 10px',
                          borderRadius: '10px',
                          fontSize: '0.78rem',
                          color: '#0F172A',
                          fontWeight: 900,
                          cursor: isMoving ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          boxShadow: '0 3px 8px rgba(56,189,248,0.25)'
                        }}
                      >
                        💡 Hint
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (mazeResetRef.current) mazeResetRef.current();
                          setHintDir(null);
                        }}
                        disabled={isMoving}
                        style={{
                          flex: 1,
                          background: '#334155',
                          border: 'none',
                          padding: '6px 10px',
                          borderRadius: '10px',
                          fontSize: '0.78rem',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          cursor: isMoving ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <RotateCcw size={12} /> Reset
                      </button>
                    </div>

                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', textAlign: 'center', fontWeight: 600 }}>
                      Keyboard <strong>Arrow / WASD keys</strong> or click any node circle!
                    </div>

                    {/* Proceed Button */}
                    <button
                      onClick={() => go(2)}
                      disabled={!ext.maze}
                      style={{ 
                        width: '100%', 
                        padding: '0.7rem', 
                        fontSize: '0.88rem', 
                        fontWeight: 900, 
                        borderRadius: '12px', 
                        background: ext.maze ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#1E293B', 
                        color: ext.maze ? '#FFFFFF' : '#64748B', 
                        border: ext.maze ? 'none' : '1px solid #334155', 
                        cursor: ext.maze ? 'pointer' : 'not-allowed', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '0.45rem',
                        boxShadow: ext.maze ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none',
                        transition: 'all 0.25s ease',
                        marginTop: '0.15rem'
                      }}
                    >
                      Proceed to Magnet Care <ArrowRight size={15} color={ext.maze ? '#FFFFFF' : '#64748B'} />
                    </button>
                  </div>
                );
              })()}
            </div>
          </>
        )}

        {/* STEP 2: MAGNET CARE & ASSESSMENT */}
        {step === 2 && (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
            <div style={{ width: '100%', maxWidth: '820px', maxHeight: '100%', overflowY: 'auto', background: '#FFFFFF', border: '1.5px solid #A7F3D0', borderRadius: '24px', padding: '1.5rem 2rem', boxShadow: '0 10px 30px rgba(6, 78, 59, 0.08)', boxSizing: 'border-box' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#D1FAE5', color: '#065F46', padding: '0.35rem 0.85rem', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1.2px', marginBottom: '0.65rem' }}>
                <Sparkles size={14} color="#065F46" /> MAGNET CARE & ASSESSMENT
              </div>
              <h1 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: '#064E3B', fontWeight: 900, margin: '0 0 0.4rem 0' }}>
                How should magnets be stored safely?
              </h1>
              <p className="lead" style={{ fontSize: 'clamp(0.85rem, 1.4vw, 0.98rem)', lineHeight: '1.45', color: '#334155', margin: '0 0 0.85rem 0', fontWeight: 600 }}>
                Test your knowledge on caring for magnets to maintain their magnetic strength over time.
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
                    <b style={{ color: qHard.correct ? '#16A34A' : '#D97706' }}>{qHard.correct ? '✓ Correct!' : '✗ Incorrect.'} Mistreatment weakened it - and careful storage prevents it.</b> Dropping, knocking and heat disturb the aligned magnetic domains. Store magnets in pairs with unlike poles together!
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
                      Outstanding job! You've mastered 3D town map navigation and magnet care!
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
        )}
      </main>

      {/* Bottom Footer Bar */}
      <footer style={{ marginTop: '0.4rem', width: '100%', flexShrink: 0, position: 'relative', zIndex: 99999 }}>
        <DidYouKnow />
      </footer>
    </div>
  );
}
