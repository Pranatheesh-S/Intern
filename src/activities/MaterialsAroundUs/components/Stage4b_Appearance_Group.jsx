import React, { useState, useEffect } from 'react';
import { Lightbulb, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Stage4b_Appearance_Group({ onComplete, addXp }) {
  const [items, setItems] = useState([
    { id: 'paper', name: 'Paper Sheet', correct: 'dull', icon: '📄', reason: 'Paper has a rough, porous surface that scatters light instead of reflecting it, making it appear dull (non-lustrous).' },
    { id: 'wood', name: 'Wooden Block', correct: 'dull', icon: '📦', reason: 'Wood is a non-metal with a non-reflective surface, so it appears dull rather than shiny.' },
    { id: 'copper', name: 'Copper Wire', correct: 'shiny', icon: '🪢', reason: 'Copper is a metal. Clean metals have a lustrous (shiny) appearance that reflects light well.' },
    { id: 'iron', name: 'Iron Rod', correct: 'shiny', icon: '🔩', reason: 'Iron is a metal. When its surface is clean and not rusted, it has a natural metallic shine or lustre.' },
    { id: 'rubber', name: 'Rubber Band', correct: 'dull', icon: '⭕', reason: 'Rubber is a non-metal material that absorbs and scatters light, giving it a dull, non-lustrous appearance.' },
    { id: 'steel', name: 'Steel Spoon', correct: 'shiny', icon: '🥄', reason: 'Steel is a metal alloy with a highly reflective, smooth surface, giving it a bright lustre.' },
    { id: 'gold', name: 'Gold Coin', correct: 'shiny', icon: '🪙', reason: 'Gold is a metal famous for its bright, lustrous shine that reflects light brilliantly.' },
    { id: 'jute', name: 'Jute Bag', correct: 'dull', icon: '🛍️', reason: 'Jute is a rough plant fibre. It does not reflect light uniformly, making it look dull.' },
    { id: 'plastic', name: 'Plastic Ruler', correct: 'dull', icon: '📏', reason: 'Most common plastics like this ruler do not have a natural metallic lustre and appear relatively dull.' },
    { id: 'glass', name: 'Glass Marble', correct: 'shiny', icon: '🟢', reason: 'Glass has a very smooth surface that reflects light brightly, giving it a shiny appearance.' }
  ]);

  const [placed, setPlaced] = useState({ shiny: [], dull: [] });
  const [observedItem, setObservedItem] = useState(null);
  const [draggingItem, setDraggingItem] = useState(null);
  const [lampOn, setLampOn] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleDragStart = (e, item) => {
    setDraggingItem(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    if (!draggingItem) return;

    if (category === 'observe') {
      setObservedItem(draggingItem);
      // Remove from lists if it was placed
      setPlaced(prev => ({
        shiny: prev.shiny.filter(i => i.id !== draggingItem.id),
        dull: prev.dull.filter(i => i.id !== draggingItem.id)
      }));
      if (!items.find(i => i.id === draggingItem.id)) {
        setItems(prev => [...prev, draggingItem]);
      }
      setDraggingItem(null);
      return;
    }

    if (draggingItem.correct === category) {
      // Remove from tray or observation
      setItems(prev => prev.filter(i => i.id !== draggingItem.id));
      if (observedItem && observedItem.id === draggingItem.id) {
        setObservedItem(null);
      }
      
      setPlaced(prev => ({
        ...prev,
        [category]: [...prev[category], draggingItem]
      }));
      setFeedback(null);
      addXp(10);
    } else {
      setFeedback({ 
        message: `Incorrect! ${draggingItem.reason}`,
        type: 'error'
      });
      setTimeout(() => setFeedback(null), 5000);
    }
    setDraggingItem(null);
  };

  useEffect(() => {
    if (items.length === 0 && !observedItem) {
      setTimeout(() => onComplete(), 1500);
    }
  }, [items, observedItem, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: '100%', background: '#f8fafc', padding: '1.5rem', borderRadius: '16px' }}>
      
      {/* Header & Lamp toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📌 Material Tray
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
            Drag each material to the correct group
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => setLampOn(!lampOn)}
            style={{ 
              background: lampOn ? '#fbbf24' : '#818cf8', 
              color: 'white', border: 'none', padding: '0.5rem 1rem', 
              borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
              fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <Lightbulb size={18} /> Lamp {lampOn ? 'ON' : 'OFF'}
          </button>
          <div style={{ fontSize: '2.5rem', filter: lampOn ? 'drop-shadow(0 0 10px #fbbf24)' : 'none', transition: 'all 0.3s' }}>
            🛋️
          </div>
        </div>
      </div>

      {/* Material Tray */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem', minHeight: '180px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
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
                  padding: '1rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'grab',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ fontSize: '2.5rem', filter: (lampOn && item.correct === 'shiny') ? 'drop-shadow(0 0 12px #fef08a)' : 'none' }}>
                  {item.icon}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '500', textAlign: 'center' }}>
                  {item.name}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Drop Zones */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flex: 1, minHeight: 0 }}>
        {/* Shiny */}
        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'shiny')}
          style={{ 
            border: '2px dashed #fde047', background: '#fefce8', borderRadius: '16px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem',
            position: 'relative', overflowY: 'auto'
          }}
        >
          <div style={{ color: '#ca8a04', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            ✨ Shiny (Reflects Light)
          </div>
          <div style={{ color: '#ca8a04', opacity: 0.7, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Drop items here
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {placed.shiny.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '0.5rem', background: 'white', borderRadius: '12px', border: '1px solid #fef08a', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', width: '80px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                <div style={{ fontSize: '0.7rem', color: '#ca8a04', textAlign: 'center', lineHeight: '1.2' }}>{item.name}</div>
              </motion.div>
            ))}
          </div>
          {placed.shiny.length === 0 && (
            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', opacity: 0.1, fontSize: '4rem', pointerEvents: 'none' }}>✨</div>
          )}
        </div>

        {/* Dull */}
        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'dull')}
          style={{ 
            border: '2px dashed #94a3b8', background: '#f8fafc', borderRadius: '16px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem',
            position: 'relative', overflowY: 'auto'
          }}
        >
          <div style={{ color: '#475569', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            🪨 Dull (Does not Reflect much)
          </div>
          <div style={{ color: '#64748b', opacity: 0.7, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Drop items here
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {placed.dull.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '0.5rem', background: 'white', borderRadius: '12px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', width: '80px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                <div style={{ fontSize: '0.7rem', color: '#475569', textAlign: 'center', lineHeight: '1.2' }}>{item.name}</div>
              </motion.div>
            ))}
          </div>
          {placed.dull.length === 0 && (
            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', opacity: 0.05, fontSize: '4rem', pointerEvents: 'none' }}>🪨</div>
          )}
        </div>
      </div>

      {/* Observation Area */}
      <div 
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'observe')}
        style={{ 
          background: 'white', borderRadius: '12px', border: '1px solid #c7d2fe', padding: '1rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}
      >
        <div>
          <h4 style={{ margin: '0 0 0.25rem 0', color: '#4338ca', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🔍 Observation Area
          </h4>
          <p style={{ margin: 0, color: '#6366f1', fontSize: '0.9rem' }}>
            Place any item under the lamp to observe how it looks.
          </p>
        </div>
        <div style={{ 
          border: '2px dashed #a5b4fc', borderRadius: '12px', padding: '0.5rem 1rem', 
          background: '#eef2ff', display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '200px', justifyContent: 'center'
        }}>
          {observedItem ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2.5rem', filter: (lampOn && observedItem.correct === 'shiny') ? 'drop-shadow(0 0 15px #fde047)' : 'none' }}>
                {observedItem.icon}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold', color: '#4338ca' }}>{observedItem.name}</span>
                {lampOn && (
                  <span style={{ fontSize: '0.8rem', color: observedItem.correct === 'shiny' ? '#ca8a04' : '#64748b' }}>
                    {observedItem.correct === 'shiny' ? '✨ It reflects light!' : '🪨 It does not reflect light.'}
                  </span>
                )}
              </div>
            </motion.div>
          ) : (
            <>
              <div style={{ background: 'white', padding: '0.5rem', borderRadius: '50%', color: '#818cf8', display: 'flex' }}>
                <MousePointer2 size={20} />
              </div>
              <span style={{ color: '#6366f1', fontSize: '0.9rem' }}>Drag an item here<br/>to observe</span>
            </>
          )}
        </div>
      </div>

      {/* Feedback Toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{ 
              position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
              background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', padding: '1rem 1.5rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 25px rgba(220, 38, 38, 0.2)',
              zIndex: 50, color: '#991b1b', maxWidth: '600px'
            }}
          >
            <div style={{ fontSize: '1.5rem' }}>❌</div>
            <div style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>
              <strong>Scientific Fact:</strong> {feedback.message.replace('Incorrect! ', '')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
