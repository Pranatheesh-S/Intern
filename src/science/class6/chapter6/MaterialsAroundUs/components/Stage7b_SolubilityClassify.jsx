import React, { useState, useEffect } from 'react';
import { Search, Info, GripHorizontal, Droplets, AlertCircle, Lightbulb, CheckCircle2 } from 'lucide-react';

export default function Stage7b_SolubilityClassify({ onComplete, addXp }) {
  const [classifications, setClassifications] = useState({});

  const items = [
    { id: 'sugar', name: 'Sugar', correct: 'Soluble', icon: '🧂', color: '#1e293b' },
    { id: 'salt', name: 'Salt', correct: 'Soluble', icon: '🧂', color: '#1e293b' },
    { id: 'chalk', name: 'Chalk powder', correct: 'Insoluble', icon: '🌫️', color: '#1e293b' },
    { id: 'sand', name: 'Sand', correct: 'Insoluble', icon: '🏜️', color: '#1e293b' },
    { id: 'sawdust', name: 'Sawdust', correct: 'Insoluble', icon: '🪵', color: '#1e293b' }
  ];

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    
    const obj = items.find(i => i.id === id);
    if (obj.correct === category) {
      if (!classifications[id]) {
        addXp(10);
      }
      setClassifications(prev => ({ ...prev, [id]: category }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const classifiedCount = Object.keys(classifications).length;
  const isComplete = classifiedCount === items.length;

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => onComplete(), 2000);
    }
  }, [isComplete, onComplete]);

  // Group items for Observation Box
  const solubleItems = items.filter(i => classifications[i.id] === 'Soluble').map(i => i.name).join(', ');
  const insolubleItems = items.filter(i => classifications[i.id] === 'Insoluble').map(i => i.name).join(', ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: '100%', color: '#1e293b', overflowY: 'auto', paddingRight: '4px' }}>
      
      {/* Header */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Search size={24} color="#4f46e5" /> Phase 2: Table 6.5
          </h3>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569' }}>
            Now that you've tested the materials, let's classify them based on whether they disappear in water.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '10px 15px', position: 'relative', width: '200px' }}>
            <div style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Lightbulb size={16} /> Detective Tip
            </div>
            <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: '500' }}>Think about what happened in the beaker!</div>
          </div>
        </div>
      </div>

      {/* Main Classification Area */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#3b82f6', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>2</div>
            Let us classify
          </h4>
          <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>Table 6.5: Mixing different materials</div>
        </div>
        <p style={{ margin: '-0.5rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>Drag each material card to the correct group.</p>

        {/* Draggables Row */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
          {items.map(item => {
            const isPlaced = classifications[item.id];
            return (
              <div 
                key={item.id}
                draggable={!isPlaced}
                onDragStart={(e) => handleDragStart(e, item.id)}
                style={{ 
                  flex: 1, 
                  background: 'white', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '8px', 
                  padding: '10px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '8px',
                  opacity: isPlaced ? 0.3 : 1,
                  cursor: isPlaced ? 'default' : 'grab',
                  boxShadow: isPlaced ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                  <GripHorizontal size={14} color="#94a3b8" />
                </div>
                <div style={{ fontSize: '32px' }}>{item.icon}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: item.color, textAlign: 'center' }}>{item.name}</div>
              </div>
            );
          })}
        </div>

        {/* Drop Zones */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          
          {/* Soluble */}
          <div 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'Soluble')}
            style={{ flex: 1, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.1rem' }}>Soluble</div>
              <div style={{ color: '#22c55e', fontSize: '0.85rem' }}>Disappears completely in water</div>
            </div>
            <div style={{ width: '100%', minHeight: '100px', border: '2px dashed #bbf7d0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '1rem' }}>
              {items.filter(i => classifications[i.id] === 'Soluble').length === 0 ? (
                <>
                  <Droplets size={24} color="#22c55e" />
                  <div style={{ color: '#16a34a', fontSize: '0.85rem' }}>Drop items here</div>
                </>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                  {items.filter(i => classifications[i.id] === 'Soluble').map(i => (
                    <div key={i.id} style={{ background: 'white', border: '1px solid #86efac', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {i.icon} {i.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Insoluble */}
          <div 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'Insoluble')}
            style={{ flex: 1, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '1.1rem' }}>Insoluble</div>
              <div style={{ color: '#ef4444', fontSize: '0.85rem' }}>Does not disappear in water</div>
            </div>
            <div style={{ width: '100%', minHeight: '100px', border: '2px dashed #fecaca', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '1rem' }}>
              {items.filter(i => classifications[i.id] === 'Insoluble').length === 0 ? (
                <>
                  <AlertCircle size={24} color="#ef4444" />
                  <div style={{ color: '#dc2626', fontSize: '0.85rem' }}>Drop items here</div>
                </>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                  {items.filter(i => classifications[i.id] === 'Insoluble').map(i => (
                    <div key={i.id} style={{ background: 'white', border: '1px solid #fca5a5', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {i.icon} {i.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Observation Box */}
      <div style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #c7d2fe', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={20} /> Observation Box
        </h4>
        <p style={{ margin: '-0.5rem 0 0 0', fontSize: '0.9rem', color: '#475569', fontWeight: '500' }}>
          Here are your findings from the solubility simulation:
        </p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
            <Droplets size={80} color="#f1f5f9" style={{ position: 'absolute', bottom: '-10px', right: '-10px', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-block', border: '1px solid #bbf7d0', color: '#16a34a', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '8px' }}>Soluble</div>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#334155', lineHeight: '1.4' }}>Materials that completely dissolve and disappear in water.</p>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                Examples: <span style={{ color: '#16a34a', fontWeight: 'bold' }}>{solubleItems || 'None yet'}</span>
              </div>
            </div>
          </div>
          
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
            <AlertCircle size={80} color="#f1f5f9" style={{ position: 'absolute', bottom: '-10px', right: '-10px', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-block', border: '1px solid #fca5a5', color: '#dc2626', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '8px' }}>Insoluble</div>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#334155', lineHeight: '1.4' }}>Materials that do not dissolve and remain visible in water.</p>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                Examples: <span style={{ color: '#dc2626', fontWeight: 'bold' }}>{insolubleItems || 'None yet'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#d97706' }}>
          <Lightbulb size={20} />
          <span style={{ color: '#475569', fontSize: '0.95rem' }}>Classify all the objects to complete this activity.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', background: isComplete ? '#dcfce7' : '#f8fafc', padding: '8px 16px', borderRadius: '20px', border: `1px solid ${isComplete ? '#bbf7d0' : '#e2e8f0'}`, transition: 'all 0.3s' }}>
            <img src="/images/chief_detective_blake.png" alt="Hat" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            {isComplete ? (
              <><span style={{ color: '#16a34a' }}>Completed!</span> <CheckCircle2 size={18} color="#16a34a" /></>
            ) : (
              <>{classifiedCount} / 5 Classified</>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
