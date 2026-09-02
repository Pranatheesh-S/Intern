import React, { useState, useEffect } from 'react';
import { Hand, CheckCircle, Lightbulb, ChevronsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Stage4c_Hardness_Observe({ onComplete, addXp }) {
  const items = [
    { id: 'cotton', name: 'Cotton Ball', type: 'soft', resultText: 'It got compressed easily.', icon: <div style={{ width: '50px', height: '50px', background: 'radial-gradient(circle at 30% 30%, var(--lesson-surface), var(--lesson-border))', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />, color: '#A64B27', bg: 'var(--lesson-success-bg)', blockBg: 'var(--lesson-success-border)', blockRadius: '20px' },
    { id: 'sponge', name: 'Washing Sponge', type: 'soft', resultText: 'It was pressed down. It is soft.', icon: '🧽', color: '#A64B27', bg: 'var(--lesson-success-bg)', blockBg: 'var(--lesson-success-border)', blockRadius: '8px' },
    { id: 'eraser', name: 'Eraser', type: 'soft', resultText: 'It changed shape slightly.', icon: (
      <svg width="50" height="50" viewBox="0 0 50 50">
        <g transform="rotate(-15 25 25)">
          <rect x="6" y="16" width="38" height="18" rx="4" fill="#fda4af" />
          <rect x="6" y="16" width="38" height="12" rx="4" fill="#fecdd3" />
          <rect x="16" y="16" width="18" height="18" fill="#A64B27" />
          <rect x="16" y="16" width="18" height="12" fill="var(--lesson-border)" />
        </g>
      </svg>
    ), color: '#A64B27', bg: 'var(--lesson-success-bg)', blockBg: 'var(--lesson-border)', blockRadius: '4px' },
    { id: 'stone', name: 'River Stone', type: 'hard', resultText: 'It did not change shape.', icon: '🪨', color: 'var(--lesson-danger)', bg: 'var(--lesson-danger-bg)', blockBg: 'var(--lesson-muted)', blockRadius: '12px' },
    { id: 'iron', name: 'Iron Rod', type: 'hard', resultText: 'It did not change shape at all.', icon: <div style={{ width: '55px', height: '18px', background: 'linear-gradient(180deg, var(--lesson-border), var(--lesson-surface), var(--lesson-muted))', borderRadius: '4px', transform: 'rotate(20deg)', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }} />, color: 'var(--lesson-danger)', bg: 'var(--lesson-danger-bg)', blockBg: 'var(--lesson-muted)', blockRadius: '0px' }
  ];

  const [testedItems, setTestedItems] = useState({});
  const [activeAnim, setActiveAnim] = useState(null);
  const [placedItems, setPlacedItems] = useState({ soft: [], hard: [] });

  const handlePress = (id) => {
    if (activeAnim) return;
    setActiveAnim(id);
    setTimeout(() => {
      setTestedItems(prev => {
        if (!prev[id]) addXp(10);
        return { ...prev, [id]: true };
      });
      // Automatically place the item
      const item = items.find(i => i.id === id);
      setPlacedItems(prev => {
        if (prev[item.type].includes(id)) return prev;
        return { ...prev, [item.type]: [...prev[item.type], id] };
      });
      setActiveAnim(null);
    }, 1000);
  };

  const allTested = Object.keys(testedItems).length === items.length;
  const allPlaced = placedItems.soft.length === 3 && placedItems.hard.length === 2;

  useEffect(() => {
    if (allTested && allPlaced) {
      setTimeout(() => onComplete(), 1500);
    }
  }, [allTested, allPlaced, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Top Header & Tip */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--lesson-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Hand size={24} style={{ color: '#A64B27' }} /> Observe Hardness: Press Test
          </h3>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--lesson-secondary)', lineHeight: '1.5' }}>
            Before we perform advanced scratch tests, detectives test materials by simply pressing them. Press each object with your hand and observe what happens.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--lesson-muted)' }}>
            <Lightbulb size={16} color="var(--lesson-warning)" /> Click <strong>"Press"</strong> on each material to test it. Watch carefully and compare!
          </div>
        </div>
        
        <div style={{ width: '280px', background: '#FFFFFF', border: '1px solid var(--lesson-border)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ca8a04', fontWeight: 'bold', fontSize: '0.95rem' }}>
            <Lightbulb size={18} /> Detective Tip
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--lesson-secondary)', lineHeight: '1.4' }}>
            If a material changes shape easily, it is <strong>soft</strong>. If it does not change shape, it is <strong>hard</strong>.
          </div>
        </div>
      </div>

      {/* Materials Row */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
        {items.map(item => {
          const isTesting = activeAnim === item.id;
          const isTested = testedItems[item.id];
          const isPlaced = placedItems.soft.includes(item.id) || placedItems.hard.includes(item.id);

          return (
            <div key={item.id} style={{ 
              flex: 1, 
              border: `1px solid ${isTested ? item.color : 'var(--lesson-border)'}`, 
              borderRadius: '12px', 
              padding: '1rem 0.5rem', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '1rem',
              background: 'white',
              position: 'relative',
              opacity: isPlaced ? 0.5 : 1
            }}>
              {/* Item Name */}
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: isTested ? item.color : 'var(--lesson-text)' }}>
                {item.name}
              </div>

              {/* Animation Box containing the actual Object Icon */}
              <div 
                style={{ 
                  width: '100%', height: '140px', 
                  border: `1px solid ${isTested ? item.color : 'var(--lesson-border)'}`,
                  borderRadius: '8px',
                  background: isTested ? item.bg : 'var(--lesson-surface)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingBottom: '1rem',
                  overflow: 'hidden',
                  cursor: 'default'
                }}>
                
                {/* Arrows */}
                <div style={{ position: 'absolute', top: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <AnimatePresence>
                    {isTesting && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 5 }}
                        exit={{ opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                      >
                        <ChevronsDown size={24} color={item.color} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Hand */}
                <motion.div
                  animate={{ y: isTesting ? 45 : 0 }}
                  transition={{ duration: 0.3, yoyo: Infinity }}
                  style={{ position: 'absolute', top: '10px', zIndex: 10 }}
                >
                  <Hand size={48} color="var(--lesson-warning)" fill="var(--lesson-warning-border)" style={{ transform: 'rotate(-15deg)' }} />
                </motion.div>

                {/* The Actual Material Icon */}
                <motion.div
                  animate={isTesting ? (item.type === 'soft' ? { scaleY: 0.5, scaleX: 1.2, y: 15 } : { y: [0, 2, 0, 2, 0] }) : { scaleY: 1, scaleX: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontSize: '4rem', 
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))',
                    transformOrigin: 'bottom',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px'
                  }}
                >
                  {item.icon}
                </motion.div>
              </div>

              {/* Press Button / Result */}
              <div style={{ height: '95px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', width: '100%', padding: '0 0.5rem' }}>
                {isTested ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: item.color, color: 'white', padding: '2px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '2px' }}>
                      {item.type === 'soft' ? 'Soft' : 'Hard'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--lesson-secondary)', textAlign: 'center', lineHeight: '1.2' }}>
                      {item.resultText}
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1 }}></div>
                )}
                
                <button 
                  onClick={() => handlePress(item.id)}
                  disabled={activeAnim !== null}
                  style={{
                    background: '#A64B27', color: 'white', border: 'none',
                    padding: '0.4rem 1.5rem', borderRadius: '20px',
                    fontWeight: 'bold', cursor: activeAnim ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem', width: '100%',
                    boxShadow: '0 2px 4px rgba(59,130,246,0.3)',
                    marginTop: '0.25rem'
                  }}
                >
                  Press
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Auto-Sorting Observation Section */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--lesson-border)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--lesson-primary)', fontWeight: 'bold' }}>
          <span style={{ fontSize: '1.2rem' }}>🔍</span> My Observation
        </div>
        <div style={{ fontSize: '0.95rem', color: 'var(--lesson-secondary)' }}>
          As you test the materials, they will be automatically sorted into the correct boxes based on their properties.
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
          {/* Soft Drop Zone */}
          <div style={{ flex: 1, border: '2px dashed #A64B27', borderRadius: '12px', background: 'var(--lesson-success-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', minHeight: '120px' }}>
            <div style={{ color: '#A64B27', fontWeight: 'bold', marginBottom: '1rem' }}>Soft (Easily Compressed)</div>
            {placedItems.soft.length === 0 ? (
              <div style={{ color: 'var(--lesson-success-border)', margin: 'auto' }}>Awaiting soft materials...</div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {placedItems.soft.map(id => {
                  const item = items.find(i => i.id === id);
                  return <div key={id} style={{ fontSize: '2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{item.icon}</div>;
                })}
              </div>
            )}
          </div>

          {/* Hard Drop Zone */}
          <div style={{ flex: 1, border: '2px dashed var(--lesson-danger)', borderRadius: '12px', background: 'var(--lesson-danger-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', minHeight: '120px' }}>
            <div style={{ color: 'var(--lesson-danger)', fontWeight: 'bold', marginBottom: '1rem' }}>Hard (Difficult to Compress)</div>
            {placedItems.hard.length === 0 ? (
              <div style={{ color: 'var(--lesson-danger-border)', margin: 'auto' }}>Awaiting hard materials...</div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {placedItems.hard.map(id => {
                  const item = items.find(i => i.id === id);
                  return <div key={id} style={{ fontSize: '2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{item.icon}</div>;
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completion Toast */}
      {allPlaced && (
         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--lesson-success-bg)', border: '1px solid var(--lesson-success-border)', padding: '1rem', borderRadius: '8px', color: '#A64B27', textAlign: 'center', fontWeight: 'bold' }}>
           <CheckCircle size={20} style={{ display: 'inline', marginBottom: '-4px', marginRight: '5px' }} />
           Excellent classification! We are ready for the advanced scratch test.
         </motion.div>
      )}
    </div>
  );
}
