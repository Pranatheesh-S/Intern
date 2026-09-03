import React, { useState, useEffect } from 'react';
import { Lightbulb, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomIcons = {
  copper: (
    <svg width="40" height="40" viewBox="0 0 40 40">
      <path d="M5 20 Q10 5, 20 20 T35 20" fill="none" stroke="var(--lesson-accent)" strokeWidth="5" strokeLinecap="round" />
      <path d="M5 25 Q10 10, 20 25 T35 25" fill="none" stroke="var(--lesson-accent)" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
    </svg>
  ),
  iron: (
    <svg width="40" height="40" viewBox="0 0 40 40">
      <rect x="5" y="16" width="30" height="8" rx="2" fill="var(--lesson-muted)" />
      <rect x="5" y="16" width="30" height="3" fill="var(--lesson-muted)" opacity="0.8" />
      <rect x="3" y="14" width="4" height="12" rx="1" fill="var(--lesson-secondary)" />
    </svg>
  ),
  glass: (
    <svg width="60" height="60" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="14" fill="#cffafe" opacity="0.8" stroke="var(--lesson-accent)" strokeWidth="2" />
      <path d="M 12 15 A 8 8 0 0 1 18 10" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
    </svg>
  ),
  steel: (
    <svg width="60" height="60" viewBox="0 0 40 40">
      <path d="M12 28 C10 32, 4 36, 4 36 C4 36, 8 30, 12 28 Z" fill="var(--lesson-muted)" />
      <ellipse cx="22" cy="18" rx="8" ry="12" fill="var(--lesson-border)" transform="rotate(45 22 18)" />
      <ellipse cx="21" cy="17" rx="4" ry="8" fill="white" opacity="0.8" transform="rotate(45 21 17)" />
    </svg>
  ),
  paper: (
    <svg width="60" height="60" viewBox="0 0 40 40">
      <rect x="10" y="4" width="20" height="32" fill="var(--lesson-surface)" stroke="var(--lesson-border)" strokeWidth="2" rx="1" />
      <path d="M14 12 H26 M14 18 H26 M14 24 H26 M14 30 H20" stroke="var(--lesson-muted)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  wood: (
    <svg width="40" height="40" viewBox="0 0 40 40">
      <rect x="8" y="10" width="24" height="20" fill="var(--lesson-primary)" rx="2" />
      <path d="M 10 10 V 30 M 16 10 V 30 M 22 10 V 30 M 28 10 V 30" stroke="#7c2d12" strokeWidth="1" />
      <path d="M 10 15 Q 16 12 20 18 T 30 18" fill="none" stroke="#7c2d12" strokeWidth="2" opacity="0.5" />
    </svg>
  ),
  rubber: (
    <svg width="60" height="60" viewBox="0 0 40 40">
      <ellipse cx="20" cy="20" rx="14" ry="8" fill="none" stroke="var(--lesson-accent)" strokeWidth="4" transform="rotate(-15 20 20)" />
      <ellipse cx="20" cy="20" rx="14" ry="8" fill="none" stroke="var(--lesson-warning)" strokeWidth="2" transform="rotate(-15 20 20)" opacity="0.8" />
    </svg>
  ),
  gold: (
    <svg width="60" height="60" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="14" fill="#facc15" stroke="var(--lesson-warning)" strokeWidth="2" />
      <circle cx="20" cy="20" r="10" fill="none" stroke="#fef08a" strokeWidth="2" strokeDasharray="3 2" />
      <text x="20" y="24" fontSize="12" fill="var(--lesson-secondary)" textAnchor="middle" fontWeight="bold">₹</text>
    </svg>
  ),
  jute: (
    <svg width="40" height="40" viewBox="0 0 40 40">
      <path d="M 12 15 Q 10 32 20 32 Q 30 32 28 15 Z" fill="#d4a373" stroke="#bc6c25" strokeWidth="2" />
      <path d="M 12 15 C 16 10, 24 10, 28 15" fill="#e9edc9" stroke="#bc6c25" strokeWidth="2" />
      <rect x="16" y="13" width="8" height="4" fill="#faedcd" stroke="#bc6c25" strokeWidth="1" />
      <path d="M 14 20 L 26 20 M 14 25 L 26 25" stroke="#bc6c25" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
    </svg>
  ),
  plastic: (
    <svg width="60" height="60" viewBox="0 0 40 40">
      <rect x="6" y="16" width="28" height="8" fill="var(--lesson-warning-border)" rx="1" stroke="#ca8a04" strokeWidth="1" />
      <path d="M 8 16 V 20 M 12 16 V 18 M 16 16 V 20 M 20 16 V 18 M 24 16 V 20 M 28 16 V 18 M 32 16 V 20" stroke="var(--lesson-secondary)" strokeWidth="1" />
    </svg>
  )
};

export default function Stage4b_Appearance_Group({ onComplete, addXp }) {
  const [items, setItems] = useState([
    { id: 'paper', name: 'Paper Sheet', correct: 'dull', icon: CustomIcons.paper, reason: 'Paper has a rough, porous surface that scatters light instead of reflecting it, making it appear dull (non-lustrous).' },
    { id: 'rubber', name: 'Rubber Band', correct: 'dull', icon: CustomIcons.rubber, reason: 'Rubber is a non-metal material that absorbs and scatters light, giving it a dull, non-lustrous appearance.' },
    { id: 'steel', name: 'Steel Spoon', correct: 'shiny', icon: CustomIcons.steel, reason: 'Steel is a metal alloy with a highly reflective, smooth surface, giving it a bright lustre.' },
    { id: 'gold', name: 'Gold Coin', correct: 'shiny', icon: CustomIcons.gold, reason: 'Gold is a metal famous for its bright, lustrous shine that reflects light brilliantly.' },
    { id: 'plastic', name: 'Plastic Ruler', correct: 'dull', icon: CustomIcons.plastic, reason: 'Most common plastics like this ruler do not have a natural metallic lustre and appear relatively dull.' },
    { id: 'glass', name: 'Glass Marble', correct: 'shiny', icon: CustomIcons.glass, reason: 'Glass has a very smooth surface that reflects light brightly, giving it a shiny appearance.' }
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', height: '100%', background: 'var(--lesson-surface)', padding: '1rem', borderRadius: '16px' }}>
      
      {/* Header & Lamp toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--heading-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📌 Material Tray
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--heading-sub)' }}>
            Drag each material to the correct group
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => setLampOn(!lampOn)}
            style={{ 
              background: lampOn ? 'var(--lesson-warning)' : 'var(--lesson-accent)', 
              color: 'white', border: 'none', padding: '0.4rem 0.75rem', 
              borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
              fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <Lightbulb size={16} /> Lamp {lampOn ? 'ON' : 'OFF'}
          </button>
          <div style={{ fontSize: '2rem', filter: lampOn ? 'drop-shadow(0 0 10px var(--lesson-warning))' : 'none', transition: 'all 0.3s' }}>
            🛋️
          </div>
        </div>
      </div>

      {/* Material Tray */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--lesson-border)', padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
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
                  padding: '0.75rem', background: 'white', border: '1px solid var(--lesson-border)', borderRadius: '8px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'grab',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60px', filter: (lampOn && item.correct === 'shiny') ? 'drop-shadow(0 0 12px #fef08a)' : 'none' }}>
                  {item.icon}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--lesson-secondary)', fontWeight: '500', textAlign: 'center', lineHeight: '1.2' }}>
                  {item.name}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Drop Zones */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1, minHeight: 0 }}>
        {/* Shiny */}
        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'shiny')}
          style={{ 
            border: '2px dashed var(--lesson-warning-border)', background: 'var(--lesson-warning-bg)', borderRadius: '12px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem',
            position: 'relative', overflowY: 'auto'
          }}
        >
          <div style={{ color: '#ca8a04', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            ✨ Shiny (Reflects Light)
          </div>
          <div style={{ color: '#ca8a04', opacity: 0.7, fontSize: '0.8rem', marginBottom: '1rem' }}>
            Drop items here
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {placed.shiny.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '0.5rem', background: 'white', borderRadius: '8px', border: '1px solid #fef08a', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '90px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60px' }}>
                  <div>{item.icon}</div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#ca8a04', textAlign: 'center', lineHeight: '1.2' }}>{item.name}</div>
              </motion.div>
            ))}
          </div>
          {placed.shiny.length === 0 && (
            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', opacity: 0.1, fontSize: '3rem', pointerEvents: 'none' }}>✨</div>
          )}
        </div>

        {/* Dull */}
        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'dull')}
          style={{ 
            border: '2px dashed var(--lesson-muted)', background: 'var(--lesson-surface)', borderRadius: '12px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem',
            position: 'relative', overflowY: 'auto'
          }}
        >
          <div style={{ color: 'var(--lesson-secondary)', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            🪨 Dull (Does not Reflect much)
          </div>
          <div style={{ color: 'var(--lesson-muted)', opacity: 0.7, fontSize: '0.8rem', marginBottom: '1rem' }}>
            Drop items here
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {placed.dull.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '0.5rem', background: 'white', borderRadius: '8px', border: '1px solid var(--lesson-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '90px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60px' }}>
                  <div>{item.icon}</div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--lesson-secondary)', textAlign: 'center', lineHeight: '1.2' }}>{item.name}</div>
              </motion.div>
            ))}
          </div>
          {placed.dull.length === 0 && (
            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', opacity: 0.05, fontSize: '3rem', pointerEvents: 'none' }}>🪨</div>
          )}
        </div>
      </div>

      {/* Observation Area */}
      <div 
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'observe')}
        style={{ 
          background: 'white', borderRadius: '12px', border: '1px solid var(--lesson-border)', padding: '0.75rem 1rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0
        }}
      >
        <div>
          <h4 style={{ margin: '0 0 0.15rem 0', color: 'var(--heading-section)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🔍 Observation Area
          </h4>
          <p style={{ margin: 0, color: 'var(--lesson-accent)', fontSize: '0.85rem' }}>
            Place any item under the lamp to observe how it looks.
          </p>
        </div>
        <div style={{ 
          border: '2px dashed var(--lesson-border)', borderRadius: '10px', padding: '0.4rem 1rem', 
          background: 'var(--lesson-surface)', display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '180px', justifyContent: 'center', minHeight: '50px'
        }}>
          {observedItem ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40px', filter: (lampOn && observedItem.correct === 'shiny') ? 'drop-shadow(0 0 15px var(--lesson-warning-border))' : 'none' }}>
                {observedItem.icon}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--lesson-primary)', fontSize: '0.9rem' }}>{observedItem.name}</span>
                {lampOn && (
                  <span style={{ fontSize: '0.75rem', color: observedItem.correct === 'shiny' ? '#ca8a04' : 'var(--lesson-muted)' }}>
                    {observedItem.correct === 'shiny' ? '✨ It reflects light!' : '🪨 It does not reflect light.'}
                  </span>
                )}
              </div>
            </motion.div>
          ) : (
            <>
              <div style={{ background: 'white', padding: '0.4rem', borderRadius: '50%', color: 'var(--lesson-accent)', display: 'flex' }}>
                <MousePointer2 size={16} />
              </div>
              <span style={{ color: 'var(--lesson-accent)', fontSize: '0.8rem' }}>Drag an item here<br/>to observe</span>
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
              background: 'var(--lesson-danger-bg)', border: '1px solid var(--lesson-danger-border)', borderRadius: '12px', padding: '1rem 1.5rem',
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
