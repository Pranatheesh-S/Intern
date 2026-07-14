import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HelpCircle, Check } from 'lucide-react';

export default function Stage4_LustreHardness({ onComplete, addXp }) {
  // Lustre state
  const [lustreProgress, setLustreProgress] = useState({ iron: 0, copper: 0, wood: 0 });
  const [activeScrubTarget, setActiveScrubTarget] = useState(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringBench, setIsHoveringBench] = useState(false);
  
  // Track physical mouse distance
  const lastMousePos = useRef({ x: null, y: null });
  const distanceAccumulator = useRef(0);

  // Hardness state
  const [hardnessTests, setHardnessTests] = useState({});
  const [selectedHardnessObject, setSelectedHardnessObject] = useState(null);
  const [completedTests, setCompletedTests] = useState({ squeeze: false, scratch: false });
  const [activeTestAnim, setActiveTestAnim] = useState(null);

  const lustreMaterials = {
    iron: { 
      name: 'Rusty Iron Rod', 
      isMetal: true,
      shapeStyles: { width: '85%', height: '26px', borderRadius: '4px' },
      baseBg: 'linear-gradient(180deg, #4a210b, #8c4114 30%, #592e13 70%, #291204)',
      shinyBg: 'linear-gradient(180deg, #94a3b8 0%, #cbd5e1 30%, #94a3b8 70%, #64748b 100%)',
      overlayBg: 'repeating-linear-gradient(65deg, transparent, transparent 10px, rgba(0,0,0,0.6) 10px, rgba(0,0,0,0.8) 14px), linear-gradient(180deg, transparent 46%, rgba(0,0,0,0.6) 48%, rgba(0,0,0,0.6) 52%, transparent 54%)'
    },
    copper: { 
      name: 'Oxidized Copper Plate', 
      isMetal: true,
      shapeStyles: { width: '80px', height: '130px', borderRadius: '2px', border: '1px solid rgba(0,0,0,0.3)' },
      baseBg: 'linear-gradient(135deg, #4a2b1a, #633b26 40%, #2e1a10 100%)', // Dull dark reddish-brown tarnish
      shinyBg: 'linear-gradient(135deg, #cc7722 0%, #f4a460 30%, #e68a35 60%, #8b4513 100%)', // Polished brushed copper
      overlayBg: 'repeating-linear-gradient(75deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)' // Brushed scratch marks
    },
    wood: { 
      name: 'Wooden Branch', 
      isMetal: false,
      shapeStyles: { 
        width: '90%', height: '50px', 
        clipPath: 'polygon(2% 25%, 8% 18%, 25% 25%, 45% 12%, 65% 22%, 85% 8%, 98% 18%, 100% 40%, 96% 65%, 98% 85%, 82% 95%, 62% 82%, 42% 95%, 22% 85%, 8% 92%, 0% 75%, 3% 50%)'
      },
      baseBg: 'linear-gradient(180deg, #4a382e, #635043 30%, #3d2f25 70%, #261c15 100%)', // Bark
      shinyBg: 'linear-gradient(180deg, #d8bc8a, #ecd1a5 30%, #b38c56 70%, #876233 100%)', // Sanded inner wood
      overlayBg: 'repeating-linear-gradient(3deg, transparent, transparent 3px, rgba(0,0,0,0.4) 4px, transparent 8px), repeating-linear-gradient(-2deg, transparent, transparent 15px, rgba(0,0,0,0.2) 16px, transparent 25px)' // Longitudinal bark grain
    }
  };

  const hardnessObjects = [
    { id: 'brick', name: 'Brick', correct: 'Hard', material: 'Baked clay', squeezeEffect: 'No effect', scratchEffect: 'Powders slightly, no deep scratch' },
    { id: 'sponge', name: 'Sponge', correct: 'Soft', material: 'Synthetic foam', squeezeEffect: 'Squishes flat!', scratchEffect: 'Indents easily' },
    { id: 'pillow', name: 'Cotton Pillow', correct: 'Soft', material: 'Cotton fiber', squeezeEffect: 'Compresses softly!', scratchEffect: 'Sinks in' },
    { id: 'candle', name: 'Wax Candle', correct: 'Soft', material: 'Paraffin wax', squeezeEffect: 'No effect', scratchEffect: 'Deep key scratch marks left!' },
    { id: 'ironkey', name: 'Iron Bolt', correct: 'Hard', material: 'Iron metal', squeezeEffect: 'No effect', scratchEffect: 'Key slips off, no mark' }
  ];

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
      
      // Cap massive jumps (e.g., leaving and re-entering the box quickly)
      if (distance > 100) distance = 0;
    }
    
    lastMousePos.current = { x: currentX, y: currentY };
    distanceAccumulator.current += distance;

    // Progress updates every ~30px of movement
    if (distanceAccumulator.current > 30) {
      const increments = Math.floor(distanceAccumulator.current / 30);
      distanceAccumulator.current = distanceAccumulator.current % 30;
      
      setLustreProgress(prev => {
        const current = prev[activeScrubTarget];
        if (current >= 100) return prev;
        const next = Math.min(current + (increments * 1.5), 100);
        if (next === 100 && current < 100) {
          addXp(10);
        }
        return { ...prev, [activeScrubTarget]: next };
      });
    }
  };

  const handleHardnessTest = (objId, answer) => {
    setHardnessTests(prev => ({ ...prev, [objId]: answer }));
    const obj = hardnessObjects.find(h => h.id === objId);
    if (obj.correct === answer) {
      addXp(5);
    }
  };

  const allLustrePolished = lustreProgress.iron === 100 && lustreProgress.copper === 100 && lustreProgress.wood === 100; // Require fully scrubbing wood too
  
  const correctHardnessCount = hardnessObjects.filter(obj => hardnessTests[obj.id] === obj.correct).length;
  const allHardnessTested = correctHardnessCount === hardnessObjects.length;

  useEffect(() => {
    if (allLustrePolished && allHardnessTested) {
      onComplete();
    }
  }, [allLustrePolished, allHardnessTested, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Intro */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={22} style={{ color: 'var(--accent)' }} /> 6.3.1 & 6.3.2: Lustre & Hardness Testing Lab
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Metals are shiny (lustrous) when polished, but can look dull if exposed to air. 
          Materials can also be classified as <strong>hard</strong> (difficult to scratch/compress) or <strong>soft</strong> (easy to scratch/compress).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Lustre Polish Workbench */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>1. Sandpaper Lustre Scrape</span>
          </div>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
            Select an item, then <strong>scrub it rapidly by moving your mouse (or finger) back and forth over it</strong> to scrape off the outer layer!
          </p>

          {/* Scrape Target Selectors */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', margin: '0.5rem 0' }}>
            {Object.keys(lustreMaterials).map((key) => {
              const m = lustreMaterials[key];
              const progress = lustreProgress[key];
              return (
                <button
                  key={key}
                  onClick={() => setActiveScrubTarget(key)}
                  className={activeScrubTarget === key ? 'primary' : 'outline'}
                  style={{ fontSize: '0.95rem', padding: '0.6rem 0.8rem' }}
                >
                  {m.name} {progress === 100 ? '✨' : ''}
                </button>
              );
            })}
          </div>

          {/* Active target visualization */}
          <div 
            style={{ 
              height: '160px', 
              background: 'var(--surface)', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              border: '2px solid var(--border)',
              cursor: activeScrubTarget && lustreProgress[activeScrubTarget] < 100 ? 'none' : 'default'
            }}
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
            onMouseEnter={() => setIsHoveringBench(true)}
            onMouseLeave={() => setIsHoveringBench(false)}
          >
            {activeScrubTarget ? (
              <>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', position: 'absolute', top: '0.5rem' }}>Polishing Bench (Scrub Here!)</span>
                
                {/* Physical Object Representation */}
                <div style={{ 
                  ...lustreMaterials[activeScrubTarget].shapeStyles, 
                  position: 'relative', overflow: 'hidden', 
                  boxShadow: lustreMaterials[activeScrubTarget].shapeStyles.clipPath ? 'none' : '0 10px 15px -3px rgba(0,0,0,0.5)',
                  filter: lustreMaterials[activeScrubTarget].shapeStyles.clipPath ? 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' : 'none'
                }}>
                  
                  {/* Shiny underlying layer (always on bottom) */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: 0, left: 0, right: 0, bottom: 0, 
                      background: lustreMaterials[activeScrubTarget].shinyBg,
                      boxShadow: lustreProgress[activeScrubTarget] > 50 && lustreMaterials[activeScrubTarget].isMetal ? 'inset 0 0 20px rgba(255,255,255,0.8)' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }} 
                  >
                  </div>

                  {/* Dull rusty layer on top (fades away as you scrub) */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: 0, left: 0, right: 0, bottom: 0, 
                      background: lustreMaterials[activeScrubTarget].baseBg,
                      opacity: 1 - (lustreProgress[activeScrubTarget] / 100),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      pointerEvents: 'none'
                    }} 
                  >
                    {/* Texture for rust/dullness */}
                    <div style={{ width: '100%', height: '100%', opacity: 0.5, background: lustreMaterials[activeScrubTarget].overlayBg }}></div>
                  </div>
                </div>
                
                {/* Global Result Overlay */}
                {lustreProgress[activeScrubTarget] === 100 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5, y: '-50%', x: '-50%' }}
                    animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
                    transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
                    style={{
                      position: 'absolute',
                      top: '50%', left: '50%', 
                      background: 'rgba(15, 23, 42, 0.95)',
                      padding: '0.75rem 1.5rem', borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                      pointerEvents: 'none', zIndex: 10,
                      backdropFilter: 'blur(4px)',
                      border: lustreMaterials[activeScrubTarget].isMetal ? '2px solid rgba(251,191,36,0.6)' : '1px solid rgba(255,255,255,0.1)',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {lustreMaterials[activeScrubTarget].isMetal ? (
                      <span style={{ color: '#fbbf24', fontWeight: 'bold', textShadow: '0 0 10px rgba(251,191,36,0.6)', fontSize: '1.4rem', letterSpacing: '2px' }}>✨ LUSTROUS ✨</span>
                    ) : (
                      <span style={{ color: '#94a3b8', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>DULL (Non-lustrous)</span>
                    )}
                  </motion.div>
                )}

                {/* Custom Sandpaper Cursor */}
                {isHoveringBench && lustreProgress[activeScrubTarget] < 100 && (
                  <div style={{ 
                    position: 'absolute', 
                    left: mousePos.x - 25, 
                    top: mousePos.y - 20, 
                    width: '50px', 
                    height: '40px', 
                    // Simulate folded corner: top left is golden backing, rest is dark charcoal abrasive
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 25%, #3f3f46 27%, #27272a 100%)', 
                    border: '1px solid #18181b',
                    borderRadius: '2px',
                    pointerEvents: 'none',
                    boxShadow: '2px 4px 8px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `rotate(${mousePos.x % 15 - 7}deg)` // Adds slight rotation based on movement
                  }}>
                     {/* Fine grain texture */}
                     <div style={{ width: '100%', height: '100%', opacity: 0.5, backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '2px 2px' }}></div>
                  </div>
                )}
                
                <div style={{ position: 'absolute', bottom: '0.5rem', fontSize: '0.95rem', color: lustreProgress[activeScrubTarget] === 100 ? 'var(--success)' : 'var(--text-muted)' }}>
                  Rust Removed: {Math.floor(lustreProgress[activeScrubTarget])}%
                </div>
              </>
            ) : (
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Select an item from the tray above</span>
            )}
          </div>

          <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.5', minHeight: '60px' }}>
            {activeScrubTarget && lustreProgress[activeScrubTarget] === 100 ? (
              lustreMaterials[activeScrubTarget].isMetal ? (
                <div style={{ color: 'var(--success)' }}>
                  <strong>Metal shines!</strong> Scraping away the outer corrosion reveals the underlying <strong>lustrous</strong> metal.
                </div>
              ) : (
                <div style={{ color: 'var(--text-secondary)' }}>
                  <strong>No shine:</strong> Wood does not possess a shiny surface, making it <strong>non-lustrous</strong>.
                </div>
              )
            ) : (
               activeScrubTarget ? "Move your mouse back and forth inside the box to scrub!" : ""
            )}
          </div>
        </div>

        {/* Hardness compression/scratch test */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>2. Compression & Scratch Test</span>
          </div>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
            Pick an item to test. Hold it, squeeze it, or try to scratch it with a key. Then record if it is Hard or Soft.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
            {hardnessObjects.map((obj) => (
              <button
                key={obj.id}
                onClick={() => {
                  setSelectedHardnessObject(obj);
                  setCompletedTests({ squeeze: false, scratch: false });
                  setActiveTestAnim(null);
                }}
                className={selectedHardnessObject?.id === obj.id ? 'outline active' : 'outline'}
                style={{ padding: '0.5rem 0.8rem', fontSize: '0.9rem' }}
              >
                {obj.name} {hardnessTests[obj.id] ? '✓' : ''}
              </button>
            ))}
          </div>

          <div style={{ minHeight: '160px', background: 'var(--surface)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {selectedHardnessObject ? (
              <>
                <strong style={{ fontSize: '1.1rem', color: 'var(--text-heading)' }}>Testing: {selectedHardnessObject.name}</strong>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  <div><strong>Material:</strong> {selectedHardnessObject.material}</div>
                </div>

                {/* Interactive Test Area */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', padding: '1rem 0' }}>
                  <motion.div 
                    animate={
                      activeTestAnim === 'squeeze' ? (
                        selectedHardnessObject.correct === 'Soft' ? { scale: [1, 0.8, 0.9, 1] } : { x: [-2, 2, -2, 2, 0] }
                      ) : activeTestAnim === 'scratch' ? { rotate: [0, -10, 10, -5, 5, 0] } : {}
                    }
                    transition={{ duration: 0.5 }}
                    style={{ 
                      width: '60px', height: '60px', background: 'var(--accent-bg)', 
                      borderRadius: '8px', border: '1px solid var(--accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
                    }}
                  >
                    📦
                  </motion.div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button 
                    onClick={() => {
                      setActiveTestAnim('squeeze');
                      setTimeout(() => {
                        setCompletedTests(prev => ({ ...prev, squeeze: true }));
                        setActiveTestAnim(null);
                      }, 600);
                    }}
                    className="outline"
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.95rem', display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}
                  >
                    ✊ Squeeze Test
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTestAnim('scratch');
                      setTimeout(() => {
                        setCompletedTests(prev => ({ ...prev, scratch: true }));
                        setActiveTestAnim(null);
                      }, 600);
                    }}
                    className="outline"
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.95rem', display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}
                  >
                    🔑 Key Scratch
                  </button>
                </div>

                {/* Results shown only after testing */}
                <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', minHeight: '40px', marginTop: '0.75rem' }}>
                  {completedTests.squeeze && <div><strong>Squeeze Result:</strong> {selectedHardnessObject.squeezeEffect}</div>}
                  {completedTests.scratch && <div><strong>Scratch Result:</strong> {selectedHardnessObject.scratchEffect}</div>}
                </div>

                {/* Final Classification (shown only if at least one test is done) */}
                {(completedTests.squeeze || completedTests.scratch) && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                    <button 
                      onClick={() => handleHardnessTest(selectedHardnessObject.id, 'Soft')}
                      className={hardnessTests[selectedHardnessObject.id] === 'Soft' ? 'primary' : 'outline'}
                      style={{ flex: 1, padding: '0.5rem', fontSize: '0.95rem' }}
                    >
                      It is Soft
                    </button>
                    <button 
                      onClick={() => handleHardnessTest(selectedHardnessObject.id, 'Hard')}
                      className={hardnessTests[selectedHardnessObject.id] === 'Hard' ? 'primary' : 'outline'}
                      style={{ flex: 1, padding: '0.5rem', fontSize: '0.95rem' }}
                    >
                      It is Hard
                    </button>
                  </div>
                )}

                {hardnessTests[selectedHardnessObject.id] && (
                  <div style={{ fontSize: '0.9rem', color: hardnessTests[selectedHardnessObject.id] === selectedHardnessObject.correct ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold', marginTop: '0.5rem' }}>
                    {hardnessTests[selectedHardnessObject.id] === selectedHardnessObject.correct ? 'Correct observation!' : 'Incorrect, try to re-read the test details.'}
                  </div>
                )}
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '1rem' }}>
                Select an item to run tests
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', minHeight: '60px' }}>
        {allLustrePolished && allHardnessTested && (
          <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '1rem 2rem', borderRadius: '8px', color: 'var(--success)', fontWeight: 'bold', fontSize: '1rem' }}>
            Tests Complete! Click "Proceed to next" in the top right.
          </div>
        )}
      </div>
    </div>
  );
}
