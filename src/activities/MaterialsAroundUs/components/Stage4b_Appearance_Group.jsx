import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Stage4b_Appearance_Group({ onComplete, addXp }) {
  const [items, setItems] = useState([
    { id: 'paper', name: 'Paper Sheet', correct: 'dull', color: '#f8fafc' },
    { id: 'wood', name: 'Wooden Block', correct: 'dull', color: '#8b5a2b' },
    { id: 'copper', name: 'Copper Wire', correct: 'shiny', color: '#b87333' },
    { id: 'iron', name: 'Iron Rod', correct: 'shiny', color: '#71717a' },
    { id: 'rubber', name: 'Rubber Band', correct: 'dull', color: '#fbbf24' },
    { id: 'steel', name: 'Steel Spoon', correct: 'shiny', color: '#e2e8f0' },
    { id: 'gold', name: 'Gold Coin', correct: 'shiny', color: '#fbbf24' },
    { id: 'jute', name: 'Jute Bag', correct: 'dull', color: '#d4b483' }
  ]);

  const [placed, setPlaced] = useState({ shiny: [], dull: [] });
  const [draggingItem, setDraggingItem] = useState(null);

  const handleDragStart = (e, item) => {
    setDraggingItem(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    if (!draggingItem) return;

    if (draggingItem.correct === category) {
      setPlaced(prev => ({
        ...prev,
        [category]: [...prev[category], draggingItem]
      }));
      setItems(prev => prev.filter(i => i.id !== draggingItem.id));
      addXp(10);
    } else {
      // Small penalty or visual shake could go here
    }
    setDraggingItem(null);
  };

  const handleClickToPlace = (item, category) => {
    if (item.correct === category) {
      setPlaced(prev => ({
        ...prev,
        [category]: [...prev[category], item]
      }));
      setItems(prev => prev.filter(i => i.id !== item.id));
      addXp(10);
    }
  };

  useEffect(() => {
    if (items.length === 0) {
      setTimeout(() => onComplete(), 1500);
    }
  }, [items, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={22} style={{ color: 'var(--accent)' }} /> Group by Appearance
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Excellent observations! Can you separate these materials based on their surface appearance? Drag each item (or click) to the correct group.
        </p>
      </div>

      {items.length > 0 ? (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', minHeight: '100px' }}>
          <AnimatePresence>
            {items.map(item => (
              <motion.div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                style={{
                  padding: '0.5rem 1rem', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '20px',
                  display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'grab', fontWeight: '500'
                }}
              >
                <div style={{ width: '16px', height: '16px', background: item.color, borderRadius: '50%' }} />
                {item.name}
                <div style={{ display: 'flex', gap: '0.25rem', marginLeft: '0.5rem' }}>
                  <button onClick={() => handleClickToPlace(item, 'shiny')} style={{ background: 'rgba(251, 191, 36, 0.2)', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>Shiny</button>
                  <button onClick={() => handleClickToPlace(item, 'dull')} style={{ background: 'rgba(148, 163, 184, 0.2)', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>Dull</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', color: 'var(--success)', padding: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
          <CheckCircle size={24} style={{ display: 'inline', marginBottom: '-5px', marginRight: '5px' }} /> All items sorted!
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Shiny Group */}
        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'shiny')}
          className="glass-panel" 
          style={{ minHeight: '300px', border: '2px dashed #fbbf24', background: 'rgba(251, 191, 36, 0.05)' }}
        >
          <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#f59e0b', textAlign: 'center', borderBottom: '1px solid rgba(251, 191, 36, 0.3)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            ✨ Shiny Surface
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignContent: 'flex-start' }}>
            {placed.shiny.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '0.5rem 1rem', background: 'var(--surface)', borderRadius: '20px', border: '1px solid rgba(251, 191, 36, 0.3)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', background: item.color, borderRadius: '50%' }} /> {item.name}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dull Group */}
        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'dull')}
          className="glass-panel" 
          style={{ minHeight: '300px', border: '2px dashed #94a3b8', background: 'rgba(148, 163, 184, 0.05)' }}
        >
          <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#94a3b8', textAlign: 'center', borderBottom: '1px solid rgba(148, 163, 184, 0.3)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            🪨 Dull Surface
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignContent: 'flex-start' }}>
            {placed.dull.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '0.5rem 1rem', background: 'var(--surface)', borderRadius: '20px', border: '1px solid rgba(148, 163, 184, 0.3)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', background: item.color, borderRadius: '50%' }} /> {item.name}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
