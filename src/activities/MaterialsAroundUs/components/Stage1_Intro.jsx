import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, User, Check, RefreshCw, AlertCircle } from 'lucide-react';

export default function Stage1_Intro({ onComplete, addXp }) {
  const [clickedObjects, setClickedObjects] = useState({});
  const [completed, setCompleted] = useState(false);

  const classroomObjects = [
    { id: 'notebook', name: 'Notebook', material: 'Paper', desc: 'Used for writing, made of sheets of paper bound together.', position: { top: '65%', left: '15%' }, color: '#3b82f6' },
    { id: 'pen', name: 'Pen', material: 'Plastic & Metal', desc: 'Used for writing, combines a plastic barrel, metal tip, and ink.', position: { top: '63%', left: '26%' }, color: '#10b981' },
    { id: 'desk', name: 'Wooden Desk', material: 'Wood', desc: 'Provides a sturdy writing surface, made of processed wood.', position: { top: '75%', left: '35%' }, color: '#8b5cf6' },
    { id: 'window', name: 'Window Pane', material: 'Glass', desc: 'Allows light to enter, made of transparent glass.', position: { top: '25%', left: '75%' }, color: '#06b6d4' },
    { id: 'bottle', name: 'Water Bottle', material: 'Metal (Stainless Steel)', desc: 'Keeps water cool and safe, made of durable metal.', position: { top: '55%', left: '48%' }, color: '#ec4899' },
    { id: 'cushion', name: 'Chair Cushion', material: 'Cloth / Fabric', desc: 'Provides comfort on seats, made of soft fabric.', position: { top: '72%', left: '55%' }, color: '#f59e0b' }
  ];

  const handleObjectClick = (obj) => {
    if (clickedObjects[obj.id]) return;
    
    const newClicked = { ...clickedObjects, [obj.id]: true };
    setClickedObjects(newClicked);
    
    // Check if all objects are clicked
    if (Object.keys(newClicked).length === classroomObjects.length) {
      setCompleted(true);
      addXp(30);
    }
  };

  const resetInvestigation = () => {
    setClickedObjects({});
    setCompleted(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Introduction Card */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--accent-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BookOpen size={24} style={{ color: 'var(--accent)' }} />
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-heading)' }}>Observing Objects Around Us</h2>
        </div>
        
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Ghulan and Sheeta are excited to go to their new class after the summer break. 
          They look at their new school supplies and start talking. 
          Madam Vidya enters and asks a fascinating question: <strong>"How are objects similar or different? What materials are they made of?"</strong>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', minHeight: '450px' }}>
        {/* Interactive Classroom Scene */}
        <div className="glass-panel" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem', height: '480px', overflow: 'hidden', padding: 0, border: '2px dashed var(--accent)' }}>
          {/* Visual Classroom Canvas */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, #1e293b 0%, #0f172a 100%)', zIndex: 1 }} />
          
          {/* Classroom Background Elements (SVG style chalkboard and window) */}
          <div style={{ position: 'absolute', top: '10%', left: '10%', width: '50%', height: '35%', border: '8px solid #475569', background: '#064e3b', borderRadius: '4px', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5)' }}>
            <span style={{ fontFamily: '"Comic Sans MS", cursive', color: '#a7f3d0', fontSize: '1.1rem', textAlign: 'center', lineHeight: '1.4' }}>
              Welcome back!<br/>
              What is <strong style={{ color: '#fbbf24' }}>Material</strong>?<br/>
              Find all 6 classroom items!
            </span>
          </div>

          <div style={{ position: 'absolute', top: '10%', left: '70%', width: '25%', height: '40%', border: '6px solid #475569', background: '#38bdf8', borderRadius: '4px', zIndex: 2, overflow: 'hidden', opacity: 0.8 }}>
            <div style={{ width: '100%', height: '50%', borderBottom: '2px solid #475569' }} />
            <div style={{ width: '50%', height: '100%', borderRight: '2px solid #475569', position: 'absolute', top: 0, left: 0 }} />
          </div>

          {/* Teacher desk / Workbench SVG */}
          <div style={{ position: 'absolute', bottom: 0, left: '5%', right: '40%', height: '30%', background: '#451a03', borderTop: '6px solid #78350f', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', zIndex: 3, boxShadow: '0 -4px 15px rgba(0,0,0,0.5)' }} />

          {/* Interactive Object Anchors */}
          {classroomObjects.map((obj) => {
            const isClicked = clickedObjects[obj.id];
            return (
              <button
                key={obj.id}
                onClick={() => handleObjectClick(obj)}
                style={{
                  position: 'absolute',
                  top: obj.position.top,
                  left: obj.position.left,
                  zIndex: 10,
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  background: isClicked ? 'var(--success-bg)' : 'var(--accent-bg)',
                  color: isClicked ? 'var(--success)' : 'var(--accent-text)',
                  borderColor: isClicked ? 'var(--success-border)' : 'var(--accent-border)',
                  borderWidth: '2px',
                  borderRadius: '20px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                  cursor: isClicked ? 'default' : 'pointer',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                {isClicked ? <Check size={12} /> : null}
                {obj.name}
              </button>
            );
          })}

          {/* Character Avatars */}
          <div style={{ position: 'absolute', bottom: '5%', right: '5%', zIndex: 4, display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f59e0b', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>G</div>
              <span style={{ fontSize: '0.7rem', color: '#fff', fontWeight: 'bold', textShadow: '1px 1px 2px #000' }}>Ghulan</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ec4899', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>S</div>
              <span style={{ fontSize: '0.7rem', color: '#fff', fontWeight: 'bold', textShadow: '1px 1px 2px #000' }}>Sheeta</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#3b82f6', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>V</div>
              <span style={{ fontSize: '0.7rem', color: '#fff', fontWeight: 'bold', textShadow: '1px 1px 2px #000' }}>Madam Vidya</span>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-heading)' }}>Investigation Progress</span>
            <button onClick={resetInvestigation} className="outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', gap: '0.25rem' }}>
              <RefreshCw size={10} /> Reset
            </button>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Click on elements inside the classroom layout to reveal what material they are made of.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto' }}>
            {classroomObjects.map((obj) => {
              const isClicked = clickedObjects[obj.id];
              return (
                <div 
                  key={obj.id} 
                  style={{ 
                    padding: '0.6rem 0.8rem', 
                    borderRadius: '8px', 
                    background: isClicked ? 'var(--success-bg)' : 'var(--surface)', 
                    border: `1px solid ${isClicked ? 'var(--success-border)' : 'var(--border)'}`,
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.25rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.8rem', color: isClicked ? 'var(--success)' : 'var(--text-heading)' }}>
                      {obj.name}
                    </span>
                    {isClicked && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', background: 'var(--success)', color: '#fff', padding: '0.05rem 0.4rem', borderRadius: '4px' }}>
                        {obj.material}
                      </span>
                    )}
                  </div>
                  {isClicked && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {obj.desc}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {completed && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ padding: '0.8rem', borderRadius: '8px', background: 'var(--success-bg)', border: '1px solid var(--success-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 'bold', fontSize: '0.85rem' }}>
                <Check size={16} /> <span>All Objects Found! (+30 XP)</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                <strong>Key Concept:</strong> A <strong>material</strong> is any substance used to make objects. Different objects can be made of the same material, or one object can be made of multiple materials!
              </p>
            </motion.div>
          )}

          <button 
            disabled={!completed} 
            onClick={onComplete} 
            className="primary" 
            style={{ width: '100%', gap: '0.5rem', padding: '0.75rem', fontSize: '0.9rem' }}
          >
            <span>Proceed to Scanner Desk</span>
          </button>
        </div>
      </div>
    </div>
  );
}
