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
const CompassNeedle = ({ rotation, scale = 1 }) => (
  <div style={{ transform: `scale(${scale})`, transformOrigin: 'center', position: 'relative', width: '180px', height: '180px', flexShrink: 0, borderRadius: '50%', background: '#fff', border: '6px solid #94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 12px rgba(0,0,0,0.15)', userSelect: 'none' }}>
    <div style={{ position: 'absolute', top: '10px', fontWeight: 'bold', color: '#ef4444', fontSize: '18px' }}>N</div>
    <div style={{ position: 'absolute', bottom: '10px', fontWeight: 'bold', color: '#3b82f6', fontSize: '18px' }}>S</div>
    <div style={{ position: 'absolute', left: '10px', fontWeight: 'bold', color: '#94a3b8', fontSize: '18px' }}>W</div>
    <div style={{ position: 'absolute', right: '10px', fontWeight: 'bold', color: '#94a3b8', fontSize: '18px' }}>E</div>
    
    <motion.div
      animate={{ rotate: rotation }}
      transition={{ type: "spring", stiffness: 40, damping: 10 }}
      style={{ position: 'absolute', width: '8px', height: '140px', display: 'flex', flexDirection: 'column' }}
    >
      {/* North pointing part (Red) */}
      <div style={{ flex: 1, width: '0', height: '0', borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '70px solid #ef4444', transform: 'translateX(-8px)' }} />
      {/* South pointing part (Blue) */}
      <div style={{ flex: 1, width: '0', height: '0', borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '70px solid #3b82f6', transform: 'translateX(-8px)' }} />
    </motion.div>
    
    <div style={{ position: 'absolute', width: '18px', height: '18px', background: '#334155', borderRadius: '50%' }} />
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
       <CompassNeedle rotation={0} scale={100/180} />
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

const MaterialBlock3D = ({ type, thickness = 1 }) => {
  const getStyle = () => {
    const baseWidth = 24 + thickness * 20;
    const base = {
      width: `${baseWidth}px`,
      height: '240px',
      borderRadius: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '2px 4px 8px rgba(0,0,0,0.2)'
    };
    switch(type) {
      case 'wood':
        return {
          ...base,
          background: '#d49a6a',
          backgroundImage: 'linear-gradient(90deg, #c38755 0%, #d49a6a 20%, #c88c5a 50%, #d49a6a 80%, #b87b47 100%)',
          borderLeft: '1px solid #eab380',
          borderRight: '1px solid #a36531'
        };
      case 'cardboard':
        return {
          ...base,
          background: '#c39b6b',
          backgroundImage: 'linear-gradient(90deg, #b88d5b 0%, #c39b6b 10%, #c39b6b 90%, #a67c4b 100%)',
          border: '1px solid #a67c4b',
          borderRadius: '0px'
        };
      case 'plastic':
        return {
          ...base,
          background: '#1d4ed8',
          backgroundImage: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 20%, #2563eb 80%, #1e3a8a 100%)',
          borderRadius: '4px',
          borderLeft: '2px solid #60a5fa',
          borderRight: '2px solid #1e3a8a'
        };
      case 'glass':
        return {
          ...base,
          position: 'relative',
          borderRadius: '4px',
          border: '2px solid rgba(255,255,255,0.4)',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.35), rgba(220,230,240,0.12), rgba(255,255,255,0.28))',
          boxShadow: 'inset 0 0 15px rgba(255,255,255,0.2), inset -5px 0 10px rgba(255,255,255,0.15), inset 5px 0 10px rgba(255,255,255,0.08), 2px 4px 8px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(2px)'
        };
      default:
        return base;
    }
  };

  return (
    <div style={getStyle()}>
      {type === 'glass' && (
        <div style={{
          position: 'absolute',
          left: '4px',
          top: '6px',
          width: '4px',
          height: '224px',
          background: 'rgba(255,255,255,0.3)',
          borderRadius: '5px'
        }} />
      )}
      <span style={{ 
        transform: 'rotate(-90deg)', 
        color: type === 'glass' || type === 'plastic' ? '#fff' : '#4a3018',
        fontWeight: 'bold',
        fontSize: type === 'glass' ? '18px' : '14px',
        fontFamily: 'Arial, sans-serif',
        textTransform: 'uppercase',
        letterSpacing: type === 'glass' ? '4px' : '2px',
        opacity: 0.8
      }}>
        {type}
      </span>
    </div>
  );
};

export default function Simulation({ onComplete, onNext }) {
  const [step, setStep] = useState(1);
  const [magnetPos, setMagnetPos] = useState({ x: 350, y: 400 });
  const [compassPos, setCompassPos] = useState({ x: 750, y: 400 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [needleRotation, setNeedleRotation] = useState(0); // 0 is North (pointing up)
  const [feedback, setFeedback] = useState(null);
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const [activeDragId, setActiveDragId] = useState(null);
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [thickness, setThickness] = useState(1);
  const [observations, setObservations] = useState({
    wood: null,
    cardboard: null,
    plastic: null,
    glass: null
  });

  const handleObservation = (material, result) => {
    const newObservations = { ...observations, [material]: result };
    setObservations(newObservations);
    
    if (step === 3) {
       const allCorrect = Object.values(newObservations).every(val => val === 'deflects');
       if (allCorrect) {
         setFeedback({ type: 'success', text: '✅ Non-magnetic materials do not block magnetic fields!' });
         setTimeout(() => { setStep(4); setFeedback(null); }, 3000);
       } else {
         const isFull = Object.values(newObservations).every(val => val !== null);
         if (isFull && !allCorrect) {
           setFeedback({ type: 'info', text: 'Some observations are incorrect. The field passes through non-magnetic materials.' });
         }
       }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const { setNodeRef: setWorkspaceRef } = useDroppable({
    id: 'workspace',
  });

  const distanceModifier = ({ transform, active }) => {
    if (!active || (active.id !== 'bar_magnet' && active.id !== 'compass')) return transform;

    const minDist = activeMaterial ? 170 + (24 + thickness * 20) : 170; 

    let newX = active.id === 'bar_magnet' ? magnetPos.x + transform.x : compassPos.x + transform.x;
    let newY = active.id === 'bar_magnet' ? magnetPos.y + transform.y : compassPos.y + transform.y;
    
    let otherX = active.id === 'bar_magnet' ? compassPos.x : magnetPos.x;
    let otherY = active.id === 'bar_magnet' ? compassPos.y : magnetPos.y;

    const dx = newX - otherX;
    const dy = newY - otherY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1; // prevent divide by zero

    if (dist < minDist) {
      const angle = Math.atan2(dy, dx);
      newX = otherX + Math.cos(angle) * minDist;
      newY = otherY + Math.sin(angle) * minDist;
      
      return {
        ...transform,
        x: active.id === 'bar_magnet' ? newX - magnetPos.x : newX - compassPos.x,
        y: active.id === 'bar_magnet' ? newY - magnetPos.y : newY - compassPos.y,
      };
    }
    
    return transform;
  };

  const getNeedleRotation = (mX, mY, cX, cY, flipped, material, thick) => {
    const magnetWidth = 160;
    const nPoleX = flipped ? mX + magnetWidth / 4 : mX - magnetWidth / 4;
    const sPoleX = flipped ? mX - magnetWidth / 4 : mX + magnetWidth / 4;
    const poleY = mY;

    const distN = Math.sqrt((nPoleX - cX) ** 2 + (poleY - cY) ** 2);
    const distS = Math.sqrt((sPoleX - cX) ** 2 + (poleY - cY) ** 2);

    const minDist = Math.min(distN, distS);

    // The max center-to-center distance at thickness 5 is 294 (80 + 124 + 90).
    // The pole is 40px from the center, so pole-to-center distance is 254.
    // We set the absolute limit of the magnetic field reach to 255.
    if (minDist > 255) return 0;

    const angleToN = calculateAngle(cX, cY, nPoleX, poleY);
    const angleToS = calculateAngle(cX, cY, sPoleX, poleY);

    let targetAngle = distN < distS ? angleToN + 90 : angleToS - 90;
    
    while (targetAngle > 180) targetAngle -= 360;
    while (targetAngle < -180) targetAngle += 360;

    // Deflection drops to 0 at exactly 255. Starts dropping from 120.
    const deflectionFactor = Math.max(0, Math.min(1, 1 - (minDist - 120) / 135));
    
    return targetAngle * deflectionFactor;
  };

  const checkStepCompletion = (mX, mY, cX, cY, flipped) => {
    // No step advancement needed here, just observation
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
    
    setNeedleRotation(getNeedleRotation(mX, mY, cX, cY, isFlipped, activeMaterial, thickness));
  };

  const handleDragEnd = (event) => {
    setActiveDragId(null);
    setDragDelta({ x: 0, y: 0 });
    
    const { active, over, delta } = event;

    if (active.id === 'sidebar_compass') {
      let finalX = 750;
      let finalY = 400;
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
      let finalX = 350;
      let finalY = 400;
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
    
    setNeedleRotation(getNeedleRotation(newMX, newMY, newCX, newCY, isFlipped, activeMaterial, thickness));
    checkStepCompletion(newMX, newMY, newCX, newCY, isFlipped);
  };

  const flipMagnet = () => {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    setNeedleRotation(getNeedleRotation(magnetPos.x, magnetPos.y, compassPos.x, compassPos.y, newFlipped, activeMaterial, thickness));
    checkStepCompletion(magnetPos.x, magnetPos.y, compassPos.x, compassPos.y, newFlipped);
  };

  const handleReset = () => {
    setMagnetPos({ x: 350, y: 400 });
    setCompassPos({ x: 750, y: 400 });
    setIsFlipped(false);
    setNeedleRotation(0);
    setFeedback(null);
    setActiveMaterial(null);
    setThickness(1);
    setObservations({ wood: null, cardboard: null, plastic: null, glass: null });
    setStep(1);
  };

  useEffect(() => {
    if (step === 4) {
      onComplete();
    }
  }, [step, onComplete]);

  const renderMagneticFields = () => {
    if (step < 3) return null;
    const currentMX = magnetPos.x + (activeDragId === 'bar_magnet' ? dragDelta.x : 0);
    const currentMY = magnetPos.y + (activeDragId === 'bar_magnet' ? dragDelta.y : 0);
    
    const fieldOpacity = Math.max(0.05, 0.3 - (activeMaterial ? thickness * 0.04 : 0));

    return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', opacity: fieldOpacity }}>
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
    <DndContext sensors={sensors} modifiers={[distanceModifier]} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
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
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>Place different non-magnetic materials between the magnet and compass. Does the needle still deflect?</p>
              
              {step === 3 && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {['wood', 'cardboard', 'plastic', 'glass'].map(mat => (
                      <button 
                        key={mat}
                        onClick={() => {
                          const newMat = activeMaterial === mat ? null : mat;
                          setActiveMaterial(newMat);
                          
                          let finalMX = magnetPos.x;
                          let finalMY = magnetPos.y;
                          
                          if (newMat) {
                            const reqDist = 160 + (24 + thickness * 20);
                            const dx = magnetPos.x - compassPos.x;
                            const dy = magnetPos.y - compassPos.y;
                            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                            if (dist < reqDist) {
                              const angle = Math.atan2(dy, dx);
                              finalMX = Math.max(80, Math.min(compassPos.x + Math.cos(angle) * reqDist, 1220));
                              finalMY = Math.max(20, Math.min(compassPos.y + Math.sin(angle) * reqDist, 680));
                              setMagnetPos({ x: finalMX, y: finalMY });
                            }
                          }
                          
                          setNeedleRotation(getNeedleRotation(finalMX, finalMY, compassPos.x, compassPos.y, isFlipped, newMat, thickness));
                        }}
                        className={activeMaterial === mat ? 'primary' : 'outline'}
                        style={{ padding: '0.4rem', fontSize: '0.8rem', textTransform: 'capitalize' }}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>

                  {activeMaterial && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', background: 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                        Material Thickness: {thickness}
                      </label>
                      <input 
                        type="range" 
                        min="1" max="5" 
                        value={thickness} 
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setThickness(val);
                          
                          let finalMX = magnetPos.x;
                          let finalMY = magnetPos.y;
                          
                          const reqDist = 160 + (24 + val * 20);
                          const dx = magnetPos.x - compassPos.x;
                          const dy = magnetPos.y - compassPos.y;
                          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                          
                          if (dist < reqDist) {
                            const angle = Math.atan2(dy, dx);
                            finalMX = Math.max(80, Math.min(compassPos.x + Math.cos(angle) * reqDist, 1220));
                            finalMY = Math.max(20, Math.min(compassPos.y + Math.sin(angle) * reqDist, 680));
                            setMagnetPos({ x: finalMX, y: finalMY });
                          }
                          
                          setNeedleRotation(getNeedleRotation(finalMX, finalMY, compassPos.x, compassPos.y, isFlipped, activeMaterial, val));
                        }} 
                        style={{ width: '100%', cursor: 'pointer' }} 
                      />
                    </div>
                  )}

                  {/* Observation Table */}
                  <div style={{ background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', background: 'rgba(0,0,0,0.04)', padding: '0.5rem', fontSize: '0.7rem', fontWeight: 'bold' }}>
                      <div>Material</div>
                      <div style={{ textAlign: 'center' }}>Deflects</div>
                      <div style={{ textAlign: 'center' }}>No Deflect</div>
                    </div>
                    {['wood', 'cardboard', 'plastic', 'glass'].map(mat => (
                      <div key={mat} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', padding: '0.4rem 0.5rem', fontSize: '0.8rem', borderTop: '1px solid var(--border)', alignItems: 'center' }}>
                        <div style={{ textTransform: 'capitalize' }}>{mat}</div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <button 
                            onClick={() => handleObservation(mat, 'deflects')}
                            style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid var(--border)', background: observations[mat] === 'deflects' ? 'var(--success)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            {observations[mat] === 'deflects' && <CheckCircle2 size={12} color="white" />}
                          </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <button 
                            onClick={() => handleObservation(mat, 'no_deflect')}
                            style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid var(--border)', background: observations[mat] === 'no_deflect' ? '#ef4444' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            {observations[mat] === 'no_deflect' && <CheckCircle2 size={12} color="white" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ opacity: step >= 4 ? 1 : 0.3 }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--success)' }}>Complete</div>
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>Experiment completed! Proceed to the questions.</p>
              {step === 4 && (
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
              {activeMaterial && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ 
                    position: 'absolute', 
                    left: (compassPos.x + magnetPos.x) / 2 - (12 + thickness * 10),
                    top: (compassPos.y + magnetPos.y) / 2 - 120,
                    zIndex: 5,
                    pointerEvents: 'none'
                  }}
                >
                  <MaterialBlock3D type={activeMaterial} thickness={thickness} />
                </motion.div>
              )}
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
          </div>
        </div>

      </div>
      </div>
      
      <DragOverlay zIndex={2000}>
        {activeDragId === 'sidebar_compass' ? (
          <div style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CompassNeedle rotation={0} scale={100/180} />
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
