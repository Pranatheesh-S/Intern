import React, { useState, useEffect } from 'react';
import { Search, Lightbulb, CheckCircle2, Target } from 'lucide-react';

export default function Stage7b_SolubilityClassify({ onComplete, addXp }) {
  const [classifications, setClassifications] = useState({});

  const items = [
    { id: 'sugar', name: 'Sugar', correct: 'Soluble', image: '/images/solubility_sugar.png' },
    { id: 'salt', name: 'Salt', correct: 'Soluble', image: '/images/solubility_salt.png' },
    { id: 'chalk', name: 'Chalk Powder', correct: 'Insoluble', image: '/images/solubility_chalk.png' },
    { id: 'sand', name: 'Sand', correct: 'Insoluble', image: '/images/solubility_sand.png' },
    { id: 'sawdust', name: 'Sawdust', correct: 'Insoluble', image: '/images/solubility_sawdust.png' }
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: '100%', color: 'var(--lesson-text)', overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ background: 'var(--lesson-background)', border: '1px solid var(--lesson-border)', borderRadius: '16px', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--lesson-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold' }}>
            <Search size={32} color="var(--lesson-accent)" /> Phase 2: Table 6.5
          </h3>
          <p style={{ margin: 0, fontSize: '1.15rem', color: 'var(--lesson-secondary)', fontWeight: '500' }}>
            Now that you've tested the materials, let's classify them based on whether they disappear in water.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'white', border: '1px solid #d6d3d1', borderRadius: '12px', padding: '12px 18px', position: 'relative', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '1rem', color: 'var(--lesson-primary)', fontWeight: '600' }}>Think about what</div>
            <div style={{ fontSize: '1rem', color: 'var(--lesson-primary)', fontWeight: '600' }}>happened in the beaker!</div>
            <div style={{ position: 'absolute', right: '-8px', top: '24px', width: '16px', height: '16px', background: 'white', borderRight: '1px solid #d6d3d1', borderBottom: '1px solid #d6d3d1', transform: 'rotate(-45deg)' }} />
          </div>
          <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: '90px', height: '90px', objectFit: 'contain' }} />
        </div>
      </div>

      {/* Main Area: 50/50 Split */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, background: 'var(--lesson-background)', borderRadius: '16px', border: '1px solid var(--lesson-border)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
        
        {/* LEFT SIDE: Let us classify */}
        <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--lesson-border)', overflowY: 'auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--lesson-primary)', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
              <div style={{ background: 'var(--lesson-accent)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 'bold' }}>2</div>
              Let us classify
            </h4>
          </div>
          <p style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--lesson-secondary)', fontWeight: '500' }}>Drag each material card to the correct group.</p>

          {/* Draggables Row */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
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
                    border: '1px solid var(--lesson-border)', 
                    borderRadius: '12px', 
                    padding: '0.75rem 0.5rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: '6px',
                    opacity: isPlaced ? 0.3 : 1,
                    cursor: isPlaced ? 'default' : 'grab',
                    boxShadow: isPlaced ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '50%', padding: '8px', border: '1px solid var(--lesson-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%', mixBlendMode: 'multiply' }} draggable={false} />
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--lesson-primary)', textAlign: 'center', lineHeight: '1.2' }}>{item.name}</div>
                </div>
              );
            })}
          </div>

          {/* Drop Zones */}
          <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
            
            {/* Soluble */}
            <div 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'Soluble')}
              style={{ flex: 1, background: 'var(--lesson-success-bg)', border: '1px solid var(--lesson-success-border)', borderRadius: '16px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--lesson-success)', fontWeight: 'bold', fontSize: '1.4rem' }}>SOLUBLE</div>
                <div style={{ color: 'var(--lesson-success)', fontSize: '1rem', fontWeight: '500' }}>Disappears completely in water</div>
              </div>
              <div style={{ width: '100%', flex: 1, minHeight: '100px', border: '2px dashed var(--lesson-success-border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.75rem' }}>
                {items.filter(i => classifications[i.id] === 'Soluble').length === 0 ? (
                  <div style={{ color: 'var(--lesson-success)', fontSize: '1rem', fontWeight: '600' }}>Drop items here</div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                    {items.filter(i => classifications[i.id] === 'Soluble').map(i => (
                      <div key={i.id} style={{ background: 'white', border: '1px solid var(--lesson-success-border)', padding: '6px 12px', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--lesson-success)', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '28px', height: '28px', background: 'white', borderRadius: '50%', padding: '2px', border: '1px solid var(--lesson-success-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <img src={i.image} alt={i.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%', mixBlendMode: 'multiply' }} />
                        </div>
                        {i.name}
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
              style={{ flex: 1, background: 'var(--lesson-danger-bg)', border: '1px solid var(--lesson-danger-border)', borderRadius: '16px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--lesson-danger)', fontWeight: 'bold', fontSize: '1.4rem' }}>INSOLUBLE</div>
                <div style={{ color: 'var(--lesson-danger)', fontSize: '1rem', fontWeight: '500' }}>Does not disappear in water</div>
              </div>
              <div style={{ width: '100%', flex: 1, minHeight: '100px', border: '2px dashed var(--lesson-danger-border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.75rem' }}>
                {items.filter(i => classifications[i.id] === 'Insoluble').length === 0 ? (
                  <div style={{ color: 'var(--lesson-danger)', fontSize: '1rem', fontWeight: '600' }}>Drop items here</div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                    {items.filter(i => classifications[i.id] === 'Insoluble').map(i => (
                      <div key={i.id} style={{ background: 'white', border: '1px solid var(--lesson-danger-border)', padding: '6px 12px', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--lesson-danger)', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '28px', height: '28px', background: 'white', borderRadius: '50%', padding: '2px', border: '1px solid var(--lesson-danger-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <img src={i.image} alt={i.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%', mixBlendMode: 'multiply' }} />
                        </div>
                        {i.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE: Observation Box */}
        <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.6rem', color: 'var(--lesson-primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Observation Box
          </h4>
          <p style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: 'var(--lesson-secondary)', fontWeight: '500' }}>
            Here are your findings from the solubility simulation:
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Soluble Finding */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--lesson-border)', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'inline-block', border: '1px solid var(--lesson-success-border)', background: 'var(--lesson-success-bg)', color: 'var(--lesson-success)', padding: '4px 12px', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px' }}>
                SOLUBLE
              </div>
              <p style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--lesson-primary)', lineHeight: '1.5', fontWeight: '600' }}>
                Materials that completely dissolve and disappear in water.
              </p>
              <div style={{ fontSize: '1.1rem', color: 'var(--lesson-secondary)', fontWeight: '500' }}>
                Examples: <span style={{ color: 'var(--lesson-success)', fontWeight: 'bold' }}>{solubleItems || 'None yet'}</span>
              </div>
            </div>
            
            {/* Insoluble Finding */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--lesson-border)', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'inline-block', border: '1px solid var(--lesson-danger-border)', background: 'var(--lesson-danger-bg)', color: 'var(--lesson-danger)', padding: '4px 12px', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px' }}>
                INSOLUBLE
              </div>
              <p style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--lesson-primary)', lineHeight: '1.5', fontWeight: '600' }}>
                Materials that do not dissolve and remain visible in water.
              </p>
              <div style={{ fontSize: '1.1rem', color: 'var(--lesson-secondary)', fontWeight: '500' }}>
                Examples: <span style={{ color: 'var(--lesson-danger)', fontWeight: 'bold' }}>{insolubleItems || 'None yet'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: 'var(--lesson-background)', border: '1px solid var(--lesson-border)', borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--lesson-accent)' }}>
          <div style={{ background: 'var(--lesson-warning-bg)', padding: '8px', borderRadius: '50%' }}>
            <Target size={24} />
          </div>
          <span style={{ color: 'var(--lesson-primary)', fontSize: '1.15rem', fontWeight: 'bold' }}>Classify all the objects to complete this activity.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontWeight: 'bold', color: 'var(--lesson-text)', display: 'flex', alignItems: 'center', gap: '8px', background: isComplete ? 'var(--lesson-success-bg)' : 'white', padding: '8px 16px', borderRadius: '20px', border: `1px solid ${isComplete ? 'var(--lesson-success-border)' : '#d6d3d1'}`, transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            {isComplete ? (
              <><span style={{ color: 'var(--lesson-success)', fontSize: '1.1rem' }}>Completed!</span> <CheckCircle2 size={20} color="var(--lesson-success)" /></>
            ) : (
              <span style={{ color: 'var(--lesson-primary)', fontSize: '1.1rem' }}>{classifiedCount} / 5 Classified</span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
