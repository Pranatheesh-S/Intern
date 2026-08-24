import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  Pointer, 
  Compass as CompassIcon,
  Sparkles,
  Layers
} from 'lucide-react';
import { 
  DndContext, 
  useSensor, 
  useSensors, 
  PointerSensor, 
  TouchSensor, 
  useDraggable, 
  useDroppable, 
  DragOverlay 
} from '@dnd-kit/core';
import ExactCompass from '../components/ExactCompass.jsx';

const getBearingName = (deg) => {
  const norm = ((deg % 360) + 360) % 360;
  if (norm >= 337.5 || norm < 22.5) return 'N';
  if (norm >= 22.5 && norm < 67.5) return 'NE';
  if (norm >= 67.5 && norm < 112.5) return 'E';
  if (norm >= 112.5 && norm < 157.5) return 'SE';
  if (norm >= 157.5 && norm < 202.5) return 'S';
  if (norm >= 202.5 && norm < 247.5) return 'SW';
  if (norm >= 247.5 && norm < 292.5) return 'W';
  if (norm >= 292.5 && norm < 337.5) return 'NW';
  return '';
};

// Helper: Calculate angle between two points
const calculateAngle = (cx, cy, px, py) => {
  const dy = py - cy;
  const dx = px - cx;
  let theta = Math.atan2(dy, dx);
  return theta * (180 / Math.PI);
};

// High Quality Bar Magnet Component
const MagnetVisual = ({ isFlipped, isDragging }) => (
  <div style={{ 
    width: '160px', 
    height: '46px', 
    borderRadius: '10px', 
    overflow: 'hidden', 
    display: 'flex',
    boxShadow: isDragging ? '0 18px 36px rgba(0,0,0,0.7), 0 0 25px rgba(245,158,11,0.35)' : '0 10px 24px rgba(0,0,0,0.5)',
    border: '2px solid #334155',
    flexDirection: isFlipped ? 'row-reverse' : 'row',
    userSelect: 'none',
    background: '#1E293B'
  }}>
    <div style={{
      flex: 1,
      background: 'linear-gradient(180deg, #EF4444 0%, #B91C1C 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      color: '#FFFFFF',
      fontWeight: 900,
      fontSize: '1.15rem',
      letterSpacing: '1px',
      textShadow: '0 1px 3px rgba(0,0,0,0.5)',
      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)'
    }}>
      N
    </div>
    <div style={{ width: '4px', background: 'linear-gradient(180deg, #FFFFFF 0%, #64748B 100%)', zIndex: 2 }} />
    <div style={{
      flex: 1,
      background: 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      color: '#FFFFFF',
      fontWeight: 900,
      fontSize: '1.15rem',
      letterSpacing: '1px',
      textShadow: '0 1px 3px rgba(0,0,0,0.5)',
      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)'
    }}>
      S
    </div>
  </div>
);

const DraggableMagnet = ({ isFlipped, onDoubleClick }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: 'bar_magnet' });
  return (
    <div 
      ref={setNodeRef} 
      style={{ opacity: isDragging ? 0 : 1, zIndex: 25, cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }} 
      {...listeners} 
      {...attributes} 
      onDoubleClick={onDoubleClick}
    >
      <MagnetVisual isFlipped={isFlipped} isDragging={false} />
    </div>
  );
};

const DraggableCompass = ({ rotation }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: 'compass' });
  return (
    <div 
      ref={setNodeRef} 
      style={{ opacity: isDragging ? 0 : 1, zIndex: 20, cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }} 
      {...listeners} 
      {...attributes}
    >
      <ExactCompass rotation={rotation} size={240} />
    </div>
  );
};

const SidebarDraggableCompass = () => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: 'sidebar_compass' });
  return (
    <div ref={setNodeRef} style={{ opacity: isDragging ? 0 : 1, zIndex: 10, cursor: 'grab', touchAction: 'none' }} {...listeners} {...attributes}>
      <ExactCompass rotation={0} size={100} />
    </div>
  );
};

const SidebarDraggableMagnet = () => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: 'sidebar_magnet' });
  return (
    <div ref={setNodeRef} style={{ opacity: isDragging ? 0 : 1, zIndex: 10, cursor: 'grab', touchAction: 'none' }} {...listeners} {...attributes}>
      <MagnetVisual isFlipped={false} isDragging={false} />
    </div>
  );
};

const MaterialBlock3D = ({ type, thickness = 1 }) => {
  const baseWidth = 22 + thickness * 16;
  const baseStyle = {
    width: `${baseWidth}px`,
    height: '220px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 12px 24px rgba(0,0,0,0.35)'
  };

  const styles = {
    wood: {
      ...baseStyle,
      background: 'linear-gradient(90deg, #b87b47 0%, #d49a6a 50%, #a36531 100%)',
      borderLeft: '2px solid #fbd38d',
      borderRight: '2px solid #7b341e'
    },
    cardboard: {
      ...baseStyle,
      background: 'linear-gradient(90deg, #a67c4b 0%, #c39b6b 50%, #8c6239 100%)',
      border: '1px solid #785226'
    },
    plastic: {
      ...baseStyle,
      background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 50%, #1d4ed8 100%)',
      borderLeft: '2px solid #93c5fd',
      borderRight: '2px solid #1e3a8a'
    },
    glass: {
      ...baseStyle,
      background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.75) 0%, rgba(14, 165, 233, 0.6) 50%, rgba(56, 189, 248, 0.75) 100%)',
      border: '2px solid #38bdf8',
      backdropFilter: 'blur(6px)',
      boxShadow: '0 8px 30px rgba(56, 189, 248, 0.4)'
    }
  };

  return (
    <div style={styles[type] || baseStyle}>
      <span style={{
        transform: 'rotate(-90deg)',
        color: '#ffffff',
        fontWeight: 900,
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '3px',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
      }}>
        {type}
      </span>
    </div>
  );
};

export default function Simulation({ onComplete, onNext }) {
  const [step, setStep] = useState(1);
  const [magnetPos, setMagnetPos] = useState({ x: 200, y: 280 });
  const [compassPos, setCompassPos] = useState({ x: 560, y: 280 });
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

  // Automatically ensure clear visual gap between material barrier and magnet/compass
  useEffect(() => {
    if (activeMaterial) {
      const matWidth = 22 + thickness * 16;
      const requiredDist = 200 + matWidth + 60; // 80 (magnet) + 120 (compass) + matWidth + 60px clearance
      const dx = compassPos.x - magnetPos.x;
      const dy = compassPos.y - magnetPos.y;
      const currentDist = Math.hypot(dx, dy) || 1;

      if (currentDist < requiredDist) {
        const ws = document.getElementById('simulation-workspace');
        const rect = ws ? ws.getBoundingClientRect() : { width: 750, height: 500 };
        const W = rect.width;
        const H = rect.height;

        const angle = Math.atan2(dy, dx);
        const midX = (magnetPos.x + compassPos.x) / 2;
        const midY = (magnetPos.y + compassPos.y) / 2;

        let newMX = midX - Math.cos(angle) * (requiredDist / 2);
        let newMY = midY - Math.sin(angle) * (requiredDist / 2);
        let newCX = midX + Math.cos(angle) * (requiredDist / 2);
        let newCY = midY + Math.sin(angle) * (requiredDist / 2);

        newMX = Math.max(90, Math.min(W - 90, newMX));
        newMY = Math.max(35, Math.min(H - 35, newMY));
        newCX = Math.max(130, Math.min(W - 130, newCX));
        newCY = Math.max(130, Math.min(H - 130, newCY));

        setMagnetPos({ x: newMX, y: newMY });
        setCompassPos({ x: newCX, y: newCY });
        setNeedleRotation(getNeedleRotation(newMX, newMY, newCX, newCY, isFlipped));
      }
    }
  }, [activeMaterial, thickness]);

  const handleObservation = (material, result) => {
    const newObservations = { ...observations, [material]: result };
    setObservations(newObservations);

    if (step === 3) {
      const allCorrect = Object.values(newObservations).every(val => val === 'deflects');
      if (allCorrect) {
        setFeedback({ type: 'success', text: '✅ Great job! Non-magnetic materials do not block magnetic field lines!' });
        setTimeout(() => { setStep(4); setFeedback(null); }, 1500);
      } else {
        const isFull = Object.values(newObservations).every(val => val !== null);
        if (isFull && !allCorrect) {
          setFeedback({ type: 'info', text: 'Remember: Magnetic induction passes through wood, glass, plastic, and cardboard.' });
        }
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const { setNodeRef: setWorkspaceRef } = useDroppable({ id: 'workspace' });

  const distanceModifier = ({ transform, active }) => {
    if (!active || (active.id !== 'bar_magnet' && active.id !== 'compass')) return transform;

    const ws = document.getElementById('simulation-workspace');
    const rect = ws ? ws.getBoundingClientRect() : { width: 700, height: 500 };
    const W = rect.width;
    const H = rect.height;

    const isMag = active.id === 'bar_magnet';
    const minX = isMag ? 90 : 130;
    const maxX = isMag ? Math.max(minX, W - 90) : Math.max(minX, W - 130);
    const minY = isMag ? 35 : 130;
    const maxY = isMag ? Math.max(minY, H - 35) : Math.max(minY, H - 130);

    let newX = isMag ? magnetPos.x + transform.x : compassPos.x + transform.x;
    let newY = isMag ? magnetPos.y + transform.y : compassPos.y + transform.y;

    // Clamp strictly within activity workspace bounds
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));

    // Minimum distance ensuring clear air gaps on both sides of material barrier
    const matWidth = 22 + thickness * 16;
    const minDist = activeMaterial ? (200 + matWidth + 60) : 225;

    let otherX = isMag ? compassPos.x : magnetPos.x;
    let otherY = isMag ? compassPos.y : magnetPos.y;

    const dx = newX - otherX;
    const dy = newY - otherY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    if (dist < minDist) {
      const angle = Math.atan2(dy, dx);
      newX = otherX + Math.cos(angle) * minDist;
      newY = otherY + Math.sin(angle) * minDist;

      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));
    }

    return {
      ...transform,
      x: isMag ? newX - magnetPos.x : newX - compassPos.x,
      y: isMag ? newY - magnetPos.y : newY - compassPos.y,
    };
  };

  const getNeedleRotation = (mX, mY, cX, cY, flipped) => {
    const magnetWidth = 160;
    const nPoleX = flipped ? mX + magnetWidth / 4 : mX - magnetWidth / 4;
    const sPoleX = flipped ? mX - magnetWidth / 4 : mX + magnetWidth / 4;
    const poleY = mY;

    const distN = Math.sqrt((nPoleX - cX) ** 2 + (poleY - cY) ** 2);
    const distS = Math.sqrt((sPoleX - cX) ** 2 + (poleY - cY) ** 2);
    const minDist = Math.min(distN, distS);

    if (minDist > 450) return 0;

    const angleToN = calculateAngle(cX, cY, nPoleX, poleY);
    const angleToS = calculateAngle(cX, cY, sPoleX, poleY);

    let targetAngle = distN < distS ? angleToN + 90 : angleToS - 90;
    while (targetAngle > 180) targetAngle -= 360;
    while (targetAngle < -180) targetAngle += 360;

    const deflectionFactor = Math.max(0, Math.min(1, 1 - (minDist - 160) / 280));
    return targetAngle * deflectionFactor;
  };

  const handleDragStart = (event) => setActiveDragId(event.active.id);

  const handleDragMove = (event) => {
    const { active, delta } = event;
    setDragDelta(delta);

    const ws = document.getElementById('simulation-workspace');
    const rect = ws ? ws.getBoundingClientRect() : { width: 700, height: 500 };
    const W = rect.width;
    const H = rect.height;

    let mX = active.id === 'bar_magnet' ? Math.max(90, Math.min(W - 90, magnetPos.x + delta.x)) : magnetPos.x;
    let mY = active.id === 'bar_magnet' ? Math.max(35, Math.min(H - 35, magnetPos.y + delta.y)) : magnetPos.y;
    let cX = active.id === 'compass' ? Math.max(130, Math.min(W - 130, compassPos.x + delta.x)) : compassPos.x;
    let cY = active.id === 'compass' ? Math.max(130, Math.min(H - 130, compassPos.y + delta.y)) : compassPos.y;

    setNeedleRotation(getNeedleRotation(mX, mY, cX, cY, isFlipped));
  };

  const handleDragEnd = (event) => {
    setActiveDragId(null);
    setDragDelta({ x: 0, y: 0 });
    const { active, delta } = event;

    const ws = document.getElementById('simulation-workspace');
    const rect = ws ? ws.getBoundingClientRect() : { width: 700, height: 500 };
    const W = rect.width;
    const H = rect.height;

    if (active.id === 'sidebar_compass') {
      const defaultCX = Math.max(130, Math.min(W - 130, W * 0.72));
      const defaultCY = Math.max(130, Math.min(H - 130, H * 0.5));
      setCompassPos({ x: defaultCX, y: defaultCY });
      setStep(2);
      return;
    }
    if (active.id === 'sidebar_magnet') {
      const defaultMX = Math.max(90, Math.min(W - 90, W * 0.25));
      const defaultMY = Math.max(35, Math.min(H - 35, H * 0.5));
      setMagnetPos({ x: defaultMX, y: defaultMY });
      setStep(3);
      return;
    }

    let newMX = active.id === 'bar_magnet' ? Math.max(90, Math.min(W - 90, magnetPos.x + delta.x)) : magnetPos.x;
    let newMY = active.id === 'bar_magnet' ? Math.max(35, Math.min(H - 35, magnetPos.y + delta.y)) : magnetPos.y;
    let newCX = active.id === 'compass' ? Math.max(130, Math.min(W - 130, compassPos.x + delta.x)) : compassPos.x;
    let newCY = active.id === 'compass' ? Math.max(130, Math.min(H - 130, compassPos.y + delta.y)) : compassPos.y;

    const matWidth = 22 + thickness * 16;
    const minDist = activeMaterial ? (200 + matWidth + 60) : 225;
    const dx = newCX - newMX;
    const dy = newCY - newMY;
    const dist = Math.hypot(dx, dy) || 1;

    if (dist < minDist) {
      const angle = Math.atan2(dy, dx);
      if (active.id === 'bar_magnet') {
        newMX = Math.max(90, Math.min(W - 90, newCX - Math.cos(angle) * minDist));
        newMY = Math.max(35, Math.min(H - 35, newCY - Math.sin(angle) * minDist));
      } else {
        newCX = Math.max(130, Math.min(W - 130, newMX + Math.cos(angle) * minDist));
        newCY = Math.max(130, Math.min(H - 130, newMY + Math.sin(angle) * minDist));
      }
    }

    if (active.id === 'bar_magnet') setMagnetPos({ x: newMX, y: newMY });
    if (active.id === 'compass') setCompassPos({ x: newCX, y: newCY });

    setNeedleRotation(getNeedleRotation(newMX, newMY, newCX, newCY, isFlipped));
  };

  const flipMagnet = () => {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    setNeedleRotation(getNeedleRotation(magnetPos.x, magnetPos.y, compassPos.x, compassPos.y, newFlipped));
  };

  const handleReset = () => {
    setMagnetPos({ x: 200, y: 280 });
    setCompassPos({ x: 560, y: 280 });
    setIsFlipped(false);
    setNeedleRotation(0);
    setFeedback(null);
    setActiveMaterial(null);
    setThickness(1);
    setObservations({ wood: null, cardboard: null, plastic: null, glass: null });
    setStep(1);
  };

  useEffect(() => {
    if (step === 4 && onComplete) onComplete();
  }, [step, onComplete]);

  return (
    <DndContext sensors={sensors} modifiers={[distanceModifier]} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <div style={{
        padding: '0.75rem 1rem',
        display: 'grid',
        gridTemplateColumns: '330px 1fr',
        gap: '1rem',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        
        {/* Left Column: Glass Instructions Panel */}
        <div style={{
          padding: '1.2rem',
          background: 'rgba(255, 255, 255, 0.94)',
          border: '1.5px solid #A7F3D0',
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(6, 78, 59, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1.5px solid #E2E8F0', paddingBottom: '0.5rem' }}>
            <CompassIcon size={20} color="#D97706" />
            <h3 style={{ margin: 0, color: '#064E3B', fontSize: '1.05rem', fontWeight: 900 }}>
              Instructions & Observations
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
            
            {/* Step 1 */}
            <div style={{ opacity: step >= 1 ? 1 : 0.45 }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#064E3B' }}>Step 1</div>
              <p style={{ fontSize: '0.8rem', margin: '0.2rem 0', color: '#334155', fontWeight: 600 }}>Take a magnetic compass and a bar magnet.</p>
              {step === 1 && (
                <div style={{ marginTop: '0.4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', padding: '0.6rem', background: '#FEF3C7', borderRadius: '12px', border: '2px dashed #D97706' }}>
                  <div style={{ fontSize: '0.75rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 800 }}>
                    <Pointer size={14} /> Drag into workspace
                  </div>
                  <SidebarDraggableCompass />
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div style={{ opacity: step >= 2 ? 1 : 0.45 }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#064E3B' }}>Step 2</div>
              <p style={{ fontSize: '0.8rem', margin: '0.2rem 0', color: '#334155', fontWeight: 600 }}>Place compass on surface. Observe it resting towards North.</p>
              {step === 2 && (
                <div style={{ marginTop: '0.4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', padding: '0.6rem', background: '#FEF3C7', borderRadius: '12px', border: '2px dashed #D97706' }}>
                  <div style={{ fontSize: '0.75rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 800 }}>
                    <Pointer size={14} /> Drag into workspace
                  </div>
                  <SidebarDraggableMagnet />
                </div>
              )}
            </div>

            {/* Step 3 */}
            <div style={{ opacity: step >= 3 ? 1 : 0.45 }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#064E3B' }}>Step 3</div>
              <p style={{ fontSize: '0.8rem', margin: '0.2rem 0', color: '#334155', fontWeight: 600 }}>Place non-magnetic materials between magnet and compass. Test deflection.</p>
              {step === 3 && (
                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.35rem' }}>
                    {['wood', 'cardboard', 'plastic', 'glass'].map(mat => (
                      <button
                        key={mat}
                        onClick={() => setActiveMaterial(activeMaterial === mat ? null : mat)}
                        style={{
                          padding: '0.45rem',
                          borderRadius: '8px',
                          border: 'none',
                          background: activeMaterial === mat ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#F1F5F9',
                          color: activeMaterial === mat ? '#ffffff' : '#334155',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          textTransform: 'capitalize',
                          cursor: 'pointer'
                        }}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>

                  {activeMaterial && (
                    <div style={{ background: '#F8FAFC', padding: '0.5rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155' }}>
                        Barrier Thickness: {thickness}
                      </label>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        value={thickness} 
                        onChange={(e) => setThickness(Number(e.target.value))} 
                        style={{ width: '100%', cursor: 'pointer', accentColor: '#D97706' }} 
                      />
                    </div>
                  )}

                  {/* Observation Table */}
                  <div style={{ background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', background: '#F1F5F9', padding: '0.35rem 0.5rem', fontSize: '0.7rem', fontWeight: 800, color: '#475569' }}>
                      <div>Material</div>
                      <div style={{ textAlign: 'center' }}>Deflects</div>
                      <div style={{ textAlign: 'center' }}>Blocked</div>
                    </div>
                    {['wood', 'cardboard', 'plastic', 'glass'].map(mat => (
                      <div key={mat} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', padding: '0.3rem 0.5rem', fontSize: '0.75rem', borderTop: '1px solid #F1F5F9', alignItems: 'center' }}>
                        <div style={{ textTransform: 'capitalize', fontWeight: 700 }}>{mat}</div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleObservation(mat, 'deflects')}
                            style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1.5px solid #10B981', background: observations[mat] === 'deflects' ? '#10B981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            {observations[mat] === 'deflects' && <CheckCircle2 size={12} color="white" />}
                          </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleObservation(mat, 'no_deflect')}
                            style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1.5px solid #EF4444', background: observations[mat] === 'no_deflect' ? '#EF4444' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
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

            {/* Complete Step */}
            <div style={{ opacity: step >= 4 ? 1 : 0.45 }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#064E3B' }}>Complete</div>
              <p style={{ fontSize: '0.8rem', margin: '0.2rem 0', color: '#334155', fontWeight: 600 }}>Experiment completed! Proceed to concept check.</p>
            </div>

          </div>
        </div>

        {/* Right Column: Ocean Themed Simulation Stage */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem', height: '100%', minHeight: 0 }}>
          
          {/* Top Controls Bar */}
          <div style={{ 
            padding: '0.5rem 1rem', 
            background: '#FFFFFF', 
            border: '1.5px solid #A7F3D0', 
            borderRadius: '16px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            boxShadow: '0 4px 14px rgba(6, 78, 59, 0.04)'
          }}>
            <button
              onClick={flipMagnet}
              style={{
                padding: '0.45rem 1.1rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                borderRadius: '20px',
                border: 'none',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
              }}
            >
              <RotateCcw size={14} /> Flip Magnet Poles
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '0.45rem 1.1rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '20px',
                border: '1.5px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Reset Workspace
            </button>
          </div>

          {/* Deep Ocean Interactive Workspace */}
          <div 
            id="simulation-workspace" 
            ref={setWorkspaceRef} 
            style={{
              position: 'relative',
              flex: 1,
              minHeight: 0,
              borderRadius: '20px',
              overflow: 'hidden',
              border: '2px solid #A7F3D0',
              background: 'radial-gradient(ellipse at center, #1E3A8A 0%, #0F172A 100%)',
              boxShadow: 'inset 0 0 70px rgba(0,0,0,0.5)'
            }}
          >
            {/* Compass Live Bearing Tag */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              background: 'rgba(255, 253, 245, 0.95)',
              border: '1.5px solid #EADBB6',
              borderRadius: '16px',
              padding: '0.4rem 0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#78350F', fontSize: '0.82rem', fontWeight: 900 }}>
                <CompassIcon size={16} color="#D97706" />
                <span>BEARING: <strong style={{ color: '#C2410C' }}>{Math.round((needleRotation % 360 + 360) % 360)}°</strong> {getBearingName(needleRotation)}</span>
              </div>
            </div>

            {/* Draggable Objects Stage */}
            <div style={{ position: 'absolute', inset: 0 }}>
              {activeMaterial && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    position: 'absolute',
                    left: (compassPos.x + magnetPos.x) / 2 - (11 + thickness * 8),
                    top: (compassPos.y + magnetPos.y) / 2 - 110,
                    zIndex: 15,
                    pointerEvents: 'none'
                  }}
                >
                  <MaterialBlock3D type={activeMaterial} thickness={thickness} />
                </motion.div>
              )}

              {step >= 2 && (
                <div style={{ position: 'absolute', left: compassPos.x - 120, top: compassPos.y - 120 }}>
                  <DraggableCompass rotation={needleRotation} />
                </div>
              )}

              {step >= 3 && (
                <div style={{ position: 'absolute', left: magnetPos.x - 80, top: magnetPos.y - 23 }}>
                  <DraggableMagnet isFlipped={isFlipped} onDoubleClick={flipMagnet} />
                </div>
              )}
            </div>

            {/* In-situ Feedback Alert */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#FFFFFF',
                    color: feedback.type === 'success' ? '#065F46' : '#1E3A8A',
                    padding: '0.6rem 1.4rem',
                    borderRadius: '25px',
                    border: `2px solid ${feedback.type === 'success' ? '#10B981' : '#3B82F6'}`,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    zIndex: 30
                  }}
                >
                  {feedback.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Completion Modal */}
        <AnimatePresence>
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
              }}
            >
              <motion.div
                initial={{ scale: 0.85, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '25px',
                  padding: '2.5rem',
                  maxWidth: '480px',
                  textAlign: 'center',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <Sparkles size={42} color="#D97706" />
                <h2 style={{ margin: 0, color: '#064E3B', fontSize: '1.6rem', fontWeight: 900 }}>
                  Experiment Completed! 🎉
                </h2>
                <p style={{ margin: 0, color: '#334155', fontSize: '1rem', lineHeight: 1.5, fontWeight: 600 }}>
                  You demonstrated that non-magnetic barriers like wood, glass, cardboard, and plastic do not block magnetic field lines.
                </p>
                <button
                  onClick={onNext}
                  style={{
                    padding: '0.9rem 2rem',
                    borderRadius: '30px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 6px 20px rgba(217, 119, 6, 0.4)'
                  }}
                >
                  Proceed to Concept Check <ArrowRight size={18} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <DragOverlay zIndex={2000}>
        {activeDragId === 'sidebar_compass' && <ExactCompass rotation={0} size={110} />}
        {activeDragId === 'sidebar_magnet' && <MagnetVisual isFlipped={false} isDragging={true} />}
        {activeDragId === 'compass' && <ExactCompass rotation={needleRotation} size={240} />}
        {activeDragId === 'bar_magnet' && <MagnetVisual isFlipped={isFlipped} isDragging={true} />}
      </DragOverlay>
    </DndContext>
  );
}