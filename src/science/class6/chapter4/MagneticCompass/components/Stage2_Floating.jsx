import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, CheckCircle, RotateCcw, AlertCircle, Flag, Hand } from 'lucide-react';

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
      // Return back to nearest 360 multiple of 0
      // Actually, just going to 0 is visually fine if we use spring, but to avoid unwind we can set to 0 and rely on framer motion
      // Or just modulo 360, but setting to 0 is perfectly fine for a simple spring animation.
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
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', perspective: '1000px', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transformStyle: 'preserve-3d', transform: 'rotateX(64.6deg)' }}>
        
        {/* Ripples */}
        {step === 'floating' && (
          <motion.div 
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ position: 'absolute', top: -50, left: -50, width: 100, height: 100, borderRadius: '50%', border: '2px solid white' }}
          />
        )}
        
        <motion.div
          animate={{ z: step === 'floating' || step === 'settled' ? [0, 6, 0] : 0 }}
          transition={{ z: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
          style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, transformStyle: 'preserve-3d' }}
        >
          <motion.div
            style={{
              position: 'absolute', top: 0, left: 0, width: 0, height: 0,
              transformStyle: 'preserve-3d', cursor: isInteractive ? 'pointer' : 'grab', pointerEvents: 'auto'
            }}
            animate={{ rotateZ: rotationAngle }}
            transition={{ type: 'spring', stiffness: 30, damping: 10, mass: 2 }}
            whileHover={isInteractive ? { scale: 1.05 } : {}}
            whileTap={isInteractive ? { scale: 0.95 } : { cursor: 'grabbing' }}
            onClick={isInteractive ? handleSpin : undefined}
            title={isInteractive && step === 'settled' ? "Click to spin!" : ""}
          >
            <div style={{ position: 'absolute', width: 95, height: 95, left: -47.5, top: -47.5, transformStyle: 'preserve-3d' }}>
              {/* Shadow on water */}
              <div style={{ position: 'absolute', width: 95, height: 95, left: 0, top: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', filter: 'blur(6px)', transform: 'translateZ(-2px)' }} />

              {Array.from({length: 15}).map((_, i) => (
                <div key={i} style={{ 
                  position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', 
                  background: i === 14 ? 'radial-gradient(circle at 30% 30%, #f59e0b, #d97706)' : (i % 2 === 0 ? '#d97706' : '#b45309'), 
                  boxShadow: i === 14 ? 'inset 0 0 10px rgba(0,0,0,0.3)' : 'none',
                  transform: `translateZ(${i}px)` 
                }} />
              ))}
              <img 
                src="/MagneticCompass/magnetic_needle.png"
                alt="Magnetic Needle"
                draggable="false"
                style={{
                  position: 'absolute',
                  width: '260px',
                  left: '50%',
                  top: '50%',
                  transform: 'translateZ(15px) translate(-50%, -50%) rotate(-90deg)',
                  filter: 'drop-shadow(3px 4px 8px rgba(0,0,0,0.45))',
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
      {/* Left Side: Interactive Area */}
      <div style={{ flex: '1.35', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.65rem', fontWeight: 800, color: '#134E4A', letterSpacing: '-0.01em' }}>
            Floating the Compass
          </h3>
          <p style={{ margin: 0, color: '#0F766E', fontSize: '1.05rem', fontWeight: 600 }}>
            {step === 'initial' 
              ? "Drag the cork into the bowl of water."
              : "Click the cork to gently rotate it and see what happens."}
          </p>
        </div>

        {/* Canvas */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '480px', 
          height: '280px', 
          background: '#f8fafc',
          border: '2px solid #cbd5e1',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 25px rgba(0,0,0,0.05), 0 8px 25px rgba(0,0,0,0.07)'
        }}>
          
          {/* Water Bowl (2.5D Isometric) */}
          <div style={{
            width: '300px',
            height: '240px',
            position: 'relative',
            marginTop: '15px',
            marginLeft: step === 'initial' ? '-80px' : '0',
            transition: 'margin-left 0.5s ease-in-out'
          }}>
            {/* Front bowl body (Opaque) */}
            <div style={{ 
              position: 'absolute', top: 75, left: 0, width: 300, height: 140, 
              borderRadius: '0 0 150px 150px', 
              background: 'radial-gradient(circle at 50% 0%, #334155 0%, #0f172a 100%)', 
              boxSizing: 'border-box',
              border: '4px solid #475569',
              borderTop: 'none',
              boxShadow: '0 15px 30px rgba(0,0,0,0.5)'
            }} />

            {/* Top opening rim and inside */}
            <div style={{ 
              position: 'absolute', top: 10, left: 0, width: 300, height: 130, 
              borderRadius: '50%', 
              background: '#1e293b', 
              boxSizing: 'border-box',
              border: '4px solid #475569',
              boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.8)' 
            }} />
            
            {/* Water surface */}
            <div style={{ 
              position: 'absolute', top: 16, left: 6, width: 288, height: 118, 
              borderRadius: '50%', 
              background: 'radial-gradient(circle at 50% 50%, #7dd3fc 0%, #38bdf8 50%, #0284c7 100%)', 
              boxSizing: 'border-box',
              overflow: 'hidden' 
            }}>
              {/* Concentric ripples */}
              <div style={{ position: 'absolute', top: '5%', left: '5%', width: '90%', height: '90%', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)' }} />
              <div style={{ position: 'absolute', top: '15%', left: '15%', width: '70%', height: '70%', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }} />
              <div style={{ position: 'absolute', top: '25%', left: '25%', width: '50%', height: '50%', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.05)' }} />
              
              {/* Compass Rose faintly on water */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(1, 0.43)', opacity: 0.1, pointerEvents: 'none' }}>
                <Compass size={250} />
              </div>
            </div>

            {/* North/South Labels adjusted for 3D */}
            <div style={{ position: 'absolute', top: -10, left: 143, fontWeight: 'bold', color: '#ffffff', fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>N</div>
            <div style={{ position: 'absolute', top: 220, left: 143, fontWeight: 'bold', color: '#ffffff', fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>S</div>
            <div style={{ position: 'absolute', top: 62, left: -25, fontWeight: 'bold', color: '#ffffff', fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>W</div>
            <div style={{ position: 'absolute', top: 62, right: -25, fontWeight: 'bold', color: '#ffffff', fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>E</div>

            {/* Cork with Needle (Inside Bowl) */}
            <div style={{ position: 'absolute', top: -60, left: 10, width: 280, height: 280, pointerEvents: 'none' }}>
              <AnimatePresence>
                {step !== 'initial' && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ scale: { duration: 0.3 } }}
                    style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                  >
                    {renderCorkWithNeedle(step === 'settled')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Initial Draggable Cork (Outside Bowl) */}
          <AnimatePresence>
            {step === 'initial' && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0 }}
                style={{ position: 'absolute', right: '20px', width: 100, height: 100, zIndex: 10 }}
                drag
                dragSnapToOrigin={true}
                dragElastic={0.1}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -80) { // Dragged leftwards towards the bowl
                    handlePlaceCork();
                  }
                }}
              >
                {renderCorkWithNeedle(false)}
                <div style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: '0.88rem', color: '#1e293b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Hand size={14} /> Drag me left
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
          <button 
            onClick={handleReset}
            disabled={step === 'initial'}
            style={{ 
              padding: '0.85rem 1.75rem', 
              fontSize: '1.02rem', 
              fontWeight: 700, 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem',
              background: '#ffffff',
              color: '#64748B',
              border: '1.5px solid #E2E8F0',
              cursor: step !== 'initial' ? 'pointer' : 'not-allowed',
              opacity: step !== 'initial' ? 1 : 0.6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <RotateCcw size={18} color="#64748B" /> Reset Activity
          </button>
        </div>
      </div>

      {/* Right Side: Frosted Glacial Teal Panel */}
      <div style={{ 
        flex: '0.85', 
        background: 'linear-gradient(135deg, #F0FDF9 0%, #E6F7F5 100%)',
        border: '1.5px solid #CCECE7',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 8px 25px rgba(15, 118, 110, 0.06)',
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.25rem', 
        overflowY: 'auto' 
      }}>
        <div style={{ 
          padding: '1.25rem 1.4rem', 
          background: '#ffffff', 
          border: '1.5px solid #CCECE7', 
          borderRadius: '16px',
          boxShadow: '0 4px 14px rgba(15, 118, 110, 0.04)'
        }}>
          <h4 style={{ color: '#134E4A', margin: '0 0 0.75rem 0', fontSize: '1.15rem', fontWeight: 800 }}>Instructions</h4>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', color: '#115E59', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.92rem', lineHeight: '1.6', fontWeight: 600 }}>
            <li style={{ fontWeight: step === 'initial' ? 800 : 600, color: step === 'initial' ? '#F43F5E' : '#115E59' }}>
              Insert the magnetized needle through a small piece of cork.
            </li>
            <li style={{ fontWeight: step === 'initial' ? 800 : 600, color: step === 'initial' ? '#F43F5E' : '#115E59' }}>
              <strong>Drag</strong> the cork to let it float in the bowl of water. Make sure the needle does not touch the water.
            </li>
            <li style={{ fontWeight: step === 'settled' && spinCount === 0 ? 800 : 600, color: step === 'settled' && spinCount === 0 ? '#F43F5E' : '#115E59' }}>
              Observe the direction in which the needle points when the cork stops rotating.
            </li>
            <li style={{ fontWeight: step === 'settled' && spinCount > 0 ? 800 : 600, color: step === 'settled' && spinCount > 0 ? '#F43F5E' : '#115E59' }}>
              <strong>Click the cork</strong> to gently rotate it and wait till it stops rotating. Repeat this a few more times. Do the ends always point in the same direction?
            </li>
          </ol>
        </div>

        <AnimatePresence>
          {step === 'settled' && spinCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                padding: '1.25rem 1.4rem', 
                background: '#ffffff', 
                border: '1.5px solid #CCECE7', 
                borderRadius: '16px',
                boxShadow: '0 4px 14px rgba(15, 118, 110, 0.05)'
              }}
            >
              <h4 style={{ color: '#134E4A', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 800 }}>
                <CheckCircle size={22} style={{ color: '#10b981' }} /> 
                Observation
              </h4>
              <p style={{ margin: '0 0 1rem 0', color: '#047857', fontSize: '0.92rem', fontWeight: '700' }}>
                Yes! No matter how you spin it, the magnetized needle always comes to rest pointing in the <strong>North-South</strong> direction, just like a standard magnetic compass!
              </p>
              
              <button 
                onClick={handleFinish}
                style={{ 
                  width: '100%', 
                  padding: '0.9rem 1.6rem', 
                  fontSize: '1.05rem', 
                  fontWeight: 800, 
                  borderRadius: '35px', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(244, 63, 94, 0.45)',
                  transition: 'all 0.25s ease'
                }}
              >
                <Flag size={20} color="#ffffff" /> Finish Activity
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
