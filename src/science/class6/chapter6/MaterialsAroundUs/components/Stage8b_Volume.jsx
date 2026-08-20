import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Droplet, CheckCircle2, AlertCircle, RefreshCw, Hand, Info, HelpCircle } from 'lucide-react';
import useSound from 'use-sound';

export default function Stage8b_Volume({ onComplete, addXp }) {
  // States: 
  // 0: Initial
  // 1: Dragging
  // 2: Animating Pour into A
  // 3: Animating Move to B
  // 4: Animating Pour into B
  // 5: Finished
  const [pourState, setPourState] = useState(0); 
  const [dragHover, setDragHover] = useState(false);
  
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  const [playWater] = useSound('https://assets.mixkit.co/active_storage/sfx/2502/2502-preview.mp3', { volume: 0.3 });

  const handleDrop = (e) => {
    e.preventDefault();
    setDragHover(false);
    if (pourState === 0) {
      startPourAnimation();
    }
  };

  const startPourAnimation = () => {
    // Sequence of animations
    setPourState(2); // Pour into A
    playWater();
    
    setTimeout(() => {
      setPourState(3); // Move to B
      setTimeout(() => {
        setPourState(4); // Pour into B
        playWater();
        addXp(10);
        setTimeout(() => {
          setPourState(5); // Done
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
      const timer = setTimeout(() => {
        onComplete();
        playSuccess();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [pourState, onComplete, playSuccess]);

  // Bottle Animation Variants
  const bottleVariants = {
    idle: { x: 0, y: 0, rotate: 0, opacity: 1 },
    dragging: { scale: 1.05, rotate: -5 },
    pourA: { x: 141, y: -100, rotate: 105, transition: { duration: 0.5 } },
    moveToB: { x: 301, y: -100, rotate: 105, transition: { duration: 0.8 } },
    pourB: { x: 301, y: -100, rotate: 105 },
    done: { x: 0, y: 0, rotate: 0, opacity: 0.4, transition: { duration: 0.8 } }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: '100%', color: 'var(--text-primary)' }}>
      
      {/* Header */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
            <Box size={20} /> Phase 2: Space and Volume
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Section 6.3.6: Pour water from the bottle into the two identical tumblers to observe volume.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '8px 12px', fontSize: '0.85rem', color: '#92400e', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '-6px', top: '20px', width: '10px', height: '10px', background: '#fffbeb', borderLeft: '1px solid #fde68a', borderBottom: '1px solid #fde68a', transform: 'rotate(45deg)' }} />
            💡 Let's investigate!<br/>Pour the water and<br/>observe carefully.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flex: 1, minHeight: 0 }}>
        
        {/* Main Lab Area */}
        <div style={{ flex: 1.6, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', zIndex: 20 }}>
              <div>
                <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 'bold' }}>Pour Water</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Use the large water bottle to fill the two identical tumblers.</div>
              </div>
              <button onClick={resetActivity} style={{ background: 'white', border: '1px solid #fca5a5', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <RefreshCw size={14} /> Reset
              </button>
            </div>
            
            {/* Wooden Desk Simulation */}
            <div style={{ 
              flex: 1, position: 'relative', borderRadius: '12px', overflow: 'hidden',
              background: 'linear-gradient(to bottom, var(--surface) 45%, #e5e5e5 45%, #d4a373 47%, #faedcd 100%)',
              border: '1px solid var(--border)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
            }}>
              
              <div style={{ width: '600px', height: '100%', position: 'relative' }}>
                {/* Giant Bottle SVG - Draggable */}
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
                  style={{ position: 'absolute', left: '20px', bottom: '30px', cursor: pourState === 0 ? 'grab' : 'default', zIndex: 30, transformOrigin: 'center center' }}
                >
                  <svg width="100" height="280" viewBox="0 0 100 280">
                    <defs>
                      <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--surface)" stopOpacity="0.8" />
                        <stop offset="20%" stopColor="var(--surface)" stopOpacity="0.6" />
                        <stop offset="80%" stopColor="var(--border)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.9" />
                      </linearGradient>
                    </defs>
                    
                    {/* Cap */}
                    <rect x="35" y="0" width="30" height="20" rx="3" fill="var(--accent)" />
                    <rect x="33" y="15" width="34" height="5" rx="1" fill="var(--text-heading)" />
                    
                    {/* Bottle Body */}
                    <path d="M40 20 L60 20 C65 20, 75 40, 75 60 L75 80 C85 90, 90 100, 90 120 L90 260 C90 275, 80 280, 70 280 L30 280 C20 280, 10 275, 10 260 L10 120 C10 100, 15 90, 25 80 L25 60 C25 40, 35 20, 40 20 Z" fill="url(#bottleGrad)" stroke="var(--accent)" strokeWidth="2" />
                    
                    {/* Water inside (Decreases as poured) */}
                    <motion.path 
                      d="M12 260 C12 270, 20 278, 30 278 L70 278 C80 278, 88 270, 88 260 L88 120 C88 105, 84 96, 75 88 L75 80 C75 80, 25 80, 25 80 L25 88 C16 96, 12 105, 12 120 Z"
                      fill="url(#waterGrad)"
                      animate={{
                        clipPath: pourState < 2 ? 'polygon(0% 20%, 100% 20%, 100% 100%, 0% 100%)' :
                                 pourState === 2 ? 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)' :
                                 pourState >= 4 ? 'polygon(0% 90%, 100% 90%, 100% 100%, 0% 100%)' : 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)'
                      }}
                      transition={{ duration: 1.5 }}
                    />
                    
                    {/* Label */}
                    <rect x="10" y="140" width="80" height="40" fill="rgba(255,255,255,0.7)" />
                    <circle cx="50" cy="160" r="12" fill="var(--accent)" />
                    <path d="M50 152 Q55 160 50 165 Q45 160 50 152" fill="white" />
                    
                    {/* Glare */}
                    <path d="M20 120 L20 260" stroke="rgba(255,255,255,0.8)" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </motion.div>
  
                {/* Water Streams */}
                <AnimatePresence>
                  {pourState === 2 && (
                    <motion.div 
                      initial={{ scaleY: 0, opacity: 0 }} 
                      animate={{ scaleY: 1, opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      style={{ position: 'absolute', left: '341px', bottom: '115px', height: '119px', width: '8px', background: 'linear-gradient(to bottom, var(--border), var(--accent))', zIndex: 15, borderRadius: '4px', transformOrigin: 'top center' }}
                    />
                  )}
                  {pourState === 4 && (
                    <motion.div 
                      initial={{ scaleY: 0, opacity: 0 }} 
                      animate={{ scaleY: 1, opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      style={{ position: 'absolute', left: '501px', bottom: '115px', height: '119px', width: '8px', background: 'linear-gradient(to bottom, var(--border), var(--accent))', zIndex: 15, borderRadius: '4px', transformOrigin: 'top center' }}
                    />
                  )}
                </AnimatePresence>
  
                {/* Drag instruction overlay */}
                {pourState === 0 && (
                  <div style={{ position: 'absolute', top: '20px', left: '250px', background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: '8px', padding: '16px 24px', color: 'var(--text-heading)', fontWeight: 'bold', textAlign: 'center', width: '220px', zIndex: 5 }}>
                    Drag the bottle and pour water<br/>into each tumbler.
                  </div>
                )}
                {pourState === 0 && (
                  <svg style={{ position: 'absolute', top: '60px', left: '130px', width: '100px', height: '100px', zIndex: 4 }}>
                    <path d="M 0 50 Q 50 0 90 20" fill="transparent" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="4 4" />
                    <polygon points="90,20 80,15 85,25" fill="var(--text-muted)" />
                  </svg>
                )}
  
                {/* Tumblers Container (Drop Target) */}
                <div 
                  onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                  style={{ 
                    position: 'absolute', left: '250px', bottom: '30px',
                    display: 'flex', gap: '50px', padding: '20px 40px', borderRadius: '16px',
                    background: dragHover ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    border: dragHover ? '2px dashed var(--accent)' : '2px solid transparent',
                    transition: 'all 0.2s', zIndex: 10
                  }}
                >
                  {/* Tumbler A (SVG) */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <svg width="110" height="150" viewBox="0 0 110 150">
                      <defs>
                        <linearGradient id="glassA" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                          <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
                        </linearGradient>
                        <linearGradient id="waterA" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(56,189,248,0.7)" />
                          <stop offset="100%" stopColor="rgba(2,132,199,0.7)" />
                        </linearGradient>
                        <clipPath id="tumblerClip">
                          {/* Tapered shape: wider at top (5 to 105), narrower at bottom (15 to 95) */}
                          <polygon points="5,0 105,0 95,145 15,145" />
                        </clipPath>
                      </defs>
                      
                      {/* Glass Back */}
                      <polygon points="5,0 105,0 95,145 15,145" fill="url(#glassA)" />
                      
                      {/* Water */}
                      <motion.rect 
                        x="0" y="0" width="110" height="150" 
                        fill="url(#waterA)" 
                        clipPath="url(#tumblerClip)"
                        initial={{ y: 150 }}
                        animate={{ y: pourState >= 2 ? 75 : 150 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                      
                      {/* Glass Front Border & Glare */}
                      <polygon points="5,0 105,0 95,145 15,145" fill="transparent" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
                      <line x1="20" y1="20" x2="28" y2="130" stroke="rgba(255,255,255,0.8)" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '0.9rem' }}>Tumbler A</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>( Half-filled )</div>
                    </div>
                  </div>
  
                  {/* Tumbler B (SVG) */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <svg width="110" height="150" viewBox="0 0 110 150">
                      <defs>
                        <linearGradient id="glassB" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                          <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
                        </linearGradient>
                        <linearGradient id="waterB" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(56,189,248,0.7)" />
                          <stop offset="100%" stopColor="rgba(2,132,199,0.7)" />
                        </linearGradient>
                        <clipPath id="tumblerClipB">
                          <polygon points="5,0 105,0 95,145 15,145" />
                        </clipPath>
                      </defs>
                      
                      {/* Glass Back */}
                      <polygon points="5,0 105,0 95,145 15,145" fill="url(#glassB)" />
                      
                      {/* Water */}
                      <motion.rect 
                        x="0" y="0" width="110" height="150" 
                        fill="url(#waterB)" 
                        clipPath="url(#tumblerClipB)"
                        initial={{ y: 150 }}
                        animate={{ y: pourState >= 4 ? 20 : 150 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                      
                      {/* Glass Front Border & Glare */}
                      <polygon points="5,0 105,0 95,145 15,145" fill="transparent" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
                      <line x1="20" y1="20" x2="28" y2="130" stroke="rgba(255,255,255,0.8)" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '0.9rem' }}>Tumbler B</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>( Fully-filled )</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How to do it steps */}
            <div style={{ marginTop: '1.5rem', zIndex: 20 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>How to do it:</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: pourState >= 1 ? 'var(--surface)' : 'var(--surface)', border: pourState >= 1 ? '1px solid var(--border)' : '1px solid var(--border)', padding: '8px 12px', borderRadius: '8px', flex: 1 }}>
                  <div style={{ position: 'relative' }}>
                    <Hand size={24} color={pourState >= 1 ? 'var(--text-muted)' : 'var(--accent)'} />
                    <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--border)', color: 'var(--text-muted)', fontSize: '0.6rem', width: '14px', height: '14px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>1</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: pourState >= 1 ? 'var(--text-muted)' : 'var(--text-primary)' }}>Drag the bottle</div>
                </div>
                <div style={{ color: 'var(--border)' }}>›</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: pourState >= 2 ? 'var(--surface)' : 'var(--surface)', border: pourState >= 2 ? '1px solid var(--border)' : '1px solid var(--border)', padding: '8px 12px', borderRadius: '8px', flex: 1, opacity: pourState >= 1 ? 1 : 0.5 }}>
                  <div style={{ position: 'relative' }}>
                    <Droplet size={24} color={pourState >= 2 ? 'var(--text-muted)' : 'var(--accent)'} />
                    <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--border)', color: 'var(--text-muted)', fontSize: '0.6rem', width: '14px', height: '14px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>2</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: pourState >= 2 ? 'var(--text-muted)' : 'var(--text-primary)' }}>Pour into a tumbler</div>
                </div>
                <div style={{ color: 'var(--border)' }}>›</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: pourState >= 5 ? 'var(--surface)' : 'var(--surface)', border: pourState >= 5 ? '1px solid var(--border)' : '1px solid var(--border)', padding: '8px 12px', borderRadius: '8px', flex: 1, opacity: pourState >= 4 ? 1 : 0.5 }}>
                  <div style={{ position: 'relative' }}>
                    <AlertCircle size={24} color={pourState >= 5 ? '#10b981' : 'var(--text-muted)'} />
                    <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--border)', color: 'var(--text-muted)', fontSize: '0.6rem', width: '14px', height: '14px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>3</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: pourState >= 5 ? '#10b981' : 'var(--text-primary)' }}>Observe the water level</div>
                </div>
              </div>
            </div>

            {/* Info Footer */}
            <div style={{ marginTop: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', zIndex: 20 }}>
              <Info size={16} color="var(--text-muted)" /> Both tumblers are identical and have the same capacity.
            </div>

          </div>
        </div>

        {/* Observation Side */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '4px' }}>
          
          {/* Log Box */}
          <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              📝 Investigation Log
            </h4>
            
            <AnimatePresence>
              {pourState >= 3 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ width: '30px', height: '40px', position: 'relative' }}>
                    <svg viewBox="0 0 110 150" style={{ width: '100%', height: '100%' }}>
                      <polygon points="5,0 105,0 95,145 15,145" fill="none" stroke="var(--border)" strokeWidth="8" />
                      <rect x="0" y="75" width="110" height="75" fill="var(--accent)" clipPath="url(#tumblerClip)" opacity="0.8" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.85rem' }}>Observation 1</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Tumbler A is half-filled<br/>with water.</div>
                  </div>
                </motion.div>
              )}
              
              {pourState >= 5 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ width: '30px', height: '40px', position: 'relative' }}>
                    <svg viewBox="0 0 110 150" style={{ width: '100%', height: '100%' }}>
                      <polygon points="5,0 105,0 95,145 15,145" fill="none" stroke="var(--border)" strokeWidth="8" />
                      <rect x="0" y="20" width="110" height="130" fill="var(--accent)" clipPath="url(#tumblerClip)" opacity="0.8" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.85rem' }}>Observation 2</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Tumbler B is almost<br/>completely filled with water.</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {pourState < 3 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '2rem 0', fontStyle: 'italic' }}>
                Waiting for observations...
              </div>
            )}
          </div>

          {/* Scientific Conclusion */}
          <AnimatePresence>
            {pourState >= 5 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} style={{ background: '#f0fdf4', padding: '1.25rem', borderRadius: '12px', border: '1px solid #86efac' }}>
                <div style={{ color: '#16a34a', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                  🧪 Scientific Conclusion
                </div>
                <div style={{ fontSize: '0.85rem', color: '#14532d', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>Even though the tumblers have the same capacity, the water levels differ.</div>
                  <div>The water in Tumbler A occupies less space than the water in Tumbler B.</div>
                  <div>The space occupied by an object or substance is called its <strong>volume!</strong></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Think More Box */}
          <AnimatePresence>
            {pourState >= 5 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} style={{ background: 'var(--accent-bg)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--accent-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: 'var(--accent)', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                    <HelpCircle size={16} /> Think More!
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#4c1d95', lineHeight: '1.5', paddingRight: '1rem' }}>
                    What if we pour the water from Tumbler B back into the bottle? What will you observe?
                  </div>
                </div>
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sam&backgroundColor=transparent" alt="Think" style={{ width: '60px', height: '60px' }} />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

    </div>
  );
}
