import React, { useState, useRef } from 'react';
import { ArrowRight, Zap } from 'lucide-react';

export default function Chapter4Cover({ onStartJourney }) {
  const [needleAngle, setNeedleAngle] = useState(-15);
  const plotRef = useRef(null);

  // Mouse tracking to deflect compass needle dynamically
  const handleMouseMove = (e) => {
    if (!plotRef.current) return;
    const rect = plotRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    
    const rad = Math.atan2(dy, dx);
    let deg = rad * (180 / Math.PI) + 90;
    
    const targetDeg = deg * 0.35;
    setNeedleAngle(targetDeg);
  };

  const handleMouseLeave = () => {
    setNeedleAngle(0);
  };

  return (
    <div className="chapter4-cover-wrapper">
      <style>{`
        .chapter4-cover-wrapper {
          --ink: #FFF6E5;
          --paper1: #2E180B;
          --paper2: #120904;
          --line: rgba(212, 175, 55, 0.08);
          --line2: rgba(212, 175, 55, 0.16);
          --gold: #F59E0B;
          --gold-bright: #FFD700;
          --gold-brass: #D4AF37;
          --red-north: #EF4444;
          --blue-south: #3B82F6;
          --geo: "Space Grotesk", system-ui, -apple-system, sans-serif;
          --mono: "IBM Plex Mono", monospace;
          
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          font-family: var(--geo);
          color: var(--ink);
          overflow: hidden;
          background: radial-gradient(130% 120% at 75% 15%, var(--paper1), var(--paper2));
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        /* Wood Grain & Grid Texture */
        .grid-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            repeating-linear-gradient(0deg, transparent 0 35px, var(--line) 35px 36px),
            repeating-linear-gradient(90deg, transparent 0 35px, var(--line) 35px 36px);
        }
        .grid-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(0deg, transparent 0 140px, var(--line2) 140px 141px),
            repeating-linear-gradient(90deg, transparent 0 140px, var(--line2) 140px 141px);
        }

        /* Outer Brass Frame */
        .frame-line {
          position: absolute;
          inset: clamp(16px, 2.5vw, 36px);
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 16px;
          pointer-events: none;
          box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.5);
        }

        /* Single Standing Page Layout */
        .layout-container {
          position: relative;
          width: 100%;
          max-width: 1200px;
          height: 100%;
          max-height: calc(100vh - 80px);
          margin: 0 auto;
          padding: 0 clamp(24px, 4vw, 60px);
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) 1px minmax(0, 1.05fr);
          align-items: center;
          gap: clamp(24px, 4vw, 64px);
          z-index: 10;
        }

        /* Left Side: Magnet Physics HUD */
        .plot-hud {
          position: relative;
          aspect-ratio: 1;
          width: 100%;
          max-width: min(44vh, 420px);
          justify-self: center;
          border: 1.5px solid rgba(212, 175, 55, 0.35);
          border-radius: 20px;
          background: rgba(18, 9, 4, 0.75);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(212, 175, 55, 0.08);
          cursor: crosshair;
        }

        /* Magnet Bar */
        .magnet-bar {
          position: relative;
          width: 200px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          overflow: hidden;
          box-shadow: 0 0 30px rgba(239, 68, 68, 0.3), 0 0 30px rgba(245, 158, 11, 0.3);
          z-index: 3;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .pole-n {
          flex: 1;
          background: linear-gradient(135deg, #EF4444, #991B1B);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.1rem;
          color: #FFF;
          letter-spacing: 2px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .pole-s {
          flex: 1;
          background: linear-gradient(135deg, #3B82F6, #1E40AF);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.1rem;
          color: #FFF;
          letter-spacing: 2px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        /* SVG Magnetic Field Lines (Gold Theme) */
        .field-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }
        .field-line {
          fill: none;
          stroke: url(#goldFieldGradient);
          stroke-width: 1.5;
          stroke-dasharray: 6 6;
          animation: dashStream 12s linear infinite;
          opacity: 0.75;
        }
        @keyframes dashStream {
          from { stroke-dashoffset: 240; }
          to { stroke-dashoffset: 0; }
        }

        /* Settling Compass Overlay */
        .compass-hud {
          position: absolute;
          top: 20px;
          width: 65px;
          height: 65px;
          border-radius: 50%;
          border: 2px solid var(--gold-brass);
          background: rgba(18, 9, 4, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.25);
          z-index: 4;
        }
        .needle-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .needle-n {
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 22px solid var(--red-north);
        }
        .needle-s {
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 22px solid var(--gold-bright);
        }

        /* Floating Iron Filings Particles */
        .filing {
          position: absolute;
          width: 3px;
          height: 8px;
          background: var(--gold-bright);
          border-radius: 2px;
          pointer-events: none;
          animation: floatFiling 4s ease-in-out infinite alternate;
        }
        @keyframes floatFiling {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          100% { transform: translateY(-8px) rotate(15deg); opacity: 0.9; }
        }

        /* Divider Line */
        .meridian-line {
          position: relative;
          width: 1px;
          height: 70%;
          justify-self: center;
          background: repeating-linear-gradient(180deg, rgba(212, 175, 55, 0.35) 0 6px, transparent 6px 12px);
        }

        /* Right Side: Title & Description */
        .text-cartouche {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.15rem;
          max-width: 580px;
        }

        .pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.9rem;
          border-radius: 30px;
          background: rgba(212, 175, 55, 0.12);
          border: 1px solid rgba(212, 175, 55, 0.35);
          font-family: var(--mono);
          font-size: clamp(0.75rem, 0.85vw, 0.85rem);
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--gold-bright);
          text-transform: uppercase;
        }

        .main-title {
          font-family: var(--geo);
          font-size: clamp(2rem, 3.5vw, 3.5rem);
          font-weight: 800;
          line-height: 1.1;
          margin: 0;
          letter-spacing: -0.02em;
          white-space: nowrap;
          background: linear-gradient(135deg, #FFF6E5 20%, #FFD700 70%, #F59E0B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .description-text {
          font-size: clamp(1.15rem, 1.35vw, 1.35rem);
          line-height: 1.6;
          color: rgba(255, 246, 229, 0.92);
          margin: 0;
          font-weight: 400;
        }

        .cta-wrapper {
          margin-top: 0.4rem;
        }

        .start-journey-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.9rem 2.2rem;
          border-radius: 30px;
          background: linear-gradient(135deg, #F59E0B, #D97706);
          border: none;
          color: #120904;
          font-family: var(--geo);
          font-weight: 800;
          font-size: 1.05rem;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: 0 10px 25px rgba(245, 158, 11, 0.35);
        }
        .start-journey-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 15px 35px rgba(245, 158, 11, 0.5);
          background: linear-gradient(135deg, #FFB020, #E67E22);
        }
        .start-journey-btn:active {
          transform: translateY(0) scale(0.98);
        }

        /* FuturaX Corner Branding */
        .corner-brand {
          position: absolute;
          bottom: clamp(20px, 3vw, 40px);
          right: clamp(20px, 3vw, 40px);
          display: flex;
          align-items: center;
          gap: 0.6rem;
          z-index: 10;
        }
        .brand-logo {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--gold-bright);
          color: #120904;
          display: grid;
          place-items: center;
          font-weight: 900;
          font-size: 14px;
        }
        .brand-title { font-size: 12px; font-weight: 700; color: #FFF; }
        .brand-sub { font-family: var(--mono); font-size: 9px; letter-spacing: 0.1em; color: rgba(255, 246, 229, 0.6); display: block; }

        @media (max-width: 860px) {
          .layout-container {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 1.5rem;
          }
          .meridian-line { display: none; }
          .text-cartouche { align-items: center; }
          .plot-hud { max-width: 280px; }
          .corner-brand { position: static; margin-top: 0.5rem; justify-content: center; }
          .main-title { white-space: normal; }
        }
      `}</style>

      {/* Frame Background */}
      <div className="grid-bg"></div>
      <div className="frame-line"></div>

      {/* Center Layout Container */}
      <div className="layout-container">
        
        {/* Left Magnet Simulation Box (Only FuturaX content, no extra names) */}
        <div 
          ref={plotRef}
          className="plot-hud"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Settling Compass */}
          <div className="compass-hud">
            <div className="needle-wrapper" style={{ transform: `rotate(${needleAngle}deg)` }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="needle-n" />
                <div className="needle-s" />
              </div>
            </div>
          </div>

          {/* SVG Field Lines (Warm Amber Gold) */}
          <svg className="field-svg" viewBox="0 0 400 400">
            <defs>
              <linearGradient id="goldFieldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#FFD700" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            
            <path className="field-line" d="M 120 200 C 120 100, 280 100, 280 200" />
            <path className="field-line" d="M 120 200 C 120 300, 280 300, 280 200" />
            <path className="field-line" d="M 100 200 C 100 50, 300 50, 300 200" style={{ animationDuration: '16s' }} />
            <path className="field-line" d="M 100 200 C 100 350, 300 350, 300 200" style={{ animationDuration: '16s' }} />
            <path className="field-line" d="M 80 200 C 80 10, 320 10, 320 200" style={{ animationDuration: '20s' }} />
            <path className="field-line" d="M 80 200 C 80 390, 320 390, 320 200" style={{ animationDuration: '20s' }} />
          </svg>

          {/* Floating Iron Filings Particles */}
          <div className="filing" style={{ top: '25%', left: '30%', transform: 'rotate(20deg)' }} />
          <div className="filing" style={{ top: '22%', left: '68%', transform: 'rotate(-25deg)' }} />
          <div className="filing" style={{ bottom: '26%', left: '32%', transform: 'rotate(-15deg)' }} />
          <div className="filing" style={{ bottom: '22%', left: '65%', transform: 'rotate(30deg)' }} />
          <div className="filing" style={{ top: '48%', left: '15%', transform: 'rotate(90deg)' }} />
          <div className="filing" style={{ top: '48%', right: '15%', transform: 'rotate(90deg)' }} />

          {/* Central Bar Magnet */}
          <div className="magnet-bar">
            <div className="pole-n">N</div>
            <div className="pole-s">S</div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="meridian-line"></div>

        {/* Right Cartouche (FuturaX Content) */}
        <div className="text-cartouche">
          <div className="pill-badge">
            <Zap size={14} color="#FFD700" />
            GRADE 6 · SCIENCE · CHAPTER 4
          </div>

          <h1 className="main-title">Exploring Magnets</h1>

          <p className="description-text">
            Hands-on physics labs for every chapter activity. Experience real magnetic fields, settling compasses, and iron filings gathering at the poles.
          </p>

          <div className="cta-wrapper">
            <button 
              className="start-journey-btn"
              onClick={onStartJourney}
            >
              Start the journey
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

      </div>

      {/* FuturaX Corner Branding */}
      <div className="corner-brand">
        <div className="brand-logo">Fx</div>
        <div>
          <div className="brand-title">FuturaX</div>
          <span className="brand-sub">AI-NATIVE LEARNING LAB</span>
        </div>
      </div>
    </div>
  );
}
