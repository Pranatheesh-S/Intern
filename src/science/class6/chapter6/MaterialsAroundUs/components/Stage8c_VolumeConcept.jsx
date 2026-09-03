import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle, Lightbulb, Star, Box, Coffee, Droplet, GlassWater, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';

export default function Stage8c_VolumeConcept({ onComplete, addXp }) {
  const [activeStep, setActiveStep] = useState(0);
  const [volumesRevealed, setVolumesRevealed] = useState({
    teaCup: false,
    soupBowl: false,
    waterGlass: false,
    bucket: false
  });

  const handleReveal = (item) => {
    if (!volumesRevealed[item]) {
      setVolumesRevealed(prev => ({ ...prev, [item]: true }));
      addXp(20);
    }
  };

  const allRevealed = Object.values(volumesRevealed).every(v => v);
  
  React.useEffect(() => {
    if (allRevealed && onComplete && activeStep === 2) {
      const timer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [allRevealed, onComplete, activeStep]);

  const steps = [
    { id: 0, title: 'WHY?', subtitle: "Why can't I fill the bottle completely?" },
    { id: 1, title: 'UNDERSTAND', subtitle: "Volume in Everyday Life" },
    { id: 2, title: 'EXPLORE', subtitle: "Different Volumes" }
  ];

  return (
    <div style={{ padding: '16px 24px', background: 'var(--lesson-surface)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: 'calc(100vh - 120px)', minHeight: '650px', overflow: 'hidden' }}>
      
      {/* TOP HEADER & HORIZONTAL STEPPER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexShrink: 0 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Box size={28} color="var(--lesson-primary)" />
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--lesson-primary)', margin: 0, lineHeight: '1.1' }}>PHASE 2</h2>
            <p style={{ color: 'var(--lesson-primary)', fontSize: '1.05rem', margin: '4px 0 0 0', fontWeight: 'bold' }}>Understanding Volume</p>
          </div>
        </div>

        {/* Horizontal Steps */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', padding: '0 20px' }}>
          {/* Horizontal Line connecting steps */}
          <div style={{ position: 'absolute', top: '16px', left: '40px', right: '40px', height: '2px', background: 'var(--lesson-border)', zIndex: 0 }}></div>
          
          {steps.map((step, index) => {
            const isActive = activeStep === index;
            const isCompleted = activeStep > index || (index === 2 && allRevealed);
            
            return (
              <div 
                key={step.id}
                onClick={() => setActiveStep(index)}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 1,
                  background: 'var(--lesson-surface)',
                  padding: '0 16px'
                }}
              >
                {/* Step Indicator */}
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: isActive ? 'var(--lesson-success)' : isCompleted ? 'var(--lesson-success)' : 'white',
                  border: `2px solid ${isActive || isCompleted ? 'var(--lesson-success)' : 'var(--lesson-border)'}`, 
                  display: 'flex',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: isActive || isCompleted ? 'white' : 'var(--lesson-muted)',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  flexShrink: 0,
                  boxShadow: isActive ? '0 0 0 4px rgba(59,130,246,0.3)' : 'none',
                  transition: 'all 0.2s ease'
                }}>
                  {isCompleted && !isActive ? <CheckCircle size={16} color="white" /> : `0${step.id + 1}`}
                </div>
                
                {/* Step Text */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ 
                    fontSize: '12px', fontWeight: 'bold',
                    color: isActive ? 'var(--lesson-success)' : isCompleted ? 'var(--lesson-success)' : 'var(--lesson-muted)',
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    {step.title}
                  </div>
                  <div style={{ 
                    fontSize: '0.95rem', 
                    color: isActive ? 'var(--lesson-primary)' : 'var(--lesson-text)',
                    fontWeight: isActive ? 'bold' : 'normal',
                    marginTop: '2px',
                    lineHeight: '1.2'
                  }}>
                    {step.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, background: 'white', borderRadius: '24px', border: '1px solid var(--lesson-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Dynamic Content Shell */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <motion.div 
                key="step0"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                style={{ position: 'absolute', inset: 0, display: 'flex', padding: '24px', boxSizing: 'border-box' }}
              >
                <div style={{ flex: 1, display: 'flex', gap: '32px', alignItems: 'stretch', minHeight: 0 }}>
                  {/* Left: Illustration */}
                  <div style={{ flex: '1', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--lesson-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--lesson-surface)', minHeight: 0 }}>
                    <img src="/images/volume_overflow.png" alt="Overflowing Bottle" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply', transform: 'scale(1.15)', transformOrigin: 'center center' }} />
                  </div>
                  
                  {/* Right: Explanation */}
                  <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '2.5rem', color: 'var(--lesson-primary)', margin: '0 0 32px 0', lineHeight: '1.2', fontWeight: '900' }}>WHY CAN'T I ADD MORE WATER?</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <p style={{ margin: 0, color: 'var(--lesson-text)', fontSize: '1.6rem', lineHeight: '1.5' }}>
                        The bottle has <strong>limited space</strong>.
                      </p>
                      <p style={{ margin: 0, color: 'var(--lesson-text)', fontSize: '1.6rem', lineHeight: '1.5' }}>
                        Once it is full, no more water can fit.
                      </p>
                    </div>
                    
                    <div style={{ marginTop: '40px', background: 'var(--lesson-warning-bg)', padding: '32px', borderRadius: '20px', border: '3px dashed var(--lesson-warning-border)' }}>
                      <p style={{ margin: '0 0 12px 0', color: 'var(--lesson-text)', fontSize: '1.4rem', fontWeight: 'bold' }}>That amount of space is called</p>
                      <div style={{ color: 'var(--lesson-text)', background: '#fef08a', display: 'inline-block', padding: '0 12px', fontSize: '3rem', fontWeight: '900', letterSpacing: '2px' }}>VOLUME</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  display: 'grid', 
                  gridTemplateColumns: '52% 48%',
                  gap: '24px',
                  padding: '24px 28px', 
                  alignItems: 'start', 
                  boxSizing: 'border-box',
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden'
                }}
              >
                {/* LEFT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}>
                  
                  {/* 1. TITLE, SUBTITLE, EXPLANATION */}
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '32px', color: 'var(--lesson-primary)', margin: '0 0 6px 0', fontWeight: '900', letterSpacing: '-0.5px' }}>Volume in Everyday Life</h3>
                    <p style={{ margin: '0 0 12px 0', color: 'var(--lesson-text)', fontSize: '20px', lineHeight: '1.3', fontWeight: '600' }}>
                      How much space can a container hold?
                    </p>
                    <p style={{ margin: '0 0 2px 0', color: 'var(--lesson-text)', fontSize: '18px', lineHeight: '1.45' }}>
                      Different containers can hold different amounts of liquid.
                    </p>
                    <p style={{ margin: 0, color: 'var(--lesson-text)', fontSize: '18px', lineHeight: '1.45' }}>
                      The amount a container can hold is described using <strong style={{ color: 'var(--lesson-text)', background: '#fef08a', padding: '0 4px', fontWeight: '900' }}>volume</strong>.
                    </p>
                  </div>
                  
                  {/* 2. WATER + MILK COMPARISON */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', width: '100%', marginBottom: '16px' }}>
                    
                    {/* Water */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '170px', height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                        <img src="/images/3d_water_bottle_1788167284292.jpg" alt="Water Bottle" style={{ width: 'auto', maxHeight: '170px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--lesson-text)', margin: '0 0 4px 0' }}>Water</div>
                        <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--lesson-primary)', margin: 0 }}>500 mL</div>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    <div style={{ fontSize: '36px', color: 'var(--lesson-muted)', fontWeight: '300', marginBottom: '56px' }}>&harr;</div>

                    {/* Milk */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '170px', height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                        <img src="/images/3d_milk_bottle_1788167274008.jpg" alt="Milk Bottle" style={{ width: 'auto', maxHeight: '170px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--lesson-text)', margin: '0 0 4px 0' }}>Milk</div>
                        <div style={{ fontSize: '22px', fontWeight: '900', color: 'var(--lesson-secondary)', margin: 0 }}>500 mL</div>
                      </div>
                    </div>

                  </div>

                  {/* 3. SAME VOLUME BADGE */}
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingBottom: '20px' }}>
                    <div style={{ background: 'var(--lesson-accent-bg)', padding: '14px 28px', borderRadius: '12px', border: '2px dashed var(--lesson-accent-border)', textAlign: 'center' }}>
                      <span style={{ color: 'var(--lesson-text)', fontWeight: '900', fontSize: '18px' }}>SAME VOLUME</span>
                      <span style={{ color: 'var(--lesson-text)', fontWeight: 'bold', fontSize: '18px', margin: '0 12px' }}>•</span>
                      <span style={{ color: 'var(--lesson-text)', fontWeight: 'bold', fontSize: '18px' }}>DIFFERENT MATERIAL</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}>
                  {/* MEASURING VOLUME */}
                  <div style={{ background: 'var(--lesson-warning-bg)', border: '1px solid var(--lesson-warning-border)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '100%' }}>
                    
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--lesson-text)', marginBottom: '12px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Measuring Volume</div>
                      <p style={{ margin: '0 0 12px 0', color: 'var(--lesson-text)', fontSize: '18px', lineHeight: '1.45' }}>
                        Labels such as <strong>200 mL, 500 mL</strong> and <strong>1 L</strong> tell us how much a container can hold.
                      </p>
                      <p style={{ margin: '0 0 20px 0', color: 'var(--lesson-text)', fontSize: '18px', lineHeight: '1.45' }}>
                        Volume is measured in <strong>millilitres (mL)</strong> or <strong>litres (L)</strong>.
                      </p>
                    </div>

                    <div style={{ background: 'var(--lesson-warning-bg)', border: '2px dashed var(--lesson-warning-border)', padding: '16px', borderRadius: '12px', color: 'var(--lesson-text)', fontWeight: '900', fontSize: '26px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                      1 L = 1000 mL
                    </div>

                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', background: 'var(--lesson-surface)', border: '1px solid var(--lesson-border)', padding: '16px', borderRadius: '12px', width: '100%', boxSizing: 'border-box' }}>
                      <Info size={26} color="var(--lesson-text)" style={{ flexShrink: 0 }} />
                      <p style={{ margin: 0, color: 'var(--lesson-text)', fontSize: '16px', lineHeight: '1.4' }}>
                        <strong>Look at the label</strong> on a container. It tells us how much it can hold.
                      </p>
                    </div>

                  </div>

                  {/* FILLER STRIP */}
                  <div style={{ marginTop: '24px', background: 'var(--lesson-warning-bg)', padding: '16px 20px', borderRadius: '16px', border: '2px dashed var(--lesson-warning-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxSizing: 'border-box' }}>
                    <p style={{ margin: '0 0 4px 0', color: 'var(--lesson-text)', fontSize: '16px', lineHeight: '1.4', fontWeight: '600' }}>
                      Container labels tell us the volume they can hold:
                    </p>
                    <p style={{ margin: 0, fontWeight: '900', color: 'var(--lesson-text)', fontSize: '18px' }}>
                      200 mL &nbsp;•&nbsp; 500 mL &nbsp;•&nbsp; 1 L
                    </p>
                  </div>
                </div>

              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '24px', gap: '16px', boxSizing: 'border-box', overflow: 'hidden' }}
            >
              <div style={{ flexShrink: 0 }}>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--lesson-primary)', margin: '0 0 8px 0', fontWeight: '900' }}>Explore Different Volumes</h3>
                <p style={{ color: 'var(--lesson-text)', fontSize: '1.2rem', margin: 0 }}>Click each container to discover how much it can hold.</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', flex: 1, minHeight: 0 }}>
                
                {/* Tea Cup */}
                <div onClick={() => handleReveal('teaCup')} style={{ cursor: volumesRevealed.teaCup ? 'default' : 'pointer', border: '2px solid var(--lesson-border)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: 'var(--lesson-surface)', minHeight: 0, overflow: 'hidden', transition: 'transform 0.2s', transform: volumesRevealed.teaCup ? 'none' : 'scale(1)', ':hover': { transform: volumesRevealed.teaCup ? 'none' : 'scale(1.02)' } }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, width: '100%' }}>
                    <img src="/images/3d_tea_cup_1788167295553.jpg" alt="Tea Cup" style={{ maxWidth: '90%', maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  </div>
                  <div style={{ textAlign: 'center', width: '100%', flexShrink: 0 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--lesson-text)', marginBottom: '8px' }}>Tea Cup</div>
                    {volumesRevealed.teaCup ? (
                      <div style={{ color: 'var(--lesson-text)', fontWeight: '900', fontSize: '1.6rem' }}>150 mL</div>
                    ) : (
                      <button style={{ background: 'white', border: '2px solid var(--lesson-border)', color: 'var(--lesson-text)', padding: '8px 24px', borderRadius: '24px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold', width: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>Reveal</button>
                    )}
                  </div>
                </div>

                {/* Soup Bowl */}
                <div onClick={() => handleReveal('soupBowl')} style={{ cursor: volumesRevealed.soupBowl ? 'default' : 'pointer', border: '2px solid var(--lesson-border)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: 'var(--lesson-surface)', minHeight: 0, overflow: 'hidden', transition: 'transform 0.2s', transform: volumesRevealed.soupBowl ? 'none' : 'scale(1)', ':hover': { transform: volumesRevealed.soupBowl ? 'none' : 'scale(1.02)' } }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, width: '100%' }}>
                    <img src="/images/3d_soup_bowl_1788167306592.jpg" alt="Soup Bowl" style={{ maxWidth: '90%', maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  </div>
                  <div style={{ textAlign: 'center', width: '100%', flexShrink: 0 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--lesson-text)', marginBottom: '8px' }}>Soup Bowl</div>
                    {volumesRevealed.soupBowl ? (
                      <div style={{ color: 'var(--lesson-text)', fontWeight: '900', fontSize: '1.6rem' }}>300 mL</div>
                    ) : (
                      <button style={{ background: 'white', border: '2px solid var(--lesson-border)', color: 'var(--lesson-text)', padding: '8px 24px', borderRadius: '24px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold', width: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>Reveal</button>
                    )}
                  </div>
                </div>

                {/* Water Glass */}
                <div onClick={() => handleReveal('waterGlass')} style={{ cursor: volumesRevealed.waterGlass ? 'default' : 'pointer', border: '2px solid var(--lesson-border)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: 'var(--lesson-surface)', minHeight: 0, overflow: 'hidden', transition: 'transform 0.2s', transform: volumesRevealed.waterGlass ? 'none' : 'scale(1)', ':hover': { transform: volumesRevealed.waterGlass ? 'none' : 'scale(1.02)' } }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, width: '100%' }}>
                    <img src="/images/3d_water_glass_1788167318191.jpg" alt="Water Glass" style={{ maxWidth: '90%', maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  </div>
                  <div style={{ textAlign: 'center', width: '100%', flexShrink: 0 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--lesson-text)', marginBottom: '8px' }}>Water Glass</div>
                    {volumesRevealed.waterGlass ? (
                      <div style={{ color: 'var(--lesson-text)', fontWeight: '900', fontSize: '1.6rem' }}>250 mL</div>
                    ) : (
                      <button style={{ background: 'white', border: '2px solid var(--lesson-border)', color: 'var(--lesson-text)', padding: '8px 24px', borderRadius: '24px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold', width: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>Reveal</button>
                    )}
                  </div>
                </div>

                {/* Bucket */}
                <div onClick={() => handleReveal('bucket')} style={{ cursor: volumesRevealed.bucket ? 'default' : 'pointer', border: '2px solid var(--lesson-border)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', background: 'var(--lesson-surface)', minHeight: 0, overflow: 'hidden', transition: 'transform 0.2s', transform: volumesRevealed.bucket ? 'none' : 'scale(1)', ':hover': { transform: volumesRevealed.bucket ? 'none' : 'scale(1.02)' } }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, width: '100%' }}>
                    <img src="/images/3d_realistic_10l_bucket_1788169915490.jpg" alt="Bucket" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  </div>
                  <div style={{ textAlign: 'center', width: '100%', flexShrink: 0 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--lesson-text)', marginBottom: '8px' }}>Bucket</div>
                    {volumesRevealed.bucket ? (
                      <div style={{ color: 'var(--lesson-text)', fontWeight: '900', fontSize: '1.6rem' }}>10 L</div>
                    ) : (
                      <button style={{ background: 'white', border: '2px solid var(--lesson-border)', color: 'var(--lesson-text)', padding: '8px 24px', borderRadius: '24px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold', width: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>Reveal</button>
                    )}
                  </div>
                </div>
                
              </div>

              {/* Key Takeaway Integrated Below Grid */}
              <div style={{ background: 'var(--lesson-success-bg)', border: '1px solid var(--lesson-success)', borderRadius: '16px', padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'white', width: '50px', height: '50px', borderRadius: '50%', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <Star size={24} color="var(--lesson-success)" />
                </div>
                <div>
                  <h4 style={{ color: 'var(--lesson-success)', margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>Key Takeaway</h4>
                  <p style={{ margin: 0, color: 'var(--lesson-text)', fontSize: '1.1rem' }}>Volume is the amount of space occupied by an object or substance. Different containers can hold different amounts.</p>
                </div>
              </div>

            </motion.div>
          )}
          </AnimatePresence>
        </div>

        {/* BOTTOM NAVIGATION FOR MAIN AREA */}
        <div style={{ padding: '20px 32px', background: 'var(--lesson-surface)', borderTop: '1px solid var(--lesson-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <button 
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 20px', 
              borderRadius: '24px', 
              border: 'none', 
              background: activeStep === 0 ? 'transparent' : 'white',
              color: activeStep === 0 ? 'transparent' : 'var(--lesson-text)',
              cursor: activeStep === 0 ? 'default' : 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: activeStep === 0 ? 'none' : '0 2px 6px rgba(0,0,0,0.05)'
            }}
          >
            <ChevronLeft size={20} /> Previous
          </button>
          
          <div style={{ color: 'var(--lesson-secondary)', fontWeight: 'bold', fontSize: '1.1rem' }}>
            Step {activeStep + 1} of 3
          </div>

          <button 
            onClick={() => setActiveStep(Math.min(2, activeStep + 1))}
            disabled={activeStep === 2}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 20px', 
              borderRadius: '24px', 
              border: 'none', 
              background: activeStep === 2 ? 'transparent' : 'var(--lesson-success)',
              color: activeStep === 2 ? 'transparent' : 'white',
              cursor: activeStep === 2 ? 'default' : 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: activeStep === 2 ? 'none' : '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}
