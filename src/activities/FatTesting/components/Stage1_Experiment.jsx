import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, FlaskConical, RotateCcw, FileText, Sun, ArrowRight } from 'lucide-react';
import ThreeDFoodViewer from '../../FoodTesting/components/ThreeDFoodViewer';

const FOOD_ITEMS = [
  { id: 'potato', name: 'Slice of Potato', hasFat: false, hasWater: true, baseColor: '#fef08a' },
  { id: 'cucumber', name: 'Cucumber', hasFat: false, hasWater: true, baseColor: '#bbf7d0' },
  { id: 'bread', name: 'Bread', hasFat: false, hasWater: false, baseColor: '#fed7aa' },
  { id: 'rice', name: 'Boiled Rice', hasFat: false, hasWater: true, baseColor: 'var(--text-heading)' },
  { id: 'gram', name: 'Boiled Gram', hasFat: false, hasWater: true, baseColor: '#fcd34d' },
  { id: 'peanuts', name: 'Crushed Peanuts', hasFat: true, hasWater: false, baseColor: '#d6d3d1' },
  { id: 'oil', name: 'Oil', hasFat: true, hasWater: false, baseColor: '#fef08a' },
  { id: 'butter', name: 'Butter', hasFat: true, hasWater: false, baseColor: '#fef3c7' },
  { id: 'coconut', name: 'Crushed Coconut', hasFat: true, hasWater: true, baseColor: 'var(--neutral-bg)' },
];

export default function Stage1_Experiment({ onComplete }) {
  const [testedItems, setTestedItems] = useState({});
  const [selectedTool, setSelectedTool] = useState(null); // 'paper' or null
  const [lightOn, setLightOn] = useState(false);
  const [animatingId, setAnimatingId] = useState(null);

  const handleTestItem = (itemId) => {
    if (selectedTool !== 'paper' || testedItems[itemId] || animatingId) return;
    
    setAnimatingId(itemId);
    
    // Simulate pressing the paper, waiting for 1.5s
    setTimeout(() => {
      setTestedItems(prev => {
        const next = { ...prev, [itemId]: lightOn ? 'light_tested' : 'paper' };
        return next;
      });
      setAnimatingId(null);
    }, 1500);
  };

  const toggleLight = () => {
    const newLightOn = !lightOn;
    setLightOn(newLightOn);
    if (newLightOn) {
      setTestedItems(prev => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(k => {
          if (next[k] === 'paper') {
            next[k] = 'light_tested';
            changed = true;
          }
        });
        
        if (changed) {
           // State changed
        }
        return changed ? next : prev;
      });
    }
  };

  const handleReset = () => {
    setTestedItems({});
    setSelectedTool(null);
    setLightOn(false);
    setAnimatingId(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem' }}>
      
      {/* Left Panel: Lab Area */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '1.5rem', 
          display: 'flex', 
          flexDirection: 'column',
          background: lightOn ? '#0f172a' : 'var(--card-bg)',
          transition: 'background 0.5s ease',
          border: lightOn ? '1px solid #eab308' : '1px solid var(--border)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: lightOn ? '#fef08a' : 'var(--text-heading)' }}>
              <FlaskConical size={20} style={{ color: lightOn ? '#eab308' : '#06b6d4' }} /> Virtual Lab Bench
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: lightOn ? '#94a3b8' : 'var(--text-faint)' }}>
              1. Select a piece of paper.<br/>
              2. Click on food to wrap and press it.<br/>
              3. Hold against light to check for a translucent oily patch.
            </p>
          </div>
          <button 
            onClick={handleReset}
            className="outline"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', gap: '0.35rem', borderColor: lightOn ? 'rgba(234,179,8,0.3)' : 'var(--border)' }}
          >
            <RotateCcw size={14} /> Reset Activity
          </button>
        </div>

        {/* Toolbar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '1.5rem',
          padding: '1rem',
          background: lightOn ? 'rgba(234,179,8,0.1)' : 'var(--surface)',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: lightOn ? '1px solid rgba(234,179,8,0.2)' : '1px solid var(--border)'
        }}>
          <button 
            onClick={() => setSelectedTool(selectedTool === 'paper' ? null : 'paper')}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.5rem',
              background: selectedTool === 'paper' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              border: `2px solid ${selectedTool === 'paper' ? 'var(--accent)' : 'var(--border)'}`,
              padding: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              color: lightOn ? '#f8fafc' : 'var(--text-heading)',
              transition: 'all 0.2s',
              width: '140px'
            }}
          >
            <FileText size={32} style={{ color: selectedTool === 'paper' ? 'var(--accent-text)' : 'var(--text-faint)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Piece of Paper</span>
          </button>

          <button 
            onClick={toggleLight}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.5rem',
              background: lightOn ? 'rgba(234, 179, 8, 0.2)' : 'transparent',
              border: `2px solid ${lightOn ? '#eab308' : 'var(--border)'}`,
              padding: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              color: lightOn ? '#f8fafc' : 'var(--text-heading)',
              transition: 'all 0.2s',
              width: '140px'
            }}
          >
            <Sun size={32} style={{ color: lightOn ? '#fef08a' : 'var(--text-faint)' }} fill={lightOn ? '#fef08a' : 'none'} />
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Hold against Light</span>
          </button>
        </div>

        {/* Food Items Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          flex: 1
        }}>
          {FOOD_ITEMS.map((item) => {
            const isTested = testedItems[item.id] === 'paper' || testedItems[item.id] === 'light_tested';
            const isFullyTested = testedItems[item.id] === 'light_tested';
            const isAnimating = animatingId === item.id;
            
            // Interaction states
            const showPaper = isTested || isAnimating;
            const hasPatch = isTested && item.hasFat;
            
            let paperBackground = 'var(--card-bg)';
            let paperOpacity = 1;
            let patchStyle = {};

            if (isTested) {
              if (item.hasFat) {
                if (lightOn) {
                  // Fat patch under light: glowing, translucent
                  patchStyle = {
                    background: 'radial-gradient(circle, rgba(254,240,138,0.9) 0%, rgba(254,240,138,0.2) 60%, transparent 100%)',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    boxShadow: '0 0 15px #fef08a'
                  };
                } else {
                  // Fat patch normal: oily, slightly dark
                  patchStyle = {
                    background: 'radial-gradient(circle, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                  };
                }
              } else if (item.hasWater) {
                // Water patch dries up (we simulate it's dried, so no patch visible or very faint)
                patchStyle = {
                  background: 'none'
                };
              }
            }

            return (
              <motion.div
                key={item.id}
                onClick={() => handleTestItem(item.id)}
                whileHover={{ scale: selectedTool === 'paper' && !isTested && !animatingId ? 1.05 : 1 }}
                style={{
                  background: lightOn ? '#1e293b' : 'var(--surface)',
                  border: `2px solid ${isFullyTested ? (item.hasFat ? '#eab308' : 'var(--border)') : 'var(--border)'}`,
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: selectedTool === 'paper' && !isTested && !animatingId ? 'pointer' : 'default',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Visual Area */}
                <div style={{
                  width: '70px',
                  height: '70px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {/* Food item (hidden when covered by paper, except during animation) */}
                  <motion.div 
                    animate={{ opacity: showPaper && !isAnimating ? 0 : 1 }}
                    style={{
                      width: '80px',
                      height: '80px',
                      position: 'absolute',
                      pointerEvents: 'none',
                      zIndex: 10
                    }}
                  >
                    <ThreeDFoodViewer foodId={item.id} />
                  </motion.div>

                  {/* Paper wrapper */}
                  <AnimatePresence>
                    {showPaper && (
                      <motion.div
                        initial={{ y: -50, opacity: 0, scale: 0.5 }}
                        animate={{ 
                          y: 0, 
                          opacity: lightOn && !hasPatch ? 0.3 : 1, 
                          scale: isAnimating ? [1, 0.8, 1.1, 1] : 1,
                          rotate: isAnimating ? [0, 5, -5, 0] : 0
                        }}
                        transition={{ duration: isAnimating ? 1.5 : 0.3 }}
                        style={{
                          width: '70px',
                          height: '70px',
                          background: paperBackground,
                          borderRadius: '4px',
                          position: 'absolute',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}
                      >
                        {/* The Oily Patch */}
                        {isTested && <div style={patchStyle} />}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: lightOn ? '#94a3b8' : 'var(--text-heading)', fontWeight: '500' }}>{item.name}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Right Panel: Observation Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-heading)' }}>Observation Table 3.3</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Table Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '0.5rem', borderBottom: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-faint)', fontWeight: 'bold' }}>
            <span>Food Item</span>
            <span>Oily Patch?</span>
          </div>

          {/* Table Rows */}
          {FOOD_ITEMS.map((item) => {
            const isFullyTested = testedItems[item.id] === 'light_tested';
            return (
              <div 
                key={item.id} 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr auto', 
                  padding: '0.5rem', 
                  background: 'var(--surface)',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  alignItems: 'center',
                  opacity: isFullyTested ? 1 : 0.7
                }}
              >
                <span style={{ color: 'var(--text-heading)' }}>{item.name}</span>
                <span style={{ 
                  color: isFullyTested ? (item.hasFat ? '#eab308' : '#fb7185') : 'var(--text-muted)',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'center',
                  width: '60px'
                }}>
                  {isFullyTested ? (item.hasFat ? 'Yes' : 'No') : '-'}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--success)' }}>Conclusion</h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-faint)', lineHeight: '1.5' }}>
            An oily patch on paper that lets light faintly pass through confirms the presence of fat. Peanuts, oil, butter, and crushed coconut contain fats.
          </p>
        </div>

        {Object.values(testedItems).filter(v => v === 'light_tested').length === FOOD_ITEMS.length && (
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="primary" 
              onClick={onComplete} 
              style={{ width: '100%', fontSize: '1rem', padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              Next Stage <ArrowRight size={18} />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
