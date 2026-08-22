import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, RotateCcw, Info, ArrowRight, Lock, AlertCircle } from 'lucide-react';
import MagnetActivityBackground from './MagnetActivityBackground';
import { 
  DndContext, 
  useDraggable, 
  useDroppable, 
  DragOverlay, 
  PointerSensor, 
  TouchSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';

const STEPS = [
  {
    id: "carA",
    name: "Magnetic Airplane A (Left Lane)",
    instruction: "Drag Airplane A (Front: North [N], Rear: South [S]) onto the left flight corridor.",
    hint: "Place Airplane A in the left airspace lane.",
  },
  {
    id: "carB",
    name: "Magnetic Airplane B (Right Lane)",
    instruction: "Drag Airplane B (Front: North [N], Rear: South [S]) alongside Airplane A into the right flight corridor.",
    hint: "Place Airplane B in the right airspace lane.",
  }
];

function CanvasDroppable({ children }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'canvas-droppable' });
  return (
    <div 
      ref={setNodeRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: '#020617',
        border: 'none',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 10px 35px rgba(6, 78, 59, 0.15)',
        transition: 'all 0.2s ease'
      }}
    >
      {/* 3D WebGL / GLSL Infinite Animated Cloud Sea & Volumetric God Rays */}
      <MagnetActivityBackground />
      
      {/* Center Dashed Corridor Divider Beam */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        bottom: 0, 
        left: '50%', 
        width: '2px', 
        borderLeft: '2px dashed rgba(255, 255, 255, 0.65)', 
        transform: 'translateX(-50%)', 
        zIndex: 2 
      }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
}

function TrayItemCard({ step, isPlaced, isUnlocked, renderThumbnail }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `tray-${step.id}`,
    disabled: isPlaced || !isUnlocked,
    data: { source: 'tray', itemId: step.id }
  });

  const isDisabled = isPlaced || !isUnlocked;

  return (
    <div 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes}
      style={{
        opacity: isDragging ? 0.35 : 1,
        touchAction: 'none',
        width: '100%',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        gap: '0.85rem', 
        padding: '1.1rem', 
        borderRadius: '16px',
        background: isPlaced ? '#DCFCE7' : isUnlocked ? '#FFFFFF' : '#F8FAFC',
        border: `1.5px solid ${isPlaced ? '#16A34A' : isUnlocked ? '#A7F3D0' : '#E2E8F0'}`,
        color: '#1E293B',
        cursor: isDisabled ? 'not-allowed' : 'grab',
        transition: 'all 0.2s ease',
        position: 'relative',
        position: 'relative',
        fontWeight: 800,
        boxShadow: isUnlocked && !isPlaced ? '0 4px 12px rgba(6, 78, 59, 0.06)' : 'none',
        userSelect: 'none',
        boxSizing: 'border-box',
        flex: 1,
        minHeight: 0
      }}
    >
      <div style={{ 
        width: '100%', 
        flex: 1,
        minHeight: 0,
        background: '#F0FDF4', 
        border: '1.5px solid #A7F3D0', 
        borderRadius: '12px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexShrink: 0, 
        opacity: isUnlocked ? 1 : 0.4, 
        padding: '1rem', 
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: '8px', 
          left: '12px', 
          fontSize: '1.4rem', 
          fontWeight: 900, 
          color: '#065F46',
          opacity: 0.6
        }}>
          {step.id === 'carA' ? '1' : '2'}
        </div>
        {renderThumbnail(step.id)}
      </div>
      
      <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: '900', color: isPlaced ? '#065F46' : '#064E3B' }}>{step.name}</div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
          {isPlaced ? (
            <><CheckCircle2 size={18} style={{ color: '#16A34A' }} /> <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#16A34A' }}>Placed</span></>
          ) : !isUnlocked ? (
            <><Lock size={16} style={{ color: '#94A3B8' }} /> <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94A3B8' }}>Locked</span></>
          ) : (
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Drag to sky corridor</span>
          )}
        </div>
      </div>
    </div>
  );
}

function PlacedElement({ id, x, y, children }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `placed-${id}`,
    data: { source: 'placed', itemId: id }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: isDragging ? 0.35 : 1,
        touchAction: 'none',
        cursor: 'grab',
        zIndex: isDragging ? 50 : 10,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {children}
    </div>
  );
}

export default function Stage1_Build({ onComplete, onNext }) {
  const [placed, setPlaced] = useState({
    carA: false,
    carB: false
  });

  const [positions, setPositions] = useState({
    carA: { x: 190, y: 220 },
    carB: { x: 470, y: 220 }
  });

  const [activeDraggingId, setActiveDraggingId] = useState(null);
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const [success, setSuccess] = useState(false);
  const [activePopup, setActivePopup] = useState(0); // 0: carA, 1: carB, 2: observe, null: hidden

  React.useEffect(() => {
    if (placed.carA && !placed.carB) {
      setActivePopup(1);
    } else if (placed.carA && placed.carB) {
      setActivePopup(2);
    }
  }, [placed]);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 }
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 100, tolerance: 5 }
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  const isStepUnlocked = (stepId) => {
    if (stepId === "carA") return true;
    if (stepId === "carB") return placed.carA;
    return false;
  };

  const handleDragStart = (event) => {
    setActiveDraggingId(event.active.id);
  };

  const handleDragMove = (event) => {
    setDragDelta(event.delta);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDraggingId(null);
    setDragDelta({ x: 0, y: 0 });

    if (!over || over.id !== 'canvas-droppable') return;

    if (active.id.startsWith('tray-')) {
      const stepId = active.data.current?.itemId;
      if (!stepId || !isStepUnlocked(stepId)) return;

      const newPlaced = { ...placed, [stepId]: true };
      setPlaced(newPlaced);

      if (Object.values(newPlaced).every(Boolean)) {
        setSuccess(true);
      }
    } else if (active.id.startsWith('placed-')) {
      const elementId = active.data.current?.itemId;
      if (!elementId) return;

      setPositions(prev => ({
        ...prev,
        [elementId]: {
          x: Math.max(80, Math.min(650, prev[elementId].x + event.delta.x)),
          y: Math.max(80, Math.min(380, prev[elementId].y + event.delta.y))
        }
      }));
    }
  };

  const handleReset = () => {
    setPlaced({
      carA: false,
      carB: false
    });
    setPositions({
      carA: { x: 190, y: 220 },
      carB: { x: 470, y: 220 }
    });
    setSuccess(false);
    setActivePopup(0);
  };

  const renderThumbnail = (id) => {
    return (
      <img 
        src="/MagnetInteraction/real_airliner_north_south.png" 
        alt={id === "carA" ? "Airplane A" : "Airplane B"} 
        style={{ width: '100%', height: '100%', maxHeight: '120px', objectFit: 'contain' }} 
      />
    );
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <div style={{ 
        padding: '0.5rem 1rem', 
        display: 'flex', 
        flexDirection: 'column',
        gap: '0.75rem', 
        height: '100%', 
        minHeight: 0, 
        overflow: 'hidden', 
        boxSizing: 'border-box',
        background: 'transparent',
        position: 'relative'
      }}>
      
        {/* Main 2-Column Layout (Activity Area on LEFT, Components Container on RIGHT) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 440px', 
          gap: '1.25rem', 
          flex: 1, 
          height: '100%',
          minHeight: 0,
          boxSizing: 'border-box'
        }}>
          {/* LEFT Column: Full-Bleed Activity Area (Borderless) */}
          <div style={{ 
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: 0,
            overflow: 'hidden',
            borderRadius: '24px'
          }}>
            <CanvasDroppable>
              {/* Magnetic Airliner A (Fills Left Airspace Corridor) */}
              {placed.carA && (
                <PlacedElement 
                  id="carA" 
                  x="25%" 
                  y="50%"
                >
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img 
                      src="/MagnetInteraction/real_airliner_north_south.png" 
                      alt="Airplane A" 
                      style={{ 
                        width: 'clamp(320px, 36vw, 460px)', 
                        height: 'auto', 
                        objectFit: 'contain', 
                        filter: 'drop-shadow(0 22px 42px rgba(0,0,0,0.65))',
                        userSelect: 'none',
                        pointerEvents: 'none'
                      }} 
                    />
                  </div>
                </PlacedElement>
              )}

              {/* Magnetic Airliner B (Fills Right Airspace Corridor) */}
              {placed.carB && (
                <PlacedElement 
                  id="carB" 
                  x="75%" 
                  y="50%"
                >
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img 
                      src="/MagnetInteraction/real_airliner_north_south.png" 
                      alt="Airplane B" 
                      style={{ 
                        width: 'clamp(320px, 36vw, 460px)', 
                        height: 'auto', 
                        objectFit: 'contain', 
                        filter: 'drop-shadow(0 22px 42px rgba(0,0,0,0.65))',
                        userSelect: 'none',
                        pointerEvents: 'none'
                      }} 
                    />
                  </div>
                </PlacedElement>
              )}
            </CanvasDroppable>
          </div>

          <div style={{ 
            background: "#FFFFFF",
            border: "1.5px solid #A7F3D0",
            borderRadius: "20px",
            padding: "1rem 1.15rem",
            boxShadow: "0 6px 20px rgba(6, 78, 59, 0.06)",
            display: "flex", 
            flexDirection: "column", 
            minHeight: 0,
            overflowY: "hidden",
            gap: "0.75rem"
          }}>
            {/* Header Box inside right container */}
            <div style={{ 
              background: "#F0FDF4", 
              border: "1.5px solid #A7F3D0", 
              padding: "0.85rem 1rem", 
              borderRadius: "16px",
              boxShadow: "0 2px 8px rgba(6, 78, 59, 0.04)",
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 900, color: '#064E3B', lineHeight: 1.35 }}>
                ✈️ Build the Experiment: Magnetic Airplanes Setup
              </h3>
              <button 
                onClick={handleReset} 
                style={{ 
                  padding: "0.45rem 0.85rem", 
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                  color: "#FFFFFF",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 3px 10px rgba(217, 119, 6, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.82rem",
                  fontWeight: 900,
                  flexShrink: 0,
                  marginLeft: "0.5rem",
                  transition: "all 0.2s ease"
                }} 
              >
                <RotateCcw size={14} color="#FFFFFF" /> Reset
              </button>
            </div>

            {/* Flight Components List */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <h4 style={{ color: "#064E3B", margin: "0 0 0.55rem 0", fontSize: "0.95rem", fontWeight: 900, display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                📦 Flight Components
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, minHeight: 0 }}>
                {STEPS.map((step) => (
                  <TrayItemCard 
                    key={step.id} 
                    step={step} 
                    isPlaced={placed[step.id]} 
                    isUnlocked={isStepUnlocked(step.id)} 
                    renderThumbnail={renderThumbnail} 
                  />
                ))}
              </div>
            </div>

            {/* Popups handled via overlay */}

            {/* Proceed to Explore Button (Directly under Instructions) */}
            <button 
              onClick={() => {
                onComplete();
                onNext();
              }}
              disabled={!success}
              style={{ 
                width: '100%',
                padding: '0.8rem 1.25rem', 
                fontSize: '0.95rem', 
                fontWeight: 900, 
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.6rem',
                background: success 
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
                  : '#E2E8F0',
                color: success ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                cursor: success ? 'pointer' : 'not-allowed',
                boxShadow: success ? '0 4px 14px rgba(16, 185, 129, 0.35)' : 'none',
                transition: 'all 0.25s ease'
              }}
            >
              Proceed to Explore <ArrowRight size={18} color={success ? "#FFFFFF" : "#94A3B8"} />
            </button>
          </div>

        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDraggingId && activeDraggingId.startsWith('tray-') ? (
          <div style={{ opacity: 0.9, pointerEvents: "none" }}>
            <img 
              src="/MagnetInteraction/real_airliner_north_south.png" 
              alt="Dragging Airliner" 
              style={{ 
                width: 'clamp(320px, 36vw, 460px)', 
                height: 'auto', 
                objectFit: 'contain', 
                filter: 'drop-shadow(0 22px 42px rgba(0,0,0,0.75))',
                pointerEvents: 'none'
              }} 
            />
          </div>
        ) : null}
      </DragOverlay>

      {/* Instruction Popups */}
      <AnimatePresence>
        {activePopup !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(2, 6, 23, 0.65)',
              zIndex: 100,
              backdropFilter: 'blur(6px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #A7F3D0',
                borderRadius: '24px',
                padding: '2.5rem',
                maxWidth: '420px',
                boxShadow: '0 12px 40px rgba(6, 78, 59, 0.2)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.25rem'
              }}
            >
              <div style={{ width: '56px', height: '56px', background: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #A7F3D0' }}>
                <Info size={28} color="#065F46" />
              </div>
              
              <h3 style={{ margin: 0, color: '#064E3B', fontSize: '1.35rem', fontWeight: 900 }}>
                {activePopup === 0 && "Step 1: Left Airspace"}
                {activePopup === 1 && "Step 2: Right Airspace"}
                {activePopup === 2 && "Observation"}
              </h3>
              
              <p style={{ margin: 0, color: '#334155', fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.5 }}>
                {activePopup === 0 && (
                  <>Drag <strong>Airplane A</strong> from the tray into the <strong>Left flight corridor</strong>.</>
                )}
                {activePopup === 1 && (
                  <>Drag <strong>Airplane B</strong> into the <strong>Right parallel flight corridor</strong>.</>
                )}
                {activePopup === 2 && (
                  <>Observe the magnetic poles (Front: North [N], Rear: South [S]) before proceeding to test flight interactions!</>
                )}
              </p>
              
              <button
                onClick={() => setActivePopup(null)}
                style={{
                  marginTop: '0.75rem',
                  padding: '0.8rem 2.5rem',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                  transition: 'transform 0.1s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                Got it! <CheckCircle2 size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DndContext>
  );
}
