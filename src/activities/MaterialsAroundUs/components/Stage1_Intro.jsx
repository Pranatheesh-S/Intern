import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, User, GraduationCap, Check, RefreshCw } from 'lucide-react';

export default function Stage1_Intro({ onComplete, addXp }) {
  const [clickedObjects, setClickedObjects] = useState({});
  const [completed, setCompleted] = useState(false);

  const classroomObjects = [
    { 
      id: 'notebook', 
      name: 'Notebook', 
      material: 'Paper', 
      desc: 'Used for writing, made of sheets of paper bound together.',
      pos: { bottom: '130px', left: '70px' }
    },
    { 
      id: 'pen', 
      name: 'Pen', 
      material: 'Plastic & Metal', 
      desc: 'Used for writing, combines a plastic barrel, metal tip, and ink.',
      pos: { bottom: '135px', left: '135px' }
    },
    { 
      id: 'desk', 
      name: 'Wooden Desk', 
      material: 'Wood', 
      desc: 'Provides a sturdy writing surface, made of processed wood.',
      pos: { bottom: '40px', left: '40px' }
    },
    { 
      id: 'window', 
      name: 'Window Pane', 
      material: 'Glass', 
      desc: 'Allows light to enter, made of transparent glass.',
      pos: { top: '40px', right: '50px' }
    },
    { 
      id: 'bottle', 
      name: 'Water Bottle', 
      material: 'Metal (Stainless Steel)', 
      desc: 'Keeps water cool and safe, made of durable metal.',
      pos: { bottom: '130px', left: '195px' }
    },
    { 
      id: 'cushion', 
      name: 'Chair Cushion', 
      material: 'Cloth / Fabric', 
      desc: 'Provides comfort on seats, made of soft fabric.',
      pos: { bottom: '50px', left: '330px' }
    }
  ];

  const handleObjectClick = (objId) => {
    if (clickedObjects[objId]) return;
    
    const newClicked = { ...clickedObjects, [objId]: true };
    setClickedObjects(newClicked);
    
    // Check if all objects are clicked
    if (Object.keys(newClicked).length === classroomObjects.length) {
      setCompleted(true);
      addXp(30);
      onComplete();
    }
  };

  const resetInvestigation = () => {
    setClickedObjects({});
    setCompleted(false);
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
          <BookOpen size={24} style={{ color: 'var(--accent)' }} />
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-heading)' }}>Observing Objects Around Us</h2>
        </div>
        
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <strong>You</strong> are excited to go to your new class after the summer break. 
          You look at your new school supplies and start talking. 
          The <strong>Teacher</strong> enters and asks a fascinating question: <strong>"How are objects similar or different? What materials are they made of?"</strong>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '1.5rem', minHeight: '480px' }}>
        {/* Interactive Classroom Scene */}
        <div className="glass-panel" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem', height: '480px', overflow: 'hidden', padding: 0, border: 'var(--classroom-border)', background: 'var(--classroom-bg)' }}>
          
          {/* Classroom Chalkboard */}
          <div style={{ position: 'absolute', top: '30px', left: '40px', width: '340px', height: '170px', border: '8px solid #4b5563', background: '#064e3b', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.6)', zIndex: 15 }}>
            {completed ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center' }}>
                <span style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif', color: '#6ee7b7', fontSize: '1.3rem', fontWeight: 'bold' }}>All Objects Identified!</span>
                <span style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif', color: '#fcd34d', fontSize: '1rem' }}>Click "Proceed to next" in the top right to continue!</span>
              </div>
            ) : (
              <span style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif', color: '#a7f3d0', fontSize: '1.15rem', textAlign: 'center', lineHeight: '1.5' }}>
                Welcome back!<br/>
                What is <strong style={{ color: '#fbbf24' }}>Material</strong>?<br/>
                Click on the objects to scan.
              </span>
            )}
          </div>

          {/* Interactive Window Pane SVG */}
          <div 
            onClick={() => handleObjectClick('window')}
            className={`interactive-container ${clickedObjects.window ? 'clicked' : ''}`}
            style={{ 
              ...classroomObjects.find(o => o.id === 'window').pos, 
              cursor: 'pointer',
              borderRadius: '6px',
              border: clickedObjects.window ? '2px solid #10b981' : '2px dashed transparent',
              boxShadow: clickedObjects.window ? '0 0 10px #10b981' : 'none',
              transition: 'all 0.3s'
            }}
          >
            <svg width="110" height="110" viewBox="0 0 100 100">
              <rect x="2" y="2" width="96" height="96" fill="rgba(56, 189, 248, 0.2)" stroke="#475569" strokeWidth="4" />
              <line x1="50" y1="2" x2="50" y2="98" stroke="#475569" strokeWidth="4" />
              <line x1="2" y1="50" x2="98" y2="50" stroke="#475569" strokeWidth="4" />
              <path d="M15,10 L35,10 L10,35 L10,15 Z" fill="rgba(255,255,255,0.25)" />
              <path d="M65,10 L85,10 L60,35 L60,15 Z" fill="rgba(255,255,255,0.25)" />
            </svg>
            <span className="interactive-label" style={{ position: 'absolute', top: '-28px', left: '15px', background: 'rgba(0,0,0,0.85)', color: '#fff', fontSize: '0.85rem', fontWeight: 'bold', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>Window Pane</span>
          </div>

          {/* Interactive Wooden Desk SVG */}
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
            <svg width="250" height="120" viewBox="0 0 220 110">
              <rect x="10" y="20" width="200" height="15" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
              <rect x="25" y="35" width="55" height="45" fill="#582007" />
              <rect x="30" y="42" width="45" height="10" fill="#451a03" />
              <circle cx="52" cy="47" r="2.5" fill="#f59e0b" />
              <rect x="15" y="35" width="10" height="70" fill="#451a03" />
              <rect x="195" y="35" width="10" height="70" fill="#451a03" />
            </svg>
            <span className="interactive-label" style={{ position: 'absolute', bottom: '-15px', left: '70px', background: 'rgba(0,0,0,0.85)', color: '#fff', fontSize: '0.85rem', fontWeight: 'bold', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>Wooden Desk</span>
          </div>

          {/* Notebook (placed on Desk) */}
          <div 
            onClick={() => handleObjectClick('notebook')}
            className={`interactive-container ${clickedObjects.notebook ? 'clicked' : ''}`}
            style={{ 
              ...classroomObjects.find(o => o.id === 'notebook').pos, 
              cursor: 'pointer',
              zIndex: 10,
              borderRadius: '4px',
              border: clickedObjects.notebook ? '2px solid #10b981' : '2px dashed transparent',
              boxShadow: clickedObjects.notebook ? '0 0 10px #10b981' : 'none',
              transition: 'all 0.3s'
            }}
          >
            <svg width="45" height="40" viewBox="0 0 40 35">
              <rect x="5" y="2" width="30" height="30" rx="3" fill="#3b82f6" />
              <path d="M5,2 L8,2 L8,32 L5,32 Z" fill="#2563eb" />
              <line x1="10" y1="7" x2="30" y2="7" stroke="#fff" strokeWidth="1.5" />
              <line x1="10" y1="12" x2="30" y2="12" stroke="#fff" strokeWidth="1.5" />
              <line x1="10" y1="17" x2="30" y2="17" stroke="#fff" strokeWidth="1.5" />
              <circle cx="4" cy="6" r="1.2" fill="#94a3b8" />
              <circle cx="4" cy="12" r="1.2" fill="#94a3b8" />
              <circle cx="4" cy="18" r="1.2" fill="#94a3b8" />
            </svg>
            <span className="interactive-label" style={{ position: 'absolute', top: '-25px', left: '-10px', background: 'rgba(0,0,0,0.85)', color: '#fff', fontSize: '0.85rem', fontWeight: 'bold', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>Notebook</span>
          </div>

          {/* Pen (placed on Desk) */}
          <div 
            onClick={() => handleObjectClick('pen')}
            className={`interactive-container ${clickedObjects.pen ? 'clicked' : ''}`}
            style={{ 
              ...classroomObjects.find(o => o.id === 'pen').pos, 
              cursor: 'pointer',
              zIndex: 11,
              borderRadius: '4px',
              border: clickedObjects.pen ? '2px solid #10b981' : '2px dashed transparent',
              boxShadow: clickedObjects.pen ? '0 0 10px #10b981' : 'none',
              transition: 'all 0.3s'
            }}
          >
            <svg width="40" height="20" viewBox="0 0 35 15" style={{ transform: 'rotate(-10deg)' }}>
              <rect x="2" y="5" width="22" height="5" rx="1" fill="#10b981" />
              <polygon points="24,5 30,7.5 24,10" fill="#cbd5e1" />
              <circle cx="30" cy="7.5" r="0.8" fill="#000" />
            </svg>
            <span className="interactive-label" style={{ position: 'absolute', top: '-25px', left: '0px', background: 'rgba(0,0,0,0.85)', color: '#fff', fontSize: '0.85rem', fontWeight: 'bold', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>Pen</span>
          </div>

          {/* Water Bottle (placed on Desk) */}
          <div 
            onClick={() => handleObjectClick('bottle')}
            className={`interactive-container ${clickedObjects.bottle ? 'clicked' : ''}`}
            style={{ 
              ...classroomObjects.find(o => o.id === 'bottle').pos, 
              cursor: 'pointer',
              zIndex: 12,
              borderRadius: '4px',
              border: clickedObjects.bottle ? '2px solid #10b981' : '2px dashed transparent',
              boxShadow: clickedObjects.bottle ? '0 0 10px #10b981' : 'none',
              transition: 'all 0.3s'
            }}
          >
            <svg width="30" height="55" viewBox="0 0 25 50">
              <rect x="3" y="15" width="19" height="32" rx="3" fill="#94a3b8" />
              <rect x="5" y="17" width="3" height="28" fill="rgba(255,255,255,0.4)" rx="1" />
              <rect x="6" y="8" width="13" height="7" fill="#64748b" />
              <rect x="8" y="2" width="9" height="6" rx="1" fill="#475569" />
            </svg>
            <span className="interactive-label" style={{ position: 'absolute', top: '-25px', left: '-15px', background: 'rgba(0,0,0,0.85)', color: '#fff', fontSize: '0.85rem', fontWeight: 'bold', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>Water Bottle</span>
          </div>

          {/* Chair (with Cushion Seat) */}
          <div 
            onClick={() => handleObjectClick('cushion')}
            className={`interactive-container ${clickedObjects.cushion ? 'clicked' : ''}`}
            style={{ 
              ...classroomObjects.find(o => o.id === 'cushion').pos, 
              cursor: 'pointer',
              borderRadius: '6px',
              border: clickedObjects.cushion ? '2px solid #10b981' : '2px dashed transparent',
              boxShadow: clickedObjects.cushion ? '0 0 10px #10b981' : 'none',
              transition: 'all 0.3s'
            }}
          >
            <svg width="100" height="130" viewBox="0 0 90 120">
              <rect x="25" y="10" width="40" height="40" rx="4" fill="#5c4033" stroke="#3d2b1f" strokeWidth="1.5" />
              <ellipse cx="45" cy="55" rx="30" ry="12" fill="#d97706" stroke="#b45309" strokeWidth="2" />
              <rect x="20" y="62" width="6" height="50" fill="#3d2b1f" />
              <rect x="64" y="62" width="6" height="50" fill="#3d2b1f" />
            </svg>
            <span className="interactive-label" style={{ position: 'absolute', bottom: '-15px', left: '15px', background: 'rgba(0,0,0,0.85)', color: '#fff', fontSize: '0.85rem', fontWeight: 'bold', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>Chair Cushion</span>
          </div>

          {/* Character Avatars */}
          <div style={{ position: 'absolute', bottom: '15px', right: '20px', zIndex: 20, display: 'flex', gap: '1rem', background: 'rgba(15,23,42,0.6)', padding: '0.4rem 0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <User size={18} />
              </div>
              <span style={{ fontSize: '0.65rem', color: '#fff', fontWeight: 'bold' }}>You</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <GraduationCap size={18} />
              </div>
              <span style={{ fontSize: '0.65rem', color: '#fff', fontWeight: 'bold' }}>Teacher</span>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)', background: 'var(--card-bg)', height: '480px' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-heading)' }}>Investigation Progress</span>
            <button onClick={resetInvestigation} className="outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', gap: '0.35rem' }}>
              <RefreshCw size={14} /> Reset
            </button>
          </div>

          {!completed && (
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Click on elements inside the classroom layout to reveal what material they are made of.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
            {classroomObjects.map((obj) => {
              const isClicked = clickedObjects[obj.id];
              return (
                <div 
                  key={obj.id} 
                  style={{ 
                    padding: '0.75rem 1rem', 
                    borderRadius: '8px', 
                    background: isClicked ? 'var(--success-bg)' : 'var(--surface)', 
                    border: `1px solid ${isClicked ? 'var(--success-border)' : 'var(--border)'}`,
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.4rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1rem', color: isClicked ? 'var(--success)' : 'var(--text-heading)' }}>
                      {obj.name}
                    </span>
                    {isClicked && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', background: 'var(--success)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        {obj.material}
                      </span>
                    )}
                  </div>
                  {isClicked && (
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {obj.desc}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Divider Line below scrollable container */}
          <div style={{ height: '1px', width: '100%', background: 'var(--border)', margin: '0.25rem 0' }} />

          {completed && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ padding: '1rem', borderRadius: '8px', background: 'var(--success-bg)', border: '1px solid var(--success-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 'bold', fontSize: '1.05rem' }}>
                <Check size={18} /> <span>All Objects Found! (+30 XP)</span>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                <strong>Key Concept:</strong> A <strong>material</strong> is any substance used to make objects. Different objects can be made of the same material, or one object can be made of multiple materials!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
