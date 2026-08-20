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
    width: '160px', 
    height: '44px', 
    borderRadius: '10px', 
    overflow: 'hidden', 
    display: 'flex',
    boxShadow: isDragging ? '0 15px 30px rgba(0,0,0,0.6), 0 0 25px rgba(245,158,11,0.3)' : '0 6px 16px rgba(0,0,0,0.4)',
    border: '1.5px solid rgba(255,255,255,0.35)',
    flexDirection: isFlipped ? 'row-reverse' : 'row',
    userSelect: 'none',
    background: '#18181B'
  }}>
    <div style={{
      flex: 1,
      background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.4)'
    }}>
      <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', textShadow: '0 0 8px rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.8)' }}>N</span>
    </div>
    <div style={{ width: '4px', background: 'linear-gradient(180deg, #FFFFFF 0%, #71717A 100%)', zIndex: 2 }} />
    <div style={{
      flex: 1,
      background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.4)'
    }}>
      <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', textShadow: '0 0 8px rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.8)' }}>S</span>
    </div>
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

const MaterialBlock3D = ({ type, thickness = 1 }) => {
  const getStyle = () => {
    const baseWidth = 20 + thickness * 16;
    const base = {
      width: `${baseWidth}px`,
      height: '200px',
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
          borderRadius: '6px',
          background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.85) 0%, rgba(14, 165, 233, 0.75) 30%, rgba(56, 189, 248, 0.85) 100%)',
          border: '2px solid #0284c7',
          boxShadow: '0 8px 20px rgba(2, 132, 199, 0.35), inset 0 0 12px rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(4px)'
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
          left: '6px',
          top: '6px',
          width: '4px',
          height: '188px',
          background: '#ffffff',
          borderRadius: '4px',
          opacity: 0.9
        }} />
      )}
      <span style={{ 
        transform: 'rotate(-90deg)', 
        color: '#ffffff',
        fontWeight: '900',
        fontSize: '15px',
        fontFamily: 'Arial, sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '3px',
        textShadow: '0 2px 4px rgba(0,0,0,0.4)',
        opacity: 0.95
      }}>
        {type}
      </span>
    </div>
  );
};

export default function Simulation({ onComplete, onNext }) {
  const [step, setStep] = useState(1);
  const [magnetPos, setMagnetPos] = useState({ x: 280, y: 300 });
  const [compassPos, setCompassPos] = useState({ x: 620, y: 300 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [needleRotation, setNeedleRotation] = useState(0);
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
         setTimeout(() => { setStep(4); setFeedback(null); }, 1500);
       } else {
         const isFull = Object.values(newObservations).every(val => val !== null);
         if (isFull && !allCorrect) {
           setFeedback({ type: 'info', text: 'Some observations are incorrect. Magnetic fields pass through non-magnetic materials.' });
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

    const minDist = activeMaterial ? 150 + (20 + thickness * 16) : 150; 

    let newX = active.id === 'bar_magnet' ? magnetPos.x + transform.x : compassPos.x + transform.x;
    let newY = active.id === 'bar_magnet' ? magnetPos.y + transform.y : compassPos.y + transform.y;
    
    let otherX = active.id === 'bar_magnet' ? compassPos.x : magnetPos.x;
    let otherY = active.id === 'bar_magnet' ? compassPos.y : magnetPos.y;

    const dx = newX - otherX;
    const dy = newY - otherY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

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
    const magnetWidth = 150;
    const nPoleX = flipped ? mX + magnetWidth / 4 : mX - magnetWidth / 4;
    const sPoleX = flipped ? mX - magnetWidth / 4 : mX + magnetWidth / 4;
    const poleY = mY;

    const distN = Math.sqrt((nPoleX - cX) ** 2 + (poleY - cY) ** 2);
    const distS = Math.sqrt((sPoleX - cX) ** 2 + (poleY - cY) ** 2);

    const minDist = Math.min(distN, distS);

    if (minDist > 240) return 0;

    const angleToN = calculateAngle(cX, cY, nPoleX, poleY);
    const angleToS = calculateAngle(cX, cY, sPoleX, poleY);

    let targetAngle = distN < distS ? angleToN + 90 : angleToS - 90;
    
    while (targetAngle > 180) targetAngle -= 360;
    while (targetAngle < -180) targetAngle += 360;

    const deflectionFactor = Math.max(0, Math.min(1, 1 - (minDist - 110) / 130));
    
    return targetAngle * deflectionFactor;
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
    
    const { active, delta } = event;

    if (active.id === 'sidebar_compass') {
      setCompassPos({ x: 620, y: 300 });
      setStep(2);
      return;
    }
    
    if (active.id === 'sidebar_magnet') {
      setMagnetPos({ x: 280, y: 300 });
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
    
    setNeedleRotation(getNeedleRotation(newMX, newMY, newCX, newCY, isFlipped, activeMaterial, thickness));
  };

  const flipMagnet = () => {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    setNeedleRotation(getNeedleRotation(magnetPos.x, magnetPos.y, compassPos.x, compassPos.y, newFlipped, activeMaterial, thickness));
  };

  const handleReset = () => {
    setMagnetPos({ x: 280, y: 300 });
    setCompassPos({ x: 620, y: 300 });
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
    
    const fieldOpacity = Math.max(0.05, 0.35 - (activeMaterial ? thickness * 0.04 : 0));

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
    <DndContext sensors={sensors} modifiers={[distanceModifier]} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
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
        
        {/* Left Side: Frosted Glacial Teal Panel */}
        <div style={{ 
          width: '340px', 
          flexShrink: 0, 
          padding: '1.25rem 1.35rem', 
          background: 'linear-gradient(135deg, #F0FDF9 0%, #E6F7F5 100%)', 
          border: '1.5px solid #CCECE7', 
          borderRadius: '16px',
          boxShadow: '0 8px 25px rgba(15, 118, 110, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          overflowY: 'auto',
          color: '#134E4A'
        }}>
          <h3 style={{ margin: 0, color: '#134E4A', fontSize: '1.15rem', fontWeight: 800, borderBottom: '1.5px solid #CCECE7', paddingBottom: '0.4rem' }}>
            Instructions & Observations
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
            
            <div style={{ opacity: step >= 1 ? 1 : 0.4 }}>
              <div style={{ fontWeight: '800', fontSize: '0.88rem', color: '#000000' }}>Step 1</div>
              <p style={{ fontSize: '0.85rem', margin: '0.2rem 0', color: '#000000', fontWeight: 700 }}>Take a magnetic compass and a bar magnet.</p>
              {step === 1 && (
                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.65rem', background: 'rgba(255, 255, 255, 0.75)', borderRadius: '12px', border: '2px dashed #059669' }}>
                  <div style={{ fontSize: '0.78rem', color: '#000000', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '800' }}>
                    <Pointer size={14} color="#000000" /> Drag into workspace
                  </div>
                  <SidebarDraggableCompass />
                </div>
              )}
            </div>

            <div style={{ opacity: step >= 2 ? 1 : 0.4 }}>
              <div style={{ fontWeight: '800', fontSize: '0.88rem', color: '#000000' }}>Step 2</div>
              <p style={{ fontSize: '0.85rem', margin: '0.2rem 0', color: '#000000', fontWeight: 700 }}>Place compass on surface. Observe it resting towards North.</p>
              {step === 2 && (
                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.65rem', background: 'rgba(255, 255, 255, 0.75)', borderRadius: '12px', border: '2px dashed #059669' }}>
                  <div style={{ fontSize: '0.78rem', color: '#000000', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '800' }}>
                    <Pointer size={14} color="#000000" /> Drag into workspace
                  </div>
                  <SidebarDraggableMagnet />
                </div>
              )}
            </div>

            <div style={{ opacity: step >= 3 ? 1 : 0.4 }}>
              <div style={{ fontWeight: '800', fontSize: '0.88rem', color: '#000000' }}>Step 3</div>
              <p style={{ fontSize: '0.85rem', margin: '0.2rem 0', color: '#000000', fontWeight: 700 }}>Place non-magnetic materials between magnet and compass. Test deflection.</p>
              
              {step === 3 && (
                <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    {['wood', 'cardboard', 'plastic', 'glass'].map(mat => (
                      <button 
                        key={mat}
                        onClick={() => {
                          const newMat = activeMaterial === mat ? null : mat;
                          setActiveMaterial(newMat);
                          
                          let finalMX = magnetPos.x;
                          let finalMY = magnetPos.y;
                          
                          if (newMat) {
                            const reqDist = 150 + (20 + thickness * 16);
                            const dx = magnetPos.x - compassPos.x;
                            const dy = magnetPos.y - compassPos.y;
                            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                            if (dist < reqDist) {
                              const angle = Math.atan2(dy, dx);
                              finalMX = Math.max(80, Math.min(compassPos.x + Math.cos(angle) * reqDist, 900));
                              finalMY = Math.max(20, Math.min(compassPos.y + Math.sin(angle) * reqDist, 500));
                              setMagnetPos({ x: finalMX, y: finalMY });
                            }
                          }
                          
                          setNeedleRotation(getNeedleRotation(finalMX, finalMY, compassPos.x, compassPos.y, isFlipped, newMat, thickness));
                        }}
                        style={{
                          padding: '0.45rem 0.5rem',
                          borderRadius: '10px',
                          border: 'none',
                          background: activeMaterial === mat ? 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)' : '#ffffff',
                          color: activeMaterial === mat ? '#ffffff' : '#000000',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          textTransform: 'capitalize',
                          cursor: 'pointer',
                          boxShadow: activeMaterial === mat ? '0 4px 10px rgba(244, 63, 94, 0.4)' : 'none'
                        }}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>

                  {activeMaterial && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', background: 'rgba(255, 255, 255, 0.75)', padding: '0.6rem', borderRadius: '10px', border: '1.5px solid #059669' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#000000' }}>
                        Thickness: {thickness}
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
                          
                          const reqDist = 150 + (20 + val * 16);
                          const dx = magnetPos.x - compassPos.x;
                          const dy = magnetPos.y - compassPos.y;
                          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                          
                          if (dist < reqDist) {
                            const angle = Math.atan2(dy, dx);
                            finalMX = Math.max(80, Math.min(compassPos.x + Math.cos(angle) * reqDist, 900));
                            finalMY = Math.max(20, Math.min(compassPos.y + Math.sin(angle) * reqDist, 500));
                            setMagnetPos({ x: finalMX, y: finalMY });
                          }
                          
                          setNeedleRotation(getNeedleRotation(finalMX, finalMY, compassPos.x, compassPos.y, isFlipped, activeMaterial, val));
                        }} 
                        style={{ width: '100%', cursor: 'pointer', accentColor: '#F43F5E' }} 
                      />
                    </div>
                  )}

                  {/* Observation Table */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.85)', borderRadius: '10px', border: '1.5px solid #059669', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', background: 'rgba(255, 255, 255, 0.95)', padding: '0.45rem', fontSize: '0.72rem', fontWeight: '800', color: '#000000' }}>
                      <div>Material</div>
                      <div style={{ textAlign: 'center' }}>Deflects</div>
                      <div style={{ textAlign: 'center' }}>No Deflect</div>
                    </div>
                    {['wood', 'cardboard', 'plastic', 'glass'].map(mat => (
                      <div key={mat} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', padding: '0.35rem 0.45rem', fontSize: '0.78rem', borderTop: '1px solid #059669', alignItems: 'center', color: '#000000', fontWeight: 700 }}>
                        <div style={{ textTransform: 'capitalize' }}>{mat}</div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <button 
                            onClick={() => handleObservation(mat, 'deflects')}
                            style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #059669', background: observations[mat] === 'deflects' ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            {observations[mat] === 'deflects' && <CheckCircle2 size={13} color="white" />}
                          </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <button 
                            onClick={() => handleObservation(mat, 'no_deflect')}
                            style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #059669', background: observations[mat] === 'no_deflect' ? '#ef4444' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            {observations[mat] === 'no_deflect' && <CheckCircle2 size={13} color="white" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ opacity: step >= 4 ? 1 : 0.4 }}>
              <div style={{ fontWeight: '800', fontSize: '0.88rem', color: '#000000' }}>Complete</div>
              <p style={{ fontSize: '0.85rem', margin: '0.2rem 0', color: '#000000', fontWeight: 700 }}>Experiment completed! Proceed to concept check.</p>
            </div>

          </div>
        </div>

        {/* Activity 4.3 Standardized Pop-up Modal when Experiment is Complete */}
        <AnimatePresence>
          {step === 4 && (
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
                  You have successfully verified that magnetic fields pass through non-magnetic materials like wood, cardboard, plastic, and glass!
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
            border: '1.5px solid #CCECE7', 
            borderRadius: '16px',
            boxShadow: '0 4px 14px rgba(15, 118, 110, 0.04)',
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
                background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '25px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(244, 63, 94, 0.4)'
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
                border: '1.5px solid #E2E8F0',
                color: '#64748B',
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
              {activeMaterial && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ 
                    position: 'absolute', 
                    left: (compassPos.x + magnetPos.x) / 2 - (10 + thickness * 8),
                    top: (compassPos.y + magnetPos.y) / 2 - 100,
                    zIndex: 5,
                    pointerEvents: 'none'
                  }}
                >
                  <MaterialBlock3D type={activeMaterial} thickness={thickness} />
                </motion.div>
              )}
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
                    background: '#ffffff', 
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
