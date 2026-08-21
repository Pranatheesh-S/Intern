import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, CheckCircle, RotateCcw, Flag } from 'lucide-react';
import MagneticNeedleShape from './MagneticNeedleShape';

export default function Stage2_Floating({ onComplete }) {
  const [step, setStep] = useState('initial'); // 'initial', 'floating', 'settled'
  const [rotationAngle, setRotationAngle] = useState(0);
  const [spinCount, setSpinCount] = useState(0);

  const handlePlaceCork = () => {
    // Initial spin when placed in water, then settling to 0 (North-South)
    const initialRotation = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 90);
    setRotationAngle(initialRotation);
    setStep('floating');

    setTimeout(() => {
      setRotationAngle(0);
      setTimeout(() => {
        setStep('settled');
      }, 900); // settling time
    }, 400);
  };

  const handleSpin = () => {
    if (step !== 'settled') return;
    
    setSpinCount(prev => prev + 1);
    // Rapid fast spin of 2-3 full turns (720deg+)
    const fastSpinAmount = (Math.random() > 0.5 ? 1 : -1) * (720 + Math.random() * 360);
    setRotationAngle(prev => prev + fastSpinAmount);
    setStep('floating');

    // Rapidly settles back to 0 degrees (pointing North-South)
    setTimeout(() => {
      setRotationAngle(0);
      setTimeout(() => {
        setStep('settled');
      }, 900);
    }, 500);
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
      <div style={{ position: 'absolute', top: '50%', left: '50%', transformStyle: 'preserve-3d', transform: 'translate(-50%, -50%) rotateX(55deg)' }}>
        
        {/* Dynamic Water Ripples when Floating or Fast Spinning */}
        {(step === 'floating' || step === 'settled') && (
          <>
            <motion.div 
              initial={{ scale: 0.5, opacity: 0.9 }}
              animate={{ scale: [0.6, 2.6], opacity: [0.85, 0] }}
              transition={{ duration: step === 'floating' ? 0.9 : 2.2, repeat: Infinity, ease: 'easeOut' }}
              style={{ 
                position: 'absolute', top: -75, left: -75, width: 150, height: 150, 
                borderRadius: '50%', border: '2.5px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 0 14px rgba(56, 189, 248, 0.7)',
                pointerEvents: 'none' 
              }}
            />
            <motion.div 
              initial={{ scale: 0.4, opacity: 0.9 }}
              animate={{ scale: [0.4, 2.0], opacity: [0.75, 0] }}
              transition={{ duration: step === 'floating' ? 0.9 : 2.2, delay: 0.35, repeat: Infinity, ease: 'easeOut' }}
              style={{ 
                position: 'absolute', top: -75, left: -75, width: 150, height: 150, 
                borderRadius: '50%', border: '2px solid rgba(186, 230, 253, 0.8)',
                pointerEvents: 'none' 
              }}
            />
          </>
        )}
        
        {/* Idle Buoyancy Bobbing Motion */}
        <motion.div
          animate={{ 
            z: step === 'floating' || step === 'settled' ? [0, 6, 0] : 0,
            rotateX: step === 'floating' || step === 'settled' ? [0, 2, 0] : 0 
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, transformStyle: 'preserve-3d' }}
        >
          {/* Fast Rotational Alignment Container */}
          <motion.div
            style={{
              position: 'absolute', top: 0, left: 0, width: 0, height: 0,
              transformStyle: 'preserve-3d', cursor: isInteractive ? 'pointer' : 'grab', pointerEvents: 'auto'
            }}
            animate={{ rotateZ: rotationAngle }}
            transition={{ type: 'spring', stiffness: 120, damping: 14, mass: 1.1 }}
            whileHover={isInteractive ? { scale: 1.08 } : {}}
            whileTap={isInteractive ? { scale: 0.92 } : { cursor: 'grabbing' }}
            onClick={isInteractive ? handleSpin : undefined}
            title={isInteractive && step === 'settled' ? "Click to rapidly spin the compass needle!" : ""}
          >
            {/* 3D Cork Disc Assembly */}
            <div style={{ position: 'absolute', width: 96, height: 96, left: -48, top: -48, transformStyle: 'preserve-3d' }}>
              {/* Soft Water Shadow */}
              <div style={{ 
                position: 'absolute', width: 104, height: 104, left: -4, top: -4, 
                borderRadius: '50%', background: 'rgba(3, 105, 161, 0.55)', 
                filter: 'blur(8px)', transform: 'translateZ(-4px)' 
              }} />

              {/* Stacked 3D Cylindrical Cork Layers */}
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

              {/* Magnetized Needle Mounted on Cork:
                  North (Red Tip) points directly UP to North (N), South (Blue End) points DOWN to South (S) */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translateZ(18px) translate(-50%, -50%) rotate(90deg)',
                filter: 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.95)) drop-shadow(0 8px 14px rgba(0,0,0,0.65))',
                pointerEvents: 'none'
              }}>
                <MagneticNeedleShape 
                  width={260} 
                  height={32} 
                  orientation="horizontal"
                  isGlowing={true} 
                />
              </div>
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
      <div style={{ flex: '1.65', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '100%', minHeight: 0, boxSizing: 'border-box' }}>
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
              : "Click the floating cork to spin the compass needle fast and observe it settle North-South!"}
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

          {/* Transparent White Sheet of Paper */}
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
          
          {/* Photorealistic 3D Ceramic Water Bowl & Compass Assembly */}
          <div style={{
            width: '380px',
            height: '340px',
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* 3D Water Bowl Image */}
            <img 
              src="/MagneticCompass/water_bowl_3d.png" 
              alt="Photorealistic 3D Water Bowl" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 16px 30px rgba(0, 0, 0, 0.35))'
              }}
            />

            {/* 3D High-Contrast Cardinal Direction Markers (N, S, E, W) */}
            <div style={{ 
              position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)',
              fontWeight: 900, color: '#EF4444', fontSize: '1.35rem', 
              textShadow: '0 0 10px rgba(239, 68, 68, 0.8), 0 2px 4px rgba(0,0,0,0.8)',
              background: '#FFFFFF', padding: '1px 8px', borderRadius: '12px', border: '1.5px solid #EF4444',
              zIndex: 25
            }}>N</div>

            <div style={{ 
              position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)',
              fontWeight: 900, color: '#3B82F6', fontSize: '1.35rem', 
              textShadow: '0 0 10px rgba(59, 130, 246, 0.8), 0 2px 4px rgba(0,0,0,0.8)',
              background: '#FFFFFF', padding: '1px 8px', borderRadius: '12px', border: '1.5px solid #3B82F6',
              zIndex: 25
            }}>S</div>

            <div style={{ 
              position: 'absolute', top: '50%', left: 16, transform: 'translateY(-50%)',
              fontWeight: 900, color: '#1E293B', fontSize: '1.25rem', 
              textShadow: '0 2px 4px rgba(0,0,0,0.4)',
              background: '#FFFFFF', padding: '1px 6px', borderRadius: '10px', border: '1.5px solid #CBD5E1',
              zIndex: 25
            }}>W</div>

            <div style={{ 
              position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)',
              fontWeight: 900, color: '#1E293B', fontSize: '1.25rem', 
              textShadow: '0 2px 4px rgba(0,0,0,0.4)',
              background: '#FFFFFF', padding: '1px 6px', borderRadius: '10px', border: '1.5px solid #CBD5E1',
              zIndex: 25
            }}>E</div>

            {/* Floating Cork with Magnetized Needle (Inside Bowl) */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
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

          {/* Draggable Cork Disc on Left (Initial Step) */}
          {step === 'initial' && (
            <div style={{ position: 'absolute', left: '25px', top: '50%', transform: 'translateY(-50%)', zIndex: 30 }}>
              <motion.div
                drag
                dragConstraints={{ left: -10, right: 350, top: -120, bottom: 120 }}
                dragElastic={0.15}
                whileHover={{ scale: 1.08 }}
                whileTap={{ cursor: 'grabbing', scale: 0.95 }}
                onDragEnd={(event, info) => {
                  if (info.offset.x > 100) {
                    handlePlaceCork();
                  }
                }}
                style={{
                  width: '130px',
                  height: '130px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'grab'
                }}
              >
                {renderCorkWithNeedle(false)}
                <div style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '5px',
                  width: '120px',
                  background: '#FFFFFF',
                  border: '1.5px solid #A7F3D0',
                  borderRadius: '12px',
                  padding: '0.3rem 0.4rem',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  color: '#064E3B',
                  boxShadow: '0 4px 10px rgba(6, 78, 59, 0.1)',
                  pointerEvents: 'none',
                  textAlign: 'center'
                }}>
                  Drag to bowl
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Action Controls Button under Activity Canvas (amber-orange) */}
        <div style={{ marginTop: '0.4rem', width: '100%' }}>
          <button
            onClick={step === 'initial' ? handlePlaceCork : handleSpin}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              fontSize: '0.98rem',
              fontWeight: 900,
              borderRadius: '25px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
              transition: 'all 0.25s ease'
            }}
          >
            {step === 'initial' ? (
              <>
                <Flag size={18} color="#FFFFFF" /> Float Cork on Water
              </>
            ) : (
              <>
                <RotateCcw size={18} color="#FFFFFF" /> Spin Needle Fast! 🔄
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Side: Step-by-Step Guide & Observations (Filled spacious typography) */}
      <div style={{ 
        flex: '0.95', 
        background: '#FFFFFF',
        border: '1.5px solid #A7F3D0',
        borderRadius: '22px',
        padding: '1.25rem 1.35rem',
        boxShadow: '0 6px 20px rgba(6, 78, 59, 0.06)',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        minWidth: 0, 
        height: '100%',
        boxSizing: 'border-box' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
          <h4 style={{ color: '#064E3B', margin: 0, fontSize: '1.22rem', fontWeight: 900, letterSpacing: '-0.01em' }}>
            Floating Compass Steps
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              alignItems: 'flex-start',
              padding: '0.75rem 0.95rem',
              borderRadius: '14px',
              background: step !== 'initial' ? '#DCFCE7' : '#F0FDF4',
              border: `1.5px solid ${step !== 'initial' ? '#16A34A' : '#A7F3D0'}`
            }}>
              <span style={{ 
                width: '26px', 
                height: '26px', 
                borderRadius: '50%', 
                background: step !== 'initial' ? '#16A34A' : '#D97706',
                color: '#FFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '0.85rem',
                fontWeight: 900,
                flexShrink: 0
              }}>1</span>
              <div>
                <strong style={{ color: '#064E3B', fontSize: '0.98rem' }}>Float on Water:</strong>
                <p style={{ margin: '0.15rem 0 0 0', color: '#475569', fontSize: '0.88rem', lineHeight: '1.4' }}>
                  Insert the magnetized needle into the light cork and place it in the water bowl.
                </p>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              alignItems: 'flex-start',
              padding: '0.75rem 0.95rem',
              borderRadius: '14px',
              background: step === 'settled' ? '#DCFCE7' : '#F8FAFC',
              border: `1.5px solid ${step === 'settled' ? '#16A34A' : '#CBD5E1'}`
            }}>
              <span style={{ 
                width: '26px', 
                height: '26px', 
                borderRadius: '50%', 
                background: step === 'settled' ? '#16A34A' : '#94A3B8',
                color: '#FFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '0.85rem',
                fontWeight: 900,
                flexShrink: 0
              }}>2</span>
              <div>
                <strong style={{ color: '#064E3B', fontSize: '0.98rem' }}>Observe Alignment:</strong>
                <p style={{ margin: '0.15rem 0 0 0', color: '#475569', fontSize: '0.88rem', lineHeight: '1.4' }}>
                  The floating needle freely rotates and settles pointing along the North-South line.
                </p>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              alignItems: 'flex-start',
              padding: '0.75rem 0.95rem',
              borderRadius: '14px',
              background: spinCount > 0 ? '#DCFCE7' : '#F8FAFC',
              border: `1.5px solid ${spinCount > 0 ? '#16A34A' : '#CBD5E1'}`
            }}>
              <span style={{ 
                width: '26px', 
                height: '26px', 
                borderRadius: '50%', 
                background: spinCount > 0 ? '#16A34A' : '#94A3B8',
                color: '#FFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '0.85rem',
                fontWeight: 900,
                flexShrink: 0
              }}>3</span>
              <div>
                <strong style={{ color: '#064E3B', fontSize: '0.98rem' }}>Rotate & Test:</strong>
                <p style={{ margin: '0.15rem 0 0 0', color: '#475569', fontSize: '0.88rem', lineHeight: '1.4' }}>
                  Spin the needle in any random direction — it always returns directly to North-South!
                </p>
              </div>
            </div>
          </div>

          {/* Observation Alert Card */}
          <div style={{ 
            background: step === 'settled' ? '#F0FDF4' : '#F8FAFC', 
            border: `1.5px solid ${step === 'settled' ? '#A7F3D0' : '#E2E8F0'}`, 
            padding: '1rem 1.15rem', 
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(6, 78, 59, 0.04)'
          }}>
            <h5 style={{ margin: '0 0 0.35rem 0', color: step === 'settled' ? '#064E3B' : '#64748B', fontSize: '1.02rem', fontWeight: 900 }}>
              🔍 Scientific Observation
            </h5>
            <p style={{ margin: 0, fontSize: '0.92rem', color: step === 'settled' ? '#1E293B' : '#64748B', lineHeight: '1.55', fontWeight: 600 }}>
              {step === 'settled'
                ? "No matter how many times you spin the cork, the magnetized needle always comes to rest pointing in the North-South direction. This simple floating device works just like a real magnetic navigation compass!"
                : "Rotate the needle in different directions and let it settle to observe."}
            </p>
          </div>
        </div>

        {/* Completion Proceed Button (using amber-orange gradient matching back to chapter4) */}
        <button 
          onClick={handleFinish} 
          disabled={step !== 'settled'}
          style={{ 
            width: '100%', 
            padding: '0.95rem 1.6rem', 
            fontSize: '1.05rem', 
            fontWeight: 900, 
            borderRadius: '25px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '0.65rem',
            background: step === 'settled' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#E2E8F0',
            color: step === 'settled' ? '#FFFFFF' : '#94A3B8',
            border: 'none',
            cursor: step === 'settled' ? 'pointer' : 'not-allowed',
            boxShadow: step === 'settled' ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none',
            transition: 'all 0.25s ease'
          }}
        >
          <CheckCircle size={20} color={step === 'settled' ? "#FFFFFF" : "#94A3B8"} /> Finish Activity & Proceed to Quiz
        </button>
      </div>
    </div>
  );
}
