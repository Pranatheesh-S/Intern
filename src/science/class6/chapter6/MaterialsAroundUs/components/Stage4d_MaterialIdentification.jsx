import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';

export default function Stage4d_MaterialIdentification({ onComplete, addXp }) {
  const objects = [
    { id: 'brick', name: 'Brick', match: 'clay', icon: '🧱' },
    { id: 'bottle', name: 'Water Bottle', match: 'plastic', icon: <div style={{ width: '24px', height: '50px', background: 'linear-gradient(180deg, var(--lesson-surface) 0%, #A64B27 100%)', borderRadius: '6px 6px 12px 12px', position: 'relative', border: '2px solid #D9C9A3', boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.2)' }}><div style={{ position: 'absolute', top: '-10px', left: '2px', width: '16px', height: '8px', background: '#A64B27', borderRadius: '2px' }} /></div> },
    { id: 'pillow', name: 'Pillow', match: 'cotton', icon: (
      <svg width="70" height="50" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <g transform="rotate(-5, 60, 40)">
          {/* Main Body */}
          <path d="M 15 15 Q 60 5 105 15 Q 115 40 105 65 Q 60 75 15 65 Q 5 40 15 15 Z" fill="var(--lesson-surface)" stroke="var(--lesson-muted)" strokeWidth="2" />
          {/* Top Left Ear */}
          <path d="M 15 15 Q 5 5 22 10" fill="none" stroke="var(--lesson-muted)" strokeWidth="2" />
          {/* Top Right Ear */}
          <path d="M 105 15 Q 115 5 98 10" fill="none" stroke="var(--lesson-muted)" strokeWidth="2" />
          {/* Bottom Left Ear */}
          <path d="M 15 65 Q 5 75 22 70" fill="none" stroke="var(--lesson-muted)" strokeWidth="2" />
          {/* Bottom Right Ear */}
          <path d="M 105 65 Q 115 75 98 70" fill="none" stroke="var(--lesson-muted)" strokeWidth="2" />
          {/* Seam */}
          <path d="M 18 20 Q 30 40 18 60" fill="none" stroke="var(--lesson-muted)" strokeWidth="2" />
          {/* Stitches */}
          <path d="M 13 30 L 22 28 M 10 40 L 25 40 M 13 50 L 22 52" fill="none" stroke="var(--lesson-muted)" strokeWidth="2" />
        </g>
      </svg>
    ) },
    { id: 'tumbler', name: 'Tumbler', match: 'glass', icon: '🥛' },
    { id: 'table', name: 'Table', match: 'wood', icon: '🪑' },
    { id: 'key', name: 'Key', match: 'metal', icon: '🔑' }
  ];

  const materials = [
    { id: 'metal', name: 'Metal', icon: <div style={{ width: '50px', height: '18px', background: 'linear-gradient(180deg, var(--lesson-border), var(--lesson-surface), var(--lesson-muted))', borderRadius: '4px', transform: 'rotate(20deg)', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }} /> },
    { id: 'glass', name: 'Glass', icon: '🧊' },
    { id: 'plastic', name: 'Plastic', icon: (
      <svg width="60" height="50" viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
        {/* Blue Plastic Bottle */}
        <g transform="translate(15, 5)">
          <path d="M 15 0 L 25 0 L 25 10 L 35 15 L 35 60 Q 35 70 20 70 Q 5 70 5 60 L 5 15 L 15 10 Z" fill="var(--lesson-border)" stroke="#A64B27" strokeWidth="3" opacity="0.8" />
          <path d="M 13 -5 L 27 -5 L 27 2 L 13 2 Z" fill="#A64B27" />
          <path d="M 5 35 L 35 35" fill="none" stroke="#A64B27" strokeWidth="2" opacity="0.5" />
          <path d="M 5 45 L 35 45" fill="none" stroke="#A64B27" strokeWidth="2" opacity="0.5" />
        </g>
        {/* Red Plastic Cup */}
        <g transform="translate(50, 25)">
          <path d="M 5 0 L 40 0 L 32 50 L 13 50 Z" fill="var(--lesson-danger-border)" stroke="var(--lesson-danger)" strokeWidth="3" opacity="0.9" />
          <path d="M 9 15 L 36 15" fill="none" stroke="var(--lesson-danger)" strokeWidth="2" opacity="0.5" />
          <path d="M 11 30 L 34 30" fill="none" stroke="var(--lesson-danger)" strokeWidth="2" opacity="0.5" />
        </g>
      </svg>
    ) },
    { id: 'wood', name: 'Wood', icon: '🪵' },
    { id: 'clay', name: 'Baked Clay', icon: '🧱' },
    { id: 'cotton', name: 'Cotton', icon: <div style={{ width: '50px', height: '50px', background: 'radial-gradient(circle at 30% 30%, var(--lesson-surface), var(--lesson-border))', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} /> }
  ];

  const [selectedObject, setSelectedObject] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState({}); // { brick: 'clay' }
  const [errorAnim, setErrorAnim] = useState(null);

  const handleObjectClick = (id) => {
    if (matchedPairs[id]) return;
    setSelectedObject(id === selectedObject ? null : id);
  };

  const handleMaterialClick = (matId) => {
    if (!selectedObject) return;

    const obj = objects.find(o => o.id === selectedObject);
    if (obj.match === matId) {
      setMatchedPairs(prev => ({ ...prev, [obj.id]: matId }));
      setSelectedObject(null);
      addXp(15);
    } else {
      setErrorAnim(matId);
      setTimeout(() => setErrorAnim(null), 500);
    }
  };

  const matchedCount = Object.keys(matchedPairs).length;
  const allMatched = matchedCount === objects.length;

  useEffect(() => {
    if (allMatched) {
      setTimeout(() => onComplete(), 2000);
    }
  }, [allMatched, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: '1000px', margin: '0 auto', paddingBottom: '2rem' }}>
      
      {/* Header */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--lesson-border)', borderRadius: '16px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 2 }}>
          <h3 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--lesson-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Search size={26} color="#A64B27" /> Material Identification Test
          </h3>
          <p style={{ margin: 0, fontSize: '1rem', color: 'var(--lesson-text)' }}>
            Click an object, then click the material it is made of to match them.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', color: '#A64B27', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', width: 'fit-content', border: '1px dashed var(--lesson-border)' }}>
            <Search size={16} /> Think like a detective. Observe carefully!
          </div>
        </div>
        <img src="/images/chief_detective_blake.png" alt="Detective" style={{ width: '120px', height: '120px', objectFit: 'contain', zIndex: 2 }} />
        {/* Decorative background element */}
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '200px', height: '200px', background: 'radial-gradient(circle, var(--lesson-surface) 0%, transparent 70%)', zIndex: 1 }} />
      </div>

      {/* Main Interactive Area */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        
        {/* Step 1: Objects */}
        <div style={{ flex: 1, background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--lesson-border)', padding: '1.5rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--lesson-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#A64B27', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>1</div>
            Select an Object
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {objects.map(obj => {
              const isMatched = matchedPairs[obj.id];
              const isSelected = selectedObject === obj.id;
              
              return (
                <motion.div
                  key={obj.id}
                  whileHover={!isMatched ? { scale: 1.05 } : {}}
                  onClick={() => handleObjectClick(obj.id)}
                  style={{
                    background: isMatched ? 'var(--lesson-success-bg)' : 'var(--lesson-surface)',
                    border: `2px solid ${isMatched ? '#A64B27' : isSelected ? '#A64B27' : 'var(--lesson-border)'}`,
                    borderRadius: '12px',
                    padding: '1rem 0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    cursor: isMatched ? 'default' : 'pointer',
                    position: 'relative',
                    boxShadow: isSelected ? '0 0 0 3px rgba(34, 197, 94, 0.2)' : 'none',
                    aspectRatio: '1/1'
                  }}
                >
                  {isMatched && (
                    <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#A64B27', color: 'white', borderRadius: '50%', padding: '2px' }}>
                      <CheckCircle size={16} />
                    </div>
                  )}
                  <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                    {obj.icon}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--lesson-text)', textAlign: 'center' }}>
                    {obj.name}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Big Arrow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowRight size={48} color="var(--lesson-success-border)" strokeWidth={3} />
        </div>

        {/* Step 2: Materials */}
        <div style={{ flex: 1.2, background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--lesson-border)', padding: '1.5rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--lesson-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#A64B27', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>2</div>
            Choose the Material
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {materials.map(mat => {
              const isMatched = Object.values(matchedPairs).includes(mat.id);
              const isError = errorAnim === mat.id;

              return (
                <motion.div
                  key={mat.id}
                  animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  whileHover={(!isMatched && selectedObject) ? { scale: 1.05 } : {}}
                  onClick={() => handleMaterialClick(mat.id)}
                  style={{
                    background: isError ? 'var(--lesson-danger-bg)' : 'var(--lesson-surface)',
                    border: `2px solid ${isError ? 'var(--lesson-danger)' : isMatched ? '#A64B27' : 'var(--lesson-border)'}`,
                    borderRadius: '12px',
                    padding: '1rem 0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    cursor: (!isMatched && selectedObject) ? 'pointer' : 'default',
                    opacity: isMatched ? 0.7 : 1,
                    position: 'relative',
                    aspectRatio: '1/1'
                  }}
                >
                  {isMatched && (
                    <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#A64B27', color: 'white', borderRadius: '50%', padding: '2px' }}>
                      <CheckCircle size={16} />
                    </div>
                  )}
                  <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                    {mat.icon}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--lesson-text)', textAlign: 'center' }}>
                    {mat.name}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
      </div>

      {/* Evidence Board */}
      <div style={{ background: 'var(--lesson-success-bg)', border: '2px solid var(--lesson-success-border)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '1.2rem', transform: 'rotate(-45deg)' }}>📌</div>
          <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#A64B27', fontWeight: 'bold' }}>Evidence Board</h4>
          <span style={{ fontSize: '0.9rem', color: '#A64B27', fontWeight: 'bold', marginLeft: '10px' }}>
            (Materials Identified: {matchedCount} / {objects.length})
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {objects.map((obj, i) => {
            const isMatched = matchedPairs[obj.id];
            
            if (isMatched) {
              return (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={`evidence-${obj.id}`} 
                  style={{ 
                    minWidth: '110px', height: '130px', 
                    background: '#FFFFFF', border: '1px solid var(--lesson-success-border)', 
                    borderRadius: '8px', padding: '0.5rem', 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ position: 'absolute', top: '-10px', left: '10px', fontSize: '1.2rem' }}>📍</div>
                  <div style={{ position: 'absolute', top: '5px', right: '5px', color: '#A64B27' }}><CheckCircle size={16} /></div>
                  <div style={{ fontSize: '2.5rem' }}>{obj.icon}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--lesson-text)', marginTop: '4px', textAlign: 'center' }}>{obj.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#A64B27', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    ➔ {materials.find(m => m.id === obj.match).name}
                  </div>
                </motion.div>
              );
            } else {
              return (
                <div key={`empty-${obj.id}`} style={{ 
                  minWidth: '110px', height: '130px', 
                  border: '2px dashed var(--lesson-success-border)', borderRadius: '8px', 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  color: '#A64B27'
                }}>
                  <Search size={24} />
                  <div style={{ fontSize: '0.75rem', textAlign: 'center', padding: '0 8px' }}>Identify more objects</div>
                </div>
              );
            }
          })}
        </div>
      </div>



    </div>
  );
}
