import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Beaker, Hexagon, ArrowLeft } from 'lucide-react';

export default function ChapterCover({ onOpenBook, onBack }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      color: '#EAF6FB',
      background: 'radial-gradient(130% 120% at 78% 12%, #1A0B2E, #0A0415)', // Deep chemistry purple
      zIndex: 10000
    }}>
      {/* CSS grid for background and responsive layout */}
      <style>
        {`
          .chem-grid {
            position: absolute;
            inset: 0;
            pointer-events: none;
            background:
              repeating-linear-gradient(0deg, transparent 0 33px, rgba(255,255,255,.05) 33px 34px),
              repeating-linear-gradient(90deg, transparent 0 33px, rgba(255,255,255,.05) 33px 34px);
          }
          .chem-grid::after {
            content: "";
            position: absolute;
            inset: 0;
            background:
              repeating-linear-gradient(0deg, transparent 0 135px, rgba(255,255,255,.08) 135px 136px),
              repeating-linear-gradient(90deg, transparent 0 135px, rgba(255,255,255,.08) 135px 136px);
          }
          .cover-frame {
            position: absolute;
            inset: clamp(16px, 2.4vw, 34px);
            border: 1px solid rgba(255,255,255,.15);
            border-radius: 12px;
            pointer-events: none;
          }
          .etick {
            position: absolute;
            font-family: monospace;
            font-size: clamp(9px, 1vw, 11px);
            letter-spacing: .14em;
            color: #00F0FF;
            opacity: .75;
          }
          .pin-ping {
            animation: ping 2.6s ease-out infinite;
          }
          @keyframes ping {
            0% { box-shadow: 0 0 0 0 rgba(0, 240, 255, 0.5); }
            70% { box-shadow: 0 0 0 34px rgba(0, 240, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 240, 255, 0); }
          }
          .cta-btn:hover {
            background: #00D0DF !important;
            transform: translateY(-2px);
          }
          .cover-layout {
            position: absolute;
            inset: clamp(16px,2.4vw,34px);
            display: grid;
            grid-template-columns: minmax(0,0.92fr) 1px minmax(0,1.08fr);
            align-items: center;
            padding: clamp(20px,3.5vw,56px);
            gap: clamp(20px,4vw,64px);
          }
          .cover-plot {
            position: relative;
            aspect-ratio: 1;
            width: 100%;
            max-width: min(46vh,460px);
            justify-self: center;
            border: 1px solid rgba(0,240,255,.28);
            border-radius: 14px;
            background: rgba(10,4,21,.35);
            display: grid;
            place-items: center;
            overflow: hidden;
          }
          .cover-text {
            max-width: 560px;
          }
          .cover-meta {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-top: clamp(16px,2.4vw,28px);
          }
          .corner-brand {
            position: absolute;
            bottom: clamp(20px,2.8vw,40px);
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            gap: 9px;
            z-index: 3;
          }
          
          /* portrait / small: stack */
          @media (max-aspect-ratio: 1/1), (max-width: 760px) {
            .cover-layout {
              grid-template-columns: 1fr;
              grid-template-rows: auto;
              justify-items: center;
              text-align: center;
              gap: clamp(18px,4vh,36px);
              overflow: auto;
            }
            .meridian { display: none; }
            .cover-plot { max-width: min(40vh,320px); }
            .cover-text { max-width: 100%; }
            .cover-meta { justify-content: center; }
            .corner-brand {
              position: static;
              margin: 12px auto 0;
              justify-content: center;
            }
          }
        `}
      </style>

      <div className="chem-grid"></div>
      <div className="cover-frame"></div>
      <button 
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          zIndex: 10001,
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          padding: '8px 16px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'sans-serif',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <ArrowLeft size={16} /> Back
      </button>
      <span className="etick" style={{ top: 'clamp(22px,3vw,42px)', left: 'clamp(22px,3vw,42px)' }}>H₂O</span>
      <span className="etick" style={{ top: 'clamp(22px,3vw,42px)', right: 'clamp(22px,3vw,42px)' }}>CO₂</span>
      <span className="etick" style={{ bottom: 'clamp(22px,3vw,42px)', left: 'clamp(22px,3vw,42px)' }}>SOLID</span>
      <span className="etick" style={{ bottom: 'clamp(22px,3vw,42px)', right: 'clamp(22px,3vw,42px)' }}>LIQUID</span>

      <div className="cover-layout">
        {/* LEFT · the plot */}
        <div className="cover-plot">
          {/* Hexagon Pattern */}
          <div style={{ position: 'absolute', opacity: 0.1 }}>
            <Hexagon size={160} strokeWidth={1} color="#00F0FF" />
          </div>

          <span style={{ position: 'absolute', top: 8, left: 10, fontFamily: 'monospace', fontSize: 'clamp(8px,.9vw,10px)', color: '#00F0FF', opacity: 0.7 }}>Au: 196.97</span>
          <span style={{ position: 'absolute', top: 8, right: 10, fontFamily: 'monospace', fontSize: 'clamp(8px,.9vw,10px)', color: '#00F0FF', opacity: 0.7 }}>Ag: 107.87</span>
          <span style={{ position: 'absolute', bottom: 8, left: 10, fontFamily: 'monospace', fontSize: 'clamp(8px,.9vw,10px)', color: '#00F0FF', opacity: 0.7 }}>SAMPLE 01</span>
          <span style={{ position: 'absolute', bottom: 8, right: 10, fontFamily: 'monospace', fontSize: 'clamp(8px,.9vw,10px)', color: '#00F0FF', opacity: 0.7 }}>SCI · CH 06</span>
          
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', background: 'rgba(0,240,255,.5)', width: 'min(30vh,300px)', height: '1px', left: 'calc(-1*min(15vh,150px))', top: 0 }}></div>
            <div style={{ position: 'absolute', background: 'rgba(0,240,255,.5)', height: 'min(30vh,300px)', width: '1px', top: 'calc(-1*min(15vh,150px))', left: 0 }}></div>
            
            <div className="pin-ping" style={{
              position: 'absolute', left: '50%', top: '50%', width: 18, height: 18, borderRadius: '50%',
              transform: 'translate(-50%,-50%)', boxShadow: '0 0 0 0 rgba(0,240,255,.55)'
            }}></div>
            <div style={{
              position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
              width: 18, height: 18, borderRadius: '50%', background: '#00F0FF',
              boxShadow: '0 0 0 5px rgba(0,240,255,.22)', display: 'grid', placeItems: 'center'
            }}>
               <Beaker size={10} color="#0A0415" />
            </div>
            <div style={{
              position: 'absolute', left: 'calc(50% + 16px)', top: 'calc(50% - 34px)',
              fontFamily: 'monospace', fontSize: 'clamp(9px,1vw,11px)', letterSpacing: '.08em',
              color: '#00F0FF', whiteSpace: 'nowrap'
            }}>
              ◎ ATOMIC STRUCTURE DETECTED
            </div>
          </div>
        </div>

        {/* MERIDIAN */}
        <div className="meridian" style={{
          position: 'relative', width: '1px', height: '74%', justifySelf: 'center',
          background: 'repeating-linear-gradient(180deg, rgba(255,255,255,.35) 0 6px, transparent 6px 12px)'
        }}>
          <span style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-90deg)',
            fontFamily: 'monospace', fontSize: 'clamp(8px,.85vw,10px)', letterSpacing: '.2em',
            color: '#00F0FF', whiteSpace: 'nowrap', background: '#0A0415', padding: '4px 8px', opacity: 0.85
          }}>
            MOLECULAR SCALE · 10⁻¹⁰m
          </span>
        </div>

        {/* RIGHT · text */}
        <div className="cover-text">
          <span style={{
            display: 'inline-block', fontFamily: 'monospace', fontSize: 'clamp(10px,1.05vw,12px)',
            letterSpacing: '.26em', padding: '8px 18px', borderRadius: 999,
            background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.3)', color: '#EAF6FB'
          }}>
            CLASS 6 · SCIENCE
          </span>
          <div style={{
            fontFamily: 'monospace', fontSize: 'clamp(11px,1.2vw,13px)', letterSpacing: '.13em',
            color: '#00F0FF', margin: 'clamp(16px,2.2vw,26px) 0 6px'
          }}>
            ◎ EXPLORING THE PHYSICAL WORLD
          </div>
          <h1 style={{
            fontFamily: 'Fraunces, Palatino, serif', fontWeight: 600, fontSize: 'clamp(48px,7.6vw,104px)',
            lineHeight: 0.92, color: '#fff', letterSpacing: '-.015em', margin: 0
          }}>
            Science <em style={{ fontStyle: 'normal', color: '#00F0FF' }}>Lab</em>
          </h1>
          <div className="cover-meta">
            <span style={{
              fontFamily: 'monospace', fontSize: 'clamp(11px,1.2vw,13px)', letterSpacing: '.2em',
              color: '#EAF6FB', border: '1px solid rgba(255,255,255,.3)', padding: '6px 12px', borderRadius: 8
            }}>
              CH 06 / 12
            </span>
            <span style={{
              fontFamily: 'sans-serif', fontWeight: 700, fontSize: 'clamp(16px,2.1vw,24px)',
              color: '#fff', letterSpacing: '.02em'
            }}>
              Materials Around Us
            </span>
          </div>
          <div style={{
            fontFamily: 'monospace', fontSize: 'clamp(9px,1vw,11px)', letterSpacing: '.16em',
            color: '#00F0FF', textTransform: 'uppercase', marginTop: 10, opacity: 0.8
          }}>
            Sorting · Appearance · Hardness · Solubility · Transparency
          </div>
          
          <button 
            className="cta-btn"
            onClick={onOpenBook}
            style={{
              marginTop: 'clamp(24px,3.4vw,42px)', fontFamily: 'sans-serif', fontWeight: 700,
              border: 'none', cursor: 'pointer', background: '#00F0FF', color: '#0A0415',
              padding: 'clamp(13px,1.6vw,17px) clamp(28px,3.4vw,40px)', borderRadius: 12,
              fontSize: 'clamp(14px,1.6vw,17px)', boxShadow: '0 14px 34px rgba(0,240,255,.32)',
              transition: 'all .2s', display: 'inline-flex', gap: 10, alignItems: 'center'
            }}
          >
            Enter Lab <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="corner-brand">
        <div style={{
          width: 26, height: 26, borderRadius: 7, background: '#00F0FF', color: '#0A0415',
          display: 'grid', placeItems: 'center', fontWeight: 800, fontFamily: 'sans-serif', fontSize: 15
        }}>
          F
        </div>
        <div>
          <b style={{ fontSize: 12, color: '#fff' }}>FuturaX</b>
          <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '.1em', color: 'rgba(234,246,251,.6)', display: 'block' }}>
            AI-NATIVE LEARNING LAB
          </span>
        </div>
      </div>
    </div>
  );
}
