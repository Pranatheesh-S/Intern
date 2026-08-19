import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, RotateCcw, Pointer, Info } from 'lucide-react';
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
const CompassNeedle = ({ rotation, scale = 1 }) => (
  <div style={{ transform: `scale(${scale})`, transformOrigin: 'center', position: 'relative', width: '160px', height: '160px', flexShrink: 0, borderRadius: '50%', background: '#fff', border: '5px solid #64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(0,0,0,0.18)', userSelect: 'none' }}>
    <div style={{ position: 'absolute', top: '8px', fontWeight: '800', color: '#ef4444', fontSize: '16px' }}>N</div>
    <div style={{ position: 'absolute', bottom: '8px', fontWeight: '800', color: '#3b82f6', fontSize: '16px' }}>S</div>
    <div style={{ position: 'absolute', left: '8px', fontWeight: '800', color: '#64748b', fontSize: '16px' }}>W</div>
    <div style={{ position: 'absolute', right: '8px', fontWeight: '800', color: '#64748b', fontSize: '16px' }}>E</div>
    
    <motion.div
      animate={{ rotate: rotation }}
      transition={{ type: "spring", stiffness: 45, damping: 12 }}
      style={{ position: 'absolute', width: '8px', height: '120px', display: 'flex', flexDirection: 'column' }}
    >
      {/* North pointing part (Red) */}
      <div style={{ flex: 1, width: '0', height: '0', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '60px solid #ef4444', transform: 'translateX(-6px)' }} />
      {/* South pointing part (Blue) */}
      <div style={{ flex: 1, width: '0', height: '0', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '60px solid #3b82f6', transform: 'translateX(-6px)' }} />
    </motion.div>
    
    <div style={{ position: 'absolute', width: '16px', height: '16px', background: '#1e293b', borderRadius: '50%' }} />
  </div>
);

const MagnetVisual = ({ isFlipped, isDragging }) => (
  <div style={{ 
    width: '150px', height: '38px', display: 'flex', borderRadius: '6px', overflow: 'hidden', 
    boxShadow: isDragging ? '0 12px 20px rgba(0,0,0,0.35)' : '0 4px 10px rgba(0,0,0,0.2)',
    flexDirection: isFlipped ? 'row-reverse' : 'row',
    userSelect: 'none'
  }}>
    <div style={{ flex: 1, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '17px' }}>N</div>
    <div style={{ flex: 1, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '17px' }}>S</div>
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
    width: '90px', height: '90px',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
       <CompassNeedle rotation={0} scale={90/160} />
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
  const [magnetPos, setMagnetPos] = useState({ x: 450, y: 350 });
  const [compassPos, setCompassPos] = useState({ x: 450, y: 180 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [needleRotation, setNeedleRotation] = useState(0);
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
    const magnetWidth = 150;
    const nPoleX = flipped ? mX + magnetWidth / 4 : mX - magnetWidth / 4;
    const sPoleX = flipped ? mX - magnetWidth / 4 : mX + magnetWidth / 4;
    const poleY = mY;

    const distN = Math.sqrt((nPoleX - cX) ** 2 + (poleY - cY) ** 2);
    const distS = Math.sqrt((sPoleX - cX) ** 2 + (poleY - cY) ** 2);

    if (distN > 220 && distS > 220) return 0;

    const angleToN = calculateAngle(cX, cY, nPoleX, poleY);
    const angleToS = calculateAngle(cX, cY, sPoleX, poleY);

    if (distN < distS) {
      return angleToN + 90;
    } else {
      return angleToS - 90;
    }
  };

  const checkStepCompletion = (mX, mY, cX, cY, flipped) => {
    const magnetWidth = 150;
    const nPoleX = flipped ? mX + magnetWidth / 4 : mX - magnetWidth / 4;
    const sPoleX = flipped ? mX - magnetWidth / 4 : mX + magnetWidth / 4;
    const poleY = mY;

    const distN = Math.sqrt((nPoleX - cX) ** 2 + (poleY - cY) ** 2);
    const distS = Math.sqrt((sPoleX - cX) ** 2 + (poleY - cY) ** 2);

    if (distN > 220 && distS > 220) {
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
        setTimeout(() => setStep(prev => prev === 4 ? 5 : prev), 1500);
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
    
    const { active, delta } = event;

    if (active.id === 'sidebar_compass') {
      setCompassPos({ x: 450, y: 180 });
      setStep(2);
      return;
    }
    
    if (active.id === 'sidebar_magnet') {
      setMagnetPos({ x: 450, y: 350 });
      setStep(3);
      return;
    }

    let newMX = magnetPos.x;
    let newMY = magnetPos.y;
    let newCX = compassPos.x;
    let newCY = compassPos.y;
    
    if (active.id === 'bar_magnet') {
      newMX = Math.max(80, Math.min(magnetPos.x + delta.x, 900));
      newMY = Math.max(20, Math.min(magnetPos.y + delta.y, 500));
      setMagnetPos({ x: newMX, y: newMY });
    } else if (active.id === 'compass') {
      newCX = Math.max(80, Math.min(compassPos.x + delta.x, 900));
      newCY = Math.max(20, Math.min(compassPos.y + delta.y, 500));
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
    setMagnetPos({ x: 450, y: 350 });
    setCompassPos({ x: 450, y: 180 });
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

  const renderMagneticFields = () => {
    if (step < 3) return null;
    const currentMX = magnetPos.x + (activeDragId === 'bar_magnet' ? dragDelta.x : 0);
    const currentMY = magnetPos.y + (activeDragId === 'bar_magnet' ? dragDelta.y : 0);
    
    return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', opacity: 0.35 }}>
        <svg width="100%" height="100%">
          <defs>
            <linearGradient id="fieldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g transform={`translate(${currentMX}, ${currentMY}) ${isFlipped ? 'scale(-1, 1)' : ''}`}>
             <path d="M -75 0 Q 0 -130 75 0" fill="none" stroke="url(#fieldGrad)" strokeWidth="2" strokeDasharray="5,5">
               <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
             </path>
             <path d="M -75 0 Q 0 130 75 0" fill="none" stroke="url(#fieldGrad)" strokeWidth="2" strokeDasharray="5,5">
               <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
             </path>
          </g>
        </svg>
      </div>
    );
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <div style={{ 
        padding: '1.25rem 1.75rem', 
        display: 'flex', 
        gap: '1.5rem', 
        height: '100%', 
        minHeight: 0, 
        overflow: 'hidden', 
        boxSizing: 'border-box',
        background: 'transparent'
      }}>
        
        {/* Left Side: Light Green Instructions Card with Black Text */}
        <div style={{ 
          width: '320px', 
          flexShrink: 0, 
          padding: '1.25rem 1.5rem', 
          background: 'linear-gradient(135deg, #F0FDF9 0%, #E6F7F5 100%)', 
          border: '1.5px solid #CCECE7', 
          borderRadius: '16px',
          boxShadow: '0 8px 25px rgba(15, 118, 110, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          overflowY: 'auto',
          color: '#134E4A'
        }}>
          <h3 style={{ margin: 0, color: '#134E4A', fontSize: '1.15rem', fontWeight: 800, borderBottom: '1.5px solid #CCECE7', paddingBottom: '0.5rem' }}>
            Activity 4.6 Instructions
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
            
            <div style={{ opacity: step >= 1 ? 1 : 0.4 }}>
              <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#134E4A' }}>Step 1</div>
              <p style={{ fontSize: '0.88rem', margin: '0.2rem 0', color: '#115E59', fontWeight: 700 }}>Take a magnetic compass and a bar magnet.</p>
              {step === 1 && (
                <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: '#FFFFFF', borderRadius: '12px', border: '1.5px dashed #0D9488' }}>
                  <div style={{ fontSize: '0.78rem', color: '#0F766E', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '800' }}>
                    <Pointer size={14} color="#0D9488" /> Drag into workspace
                  </div>
                  <SidebarDraggableCompass />
                </div>
              )}
            </div>

            <div style={{ opacity: step >= 2 ? 1 : 0.4 }}>
              <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#134E4A' }}>Step 2</div>
              <p style={{ fontSize: '0.88rem', margin: '0.2rem 0', color: '#115E59', fontWeight: 700 }}>Place compass on surface. Observe it resting towards North.</p>
              {step === 2 && (
                <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: '#FFFFFF', borderRadius: '12px', border: '1.5px dashed #0D9488' }}>
                  <div style={{ fontSize: '0.78rem', color: '#0F766E', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '800' }}>
                    <Pointer size={14} color="#0D9488" /> Drag into workspace
                  </div>
                  <SidebarDraggableMagnet />
                </div>
              )}
            </div>

            <div style={{ opacity: step >= 3 ? 1 : 0.4 }}>
              <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#134E4A' }}>Step 3</div>
              <p style={{ fontSize: '0.88rem', margin: '0.2rem 0', color: '#115E59', fontWeight: 700 }}>Bring <strong>North Pole</strong> near compass North Pole.</p>
            </div>

            <div style={{ opacity: step >= 4 ? 1 : 0.4 }}>
              <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#134E4A' }}>Step 4</div>
              <p style={{ fontSize: '0.88rem', margin: '0.2rem 0', color: '#115E59', fontWeight: 700 }}>Flip magnet and bring <strong>South Pole</strong> near compass.</p>
            </div>
            
            <div style={{ opacity: step >= 5 ? 1 : 0.4 }}>
              <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#134E4A' }}>Complete</div>
              <p style={{ fontSize: '0.88rem', margin: '0.2rem 0', color: '#115E59', fontWeight: 700 }}>Experiment completed! Proceed to concept check.</p>
            </div>

          </div>
        </div>

        {/* Standardized Pop-up Modal when Experiment is Complete */}
        <AnimatePresence>
          {step === 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100
              }}
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #CCECE7',
                  borderRadius: '30px',
                  padding: '2.5rem 3rem',
                  maxWidth: '520px',
                  width: '90%',
                  textAlign: 'center',
                  boxShadow: '0 15px 40px rgba(15, 118, 110, 0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.25rem'
                }}
              >
                <h2 style={{ margin: 0, color: '#134E4A', fontSize: '1.8rem', fontWeight: 800 }}>
                  Experiment Complete! 🎉
                </h2>

                <p style={{ margin: 0, color: '#115E59', fontSize: '1.2rem', lineHeight: '1.5', fontWeight: 600 }}>
                  You have successfully observed how bringing a magnet near a compass needle causes it to deflect!
                </p>

                <button 
                  onClick={onNext} 
                  style={{ 
                    marginTop: '0.5rem',
                    padding: '1.1rem 3rem', 
                    fontSize: '1.15rem', 
                    fontWeight: 800, 
                    borderRadius: '40px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(244, 63, 94, 0.45)'
                  }}
                >
                  Continue to Concept Check <ArrowRight size={24} color="#ffffff" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Side: Interactive Workspace & Controls */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', minHeight: 0 }}>
          
          {/* Controls Bar */}
          <div style={{ 
            padding: '0.75rem 1.25rem', 
            background: '#ffffff', 
            border: '2px solid #2563eb', 
            borderRadius: '16px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <button 
              onClick={flipMagnet} 
              style={{ 
                padding: '0.55rem 1.25rem', 
                fontSize: '0.88rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '25px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 119, 0, 0.4)'
              }}
            >
              <RotateCcw size={16} color="#ffffff" /> Flip Magnet
            </button>
            <button 
              onClick={handleReset} 
              style={{ 
                padding: '0.55rem 1.25rem', 
                fontSize: '0.88rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                background: '#ffffff',
                border: '2px solid #3b82f6',
                color: '#1e3a8a',
                borderRadius: '25px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Reset Workspace
            </button>
          </div>

          {/* Canvas Workspace */}
          <div id="simulation-workspace" ref={setWorkspaceRef} style={{ position: 'relative', flex: 1, minHeight: 0, background: '#f8fafc', border: '2px solid #cbd5e1', borderRadius: '16px', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
            
            {renderMagneticFields()}

            {/* Draggable Area */}
            <div style={{ position: 'absolute', inset: 0 }}>
              {step >= 2 && (
                <div style={{ position: 'absolute', left: compassPos.x - 80, top: compassPos.y - 80 }}>
                  <DraggableCompass rotation={needleRotation} />
                </div>
              )}
              {step >= 3 && (
                <div style={{ position: 'absolute', left: magnetPos.x - 75, top: magnetPos.y - 19 }}>
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
                    background: feedback.type === 'success' ? '#ffffff' : '#ffffff', 
                    color: feedback.type === 'success' ? '#065f46' : '#1e3a8a',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    border: `2px solid ${feedback.type === 'success' ? '#10b981' : '#3b82f6'}`,
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                    fontWeight: 800,
                    fontSize: '0.92rem'
                  }}
                >
                  {feedback.text}
                </motion.div>
              )}
            </AnimatePresence>

            {step >= 3 && !feedback && (
              <div style={{ position: 'absolute', bottom: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e3a8a', background: 'rgba(255,255,255,0.95)', border: '2px solid #3b82f6', padding: '0.5rem 1.25rem', borderRadius: '25px', fontSize: '0.88rem', fontWeight: 700 }}>
                <Pointer size={16} color="#ff7700" /> Drag magnet closer to compass
              </div>
            )}
          </div>
        </div>
      </div>

      <DragOverlay zIndex={2000}>
        {activeDragId === 'sidebar_compass' ? (
          <div style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CompassNeedle rotation={0} scale={90/160} />
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
