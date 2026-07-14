import React, { useState } from 'react';
import { Magnet, CheckCircle, ArrowRight, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

function DraggableItem({ obj, testedStatus }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: obj.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 1,
  } : undefined;

  const iconMap = {
    'iron_key': '🔑',
    'eraser': '🧽',
    'desk': '🪵',
    'window': '🪟',
    'bottle': '🧴',
    'spoon': '🥄',
    'paperclip': (
      <svg width="1em" height="1em" viewBox="0 0 20 20" style={{ display: 'inline-block' }}>
        <path d="M6 14 V6 A4 4 0 0 1 14 6 V15 A3 3 0 0 1 8 15 V7" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    'alum_can': '🥫'
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        background: 'var(--surface-hover)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none'
      }}
      {...listeners}
      {...attributes}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <GripVertical size={16} style={{ color: 'var(--text-muted)' }} />
        <div style={{ fontSize: '1.5rem' }}>{iconMap[obj.id]}</div>
        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
          {obj.name}
        </span>
      </div>

      {testedStatus && (
        <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: testedStatus === 'magnetic' ? 'var(--success-bg)' : 'rgba(239, 68, 68, 0.1)', color: testedStatus === 'magnetic' ? 'var(--success)' : '#ef4444', fontWeight: 'bold' }}>
          {testedStatus === 'magnetic' ? 'Magnetic' : 'Non-Magnetic'}
        </span>
      )}
    </div>
  );
}

function WorkspaceArea({ children, isAllTested, selectedObjId, onComplete }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'testing-workspace',
  });

  return (
    <div
      ref={setNodeRef}
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        height: '480px',
        background: isOver ? 'var(--surface-hover)' : 'var(--surface)',
        border: isOver ? '2px dashed var(--accent)' : '1px solid var(--border)',
        transition: 'all 0.2s ease'
      }}
    >
      {isAllTested && !selectedObjId ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <CheckCircle size={64} style={{ color: 'var(--success)' }} />
          <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>All Items Tested!</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', textAlign: 'center' }}>
            You have successfully categorized all the classroom objects.
          </p>
          <button
            onClick={onComplete}
            className="primary"
            style={{ padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 'bold', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Continue to Quiz <ArrowRight size={18} />
          </button>
        </div>
      ) : children}
    </div>
  );
}

export default function MagneticTest({ objects, onComplete, addXp = () => { } }) {
  const [testedObjects, setTestedObjects] = useState({});
  const [selectedObjId, setSelectedObjId] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const selectedObj = objects.find(o => o.id === selectedObjId);
  const isAllTested = objects.length > 0 && objects.every(o => testedObjects[o.id]);

  React.useEffect(() => {
    if (isAllTested) {
      const timer = setTimeout(() => {
        setSelectedObjId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAllTested]);

  const handleTest = () => {
    if (!selectedObj || isTesting) return;

    setIsTesting(true);
    setTestResult(null);

    // Simulate testing delay
    setTimeout(() => {
      setTestResult(selectedObj.isMagnetic ? 'magnetic' : 'non-magnetic');

      if (!testedObjects[selectedObj.id]) {
        addXp(10);
      }

      setTestedObjects(prev => ({ ...prev, [selectedObj.id]: selectedObj.isMagnetic ? 'magnetic' : 'non-magnetic' }));
      setIsTesting(false);
    }, 1500);
  };

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (over && over.id === 'testing-workspace') {
      setSelectedObjId(active.id);
      setTestResult(null);
    }
  };

  const iconMap = {
    'iron_key': '🔑',
    'eraser': '🧽',
    'desk': '🪵',
    'window': '🪟',
    'bottle': '🧴',
    'spoon': '🥄',
    'paperclip': (
      <svg width="1em" height="1em" viewBox="0 0 20 20" style={{ display: 'inline-block' }}>
        <path d="M6 14 V6 A4 4 0 0 1 14 6 V15 A3 3 0 0 1 8 15 V7" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    'alum_can': '🥫'
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
        {/* Header */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--accent-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Magnet size={24} style={{ color: 'var(--accent)' }} />
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-heading)' }}>Step 2: Magnetic Property Test</h2>
          </div>

          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Now let's test the objects you collected! <strong>Drag an item from the list</strong> into the testing workspace and bring the magnet close to see if it's magnetic.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', minHeight: '480px' }}>

          {/* Testing Area */}
          <WorkspaceArea isAllTested={isAllTested} selectedObjId={selectedObjId} onComplete={onComplete}>
            {selectedObj ? (
              <>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Testing: {selectedObj.name}</h3>

                <div style={{ position: 'relative', height: '200px', width: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border)', borderRadius: '12px', background: 'var(--surface-hover)', overflow: 'hidden' }}>
                  {/* Object being tested */}
                  <div style={{ position: 'absolute', left: '60px', top: '50%', transform: 'translateY(-50%)', zIndex: 3, height: '48px', width: '48px' }}>
                    <motion.div
                      initial={{ x: 0 }}
                      animate={testResult === 'magnetic' ? { x: 30 } : { x: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      style={{ position: 'absolute', inset: 0 }}
                    >
                      <div style={{ fontSize: '3rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                        {iconMap[selectedObj.id]}
                      </div>
                    </motion.div>
                  </div>

                  {/* Magnet and Field Lines */}
                  <div style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', zIndex: 2, height: '64px', width: '64px' }}>
                    <AnimatePresence>
                      {(isTesting || testResult) && (
                        <motion.div
                          initial={{ x: 100, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 100, opacity: 0 }}
                          style={{ position: 'absolute', inset: 0 }}
                        >
                          {/* Field Lines attached to Magnet */}
                          <motion.svg
                            initial={{ opacity: 0.4 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                            style={{ position: 'absolute', right: '50px', top: '50%', transform: 'translateY(-50%)', width: '120px', height: '100px', pointerEvents: 'none', zIndex: -1 }}
                            viewBox="0 0 120 100"
                          >
                            {/* Top pole line */}
                            <path d="M 120 35 Q 60 35 0 50" fill="none" stroke="#60a5fa" strokeWidth="3" strokeDasharray="6,4" />
                            {/* Bottom pole line */}
                            <path d="M 120 65 Q 60 65 0 50" fill="none" stroke="#60a5fa" strokeWidth="3" strokeDasharray="6,4" />
                            {/* Outer curved lines */}
                            <path d="M 120 20 Q 40 20 0 50" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4,4" opacity="0.5" />
                            <path d="M 120 80 Q 40 80 0 50" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4,4" opacity="0.5" />
                          </motion.svg>

                          {/* Magnet Emoji */}
                          <div style={{ fontSize: '4rem', transform: 'rotate(90deg)', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', zIndex: 2, position: 'relative' }}>🧲</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div style={{ height: '40px' }}>
                  {isTesting ? (
                    <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Testing...</span>
                  ) : testResult ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ fontWeight: 'bold', fontSize: '1.2rem', color: testResult === 'magnetic' ? 'var(--success)' : '#ef4444' }}>
                      {testResult === 'magnetic' ? 'Magnetic! 🧲' : 'Non-Magnetic ❌'}
                    </motion.div>
                  ) : null}
                </div>

                <button
                  onClick={handleTest}
                  disabled={isTesting}
                  className="outline"
                  style={{ padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 'bold', borderRadius: '8px' }}
                >
                  {testResult ? 'Test Again' : 'Bring Magnet Closer'}
                </button>
              </>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', textAlign: 'center', pointerEvents: 'none' }}>
                Drag an item here to test it.
              </div>
            )}
          </WorkspaceArea>

          {/* Sidebar */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '480px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Collected Items</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Drag an item to the testing area.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', paddingRight: '0.5rem', paddingBottom: '1rem' }}>
              {objects.map((obj) => (
                <DraggableItem key={obj.id} obj={obj} testedStatus={testedObjects[obj.id]} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
