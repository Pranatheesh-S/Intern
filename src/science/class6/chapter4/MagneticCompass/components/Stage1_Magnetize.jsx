import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Magnet, CheckCircle, RotateCcw, ArrowRight, Activity, Beaker, MousePointer2, Play } from 'lucide-react';
import MagneticNeedleShape from './MagneticNeedleShape';

export default function Stage1_Magnetize({ onComplete }) {
  const [strokeCount, setStrokeCount] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [isAutoStroking, setIsAutoStroking] = useState(false);
  
  const maxStrokes = 5;
  const isMagnetized = strokeCount >= maxStrokes;

  useEffect(() => {
    let interval;
    if (isAutoStroking && strokeCount < maxStrokes) {
      interval = setInterval(() => {
        setStrokeCount(prev => {
          if (prev + 1 >= maxStrokes) {
            setIsAutoStroking(false);
          }
          return prev + 1;
        });
      }, 1500);
    } else if (strokeCount >= maxStrokes) {
      setIsAutoStroking(false);
    }
    return () => clearInterval(interval);
  }, [isAutoStroking, strokeCount]);

  const filings = useMemo(() => {
    const items = [];
    const poleNx = -125; const poleNy = 0;
    const poleSx = 125; const poleSy = 0;

    for (let i = 0; i < 800; i++) {
      // Uniform random initial scatter strictly inside white paper (520px x 280px)
      const initX = (Math.random() - 0.5) * 440;
      const initY = (Math.random() - 0.5) * 200;
      const initRot = Math.random() * 360;

      // Start target at random position
      let targetX = (Math.random() - 0.5) * 440;
      let targetY = (Math.random() - 0.5) * 200;

      const distN = Math.hypot(targetX - poleNx, targetY - poleNy);
      const distS = Math.hypot(targetX - poleSx, targetY - poleSy);
      
      // Pull heavily towards the two poles (ends of needle)
      let pullN = Math.exp(-distN / 45) * 0.88;
      let pullS = Math.exp(-distS / 45) * 0.88;
      
      if (distN < 40) pullN += Math.exp(-distN / 16) * 0.92;
      if (distS < 40) pullS += Math.exp(-distS / 16) * 0.92;

      targetX += (poleNx - targetX) * pullN;
      targetY += (poleNy - targetY) * pullN;
      
      targetX += (poleSx - targetX) * pullS;
      targetY += (poleSy - targetY) * pullS;

      // Keep filings slightly offset vertically from exact center axis so needle body stays clear
      if (Math.abs(targetY - poleNy) < 14 && targetX > poleNx + 20 && targetX < poleSx - 20) {
        targetY += (targetY >= poleNy ? 14 : -14);
      }

      // Calculate magnetic field direction at target position
      const dxN = targetX - poleNx;
      const dyN = targetY - poleNy;
      const dN3 = Math.pow(dxN * dxN + dyN * dyN, 1.5) || 1;
      const bxN = dxN / dN3;
      const byN = dyN / dN3;

      const dxS = targetX - poleSx;
      const dyS = targetY - poleSy;
      const dS3 = Math.pow(dxS * dxS + dyS * dyS, 1.5) || 1;
      const bxS = -dxS / dS3;
      const byS = -dyS / dS3;

      const bx = bxN + bxS;
      const by = byN + byS;

      let targetRot = Math.atan2(by, bx) * (180 / Math.PI);
      targetRot += (Math.random() - 0.5) * 12;

      const width = 10 + Math.random() * 14;
      const color = Math.random() > 0.5 ? '#0F172A' : (Math.random() > 0.5 ? '#1E293B' : '#334155');

      items.push({
        id: i,
        width,
        color,
        initX,
        initY,
        initRot,
        targetX,
        targetY,
        targetRot
      });
    }
    return items;
  }, []);

  const handleTest = () => {
    setIsTesting(true);
    setTimeout(() => {
      setTestComplete(true);
    }, 1000);
  };

  const handleNextSection = () => {
    onComplete();
  };

  const handleReset = () => {
    setStrokeCount(0);
    setIsTesting(false);
    setTestComplete(false);
    setIsAutoStroking(false);
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
            Activity 4.5: Making a Simple Magnetic Compass
          </h3>
          <p style={{ margin: 0, color: '#475569', fontSize: '0.88rem', fontWeight: 600 }}>
            {isMagnetized 
              ? "Your needle is magnetized! Test it with iron filings or proceed to float it as a compass."
              : "Stroke the steel needle 5 times in ONE direction with the North pole of the bar magnet."}
          </p>
        </div>

        {/* Enlarged Activity Canvas Area */}
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
          justifyContent: 'center',
          alignItems: 'center',
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
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(4px)',
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

          {/* Dense Iron Filings Field Animation (Rendered at zIndex: 5 BEHIND needle) */}
          <AnimatePresence>
            {isTesting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}
              >
                {filings.map(f => (
                  <motion.div
                    key={f.id}
                    initial={{ x: f.initX, y: f.initY, rotate: f.initRot, opacity: 0.2 }}
                    animate={{ 
                      x: testComplete ? f.targetX : f.initX, 
                      y: testComplete ? f.targetY : f.initY,
                      rotate: testComplete ? f.targetRot : f.initRot,
                      opacity: 1 
                    }}
                    transition={{ type: 'spring', damping: 18, stiffness: 60 }}
                    style={{
                      position: 'absolute',
                      left: 'calc(50% - 2.5px)',
                      top: 'calc(50% - 1.75px)',
                      width: `${f.width}px`,
                      height: '3.5px',
                      background: f.color,
                      boxShadow: testComplete ? '0 0 3px rgba(15, 23, 42, 0.6)' : 'none',
                      borderRadius: '2px'
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Centered Steel Sewing Needle (Inside White Paper at zIndex: 20 IN FRONT of Filings) */}
          <div style={{ position: 'relative', zIndex: 20 }}>
            <MagneticNeedleShape 
              width={340} 
              height={38} 
              isGlowing={isMagnetized} 
            />
          </div>

          {/* Interactive Bar Magnet with Stroke Animation */}
          <AnimatePresence>
            {!isMagnetized && (
              <motion.div
                drag={!isAutoStroking}
                dragConstraints={{ left: -220, right: 220, top: -40, bottom: 40 }}
                dragElastic={0.1}
                animate={isAutoStroking ? {
                  x: [-180, 180, -180],
                  y: [-30, -30, -30],
                  rotate: [0, 0, 0]
                } : {}}
                transition={isAutoStroking ? {
                  repeat: maxStrokes - strokeCount - 1,
                  duration: 1.5,
                  ease: 'easeInOut'
                } : { type: 'spring', stiffness: 300, damping: 25 }}
                onDragEnd={(event, info) => {
                  if (info.offset.x > 150) {
                    setStrokeCount(prev => Math.min(prev + 1, maxStrokes));
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '55px',
                  width: '150px',
                  height: '95px',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 40,
                  cursor: isMagnetized ? 'default' : 'grab'
                }}
                whileTap={{ cursor: 'grabbing', scale: 1.05 }}
              >
                <img 
                  src="/Shared/bar_magnet.png" 
                  alt="Bar Magnet"
                  draggable="false"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                    filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))'
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', marginTop: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.88rem', color: '#475569', fontWeight: 700 }}>
            <span>Strokes: {strokeCount} / {maxStrokes}</span>
            <span style={{ color: '#D97706', fontWeight: 900 }}>{Math.round((strokeCount / maxStrokes) * 100)}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div 
              animate={{ width: `${(strokeCount / maxStrokes) * 100}%` }}
              style={{ height: '100%', background: isMagnetized ? 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
            />
          </div>
        </div>

        {/* Controls (All using amber-orange button style) */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', width: '100%' }}>
          {!isMagnetized && (
            <button 
              onClick={() => setIsAutoStroking(true)} 
              disabled={isAutoStroking}
              style={{ 
                flex: 1,
                padding: '0.75rem 1rem', 
                fontSize: '0.95rem', 
                fontWeight: 900, 
                borderRadius: '25px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.6rem',
                background: !isAutoStroking ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#F1F5F9',
                color: !isAutoStroking ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                cursor: !isAutoStroking ? 'pointer' : 'not-allowed',
                opacity: !isAutoStroking ? 1 : 0.85,
                boxShadow: !isAutoStroking ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none'
              }}
            >
              <Play size={18} color={!isAutoStroking ? '#FFFFFF' : '#94A3B8'} /> {isAutoStroking ? 'Magnetizing...' : 'Auto Magnetize'}
            </button>
          )}

          {isMagnetized && (
            <button 
              onClick={handleTest} 
              disabled={isTesting}
              style={{ 
                flex: 1,
                padding: '0.75rem 1rem', 
                fontSize: '0.95rem', 
                fontWeight: 900, 
                borderRadius: '25px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.6rem',
                background: !isTesting ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#F1F5F9',
                color: !isTesting ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                cursor: !isTesting ? 'pointer' : 'not-allowed',
                opacity: !isTesting ? 1 : 0.85,
                boxShadow: !isTesting ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none'
              }}
            >
              <Beaker size={18} color={!isTesting ? '#FFFFFF' : '#94A3B8'} /> {isTesting ? 'Testing...' : 'Test Magnetization'}
            </button>
          )}
          
          <button 
            onClick={handleReset}
            disabled={strokeCount === 0 && !isAutoStroking && !isTesting}
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
              color: (strokeCount > 0 || isAutoStroking || isTesting) ? '#1E293B' : '#94A3B8',
              border: '1.5px solid #CBD5E1',
              cursor: (strokeCount > 0 || isAutoStroking || isTesting) ? 'pointer' : 'not-allowed',
              opacity: (strokeCount > 0 || isAutoStroking || isTesting) ? 1 : 0.6,
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            <RotateCcw size={18} color={(strokeCount > 0 || isAutoStroking || isTesting) ? '#334155' : '#94A3B8'} /> Reset
          </button>
        </div>
      </div>

      {/* Right Side: Instructions & Always Visible Success Panel */}
      <div style={{ 
        flex: '0.95', 
        background: '#FFFFFF',
        border: '1.5px solid #A7F3D0',
        borderRadius: '20px',
        padding: '1.25rem 1.35rem',
        boxShadow: '0 6px 20px rgba(6, 78, 59, 0.06)',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        height: '100%',
        minHeight: 0,
        boxSizing: 'border-box',
        overflowY: 'auto',
        gap: '0.9rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <h4 style={{ color: '#064E3B', margin: 0, fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.01em' }}>
            Instructions
          </h4>
          <ol style={{ margin: 0, paddingLeft: '1.35rem', color: '#1E293B', fontSize: '0.98rem', display: 'flex', flexDirection: 'column', gap: '0.55rem', lineHeight: '1.5', fontWeight: 600 }}>
            <li>Place an iron sewing needle on a sheet of paper.</li>
            <li>Hold one pole of a bar magnet and place it near one end of the needle.</li>
            <li>Move the magnet along the length of the needle until you reach the other end.</li>
            <li>Lift the magnet and bring the pole back to the starting point. Repeat 5 times.</li>
          </ol>
        </div>

        {/* Did You Know Fact Box */}
        <div style={{ 
          background: '#F0FDF4', 
          border: '1.5px solid #A7F3D0', 
          padding: '0.95rem 1.15rem', 
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(6, 78, 59, 0.04)'
        }}>
          <h5 style={{ margin: '0 0 0.35rem 0', color: '#065F46', fontSize: '1.05rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            💡 Why One Direction?
          </h5>
          <p style={{ margin: 0, fontSize: '0.94rem', color: '#166534', lineHeight: '1.5', fontWeight: 600 }}>
            Stroking in a single direction aligns the microscopic magnetic domains inside the steel, transforming it into a permanent magnet!
          </p>
        </div>

        {/* Observation / Success Action Card */}
        <div style={{ 
          background: testComplete ? '#DCFCE7' : '#F8FAFC', 
          border: `1.5px solid ${testComplete ? '#16A34A' : '#CBD5E1'}`, 
          padding: '0.95rem 1.15rem', 
          borderRadius: '16px'
        }}>
          <h4 style={{ margin: '0 0 0.35rem 0', color: testComplete ? '#15803D' : '#64748B', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.02rem', fontWeight: 900 }}>
            <CheckCircle size={18} /> {testComplete ? "Magnetization Complete!" : "Step 2: Test"}
          </h4>
          <p style={{ margin: '0 0 0.85rem 0', color: testComplete ? '#166534' : '#64748B', fontSize: '0.94rem', fontWeight: '700', lineHeight: '1.4' }}>
            {testComplete 
              ? "The steel pins & iron filings are attracted to the needle! This means the needle has successfully become a magnet."
              : "Bring iron filings near the needle to test if it has become a magnet."}
          </p>
          
          <button 
            onClick={handleNextSection}
            disabled={!testComplete}
            style={{ 
              width: '100%', 
              padding: '0.85rem 1.5rem', 
              fontSize: '1.02rem', 
              fontWeight: 900, 
              borderRadius: '25px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '0.75rem',
              background: testComplete ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#E2E8F0',
              color: testComplete ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              cursor: testComplete ? 'pointer' : 'not-allowed',
              opacity: testComplete ? 1 : 0.6,
              boxShadow: testComplete ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            Next Section: Make a Compass <ArrowRight size={20} color={testComplete ? '#FFFFFF' : '#94A3B8'} />
          </button>
        </div>
      </div>
    </div>
  );
}
