import React, { useState } from 'react';
import { User, GraduationCap, RefreshCw } from 'lucide-react';
import classroomBg from '../images/stage1_classroom_v2.png';

export default function Stage1_Intro({ onComplete, addXp }) {
  const [clickedObjects, setClickedObjects] = useState({});
  const [lastClickedId, setLastClickedId] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [bookPage, setBookPage] = useState(1);

  const classroomObjects = [
    { 
      id: 'notebook', 
      name: 'Notebook', 
      material: 'Paper', 
      desc: 'Used for writing, made of sheets of paper bound together.',
      pos: { top: '65%', left: '38%' }
    },
    { 
      id: 'pen', 
      name: 'Pen', 
      material: 'Plastic & Metal', 
      desc: 'Used for writing, combines a plastic barrel, metal tip, and ink.',
      pos: { top: '66%', left: '53%' }
    },
    { 
      id: 'desk', 
      name: 'Wooden Desk', 
      material: 'Wood', 
      desc: 'Provides a sturdy writing surface, made of processed wood.',
      pos: { top: '74%', left: '65%' }
    },
    { 
      id: 'window', 
      name: 'Window Pane', 
      material: 'Glass', 
      desc: 'Allows light to enter, made of transparent glass.',
      pos: { top: '32%', left: '15%' }
    },
    { 
      id: 'bottle', 
      name: 'Water Bottle', 
      material: 'Metal (Stainless Steel)', 
      desc: 'Keeps water cool and safe, made of durable metal.',
      pos: { top: '55%', left: '69%' }
    },
    { 
      id: 'cushion', 
      name: 'Chair Cushion', 
      material: 'Cloth / Fabric', 
      desc: 'Provides comfort on seats, made of soft fabric.',
      pos: { bottom: '0%', left: '40%' }
    }
  ];

  const handleObjectClick = (objId) => {
    if (clickedObjects[objId]) {
      setLastClickedId(objId);
      return;
    }
    
    const newClicked = { ...clickedObjects, [objId]: true };
    setClickedObjects(newClicked);
    setLastClickedId(objId);
    
    // Check if all objects are clicked
    if (Object.keys(newClicked).length === classroomObjects.length) {
      setCompleted(true);
      addXp(30);
      onComplete();
    }
  };

  const resetInvestigation = () => {
    setClickedObjects({});
    setLastClickedId(null);
    setCompleted(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', height: '100%' }}>
      <style>{`
        :root {
          --classroom-bg: url('${classroomBg}');
          --classroom-border: 2px solid #94a3b8;
        }
        [data-theme="dark"] {
          --classroom-bg: url('${classroomBg}');
          --classroom-border: 2px solid var(--accent);
        }
        .interactive-container {
          position: absolute;
          transform-origin: bottom left;
        }
        .interactive-container svg {
          width: clamp(30px, 100%, 400px); /* fallback if needed */
          height: auto;
          /* The actual size is controlled by inline styles now */
        }
        .interactive-label {
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
          pointer-events: none;
          z-index: 30;
          position: absolute;
          top: -35px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.85);
          color: #fff;
          font-size: 0.85rem;
          font-weight: bold;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          white-space: nowrap;
        }
        .interactive-container.clicked .interactive-label {
          opacity: 1;
        }
        .hotspot-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.8);
          border: 2px solid white;
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.9);
          animation: pulse 2s infinite;
        }
        .interactive-container.clicked .hotspot-dot {
          background: rgba(245, 158, 11, 0.9);
          border-color: #fff;
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.9);
          animation: none;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>

      {/* Interactive Classroom Scene */}
      <div className="glass-panel" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minHeight: '450px', overflow: 'hidden', padding: 0, border: 'var(--classroom-border)', backgroundImage: 'var(--classroom-bg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          
          {/* Classroom Chalkboard Text Overlay */}
          <div style={{ position: 'absolute', top: '5%', right: '10%', width: '45%', height: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 15 }}>
            {completed ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center' }}>
                <span style={{ fontFamily: 'Georgia, serif', color: '#ffffff', fontSize: 'clamp(1rem, 1.5vw, 2.5rem)', fontWeight: 'bold' }}>All Objects Identified!</span>
                <span style={{ fontFamily: 'Georgia, serif', color: '#fcd34d', fontSize: 'clamp(0.8rem, 1vw, 1.8rem)' }}>Click "Proceed to next" in the top right to continue!</span>
              </div>
            ) : (
              <span style={{ fontFamily: 'Georgia, serif', color: '#ffffff', fontSize: 'clamp(1rem, 1.3vw, 2.2rem)', textAlign: 'center', lineHeight: '1.5' }}>
                Welcome back!<br/>
                What is <strong style={{ color: '#fbbf24' }}>Material</strong>?<br/>
                Click on the objects to scan.
              </span>
            )}
          </div>

          {/* Render Hotspot Dots */}
          {classroomObjects.map(obj => (
            <div 
              key={obj.id}
              onClick={() => handleObjectClick(obj.id)}
              className={`interactive-container ${clickedObjects[obj.id] ? 'clicked' : ''}`}
              style={{ 
                ...obj.pos, 
                cursor: 'pointer',
                transition: 'all 0.3s',
                zIndex: 20
              }}
            >
              <div className="hotspot-dot" />
              <span className="interactive-label">{obj.name}</span>
            </div>
          ))}

          {/* Character Avatars */}
          <div style={{ position: 'absolute', bottom: '15px', left: '20px', zIndex: 20, display: 'flex', gap: '1rem', background: 'rgba(15,23,42,0.6)', padding: '0.4rem 0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
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
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)', background: 'var(--card-bg)', height: '280px', flexShrink: 0 }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-heading)' }}>
              Investigation Progress ({Object.keys(clickedObjects).length}/{classroomObjects.length})
            </span>
            <button onClick={resetInvestigation} className="outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', gap: '0.35rem' }}>
              <RefreshCw size={14} /> Reset
            </button>
          </div>

          {!completed && (
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Click on elements inside the classroom layout to reveal what material they are made of.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, paddingRight: '4px' }}>
            {Object.keys(clickedObjects).length === 0 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>
                No objects scanned yet. Click an item in the classroom!
              </div>
            ) : lastClickedId ? (
              (() => {
                const obj = classroomObjects.find(o => o.id === lastClickedId);
                return (
                  <div 
                    key={obj.id} 
                    style={{ 
                      padding: '0.75rem 1rem', 
                      borderRadius: '8px', 
                      background: 'var(--success-bg)', 
                      border: '1px solid var(--success-border)',
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '0.4rem',
                      animation: 'fadeIn 0.3s ease-out'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--success)' }}>
                        {obj.name}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', background: 'var(--success)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        {obj.material}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {obj.desc}
                    </span>
                  </div>
                );
              })()
            ) : null}
          </div>

        </div>
    </div>
  );
}
