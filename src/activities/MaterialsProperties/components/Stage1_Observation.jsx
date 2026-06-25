import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, CheckCircle, ArrowRight, ShieldAlert, Sparkles, Hand, Box } from 'lucide-react';

const ITEMS = [
  { id: 'copper', name: 'Piece of copper', color: '#b87333', defaultLustre: 'lustrous', defaultHardness: 'hard', img: 'copper', isShiny: true },
  { id: 'aluminium', name: 'Piece of aluminium', color: '#a6a9b6', defaultLustre: 'lustrous', defaultHardness: 'hard', img: 'aluminium', isShiny: true },
  { id: 'iron_nail', name: 'Iron nail', color: '#5b5b5b', defaultLustre: 'lustrous', defaultHardness: 'hard', img: 'iron_nail', isShiny: true },
  { id: 'coal', name: 'Piece of coal', color: '#2d2d2d', defaultLustre: 'non-lustrous', defaultHardness: 'hard', img: 'coal', isShiny: false },
  { id: 'sulfur', name: 'Lump of sulfur', color: '#e8d82a', defaultLustre: 'non-lustrous', defaultHardness: 'soft', img: 'sulfur', isShiny: false },
  { id: 'wood', name: 'Block of wood', color: '#8b5a2b', defaultLustre: 'non-lustrous', defaultHardness: 'hard', img: 'wood', isShiny: false }
];

export default function Stage1_Observation({ onComplete }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [observations, setObservations] = useState({});

  const handleObservation = (itemId, type, value) => {
    setObservations(prev => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        [type]: value
      }
    }));
  };

  const isItemComplete = (itemId) => {
    const obs = observations[itemId];
    return obs && obs.lustre && obs.hardness;
  };

  const allComplete = ITEMS.every(item => isItemComplete(item.id));

  const handleComplete = () => {
    if (allComplete) {
      onComplete(observations);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
          <Eye style={{ color: 'var(--accent-text)' }} />
          Observe Appearance and Hardness
        </h3>
        <p style={{ color: 'var(--text-faint)', margin: 0 }}>
          Select each material below. Observe its appearance (is it shiny?) and its hardness. Record your observations to unlock the next stage.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Left Side: Item Selection */}
        <div style={{ flex: '1 1 300px' }}>
          <h4 style={{ color: 'var(--border)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Box size={18} /> Materials
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item.id)}
                className={`glass-panel ${selectedItem === item.id ? 'active' : ''}`}
                style={{
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: selectedItem === item.id ? '2px solid #6366f1' : '1px solid var(--border)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: item.color,
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {item.isShiny && (
                    <motion.div
                      initial={{ x: '-150%' }}
                      animate={{ x: '150%' }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 1 }}
                      style={{ position: 'absolute', top: 0, left: '-50%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)', transform: 'skewX(-20deg)' }}
                    />
                  )}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-heading)', textAlign: 'center' }}>{item.name}</span>
                {isItemComplete(item.id) && (
                  <CheckCircle size={16} style={{ color: 'var(--success)', position: 'absolute', top: '0.5rem', right: '0.5rem' }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Observation Area */}
        <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ color: 'var(--border)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={18} /> Observation Panel
          </h4>
          
          {selectedItem ? (() => {
            const item = ITEMS.find(i => i.id === selectedItem);
            const obs = observations[selectedItem] || {};
            
            return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel" 
                style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--surface)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    background: item.color,
                    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5), 0 4px 6px var(--border)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {item.isShiny && (
                      <motion.div
                        initial={{ x: '-150%' }}
                        animate={{ x: '150%' }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 1 }}
                        style={{ position: 'absolute', top: 0, left: '-50%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)', transform: 'skewX(-20deg)' }}
                      />
                    )}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: '#fff', fontSize: '1.25rem' }}>{item.name}</h3>
                    <p style={{ margin: 0, color: 'var(--text-faint)', fontSize: '0.85rem' }}>Examine carefully.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Appearance Selection */}
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-faint)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <Sparkles size={14} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} /> 
                      Appearance
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleObservation(item.id, 'lustre', 'lustrous')}
                        className={`tab-btn ${obs.lustre === 'lustrous' ? 'active' : ''}`}
                        style={{ flex: 1, padding: '0.75rem', background: obs.lustre === 'lustrous' ? 'rgba(99, 102, 241, 0.2)' : 'var(--border)', border: obs.lustre === 'lustrous' ? '1px solid #6366f1' : '1px solid transparent' }}
                      >
                        Lustrous (Shiny)
                      </button>
                      <button
                        onClick={() => handleObservation(item.id, 'lustre', 'non-lustrous')}
                        className={`tab-btn ${obs.lustre === 'non-lustrous' ? 'active' : ''}`}
                        style={{ flex: 1, padding: '0.75rem', background: obs.lustre === 'non-lustrous' ? 'rgba(99, 102, 241, 0.2)' : 'var(--border)', border: obs.lustre === 'non-lustrous' ? '1px solid #6366f1' : '1px solid transparent' }}
                      >
                        Non-lustrous (Dull)
                      </button>
                    </div>
                  </div>

                  {/* Hardness Selection */}
                  <div>
                    <label style={{ display: 'block', color: 'var(--text-faint)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <Hand size={14} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} /> 
                      Hardness
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleObservation(item.id, 'hardness', 'hard')}
                        className={`tab-btn ${obs.hardness === 'hard' ? 'active' : ''}`}
                        style={{ flex: '1 1 30%', padding: '0.75rem', background: obs.hardness === 'hard' ? 'rgba(99, 102, 241, 0.2)' : 'var(--border)', border: obs.hardness === 'hard' ? '1px solid #6366f1' : '1px solid transparent' }}
                      >
                        Hard
                      </button>
                      <button
                        onClick={() => handleObservation(item.id, 'hardness', 'soft')}
                        className={`tab-btn ${obs.hardness === 'soft' ? 'active' : ''}`}
                        style={{ flex: '1 1 30%', padding: '0.75rem', background: obs.hardness === 'soft' ? 'rgba(99, 102, 241, 0.2)' : 'var(--border)', border: obs.hardness === 'soft' ? '1px solid #6366f1' : '1px solid transparent' }}
                      >
                        Soft
                      </button>
                      <button
                        onClick={() => handleObservation(item.id, 'hardness', 'soft_brittle')}
                        className={`tab-btn ${obs.hardness === 'soft_brittle' ? 'active' : ''}`}
                        style={{ flex: '1 1 30%', padding: '0.75rem', background: obs.hardness === 'soft_brittle' ? 'rgba(99, 102, 241, 0.2)' : 'var(--border)', border: obs.hardness === 'soft_brittle' ? '1px solid #6366f1' : '1px solid transparent' }}
                      >
                        Soft & Brittle
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })() : (
            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: 'var(--surface)', opacity: 0.7 }}>
              <ShieldAlert size={48} style={{ color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text-faint)', margin: 0 }}>Select a material from the left to observe it.</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
        <button
          onClick={handleComplete}
          disabled={!allComplete}
          className="primary"
          style={{ padding: '0.75rem 2rem', fontSize: '1rem', opacity: allComplete ? 1 : 0.5, cursor: allComplete ? 'pointer' : 'not-allowed' }}
        >
          {allComplete ? 'Continue to Hammer Test' : 'Record all observations to continue'} <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
        </button>
      </div>
    </div>
  );
}
