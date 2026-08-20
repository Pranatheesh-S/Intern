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

        {/* Scene Container with Realistic Morning Nature Sunrise (Northeast) */}
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

          {/* Top Left Floating Badge Overlay matching reference style */}
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

          {/* Large Interactive 3D Vector Compass Instrument Component */}
          <motion.div
            animate={{ scale: isSpinning ? 1.05 : 1 }}
            style={{
              position: 'relative',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FFFFFF 0%, #F1F5F9 100%)',
              border: '8px solid #0F172A',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 25px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              cursor: 'pointer'
            }}
            onClick={handleDeflect}
          >
            {/* Outer Brass Ring Accent */}
            <div style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: '50%',
              border: '2px solid #D97706',
              pointerEvents: 'none'
            }} />

            {/* Compass Rose Direction Labels */}
            <div style={{ position: 'absolute', top: '10px', color: '#EF4444', fontWeight: 900, fontSize: '1.4rem' }}>N</div>
            <div style={{ position: 'absolute', bottom: '10px', color: '#3B82F6', fontWeight: 900, fontSize: '1.4rem' }}>S</div>
            <div style={{ position: 'absolute', right: '14px', color: '#0F172A', fontWeight: 900, fontSize: '1.2rem' }}>E</div>
            <div style={{ position: 'absolute', left: '14px', color: '#0F172A', fontWeight: 900, fontSize: '1.2rem' }}>W</div>

            {/* Rotating Magnetic Compass Needle */}
            <motion.div
              animate={{ rotate: needleAngle }}
              transition={isSpinning ? { duration: 1.8, ease: 'easeOut' } : { type: 'spring', stiffness: 100, damping: 12 }}
              style={{
                position: 'relative',
                width: '24px',
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 25,
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))'
              }}
            >
              {/* North Tip (Red Arrow) */}
              <div style={{
                width: 0,
                height: 0,
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderBottom: '90px solid #EF4444',
                position: 'relative'
              }}>
                <span style={{ position: 'absolute', top: '45px', left: '-5px', color: '#FFF', fontSize: '0.8rem', fontWeight: 900 }}>N</span>
              </div>

              {/* Center Brass Pivot Cap */}
              <div style={{
                position: 'absolute',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #FDE047 0%, #D97706 100%)',
                border: '2px solid #FFFFFF',
                boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                zIndex: 30
              }} />

              {/* South Tip (Blue Arrow) */}
              <div style={{
                width: 0,
                height: 0,
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderTop: '90px solid #3B82F6',
                position: 'relative'
              }}>
                <span style={{ position: 'absolute', bottom: '45px', left: '-4px', color: '#FFF', fontSize: '0.8rem', fontWeight: 900 }}>S</span>
              </div>
            </motion.div>
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
