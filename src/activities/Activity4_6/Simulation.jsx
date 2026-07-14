import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, RotateCcw, Compass, Activity, Eye, EyeOff, Pointer } from 'lucide-react';
import { DndContext, useSensor, useSensors, PointerSensor, TouchSensor, useDraggable, useDroppable, DragOverlay } from '@dnd-kit/core';

// Helper: Calculate angle between two points
const calculateAngle = (cx, cy, px, py) => {
  const dy = py - cy;
  const dx = px - cx;
  let theta = Math.atan2(dy, dx);
  theta *= 180 / Math.PI;
  return theta; // in degrees
};

// Compass component
const CompassNeedle = ({ rotation }) => (
  <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', background: '#fff', border: '4px solid #94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', userSelect: 'none' }}>
    <div style={{ position: 'absolute', top: '5px', fontWeight: 'bold', color: '#ef4444', fontSize: '10px' }}>N</div>
    <div style={{ position: 'absolute', bottom: '5px', fontWeight: 'bold', color: '#3b82f6', fontSize: '10px' }}>S</div>
    <div style={{ position: 'absolute', left: '5px', fontWeight: 'bold', color: '#94a3b8', fontSize: '10px' }}>W</div>
    <div style={{ position: 'absolute', right: '5px', fontWeight: 'bold', color: '#94a3b8', fontSize: '10px' }}>E</div>
    
    <motion.div
      animate={{ rotate: rotation }}
      transition={{ type: "spring", stiffness: 40, damping: 10 }}
      style={{ position: 'absolute', width: '4px', height: '80px', display: 'flex', flexDirection: 'column' }}
    >
      {/* North pointing part (Red) */}
      <div style={{ flex: 1, width: '0', height: '0', borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '40px solid #ef4444', transform: 'translateX(-4px)' }} />
      {/* South pointing part (Blue) */}
      <div style={{ flex: 1, width: '0', height: '0', borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '40px solid #3b82f6', transform: 'translateX(-4px)' }} />
    </motion.div>
    
    <div style={{ position: 'absolute', width: '10px', height: '10px', background: '#334155', borderRadius: '50%' }} />
  </div>
);

const MagnetVisual = ({ isFlipped, isDragging }) => (
  <div style={{ 
    width: '160px', height: '40px', display: 'flex', borderRadius: '4px', overflow: 'hidden', 
    boxShadow: isDragging ? '0 10px 15px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)',
    flexDirection: isFlipped ? 'row-reverse' : 'row',
    userSelect: 'none'
  }}>
    <div style={{ flex: 1, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '18px' }}>N</div>
    <div style={{ flex: 1, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '18px' }}>S</div>
  </div>
);

const DraggableMagnet = ({ isFlipped, onDoubleClick }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: 'bar_magnet',
  });

  const style = {
    opacity: isDragging ? 0 : 1,
    zIndex: 10,
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none'
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} onDoubleClick={onDoubleClick}>
      <MagnetVisual isFlipped={isFlipped} isDragging={false} />
    </div>
  );
};

// Draggable Compass
const DraggableCompass = ({ rotation }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: 'compass',
  });

  const style = {
    opacity: isDragging ? 0 : 1,
    zIndex: 10,
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none'
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <CompassNeedle rotation={rotation} />
    </div>
  );
};

const SidebarDraggableCompass = () => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: 'sidebar_compass',
  });
  
  const style = {
    opacity: isDragging ? 0 : 1,
    zIndex: 10,
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none',
    width: '100px', height: '100px',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
       <CompassNeedle rotation={0} />
    </div>
  );
};

const SidebarDraggableMagnet = () => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: 'sidebar_magnet',
  });
  
  const style = {
    opacity: isDragging ? 0 : 1,
    zIndex: 10,
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <MagnetVisual isFlipped={false} isDragging={false} />
    </div>
  );
};

export default function Simulation({ onComplete, onNext }) {
  const [step, setStep] = useState(1);
  const [magnetPos, setMagnetPos] = useState({ x: 650, y: 500 });
  const [compassPos, setCompassPos] = useState({ x: 650, y: 300 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [needleRotation, setNeedleRotation] = useState(0); // 0 is North (pointing up)
  const [feedback, setFeedback] = useState(null);
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const [activeDragId, setActiveDragId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const { setNodeRef: setWorkspaceRef } = useDroppable({
    id: 'workspace',
  });

  const getNeedleRotation = (mX, mY, cX, cY, flipped) => {
    const magnetWidth = 160;
    const nPoleX = flipped ? mX + magnetWidth / 4 : mX - magnetWidth / 4;
    const sPoleX = flipped ? mX - magnetWidth / 4 : mX + magnetWidth / 4;
    const poleY = mY;

    const distN = Math.sqrt((nPoleX - cX) ** 2 + (poleY - cY) ** 2);
    const distS = Math.sqrt((sPoleX - cX) ** 2 + (poleY - cY) ** 2);

    if (distN > 250 && distS > 250) return 0;

    const angleToN = calculateAngle(cX, cY, nPoleX, poleY);
    const angleToS = calculateAngle(cX, cY, sPoleX, poleY);

    if (distN < distS) {
      return angleToN + 90;
    } else {
      return angleToS - 90;
    }
  };

  const checkStepCompletion = (mX, mY, cX, cY, flipped) => {
    const magnetWidth = 160;
    const nPoleX = flipped ? mX + magnetWidth / 4 : mX - magnetWidth / 4;
    const sPoleX = flipped ? mX - magnetWidth / 4 : mX + magnetWidth / 4;
    const poleY = mY;

    const distN = Math.sqrt((nPoleX - cX) ** 2 + (poleY - cY) ** 2);
    const distS = Math.sqrt((sPoleX - cX) ** 2 + (poleY - cY) ** 2);

    if (distN > 250 && distS > 250) {
      setFeedback({ type: 'info', text: "Earth's magnetic field aligns the compass needle." });
      return;
    }

    if (distN < distS) {
      if (step === 3 && distN < 120 && !flipped) {
        setFeedback({ type: 'success', text: '✅ Like poles repel. Compass needle moves away!' });
        setTimeout(() => setStep(prev => prev === 3 ? 4 : prev), 2000);
      } else {
        setFeedback({ type: 'success', text: '✅ Like poles repel.' });
      }
    } else {
      if (step === 4 && distS < 120 && flipped) {
        setFeedback({ type: 'success', text: '✅ Unlike poles attract. Compass needle moves toward!' });
        setTimeout(() => setStep(prev => prev === 4 ? 5 : prev), 2000);
      } else {
        setFeedback({ type: 'success', text: '✅ Unlike poles attract.' });
      }
    }
  };

  const handleDragStart = (event) => {
    setActiveDragId(event.active.id);
  };

  const handleDragMove = (event) => {
    const { active, delta } = event;
    setDragDelta(delta);
    
    let mX = magnetPos.x;
    let mY = magnetPos.y;
    let cX = compassPos.x;
    let cY = compassPos.y;
    
    if (active.id === 'bar_magnet') {
      mX += delta.x;
      mY += delta.y;
    } else if (active.id === 'compass') {
      cX += delta.x;
      cY += delta.y;
    }
    
    setNeedleRotation(getNeedleRotation(mX, mY, cX, cY, isFlipped));
  };

  const handleDragEnd = (event) => {
    setActiveDragId(null);
    setDragDelta({ x: 0, y: 0 });
    
    const { active, over, delta } = event;

    if (active.id === 'sidebar_compass') {
      let finalX = 650;
      let finalY = 300;
      if (active.rect?.current?.translated) {
        const translatedRect = active.rect.current.translated;
        const wsEl = document.getElementById('simulation-workspace');
        if (wsEl) {
          const wsRect = wsEl.getBoundingClientRect();
          finalX = (translatedRect.left + translatedRect.width / 2) - wsRect.left;
          finalY = (translatedRect.top + translatedRect.height / 2) - wsRect.top;
          finalX = Math.max(80, Math.min(finalX, wsRect.width - 80));
          finalY = Math.max(20, Math.min(finalY, wsRect.height - 20));
        }
      }
      setCompassPos({ x: finalX, y: finalY });
      setStep(2);
      return;
    }
    
    if (active.id === 'sidebar_magnet') {
      let finalX = 650;
      let finalY = 500;
      if (active.rect?.current?.translated) {
        const translatedRect = active.rect.current.translated;
        const wsEl = document.getElementById('simulation-workspace');
        if (wsEl) {
          const wsRect = wsEl.getBoundingClientRect();
          finalX = (translatedRect.left + translatedRect.width / 2) - wsRect.left;
          finalY = (translatedRect.top + translatedRect.height / 2) - wsRect.top;
          finalX = Math.max(80, Math.min(finalX, wsRect.width - 80));
          finalY = Math.max(20, Math.min(finalY, wsRect.height - 20));
        }
      }
      setMagnetPos({ x: finalX, y: finalY });
      setStep(3);
      return;
    }

    let newMX = magnetPos.x;
    let newMY = magnetPos.y;
    let newCX = compassPos.x;
    let newCY = compassPos.y;
    
    if (active.id === 'bar_magnet') {
      newMX = Math.max(80, Math.min(magnetPos.x + delta.x, 1220));
      newMY = Math.max(20, Math.min(magnetPos.y + delta.y, 680));
      setMagnetPos({ x: newMX, y: newMY });
    } else if (active.id === 'compass') {
      newCX = Math.max(80, Math.min(compassPos.x + delta.x, 1220));
      newCY = Math.max(20, Math.min(compassPos.y + delta.y, 680));
      setCompassPos({ x: newCX, y: newCY });
    }
    
    setNeedleRotation(getNeedleRotation(newMX, newMY, newCX, newCY, isFlipped));
    checkStepCompletion(newMX, newMY, newCX, newCY, isFlipped);
  };

  const flipMagnet = () => {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    setNeedleRotation(getNeedleRotation(magnetPos.x, magnetPos.y, compassPos.x, compassPos.y, newFlipped));
    checkStepCompletion(magnetPos.x, magnetPos.y, compassPos.x, compassPos.y, newFlipped);
  };

  const handleReset = () => {
    setMagnetPos({ x: 650, y: 500 });
    setCompassPos({ x: 650, y: 300 });
    setIsFlipped(false);
    setNeedleRotation(0);
    setFeedback(null);
    setStep(1);
  };

  useEffect(() => {
    if (step === 5) {
      onComplete();
    }
  }, [step, onComplete]);

  // Handle magnetic field animation overlay
  const renderMagneticFields = () => {
    if (step < 3) return null;
    const currentMX = magnetPos.x + (activeDragId === 'bar_magnet' ? dragDelta.x : 0);
    const currentMY = magnetPos.y + (activeDragId === 'bar_magnet' ? dragDelta.y : 0);
    
    return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', opacity: 0.3 }}>
        <svg width="100%" height="100%">
          <defs>
            <linearGradient id="fieldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g transform={`translate(${currentMX}, ${currentMY}) ${isFlipped ? 'scale(-1, 1)' : ''}`}>
             <path d="M -80 0 Q 0 -150 80 0" fill="none" stroke="url(#fieldGrad)" strokeWidth="2" strokeDasharray="5,5">
               <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
             </path>
             <path d="M -80 0 Q 0 150 80 0" fill="none" stroke="url(#fieldGrad)" strokeWidth="2" strokeDasharray="5,5">
               <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
             </path>
             <path d="M -80 0 Q 0 -300 80 0" fill="none" stroke="url(#fieldGrad)" strokeWidth="2" strokeDasharray="5,5">
               <animate attributeName="stroke-dashoffset" from="100" to="0" dur="3s" repeatCount="indefinite" />
             </path>
             <path d="M -80 0 Q 0 300 80 0" fill="none" stroke="url(#fieldGrad)" strokeWidth="2" strokeDasharray="5,5">
               <animate attributeName="stroke-dashoffset" from="100" to="0" dur="3s" repeatCount="indefinite" />
             </path>
          </g>
        </svg>
      </div>
    );
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <div className="main-grid" style={{ gridTemplateColumns: "1fr", gap: "1rem", maxWidth: "1800px", margin: "0 auto", width: "100%" }}>
      
      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "1.5rem" }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Left Panel: Instructions */}
        <div className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem", background: "var(--surface)" }}>
          <h3 style={{ margin: 0, color: "var(--text-heading)", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>Instructions</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            
            <div style={{ opacity: step >= 1 ? 1 : 0.3 }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--accent)' }}>Step 1</div>
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>Take a magnetic compass and a bar magnet.</p>
              {step === 1 && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '500' }}>
                    <Pointer size={14} /> Drag into workspace
                  </div>
                  <SidebarDraggableCompass />
                </div>
              )}
            </div>

            <div style={{ opacity: step >= 2 ? 1 : 0.3 }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--accent)' }}>Step 2</div>
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>Place the compass on the surface. Observe it resting towards North.</p>
              {step === 2 && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '500' }}>
                    <Pointer size={14} /> Drag into workspace
                  </div>
                  <SidebarDraggableMagnet />
                </div>
              )}
            </div>

            <div style={{ opacity: step >= 3 ? 1 : 0.3 }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--accent)' }}>Step 3</div>
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>Bring the <strong>North Pole</strong> of the magnet near the <strong>North Pole</strong> of the compass.</p>
            </div>

            <div style={{ opacity: step >= 4 ? 1 : 0.3 }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--accent)' }}>Step 4</div>
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>Flip the magnet and bring the <strong>South Pole</strong> near the compass.</p>
            </div>
            
            <div style={{ opacity: step >= 5 ? 1 : 0.3 }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--success)' }}>Complete</div>
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>Experiment completed! Proceed to the questions.</p>
              {step === 5 && (
                <button onClick={onNext} className="primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Next <ArrowRight size={14} />
                </button>
              )}
            </div>

        </div>
        </div>
        </div>

        {/* Right Panel: Workspace */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={flipMagnet} className="outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RotateCcw size={16} /> Flip Magnet
              </button>
            </div>
            <button onClick={handleReset} className="outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Reset Workspace
            </button>
          </div>

          <div id="simulation-workspace" ref={setWorkspaceRef} className="glass-panel" style={{ position: 'relative', flex: 1, minHeight: '700px', background: 'var(--bg-color)', borderRadius: '12px', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
            
            {renderMagneticFields()}

            {/* Draggable Area */}
            <div style={{ position: 'absolute', inset: 0 }}>
              {step >= 2 && (
                <div style={{ position: 'absolute', left: compassPos.x - 50, top: compassPos.y - 50 }}>
                  <DraggableCompass rotation={needleRotation} />
                </div>
              )}
              {step >= 3 && (
                <div style={{ position: 'absolute', left: magnetPos.x - 80, top: magnetPos.y - 20 }}>
                  <DraggableMagnet isFlipped={isFlipped} onDoubleClick={flipMagnet} />
                </div>
              )}
            </div>

            {/* Feedback Overlay */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ 
                    position: 'absolute', 
                    bottom: '20px', 
                    background: feedback.type === 'success' ? 'var(--success-bg)' : 'var(--surface)', 
                    color: feedback.type === 'success' ? 'var(--success)' : 'var(--text-primary)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '24px',
                    border: `1px solid ${feedback.type === 'success' ? 'var(--success-border)' : 'var(--border)'}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  {feedback.text}
                </motion.div>
              )}
            </AnimatePresence>

            {step >= 3 && !feedback && (
              <div style={{ position: 'absolute', bottom: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.8)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                <Pointer size={16} /> Drag the magnet closer to the compass
              </div>
            )}
          </div>
        </div>

      </div>
      </div>
      
      <DragOverlay zIndex={2000}>
        {activeDragId === 'sidebar_compass' ? (
          <div style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CompassNeedle rotation={0} />
          </div>
        ) : null}
        {activeDragId === 'sidebar_magnet' ? (
          <MagnetVisual isFlipped={false} isDragging={true} />
        ) : null}
        {activeDragId === 'compass' ? (
          <CompassNeedle rotation={needleRotation} />
        ) : null}
        {activeDragId === 'bar_magnet' ? (
          <MagnetVisual isFlipped={isFlipped} isDragging={true} />
        ) : null}
      </DragOverlay>

    </DndContext>
  );
}
