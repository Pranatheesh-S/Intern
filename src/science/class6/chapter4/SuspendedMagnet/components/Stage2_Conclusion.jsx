import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, ArrowRight, Maximize2, Minimize2, RotateCw } from 'lucide-react';
import ExactCompass from '../../components/ExactCompass.jsx';

export default function Stage2_Conclusion({ onComplete }) {
  const [needleAngle, setNeedleAngle] = useState(0); // 0deg = North
  const [isSpinning, setIsSpinning] = useState(false);
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

  const [customTransition, setCustomTransition] = useState(null);
  const [isPausedAtNorth, setIsPausedAtNorth] = useState(false);

  // 1. Automatic continuous spin in all directions when idle (North → East → South → West)
  // Automatically resumes after deflection and the North-South observation leave time
  useEffect(() => {
    if (isSpinning || isPausedAtNorth) return;

    const timer = setInterval(() => {
      setNeedleAngle((prev) => (typeof prev === 'number' ? prev + 90 : 90));
    }, 2400);

    return () => clearInterval(timer);
  }, [isSpinning, isPausedAtNorth]);

  // 2. Deflect sequence:
  // - Rotate fast in clockwise direction
  // - Complete ONE FULL ROTATION in anticlockwise slowly (-360°)
  // - Stop in the North-South direction
  // - Leave time after setting North-South, then start autospin
  const handleDeflect = () => {
    if (isSpinning || isPausedAtNorth) return;
    setIsSpinning(true);

    const current = typeof needleAngle === 'number' 
      ? needleAngle 
      : (Array.isArray(needleAngle) ? needleAngle[needleAngle.length - 1] : 0);

    // Calculate next North-South target angle (exact multiple of 360°)
    const baseTarget = Math.ceil(current / 360) * 360;
    const finalNorthSouth = (baseTarget <= current) ? baseTarget + 720 : baseTarget + 360;
    
    // Peak clockwise overshoot is exactly one full 360° turn beyond North-South
    const peakClockwise = finalNorthSouth + 360;

    // Multi-phase keyframes:
    // Phase 1: fast clockwise from current -> peakClockwise (high speed)
    // Phase 2: slow anticlockwise from peakClockwise -> finalNorthSouth (1 full 360° rotation)
    // Phase 3: stops stably at finalNorthSouth (North-South direction)
    const animDuration = 3.6; // seconds
    setNeedleAngle([current, peakClockwise, finalNorthSouth]);
    setCustomTransition({
      duration: animDuration,
      times: [0, 0.35, 1],
      ease: ["easeOut", "easeInOut"]
    });

    // When rotation completes at animDuration (3.6s):
    setTimeout(() => {
      setNeedleAngle(finalNorthSouth);
      setCustomTransition(null);
      setIsSpinning(false);
      setIsPausedAtNorth(true); // Leave time at North-South

      // Leave ample time (3.5 seconds) with needle resting steadily at North-South
      // and then start the autospin
      setTimeout(() => {
        setIsPausedAtNorth(false); // Resumes autospin!
      }, 3500);
    }, animDuration * 1000 + 50);
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
      {/* Left Side: Interactive Compass Lab Scene */}
      <div style={{ 
        flex: '1.75', 
        display: 'flex', 
        flexDirection: 'column', 
        minWidth: 0,
        height: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Scene Container with Exact Compass from Activity 4.7 */}
        <div 
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
            backgroundImage: `url('/SuspendedMagnet/conclusion_bg.jpg')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            display: 'flex', 
            flexDirection: 'column',
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

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            style={{
              position: 'absolute',
              top: '16px',
              right: '20px',
              zIndex: 30,
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#0F172A',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            {isFullscreen ? <Minimize2 size={15} color="#0F172A" /> : <Maximize2 size={15} color="#0F172A" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>

          {/* Activity 4.7 Exact Compass Assembly with Matching Top Brass Thumb Loop */}
          <div style={{ 
            position: 'relative', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            marginTop: '34px'
          }}>
            <ExactCompass 
              rotation={needleAngle} 
              size={295} 
              showThumbLoop={true} 
              onClick={handleDeflect} 
              transition={customTransition} 
            />
          </div>
        </div>
      </div>

      {/* Right Side: Guide & Control Panel (Enlarged Spacious Typography) */}
      <div style={{ 
        flex: '1.05', 
        background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', 
        border: '1.5px solid #FDE68A', 
        borderRadius: '24px', 
        padding: '1.5rem 1.65rem', 
        boxShadow: '0 6px 24px rgba(217, 119, 6, 0.08)', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        gap: '1.15rem', 
        minWidth: 0, 
        height: '100%', 
        boxSizing: 'border-box', 
        overflowY: 'auto' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Kicker Badge */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: '#DCFCE7', 
            padding: '0.45rem 1rem', 
            borderRadius: '20px', 
            fontSize: '0.94rem', 
            fontWeight: 900, 
            color: '#15803D', 
            border: '1.5px solid #86EFAC',
            letterSpacing: '0.5px',
            alignSelf: 'flex-start'
          }}>
            <Sparkles size={18} color="#16A34A" /> EXPERIMENT CONCLUSION
          </div>

          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 900, 
            color: '#78350F', 
            margin: 0,
            lineHeight: 1.25,
            letterSpacing: '-0.02em'
          }}>
            How a Compass Works
          </h2>

          <p style={{ 
            fontSize: '1.12rem', 
            color: '#065F46', 
            lineHeight: 1.7, 
            fontWeight: 700,
            margin: 0
          }}>
            A freely suspended bar magnet or compass needle always comes to rest pointing in the <strong style={{ color: '#D97706', fontWeight: 900 }}>North-South direction</strong>. This fundamental property has guided navigators, explorers, and travelers across the globe for centuries!
          </p>

          {/* Finding Directions with the Sun Info Card */}
          <div style={{
            background: '#DCFCE7',
            border: '1.5px solid #86EFAC',
            borderRadius: '20px',
            padding: '1.25rem 1.45rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.95rem',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.12)'
          }}>
            <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>☀️</span>
            <p style={{ 
              margin: 0, 
              fontSize: '1.06rem', 
              color: '#166534', 
              lineHeight: 1.65, 
              fontWeight: 700 
            }}>
              Using the Sun's sunrise or sunset position gives an approximate East-West reference line, allowing us to accurately identify the North-South axis along which the magnet settles.
            </p>
          </div>

          {/* Interactive Controls Card */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.96)', 
            border: '1.5px solid #FDE68A', 
            borderRadius: '20px', 
            padding: '1.3rem 1.45rem',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.05)'
          }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#78350F', letterSpacing: '0.5px', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Compass size={20} color="#D97706" /> COMPASS CONTROLS
            </div>

            <p style={{ fontSize: '1.05rem', color: '#065F46', fontWeight: 700, margin: '0 0 0.95rem 0', lineHeight: 1.55 }}>
              Tap the button or hover over the compass dial to deflect the magnetized needle:
            </p>

            <button
              onClick={handleDeflect}
              disabled={isSpinning || isPausedAtNorth}
              className={!isSpinning && !isPausedAtNorth ? 'gold-glow-btn' : ''}
              style={{
                width: '100%',
                padding: '1.1rem 1.4rem',
                fontSize: '1.18rem',
                fontWeight: 900,
                borderRadius: '18px',
                background: isSpinning || isPausedAtNorth ? '#CBD5E1' : undefined,
                color: isSpinning || isPausedAtNorth ? '#64748B' : '#FFFFFF',
                border: isSpinning || isPausedAtNorth ? 'none' : undefined,
                cursor: isSpinning || isPausedAtNorth ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.7rem',
                boxShadow: isSpinning || isPausedAtNorth ? 'none' : undefined,
                transition: 'all 0.2s ease',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
              }}
            >
              <RotateCw size={22} className={isSpinning ? 'spin-anim' : ''} />
              {isSpinning
                ? 'Deflecting Needle...'
                : isPausedAtNorth
                ? 'Aligned to North-South (Observing...)'
                : 'Deflect Compass Needle'}
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderTop: '1.5px solid #E2E8F0',
          paddingTop: '0.9rem'
        }}>
          <span style={{ fontSize: '1.02rem', color: '#047857', fontWeight: 800, fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
            Stage 2 of 2 ● ●
          </span>

          <button
            onClick={onComplete}
            className="gold-glow-btn"
            style={{
              padding: '1.05rem 2.6rem',
              fontSize: '1.18rem',
              fontWeight: 900,
              borderRadius: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              transition: 'all 0.2s ease',
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
            }}
          >
            Proceed to Quiz <ArrowRight size={22} color="#FFFFFF" />
          </button>
        </div>
      </div>
    </div>
  );
}
