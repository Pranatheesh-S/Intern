import React, { useState } from 'react';
import { BookOpen, Search, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClassroomScene({ onComplete, addXp = () => {} }) {
  const [clickedObjects, setClickedObjects] = useState({});
  const [completed, setCompleted] = useState(false);

  const classroomObjects = [
    { 
      id: 'iron_key', 
      name: 'Iron Key', 
      material: 'Iron', 
      isMagnetic: true,
      desc: 'Used to open locks, made of iron.',
      pos: { bottom: '140px', left: '260px' }
    },
    { 
      id: 'eraser', 
      name: 'Rubber Eraser', 
      material: 'Rubber', 
      isMagnetic: false,
      desc: 'Used for erasing pencil marks, made of rubber.',
      pos: { bottom: '135px', left: '310px' }
    },
    { 
      id: 'desk', 
      name: 'Wooden Desk', 
      material: 'Wood', 
      isMagnetic: false,
      desc: 'Provides a sturdy writing surface, made of wood.',
      pos: { bottom: '40px', left: '210px' }
    },

    { 
      id: 'bottle', 
      name: 'Plastic Bottle', 
      material: 'Plastic', 
      isMagnetic: false,
      desc: 'Keeps water safe, made of plastic.',
      pos: { bottom: '130px', left: '360px' }
    },
    { 
      id: 'spoon', 
      name: 'Steel Spoon', 
      material: 'Steel', 
      isMagnetic: true,
      desc: 'Used for eating, made of steel.',
      pos: { bottom: '45px', left: '480px' }
    },
    { 
      id: 'paperclip', 
      name: 'Steel Paperclip', 
      material: 'Steel', 
      isMagnetic: true,
      desc: 'Used to hold papers together, made of steel.',
      pos: { bottom: '145px', left: '420px' }
    },
    { 
      id: 'alum_can', 
      name: 'Aluminium Can', 
      material: 'Aluminium', 
      isMagnetic: false,
      desc: 'Used for drinks, made of aluminium.',
      pos: { bottom: '20px', left: '390px' }
    }
  ];

  const handleObjectClick = (objId) => {
    if (clickedObjects[objId]) return;
    
    const newClicked = { ...clickedObjects, [objId]: true };
    setClickedObjects(newClicked);
    
    if (Object.keys(newClicked).length === classroomObjects.length) {
      setCompleted(true);
      addXp(30);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      <style>{`
        :root {
          --classroom-bg: linear-gradient(to bottom, #e2e8f0 0%, #f1f5f9 100%);
          --classroom-border: 2px dashed #94a3b8;
        }
        [data-theme="dark"] {
          --classroom-bg: linear-gradient(to bottom, #0f172a 0%, #1e293b 100%);
          --classroom-border: 2px dashed var(--accent);
        }
        .interactive-container {
          position: absolute;
        }
        .interactive-label {
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
          pointer-events: none;
          z-index: 30;
        }
        .interactive-container.clicked .interactive-label {
          opacity: 1;
        }
      `}</style>

      {/* Introduction Card */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--accent-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Search size={24} style={{ color: 'var(--accent)' }} />
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-heading)' }}>Step 1: Observe & Collect Items</h2>
        </div>
        
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Before we test for magnetic properties, we need to gather some objects. <strong>Click on the objects around the classroom</strong> to collect them for our magnetic test later.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', minHeight: '480px' }}>
        {/* Interactive Classroom Scene */}
        <div className="glass-panel" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem', height: '480px', overflow: 'hidden', padding: 0, border: 'var(--classroom-border)', background: 'var(--classroom-bg)' }}>
          
          {/* Classroom Chalkboard */}
          <div style={{ position: 'absolute', top: '30px', left: '190px', width: '270px', height: '140px', border: '6px solid #4b5563', background: '#064e3b', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.6)', zIndex: 15 }}>
            {completed ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif', color: '#6ee7b7', fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'center' }}>
                  All items collected! Let's test them.
                </span>
                <button 
                  onClick={() => onComplete(classroomObjects)}
                  className="success" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}
                >
                  Proceed to Magnetic Test
                </button>
              </div>
            ) : (
              <span style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif', color: '#a7f3d0', fontSize: '0.9rem', textAlign: 'center', lineHeight: '1.4' }}>
                Find the items to test!<br/>
                Click on the objects around the classroom to add them to your collection.
              </span>
            )}
          </div>


          {/* Wooden Desk SVG */}
          <div 
            onClick={() => handleObjectClick('desk')}
            className={`interactive-container ${clickedObjects.desk ? 'clicked' : ''}`}
            style={{ 
              ...classroomObjects.find(o => o.id === 'desk').pos, 
              cursor: 'pointer',
              borderRadius: '6px',
              border: clickedObjects.desk ? '2px solid #10b981' : '2px dashed transparent',
              boxShadow: clickedObjects.desk ? '0 0 10px #10b981' : 'none',
              transition: 'all 0.3s'
            }}
          >
            <svg width="220" height="100" viewBox="0 0 200 100">
              {/* Desk Top */}
              <rect x="10" y="30" width="180" height="15" fill="#854d0e" rx="2" />
              <rect x="10" y="45" width="180" height="5" fill="#713f12" />
              
              {/* Legs */}
              <rect x="25" y="50" width="10" height="50" fill="#422006" />
              <rect x="165" y="50" width="10" height="50" fill="#422006" />
              
              {/* Drawers */}
              <rect x="25" y="50" width="50" height="40" fill="#713f12" />
              <circle cx="50" cy="65" r="3" fill="#fcd34d" />
            </svg>
            <div className="interactive-label" style={{ position: 'absolute', bottom: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
              Wooden Desk
            </div>
          </div>

          {/* Iron Key SVG */}
          <div 
            onClick={() => handleObjectClick('iron_key')}
            className={`interactive-container ${clickedObjects.iron_key ? 'clicked' : ''}`}
            style={{ 
              ...classroomObjects.find(o => o.id === 'iron_key').pos, 
              cursor: 'pointer',
              borderRadius: '6px',
              border: clickedObjects.iron_key ? '2px solid #10b981' : '2px dashed transparent',
              boxShadow: clickedObjects.iron_key ? '0 0 10px #10b981' : 'none',
              transition: 'all 0.3s',
              zIndex: 10
            }}
          >
            <svg width="30" height="15" viewBox="0 0 40 20">
              <circle cx="10" cy="10" r="8" fill="#64748b" stroke="#475569" strokeWidth="2" />
              <circle cx="10" cy="10" r="3" fill="#e2e8f0" />
              <rect x="18" y="7" width="20" height="6" fill="#64748b" />
              <rect x="30" y="13" width="4" height="5" fill="#64748b" />
              <rect x="35" y="13" width="3" height="4" fill="#64748b" />
            </svg>
            <div className="interactive-label" style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
              Iron Key
            </div>
          </div>

          {/* Rubber Eraser SVG */}
          <div 
            onClick={() => handleObjectClick('eraser')}
            className={`interactive-container ${clickedObjects.eraser ? 'clicked' : ''}`}
            style={{ 
              ...classroomObjects.find(o => o.id === 'eraser').pos, 
              cursor: 'pointer',
              borderRadius: '4px',
              border: clickedObjects.eraser ? '2px solid #10b981' : '2px dashed transparent',
              boxShadow: clickedObjects.eraser ? '0 0 10px #10b981' : 'none',
              transition: 'all 0.3s',
              zIndex: 10
            }}
          >
            <svg width="25" height="15" viewBox="0 0 30 20">
              <rect x="2" y="5" width="26" height="10" rx="2" fill="#fca5a5" stroke="#ef4444" strokeWidth="1" transform="rotate(-10 15 10)" />
            </svg>
            <div className="interactive-label" style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
              Rubber Eraser
            </div>
          </div>

          {/* Plastic Bottle SVG */}
          <div 
            onClick={() => handleObjectClick('bottle')}
            className={`interactive-container ${clickedObjects.bottle ? 'clicked' : ''}`}
            style={{ 
              ...classroomObjects.find(o => o.id === 'bottle').pos, 
              cursor: 'pointer',
              borderRadius: '6px',
              border: clickedObjects.bottle ? '2px solid #10b981' : '2px dashed transparent',
              boxShadow: clickedObjects.bottle ? '0 0 10px #10b981' : 'none',
              transition: 'all 0.3s',
              zIndex: 10
            }}
          >
            <svg width="20" height="40" viewBox="0 0 20 50">
              <rect x="6" y="2" width="8" height="6" fill="#38bdf8" />
              <rect x="2" y="8" width="16" height="40" rx="4" fill="#bae6fd" opacity="0.8" />
              <line x1="6" y1="15" x2="6" y2="40" stroke="#fff" strokeWidth="2" opacity="0.5" />
            </svg>
            <div className="interactive-label" style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
              Plastic Bottle
            </div>
          </div>

          {/* Steel Paperclip SVG */}
          <div 
            onClick={() => handleObjectClick('paperclip')}
            className={`interactive-container ${clickedObjects.paperclip ? 'clicked' : ''}`}
            style={{ 
              ...classroomObjects.find(o => o.id === 'paperclip').pos, 
              cursor: 'pointer',
              borderRadius: '4px',
              border: clickedObjects.paperclip ? '2px solid #10b981' : '2px dashed transparent',
              boxShadow: clickedObjects.paperclip ? '0 0 10px #10b981' : 'none',
              transition: 'all 0.3s',
              zIndex: 10
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M6 14 V6 A4 4 0 0 1 14 6 V15 A3 3 0 0 1 8 15 V7" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="interactive-label" style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
              Steel Paperclip
            </div>
          </div>

          {/* Aluminium Can SVG */}
          <div 
            onClick={() => handleObjectClick('alum_can')}
            className={`interactive-container ${clickedObjects.alum_can ? 'clicked' : ''}`}
            style={{ 
              ...classroomObjects.find(o => o.id === 'alum_can').pos, 
              cursor: 'pointer',
              borderRadius: '6px',
              border: clickedObjects.alum_can ? '2px solid #10b981' : '2px dashed transparent',
              boxShadow: clickedObjects.alum_can ? '0 0 10px #10b981' : 'none',
              transition: 'all 0.3s',
              zIndex: 10
            }}
          >
            <svg width="24" height="36" viewBox="0 0 24 36">
              <rect x="2" y="4" width="20" height="28" fill="#cbd5e1" />
              <ellipse cx="12" cy="4" rx="10" ry="3" fill="#94a3b8" />
              <ellipse cx="12" cy="32" rx="10" ry="3" fill="#94a3b8" />
              <rect x="2" y="10" width="20" height="16" fill="#ef4444" opacity="0.8" />
            </svg>
            <div className="interactive-label" style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
              Aluminium Can
            </div>
          </div>

          {/* Steel Spoon SVG */}
          <div 
            onClick={() => handleObjectClick('spoon')}
            className={`interactive-container ${clickedObjects.spoon ? 'clicked' : ''}`}
            style={{ 
              ...classroomObjects.find(o => o.id === 'spoon').pos, 
              cursor: 'pointer',
              borderRadius: '6px',
              border: clickedObjects.spoon ? '2px solid #10b981' : '2px dashed transparent',
              boxShadow: clickedObjects.spoon ? '0 0 10px #10b981' : 'none',
              transition: 'all 0.3s'
            }}
          >
            <svg width="40" height="15" viewBox="0 0 60 20">
              <ellipse cx="15" cy="10" rx="10" ry="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="23" y="8" width="30" height="4" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
            </svg>
            <div className="interactive-label" style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
              Steel Spoon
            </div>
          </div>
        </div>

        {/* Collection Sidebar */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '480px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Collection Progress</h3>
          </div>
          
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Find the items inside the classroom to collect them for testing.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {classroomObjects.map((obj) => (
              <div 
                key={obj.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem', 
                  background: clickedObjects[obj.id] ? 'var(--success-bg)' : 'var(--surface-hover)',
                  border: `1px solid ${clickedObjects[obj.id] ? 'var(--success-border)' : 'var(--border)'}`,
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontWeight: '600', color: clickedObjects[obj.id] ? 'var(--success)' : 'var(--text-primary)' }}>
                  {obj.name}
                </span>
                {clickedObjects[obj.id] && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle size={18} style={{ color: 'var(--success)' }} />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
