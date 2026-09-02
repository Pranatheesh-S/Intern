import React, { useState, useEffect } from 'react';
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
                position: 'absolute', top: -95, left: -95, width: 190, height: 190, 
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
                position: 'absolute', top: -95, left: -95, width: 190, height: 190, 
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
                position: 'absolute', width: 106, height: 106, left: -5, top: -5, 
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
                  transform: `translateZ(${i * 0.8}px)` 
                }} />
              ))}

              {/* Magnetized Needle Mounted on Cork:
                  North (Red Tip) points directly UP to North (N), South (Blue End) points DOWN to South (S) */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translateZ(16px) translate(-50%, -50%) rotate(90deg)',
                filter: 'drop-shadow(0 0 14px rgba(245, 158, 11, 0.95)) drop-shadow(0 6px 12px rgba(0,0,0,0.65))',
                pointerEvents: 'none'
              }}>
                <MagneticNeedleShape 
                  width={260} 
                  height={34} 
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
      <div style={{ flex: '1.65', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, boxSizing: 'border-box' }}>
        {/* Enlarged Canvas Activity Area */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '100%',
          flex: 1, 
          minHeight: '380px', 
          background: '#F0FDF4',
          border: '1.5px solid #A7F3D0',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: '0 12px 30px rgba(6, 78, 59, 0.12)'
        }}>
          {/* Laboratory Desk Background Image */}
          <img 
            src="/MagneticCompass/bg_image.jpg" 
            alt="Physics Lab Background" 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              filter: 'brightness(1.02) contrast(1.0)',
              zIndex: 1 
            }} 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.12)', zIndex: 1, pointerEvents: 'none' }} />

          {/* Photorealistic 3D Ceramic Water Bowl & Compass Assembly (Enlarged & Proportionate Size) */}
          <div style={{
            width: '420px',
            height: '380px',
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '1rem'
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
              position: 'absolute', top: 26, left: '50%', transform: 'translateX(-50%)',
              fontWeight: 900, color: '#EF4444', fontSize: '1.4rem', 
              textShadow: '0 0 10px rgba(239, 68, 68, 0.8), 0 2px 4px rgba(0,0,0,0.8)',
              background: '#FFFFFF', padding: '1px 8px', borderRadius: '12px', border: '1.5px solid #EF4444',
              zIndex: 25
            }}>N</div>

            <div style={{ 
              position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)',
              fontWeight: 900, color: '#3B82F6', fontSize: '1.4rem', 
              textShadow: '0 0 10px rgba(59, 130, 246, 0.8), 0 2px 4px rgba(0,0,0,0.8)',
              background: '#FFFFFF', padding: '1px 8px', borderRadius: '12px', border: '1.5px solid #3B82F6',
              zIndex: 25
            }}>S</div>

            <div style={{ 
              position: 'absolute', top: '50%', left: 20, transform: 'translateY(-50%)',
              fontWeight: 900, color: '#1E293B', fontSize: '1.3rem', 
              textShadow: '0 2px 4px rgba(0,0,0,0.4)',
              background: '#FFFFFF', padding: '1px 6px', borderRadius: '10px', border: '1.5px solid #CBD5E1',
              zIndex: 25
            }}>W</div>

            <div style={{ 
              position: 'absolute', top: '50%', right: 20, transform: 'translateY(-50%)',
              fontWeight: 900, color: '#1E293B', fontSize: '1.3rem', 
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
            <div style={{ position: 'absolute', left: '20px', top: '55%', transform: 'translateY(-50%)', zIndex: 30 }}>
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
                  width: '160px',
                  height: '160px',
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
                  bottom: '-18px',
                  left: '15px',
                  width: '130px',
                  background: '#FFFFFF',
                  border: '1.5px solid #A7F3D0',
                  borderRadius: '12px',
                  padding: '0.35rem 0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  color: '#064E3B',
                  boxShadow: '0 4px 10px rgba(6, 78, 59, 0.12)',
                  pointerEvents: 'none',
                  textAlign: 'center'
                }}>
                  Drag to bowl
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Step-by-Step Guide & Observations (Filled spacious typography) */}
      {/* Right Side: Step-by-Step Interactive Guide (Warm Amber Theme with Spacious Typography) */}
      <div style={{ 
        flex: '1.15', 
        background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)',
        border: '1.5px solid #FDE68A',
        borderRadius: '24px',
        padding: '1.45rem 1.6rem',
        boxShadow: '0 6px 24px rgba(217, 119, 6, 0.08)',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        minWidth: 0, 
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
        gap: '0.9rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Compass size={28} color="#D97706" />
              <h3 style={{ margin: 0, fontSize: '1.48rem', color: '#064E3B', fontWeight: 900 }}>
                Stage 2: Make a Compass
              </h3>
            </div>
            <span style={{
              background: '#DCFCE7',
              color: '#15803D',
              fontWeight: 900,
              fontSize: '0.96rem',
              padding: '0.38rem 0.95rem',
              borderRadius: '14px',
              border: '1.5px solid #86EFAC'
            }}>
              Step {step === 'settled' ? (spinCount > 0 ? 3 : 2) : 1} of 3
            </span>
          </div>
          
          {/* Step Cards Visible from Initial Load */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              {
                stepNum: 1,
                title: '1. Float Cork on Water',
                desc: 'Insert the magnetized needle into the light cork and place it gently in the water bowl.'
              },
              {
                stepNum: 2,
                title: '2. Observe Natural Alignment',
                desc: 'The floating needle freely rotates on the water surface and settles pointing North-South.'
              },
              {
                stepNum: 3,
                title: '3. Rotate & Verify Stability',
                desc: 'Spin the needle in random directions — it always returns steadily to the North-South line!'
              }
            ].map((s) => {
              const currentStepNum = step === 'settled' ? (spinCount > 0 ? 3 : 2) : 1;
              const isCurrent = currentStepNum === s.stepNum;
              const isPast = currentStepNum > s.stepNum || (s.stepNum === 1 && step !== 'initial') || (s.stepNum === 2 && step === 'settled');

              return (
                <div
                  key={s.stepNum}
                  style={{
                    padding: '0.95rem 1.15rem',
                    borderRadius: '16px',
                    background: isCurrent ? '#FEF3C7' : isPast ? '#DCFCE7' : '#FFFFFF',
                    border: isCurrent 
                      ? '2px solid #F59E0B' 
                      : isPast 
                      ? '1.5px solid #86EFAC' 
                      : '1.5px solid #FDE68A',
                    boxShadow: isCurrent 
                      ? '0 4px 14px rgba(245, 158, 11, 0.18)' 
                      : '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      <span style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isCurrent ? '#D97706' : isPast ? '#059669' : '#CBD5E1',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.92rem',
                        fontWeight: 900,
                        flexShrink: 0
                      }}>
                        {s.stepNum}
                      </span>
                      <span style={{ fontWeight: 900, fontSize: '1.18rem', color: isCurrent ? '#064E3B' : isPast ? '#065F46' : '#064E3B' }}>
                        {s.title}
                      </span>
                    </div>
                    {isPast && <CheckCircle size={20} color="#10B981" />}
                  </div>
                  <p style={{ margin: '0.4rem 0 0 0', fontSize: '1.02rem', color: '#065F46', lineHeight: 1.55, fontWeight: 700 }}>
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Observation Alert Card */}
          <div style={{ 
            background: '#FFFFFF', 
            border: '1.5px solid #FDE68A', 
            padding: '1.25rem 1.4rem', 
            borderRadius: '20px',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.05)'
          }}>
            <h5 style={{ margin: '0 0 0.45rem 0', color: '#064E3B', fontSize: '1.22rem', fontWeight: 900 }}>
              🔍 Scientific Observation
            </h5>
            <p style={{ margin: 0, fontSize: '1.02rem', color: '#065F46', lineHeight: 1.6, fontWeight: 700 }}>
              {step === 'settled'
                ? "The magnetized needle always comes to rest pointing North-South, working just like a real magnetic navigation compass!"
                : "Rotate the needle in different directions and let it settle to observe."}
            </p>
          </div>
        </div>

        {/* Action Controls Section on Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.3rem' }}>
          <button
            onClick={step === 'initial' ? handlePlaceCork : handleSpin}
            className="gold-glow-btn"
            style={{
              width: '100%',
              padding: '0.95rem 1.6rem',
              fontSize: '1.08rem',
              fontWeight: 900,
              borderRadius: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.65rem',
            }}
          >
            {step === 'initial' ? (
              <>
                <Flag size={20} color="#FFFFFF" /> Float Cork on Water
              </>
            ) : (
              <>
                <RotateCcw size={20} color="#FFFFFF" /> Spin Needle Fast! 🔄
              </>
            )}
          </button>

          {/* Completion Proceed Button */}
          <button 
            onClick={handleFinish} 
            disabled={step !== 'settled'}
            className={step === 'settled' ? 'gold-glow-btn' : ''}
            style={{ 
              width: '100%', 
              padding: '0.95rem 1.6rem', 
              fontSize: '1.08rem', 
              fontWeight: 900, 
              borderRadius: '20px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '0.65rem',
              background: step === 'settled' ? undefined : '#F1F5F9',
              color: step === 'settled' ? '#FFFFFF' : '#94A3B8',
              border: step === 'settled' ? undefined : '1.5px solid #E2E8F0',
              cursor: step === 'settled' ? 'pointer' : 'not-allowed',
              transition: 'all 0.25s ease'
            }}
          >
            <CheckCircle size={20} color={step === 'settled' ? "#FFFFFF" : "#94A3B8"} /> Finish Activity & Proceed to Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
