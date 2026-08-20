import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Navigation, RotateCw, Flag } from 'lucide-react';

export default function Stage2_Conclusion({ onComplete }) {
  const [needleAngle, setNeedleAngle] = useState(0); // 0deg = North
  const [isSpinning, setIsSpinning] = useState(false);
  const containerRef = useRef(null);

  // Rotate / deflect compass needle on click or button press
  const handleDeflect = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    // Deflect to a random offset then settle back to 0deg (North)
    const randomOffset = (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360);
    setNeedleAngle(randomOffset);

    setTimeout(() => {
      setNeedleAngle(0); // Settles back straight to North (0deg)
      setIsSpinning(false);
    }, 1800);
  };

  // Mouse tracking to deflect compass needle slightly when moving mouse near compass
  const handleMouseMove = (e) => {
    if (isSpinning || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // Small realistic magnetic deflection angle (max +/- 20deg)
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
      padding: '1.25rem 1.75rem', 
      display: 'flex', 
      gap: '1.75rem', 
      height: '100%', 
      minHeight: 0, 
      overflow: 'hidden', 
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent'
    }}>
      {/* Left Side: Interactive Working Compass Scene (Centered) */}
      <div style={{ 
        flex: '1.15', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        textAlign: 'center', 
        minWidth: 0,
        height: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Left Top Bar Container */}
        <div style={{ 
          width: '100%',
          textAlign: 'center',
          background: 'rgba(24, 24, 27, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '0.65rem 1.25rem',
          borderRadius: '20px',
          border: '1.5px solid #3F3F46',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.45rem', fontWeight: 800, color: '#F59E0B', letterSpacing: '-0.01em' }}>
            Finding Directions
          </h3>
          <p style={{ margin: 0, color: '#A1A1AA', fontSize: '0.92rem', fontWeight: 700 }}>
            Move mouse or tap "Press Compass" to see the needle always settle pointing North!
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
            height: '320px',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1.5px solid #3F3F46',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7), inset 0 0 30px rgba(245, 158, 11, 0.15)',
            backgroundImage: 'url(/SuspendedMagnet/morning_sunrise.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Subtle Dark Overlay for contrast */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.15) 0%, rgba(15, 23, 42, 0.5) 100%)',
            pointerEvents: 'none'
          }} />

          {/* Realistic Working Antique Brass Compass (Without White Border) */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Real Brass Compass Housing Dial (Clipped cleanly to eliminate outer white border) */}
            <div 
              onClick={handleDeflect}
              style={{
                position: 'relative',
                width: '210px',
                height: '210px',
                borderRadius: '50%',
                clipPath: 'circle(45.5% at 50% 50%)',
                backgroundImage: 'url(/SuspendedMagnet/real_compass_dial.jpg)',
                backgroundSize: '112%',
                backgroundPosition: 'center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.95), 0 0 30px rgba(245, 158, 11, 0.4)',
                cursor: 'pointer',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Click to press compass and watch needle settle North"
            >
              {/* Glass Lens Highlight Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.03) 50%, rgba(0,0,0,0.2) 100%)',
                pointerEvents: 'none',
                zIndex: 12
              }} />

              {/* Rotatable Photorealistic 3D Metallic Magnetic Needle */}
              <motion.div
                animate={{ rotate: needleAngle }}
                transition={{
                  type: 'spring',
                  stiffness: 55,
                  damping: 9,
                  mass: 1.3
                }}
                style={{
                  width: '18px',
                  height: '135px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  filter: 'drop-shadow(3px 5px 8px rgba(0,0,0,0.75))'
                }}
              >
                {/* North Pointer (Striking Crimson Red / Ruby Metallic Arrow) */}
                <div style={{
                  width: 0,
                  height: 0,
                  borderLeft: '9px solid transparent',
                  borderRight: '9px solid transparent',
                  borderBottom: '67px solid #e11d48',
                  position: 'relative',
                  filter: 'drop-shadow(0 0 8px rgba(225, 29, 72, 0.6))'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '-67px',
                    left: '-4.5px',
                    width: 0,
                    height: 0,
                    borderLeft: '4.5px solid transparent',
                    borderRight: '4.5px solid transparent',
                    borderBottom: '67px solid #fda4af'
                  }} />
                </div>

                {/* South Pointer (Dark Slate / Charcoal Metallic Arrow) */}
                <div style={{
                  width: 0,
                  height: 0,
                  borderLeft: '9px solid transparent',
                  borderRight: '9px solid transparent',
                  borderTop: '67px solid #334155',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-67px',
                    left: '-4.5px',
                    width: 0,
                    height: 0,
                    borderLeft: '4.5px solid transparent',
                    borderRight: '4.5px solid transparent',
                    borderTop: '67px solid #94a3b8'
                  }} />
                </div>

                {/* Center Brass Pivot Cap (Dark Brass border, no white ring) */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #fef08a, #d97706, #78350f)',
                  border: '1.5px solid #78350f',
                  boxShadow: '0 3px 8px rgba(0,0,0,0.8)',
                  zIndex: 15
                }} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.5rem', width: '100%' }}>
          <button
            onClick={handleDeflect}
            disabled={isSpinning}
            style={{ 
              flex: 1,
              padding: '0.85rem 1.6rem', 
              fontSize: '1rem', 
              fontWeight: 800, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.6rem',
              background: !isSpinning ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#18181B',
              color: !isSpinning ? '#000000' : '#71717A',
              border: !isSpinning ? 'none' : '1.5px solid #3F3F46',
              cursor: !isSpinning ? 'pointer' : 'not-allowed',
              opacity: !isSpinning ? 1 : 0.85,
              boxShadow: !isSpinning ? '0 4px 14px rgba(245, 158, 11, 0.4)' : 'none'
            }}
          >
            <RotateCw size={18} color={!isSpinning ? '#000000' : '#71717A'} className={isSpinning ? 'spin-animation' : ''} />
            {isSpinning ? 'Pressing Compass...' : 'Press Compass'}
          </button>
        </div>
      </div>

      {/* Right Side: Midnight Carbon Panel */}
      <div style={{ 
        flex: '0.85', 
        background: 'rgba(24, 24, 27, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1.5px solid #3F3F46',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        gap: '1.1rem', 
        minWidth: 0, 
        overflowY: 'auto' 
      }}>
        {/* "How do we know which way is North?" Box */}
        <div style={{ 
          padding: '1.25rem 1.4rem', 
          background: '#18181B', 
          border: '1.5px solid #3F3F46', 
          borderRadius: '16px',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)'
        }}>
          <h4 style={{ color: '#F59E0B', margin: '0 0 0.75rem 0', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Navigation size={20} color="#F59E0B" /> 
            How do we know which way is North?
          </h4>
          <p style={{ margin: '0 0 0.85rem 0', color: '#A1A1AA', fontSize: '0.92rem', lineHeight: '1.6', fontWeight: 600 }}>
            If we notice the direction where the <strong style={{ color: '#F59E0B', fontWeight: 800 }}>Sun rises in the morning (North-East horizon)</strong>, we know that general direction is <strong style={{ color: '#F59E0B', fontWeight: 800 }}>East</strong>. 
            Once we know East, West is opposite, North is to the left, and South is to the right.
          </p>
          <p style={{ margin: 0, color: '#A1A1AA', fontSize: '0.92rem', lineHeight: '1.6', fontWeight: 600 }}>
            A freely suspended magnet or compass needle will always align itself pointing towards <strong style={{ color: '#F59E0B', fontWeight: 800 }}>North-South</strong>. This makes compasses essential for navigation!
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            padding: '1.25rem 1.4rem', 
            background: '#18181B', 
            border: '1.5px solid #3F3F46', 
            borderRadius: '16px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem' 
          }}
        >
          <p style={{ margin: 0, color: '#86EFAC', fontSize: '1rem', fontWeight: '700', lineHeight: '1.5', textAlign: 'center' }}>
            You have successfully completed this activity!
          </p>
          <button 
            onClick={handleFinish}
            style={{
              width: '100%',
              padding: '0.9rem 1.6rem',
              fontSize: '1.05rem',
              fontWeight: 800,
              borderRadius: '35px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#000000',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
              transition: 'all 0.25s ease'
            }}
          >
            <Flag size={20} color="#000000" /> Finish Activity
          </button>
        </motion.div>
      </div>
    </div>
  );
}
