import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, FlaskConical, RotateCcw, Droplet, RefreshCw, ArrowRight } from 'lucide-react';
import ThreeDFoodViewer from '../../FoodTesting/components/ThreeDFoodViewer';

const FOOD_ITEMS = [
  { id: 'bread', name: 'Bread', hasProtein: false, hasFat: false, baseColor: '#fed7aa' },
  { id: 'rice', name: 'Boiled Rice', hasProtein: false, hasFat: false, baseColor: 'var(--text-heading)' },
  { id: 'peanuts', name: 'Crushed Peanuts', hasProtein: true, hasFat: true, baseColor: '#d6d3d1' },
  { id: 'soya', name: 'Soya Bean', hasProtein: true, hasFat: false, baseColor: '#fde68a' },
  { id: 'peas', name: 'Peas', hasProtein: true, hasFat: false, baseColor: '#bbf7d0' },
];

export default function Stage1_Experiment({ onComplete }) {
  const [results, setResults] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  
  // Tube steps: 'empty' -> 'food' -> 'water' -> 'copper' -> 'soda' -> 'shaking' -> 'done'
  const [tubeStep, setTubeStep] = useState('empty');
  
  const handleSelectFood = (itemId) => {
    if (tubeStep !== 'empty' && tubeStep !== 'done') return;
    setActiveItem(itemId);
    setTubeStep('food');
  };

  const handleAction = (expectedAction) => {
    if (expectedAction === 'water' && tubeStep === 'food') {
      setTubeStep('water');
    } else if (expectedAction === 'copper' && tubeStep === 'water') {
      setTubeStep('copper');
    } else if (expectedAction === 'soda' && tubeStep === 'copper') {
      setTubeStep('soda');
    } else if (expectedAction === 'shake' && tubeStep === 'soda') {
      setTubeStep('shaking');
      setTimeout(() => {
        setTubeStep('done');
        setResults(prev => {
          const next = { ...prev, [activeItem]: true };
          return next;
        });
      }, 2000);
    }
  };

  const handleResetTube = () => {
    setActiveItem(null);
    setTubeStep('empty');
  };

  const handleResetAll = () => {
    setResults({});
    setActiveItem(null);
    setTubeStep('empty');
  };

  const activeFood = FOOD_ITEMS.find(f => f.id === activeItem);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem' }}>
      
      {/* Left Panel: Lab Area */}
      <div 
        className="glass-panel" 
        style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-heading)' }}>
              <FlaskConical size={20} style={{ color: '#06b6d4' }} /> Virtual Lab Bench
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-faint)' }}>
              1. Select a food item to crush and place in the test tube.<br/>
              2. Add Water, Copper Sulfate (2 drops), and Caustic Soda (10 drops).<br/>
              3. Shake and observe the color change.
            </p>
          </div>
          <button 
            onClick={handleResetAll}
            className="outline"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', gap: '0.35rem' }}
          >
            <RotateCcw size={14} /> Reset Lab
          </button>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flex: 1 }}>
          
          {/* Reagents & Test Tube Area */}
          <div style={{ 
            flex: 1, 
            background: 'var(--surface)', 
            borderRadius: '12px', 
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            border: '1px solid var(--border)'
          }}>
            {/* Toolbar for Chemicals */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
              <button 
                onClick={() => handleAction('water')}
                disabled={tubeStep !== 'food'}
                className="glass-panel"
                style={{
                  opacity: tubeStep === 'food' ? 1 : 0.4,
                  cursor: tubeStep === 'food' ? 'pointer' : 'not-allowed',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: tubeStep === 'food' ? '2px solid #60a5fa' : '2px solid var(--border)'
                }}
              >
                <Droplet size={24} style={{ color: '#60a5fa' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Add Water</span>
              </button>

              <button 
                onClick={() => handleAction('copper')}
                disabled={tubeStep !== 'water'}
                className="glass-panel"
                style={{
                  opacity: tubeStep === 'water' ? 1 : 0.4,
                  cursor: tubeStep === 'water' ? 'pointer' : 'not-allowed',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: tubeStep === 'water' ? '2px solid #3b82f6' : '2px solid var(--border)'
                }}
              >
                <Droplet size={24} style={{ color: '#3b82f6' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Copper Sulfate<br/>(2 drops)</span>
              </button>

              <button 
                onClick={() => handleAction('soda')}
                disabled={tubeStep !== 'copper'}
                className="glass-panel"
                style={{
                  opacity: tubeStep === 'copper' ? 1 : 0.4,
                  cursor: tubeStep === 'copper' ? 'pointer' : 'not-allowed',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: tubeStep === 'copper' ? '2px solid #f8fafc' : '2px solid var(--border)'
                }}
              >
                <Droplet size={24} style={{ color: 'var(--text-heading)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Caustic Soda<br/>(10 drops)</span>
              </button>
            </div>

            {/* Test Tube */}
            <div style={{ position: 'relative', width: '100px', height: '200px', display: 'flex', justifyContent: 'center' }}>
              <motion.div 
                animate={{
                  x: tubeStep === 'shaking' ? [0, -10, 10, -10, 10, 0] : 0,
                  rotate: tubeStep === 'shaking' ? [0, -5, 5, -5, 5, 0] : 0
                }}
                transition={{ duration: 0.5, repeat: tubeStep === 'shaking' ? 3 : 0 }}
                style={{
                  width: '60px',
                  height: '200px',
                  border: '4px solid rgba(255,255,255,0.3)',
                  borderTop: 'none',
                  borderBottomLeftRadius: '30px',
                  borderBottomRightRadius: '30px',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--border)',
                  boxShadow: 'inset 0 0 10px var(--border)'
                }}
              >
                {/* Food particles */}
                <AnimatePresence>
                  {tubeStep !== 'empty' && (
                    <motion.div 
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        right: '10px',
                        height: '20px',
                        background: activeFood?.baseColor || '#fff',
                        borderRadius: '10px',
                        opacity: tubeStep === 'done' ? 0.3 : 1
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Liquid Level */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ 
                    height: tubeStep === 'empty' || tubeStep === 'food' ? '0%' :
                            tubeStep === 'water' ? '40%' :
                            tubeStep === 'copper' ? '45%' :
                            tubeStep === 'soda' || tubeStep === 'shaking' || tubeStep === 'done' ? '60%' : '0%',
                    backgroundColor: tubeStep === 'done' && activeFood?.hasProtein ? 'rgba(139, 92, 246, 0.8)' : // Violet
                                     tubeStep === 'done' && !activeFood?.hasProtein ? 'rgba(96, 165, 250, 0.4)' : // Pale Blue
                                     tubeStep === 'copper' || tubeStep === 'soda' || tubeStep === 'shaking' ? 'rgba(59, 130, 246, 0.3)' : // Light blue (copper)
                                     tubeStep === 'water' ? 'var(--border)' : 'transparent'
                  }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderBottomLeftRadius: '26px',
                    borderBottomRightRadius: '26px',
                  }}
                />
              </motion.div>
            </div>

            {/* Shake Button / Reset Tube */}
            <div style={{ marginTop: '2rem', height: '40px' }}>
              {tubeStep === 'soda' && (
                <button 
                  onClick={() => handleAction('shake')}
                  className="primary"
                  style={{ gap: '0.5rem' }}
                >
                  <RefreshCw size={16} /> Shake Well
                </button>
              )}
              {tubeStep === 'done' && (
                <button 
                  onClick={handleResetTube}
                  className="outline"
                  style={{ gap: '0.5rem', borderColor: 'var(--accent)', color: 'var(--accent-text)' }}
                >
                  <RotateCcw size={16} /> Empty & Clean Tube
                </button>
              )}
            </div>
          </div>

          {/* Food Selection Grid */}
          <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-faint)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Select Food to Test</h4>
            {FOOD_ITEMS.map(item => {
              const isTested = results[item.id];
              const isActive = activeItem === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectFood(item.id)}
                  disabled={tubeStep !== 'empty' && tubeStep !== 'done'}
                  style={{
                    background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'var(--surface)',
                    border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    color: 'var(--text-heading)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: (tubeStep !== 'empty' && tubeStep !== 'done') ? 'not-allowed' : 'pointer',
                    opacity: (tubeStep !== 'empty' && tubeStep !== 'done' && !isActive) ? 0.4 : 1,
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '32px', height: '32px', pointerEvents: 'none', position: 'relative', zIndex: 10 }}>
                      <ThreeDFoodViewer foodId={item.id} />
                    </div>
                    <span style={{ fontSize: '0.85rem' }}>{item.name}</span>
                  </div>
                  {isTested && <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />}
                </button>
              )
            })}
          </div>
        </div>

      </div>

      {/* Right Panel: Observation Table */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-heading)' }}>Observation Table 3.3</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '0.5rem', borderBottom: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-faint)', fontWeight: 'bold' }}>
            <span>Food Item</span>
            <span>Turns Violet?</span>
          </div>

          {FOOD_ITEMS.map((item) => {
            const isTested = results[item.id];
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
                  opacity: isTested ? 1 : 0.7
                }}
              >
                <span style={{ color: 'var(--text-heading)' }}>{item.name}</span>
                <span style={{ 
                  color: isTested ? (item.hasProtein ? '#8b5cf6' : 'var(--text-faint)') : 'var(--text-muted)',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'center',
                  width: '60px'
                }}>
                  {isTested ? (item.hasProtein ? 'Yes' : 'No') : '-'}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <CheckCircle2 size={16} style={{ color: '#a78bfa' }} />
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#a78bfa' }}>Conclusion</h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-faint)', lineHeight: '1.5' }}>
            A violet color indicates the presence of proteins. Notice that Peanuts contain both fats (from the previous activity) and proteins! Foods often contain multiple nutrients.
          </p>
        </div>

        {Object.keys(results).length === FOOD_ITEMS.length && (
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
