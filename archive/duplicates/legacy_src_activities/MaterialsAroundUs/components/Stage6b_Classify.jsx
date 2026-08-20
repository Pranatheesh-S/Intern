import React, { useState, useEffect } from 'react';
import { Check, Search } from 'lucide-react';

export default function Stage6b_Classify({ onComplete, addXp }) {
  const [classifications, setClassifications] = useState({});

  const objectsToClassify = [
    { id: 'tumbler', name: 'Glass tumbler', correct: 'Transparent', icon: '🥛' },
    { id: 'butter', name: 'Butter paper', correct: 'Translucent', icon: '📃' },
    { id: 'eraser', name: 'Eraser', correct: 'Opaque', icon: '🧽' },
    { id: 'frosted_glass', name: 'Frosted glass', correct: 'Translucent', icon: '🌫️' },
    { id: 'wood', name: 'Wooden board', correct: 'Opaque', icon: '🪵' },
    { id: 'window_glass', name: 'Window glass', correct: 'Transparent', icon: '🪟' }
  ];

  const handleClassify = (id, category) => {
    setClassifications(prev => ({ ...prev, [id]: category }));
    const obj = objectsToClassify.find(o => o.id === id);
    if (obj.correct === category) {
      addXp(10);
    }
  };

  const correctClassificationsCount = objectsToClassify.filter(o => classifications[o.id] === o.correct).length;
  const classificationComplete = correctClassificationsCount === objectsToClassify.length;

  useEffect(() => {
    if (classificationComplete) {
      setTimeout(() => onComplete(), 1500);
    }
  }, [classificationComplete, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '1000px', margin: '0 auto', paddingBottom: '2rem' }}>
      
      {/* Intro Header */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.6rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Search size={26} color="#6366f1" /> Phase 2: Activity 6.6
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', color: '#334155', lineHeight: '1.5' }}>
          Now that you've observed how different materials behave in a surveillance situation, let's classify these objects into Table 6.4!
        </p>
      </div>

      {/* Classification Table */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#22c55e', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>2</div>
            Let us classify
          </h4>
          <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Table 6.4: Classification of objects</div>
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Items Pool */}
          <div style={{ flex: '0 0 250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontWeight: 'bold', color: '#334155', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Objects to Classify</div>
            {objectsToClassify.map((obj) => {
              const isSelected = classifications[obj.id] !== undefined;
              if (isSelected) return null; // Hide if placed
              return (
                <div key={obj.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold', color: '#1e293b' }}>
                  <span style={{ fontSize: '1.2rem' }}>{obj.icon}</span> {obj.name}
                </div>
              );
            })}
            {classificationComplete && (
              <div style={{ color: '#22c55e', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <Check size={20} /> Excellent! All objects are properly classified.
              </div>
            )}
          </div>

          {/* Table 6.4 */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            
            {['Transparent', 'Translucent', 'Opaque'].map(category => (
              <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ 
                  background: category === 'Transparent' ? '#dcfce7' : category === 'Translucent' ? '#fef9c3' : '#fee2e2', 
                  color: category === 'Transparent' ? '#166534' : category === 'Translucent' ? '#854d0e' : '#991b1b', 
                  fontWeight: 'bold', textAlign: 'center', padding: '10px', borderRadius: '8px 8px 0 0', 
                  border: `1px solid ${category === 'Transparent' ? '#bbf7d0' : category === 'Translucent' ? '#fef08a' : '#fecaca'}`
                }}>
                  {category}
                </div>
                
                {/* Items placed in this category */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0 0 8px 8px', padding: '10px', minHeight: '300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {objectsToClassify.filter(o => classifications[o.id] === category).map(obj => (
                    <div key={obj.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: obj.correct === category ? '#f0fdf4' : '#fef2f2', border: `1px solid ${obj.correct === category ? '#86efac' : '#fca5a5'}`, padding: '6px 10px', borderRadius: '6px', fontSize: '0.9rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>{obj.icon}</span> {obj.name}
                    </div>
                  ))}

                  {/* Selectors for unclassified items */}
                  {objectsToClassify.filter(o => classifications[o.id] === undefined).map(obj => (
                    <button
                      key={`btn-${obj.id}`}
                      onClick={() => handleClassify(obj.id, category)}
                      style={{
                        background: 'white', border: '1px dashed #cbd5e1', padding: '6px', borderRadius: '6px', color: '#64748b', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'all 0.2s', marginTop: '4px'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#3b82f6'; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#64748b'; }}
                    >
                      Place <strong>{obj.name}</strong>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
          </div>

        </div>
      </div>

    </div>
  );
}
