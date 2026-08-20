import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, CheckCircle, RotateCcw, Flag } from 'lucide-react';

export default function Stage2_Floating({ onComplete }) {
  const [step, setStep] = useState('initial'); // 'initial', 'floating', 'settled'
  const [rotationAngle, setRotationAngle] = useState(0);
  const [spinCount, setSpinCount] = useState(0);

  const handlePlaceCork = () => {
    // Random starting rotation
    const initialRotation = (Math.random() > 0.5 ? 1 : -1) * (45 + Math.random() * 90);
    setRotationAngle(initialRotation);
    setStep('floating');

    // After a short delay, let it settle to 0 degrees (North-South)
    setTimeout(() => {
      setRotationAngle(0);
      setTimeout(() => {
        setStep('settled');
      }, 1500); // settling time
    }, 1000);
  };

  const handleSpin = () => {
    if (step !== 'settled') return;
    
    setSpinCount(prev => prev + 1);
    const spinAmount = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 180);
    setRotationAngle(prev => prev + spinAmount);
    setStep('floating');

    setTimeout(() => {
      setRotationAngle(0);
      setTimeout(() => {
        setStep('settled');
      }, 1500);
    }, 1000);
  };

  const handleFinish = () => {
    onComplete();
  };

  const handleReset = () => {
    setStep('initial');
    setRotationAngle(0);
    setSpinCount(0);
  };

  const renderCorkWithNeedle = (isInteractive) => (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', perspective: '1200px', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: '48%', left: '50%', transformStyle: 'preserve-3d', transform: 'translate(-50%, -50%) rotateX(58deg)' }}>
        
        {/* Dynamic Water Ripples when Floating or Spinning */}
        {(step === 'floating' || step === 'settled') && (
          <>
            <motion.div 
              initial={{ scale: 0.5, opacity: 0.9 }}
              animate={{ scale: [0.6, 2.4], opacity: [0.8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              style={{ 
                position: 'absolute', top: -75, left: -75, width: 150, height: 150, 
                borderRadius: '50%', border: '2.5px solid rgba(255, 255, 255, 0.85)',
                boxShadow: '0 0 12px rgba(56, 189, 248, 0.6)',
                pointerEvents: 'none' 
              }}
            />
            <motion.div 
              initial={{ scale: 0.4, opacity: 0.9 }}
              animate={{ scale: [0.4, 1.8], opacity: [0.7, 0] }}
              transition={{ duration: 2, delay: 0.6, repeat: Infinity, ease: 'easeOut' }}
              style={{ 
                position: 'absolute', top: -75, left: -75, width: 150, height: 150, 
                borderRadius: '50%', border: '2px solid rgba(186, 230, 253, 0.7)',
                pointerEvents: 'none' 
              }}
            />
          </>
        )}
        
        {/* Idle Buoyancy Bobbing Motion */}
        <motion.div
          animate={{ 
            z: step === 'floating' || step === 'settled' ? [0, 5, 0] : 0,
            rotateX: step === 'floating' || step === 'settled' ? [0, 1.5, 0] : 0 
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, transformStyle: 'preserve-3d' }}
        >
          {/* Rotational Alignment Container */}
          <motion.div
            style={{
              position: 'absolute', top: 0, left: 0, width: 0, height: 0,
              transformStyle: 'preserve-3d', cursor: isInteractive ? 'pointer' : 'grab', pointerEvents: 'auto'
            }}
            animate={{ rotateZ: rotationAngle }}
            transition={{ type: 'spring', stiffness: 28, damping: 12, mass: 1.8 }}
            whileHover={isInteractive ? { scale: 1.06 } : {}}
            whileTap={isInteractive ? { scale: 0.94 } : { cursor: 'grabbing' }}
            onClick={isInteractive ? handleSpin : undefined}
            title={isInteractive && step === 'settled' ? "Click to gently spin the compass!" : ""}
          >
            {/* 3D Cork Disc Assembly */}
            <div style={{ position: 'absolute', width: 100, height: 100, left: -50, top: -50, transformStyle: 'preserve-3d' }}>
              {/* Soft Water Shadow */}
              <div style={{ 
                position: 'absolute', width: 104, height: 104, left: -2, top: -2, 
                borderRadius: '50%', background: 'rgba(3, 105, 161, 0.45)', 
                filter: 'blur(8px)', transform: 'translateZ(-4px)' 
              }} />

              {/* Stacked 3D Cylindrical Cork Layers for Realistic Height */}
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} style={{ 
                  position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', 
                  background: i === 15 
                    ? 'radial-gradient(circle at 35% 35%, #FDE68A 0%, #F59E0B 45%, #D97706 80%, #78350F 100%)' 
                    : (i % 2 === 0 ? '#D97706' : '#B45309'), 
                  boxShadow: i === 15 ? 'inset 0 0 12px rgba(120, 53, 15, 0.5), 0 0 4px rgba(245, 158, 11, 0.4)' : 'none',
                  border: i === 15 ? '1.5px solid #FEF3C7' : 'none',
                  transform: `translateZ(${i * 0.9}px)` 
                }} />
              ))}

              {/* Photorealistic 3D Magnetized Needle Mounted on Cork */}
              <img 
                src="/MagneticCompass/magnetic_needle_transparent.png"
                alt="Photorealistic Magnetized Needle"
                draggable="false"
                style={{
                  position: 'absolute',
                  width: '290px',
                  height: 'auto',
                  left: '50%',
                  top: '50%',
                  transform: 'translateZ(17px) translate(-50%, -50%) rotate(-90deg)',
                  filter: 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.95)) drop-shadow(0 8px 14px rgba(0,0,0,0.65))',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );

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
      {/* Left Side: Interactive Area */}
      <div style={{ flex: '1.75', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '100%', minHeight: 0, boxSizing: 'border-box' }}>
        {/* Top Header Container */}
        <div style={{ 
          width: '100%',
          textAlign: 'center',
          background: '#FFFFFF',
          padding: '0.65rem 1.25rem',
          borderRadius: '20px',
          border: '1.5px solid #A7F3D0',
          boxShadow: '0 4px 16px rgba(6, 78, 59, 0.06)',
          boxSizing: 'border-box',
          marginBottom: '0.5rem'
        }}>
          <h3 style={{ margin: '0 0 0.15rem 0', fontSize: '1.35rem', fontWeight: 900, color: '#064E3B', letterSpacing: '-0.01em' }}>
            Floating the Compass (Fig. 4.6)
          </h3>
          <p style={{ margin: 0, color: '#475569', fontSize: '0.88rem', fontWeight: 600 }}>
            {step === 'initial' 
              ? "Drag the cork into the bowl of water."
              : "Click the cork to gently rotate it and see what happens."}
          </p>
        </div>

        {/* Enlarged Canvas Activity Area */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '100%',
          flex: 1,
          minHeight: '300px', 
          background: '#F0FDF4',
          border: '1.5px solid #A7F3D0',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: '0 8px 25px rgba(6, 78, 59, 0.08)'
        }}>
          {/* Finding Directions Physics Lab Background Image */}
          <img 
            src="/SuspendedMagnet/wooden_stand_lab_bg.jpg" 
            alt="Physics Lab Background" 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              filter: 'brightness(1.05) contrast(0.95)',
              zIndex: 1 
            }} 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.25)', zIndex: 1, pointerEvents: 'none' }} />

          {/* Transparent White Sheet of Paper Sheet */}
          <div style={{
            position: 'absolute',
            width: '560px',
            maxWidth: '92%',
            height: '340px',
            maxHeight: '86%',
            background: 'rgba(255, 255, 255, 0.82)',
            backdropFilter: 'blur(3px)',
            border: '1.5px solid rgba(255, 255, 255, 0.95)',
            borderRadius: '18px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12), inset 0 0 20px rgba(255, 255, 255, 0.6)',
            zIndex: 2,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            padding: '8px 12px'
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#475569', letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.75 }}>
              📄 White Paper Sheet
            </span>
          </div>
          
          {/* Photorealistic 3D Glass Water Bowl & Compass Assembly */}
          <div style={{
            width: '360px',
            height: '280px',
            position: 'relative',
            marginTop: '10px',
            zIndex: 10,
            perspective: '1000px'
          }}>
            {/* Outer Glass Bowl Base & Rim */}
            <div style={{ 
              position: 'absolute', top: 70, left: 0, width: 360, height: 180, 
              borderRadius: '0 0 180px 180px', 
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(224, 242, 254, 0.85) 45%, rgba(14, 165, 233, 0.4) 100%)', 
              boxSizing: 'border-box',
              border: '3px solid rgba(255, 255, 255, 0.9)',
              borderTop: 'none',
              boxShadow: '0 20px 40px rgba(14, 165, 233, 0.25), inset 0 -15px 25px rgba(2, 132, 199, 0.3)'
            }} />

            {/* Glass Interior Bowl Rim */}
            <div style={{ 
              position: 'absolute', top: 10, left: 0, width: 360, height: 150, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', 
              boxSizing: 'border-box',
              border: '4px solid #CBD5E1',
              boxShadow: 'inset 0 12px 25px rgba(0,0,0,0.9), 0 0 15px rgba(255,255,255,0.6)' 
            }} />

            {/* Metallic Gold Compass Bezel Outer Ring */}
            <div style={{ 
              position: 'absolute', top: 14, left: 4, width: 352, height: 142, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #FDE68A 0%, #D97706 50%, #78350F 100%)', 
              boxSizing: 'border-box',
              padding: '3px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.6)'
            }}>
              {/* Photorealistic Water Surface */}
              <div style={{ 
                position: 'relative', width: '100%', height: '100%', 
                borderRadius: '50%', 
                background: 'radial-gradient(ellipse at 45% 35%, #E0F2FE 0%, #38BDF8 30%, #0284C7 65%, #0369A1 100%)', 
                boxSizing: 'border-box',
                overflow: 'hidden',
                boxShadow: 'inset 0 8px 18px rgba(3, 105, 161, 0.8)' 
              }}>
                {/* Caustic Light Waves & Reflections */}
                <div style={{ 
                  position: 'absolute', inset: 0, 
                  background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 60%)', 
                  pointerEvents: 'none' 
                }} />
                
                {/* Concentric Water Waves */}
                <div style={{ position: 'absolute', top: '6%', left: '6%', width: '88%', height: '88%', borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '18%', left: '18%', width: '64%', height: '64%', borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.18)', pointerEvents: 'none' }} />
                
                {/* Faint Compass Rose Dial on Water */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(1.1, 0.46)', opacity: 0.22, pointerEvents: 'none' }}>
                  <Compass size={240} color="#FFFFFF" />
                </div>
              </div>
            </div>

            {/* 3D High-Contrast Cardinal Direction Markers (N, S, E, W) */}
            <div style={{ 
              position: 'absolute', top: -14, left: 172, 
              fontWeight: 900, color: '#EF4444', fontSize: '1.35rem', 
              textShadow: '0 0 10px rgba(239, 68, 68, 0.8), 0 2px 4px rgba(0,0,0,0.8)',
              background: '#FFFFFF', padding: '1px 8px', borderRadius: '12px', border: '1.5px solid #EF4444'
            }}>N</div>

            <div style={{ 
              position: 'absolute', top: 236, left: 173, 
              fontWeight: 900, color: '#3B82F6', fontSize: '1.35rem', 
              textShadow: '0 0 10px rgba(59, 130, 246, 0.8), 0 2px 4px rgba(0,0,0,0.8)',
              background: '#FFFFFF', padding: '1px 8px', borderRadius: '12px', border: '1.5px solid #3B82F6'
            }}>S</div>

            <div style={{ 
              position: 'absolute', top: 68, left: -26, 
              fontWeight: 900, color: '#1E293B', fontSize: '1.25rem', 
              textShadow: '0 2px 4px rgba(0,0,0,0.4)',
              background: '#FFFFFF', padding: '1px 6px', borderRadius: '10px', border: '1.5px solid #CBD5E1'
            }}>W</div>

            <div style={{ 
              position: 'absolute', top: 68, right: -26, 
              fontWeight: 900, color: '#1E293B', fontSize: '1.25rem', 
              textShadow: '0 2px 4px rgba(0,0,0,0.4)',
              background: '#FFFFFF', padding: '1px 6px', borderRadius: '10px', border: '1.5px solid #CBD5E1'
            }}>E</div>

            {/* Floating Cork with Magnetized Needle (Inside Bowl) */}
            <div style={{ position: 'absolute', top: -55, left: 40, width: 280, height: 280, pointerEvents: 'none' }}>
              <AnimatePresence>
                {step !== 'initial' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.4, y: -60 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', damping: 16 }}
                    style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
                  >
                    {renderCorkWithNeedle(true)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Standalone Cork (Outside Bowl initially - Drag to water) */}
          <AnimatePresence>
            {step === 'initial' && (
              <motion.div
                drag
                dragSnapToOrigin={true}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -80 || info.offset.x > 80 || info.offset.y < -50 || info.offset.y > 50) {
                    handlePlaceCork();
                  }
                }}
                style={{
                  position: 'relative',
                  width: '130px',
                  height: '130px',
                  cursor: 'grab',
                  marginLeft: '25px',
                  zIndex: 20
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ cursor: 'grabbing', scale: 1.02 }}
              >
                {renderCorkWithNeedle(false)}
                <div style={{ 
                  position: 'absolute', bottom: '-20px', left: '5px', width: '120px', 
                  textAlign: 'center', fontSize: '0.8rem', fontWeight: 900, 
                  color: '#FFFFFF', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', 
                  border: 'none', padding: '0.3rem 0.4rem', borderRadius: '14px', 
                  boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)',
                  whiteSpace: 'nowrap',
                  boxSizing: 'border-box'
                }}>
                  Drag to bowl
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', width: '100%' }}>
          <button 
            onClick={handleReset}
            disabled={step === 'initial'}
            style={{ 
              flex: 1,
              padding: '0.75rem 1rem', 
              fontSize: '0.95rem', 
              fontWeight: 800, 
              borderRadius: '25px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.6rem',
              background: '#FFFFFF',
              color: step !== 'initial' ? '#1E293B' : '#94A3B8',
              border: '1.5px solid #CBD5E1',
              cursor: step !== 'initial' ? 'pointer' : 'not-allowed',
              opacity: step !== 'initial' ? 1 : 0.6,
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            <RotateCcw size={18} color={step !== 'initial' ? '#334155' : '#94A3B8'} /> Reset Activity
          </button>
        </div>
      </div>

      {/* Right Side: Instructions & Always Visible Observation Panel */}
      <div style={{ 
        flex: '0.75', 
        background: '#FFFFFF',
        border: '1.5px solid #A7F3D0',
        borderRadius: '20px',
        padding: '1rem 1.25rem',
        boxShadow: '0 6px 20px rgba(6, 78, 59, 0.06)',
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.85rem', 
        height: '100%',
        minHeight: 0,
        boxSizing: 'border-box',
        overflowY: 'auto' 
      }}>
        <div style={{ 
          padding: '1.25rem 1.4rem', 
          background: '#F0FDF4', 
          border: '1.5px solid #A7F3D0', 
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(6, 78, 59, 0.04)'
        }}>
          <h4 style={{ color: '#064E3B', margin: '0 0 0.75rem 0', fontSize: '1.15rem', fontWeight: 900 }}>Instructions</h4>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.92rem', lineHeight: '1.6', fontWeight: 600 }}>
            <li style={{ fontWeight: step === 'initial' ? 800 : 600, color: step === 'initial' ? '#D97706' : '#334155' }}>
              Insert the magnetized needle through a small piece of cork.
            </li>
            <li style={{ fontWeight: step === 'initial' ? 800 : 600, color: step === 'initial' ? '#D97706' : '#334155' }}>
              <strong>Drag</strong> the cork to let it float in the bowl of water. Make sure the needle does not touch the water.
            </li>
            <li style={{ fontWeight: step === 'settled' && spinCount === 0 ? 800 : 600, color: step === 'settled' && spinCount === 0 ? '#D97706' : '#334155' }}>
              Observe the direction in which the needle points when the cork stops rotating.
            </li>
            <li style={{ fontWeight: step === 'settled' && spinCount > 0 ? 800 : 600, color: step === 'settled' && spinCount > 0 ? '#D97706' : '#334155' }}>
              <strong>Click the cork</strong> to gently rotate it and wait till it stops rotating. Repeat this a few more times. Do the ends always point in the same direction?
            </li>
          </ol>
        </div>

        {/* Observation Card - Always Visible, Enabled Only After Activity Completed */}
        {(() => {
          const isCompleted = step === 'settled' && spinCount > 0;
          return (
            <div
              style={{ 
                padding: '1.25rem 1.4rem', 
                background: isCompleted ? '#DCFCE7' : '#F8FAFC', 
                border: `1.5px solid ${isCompleted ? '#16A34A' : '#CBD5E1'}`, 
                borderRadius: '16px',
                boxShadow: isCompleted ? '0 4px 14px rgba(22, 163, 74, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.03)',
                transition: 'all 0.3s ease'
              }}
            >
              <h4 style={{ color: isCompleted ? '#065F46' : '#64748B', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 900 }}>
                <CheckCircle size={22} color={isCompleted ? '#16A34A' : '#94A3B8'} /> 
                Observation
              </h4>
              <p style={{ margin: '0 0 1rem 0', color: isCompleted ? '#166534' : '#64748B', fontSize: '0.92rem', fontWeight: '700' }}>
                Yes! No matter how you spin it, the magnetized needle always comes to rest pointing in the <strong style={{ color: isCompleted ? '#D97706' : '#475569' }}>North-South</strong> direction, just like a standard magnetic compass!
              </p>
              
              <button 
                onClick={handleFinish}
                disabled={!isCompleted}
                style={{ 
                  width: '100%', 
                  padding: '0.85rem 1.5rem', 
                  fontSize: '1.05rem', 
                  fontWeight: 900, 
                  borderRadius: '25px', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  background: isCompleted ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#E2E8F0',
                  color: isCompleted ? '#FFFFFF' : '#94A3B8',
                  border: isCompleted ? 'none' : '1.5px solid #CBD5E1',
                  cursor: isCompleted ? 'pointer' : 'not-allowed',
                  opacity: isCompleted ? 1 : 0.6,
                  boxShadow: isCompleted ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <Flag size={20} color={isCompleted ? '#FFFFFF' : '#94A3B8'} /> Finish Activity
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
