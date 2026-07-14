import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HelpCircle, Check } from 'lucide-react';

export default function Stage4_LustreHardness({ onComplete, addXp }) {
  // Lustre state
  const [lustreProgress, setLustreProgress] = useState({ iron: 0, copper: 0, wood: 0 });
  const [activeScrubTarget, setActiveScrubTarget] = useState(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringBench, setIsHoveringBench] = useState(false);

  // Hardness state
  const [hardnessTests, setHardnessTests] = useState({});
  const [selectedHardnessObject, setSelectedHardnessObject] = useState(null);

  const lustreMaterials = {
    iron: { name: 'Rusty Iron Rod', baseColor: '#5a4a42', shinyColor: '#cbd5e1', isMetal: true },
    copper: { name: 'Oxidized Copper Plate', baseColor: '#5c523d', shinyColor: '#f97316', isMetal: true },
    wood: { name: 'Wooden Branch', baseColor: '#78350f', shinyColor: '#78350f', isMetal: false }
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
    
    setMousePos({ x: clientX - rect.left, y: clientY - rect.top });

    // Progress logic
    setLustreProgress(prev => {
      const current = prev[activeScrubTarget];
      if (current >= 100) return prev;
      const next = Math.min(current + 1.5, 100);
      if (next === 100 && current < 100) {
        addXp(10);
      }
      return { ...prev, [activeScrubTarget]: next };
    });
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Intro */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={22} style={{ color: 'var(--accent)' }} /> 6.3.1 & 6.3.2: Lustre & Hardness Testing Lab
        </h3>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Metals are shiny (lustrous) when polished, but can look dull if exposed to air. 
          Materials can also be classified as <strong>hard</strong> (difficult to scratch/compress) or <strong>soft</strong> (easy to scratch/compress).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Lustre Polish Workbench */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>1. Sandpaper Lustre Scrape</span>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
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
                  style={{ fontSize: '0.75rem', padding: '0.5rem' }}
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
              background: '#1e293b', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              border: '2px solid #334155',
              cursor: activeScrubTarget && lustreProgress[activeScrubTarget] < 100 ? 'none' : 'default'
            }}
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
            onMouseEnter={() => setIsHoveringBench(true)}
            onMouseLeave={() => setIsHoveringBench(false)}
          >
            {activeScrubTarget ? (
              <>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', position: 'absolute', top: '0.5rem' }}>Polishing Bench (Scrub Here!)</span>
                
                {/* Physical Object Representation */}
                <div style={{ width: '70%', height: '50px', borderRadius: '8px', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}>
                  
                  {/* Shiny underlying layer (always on bottom) */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: 0, left: 0, right: 0, bottom: 0, 
                      background: lustreMaterials[activeScrubTarget].shinyColor,
                      boxShadow: lustreProgress[activeScrubTarget] > 50 && lustreMaterials[activeScrubTarget].isMetal ? 'inset 0 0 20px rgba(255,255,255,0.8)' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }} 
                  >
                     {lustreProgress[activeScrubTarget] === 100 && lustreMaterials[activeScrubTarget].isMetal && (
                        <div style={{ color: '#fff', fontWeight: 'bold', textShadow: '0 0 5px rgba(0,0,0,0.8)', fontSize: '1.2rem', letterSpacing: '2px' }}>✨ LUSTROUS ✨</div>
                     )}
                     {lustreProgress[activeScrubTarget] === 100 && !lustreMaterials[activeScrubTarget].isMetal && (
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold', fontSize: '1.1rem' }}>DULL (Non-lustrous)</div>
                     )}
                  </div>

                  {/* Dull rusty layer on top (fades away as you scrub) */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: 0, left: 0, right: 0, bottom: 0, 
                      background: lustreMaterials[activeScrubTarget].baseColor,
                      opacity: 1 - (lustreProgress[activeScrubTarget] / 100),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      pointerEvents: 'none'
                    }} 
                  >
                    {/* Texture for rust/dullness */}
                    <div style={{ width: '100%', height: '100%', opacity: 0.3, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.5) 5px, rgba(0,0,0,0.5) 10px)' }}></div>
                  </div>
                </div>
                
                {/* Custom Sandpaper Cursor */}
                {isHoveringBench && lustreProgress[activeScrubTarget] < 100 && (
                  <div style={{ 
                    position: 'absolute', 
                    left: mousePos.x - 20, 
                    top: mousePos.y - 20, 
                    width: '40px', 
                    height: '30px', 
                    background: '#d97706', // Sandpaper color
                    border: '2px solid #92400e',
                    borderRadius: '4px',
                    pointerEvents: 'none',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `rotate(${mousePos.x % 15 - 7}deg)` // Adds slight rotation based on movement
                  }}>
                     <div style={{ width: '100%', height: '100%', opacity: 0.4, backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                  </div>
                )}
                
                <div style={{ position: 'absolute', bottom: '0.5rem', fontSize: '0.75rem', color: lustreProgress[activeScrubTarget] === 100 ? 'var(--success)' : '#cbd5e1' }}>
                  Rust Removed: {Math.floor(lustreProgress[activeScrubTarget])}%
                </div>
              </>
            ) : (
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Select an item from the tray above</span>
            )}
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4', minHeight: '40px' }}>
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
            <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>2. Compression & Scratch Test</span>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
            Pick an item to test. Hold it, squeeze it, or try to scratch it with a key. Then record if it is Hard or Soft.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
            {hardnessObjects.map((obj) => (
              <button
                key={obj.id}
                onClick={() => setSelectedHardnessObject(obj)}
                className={selectedHardnessObject?.id === obj.id ? 'outline active' : 'outline'}
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.7rem' }}
              >
                {obj.name} {hardnessTests[obj.id] ? '✓' : ''}
              </button>
            ))}
          </div>

          <div style={{ minHeight: '160px', background: 'var(--surface)', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {selectedHardnessObject ? (
              <>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-heading)' }}>Testing: {selectedHardnessObject.name}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <div><strong>Material:</strong> {selectedHardnessObject.material}</div>
                  <div><strong>Squeeze Test:</strong> {selectedHardnessObject.squeezeEffect}</div>
                  <div><strong>Key Scratch Test:</strong> {selectedHardnessObject.scratchEffect}</div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button 
                    onClick={() => handleHardnessTest(selectedHardnessObject.id, 'Soft')}
                    className={hardnessTests[selectedHardnessObject.id] === 'Soft' ? 'primary' : 'outline'}
                    style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem' }}
                  >
                    It is Soft
                  </button>
                  <button 
                    onClick={() => handleHardnessTest(selectedHardnessObject.id, 'Hard')}
                    className={hardnessTests[selectedHardnessObject.id] === 'Hard' ? 'primary' : 'outline'}
                    style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem' }}
                  >
                    It is Hard
                  </button>
                </div>

                {hardnessTests[selectedHardnessObject.id] && (
                  <div style={{ fontSize: '0.7rem', color: hardnessTests[selectedHardnessObject.id] === selectedHardnessObject.correct ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                    {hardnessTests[selectedHardnessObject.id] === selectedHardnessObject.correct ? 'Correct observation!' : 'Incorrect, try to re-read the test details.'}
                  </div>
                )}
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Select an item to run tests
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button
          disabled={!allLustrePolished || !allHardnessTested}
          onClick={onComplete}
          className="primary"
          style={{ padding: '0.75rem 2rem' }}
        >
          Proceed to Material Suitability
        </button>
      </div>
    </div>
  );
}
