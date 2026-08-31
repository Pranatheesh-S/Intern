import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, CheckCircle, CheckCircle2, Play, Pause, Maximize2, Minimize2 } from "lucide-react";
import CinematicSkyFlightCanvas from "./CinematicSkyFlightCanvas";

export default function Stage3_Explore({ onComplete, onNext }) {
  // Two pole modes: "same" (Like Poles - Repel) or "different" (Unlike Poles - Attract & Crash)
  const [interactionMode, setInteractionMode] = useState("same");
  const [isRunning, setIsRunning] = useState(true);
  const [hasTestedSame, setHasTestedSame] = useState(false);
  const [hasTestedDifferent, setHasTestedDifferent] = useState(false);
  const [actionPopup, setActionPopup] = useState(null); // 'same' | 'different' | null

  const polesMatch = interactionMode === "same";

  // When clicking a poles button, show the popup BEFORE the activity starts
  const handleSelectMode = (mode) => {
    setActionPopup(mode);
  };

  // Confirm popup: close popup and start the activity with the selected mode
  const handleConfirmPopup = () => {
    if (actionPopup === "same") {
      setInteractionMode("same");
      setHasTestedSame(true);
      setIsRunning(true);
    } else if (actionPopup === "different") {
      setInteractionMode("different");
      setHasTestedDifferent(true);
      setIsRunning(true);
    }
    setActionPopup(null);
  };

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

  const handleFinish = () => {
    onComplete();
    onNext();
  };

  return (
    <div style={{ 
      padding: '0.5rem 1rem', 
      display: 'grid', 
      gridTemplateColumns: '1fr 370px',
      gap: '1rem', 
      height: '100%', 
      minHeight: 0, 
      overflow: 'hidden', 
      boxSizing: 'border-box',
      background: 'transparent',
      position: 'relative'
    }}>
      {/* Left Side: Maximized Flight Simulation Canvas */}
      <div style={{ display: "flex", flexDirection: "column", height: '100%', minHeight: 0, width: '100%' }}>
        {/* Full-Height Flight Simulation Canvas */}
        <div style={{ 
          position: "relative", 
          width: "100%", 
          height: "100%",
          flex: 1, 
          minHeight: 0, 
          background: "#020617", 
          border: "1.5px solid #A7F3D0",
          borderRadius: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          boxShadow: "0 10px 35px rgba(6, 78, 59, 0.15)"
        }}>
          <CinematicSkyFlightCanvas 
            interactionMode={interactionMode}
            isRunning={isRunning}
            polesMatch={polesMatch}
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
              fontSize: '0.85rem',
              fontWeight: 800,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.2s ease',
            }}
          >
            {isFullscreen ? <Minimize2 size={15} color="#0F172A" /> : <Maximize2 size={15} color="#0F172A" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Right Side: Compact Flight Simulation Controls Container */}
      <div style={{ 
        width: "370px", 
        background: "linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)",
        border: "1.5px solid #FDE68A",
        borderRadius: "24px",
        padding: "1.25rem 1.4rem",
        boxShadow: "0 6px 24px rgba(217, 119, 6, 0.08)",
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "flex-start", 
        minWidth: 0, 
        height: '100%',
        boxSizing: 'border-box',
        overflowY: "auto",
        gap: "1rem",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}>
        {/* Header Title (Directly in panel, no wrapper box) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.1rem 0',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: 900, color: '#064E3B' }}>
              🧭 Explore Forces
            </h3>
            <span style={{ fontSize: '1.02rem', color: '#047857', fontWeight: 800 }}>
              Attraction & Repulsion
            </span>
          </div>
          <span style={{
            background: '#DCFCE7',
            color: '#15803D',
            fontWeight: 900,
            fontSize: '0.94rem',
            padding: '0.35rem 0.8rem',
            borderRadius: '12px',
            border: '1.5px solid #86EFAC',
            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.12)'
          }}>
            Step {hasTestedSame && hasTestedDifferent ? '2' : '1'} of 2
          </span>
        </div>

        {/* Instruction Steps Section (With Increased Font Sizes & User Instructions) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
          {/* Step 1: Same Poles */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            padding: '0.15rem 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: interactionMode === 'same'
                    ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' 
                    : hasTestedSame ? '#059669' : '#64748B',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.02rem',
                  fontWeight: 900,
                  flexShrink: 0
                }}>
                  1
                </span>
                <span style={{ 
                  fontWeight: 900, 
                  fontSize: '1.24rem', 
                  color: interactionMode === 'same' ? '#064E3B' : hasTestedSame ? '#047857' : '#334155' 
                }}>
                  Like Poles (Repel)
                </span>
              </div>
              {hasTestedSame && <CheckCircle size={22} color="#059669" />}
            </div>
            <p style={{ margin: '0.15rem 0 0 2.6rem', fontSize: '1.06rem', color: '#065F46', lineHeight: 1.55, fontWeight: 600 }}>
              Click the <strong>"1. Same Poles"</strong> button below to observe how like poles (N + N) push aircraft apart into separate flight corridors.
            </p>
          </div>

          {/* Step 2: Different Poles */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            padding: '0.15rem 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: interactionMode === 'different'
                    ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' 
                    : hasTestedDifferent ? '#059669' : '#64748B',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.02rem',
                  fontWeight: 900,
                  flexShrink: 0
                }}>
                  2
                </span>
                <span style={{ 
                  fontWeight: 900, 
                  fontSize: '1.24rem', 
                  color: interactionMode === 'different' ? '#064E3B' : hasTestedDifferent ? '#047857' : '#334155' 
                }}>
                  Opposite Poles (Attract)
                </span>
              </div>
              {hasTestedDifferent && <CheckCircle size={22} color="#059669" />}
            </div>
            <p style={{ margin: '0.15rem 0 0 2.6rem', fontSize: '1.06rem', color: '#065F46', lineHeight: 1.55, fontWeight: 600 }}>
              Click the <strong>"2. Different Poles"</strong> button below to observe how opposite poles (N + S) attract each other in a direct forward collision path.
            </p>
          </div>
        </div>

        {/* Action Buttons: Play/Pause and Poles Selection (Matching Previous Activity Standards) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '0.2rem' }}>
          {/* 1. Start / Pause Flight Animation Button */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="gold-glow-btn"
            style={{
              width: '100%',
              padding: '0.95rem 1rem',
              borderRadius: '16px',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '1.08rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              transition: 'all 0.2s ease'
            }}
          >
            {isRunning ? (
              <>
                <Pause size={20} fill="#FFFFFF" color="#FFFFFF" /> Pause Flight
              </>
            ) : (
              <>
                <Play size={20} fill="#FFFFFF" color="#FFFFFF" /> Resume Flight Animation
              </>
            )}
          </button>

          {/* 2. Same Poles Button */}
          <button 
            onClick={() => handleSelectMode("same")} 
            className={interactionMode === "same" ? "gold-glow-btn" : ""}
            style={{ 
              width: "100%", 
              padding: "0.95rem 1.15rem",
              borderRadius: "16px",
              fontSize: "1.08rem",
              fontWeight: 900,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: interactionMode === "same" 
                ? undefined 
                : "#FFFFFF",
              color: interactionMode === "same" ? "#FFFFFF" : "#065F46",
              border: interactionMode === "same" ? "none" : "1.5px solid #FDE68A",
              boxShadow: interactionMode === "same" 
                ? undefined 
                : "0 2px 6px rgba(0,0,0,0.03)",
              transition: "all 0.2s ease"
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {hasTestedSame && <CheckCircle size={20} color={interactionMode === "same" ? "#FFFFFF" : "#059669"} />}
              🛡️ 1. Same Poles
            </span>
            <span style={{ 
              fontSize: "0.88rem", 
              fontWeight: 800, 
              background: interactionMode === "same" ? "rgba(255, 255, 255, 0.25)" : "#FEF3C7", 
              color: interactionMode === "same" ? "#FFFFFF" : "#92400E", 
              padding: "4px 10px", 
              borderRadius: "10px" 
            }}>
              {hasTestedSame ? "Tested ✓" : "Repels Apart ⬅️ ➡️"}
            </span>
          </button>

          {/* 3. Different Poles Button */}
          <button 
            onClick={() => handleSelectMode("different")} 
            className={interactionMode === "different" ? "gold-glow-btn" : ""}
            style={{ 
              width: "100%", 
              padding: "0.95rem 1.15rem",
              borderRadius: "16px",
              fontSize: "1.08rem",
              fontWeight: 900,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: interactionMode === "different" 
                ? undefined 
                : "#FFFFFF",
              color: interactionMode === "different" ? "#FFFFFF" : "#065F46",
              border: interactionMode === "different" ? "none" : "1.5px solid #FDE68A",
              boxShadow: interactionMode === "different" 
                ? undefined 
                : "0 2px 6px rgba(0,0,0,0.03)",
              transition: "all 0.2s ease"
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {hasTestedDifferent && <CheckCircle size={20} color={interactionMode === "different" ? "#FFFFFF" : "#059669"} />}
              💥 2. Different Poles
            </span>
            <span style={{ 
              fontSize: "0.88rem", 
              fontWeight: 800, 
              background: interactionMode === "different" ? "rgba(255, 255, 255, 0.25)" : "#FEF3C7", 
              color: interactionMode === "different" ? "#FFFFFF" : "#92400E", 
              padding: "4px 10px", 
              borderRadius: "10px" 
            }}>
              {hasTestedDifferent ? "Tested ✓" : "Attracts & Collides 💥"}
            </span>
          </button>
        </div>

        {/* Proceed to Quiz Button */}
        <button 
          onClick={handleFinish} 
          className="gold-glow-btn"
          style={{ 
            width: "100%", 
            padding: "1.05rem 1.5rem", 
            fontSize: "1.15rem", 
            fontWeight: 900, 
            borderRadius: "20px", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            gap: "0.6rem",
            marginTop: "auto",
            cursor: "pointer"
          }}
        >
          <CheckCircle2 size={22} color="#FFFFFF" /> Proceed to Quiz
        </button>
      </div>
      
      {/* Action Pop-up Modal (Displayed before activity starts) */}
      <AnimatePresence>
        {actionPopup !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(2, 6, 23, 0.65)',
              zIndex: 100,
              backdropFilter: 'blur(6px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #FDE68A',
                borderRadius: '24px',
                padding: '2.4rem 2.6rem',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 12px 40px rgba(69, 26, 3, 0.2)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.35rem',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              <div style={{ 
                width: '68px', 
                height: '68px', 
                background: actionPopup === 'same' ? '#DCFCE7' : '#FEE2E2', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                border: `2px solid ${actionPopup === 'same' ? '#86EFAC' : '#FECACA'}`,
                fontSize: '2.2rem'
              }}>
                {actionPopup === 'same' ? '🟢' : '💥'}
              </div>
              
              <h3 style={{ 
                margin: 0, 
                color: actionPopup === 'same' ? '#064E3B' : '#991B1B', 
                fontSize: '1.55rem', 
                fontWeight: 900 
              }}>
                {actionPopup === 'same' ? 'Same Poles (Repulsion)' : 'Different Poles (Attraction)'}
              </h3>
              
              <p style={{ 
                margin: 0, 
                color: '#065F46', 
                fontSize: '1.2rem', 
                fontWeight: 700, 
                lineHeight: 1.6 
              }}>
                {actionPopup === 'same' 
                  ? '🟢 SAME POLES: Flights approach from left & right — Like poles (N + N) repel, executing left & right cross-turns!' 
                  : '💥 DIFFERENT POLES: In-line flight from left to right — Opposite poles (N + S) attract in a straight line!'}
              </p>
              
              <button
                onClick={handleConfirmPopup}
                className="gold-glow-btn"
                style={{
                  marginTop: '0.5rem',
                  padding: '0.9rem 3.2rem',
                  borderRadius: '25px',
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem'
                }}
              >
                OK <CheckCircle2 size={20} color="#FFFFFF" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
