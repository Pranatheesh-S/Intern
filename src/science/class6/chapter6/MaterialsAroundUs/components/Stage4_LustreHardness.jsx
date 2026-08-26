import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Activity, Search, ArrowRight } from 'lucide-react';

export default function Stage4_LustreHardness({ onComplete, addXp }) {
  // Lustre state
  const [lustreProgress, setLustreProgress] = useState({ iron: 0, copper: 0, wood: 0 });
  const [activeScrubTarget, setActiveScrubTarget] = useState('iron');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringBench, setIsHoveringBench] = useState(false);
  const [detectiveObservations, setDetectiveObservations] = useState({ iron: null, copper: null, wood: null });
  const [xpAwarded, setXpAwarded] = useState({ iron: false, copper: false, wood: false });
  
  // Track physical mouse distance
  const lastMousePos = useRef({ x: null, y: null });
  const distanceAccumulator = useRef(0);

  const lustreMaterials = {
    iron: { 
      id: 'iron',
      name: 'Rusty Iron Rod', 
      isMetal: true,
      shouldShine: true,
      shapeStyles: { width: '85%', height: '50px', borderRadius: '4px' },
      baseBg: 'linear-gradient(180deg, #4a210b, #8c4114 30%, #592e13 70%, #291204)',
      shinyBg: 'linear-gradient(180deg, var(--text-muted) 0%, #cbd5e1 30%, var(--text-muted) 70%, #475569 100%)',
      overlayBg: 'repeating-linear-gradient(65deg, transparent, transparent 10px, rgba(0,0,0,0.6) 10px, rgba(0,0,0,0.8) 14px), linear-gradient(180deg, transparent 46%, rgba(0,0,0,0.6) 48%, rgba(0,0,0,0.6) 52%, transparent 54%)'
    },
    copper: { 
      id: 'copper',
      name: 'Oxidized Copper Plate', 
      isMetal: true,
      shouldShine: true,
      shapeStyles: { width: '180px', height: '240px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.3)' },
      baseBg: 'linear-gradient(135deg, #4a2b1a, #633b26 40%, #2e1a10 100%)', 
      shinyBg: 'linear-gradient(135deg, #cc7722 0%, #f4a460 30%, #e68a35 60%, #8b4513 100%)', 
      overlayBg: 'repeating-linear-gradient(75deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)'
    },
    wood: { 
      id: 'wood',
      name: 'Wooden Branch', 
      isMetal: false,
      shouldShine: false,
      shapeStyles: { 
        width: '90%', height: '90px', 
        clipPath: 'polygon(2% 25%, 8% 18%, 25% 25%, 45% 12%, 65% 22%, 85% 8%, 98% 18%, 100% 40%, 96% 65%, 98% 85%, 82% 95%, 62% 82%, 42% 95%, 22% 85%, 8% 92%, 0% 75%, 3% 50%)'
      },
      baseBg: 'linear-gradient(180deg, #4a382e, #635043 30%, #3d2f25 70%, #261c15 100%)', 
      shinyBg: 'linear-gradient(180deg, #d8bc8a, #ecd1a5 30%, #b38c56 70%, #876233 100%)', 
      overlayBg: 'repeating-linear-gradient(3deg, transparent, transparent 3px, rgba(0,0,0,0.4) 4px, transparent 8px), repeating-linear-gradient(-2deg, transparent, transparent 15px, rgba(0,0,0,0.2) 16px, transparent 25px)'
    }
  };

  const handleMouseMove = (e) => {
    if (!activeScrubTarget) return;
    
    // Sandpaper tracking
    const rect = e.currentTarget.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;
    
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    
    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;
    
    setMousePos({ x: currentX, y: currentY });

    // Physical distance logic
    let distance = 0;
    if (lastMousePos.current.x !== null) {
      const dx = currentX - lastMousePos.current.x;
      const dy = currentY - lastMousePos.current.y;
      distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 100) distance = 0;
    }
    
    lastMousePos.current = { x: currentX, y: currentY };
    distanceAccumulator.current += distance;

    if (distanceAccumulator.current > 30) {
      const increments = Math.floor(distanceAccumulator.current / 30);
      distanceAccumulator.current = distanceAccumulator.current % 30;
      
      setLustreProgress(prev => {
        const current = prev[activeScrubTarget];
        if (current >= 100) return prev;
        const next = Math.min(current + (increments * 1.5), 100);
        return { ...prev, [activeScrubTarget]: next };
      });
    }
  };

  const handleObservation = (objId, observation) => {
    setDetectiveObservations(prev => ({ ...prev, [objId]: observation }));
    if (!xpAwarded[objId] && observation === (lustreMaterials[objId].shouldShine ? 'brighter' : 'dull')) {
      addXp(15);
      setXpAwarded(prev => ({ ...prev, [objId]: true }));
    }
  };

  // Completion requires checking all observations with the correct scientific result
  const isComplete = 
    detectiveObservations.iron === 'brighter' && 
    detectiveObservations.copper === 'brighter' && 
    detectiveObservations.wood === 'dull';

  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  const activeMat = lustreMaterials[activeScrubTarget];
  const progress = lustreProgress[activeScrubTarget];
  const isScrubbed = progress === 100;
  const currentObservation = detectiveObservations[activeScrubTarget];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem', width: '100%', overflow: 'hidden' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '0.25rem', border: '1px solid var(--accent-border)', padding: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={22} style={{ color: 'var(--accent)' }} /> 
          Lustre Restoration Lab
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)' }}>
          Can you bring back the shine? Choose a material, then scrub its surface to remove the dull outer layer and reveal what is underneath.
        </p>
      </div>

      {/* Main 3-Column Layout */}
      <div style={{ display: 'flex', flex: 1, gap: '1rem', minHeight: 0 }}>
        
        {/* Left Panel: Material Selector */}
        <div className="glass-panel" style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)', overflowY: 'auto', padding: '1rem' }}>
          <h4 style={{ margin: 0, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontSize: '1.2rem' }}>Materials to Investigate</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
            {Object.keys(lustreMaterials).map(key => {
              const m = lustreMaterials[key];
              const p = lustreProgress[key];
              const obs = detectiveObservations[key];
              const isActive = activeScrubTarget === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveScrubTarget(key)}
                  className={`outline ${isActive ? 'active' : ''}`}
                  style={{ 
                    padding: '1.25rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    textAlign: 'left',
                    gap: '0.5rem',
                    flex: 1,
                    border: isActive ? '2px solid var(--accent)' : '1px solid var(--border)',
                    background: isActive ? 'var(--accent-bg)' : 'var(--surface)'
                  }}
                >
                  <span style={{ fontWeight: 'bold', fontSize: '1.3rem', color: 'var(--text-primary)' }}>{m.name}</span>
                  <span style={{ fontSize: '1.05rem', color: p === 100 ? 'var(--success)' : 'var(--text-muted)' }}>
                    {obs !== null ? 'Investigation Complete ✨' : p === 100 ? 'Surface Restored' : 'Dull outer surface'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Center Panel: Scrubbing Station */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)', padding: '1rem' }}>
          <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
            <Activity size={18} /> 🔬 Scrubbing Station
          </h4>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            Move the sandpaper back and forth across the surface.
          </p>

          <div 
            style={{ 
              flex: 1, 
              background: 'var(--surface)', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              border: '2px dashed var(--border)',
              cursor: !isScrubbed ? 'none' : 'default'
            }}
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
            onMouseEnter={() => setIsHoveringBench(true)}
            onMouseLeave={() => setIsHoveringBench(false)}
          >
            {/* Physical Object Representation */}
            <div style={{ 
              ...activeMat.shapeStyles, 
              position: 'relative', overflow: 'hidden', 
              boxShadow: activeMat.shapeStyles.clipPath ? 'none' : '0 15px 25px -5px rgba(0,0,0,0.5)',
              filter: activeMat.shapeStyles.clipPath ? 'drop-shadow(0 15px 25px rgba(0,0,0,0.5))' : 'none'
            }}>
              
              {/* Shiny underlying layer */}
              <div style={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                  background: activeMat.shinyBg,
                  boxShadow: progress > 50 && activeMat.isMetal ? 'inset 0 0 30px rgba(255,255,255,0.4)' : 'none',
                }} 
              />

              {/* Dull rusty layer on top */}
              <div style={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                  background: activeMat.baseBg,
                  opacity: 1 - (progress / 100),
                  pointerEvents: 'none'
                }} 
              >
                <div style={{ width: '100%', height: '100%', opacity: 0.5, background: activeMat.overlayBg }} />
              </div>
            </div>

            {/* Custom Sandpaper Cursor */}
            {isHoveringBench && !isScrubbed && (
              <div style={{ 
                position: 'absolute', 
                left: mousePos.x - 30, 
                top: mousePos.y - 25, 
                width: '60px', 
                height: '50px', 
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 25%, #333 27%, #222 100%)', 
                border: '1px solid #111',
                borderRadius: '4px',
                pointerEvents: 'none',
                boxShadow: '2px 8px 12px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `rotate(${mousePos.x % 15 - 7}deg)`
              }}>
                 <div style={{ width: '100%', height: '100%', opacity: 0.6, backgroundImage: 'radial-gradient(#111 1px, transparent 1px)', backgroundSize: '3px 3px' }} />
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: isScrubbed ? 'var(--success)' : 'var(--text-muted)' }}>
              <span>Surface Restored: {Math.floor(progress)}%</span>
              {isScrubbed && <span style={{ fontWeight: 'bold' }}>✨ Complete</span>}
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--surface)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: isScrubbed ? 'var(--success)' : 'var(--accent)', transition: 'width 0.2s, background 0.3s' }} />
            </div>
          </div>

          {/* Think Like a Scientist Box */}
          <div style={{ background: 'rgba(251, 191, 36, 0.1)', borderLeft: '4px solid #fbbf24', padding: '0.75rem', borderRadius: '4px', marginTop: '0.5rem' }}>
            <h5 style={{ margin: '0 0 0.25rem 0', color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              💡 Think Like a Scientist
            </h5>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <strong>Why did the metal look dull before scrubbing?</strong> Air and moisture can make some metal surfaces lose their lustre. Scrubbing can remove the dull outer layer and reveal the surface underneath.
            </p>
          </div>
        </div>

        {/* Right Panel: Evidence Panel */}
        <div className="glass-panel" style={{ flex: '0 0 380px', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid var(--border)', overflowY: 'auto', padding: '1.25rem' }}>
          <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.3rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <Search size={22} /> What do you observe?
          </h4>

          {/* Before/After Visual */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: '1.25rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>BEFORE</span>
              <div style={{ width: '80px', height: '80px', borderRadius: '4px', background: activeMat.baseBg }}>
                <div style={{ width: '100%', height: '100%', opacity: 0.5, background: activeMat.overlayBg }} />
              </div>
            </div>
            <ArrowRight size={32} style={{ color: 'var(--text-muted)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>AFTER</span>
              <div style={{ width: '80px', height: '80px', borderRadius: '4px', background: activeMat.shinyBg, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: activeMat.baseBg, opacity: 1 - (progress/100) }}>
                  <div style={{ width: '100%', height: '100%', opacity: 0.5, background: activeMat.overlayBg }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.1rem', flex: 1 }}>
            <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: '8px', flex: 1 }}>
              <strong style={{ color: 'var(--text-muted)' }}>Before Scrubbing:</strong>
              <ul style={{ margin: '0.5rem 0 0 1.5rem', padding: 0, color: 'var(--text-secondary)' }}>
                <li>Appearance: Dull</li>
                <li>Surface: {activeMat.isMetal ? 'Oxidized/Rusty' : 'Rough/Bark'}</li>
              </ul>
            </div>
            
            <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: '8px', opacity: isScrubbed ? 1 : 0.5, transition: 'opacity 0.3s', flex: 1 }}>
              <strong style={{ color: isScrubbed ? 'var(--text-primary)' : 'var(--text-muted)' }}>After Scrubbing:</strong>
              <ul style={{ margin: '0.5rem 0 0 1.5rem', padding: 0, color: 'var(--text-secondary)' }}>
                <li>Appearance: {isScrubbed ? (activeMat.shouldShine ? 'Brighter' : 'Cleaner, but still dull') : '?'}</li>
                <li>Surface: {isScrubbed ? 'Cleaner' : '?'}</li>
              </ul>
            </div>
          </div>

          {/* Detective Observation section */}
          {isScrubbed && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 'auto', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '1.25rem', borderRadius: '8px' }}
            >
              <h5 style={{ margin: '0 0 0.5rem 0', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '1.15rem' }}>
                🕵️ Detective Observation
              </h5>
              <p style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                What changed after scrubbing?
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button 
                  className={currentObservation === 'brighter' ? 'primary' : 'outline'}
                  onClick={() => handleObservation(activeScrubTarget, 'brighter')}
                  style={{ padding: '0.75rem', fontSize: '1.05rem' }}
                >
                  ✨ Became brighter
                </button>
                <button 
                  className={currentObservation === 'dull' ? 'primary' : 'outline'}
                  onClick={() => handleObservation(activeScrubTarget, 'dull')}
                  style={{ padding: '0.75rem', fontSize: '1.05rem' }}
                >
                  ○ Stayed dull
                </button>
              </div>

              {currentObservation && (
                <div style={{ marginTop: '1rem', fontSize: '1.05rem', color: currentObservation === (activeMat.shouldShine ? 'brighter' : 'dull') ? 'var(--success)' : 'var(--danger)' }}>
                  {currentObservation === (activeMat.shouldShine ? 'brighter' : 'dull') 
                    ? <><strong>✨ Surface Revealed!</strong><br />You removed the dull outer layer. {activeMat.shouldShine ? 'The surface is now brighter and more lustrous.' : 'As expected, wood does not become shiny.'}</>
                    : <><strong>Hmm, look closely.</strong><br />{activeMat.shouldShine ? 'Did the metal become shiny underneath?' : 'Did the wood actually become shiny like a metal?'}</>
                  }
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
