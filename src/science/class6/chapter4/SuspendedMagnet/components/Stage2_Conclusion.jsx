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
    <div className="glass-panel" style={{ 
      padding: '1.25rem 1.75rem', 
      display: 'flex', 
      gap: '1.75rem', 
      height: '100%', 
      minHeight: 0, 
      overflow: 'hidden', 
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Left Side: Interactive Working Compass Scene (Centered) */}
      <div style={{ 
        flex: '1.15', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center', 
        minWidth: 0 
      }}>
        <div style={{ marginBottom: '0.75rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)' }}>
            Finding Directions
          </h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
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
            maxWidth: '500px',
            height: '320px',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '2px solid rgba(251, 191, 36, 0.5)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(251, 191, 36, 0.2)',
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
        <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.85rem' }}>
          <button
            onClick={handleDeflect}
            disabled={isSpinning}
            className="primary"
            style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RotateCw size={18} className={isSpinning ? 'spin-animation' : ''} />
            {isSpinning ? 'Pressing Compass...' : 'Press Compass'}
          </button>
        </div>
      </div>

      {/* Right Side: Explanation (Centered) */}
      <div style={{ 
        flex: '0.85', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        gap: '1.1rem', 
        minWidth: 0, 
        overflowY: 'auto' 
      }}>
        <div className="glass-panel" style={{ padding: '1.4rem 1.6rem', background: 'var(--surface)' }}>
          <h4 style={{ color: 'var(--text-heading)', margin: '0 0 0.85rem 0', fontSize: '1.18rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Navigation size={22} style={{ color: 'var(--accent)' }} /> 
            How do we know which way is North?
          </h4>
          <p style={{ margin: '0 0 0.95rem 0', color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: '1.65' }}>
            If we notice the direction where the <strong>Sun rises in the morning (North-East horizon)</strong>, we know that general direction is <strong>East</strong>. 
            Once we know East, West is opposite, North is to the left, and South is to the right.
          </p>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: '1.65' }}>
            A freely suspended magnet or compass needle will always align itself pointing towards <strong>North-South</strong>. This makes compasses essential for navigation!
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel"
          style={{ padding: '1.4rem 1.6rem', background: 'var(--success-bg)', border: '1px solid var(--success-border)', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
        >
          <p style={{ margin: 0, color: 'var(--success)', fontSize: '1.08rem', fontWeight: '600', lineHeight: '1.5', textAlign: 'center' }}>
            You have successfully completed this activity!
          </p>
          <button 
            onClick={handleFinish}
            style={{
              width: '100%',
              padding: '0.95rem 1.75rem',
              fontSize: '1.08rem',
              fontWeight: 800,
              borderRadius: '35px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.backgroundColor = '#059669';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = '#10b981';
            }}
          >
            <Flag size={22} /> Finish Activity
          </button>
        </motion.div>
      </div>
    </div>
  );
}
