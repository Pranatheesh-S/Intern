import React from 'react';
import coverImage from '../../../../../../assets/materials-around-us-cover.png';
import cleanCoverImage from '../../../../../../assets/clean-materials-cover.jpg';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function ChapterCover({ onOpenBook, onBack }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        zIndex: 10000,
        userSelect: 'none',
        backgroundColor: '#060A17'
      }}
    >
      <style>{`
        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
        }
        @keyframes borderPulse {
          0%, 100% {
            box-shadow: 
              inset 0 -8px 20px rgba(0, 217, 255, 0.6), 
              inset 0 2px 5px rgba(255, 255, 255, 0.3),
              0 0 0 2px rgba(0, 191, 255, 0.4), 
              0 0 15px rgba(0, 191, 255, 0.4);
          }
          50% {
            box-shadow: 
              inset 0 -8px 20px rgba(0, 217, 255, 0.8), 
              inset 0 2px 5px rgba(255, 255, 255, 0.5),
              0 0 0 4px rgba(0, 191, 255, 0.9), 
              0 0 30px 8px rgba(0, 191, 255, 0.8);
          }
        }
        .glowing-btn {
          animation: borderPulse 2s infinite ease-in-out;
        }
        .text-dark-blue {
          color: #0b1d5c;
        }
        .text-cyan-gradient {
          background: linear-gradient(180deg, #00dfc4 0%, #008272 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .text-outline-pill {
          border: 1.5px solid #0b1d5c;
          border-radius: 9999px;
          padding: 0.5vw 1.5vw;
          background: rgba(255, 255, 255, 0.1);
          font-weight: 700;
          letter-spacing: 0.05em;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <img
        src={cleanCoverImage}
        alt="Materials Around Us - Chemistry Lab Cover"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}
      />

      {/* Brightness/Color correction overlay for right side to match original bright airy look */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 75% 50%, rgba(255, 255, 255, 1) 0%, rgba(240, 248, 255, 0.95) 20%, transparent 60%), linear-gradient(to right, transparent 0%, transparent 20%, rgba(110, 165, 235, 0.85) 55%, rgba(95, 150, 225, 1) 100%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* BACKGROUND DECORATIVE CHEMISTRY SYMBOLS */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
        <svg style={{ position: 'absolute', top: '8%', left: '75%', transform: 'rotate(15deg)', opacity: 0.85 }} width="50" height="50" viewBox="0 0 100 100" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round">
          <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" />
          <polygon points="50,22 75,36 75,64 50,78 25,64 25,36" opacity="0.6" />
        </svg>

        <svg style={{ position: 'absolute', top: '22%', left: '92%', transform: 'rotate(-20deg)', opacity: 0.8 }} width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="#ffffff" strokeWidth="4">
          <circle cx="50" cy="50" r="10" />
          <circle cx="20" cy="20" r="8" />
          <circle cx="80" cy="20" r="8" />
          <circle cx="80" cy="80" r="8" />
          <line x1="26" y1="26" x2="43" y2="43" />
          <line x1="74" y1="26" x2="57" y2="43" />
          <line x1="74" y1="74" x2="57" y2="57" />
        </svg>

        <svg style={{ position: 'absolute', top: '55%', left: '88%', transform: 'rotate(10deg)', opacity: 0.9, color: '#ffffff' }} width="45" height="35" viewBox="0 0 60 30" fill="currentColor">
          <text x="0" y="24" fontFamily="sans-serif" fontSize="22" fontWeight="bold">CO</text>
          <text x="32" y="30" fontFamily="sans-serif" fontSize="14" fontWeight="bold">2</text>
        </svg>

        <svg style={{ position: 'absolute', top: '82%', left: '62%', transform: 'rotate(-10deg)', opacity: 0.8 }} width="70" height="45" viewBox="0 0 140 80" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round">
          <polygon points="40,10 70,25 70,55 40,70 10,55 10,25" />
          <polygon points="70,25 100,10 130,25 130,55 100,70 70,55" />
        </svg>

        <svg style={{ position: 'absolute', top: '75%', left: '50%', transform: 'rotate(35deg)', opacity: 0.75 }} width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="#ffffff" strokeWidth="3">
          <circle cx="50" cy="50" r="10" />
          <circle cx="20" cy="50" r="8" />
          <circle cx="80" cy="50" r="8" />
          <line x1="28" y1="50" x2="40" y2="50" />
          <line x1="60" y1="50" x2="72" y2="50" />
        </svg>

        <svg style={{ position: 'absolute', top: '15%', left: '55%', transform: 'rotate(-5deg)', opacity: 0.85, color: '#ffffff' }} width="50" height="30" viewBox="0 0 60 30" fill="currentColor">
          <text x="0" y="24" fontFamily="sans-serif" fontSize="22" fontWeight="bold">H</text>
          <text x="16" y="30" fontFamily="sans-serif" fontSize="14" fontWeight="bold">2</text>
          <text x="26" y="24" fontFamily="sans-serif" fontSize="22" fontWeight="bold">O</text>
        </svg>

        <svg style={{ position: 'absolute', top: '35%', left: '80%', transform: 'rotate(25deg)', opacity: 0.7 }} width="80" height="70" viewBox="0 0 160 140" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round">
          <polygon points="40,20 70,35 70,65 40,80 10,65 10,35" />
          <polygon points="70,35 100,20 130,35 130,65 100,80 70,65" />
          <polygon points="40,80 70,95 70,125 40,140 10,125 10,95" />
        </svg>

        <svg style={{ position: 'absolute', top: '90%', left: '85%', transform: 'rotate(5deg)', opacity: 0.75 }} width="40" height="50" viewBox="0 0 100 120" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
          <path d="M40 10 L60 10 M50 10 L50 40 L20 100 A 10 10 0 0 0 30 110 L70 110 A 10 10 0 0 0 80 100 L50 40" />
          <line x1="28" y1="85" x2="72" y2="85" strokeDasharray="5,5" />
        </svg>

        <svg style={{ position: 'absolute', top: '45%', left: '60%', transform: 'rotate(-30deg)', opacity: 0.65 }} width="45" height="45" viewBox="0 0 100 100" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round">
          <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" />
          <line x1="25" y1="36" x2="25" y2="64" />
          <line x1="50" y1="22" x2="75" y2="36" />
          <line x1="50" y1="78" x2="75" y2="64" />
        </svg>

        <svg style={{ position: 'absolute', top: '65%', left: '75%', transform: 'rotate(15deg)', opacity: 0.75 }} width="50" height="50" viewBox="0 0 100 100" fill="none" stroke="#ffffff" strokeWidth="4">
          <circle cx="50" cy="20" r="8" />
          <circle cx="20" cy="80" r="8" />
          <circle cx="80" cy="80" r="8" />
          <line x1="45" y1="28" x2="25" y2="72" />
          <line x1="55" y1="28" x2="75" y2="72" />
        </svg>

        {/* BRIGHT BLUE ACCENT SYMBOLS */}
        <svg style={{ position: 'absolute', top: '10%', left: '88%', transform: 'rotate(12deg)', opacity: 0.95, color: '#00d4ff' }} width="50" height="30" viewBox="0 0 60 30" fill="currentColor">
          <text x="0" y="24" fontFamily="sans-serif" fontSize="22" fontWeight="bold">O</text>
          <text x="16" y="30" fontFamily="sans-serif" fontSize="14" fontWeight="bold">2</text>
        </svg>

        <svg style={{ position: 'absolute', top: '50%', left: '95%', transform: 'rotate(-15deg)', opacity: 0.9 }} width="50" height="50" viewBox="0 0 100 100" fill="none" stroke="#00d4ff" strokeWidth="2">
          <circle cx="50" cy="50" r="5" fill="#00d4ff" />
          <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(30 50 50)" />
          <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(-30 50 50)" />
          <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(90 50 50)" />
        </svg>

        <svg style={{ position: 'absolute', top: '80%', left: '72%', transform: 'rotate(-45deg)', opacity: 0.85 }} width="40" height="70" viewBox="0 0 50 100" fill="none" stroke="#00d4ff" strokeWidth="3" strokeLinecap="round">
          <path d="M10 10 C 30 30, 40 40, 40 50 C 40 60, 30 70, 10 90" />
          <path d="M40 10 C 20 30, 10 40, 10 50 C 10 60, 20 70, 40 90" />
          <line x1="20" y1="20" x2="30" y2="20" />
          <line x1="12" y1="40" x2="38" y2="40" />
          <line x1="12" y1="60" x2="38" y2="60" />
          <line x1="20" y1="80" x2="30" y2="80" />
        </svg>

        <svg style={{ position: 'absolute', top: '30%', left: '65%', transform: 'rotate(10deg)', opacity: 0.7 }} width="40" height="40" viewBox="0 0 100 100" fill="#00d4ff">
          <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" />
        </svg>
      </div>

      {/* RIGHT SIDE CONTENT WRAPPER */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        width: '45%',
        height: '100%',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '13vh',
        paddingBottom: '21vh', // Increased to move button up
        boxSizing: 'border-box'
      }}>
        {/* TYPOGRAPHY UI LAYER */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '100%', 
          fontFamily: '"Outfit", "Inter", sans-serif',
          flex: '0 1 auto',
          minHeight: 0
        }}>
          
          {/* CLASS 6 - SCIENCE Pill */}
          <div className="text-dark-blue text-outline-pill" style={{ fontSize: 'min(1.2vw, 2vh)' }}>
            CLASS 6 - SCIENCE
          </div>

          {/* Chemistry Lab Title */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1vh', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', position: 'relative' }}>
              <h1 className="text-dark-blue" style={{ fontSize: 'min(8vw, 12vh)', fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: '-0.02em' }}>
                Chemistry
              </h1>
              <h1 className="text-cyan-gradient" style={{ fontSize: 'min(7.5vw, 11vh)', fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: '-0.02em', marginTop: '-2vh', marginRight: '5%' }}>
                Lab
              </h1>
            </div>
          </div>

          {/* Subtitle Pill */}
          <div style={{ marginTop: '3vh' }}>
            <div className="text-dark-blue text-outline-pill" style={{ borderRadius: '0.5vw', fontSize: 'min(1.8vw, 2.5vh)', gap: '1.5vw', padding: '1vw 3vw', backgroundColor: 'rgba(255,255,255,0.25)' }}>
              <span style={{ fontWeight: 600 }}>CH 06 / 12</span>
              <span style={{ width: '2px', height: 'min(2vw, 3vh)', backgroundColor: '#0b1d5c', opacity: 0.3 }}></span>
              <span style={{ fontWeight: 900, color: '#051240' }}>Materials Around Us</span>
            </div>
          </div>

          {/* Bullet Points */}
          <div style={{ marginTop: '3.5vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5vh' }}>
            <div style={{ color: '#518ac9', fontSize: 'min(1.7vw, 2.5vh)', fontWeight: 800, letterSpacing: '0.05em', display: 'flex', gap: '1.8vw', alignItems: 'center' }}>
              <span>SORTING</span>
              <div style={{ width: 'min(0.5vw, 0.8vh)', height: 'min(0.5vw, 0.8vh)', borderRadius: '50%', backgroundColor: '#00938a' }}></div>
              <span>APPEARANCE</span>
              <div style={{ width: 'min(0.5vw, 0.8vh)', height: 'min(0.5vw, 0.8vh)', borderRadius: '50%', backgroundColor: '#00938a' }}></div>
              <span>HARDNESS</span>
            </div>
            <div style={{ color: '#518ac9', fontSize: 'min(1.7vw, 2.5vh)', fontWeight: 800, letterSpacing: '0.05em', display: 'flex', gap: '1.8vw', alignItems: 'center' }}>
              <span>SOLUBILITY</span>
              <div style={{ width: 'min(0.5vw, 0.8vh)', height: 'min(0.5vw, 0.8vh)', borderRadius: '50%', backgroundColor: '#00938a' }}></div>
              <span>TRANSPARENCY</span>
            </div>
          </div>
        </div>

        {/* Visible Styled ENTER LAB button */}
        <button
          className="glowing-btn"
          onClick={onOpenBook}
          aria-label="Enter Lab"
          title="Enter Lab"
          style={{
            width: '78%',
            height: 'min(11.5vh, 78px)',
            background: 'linear-gradient(180deg, #1e4bb2 0%, #061a55 100%)',
            border: '1.5px solid rgba(167, 219, 255, 0.6)',
            borderRadius: '9999px',
            cursor: 'pointer',
            outline: 'none',
            transition: 'transform 0.15s ease, filter 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 11%', // Increased to move content more toward center
            color: 'white',
            fontFamily: '"Inter", "Outfit", sans-serif',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.filter = 'brightness(1.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1.0)';
            e.currentTarget.style.filter = 'brightness(1.0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Custom Flask Icon mimicking the reference */}
            <svg width="clamp(26px, min(3.8vw, 5.5vh), 64px)" height="clamp(26px, min(3.8vw, 5.5vh), 64px)" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2v7.31M14 9.31V2M8.5 2h7M14 9.31L4.72 20.55A2.16 2.16 0 0 0 6.64 24h10.72a2.16 2.16 0 0 0 1.92-3.45L14 9.31Z" />
              <path d="M6 16h12" />
              <circle cx="10" cy="19" r="1" fill="white" stroke="none" />
              <circle cx="13" cy="21" r="1.5" fill="white" stroke="none" />
              <circle cx="15" cy="18" r="0.8" fill="white" stroke="none" />
            </svg>
            <span style={{ fontSize: 'clamp(20px, min(3.1vw, 4.3vh), 52px)', fontWeight: 900, letterSpacing: '0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>ENTER LAB</span>
          </div>
          <ArrowRight size={"clamp(22px, min(3.2vw, 4.2vh), 54px)"} strokeWidth={3} />
        </button>
      </div>

      {/* Visible Styled BACK button */}
      <button
        onClick={onBack}
        aria-label="Back"
        title="Back"
        style={{
          position: 'absolute',
          bottom: '5vh',
          left: '4vw',
          width: 'max(120px, 12.44vw)',
          height: 'min(6.54vh, 50px)',
          background: '#ffffff',
          border: 'none',
          borderRadius: '9999px',
          cursor: 'pointer',
          outline: 'none',
          transition: 'transform 0.15s ease, filter 0.15s ease',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5vw',
          color: '#1e3a8a',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          animation: 'borderPulse 2.5s infinite ease-in-out reverse'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.03)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1.0)';
        }}
      >
        <ArrowLeft size={"clamp(16px, 1.5vw, 30px)"} strokeWidth={3} />
        <span style={{ fontSize: 'clamp(12px, 1.2vw, 24px)', fontWeight: 800, letterSpacing: '0.02em', fontFamily: '"Inter", "Outfit", sans-serif' }}>BACK</span>
      </button>
    </div>
  );
}

