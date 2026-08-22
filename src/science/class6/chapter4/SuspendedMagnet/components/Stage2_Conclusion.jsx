import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Navigation, RotateCw, Flag, Compass, Sparkles, Info, ArrowRight } from 'lucide-react';

export default function Stage2_Conclusion({ onComplete }) {
  const [needleAngle, setNeedleAngle] = useState(0); // 0deg = North
  const [isSpinning, setIsSpinning] = useState(false);
  const containerRef = useRef(null);

  // Rotate / deflect compass needle on click or button press
  const handleDeflect = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const randomOffset = (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360);
    setNeedleAngle(randomOffset);

    setTimeout(() => {
      setNeedleAngle(0); // Settles back straight to North (0deg)
      setIsSpinning(false);
    }, 1800);
  };

  const handleMouseMove = (e) => {
    if (isSpinning || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const deflection = (angle / 180) * 20;
    setNeedleAngle(deflection);
  };

  const handleMouseLeave = () => {
    if (!isSpinning) {
      setNeedleAngle(0); // Settle back straight to North
    }
  };

  const handleFinish = () => {
    onComplete();
  };

  return (
    <div style={{ 
      padding: '0.5rem 1rem', 
      display: 'flex', 
      gap: '1.25rem', 
      height: '100%', 
      minHeight: 0, 
      overflow: 'hidden', 
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent'
    }}>
      {/* Left Side: Interactive Working Compass Scene (Sage Mint Light Theme) */}
      <div style={{ 
        flex: '1.75', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        textAlign: 'center', 
        minWidth: 0,
        height: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Left Top Card Header matching reference style */}
        <div style={{ 
          width: '100%',
          textAlign: 'center',
          background: '#FFFFFF',
          padding: '0.55rem 1.25rem',
          borderRadius: '20px',
          border: '1.5px solid #A7F3D0',
          boxShadow: '0 4px 16px rgba(6, 78, 59, 0.06)',
          boxSizing: 'border-box',
          marginBottom: '0.5rem'
        }}>
          <h3 style={{ margin: '0 0 0.15rem 0', fontSize: '1.3rem', fontWeight: 900, color: '#064E3B', letterSpacing: '-0.01em' }}>
            🧭 Compass & Direction Finding Conclusion
          </h3>
          <p style={{ margin: 0, color: '#475569', fontSize: '0.88rem', fontWeight: 600 }}>
            Tap "Deflect Compass" or move mouse over compass to see the needle always settle pointing North!
          </p>
        </div>

        {/* Scene Container with Larger Stronger 3D Vintage Brass Magnetic Compass Instrument */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth: '100%', 
            flex: 1, 
            minHeight: '260px', 
            background: '#F0FDF4',
            border: '1.5px solid #A7F3D0',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: '0 8px 25px rgba(6, 78, 59, 0.08)'
          }}
        >
          {/* Nature Background Image */}
          <img 
            src="/SuspendedMagnet/wooden_stand_lab_bg.jpg" 
            alt="Nature Directions Background" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 1 }} 
          />

          {/* Top Left Floating Badge Overlay (Brown theme) */}
          <div style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #78350F 0%, #451A03 100%)',
              border: '1.5px solid #B45309',
              borderRadius: '20px',
              padding: '0.4rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: 900,
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(69, 26, 3, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}>
              <Compass size={16} color="#F59E0B" /> COMPASS DIAL ALIGNMENT
            </div>
          </div>

          {/* High-Detail Larger 3D Brass Magnetic Compass Instrument (340px) */}
          <motion.div
            animate={{ scale: isSpinning ? 1.04 : 1 }}
            style={{
              position: 'relative',
              width: '340px',
              height: '340px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FDE047 0%, #D97706 35%, #78350F 75%, #F59E0B 100%)',
              padding: '16px',
              border: '4px solid #78350F',
              boxShadow: '0 30px 75px rgba(0,0,0,0.65), 0 0 35px rgba(245, 158, 11, 0.45), inset 0 0 15px rgba(120, 53, 15, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              cursor: 'pointer',
              boxSizing: 'border-box'
            }}
            onClick={handleDeflect}
          >
            {/* Outer Strong Brass Ring Bezel Detail & Screws */}
            <div style={{
              position: 'absolute',
              inset: '6px',
              borderRadius: '50%',
              border: '4px solid #78350F',
              pointerEvents: 'none'
            }} />
            
            {/* Bezel Screws at 8 Points */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <div 
                key={angle} 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '100%',
                  height: '100%',
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  pointerEvents: 'none'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '3px',
                  left: 'calc(50% - 4px)',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#FDE047',
                  border: '1.5px solid #78350F',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)'
                }} />
              </div>
            ))}

            {/* Inner Dial Face (Ivory Parchment Theme) */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FFFFFF 0%, #FAF8F5 65%, #F1ECE1 100%)',
              border: '4px solid #0F172A',
              boxShadow: 'inset 0 0 25px rgba(120, 53, 15, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {/* Compass Rose 8-Point Star Vector */}
              <svg width="260" height="260" viewBox="0 0 220 220" style={{ position: 'absolute', inset: 0, opacity: 0.28 }}>
                <polygon points="110,15 120,100 110,110 100,100" fill="#EF4444" />
                <polygon points="110,205 120,120 110,110 100,120" fill="#3B82F6" />
                <polygon points="205,110 120,120 110,110 120,100" fill="#D97706" />
                <polygon points="15,110 100,120 110,110 100,100" fill="#D97706" />
                <polygon points="177,43 120,105 110,110 105,120" fill="#78350F" />
                <polygon points="43,177 100,115 110,110 115,100" fill="#78350F" />
                <polygon points="43,43 105,100 110,110 100,105" fill="#78350F" />
                <polygon points="177,177 115,120 110,110 120,115" fill="#78350F" />
                <circle cx="110" cy="110" r="95" fill="none" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 4" />
              </svg>

              {/* Clean Tick Marks Around Outer Circle (Degrees Numbers Removed) */}
              {Array.from({ length: 24 }).map((_, idx) => {
                const angle = idx * 15;
                const isMajor = angle % 90 === 0;
                const isMedium = angle % 45 === 0;

                return (
                  <div 
                    key={angle}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '100%',
                      height: '100%',
                      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                      pointerEvents: 'none'
                    }}
                  >
                    <div style={{ 
                      position: 'absolute', 
                      top: '6px', 
                      left: isMajor ? 'calc(50% - 2.5px)' : 'calc(50% - 1px)', 
                      width: isMajor ? '5px' : isMedium ? '3px' : '2px', 
                      height: isMajor ? '14px' : isMedium ? '10px' : '7px', 
                      background: isMajor ? '#0F172A' : isMedium ? '#D97706' : '#94A3B8',
                      borderRadius: '2px'
                    }} />
                  </div>
                );
              })}

              {/* Cardinal Badges */}
              {/* NORTH (N) */}
              <div style={{ position: 'absolute', top: '28px', left: 'calc(50% - 18px)', width: '36px', height: '26px', background: '#EF4444', borderRadius: '8px', color: '#FFFFFF', fontWeight: 900, fontSize: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 8px rgba(239,68,68,0.45)', zIndex: 10 }}>
                N
              </div>

              {/* SOUTH (S) */}
              <div style={{ position: 'absolute', bottom: '28px', left: 'calc(50% - 18px)', width: '36px', height: '26px', background: '#3B82F6', borderRadius: '8px', color: '#FFFFFF', fontWeight: 900, fontSize: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 8px rgba(59,130,246,0.45)', zIndex: 10 }}>
                S
              </div>

              {/* EAST (E) */}
              <div style={{ position: 'absolute', right: '28px', top: 'calc(50% - 14px)', width: '28px', height: '28px', background: '#064E3B', borderRadius: '50%', color: '#FFFFFF', fontWeight: 900, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                E
              </div>

              {/* WEST (W) */}
              <div style={{ position: 'absolute', left: '28px', top: 'calc(50% - 14px)', width: '28px', height: '28px', background: '#064E3B', borderRadius: '50%', color: '#FFFFFF', fontWeight: 900, fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                W
              </div>

              {/* Intercardinal Direction Labels */}
              <span style={{ position: 'absolute', top: '65px', right: '65px', fontSize: '11px', fontWeight: 900, color: '#78350F' }}>NE</span>
              <span style={{ position: 'absolute', top: '65px', left: '65px', fontSize: '11px', fontWeight: 900, color: '#78350F' }}>NW</span>
              <span style={{ position: 'absolute', bottom: '65px', right: '65px', fontSize: '11px', fontWeight: 900, color: '#78350F' }}>SE</span>
              <span style={{ position: 'absolute', bottom: '65px', left: '65px', fontSize: '11px', fontWeight: 900, color: '#78350F' }}>SW</span>

              {/* High-Detail 3D Magnetized Compass Needle */}
              <motion.div
                animate={{ rotate: needleAngle }}
                transition={isSpinning ? { duration: 1.8, ease: 'easeOut' } : { type: 'spring', stiffness: 100, damping: 12 }}
                style={{
                  position: 'relative',
                  width: '30px',
                  height: '245px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 25,
                  filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.5))'
                }}
              >
                {/* North Pointer Tip (Crimson Metallic Gradient) */}
                <div style={{
                  width: 0,
                  height: 0,
                  borderLeft: '15px solid transparent',
                  borderRight: '15px solid transparent',
                  borderBottom: '122px solid #EF4444',
                  position: 'relative',
                  filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.55))'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '30px',
                    left: '-15px',
                    width: '15px',
                    height: '92px',
                    background: 'rgba(255, 255, 255, 0.3)',
                    clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
                  }} />
                  <span style={{ position: 'absolute', top: '65px', left: '-6px', color: '#FFF', fontSize: '0.95rem', fontWeight: 900, textShadow: '0 1px 3px #000' }}>N</span>
                </div>

                {/* Central Polished Brass Pivot Jewel Cap */}
                <div style={{
                  position: 'absolute',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #FDE047 0%, #D97706 60%, #78350F 100%)',
                  border: '3px solid #FFFFFF',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.65), inset 0 2px 4px rgba(255,255,255,0.85)',
                  zIndex: 30
                }} />

                {/* South Pointer Tip (Sapphire Metallic Gradient) */}
                <div style={{
                  width: 0,
                  height: 0,
                  borderLeft: '15px solid transparent',
                  borderRight: '15px solid transparent',
                  borderTop: '122px solid #3B82F6',
                  position: 'relative',
                  filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.55))'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '-15px',
                    width: '15px',
                    height: '92px',
                    background: 'rgba(255, 255, 255, 0.3)',
                    clipPath: 'polygon(100% 100%, 0 0, 100% 0)'
                  }} />
                  <span style={{ position: 'absolute', bottom: '65px', left: '-5px', color: '#FFF', fontSize: '0.95rem', fontWeight: 900, textShadow: '0 1px 3px #000' }}>S</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Instruction Bar Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            padding: '0.45rem 1.25rem',
            borderRadius: '25px',
            border: '1.5px solid #A7F3D0',
            boxShadow: '0 4px 14px rgba(6, 78, 59, 0.1)',
            color: '#064E3B',
            fontWeight: 800,
            fontSize: '0.88rem',
            zIndex: 10,
            whiteSpace: 'nowrap'
          }}>
            🎯 Tap Compass to deflect needle — it always returns North!
          </div>
        </div>
      </div>

      {/* Right Side: Guide & Control Panel matching reference screenshot */}
      <div style={{ 
        flex: '0.75', 
        background: '#FFFFFF',
        border: '1.5px solid #A7F3D0',
        borderRadius: '24px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 8px 25px rgba(6, 78, 59, 0.08)',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        minWidth: 0, 
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto' 
      }}>
        <div>
          {/* Kicker Badge */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.35rem',
            background: '#D1FAE5',
            color: '#065F46',
            padding: '0.35rem 0.85rem',
            borderRadius: '16px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '1.2px',
            marginBottom: '0.65rem'
          }}>
            <Sparkles size={14} color="#065F46" /> LESSON CONCLUSION
          </div>

          <h3 style={{ margin: '0 0 0.4rem 0', color: '#064E3B', fontSize: '1.55rem', fontWeight: 900, lineHeight: '1.2' }}>
            Magnets & Directions
          </h3>

          <p style={{ margin: '0 0 1rem 0', color: '#334155', fontSize: '0.92rem', lineHeight: '1.5', fontWeight: 600 }}>
            A freely suspended bar magnet or compass needle always comes to rest pointing in the <strong style={{ color: '#D97706' }}>North-South direction</strong>. This key property has been used for centuries by sailors and travelers to find directions!
          </p>

          {/* Physics Control Pad Container matching reference screenshot */}
          <div style={{ 
            background: '#F0FDF4', 
            border: '1.5px solid #A7F3D0', 
            borderRadius: '20px', 
            padding: '1.1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            marginBottom: '1rem'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#047857', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Compass size={15} color="#047857" /> COMPASS CONTROLS
            </div>

            <button 
              onClick={handleDeflect}
              disabled={isSpinning}
              style={{ 
                width: '100%',
                padding: '0.85rem 1.25rem', 
                fontSize: '0.95rem', 
                fontWeight: 900, 
                borderRadius: '14px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '0.55rem',
                background: isSpinning ? '#CBD5E1' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: isSpinning ? '#64748B' : '#FFFFFF',
                border: 'none',
                cursor: isSpinning ? 'not-allowed' : 'pointer',
                boxShadow: isSpinning ? 'none' : '0 4px 14px rgba(217, 119, 6, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <RotateCw size={18} className={isSpinning ? 'spin-anim' : ''} /> {isSpinning ? 'Deflecting Needle...' : 'Deflect Compass Needle'}
            </button>
          </div>

          {/* Key Summary Box */}
          <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', padding: '0.9rem 1.1rem', borderRadius: '16px' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#064E3B', marginBottom: '0.35rem' }}>
              💡 Physics Principle Summary:
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.84rem', color: '#334155', lineHeight: '1.55', fontWeight: 600 }}>
              <li>The end pointing toward Geographic North is the <strong>North-seeking (N) pole</strong>.</li>
              <li>The end pointing toward Geographic South is the <strong>South-seeking (S) pole</strong>.</li>
            </ul>
          </div>
        </div>

        {/* Footer Navigation Bar matching reference style */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700 }}>
            Stage 2 of 2 ● ●
          </span>

          <button
            onClick={handleFinish}
            style={{
              padding: '0.85rem 2rem',
              fontSize: '1rem',
              fontWeight: 900,
              borderRadius: '30px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(217, 119, 6, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            Proceed to Quiz <ArrowRight size={18} color="#FFFFFF" />
          </button>
        </div>
      </div>
    </div>
  );
}
