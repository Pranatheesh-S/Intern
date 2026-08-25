import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Droplet, CheckCircle2, AlertCircle, RefreshCw, Hand, Info, HelpCircle, LayoutGrid, ArrowLeft, ArrowRight, FlaskConical } from 'lucide-react';
import useSound from 'use-sound';

export default function Stage8b_Volume({ onComplete, addXp }) {
  const [pourState, setPourState] = useState(0); 
  const [stageCompleted, setStageCompleted] = useState(false);
  const [thinkAnswer, setThinkAnswer] = useState('');
  const [thinkFeedback, setThinkFeedback] = useState(null);

  const handleCheckAnswer = () => {
    const ans = thinkAnswer.toLowerCase();
    if (ans.includes('spill') || ans.includes('overflow') || ans.includes('cannot hold') || ans.includes('come out') || ans.includes('more water') || ans.includes('not fit')) {
      setThinkFeedback({ type: 'success', text: 'Excellent observation! The extra water will spill out because the bottle cannot hold all of it.' });
    } else {
      setThinkFeedback({ type: 'hint', text: 'Think about the bottle’s capacity. Can it hold all the water from the full tumbler?' });
    }
  };
  
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  const [playWater] = useSound('https://assets.mixkit.co/active_storage/sfx/2502/2502-preview.mp3', { volume: 0.3 });

  const [dragHover, setDragHover] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragHover(false);
    if (pourState === 0) {
      startPourAnimation();
    }
  };

  const startPourAnimation = () => {
    setPourState(2);
    playWater();
    setTimeout(() => {
      setPourState(3);
      setTimeout(() => {
        setPourState(4);
        playWater();
        addXp(10);
        setTimeout(() => {
          setPourState(5);
          addXp(10);
        }, 2000);
      }, 1000);
    }, 2000);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragHover(true);
  };

  const handleDragLeave = () => {
    setDragHover(false);
  };

  const resetActivity = () => {
    setPourState(0);
  };

  useEffect(() => {
    if (pourState === 5) {
      // Intentionally not auto-proceeding here so user can read the conclusion
      playSuccess();
    }
  }, [pourState, playSuccess]);

  // Bottle Animation Variants
  const bottleVariants = {
    idle: { x: 0, y: 0, rotate: 0, opacity: 1 },
    dragging: { scale: 1.05, rotate: -5 },
    pourA: { x: 141, y: -90, rotate: 105, transition: { duration: 0.5 } },
    moveToB: { x: 301, y: -90, rotate: 105, transition: { duration: 0.8 } },
    pourB: { x: 301, y: -90, rotate: 105 },
    done: { x: 0, y: 0, rotate: 0, opacity: 1, transition: { duration: 0.8 } }
  };

  // Target Color Palette
  const colors = {
    cardBg: '#fdfbf7', // Warm cream
    cardBorder: '#e7e5e4', // Soft beige
    textDark: '#431407', // Dark chocolate
    textMedium: '#57534e', // Subtitle text
    accent: '#c2410c', // Muted burnt orange
    successBg: '#f0fdf4',
    successBorder: '#bbf7d0',
    successText: '#166534',
    thinkBg: '#fff7ed',
    thinkBorder: '#ffedd5',
    thinkText: '#9a3412',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', height: '100vh', maxHeight: '100vh', overflow: 'hidden', color: colors.textDark, padding: '0.75rem', boxSizing: 'border-box' }}>
      
      {/* 2. Top Header (Compact) */}
      <div style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}`, borderRadius: '12px', padding: '0.75rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <h2 style={{ margin: 0, fontSize: '1.6rem', color: colors.textDark, display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold' }}>
          <Box size={28} color={colors.textDark} /> Phase 2: Space and Volume
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: colors.textMedium, fontSize: '1.05rem' }}>
          <Info size={16} />
          <span>Section 6.3.6: Pour water from the bottle into the two identical tumblers to observe volume.</span>
        </div>
      </div>

      {/* 3. Main Content 50/50 Split */}
      <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        
        {/* 4. Left Panel - Pour Water */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 0 }}>
          
          <div style={{ background: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.cardBorder}`, padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', minHeight: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexShrink: 0 }}>
              <div>
                <h3 style={{ margin: 0, color: colors.textDark, fontSize: '1.4rem', fontWeight: 'bold' }}>Pour Water</h3>
                <div style={{ fontSize: '1.05rem', color: colors.textMedium, marginTop: '4px' }}>Use the large water bottle to fill the two identical tumblers.</div>
              </div>
              <button onClick={resetActivity} style={{ background: 'white', border: `1px solid ${colors.accent}`, color: colors.accent, padding: '6px 12px', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <RefreshCw size={16} /> Reset
              </button>
            </div>
            
            {/* 5. Experiment Visual (Realistic Tabletop) */}
            <div style={{ 
              flex: 1, position: 'relative', borderRadius: '8px', overflow: 'hidden', minHeight: 0,
              background: 'linear-gradient(to bottom, #eae6df 0%, #e0d8cc 50%, #c4a985 50%, #d8ba96 100%)',
              border: `1px solid ${colors.cardBorder}`, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
              boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.05)'
            }}>
              
              <div style={{ width: '600px', height: '100%', position: 'relative', transform: 'scale(0.85)', transformOrigin: 'bottom center' }}>
                {/* 6. Realistic Bottle */}
                <motion.div 
                  drag={pourState === 0} 
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} 
                  dragElastic={1}
                  onDragStart={() => setPourState(1)}
                  onDragEnd={(event, info) => {
                    if (info.offset.x > 50) {
                      startPourAnimation();
                    } else {
                      setPourState(0);
                    }
                  }}
                  variants={bottleVariants}
                  initial="idle"
                  animate={
                    pourState === 0 ? 'idle' : 
                    pourState === 1 ? 'dragging' : 
                    pourState === 2 ? 'pourA' : 
                    pourState === 3 ? 'moveToB' : 
                    pourState === 4 ? 'pourB' : 'done'
                  }
                  style={{ position: 'absolute', left: '40px', bottom: '40px', cursor: pourState === 0 ? 'grab' : 'default', zIndex: 30, transformOrigin: 'center center' }}
                >
                  <svg width="100" height="280" viewBox="0 0 100 280">
                    <defs>
                      <linearGradient id="bottleBase" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                        <stop offset="15%" stopColor="rgba(255,255,255,0.2)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.0)" />
                        <stop offset="85%" stopColor="rgba(255,255,255,0.2)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
                      </linearGradient>
                      <linearGradient id="bottleWaterContent" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(56,189,248,0.6)" />
                        <stop offset="50%" stopColor="rgba(2,132,199,0.3)" />
                        <stop offset="100%" stopColor="rgba(2,132,199,0.7)" />
                      </linearGradient>
                      <filter id="shadow">
                        <feDropShadow dx="2" dy="5" stdDeviation="3" floodOpacity="0.2" />
                      </filter>
                    </defs>
                    
                    <ellipse cx="50" cy="275" rx="35" ry="8" fill="rgba(0,0,0,0.15)" />
                    <motion.path 
                      d="M12 260 C12 270, 20 278, 30 278 L70 278 C80 278, 88 270, 88 260 L88 120 C88 105, 84 96, 75 88 L75 80 C75 80, 25 80, 25 80 L25 88 C16 96, 12 105, 12 120 Z"
                      fill="url(#bottleWaterContent)"
                      animate={{
                        clipPath: pourState < 2 ? 'polygon(0% 10%, 100% 10%, 100% 100%, 0% 100%)' :
                                 pourState === 2 ? 'polygon(0% 45%, 100% 45%, 100% 100%, 0% 100%)' :
                                 pourState >= 4 ? 'polygon(0% 90%, 100% 90%, 100% 100%, 0% 100%)' : 'polygon(0% 45%, 100% 45%, 100% 100%, 0% 100%)'
                      }}
                      transition={{ duration: 1.5 }}
                    />
                    <path d="M40 20 L60 20 C65 20, 75 40, 75 60 L75 80 C85 90, 90 100, 90 120 L90 260 C90 275, 80 280, 70 280 L30 280 C20 280, 10 275, 10 260 L10 120 C10 100, 15 90, 25 80 L25 60 C25 40, 35 20, 40 20 Z" fill="url(#bottleBase)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" filter="url(#shadow)" />
                    <path d="M12 120 Q 50 125 88 120" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
                    <path d="M12 140 Q 50 145 88 140" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
                    <path d="M12 160 Q 50 165 88 160" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
                    <path d="M12 180 Q 50 185 88 180" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
                    <path d="M12 200 Q 50 205 88 200" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
                    <path d="M22 100 L22 250" stroke="rgba(255,255,255,0.7)" strokeWidth="6" strokeLinecap="round" />
                    <path d="M80 130 L80 230" stroke="rgba(255,255,255,0.4)" strokeWidth="4" strokeLinecap="round" />
                    
                    {/* Bottle Mouth Opening (visible when cap is off) */}
                    <ellipse cx="50" cy="20" rx="12" ry="4" fill="rgba(0,0,0,0.15)" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
                    <ellipse cx="50" cy="20" rx="10" ry="2" fill="rgba(0,0,0,0.2)" />
                    
                    {/* Cap */}
                    <motion.g
                      animate={{ 
                        y: (pourState > 0 || dragHover) ? -20 : 0, 
                        x: (pourState > 0 || dragHover) ? -20 : 0, 
                        rotate: (pourState > 0 || dragHover) ? -30 : 0 
                      }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: "50px 20px" }}
                    >
                      <path d="M36 10 L64 10 L64 22 L36 22 Z" fill="#1e3a8a" />
                      <path d="M36 8 L64 8 L64 10 L36 10 Z" fill="#172554" />
                      {/* Cap ridges */}
                      <line x1="40" y1="10" x2="40" y2="22" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                      <line x1="45" y1="10" x2="45" y2="22" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                      <line x1="50" y1="10" x2="50" y2="22" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                      <path d="M38 10 L62 10 L62 16 L38 16 Z" fill="#1e3a8a" />
                    </motion.g>
                  </svg>
                </motion.div>
  
                {/* 7. Pouring Stream */}
                <AnimatePresence>
                  {pourState === 2 && (
                    <motion.div 
                      initial={{ scaleY: 0, opacity: 0 }} 
                      animate={{ scaleY: 1, opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      style={{ position: 'absolute', left: '200px', bottom: '115px', height: '119px', width: '14px', background: 'linear-gradient(to right, rgba(56,189,248,0.7), rgba(2,132,199,0.9), rgba(56,189,248,0.7))', zIndex: 15, borderRadius: '7px' }}
                    />
                  )}
                  {pourState === 4 && (
                    <motion.div 
                      initial={{ scaleY: 0, opacity: 0 }} 
                      animate={{ scaleY: 1, opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      style={{ position: 'absolute', left: '360px', bottom: '115px', height: '119px', width: '14px', background: 'linear-gradient(to right, rgba(56,189,248,0.7), rgba(2,132,199,0.9), rgba(56,189,248,0.7))', zIndex: 15, borderRadius: '7px' }}
                    />
                  )}
                </AnimatePresence>
  
                {/* 8. Tumblers Container (Drop Target) */}
                <div 
                  onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                  style={{ 
                    position: 'absolute', left: '160px', bottom: '30px',
                    display: 'flex', gap: '50px', padding: '10px',
                    zIndex: 10
                  }}
                >
                  {/* Tumbler A */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <svg width="110" height="150" viewBox="0 0 110 150">
                      <defs>
                        <clipPath id="bottleClip">
                          <path d="M15 10 L95 10 L85 140 L25 140 Z" />
                        </clipPath>
                      </defs>
                      <path d="M15 10 L95 10 L85 140 L25 140 Z" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
                      <g clipPath="url(#bottleClip)">
                        <motion.rect 
                          x="15" y="10" width="80" height="130" 
                          fill="rgba(2,132,199,0.7)" 
                          initial={{ y: 140 }}
                          animate={{ y: pourState >= 2 ? 75 : 140 }}
                          transition={{ duration: 1.5 }}
                        />
                      </g>
                    </svg>
                  </div>
  
                  {/* Tumbler B */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <svg width="110" height="150" viewBox="0 0 110 150">
                      <path d="M15 10 L95 10 L85 140 L25 140 Z" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
                      <g clipPath="url(#bottleClip)">
                        <motion.rect 
                          x="15" y="10" width="80" height="130" 
                          fill="rgba(2,132,199,0.7)" 
                          initial={{ y: 140 }}
                          animate={{ y: pourState >= 4 ? 20 : 140 }}
                          transition={{ duration: 1.5 }}
                        />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* 9. How to do it steps */}
            <div style={{ marginTop: '0.75rem', zIndex: 20, flexShrink: 0 }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 'bold', color: colors.textDark, marginBottom: '8px' }}>How to do it:</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: `1px solid ${colors.cardBorder}`, padding: '10px 14px', borderRadius: '10px', flex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ width: '24px', height: '24px', background: colors.accent, color: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 }}>1</div>
                  <Hand size={18} color={colors.textMedium} />
                  <div style={{ fontSize: '1rem', color: colors.textDark, fontWeight: 'bold' }}>Drag the bottle</div>
                </div>
                <div style={{ color: colors.textMedium }}>›</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: `1px solid ${colors.cardBorder}`, padding: '10px 14px', borderRadius: '10px', flex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', opacity: pourState >= 1 ? 1 : 0.5 }}>
                  <div style={{ width: '24px', height: '24px', background: colors.accent, color: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 }}>2</div>
                  <Droplet size={18} color={colors.textMedium} />
                  <div style={{ fontSize: '1rem', color: colors.textDark, fontWeight: 'bold' }}>Pour into tumbler</div>
                </div>
                <div style={{ color: colors.textMedium }}>›</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: `1px solid ${colors.cardBorder}`, padding: '10px 14px', borderRadius: '10px', flex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', opacity: pourState >= 4 ? 1 : 0.5 }}>
                  <div style={{ width: '24px', height: '24px', background: colors.accent, color: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 }}>3</div>
                  <AlertCircle size={18} color={colors.textMedium} />
                  <div style={{ fontSize: '1rem', color: colors.textDark, fontWeight: 'bold' }}>Observe level</div>
                </div>
              </div>
            </div>

            {/* 10. Information Footer */}
            <div style={{ marginTop: '0.5rem', background: colors.cardBg, padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem', color: colors.textMedium, border: `1px solid ${colors.cardBorder}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={14} style={{ display: 'inline', marginRight: '4px', flexShrink: 0 }} /> Both tumblers have the same capacity.
            </div>

          </div>
        </div>

        {/* 11. Right Panel - Investigation Side */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0, overflow: 'hidden' }}>
          
          {/* Investigation Log Box */}
          <div style={{ background: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.cardBorder}`, padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', flexShrink: 0 }}>
            <h4 style={{ margin: 0, fontSize: '1.25rem', color: colors.textDark, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
              <LayoutGrid size={20} color={colors.textDark} /> Investigation Log
            </h4>
            
            <AnimatePresence mode="popLayout">
              {pourState >= 3 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', padding: '0.5rem 1rem', borderRadius: '10px', border: `1px solid ${colors.cardBorder}`, display: 'flex', gap: '1rem', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div>
                    <div style={{ color: colors.accent, fontWeight: 'bold', fontSize: '1.15rem' }}>Observation 1</div>
                    <div style={{ fontSize: '1.05rem', color: colors.textDark, marginTop: '2px', lineHeight: '1.4' }}>Tumbler A is half-filled with water.</div>
                  </div>
                </motion.div>
              )}
              
              {pourState >= 5 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', padding: '0.5rem 1rem', borderRadius: '10px', border: `1px solid ${colors.cardBorder}`, display: 'flex', gap: '1rem', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ width: '32px', height: '44px', position: 'relative', flexShrink: 0 }}>
                    <svg viewBox="0 0 110 150" style={{ width: '100%', height: '100%' }}>
                      <defs>
                        <clipPath id="tumClip2">
                          <polygon points="5,0 105,0 95,145 15,145" />
                        </clipPath>
                      </defs>
                      <polygon points="5,0 105,0 95,145 15,145" fill="rgba(0,0,0,0.05)" stroke="#d6d3d1" strokeWidth="4" />
                      <g clipPath="url(#tumClip2)">
                        <rect x="0" y="20" width="110" height="130" fill="rgba(2,132,199,0.7)" />
                      </g>
                      <polygon points="5,0 105,0 95,145 15,145" fill="transparent" stroke="rgba(255,255,255,0.8)" strokeWidth="4" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ color: colors.accent, fontWeight: 'bold', fontSize: '1.15rem' }}>Observation 2</div>
                    <div style={{ fontSize: '1.05rem', color: colors.textDark, marginTop: '2px', lineHeight: '1.4' }}>Tumbler B is almost completely filled with water.</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {pourState < 3 && (
              <div style={{ textAlign: 'center', color: colors.textMedium, fontSize: '1.05rem', padding: '0.75rem 0', fontStyle: 'italic' }}>
                Waiting for observations...
              </div>
            )}
          </div>

          {/* 12. Scientific Conclusion */}
          <AnimatePresence>
            {pourState >= 5 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} style={{ background: colors.successBg, padding: '0.75rem 1rem', borderRadius: '12px', border: `1px solid ${colors.successBorder}`, flexShrink: 0 }}>
                <div style={{ color: colors.successText, fontWeight: 'bold', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem' }}>
                  <FlaskConical size={18} /> Scientific Conclusion
                </div>
                <div style={{ fontSize: '1rem', color: colors.successText, lineHeight: '1.3', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color={colors.successText} style={{ flexShrink: 0, marginTop: '2px' }} /> Even though the tumblers have the same capacity, the water levels differ.</div>
                  <div style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color={colors.successText} style={{ flexShrink: 0, marginTop: '2px' }} /> The water in Tumbler A occupies less space than the water in Tumbler B.</div>
                  <div style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color={colors.successText} style={{ flexShrink: 0, marginTop: '2px' }} /> The space occupied by an object or substance is called its <strong>volume!</strong></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 13. Think More Box */}
          <AnimatePresence>
            {pourState >= 5 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} style={{ background: colors.thinkBg, padding: '0.75rem 1rem', borderRadius: '12px', border: `1px solid ${colors.thinkBorder}`, display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0, overflow: 'visible', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ color: colors.accent, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem' }}>
                    <HelpCircle size={18} /> Think More!
                  </div>
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sam&backgroundColor=transparent" alt="Think" style={{ width: '32px', height: '32px' }} />
                </div>
                
                <div style={{ fontSize: '1.05rem', color: colors.thinkText, lineHeight: '1.3', fontWeight: 'bold', flexShrink: 0 }}>
                  What if we pour the water from Tumbler B back into the bottle? What will you observe?
                </div>
                
                <div style={{ fontSize: '0.9rem', fontStyle: 'italic', color: colors.textDark, opacity: 0.85, lineHeight: '1.3', flexShrink: 0 }}>
                  <Info size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  Hint: The bottle may not be able to hold all the water. What might happen if there is more water than the bottle can hold?
                </div>
                
                <div style={{ marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: colors.textDark, letterSpacing: '0.5px' }}>OBSERVATION NOTE</div>
                  <textarea 
                    value={thinkAnswer}
                    onChange={(e) => setThinkAnswer(e.target.value)}
                    placeholder="Write what you think will happen..."
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem 0.75rem', 
                      borderRadius: '8px', 
                      border: `1px solid ${colors.cardBorder}`, 
                      background: 'white', 
                      color: colors.textDark, 
                      fontSize: '1rem',
                      resize: 'none',
                      minHeight: '64px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      flexShrink: 0
                    }}
                  />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.9rem', fontStyle: 'italic', color: colors.textDark, opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: '220px' }}>
                      <Info size={14} style={{ flexShrink: 0 }} /> Think about the bottle's capacity...
                    </div>
                    <button 
                      onClick={handleCheckAnswer}
                      style={{ 
                        padding: '8px 16px', 
                        background: colors.accent, 
                        border: 'none', 
                        borderRadius: '6px', 
                        color: 'white', 
                        fontWeight: 'bold', 
                        cursor: 'pointer',
                        flexShrink: 0,
                        fontSize: '1rem'
                      }}
                    >
                      Check Answer
                    </button>
                  </div>

                  <AnimatePresence>
                    {thinkFeedback && (
                      <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '0.5rem' }} style={{ flexShrink: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: thinkFeedback.type === 'success' ? colors.successBg : '#fff7ed', border: `1px solid ${thinkFeedback.type === 'success' ? colors.successBorder : '#fed7aa'}`, color: thinkFeedback.type === 'success' ? colors.successText : '#9a3412', fontSize: '0.95rem', fontWeight: '500', display: 'flex', alignItems: 'flex-start', gap: '8px', boxSizing: 'border-box' }}>
                          {thinkFeedback.type === 'success' ? <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} /> : <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />}
                          <div>{thinkFeedback.text}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
