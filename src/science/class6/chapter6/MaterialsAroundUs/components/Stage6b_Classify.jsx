import React, { useState, useEffect } from 'react';
import { Search, Info, GripHorizontal, Eye, EyeOff, Lightbulb, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Stage6b_Classify({ onComplete, addXp }) {
  const [classifications, setClassifications] = useState({});

  const [feedback, setFeedback] = useState(null);

  const items = [
    { id: 'tumbler', name: 'Glass tumbler', correct: 'Transparent', icon: '🥛', color: 'var(--lesson-text)', reason: 'You can see clearly through a glass tumbler.' },
    { id: 'butter', name: 'Butter paper', correct: 'Translucent', icon: '🗞️', color: 'var(--lesson-text)', reason: 'Butter paper allows some light to pass, but you cannot see clearly through it.' },
    { id: 'eraser', name: 'Eraser', correct: 'Opaque', icon: (
      <svg width="40" height="40" viewBox="0 0 50 50">
        <g transform="rotate(-15 25 25)">
          <rect x="6" y="16" width="38" height="18" rx="4" fill="#fda4af" />
          <rect x="6" y="16" width="38" height="12" rx="4" fill="#fecdd3" />
          <rect x="16" y="16" width="18" height="18" fill="#A64B27" />
          <rect x="16" y="16" width="18" height="12" fill="var(--lesson-border)" />
        </g>
      </svg>
    ), color: 'var(--lesson-text)', reason: 'An eraser completely blocks light, you cannot see through it at all.' },
    { id: 'frosted', name: 'Frosted glass', correct: 'Translucent', icon: '🌫️', color: 'var(--lesson-text)', reason: 'Frosted glass obscures the view, making things look blurry.' },
    { id: 'wood', name: 'Wooden board', correct: 'Opaque', icon: '🪵', color: 'var(--lesson-text)', reason: 'Wood completely blocks light.' },
    { id: 'window', name: 'Window glass', correct: 'Transparent', icon: '🪟', color: 'var(--lesson-text)', reason: 'Clear window glass allows you to see perfectly through it.' }
  ];

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    
    // Check if it's correct (optional: we can just let them place it and check later, but here we snap it in)
    const obj = items.find(i => i.id === id);
    if (obj.correct === category) {
      if (!classifications[id]) {
        addXp(10);
      }
      setClassifications(prev => ({ ...prev, [id]: category }));
      setFeedback(null);
    } else {
      setFeedback({ 
        message: `Incorrect! ${obj.reason} Therefore, it is ${obj.correct}.`,
        type: 'error'
      });
      setTimeout(() => setFeedback(null), 5000);
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
  const transparentItems = items.filter(i => classifications[i.id] === 'Transparent').map(i => i.name).join(', ');
  const translucentItems = items.filter(i => classifications[i.id] === 'Translucent').map(i => i.name).join(', ');
  const opaqueItems = items.filter(i => classifications[i.id] === 'Opaque').map(i => i.name).join(', ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: '100%', color: 'var(--lesson-text)', overflowY: 'auto', paddingRight: '4px' }}>
      
      {/* Header */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--lesson-border)', borderRadius: '16px', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--lesson-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Search size={24} color="#A64B27" /> Phase 2: Activity 6.6
          </h3>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--lesson-secondary)' }}>
            Now that you've observed how different materials behave in a surveillance situation, let's classify these objects into the correct groups.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
          <div style={{ background: 'var(--lesson-warning-bg)', border: '1px solid var(--lesson-warning-bg)', borderRadius: '12px', padding: '10px 15px', position: 'relative', width: '200px' }}>
            <div style={{ fontSize: '0.85rem', color: '#A64B27', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Lightbulb size={16} /> Detective Tip
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--lesson-text)', fontWeight: '500' }}>Think carefully! Where would each object belong?</div>
          </div>
        </div>
      </div>

      {/* Main Classification Area */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--lesson-border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--lesson-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#A64B27', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>1</div>
            Let us classify
          </h4>
          <div style={{ color: 'var(--lesson-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Table 6.4: Classification of objects</div>
        </div>
        <p style={{ margin: '-0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--lesson-secondary)' }}>Drag each object card to the correct group.</p>

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
                  border: '1px solid var(--lesson-border)', 
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
                  <GripHorizontal size={14} color="var(--lesson-muted)" />
                </div>
                <div style={{ fontSize: 'var(--text-2xl)' }}>{item.icon}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: item.color, textAlign: 'center' }}>{item.name}</div>
              </div>
            );
          })}
        </div>

        {/* Feedback Message */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                background: 'var(--lesson-danger-bg)', border: '1px solid var(--lesson-danger-border)', color: 'var(--lesson-danger)', 
                padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.9rem', 
                fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
                marginTop: '0.5rem'
              }}
            >
              <span>❌</span> {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drop Zones */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          
          {/* Transparent */}
          <div 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'Transparent')}
            style={{ flex: 1, background: 'var(--lesson-success-bg)', border: '1px solid var(--lesson-success-border)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#A64B27', fontWeight: 'bold', fontSize: '1.1rem' }}>Transparent</div>
              <div style={{ color: '#A64B27', fontSize: '0.85rem' }}>See clearly through</div>
            </div>
            <div style={{ width: '100%', minHeight: '100px', border: '2px dashed var(--lesson-success-border)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '1rem' }}>
              {items.filter(i => classifications[i.id] === 'Transparent').length === 0 ? (
                <>
                  <Eye size={24} color="#A64B27" />
                  <div style={{ color: '#A64B27', fontSize: '0.85rem' }}>Drop items here</div>
                </>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                  {items.filter(i => classifications[i.id] === 'Transparent').map(i => (
                    <div key={i.id} style={{ background: 'white', border: '1px solid var(--lesson-success-border)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', color: '#A64B27', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {i.icon} {i.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Translucent */}
          <div 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'Translucent')}
            style={{ flex: 1, background: 'var(--lesson-warning-bg)', border: '1px solid #D9C9A3', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#A64B27', fontWeight: 'bold', fontSize: '1.1rem' }}>Translucent</div>
              <div style={{ color: 'var(--lesson-warning)', fontSize: '0.85rem' }}>See, but not clearly</div>
            </div>
            <div style={{ width: '100%', minHeight: '100px', border: '2px dashed #fef08a', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '1rem' }}>
              {items.filter(i => classifications[i.id] === 'Translucent').length === 0 ? (
                <>
                  <Eye size={24} color="var(--lesson-warning)" />
                  <div style={{ color: '#A64B27', fontSize: '0.85rem' }}>Drop items here</div>
                </>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                  {items.filter(i => classifications[i.id] === 'Translucent').map(i => (
                    <div key={i.id} style={{ background: 'white', border: '1px solid var(--lesson-warning-border)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', color: '#A64B27', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {i.icon} {i.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Opaque */}
          <div 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'Opaque')}
            style={{ flex: 1, background: 'var(--lesson-danger-bg)', border: '1px solid var(--lesson-danger-border)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--lesson-danger)', fontWeight: 'bold', fontSize: '1.1rem' }}>Opaque</div>
              <div style={{ color: 'var(--lesson-danger)', fontSize: '0.85rem' }}>Cannot see through</div>
            </div>
            <div style={{ width: '100%', minHeight: '100px', border: '2px dashed var(--lesson-danger-border)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '1rem' }}>
              {items.filter(i => classifications[i.id] === 'Opaque').length === 0 ? (
                <>
                  <EyeOff size={24} color="var(--lesson-danger)" />
                  <div style={{ color: 'var(--lesson-danger)', fontSize: '0.85rem' }}>Drop items here</div>
                </>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                  {items.filter(i => classifications[i.id] === 'Opaque').map(i => (
                    <div key={i.id} style={{ background: 'white', border: '1px solid var(--lesson-danger-border)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--lesson-danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--lesson-border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#A64B27', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Eye size={20} /> Observation Box
        </h4>
        <p style={{ margin: '-0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--lesson-secondary)', fontWeight: '500' }}>
          Here are your observations from the surveillance simulation:
        </p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '1rem', border: '1px solid var(--lesson-border)', position: 'relative', overflow: 'hidden' }}>
            <Search size={80} color="var(--lesson-surface)" style={{ position: 'absolute', bottom: '-10px', right: '-10px', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-block', border: '1px solid var(--lesson-success-border)', color: '#A64B27', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '8px' }}>Transparent</div>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--lesson-text)', lineHeight: '1.4' }}>Objects were seen clearly through these materials.</p>
              <div style={{ fontSize: '0.85rem', color: 'var(--lesson-secondary)' }}>
                Examples observed: <span style={{ color: '#A64B27', fontWeight: 'bold' }}>{transparentItems || 'None yet'}</span>
              </div>
            </div>
          </div>
          
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '1rem', border: '1px solid var(--lesson-border)', position: 'relative', overflow: 'hidden' }}>
            <Info size={80} color="var(--lesson-surface)" style={{ position: 'absolute', bottom: '-10px', right: '-10px', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-block', border: '1px solid #D9C9A3', color: '#A64B27', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '8px' }}>Translucent</div>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--lesson-text)', lineHeight: '1.4' }}>Objects were seen, but not clearly through these materials.</p>
              <div style={{ fontSize: '0.85rem', color: 'var(--lesson-secondary)' }}>
                Examples observed: <span style={{ color: '#A64B27', fontWeight: 'bold' }}>{translucentItems || 'None yet'}</span>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '1rem', border: '1px solid var(--lesson-border)', position: 'relative', overflow: 'hidden' }}>
            <EyeOff size={80} color="var(--lesson-surface)" style={{ position: 'absolute', bottom: '-10px', right: '-10px', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-block', border: '1px solid var(--lesson-danger-border)', color: 'var(--lesson-danger)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '8px' }}>Opaque</div>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--lesson-text)', lineHeight: '1.4' }}>Objects could not be seen through these materials at all.</p>
              <div style={{ fontSize: '0.85rem', color: 'var(--lesson-secondary)' }}>
                Examples observed: <span style={{ color: 'var(--lesson-danger)', fontWeight: 'bold' }}>{opaqueItems || 'None yet'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--lesson-border)', borderRadius: '16px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#A64B27' }}>
          <Lightbulb size={20} />
          <span style={{ color: 'var(--lesson-secondary)', fontSize: '0.95rem' }}>Classify all the objects to complete this activity.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontWeight: 'bold', color: 'var(--lesson-text)', display: 'flex', alignItems: 'center', gap: '8px', background: isComplete ? 'var(--lesson-success-bg)' : 'var(--lesson-surface)', padding: '8px 16px', borderRadius: '20px', border: `1px solid ${isComplete ? 'var(--lesson-success-border)' : 'var(--lesson-border)'}`, transition: 'all 0.3s' }}>
            <img src="/images/chief_detective_blake.png" alt="Hat" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            {isComplete ? (
              <><span style={{ color: '#A64B27' }}>Completed!</span> <CheckCircle2 size={18} color="#A64B27" /></>
            ) : (
              <>{classifiedCount} / 6 Classified</>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
