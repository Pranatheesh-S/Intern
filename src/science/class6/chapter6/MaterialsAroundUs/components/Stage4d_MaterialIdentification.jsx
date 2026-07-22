import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';

export default function Stage4d_MaterialIdentification({ onComplete, addXp }) {
  const objects = [
    { id: 'brick', name: 'Brick', match: 'clay', icon: '🧱' },
    { id: 'bottle', name: 'Water Bottle', match: 'plastic', icon: <div style={{ width: '24px', height: '50px', background: 'linear-gradient(180deg, #bae6fd 0%, #38bdf8 100%)', borderRadius: '6px 6px 12px 12px', position: 'relative', border: '2px solid #0284c7', boxShadow: 'inset -2px 0 5px rgba(0,0,0,0.2)' }}><div style={{ position: 'absolute', top: '-10px', left: '2px', width: '16px', height: '8px', background: '#0284c7', borderRadius: '2px' }} /></div> },
    { id: 'pillow', name: 'Pillow', match: 'cotton', icon: (
      <svg width="70" height="50" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <g transform="rotate(-5, 60, 40)">
          {/* Main Body */}
          <path d="M 15 15 Q 60 5 105 15 Q 115 40 105 65 Q 60 75 15 65 Q 5 40 15 15 Z" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
          {/* Top Left Ear */}
          <path d="M 15 15 Q 5 5 22 10" fill="none" stroke="#64748b" strokeWidth="2" />
          {/* Top Right Ear */}
          <path d="M 105 15 Q 115 5 98 10" fill="none" stroke="#64748b" strokeWidth="2" />
          {/* Bottom Left Ear */}
          <path d="M 15 65 Q 5 75 22 70" fill="none" stroke="#64748b" strokeWidth="2" />
          {/* Bottom Right Ear */}
          <path d="M 105 65 Q 115 75 98 70" fill="none" stroke="#64748b" strokeWidth="2" />
          {/* Seam */}
          <path d="M 18 20 Q 30 40 18 60" fill="none" stroke="#64748b" strokeWidth="2" />
          {/* Stitches */}
          <path d="M 13 30 L 22 28 M 10 40 L 25 40 M 13 50 L 22 52" fill="none" stroke="#64748b" strokeWidth="2" />
        </g>
      </svg>
    ) },
    { id: 'tumbler', name: 'Tumbler', match: 'glass', icon: '🥛' },
    { id: 'table', name: 'Table', match: 'wood', icon: '🪑' },
    { id: 'key', name: 'Key', match: 'metal', icon: '🔑' }
  ];

  const materials = [
    { id: 'metal', name: 'Metal', icon: <div style={{ width: '50px', height: '18px', background: 'linear-gradient(180deg, #cbd5e1, #f8fafc, #64748b)', borderRadius: '4px', transform: 'rotate(20deg)', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }} /> },
    { id: 'glass', name: 'Glass', icon: '🧊' },
    { id: 'plastic', name: 'Plastic', icon: (
      <svg width="60" height="50" viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
        {/* Blue Plastic Bottle */}
        <g transform="translate(15, 5)">
          <path d="M 15 0 L 25 0 L 25 10 L 35 15 L 35 60 Q 35 70 20 70 Q 5 70 5 60 L 5 15 L 15 10 Z" fill="#7dd3fc" stroke="#0284c7" strokeWidth="3" opacity="0.8" />
          <path d="M 13 -5 L 27 -5 L 27 2 L 13 2 Z" fill="#0284c7" />
          <path d="M 5 35 L 35 35" fill="none" stroke="#0284c7" strokeWidth="2" opacity="0.5" />
          <path d="M 5 45 L 35 45" fill="none" stroke="#0284c7" strokeWidth="2" opacity="0.5" />
        </g>
        {/* Red Plastic Cup */}
        <g transform="translate(50, 25)">
          <path d="M 5 0 L 40 0 L 32 50 L 13 50 Z" fill="#fca5a5" stroke="#dc2626" strokeWidth="3" opacity="0.9" />
          <path d="M 9 15 L 36 15" fill="none" stroke="#dc2626" strokeWidth="2" opacity="0.5" />
          <path d="M 11 30 L 34 30" fill="none" stroke="#dc2626" strokeWidth="2" opacity="0.5" />
        </g>
      </svg>
    ) },
    { id: 'wood', name: 'Wood', icon: '🪵' },
    { id: 'clay', name: 'Baked Clay', icon: '🧱' },
    { id: 'cotton', name: 'Cotton', icon: <div style={{ width: '50px', height: '50px', background: 'radial-gradient(circle at 30% 30%, #ffffff, #e2e8f0)', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} /> }
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
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 2 }}>
          <h3 style={{ margin: 0, fontSize: '1.6rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Search size={26} color="#6366f1" /> Material Identification Test
          </h3>
          <p style={{ margin: 0, fontSize: '1rem', color: '#334155' }}>
            Click an object, then click the material it is made of to match them.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#eef2ff', color: '#4f46e5', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', width: 'fit-content', border: '1px dashed #a5b4fc' }}>
            <Search size={16} /> Think like a detective. Observe carefully!
          </div>
        </div>
        <img src="/images/chief_detective_blake.png" alt="Detective" style={{ width: '120px', height: '120px', objectFit: 'contain', zIndex: 2 }} />
        {/* Decorative background element */}
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '200px', height: '200px', background: 'radial-gradient(circle, #e0e7ff 0%, transparent 70%)', zIndex: 1 }} />
      </div>

      {/* Main Interactive Area */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        
        {/* Step 1: Objects */}
        <div style={{ flex: 1, background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#22c55e', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>1</div>
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
                    background: isMatched ? '#f0fdf4' : '#ffffff',
                    border: `2px solid ${isMatched ? '#22c55e' : isSelected ? '#22c55e' : '#e2e8f0'}`,
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
                    <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#22c55e', color: 'white', borderRadius: '50%', padding: '2px' }}>
                      <CheckCircle size={16} />
                    </div>
                  )}
                  <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                    {obj.icon}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#334155', textAlign: 'center' }}>
                    {obj.name}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Big Arrow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowRight size={48} color="#86efac" strokeWidth={3} />
        </div>

        {/* Step 2: Materials */}
        <div style={{ flex: 1.2, background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#22c55e', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>2</div>
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
                    background: isError ? '#fef2f2' : '#ffffff',
                    border: `2px solid ${isError ? '#ef4444' : isMatched ? '#22c55e' : '#e2e8f0'}`,
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
                    <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#22c55e', color: 'white', borderRadius: '50%', padding: '2px' }}>
                      <CheckCircle size={16} />
                    </div>
                  )}
                  <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                    {mat.icon}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#334155', textAlign: 'center' }}>
                    {mat.name}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
      </div>

      {/* Evidence Board */}
      <div style={{ background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '1.2rem', transform: 'rotate(-45deg)' }}>📌</div>
          <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#166534', fontWeight: 'bold' }}>Evidence Board</h4>
          <span style={{ fontSize: '0.9rem', color: '#15803d', fontWeight: 'bold', marginLeft: '10px' }}>
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
                    background: '#ffffff', border: '1px solid #86efac', 
                    borderRadius: '8px', padding: '0.5rem', 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ position: 'absolute', top: '-10px', left: '10px', fontSize: '1.2rem' }}>📍</div>
                  <div style={{ position: 'absolute', top: '5px', right: '5px', color: '#22c55e' }}><CheckCircle size={16} /></div>
                  <div style={{ fontSize: '2.5rem' }}>{obj.icon}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#334155', marginTop: '4px', textAlign: 'center' }}>{obj.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    ➔ {materials.find(m => m.id === obj.match).name}
                  </div>
                </motion.div>
              );
            } else {
              return (
                <div key={`empty-${obj.id}`} style={{ 
                  minWidth: '110px', height: '130px', 
                  border: '2px dashed #86efac', borderRadius: '8px', 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  color: '#4ade80'
                }}>
                  <Search size={24} />
                  <div style={{ fontSize: '0.75rem', textAlign: 'center', padding: '0 8px' }}>Identify more objects</div>
                </div>
              );
            }
          })}
        </div>
      </div>

      {/* Footer Banner */}
      {matchedCount > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem' }}>🕵️</div>
            <div>
              <div style={{ fontSize: '1rem', color: '#92400e', fontWeight: 'bold' }}>
                {allMatched ? 'Case Closed!' : 'Great start, detective!'}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#b45309' }}>
                {allMatched ? "You've successfully identified all the materials for your evidence board." : "Keep going! Identify all objects to reveal the full evidence."}
              </div>
            </div>
          </div>
          <button style={{ background: 'white', border: '1px solid #c7d2fe', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#4f46e5', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}>
            <BookOpen size={18} /> View Detective Notebook
          </button>
        </motion.div>
      )}

    </div>
  );
}
