import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Compass, CheckCircle2, XCircle, ArrowRight, Trophy, Sparkles, AlertCircle, MapPin, Milestone, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './FunWithMagnets.css';
import MazeGame, { getAvailableDirections, NODES_MAP, playElectricLightningSound } from './MazeGame';
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
        padding: '0.65rem 1.25rem',
        marginBottom: '0.65rem',
        background: '#FFFFFF',
        border: '2px solid #A7F3D0',
        borderRadius: '24px',
        boxShadow: '0 6px 24px rgba(6, 78, 59, 0.07)',
        flexShrink: 0,
        position: 'relative',
        zIndex: 100
      }}>
        {/* Left: Back to Chapter 4 Button */}
        <button 
          onClick={onBackToDashboard}
          style={{ 
            position: 'relative', zIndex: 100,
            padding: '0.6rem 1.15rem', 
            fontSize: '0.92rem', 
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '14px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={18} color="#FFFFFF" /> Back to Chapter 4
        </button>

        {/* Center: Title & Subtitle */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.42rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', color: '#064E3B', letterSpacing: '-0.02em' }}>
            <Compass size={28} style={{ color: '#D97706' }} />
            Activity 4.5: Fun with Magnets
          </h2>
          <span style={{ fontSize: '0.88rem', color: '#047857', fontWeight: 800 }}>Class 6 Science — 3D Magnetic Town Expedition & Magnet Care</span>
        </div>

        {/* Right: Tabbed Step Navigation Pills */}
        <nav style={{ display: 'flex', gap: '0.5rem', margin: 0 }}>
          {STEPS_NAV.map(nav => {
            const isActive = step === nav.id;
            
            return (
              <button
                key={nav.id}
                onClick={() => go(nav.id)}
                style={{
                  padding: '0.6rem 1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  border: isActive ? 'none' : '1.5px solid #CBD5E1',
                  background: isActive ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#F8FAFC',
                  color: isActive ? '#FFFFFF' : '#334155',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: 900,
                  fontSize: '0.92rem',
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
        {/* STEP 0: PREDICT */}
        {step === 0 && (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
            <div style={{ width: '100%', maxWidth: '1000px', maxHeight: '100%', overflowY: 'auto', background: '#FFFFFF', border: '2px solid #A7F3D0', borderRadius: '24px', padding: '2rem 2.5rem', boxShadow: '0 10px 32px rgba(6, 78, 59, 0.08)', boxSizing: 'border-box', margin: '0 auto' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#D1FAE5', color: '#065F46', padding: '0.4rem 0.95rem', borderRadius: '18px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1.2px', marginBottom: '0.75rem' }}>
                <Sparkles size={16} color="#065F46" /> SECTION 4.5 · FUN WITH MAGNETS
              </div>

              <h1 style={{ fontSize: '1.45rem', color: '#064E3B', fontWeight: 900, margin: '0 0 0.6rem 0', lineHeight: 1.3 }}>
                Magnets can exert force and guide objects through materials.
              </h1>
              <p className="lead" style={{ fontSize: '1.12rem', lineHeight: 1.6, color: '#334155', margin: '0 0 1.2rem 0', fontWeight: 600 }}>
                You can guide a walking <strong>City Explorer</strong> across a <strong>3D Town Map</strong> using a leading magnet! Predict: how can a magnet guide and pull a walking explorer without touching directly?
              </p>
              
              <div className="choices" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                      icon = <CheckCircle2 size={22} color="#16A34A" />;
                    } else if (isSelected) {
                      bgColor = '#FEE2E2';
                      borderColor = '#EF4444';
                      textColor = '#991B1B';
                      icon = <XCircle size={22} color="#EF4444" />;
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
                        padding: '1.05rem 1.4rem',
                        borderRadius: '16px',
                        textAlign: 'left',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        background: bgColor,
                        border: `2px solid ${borderColor}`,
                        color: textColor,
                        cursor: predictAns ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="key" style={{ marginRight: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '8px', background: '#E2E8F0', fontSize: '0.88rem', color: '#0F172A', fontWeight: 900 }}>{['A','B','C','D'][idx]}</span>
                        {c.label}
                      </div>
                      {icon}
                    </button>
                  );
                })}
              </div>
              
              {predictAns && (
                <div className="reveal show" style={{ marginTop: '1rem', padding: '1rem 1.35rem', background: '#F0FDF4', borderLeft: `5px solid ${predictAns.correct ? '#16A34A' : '#D97706'}`, border: '1.5px solid #A7F3D0', borderRadius: '18px', color: '#334155', fontWeight: 600, fontSize: '1rem', lineHeight: 1.55 }}>
                  <b style={{ color: predictAns.correct ? '#16A34A' : '#D97706' }}>{predictAns.correct ? '✓ Correct!' : '✗ Not quite.'} Magnetic Force Through Materials!</b> A magnet's invisible magnetic field passes through non-magnetic surfaces, pulling and guiding magnetic objects smoothly across the board!
                </div>
              )}

              <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center' }}>
                <button 
                  disabled={!predictAns} 
                  onClick={() => go(1)}
                  style={{
                    padding: '0.95rem 2.6rem',
                    borderRadius: '30px',
                    border: 'none',
                    background: predictAns ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#CBD5E1',
                    color: predictAns ? '#FFFFFF' : '#64748B',
                    fontWeight: 900,
                    fontSize: '1.05rem',
                    cursor: predictAns ? 'pointer' : 'not-allowed',
                    boxShadow: predictAns ? '0 4px 16px rgba(217, 119, 6, 0.4)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    transition: 'all 0.25s ease'
                  }}
                >
                  Start Town Expedition <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: MAGNETIC TOWN EXPEDITION */}
        {step === 1 && (
          <>
            {/* Left: Simulation Canvas Frame */}
            <div style={{ flex: '1.7', display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%', boxSizing: 'border-box' }}>
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
              flex: '1.05', 
              background: '#FFFFFF', 
              border: '2px solid #A7F3D0', 
              borderRadius: '24px', 
              padding: '1.4rem 1.5rem', 
              boxShadow: '0 10px 32px rgba(6, 78, 59, 0.08)', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between', 
              gap: '1rem', 
              minWidth: 0,
              overflowY: 'auto' 
            }}>
              {/* Magnetic Principles Explanation Box */}
              <div style={{
                background: '#F8FAFC',
                border: '2px solid #CBD5E1',
                borderRadius: '20px',
                padding: '1.2rem 1.35rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#064E3B', fontWeight: 900, fontSize: '1.18rem' }}>
                  <Sparkles size={22} color="#D97706" />
                  <span>How Electromagnetic Control Works:</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', color: '#334155', fontSize: '0.94rem', lineHeight: 1.55, fontWeight: 600 }}>
                  <p style={{ margin: 0 }}>
                    • Miniature electromagnetic poles emerge at connected junction track nodes.
                  </p>
                  <p style={{ margin: 0 }}>
                    • Selecting a destination pole triggers a high-energy yellow electrifying lightning line.
                  </p>
                  <p style={{ margin: 0 }}>
                    • The yellow lightning tether attaches directly to the locomotive's front magnetic sensor.
                  </p>
                  <p style={{ margin: 0 }}>
                    • This magnetic lightning energy line exerts strong attraction, pulling the train smoothly along the railway tracks!
                  </p>
                  <p style={{ margin: 0 }}>
                    • Use the on-screen poles or the D-Pad to guide your expedition all the way to the destination beacon 🎯!
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
                    border: '2.5px solid #38BDF8', 
                    borderRadius: '20px', 
                    padding: '1.15rem 1.25rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.8rem',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.55)'
                  }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.55rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#BAE6FD', fontWeight: 900, fontSize: '0.92rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        <Compass size={18} color="#38BDF8" />
                        <span>D-PAD HUD CONTROLS</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#38BDF8', fontWeight: 900, background: 'rgba(56, 189, 248, 0.15)', padding: '3px 10px', borderRadius: '10px', border: '1.5px solid rgba(56, 189, 248, 0.35)' }}>
                        Station: {currentStationName}
                      </div>
                    </div>

                    {/* 3x3 D-Pad Buttons Matrix */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 56px)',
                      gridTemplateRows: 'repeat(3, 56px)',
                      gap: '8px',
                      margin: '0.2rem auto',
                      justifyContent: 'center',
                      opacity: isMoving ? 0.6 : 1
                    }}>
                      {/* NORTH */}
                      <button
                        type="button"
                        disabled={isMoving || !availableDirs['N']}
                        onClick={() => {
                          playElectricLightningSound();
                          if (mazeDirectionMoveRef.current) mazeDirectionMoveRef.current('up');
                        }}
                        style={{
                          gridColumn: 2,
                          background: availableDirs['N'] ? '#1E293B' : '#0B1120',
                          color: availableDirs['N'] ? '#FFFFFF' : '#475569',
                          border: `2px solid ${hintDir === 'N' ? '#F59E0B' : (availableDirs['N'] ? '#38BDF8' : '#334155')}`,
                          borderRadius: '16px',
                          fontSize: '14px',
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
                        <span style={{ fontSize: '13px', lineHeight: 1 }}>▲</span>
                        <span style={{ fontSize: '14px', lineHeight: 1, marginTop: '2px' }}>N</span>
                      </button>

                      {/* WEST */}
                      <button
                        type="button"
                        disabled={isMoving || !availableDirs['W']}
                        onClick={() => {
                          playElectricLightningSound();
                          if (mazeDirectionMoveRef.current) mazeDirectionMoveRef.current('left');
                        }}
                        style={{
                          gridColumn: 1,
                          gridRow: 2,
                          background: availableDirs['W'] ? '#1E293B' : '#0B1120',
                          color: availableDirs['W'] ? '#FFFFFF' : '#475569',
                          border: `2px solid ${hintDir === 'W' ? '#F59E0B' : (availableDirs['W'] ? '#38BDF8' : '#334155')}`,
                          borderRadius: '16px',
                          fontSize: '14px',
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
                        <span style={{ fontSize: '13px', lineHeight: 1 }}>◀</span>
                        <span style={{ fontSize: '14px', lineHeight: 1, marginTop: '2px' }}>W</span>
                      </button>

                      {/* CENTER STATION BADGE */}
                      <div style={{
                        gridColumn: 2,
                        gridRow: 2,
                        background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                        borderRadius: '16px',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '11.5px',
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
                          playElectricLightningSound();
                          if (mazeDirectionMoveRef.current) mazeDirectionMoveRef.current('right');
                        }}
                        style={{
                          gridColumn: 3,
                          gridRow: 2,
                          background: availableDirs['E'] ? '#1E293B' : '#0B1120',
                          color: availableDirs['E'] ? '#FFFFFF' : '#475569',
                          border: `2px solid ${hintDir === 'E' ? '#F59E0B' : (availableDirs['E'] ? '#38BDF8' : '#334155')}`,
                          borderRadius: '16px',
                          fontSize: '14px',
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
                        <span style={{ fontSize: '13px', lineHeight: 1 }}>▶</span>
                        <span style={{ fontSize: '14px', lineHeight: 1, marginTop: '2px' }}>E</span>
                      </button>

                      {/* SOUTH */}
                      <button
                        type="button"
                        disabled={isMoving || !availableDirs['S']}
                        onClick={() => {
                          playElectricLightningSound();
                          if (mazeDirectionMoveRef.current) mazeDirectionMoveRef.current('down');
                        }}
                        style={{
                          gridColumn: 2,
                          gridRow: 3,
                          background: availableDirs['S'] ? '#1E293B' : '#0B1120',
                          color: availableDirs['S'] ? '#FFFFFF' : '#475569',
                          border: `2px solid ${hintDir === 'S' ? '#F59E0B' : (availableDirs['S'] ? '#38BDF8' : '#334155')}`,
                          borderRadius: '16px',
                          fontSize: '14px',
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
                        <span style={{ fontSize: '13px', lineHeight: 1 }}>▼</span>
                        <span style={{ fontSize: '14px', lineHeight: 1, marginTop: '2px' }}>S</span>
                      </button>
                    </div>

                    {/* Action Button: Reset */}
                    <button
                      type="button"
                      onClick={() => {
                        if (mazeResetRef.current) mazeResetRef.current();
                        setHintDir(null);
                      }}
                      disabled={isMoving}
                      style={{
                        width: '100%',
                        background: '#334155',
                        border: '1px solid rgba(255,255,255,0.15)',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        fontSize: '0.92rem',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        cursor: isMoving ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginTop: '0.2rem'
                      }}
                    >
                      <RotateCcw size={16} /> Reset Expedition
                    </button>

                    {/* Proceed Button */}
                    <button
                      onClick={() => go(2)}
                      disabled={!ext.maze}
                      style={{ 
                        width: '100%', 
                        padding: '0.95rem 1.4rem', 
                        fontSize: '1.05rem', 
                        fontWeight: 900, 
                        borderRadius: '16px', 
                        background: ext.maze ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#1E293B', 
                        color: ext.maze ? '#FFFFFF' : '#64748B', 
                        border: ext.maze ? 'none' : '1px solid #334155', 
                        cursor: ext.maze ? 'pointer' : 'not-allowed', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '0.55rem',
                        boxShadow: ext.maze ? '0 4px 16px rgba(217, 119, 6, 0.4)' : 'none',
                        transition: 'all 0.25s ease',
                        marginTop: '0.25rem'
                      }}
                    >
                      Proceed to Magnet Care <ArrowRight size={18} color={ext.maze ? '#FFFFFF' : '#64748B'} />
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
            <div style={{ width: '100%', maxWidth: '1000px', maxHeight: '100%', overflowY: 'auto', background: '#FFFFFF', border: '2px solid #A7F3D0', borderRadius: '24px', padding: '2rem 2.5rem', boxShadow: '0 10px 32px rgba(6, 78, 59, 0.08)', boxSizing: 'border-box' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#D1FAE5', color: '#065F46', padding: '0.4rem 0.95rem', borderRadius: '18px', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1.2px', marginBottom: '0.75rem' }}>
                <Sparkles size={16} color="#065F46" /> MAGNET CARE & ASSESSMENT
              </div>
              <h1 style={{ fontSize: '1.45rem', color: '#064E3B', fontWeight: 900, margin: '0 0 0.6rem 0', lineHeight: 1.3 }}>
                How should magnets be stored safely?
              </h1>
              <p className="lead" style={{ fontSize: '1.12rem', lineHeight: 1.6, color: '#334155', margin: '0 0 1.2rem 0', fontWeight: 600 }}>
                Test your knowledge on caring for magnets to maintain their magnetic strength over time.
              </p>

              <div className="choices" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                      icon = <CheckCircle2 size={22} color="#16A34A" />;
                    } else if (isSelected) {
                      bgColor = '#FEE2E2';
                      borderColor = '#EF4444';
                      textColor = '#991B1B';
                      icon = <XCircle size={22} color="#EF4444" />;
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
                        padding: '1.05rem 1.4rem',
                        borderRadius: '16px',
                        textAlign: 'left',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        background: bgColor,
                        border: `2px solid ${borderColor}`,
                        color: textColor,
                        cursor: qHard ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.25s ease',
                        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="key" style={{ marginRight: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '8px', background: '#E2E8F0', fontSize: '0.88rem', color: '#0F172A', fontWeight: 900 }}>{['A','B','C','D'][idx]}</span>
                        {c.label}
                      </div>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {qHard && (
                <div style={{ marginTop: '1rem' }}>
                  <div className="reveal show" style={{ padding: '1rem 1.35rem', background: '#F0FDF4', borderLeft: `5px solid ${qHard.correct ? '#16A34A' : '#D97706'}`, border: '1.5px solid #A7F3D0', borderRadius: '18px', color: '#334155', fontWeight: 600, fontSize: '1rem', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                    <b style={{ color: qHard.correct ? '#16A34A' : '#D97706' }}>{qHard.correct ? '✓ Correct!' : '✗ Incorrect.'} Mistreatment weakened it - and careful storage prevents it.</b> Dropping, knocking and heat disturb the aligned magnetic domains. Store magnets in pairs with unlike poles together!
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'center' }}>
                    <button 
                      onClick={() => setShowFinalCompletionModal(true)}
                      style={{ padding: '0.95rem 2.6rem', borderRadius: '30px', border: 'none', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#FFFFFF', fontWeight: 900, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 6px 20px rgba(217, 119, 6, 0.45)', display: 'flex', alignItems: 'center', gap: '0.6rem', transition: 'all 0.25s ease' }}
                    >
                      Finish Activity <Trophy size={20} color="#FFFFFF" />
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
