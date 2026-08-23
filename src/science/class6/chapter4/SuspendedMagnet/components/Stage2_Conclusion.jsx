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
    }, 2000);
  };

  const handleMouseMove = (e) => {
    if (isSpinning || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const deflection = (angle / 180) * 22;
    setNeedleAngle(deflection);
  };

  const handleMouseLeave = () => {
    if (!isSpinning) {
      setNeedleAngle(0); // Settle back straight to North
    }
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
      {/* Left Side: Interactive Realistic Compass Lab Scene */}
      <div style={{ 
        flex: '1.75', 
        display: 'flex', 
        flexDirection: 'column', 
        minWidth: 0,
        height: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Scene Container with High-Detail Realistic Vintage Brass Magnetic Compass Instrument */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth: '100%', 
            flex: 1, 
            minHeight: '380px', 
            borderRadius: '24px',
            border: '1.5px solid #A7F3D0',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(6, 78, 59, 0.12)',
            backgroundImage: `url('/SuspendedMagnet/wooden_stand_lab_bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Top Left Floating Badge Overlay */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '20px',
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

          {/* ------------------------------------------------------------- */}
          {/* Photorealistic Antique Brass Pocket Navigation Compass Assembly */}
          {/* ------------------------------------------------------------- */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Top Brass Lanyard Loop / Ring */}
            <div style={{
              width: '54px',
              height: '36px',
              borderRadius: '50% 50% 0 0',
              border: '7px solid #B45309',
              borderBottom: 'none',
              background: 'transparent',
              marginBottom: '-8px',
              zIndex: 15,
              boxShadow: '0 -4px 12px rgba(0,0,0,0.4), inset 0 2px 4px #FDE68A',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}>
              {/* Loop Mount Hinge Pin */}
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '18px',
                height: '8px',
                borderRadius: '4px',
                background: 'linear-gradient(180deg, #FDE68A 0%, #B45309 100%)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }} />
            </div>

            {/* Heavy Brass Outer Casing (370px) */}
            <motion.div
              animate={{ scale: isSpinning ? 1.03 : 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              style={{
                position: 'relative',
                width: '370px',
                height: '370px',
                borderRadius: '50%',
                // Machined brass multi-tier metallic gradient
                background: 'radial-gradient(circle, #FDE047 0%, #D97706 30%, #92400E 65%, #451A03 100%)',
                padding: '16px',
                boxShadow: '0 35px 80px rgba(0,0,0,0.7), 0 10px 25px rgba(0,0,0,0.5), inset 0 2px 6px #FEF08A, inset 0 -6px 12px #271302',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
              onClick={handleDeflect}
            >
              {/* Milled Knurled Outer Edge Ring */}
              <div style={{
                position: 'absolute',
                inset: '5px',
                borderRadius: '50%',
                border: '3px dashed #78350F',
                opacity: 0.65,
                pointerEvents: 'none'
              }} />

              {/* Stepped Polished Brass Bezel Inner Rim */}
              <div style={{
                position: 'absolute',
                inset: '12px',
                borderRadius: '50%',
                border: '4px solid #B45309',
                boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.6), 0 2px 6px #FEF08A',
                pointerEvents: 'none'
              }} />

              {/* 8 Brass Casing Fastener Rivets */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <div
                  key={deg}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100%',
                    height: '100%',
                    transform: `translate(-50%, -50%) rotate(${deg}deg)`,
                    pointerEvents: 'none'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    left: 'calc(50% - 4px)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #FEF08A 0%, #D97706 60%, #451A03 100%)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.6)'
                  }} />
                </div>
              ))}

              {/* Aged Parchment Dial Face */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #FFFDF8 0%, #FBF6E9 55%, #ECE2C8 90%, #DACBB0 100%)',
                border: '3px solid #1E293B',
                boxShadow: 'inset 0 0 30px rgba(69, 26, 3, 0.35), inset 0 4px 12px rgba(0,0,0,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {/* Concentric Azimuth Calibration Circles */}
                <svg width="330" height="330" viewBox="0 0 330 330" style={{ position: 'absolute', inset: 0 }}>
                  {/* Outer & Inner Guideline Rings */}
                  <circle cx="165" cy="165" r="148" fill="none" stroke="#78350F" strokeWidth="1.5" />
                  <circle cx="165" cy="165" r="132" fill="none" stroke="#78350F" strokeWidth="1.2" />
                  <circle cx="165" cy="165" r="126" fill="none" stroke="#B45309" strokeWidth="0.8" strokeDasharray="2 3" />
                  <circle cx="165" cy="165" r="68" fill="none" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3 3" />
                  <circle cx="165" cy="165" r="32" fill="none" stroke="#D97706" strokeWidth="1.0" />

                  {/* 16-Point Antique Nautical Compass Rose Star */}
                  {/* Primary Points */}
                  <polygon points="165,34 175,155 165,165 155,155" fill="#B91C1C" />
                  <polygon points="165,34 165,165 155,155" fill="#DC2626" />
                  <polygon points="165,296 175,175 165,165 155,175" fill="#1E40AF" />
                  <polygon points="165,296 165,165 155,175" fill="#2563EB" />
                  <polygon points="296,165 175,175 165,165 175,155" fill="#92400E" />
                  <polygon points="296,165 165,165 175,155" fill="#B45309" />
                  <polygon points="34,165 155,175 165,165 155,155" fill="#92400E" />
                  <polygon points="34,165 165,165 155,155" fill="#B45309" />

                  {/* Secondary Intercardinal Points */}
                  <polygon points="258,72 172,160 165,165 160,158" fill="#451A03" opacity="0.8" />
                  <polygon points="258,72 165,165 160,158" fill="#78350F" opacity="0.8" />
                  <polygon points="72,258 158,170 165,165 170,172" fill="#451A03" opacity="0.8" />
                  <polygon points="72,258 165,165 170,172" fill="#78350F" opacity="0.8" />
                  <polygon points="72,72 158,160 165,165 160,172" fill="#451A03" opacity="0.8" />
                  <polygon points="72,72 165,165 160,172" fill="#78350F" opacity="0.8" />
                  <polygon points="258,258 172,170 165,165 170,158" fill="#451A03" opacity="0.8" />
                  <polygon points="258,258 165,165 170,158" fill="#78350F" opacity="0.8" />

                  {/* North Fleur-de-Lis Arrow Crown */}
                  <path d="M 165,18 C 160,26 154,28 158,34 C 162,33 164,30 165,26 C 166,30 168,33 172,34 C 176,28 170,26 165,18 Z" fill="#DC2626" />
                </svg>

                {/* 360-Degree Radial Precision Tick Marks */}
                {Array.from({ length: 72 }).map((_, idx) => {
                  const deg = idx * 5;
                  const isMajor = deg % 30 === 0;
                  const isMedium = deg % 10 === 0;

                  return (
                    <div
                      key={deg}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100%',
                        height: '100%',
                        transform: `translate(-50%, -50%) rotate(${deg}deg)`,
                        pointerEvents: 'none'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '4px',
                        left: isMajor ? 'calc(50% - 1.5px)' : 'calc(50% - 0.75px)',
                        width: isMajor ? '3px' : isMedium ? '1.8px' : '1px',
                        height: isMajor ? '16px' : isMedium ? '11px' : '6px',
                        background: isMajor ? '#0F172A' : isMedium ? '#78350F' : '#94A3B8',
                        borderRadius: '1px'
                      }} />
                    </div>
                  );
                })}

                {/* Degree Numbers around Ring (0, 30, 60 ... 330) */}
                {[
                  { deg: 0, label: '0°' },
                  { deg: 30, label: '30°' },
                  { deg: 60, label: '60°' },
                  { deg: 90, label: '90°' },
                  { deg: 120, label: '120°' },
                  { deg: 150, label: '150°' },
                  { deg: 180, label: '180°' },
                  { deg: 210, label: '210°' },
                  { deg: 240, label: '240°' },
                  { deg: 270, label: '270°' },
                  { deg: 300, label: '300°' },
                  { deg: 330, label: '330°' }
                ].map(({ deg, label }) => {
                  const rad = (deg - 90) * (Math.PI / 180);
                  const radius = 120;
                  const x = Math.cos(rad) * radius;
                  const y = Math.sin(rad) * radius;

                  return (
                    <span
                      key={deg}
                      style={{
                        position: 'absolute',
                        transform: `translate(${x}px, ${y}px)`,
                        fontSize: '9px',
                        fontWeight: 900,
                        color: '#78350F',
                        fontFamily: 'serif',
                        pointerEvents: 'none'
                      }}
                    >
                      {label}
                    </span>
                  );
                })}

                {/* Prominent Vintage Cardinal Letters */}
                {/* NORTH */}
                <div style={{ position: 'absolute', top: '24px', left: 'calc(50% - 15px)', width: '30px', height: '26px', background: '#EF4444', borderRadius: '6px', color: '#FFFFFF', fontWeight: 900, fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 8px rgba(239,68,68,0.45)', zIndex: 12 }}>
                  N
                </div>

                {/* SOUTH */}
                <div style={{ position: 'absolute', bottom: '24px', left: 'calc(50% - 15px)', width: '30px', height: '26px', background: '#3B82F6', borderRadius: '6px', color: '#FFFFFF', fontWeight: 900, fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 8px rgba(59,130,246,0.45)', zIndex: 12 }}>
                  S
                </div>

                {/* EAST */}
                <div style={{ position: 'absolute', right: '24px', top: 'calc(50% - 13px)', width: '26px', height: '26px', background: '#064E3B', borderRadius: '50%', color: '#FFFFFF', fontWeight: 900, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 12 }}>
                  E
                </div>

                {/* WEST */}
                <div style={{ position: 'absolute', left: '24px', top: 'calc(50% - 13px)', width: '26px', height: '26px', background: '#064E3B', borderRadius: '50%', color: '#FFFFFF', fontWeight: 900, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 12 }}>
                  W
                </div>

                {/* Intercardinal Labels */}
                <span style={{ position: 'absolute', top: '64px', right: '64px', fontSize: '12px', fontWeight: 900, color: '#78350F' }}>NE</span>
                <span style={{ position: 'absolute', top: '64px', left: '64px', fontSize: '12px', fontWeight: 900, color: '#78350F' }}>NW</span>
                <span style={{ position: 'absolute', bottom: '64px', right: '64px', fontSize: '12px', fontWeight: 900, color: '#78350F' }}>SE</span>
                <span style={{ position: 'absolute', bottom: '64px', left: '64px', fontSize: '12px', fontWeight: 900, color: '#78350F' }}>SW</span>

                {/* --------------------------------------------------------- */}
                {/* 3D Chiseled Magnetic Needle Assembly with Jewel Pivot */}
                {/* --------------------------------------------------------- */}
                <motion.div
                  animate={{ rotate: needleAngle }}
                  transition={isSpinning ? { duration: 2.0, ease: 'easeOut' } : { type: 'spring', stiffness: 90, damping: 14 }}
                  style={{
                    position: 'relative',
                    width: '32px',
                    height: '260px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 25,
                    filter: 'drop-shadow(0 14px 22px rgba(0,0,0,0.55))'
                  }}
                >
                  {/* North Faceted Pointer (Enamelled Crimson) */}
                  <div style={{
                    width: 0,
                    height: 0,
                    borderLeft: '15px solid transparent',
                    borderRight: '15px solid transparent',
                    borderBottom: '130px solid #DC2626',
                    position: 'relative',
                    filter: 'drop-shadow(0 0 6px rgba(220, 38, 38, 0.6))'
                  }}>
                    {/* Left Specular Bevel Highlight */}
                    <div style={{
                      position: 'absolute',
                      top: '25px',
                      left: '-15px',
                      width: '15px',
                      height: '105px',
                      background: 'rgba(255, 255, 255, 0.38)',
                      clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
                    }} />
                    {/* North Label Badge */}
                    <span style={{ position: 'absolute', top: '70px', left: '-6px', color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 900, textShadow: '0 1px 3px #000' }}>N</span>
                  </div>

                  {/* Central Polished Brass Pivot Jewel Cap with Screw Mount */}
                  <div style={{
                    position: 'absolute',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #FEF08A 0%, #D97706 60%, #78350F 100%)',
                    border: '2.5px solid #FFFFFF',
                    boxShadow: '0 6px 14px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.9)',
                    zIndex: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Ruby Pivot Jewel Inset */}
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 30% 30%, #FDA4AF 0%, #BE123C 70%, #4C0519 100%)',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8)'
                    }} />
                  </div>

                  {/* South Faceted Pointer (Enamelled Sapphire Blue) */}
                  <div style={{
                    width: 0,
                    height: 0,
                    borderLeft: '15px solid transparent',
                    borderRight: '15px solid transparent',
                    borderTop: '130px solid #2563EB',
                    position: 'relative',
                    filter: 'drop-shadow(0 0 6px rgba(37, 99, 235, 0.6))'
                  }}>
                    {/* Left Specular Bevel Highlight */}
                    <div style={{
                      position: 'absolute',
                      bottom: '25px',
                      left: '-15px',
                      width: '15px',
                      height: '105px',
                      background: 'rgba(255, 255, 255, 0.38)',
                      clipPath: 'polygon(100% 100%, 0 0, 100% 0)'
                    }} />
                    {/* South Label Badge */}
                    <span style={{ position: 'absolute', bottom: '70px', left: '-5px', color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 900, textShadow: '0 1px 3px #000' }}>S</span>
                  </div>
                </motion.div>

                {/* Curved Convex Glass Highlight Sheen */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.1) 40%, rgba(255, 255, 255, 0) 65%)',
                  pointerEvents: 'none',
                  zIndex: 35
                }} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side: Guide & Control Panel */}
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
            padding: '0.3rem 0.75rem', 
            borderRadius: '20px', 
            fontSize: '0.75rem', 
            fontWeight: 800, 
            color: '#065F46', 
            letterSpacing: '0.5px',
            marginBottom: '0.6rem'
          }}>
            <Sparkles size={14} color="#059669" /> EXPERIMENT CONCLUSION
          </div>

          <h2 style={{ 
            fontSize: '1.45rem', 
            fontWeight: 900, 
            color: '#064E3B', 
            margin: '0 0 0.5rem 0',
            lineHeight: 1.2
          }}>
            How a Compass Works
          </h2>

          <p style={{ 
            fontSize: '0.94rem', 
            color: '#334155', 
            lineHeight: 1.6, 
            fontWeight: 600,
            margin: '0 0 1.2rem 0'
          }}>
            A freely suspended bar magnet or compass needle always comes to rest pointing in the <strong style={{ color: '#D97706' }}>North-South direction</strong>. This key property has been used for centuries by sailors and travelers to find directions!
          </p>

          {/* Interactive Controls Card */}
          <div style={{ 
            background: '#F0FDF4', 
            border: '1.5px solid #A7F3D0', 
            borderRadius: '16px', 
            padding: '1rem 1.1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#047857', letterSpacing: '0.5px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Compass size={15} color="#047857" /> COMPASS CONTROLS
            </div>

            <p style={{ fontSize: '0.88rem', color: '#1E293B', fontWeight: 600, margin: '0 0 0.8rem 0', lineHeight: 1.4 }}>
              Tap the button or hover over the compass dial to deflect the magnetized needle:
            </p>

            <button
              onClick={handleDeflect}
              disabled={isSpinning}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                fontSize: '0.95rem',
                fontWeight: 900,
                borderRadius: '14px',
                background: isSpinning ? '#CBD5E1' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#FFFFFF',
                border: 'none',
                cursor: isSpinning ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: isSpinning ? 'none' : '0 4px 14px rgba(5, 150, 105, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <RotateCw size={18} className={isSpinning ? 'spin-anim' : ''} /> {isSpinning ? 'Deflecting Needle...' : 'Deflect Compass Needle'}
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderTop: '1.5px solid #F1F5F9',
          paddingTop: '0.8rem'
        }}>
          <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700 }}>
            Stage 2 of 2 ● ●
          </span>

          <button
            onClick={onComplete}
            style={{
              padding: '0.85rem 1.8rem',
              fontSize: '0.95rem',
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
